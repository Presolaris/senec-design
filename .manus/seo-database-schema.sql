-- SEO Keyword Tracking Database Schema
-- Für leipzig-photovoltaik.de
-- Datum: 2026-02-01

-- Keywords Tabelle (Haupt-Tabelle)
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  current_rank INTEGER,
  previous_rank_7d INTEGER, -- Rank vor 7 Tagen
  previous_rank_30d INTEGER, -- Rank vor 30 Tagen
  trend TEXT CHECK (trend IN ('up', 'down', 'stable', 'new')) DEFAULT 'new',
  category TEXT CHECK (category IN ('standort', 'service', 'produkt', 'ratgeber', 'blog')) DEFAULT 'standort',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ranking History Tabelle (Zeitreihen-Daten)
CREATE TABLE IF NOT EXISTS keyword_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank > 0),
  search_engine TEXT DEFAULT 'google' CHECK (search_engine IN ('google', 'bing', 'chatgpt', 'perplexity')),
  device TEXT DEFAULT 'desktop' CHECK (device IN ('desktop', 'mobile')),
  location TEXT DEFAULT 'leipzig',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(keyword_id, search_engine, device, timestamp)
);

-- Optimization Recommendations Tabelle (KI-generierte Empfehlungen)
CREATE TABLE IF NOT EXISTS optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  recommendation_type TEXT CHECK (recommendation_type IN ('on_page', 'content', 'technical', 'backlinks', 'ai_optimization')) DEFAULT 'on_page',
  recommendation TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed')) DEFAULT 'pending',
  autooptimize_prompt TEXT, -- Generierter Prompt für direkte Umsetzung
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_keywords_category ON keywords(category);
CREATE INDEX IF NOT EXISTS idx_keywords_priority ON keywords(priority);
CREATE INDEX IF NOT EXISTS idx_keywords_trend ON keywords(trend);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_keyword_id ON keyword_rankings(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_timestamp ON keyword_rankings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_optimization_recommendations_keyword_id ON optimization_recommendations(keyword_id);
CREATE INDEX IF NOT EXISTS idx_optimization_recommendations_status ON optimization_recommendations(status);

-- Trigger für updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_keywords_updated_at
BEFORE UPDATE ON keywords
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_optimization_recommendations_updated_at
BEFORE UPDATE ON optimization_recommendations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Alle können lesen (für Admin-Panel)
CREATE POLICY "Enable read access for all users" ON keywords FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON keyword_rankings FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON optimization_recommendations FOR SELECT USING (true);

-- Policy: Nur authentifizierte Nutzer können schreiben
CREATE POLICY "Enable insert for authenticated users only" ON keywords FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON keywords FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON keywords FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON keyword_rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON keyword_rankings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON keyword_rankings FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON optimization_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON optimization_recommendations FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON optimization_recommendations FOR DELETE USING (true);

-- Initiale Daten (Top 20 Keywords)
INSERT INTO keywords (keyword, target_url, category, priority, search_volume) VALUES
('Photovoltaik Leipzig', '/standorte/leipzig', 'standort', 'high', 1200),
('Solaranlage Leipzig', '/standorte/leipzig', 'standort', 'high', 800),
('PV-Anlage Leipzig', '/standorte/leipzig', 'standort', 'high', 500),
('Photovoltaik Dresden', '/standorte/dresden', 'standort', 'high', 900),
('Solaranlage Halle', '/standorte/halle', 'standort', 'high', 600),
('Photovoltaik Magdeburg', '/standorte/magdeburg', 'standort', 'high', 550),
('Solar Leipzig', '/blog/solar-leipzig', 'blog', 'high', 400),
('Photovoltaik Privat', '/privat', 'service', 'high', 700),
('Photovoltaik Gewerbe', '/gewerbe', 'service', 'high', 650),
('Stromspeicher', '/stromspeicher', 'produkt', 'high', 1500),
('Wallbox', '/wallbox', 'produkt', 'medium', 1100),
('Solarmanager', '/solarmanager', 'produkt', 'medium', 300),
('Photovoltaik Heizung', '/heizung', 'service', 'medium', 450),
('Photovoltaik Förderung 2026', '/ratgeber/foerderung', 'ratgeber', 'high', 2000),
('Photovoltaik Kosten 2026', '/ratgeber/kosten', 'ratgeber', 'high', 1800),
('Photovoltaik Wirtschaftlichkeit', '/ratgeber/wirtschaftlichkeit', 'ratgeber', 'high', 900),
('Stromspeicher Vergleich 2026', '/blog/stromspeicher-vergleich-2026', 'blog', 'medium', 800),
('Photovoltaik Wartung', '/blog/solaranlage-wartung', 'blog', 'medium', 600),
('Stromspeicher nachrüsten', '/blog/stromspeicher-nachruesten', 'blog', 'medium', 500),
('Fehler Solarkauf', '/blog/fehler-solarkauf', 'blog', 'low', 300)
ON CONFLICT (keyword) DO NOTHING;
