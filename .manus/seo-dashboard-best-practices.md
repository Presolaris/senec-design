# SEO Dashboard Best Practices

**Datum:** 2026-02-01  
**Quellen:** siteimprove.com, tapclicks.com, fugo.ai, diggrowth.com

## Key Metrics für SEO Dashboards

### Essenzielle KPIs
1. **Keyword Rankings** - Aktuelle Position für Target-Keywords
2. **Organic Traffic** - Besucher aus organischer Suche
3. **Conversion Rate** - Anteil der Besucher die konvertieren
4. **Click-Through-Rate (CTR)** - Klickrate in SERPs
5. **Backlinks** - Anzahl und Qualität eingehender Links

### Ranking-Tracking Best Practices
- **Historische Daten:** Mindestens 90 Tage Verlauf für Trend-Analyse
- **Competitor Tracking:** Vergleich mit Top 3 Konkurrenten
- **Multi-Device:** Separate Tracking für Desktop vs. Mobile
- **Local vs. Global:** Unterscheidung nach Standort (Leipzig-spezifisch)
- **Search Engine Mix:** Google (primär), Bing, AI-Engines (ChatGPT, Perplexity)

### Dashboard-Struktur
1. **Overview Section:**
   - Gesamt-Keywords tracked
   - Durchschnittliche Position
   - Top 3 Rankings (Position 1-3)
   - Top 10 Rankings (Position 4-10)
   - Verbesserungen/Verschlechterungen (letzte 7/30 Tage)

2. **Keyword Table:**
   - Keyword
   - Current Rank
   - Previous Rank (7/30 Tage)
   - Change (↑↓→)
   - Target URL
   - Search Volume
   - Last Updated

3. **Trend Visualization:**
   - Line Chart: Ranking-Verlauf pro Keyword
   - Heatmap: Keyword-Performance-Matrix
   - Bar Chart: Rankings-Verteilung (Top 3, Top 10, Top 20, 20+)

### Datenbank-Schema (Best Practice)

```sql
-- Keywords Tabelle
CREATE TABLE keywords (
  id UUID PRIMARY KEY,
  keyword TEXT NOT NULL,
  target_url TEXT NOT NULL,
  search_volume INTEGER,
  current_rank INTEGER,
  previous_rank INTEGER,
  trend TEXT, -- 'up', 'down', 'stable'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ranking History Tabelle
CREATE TABLE keyword_rankings (
  id UUID PRIMARY KEY,
  keyword_id UUID REFERENCES keywords(id),
  rank INTEGER NOT NULL,
  search_engine TEXT DEFAULT 'google', -- 'google', 'bing', 'chatgpt'
  device TEXT DEFAULT 'desktop', -- 'desktop', 'mobile'
  location TEXT DEFAULT 'leipzig',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Optimization Recommendations Tabelle
CREATE TABLE optimization_recommendations (
  id UUID PRIMARY KEY,
  keyword_id UUID REFERENCES keywords(id),
  recommendation_type TEXT, -- 'on_page', 'content', 'technical', 'backlinks'
  recommendation TEXT NOT NULL,
  priority TEXT, -- 'high', 'medium', 'low'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'dismissed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Automation & Tracking
- **Manuelle Eingabe:** Initial für schnellen Start
- **API-Integration:** Google Search Console API (später)
- **Scheduled Updates:** Wöchentlich oder monatlich
- **Change Alerts:** Benachrichtigung bei signifikanten Ranking-Änderungen (±5 Positionen)

### Optimierungsempfehlungen (KI-basiert)

**On-Page-Faktoren:**
- Title-Tag Optimierung (Keyword am Anfang)
- Meta-Description (Keyword + CTA)
- H1-Tag (exaktes Keyword)
- Content-Länge (mindestens 1500 Wörter für Hauptseiten)
- Keyword-Dichte (1-2%)
- Internal Linking (mindestens 3 interne Links)
- Image Alt-Tags (Keyword in mindestens einem Bild)

**Content-Faktoren:**
- Unique Content (keine Duplikate)
- Aktualität (regelmäßige Updates)
- E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- User Intent Match (informational, transactional, navigational)

**Technical SEO:**
- Page Speed (Core Web Vitals)
- Mobile-Friendly
- HTTPS
- Structured Data (Schema.org)
- XML Sitemap
- Robots.txt

### Erfolgreiche Ansätze
✅ **Funktioniert:**
- Fokus auf 3-5 Key Metrics statt 20+
- Automatisierung wo möglich
- Wöchentliche Trend-Reviews
- Konkrete Handlungsempfehlungen statt nur Daten

❌ **Vermeiden:**
- Zu viele Metriken (Information Overload)
- Nur aktuelle Daten ohne Verlauf
- Fehlende Kontext-Informationen
- Keine Priorisierung der Empfehlungen
