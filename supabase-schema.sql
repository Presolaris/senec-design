-- Supabase Datenbank-Schema für Lead-CMS und Event-Tracking
-- Dieses SQL-Script wird automatisch ausgeführt nach Erhalt der Credentials

-- ============================================
-- 1. Exit-Popup Event-Tracking Tabelle
-- ============================================
CREATE TABLE IF NOT EXISTS exit_popup_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('popup_shown', 'popup_closed', 'popup_submitted')),
  trigger_type TEXT CHECK (trigger_type IN ('timer', 'scroll', 'mouseleave')),
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Queries
CREATE INDEX IF NOT EXISTS idx_exit_popup_events_created_at ON exit_popup_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exit_popup_events_event_type ON exit_popup_events(event_type);

-- ============================================
-- 2. Leads Tabelle (DSGVO-konform)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  source TEXT NOT NULL CHECK (source IN ('exit_popup', 'main_form', 'multi_step_form')),
  project_type TEXT CHECK (project_type IN ('privat', 'gewerbe')),
  system_size TEXT,
  message TEXT,
  
  -- DSGVO & Tracking
  double_opt_in BOOLEAN DEFAULT FALSE,
  thank_you_sent BOOLEAN DEFAULT FALSE,
  consent_given BOOLEAN DEFAULT TRUE,
  ip_address_hash TEXT, -- Anonymisiert (SHA-256)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Auto-Delete nach 2 Jahren (DSGVO)
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 years')
);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_double_opt_in ON leads(double_opt_in);

-- ============================================
-- 3. Lead-Status Tabelle (Status-Historie)
-- ============================================
CREATE TABLE IF NOT EXISTS lead_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('neu', 'kontaktiert', 'angebot_gesendet', 'gewonnen', 'verloren')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_lead_status_lead_id ON lead_status(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_status_created_at ON lead_status(created_at DESC);

-- ============================================
-- 4. Row Level Security (RLS) Policies
-- ============================================

-- Exit-Popup Events: Nur INSERT von Frontend erlaubt
ALTER TABLE exit_popup_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on exit_popup_events"
  ON exit_popup_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Leads: Nur INSERT von Frontend erlaubt
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Lead-Status: Nur INSERT von Frontend erlaubt
ALTER TABLE lead_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on lead_status"
  ON lead_status
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- 5. Automatische Datenlöschung (DSGVO)
-- ============================================

-- Function: Alte Leads automatisch löschen
CREATE OR REPLACE FUNCTION delete_expired_leads()
RETURNS void AS $$
BEGIN
  DELETE FROM leads WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Cron Job: Täglich um 2 Uhr nachts alte Leads löschen
-- (Wird in Supabase Dashboard unter Database → Cron Jobs konfiguriert)

-- ============================================
-- 6. Trigger: Updated_at automatisch aktualisieren
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Views für Analytics
-- ============================================

-- View: Conversion-Funnel
CREATE OR REPLACE VIEW conversion_funnel AS
SELECT
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'popup_shown') as popups_shown,
  COUNT(*) FILTER (WHERE event_type = 'popup_submitted') as popups_submitted,
  ROUND(
    COUNT(*) FILTER (WHERE event_type = 'popup_submitted')::NUMERIC / 
    NULLIF(COUNT(*) FILTER (WHERE event_type = 'popup_shown'), 0) * 100, 
    2
  ) as conversion_rate
FROM exit_popup_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Leads-Übersicht
CREATE OR REPLACE VIEW leads_overview AS
SELECT
  l.id,
  l.name,
  l.email,
  l.phone,
  l.source,
  l.project_type,
  l.double_opt_in,
  l.thank_you_sent,
  l.created_at,
  ls.status as current_status
FROM leads l
LEFT JOIN LATERAL (
  SELECT status
  FROM lead_status
  WHERE lead_id = l.id
  ORDER BY created_at DESC
  LIMIT 1
) ls ON true
ORDER BY l.created_at DESC;
