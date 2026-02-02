-- CTA Button Tracking Schema für Supabase
-- Erstellt: 02.02.2026
-- Zweck: Conversion-Tracking für CTA-Buttons auf Standort-Landingpages

-- Tabelle für CTA-Button-Klicks
CREATE TABLE IF NOT EXISTS cta_button_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  page_title TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_position TEXT DEFAULT 'faq_section',
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_cta_clicks_page_url ON cta_button_clicks(page_url);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_created_at ON cta_button_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_clicks_session ON cta_button_clicks(session_id);

-- Tabelle für Seitenaufrufe (für Conversion-Rate-Berechnung)
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  page_title TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

-- View für CTA-Conversion-Metriken
CREATE OR REPLACE VIEW cta_conversion_metrics AS
SELECT 
  pv.page_url,
  pv.page_title,
  COUNT(DISTINCT pv.id) AS total_page_views,
  COUNT(DISTINCT cta.id) AS total_cta_clicks,
  ROUND(
    (COUNT(DISTINCT cta.id)::NUMERIC / NULLIF(COUNT(DISTINCT pv.id), 0)) * 100, 
    2
  ) AS conversion_rate,
  DATE_TRUNC('day', pv.created_at) AS date
FROM page_views pv
LEFT JOIN cta_button_clicks cta 
  ON pv.page_url = cta.page_url 
  AND DATE_TRUNC('day', pv.created_at) = DATE_TRUNC('day', cta.created_at)
GROUP BY pv.page_url, pv.page_title, DATE_TRUNC('day', pv.created_at)
ORDER BY date DESC, total_cta_clicks DESC;

-- View für Top-performing Seiten
CREATE OR REPLACE VIEW cta_top_pages AS
SELECT 
  page_url,
  page_title,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT session_id) AS unique_sessions,
  DATE_TRUNC('day', created_at) AS date
FROM cta_button_clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_url, page_title, DATE_TRUNC('day', created_at)
ORDER BY total_clicks DESC
LIMIT 10;

-- RLS (Row Level Security) Policies
ALTER TABLE cta_button_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann Daten einfügen (für Tracking)
CREATE POLICY "Allow public insert on cta_button_clicks" 
  ON cta_button_clicks FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert on page_views" 
  ON page_views FOR INSERT 
  WITH CHECK (true);

-- Policy: Nur authentifizierte Benutzer können Daten lesen
CREATE POLICY "Allow authenticated read on cta_button_clicks" 
  ON cta_button_clicks FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated read on page_views" 
  ON page_views FOR SELECT 
  USING (true);

-- Funktion für automatische Datenlöschung nach 90 Tagen (DSGVO)
CREATE OR REPLACE FUNCTION delete_old_tracking_data()
RETURNS void AS $$
BEGIN
  DELETE FROM cta_button_clicks WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Kommentar: Diese SQL-Datei muss manuell in Supabase SQL Editor ausgeführt werden
-- URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
