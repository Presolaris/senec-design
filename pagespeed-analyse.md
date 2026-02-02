# PageSpeed Insights Analyse - leipzig-photovoltaik.de (Mobile)

## Aktuelle Scores (02.02.2026)

| Metrik | Score | Status |
|--------|-------|--------|
| **Performance** | 87 | 🟠 Verbesserungsbedürftig |
| **Accessibility** | 89 | 🟠 Verbesserungsbedürftig (Ziel: 92) |
| **Best Practices** | 96 | 🟢 Gut |
| **SEO** | 100 | 🟢 Perfekt |

## Core Web Vitals

| Metrik | Wert | Status |
|--------|------|--------|
| **FCP** (First Contentful Paint) | 0.9s | 🟢 Gut |
| **LCP** (Largest Contentful Paint) | 4.1s | 🔴 Schlecht (Ziel: <2.5s) |
| **TBT** (Total Blocking Time) | 30ms | 🟢 Gut |
| **CLS** (Cumulative Layout Shift) | 0 | 🟢 Perfekt |
| **SI** (Speed Index) | 2.4s | 🟢 Gut |

## Hauptprobleme

### 1. LCP zu hoch (4.1s) - KRITISCH
**Ursache:** Hero-Bild `/images/hero-home.png` (307.5 KiB)
**Lösung:**
- [ ] Bild in WebP konvertieren (Einsparung: ~220 KiB)
- [ ] `fetchpriority="high"` hinzufügen
- [ ] Bildgröße optimieren

### 2. Unused JavaScript (190 KiB)
**Dateien:**
- `SolarCalculator.B6NZYcRd.js` - 130.2 KiB unused
- `supabase.BbMMbSWz.js` - 36.4 KiB unused
- `client.BVBpxyZO.js` - 23.4 KiB unused

**Lösung:**
- [ ] Code-Splitting implementieren
- [ ] Lazy Loading für SolarCalculator

### 3. Render-Blocking CSS
**Datei:** `/_astro/admin.BHyiGL32.css` (11.3 KiB, 190ms Verzögerung)
**Lösung:**
- [ ] Critical CSS inline
- [ ] Non-critical CSS async laden

### 4. Long Main-Thread Tasks
- 2 lange Tasks gefunden (72ms, 55ms)
- Hauptverursacher: SolarCalculator.B6NZYcRd.js

## Optimierungsplan

1. **Hero-Bild optimieren** (höchste Priorität)
   - WebP-Version erstellen
   - fetchpriority="high" setzen
   - Responsive srcset implementieren

2. **JavaScript optimieren**
   - SolarCalculator lazy laden
   - Supabase nur bei Bedarf laden

3. **CSS optimieren**
   - Critical CSS extrahieren
   - Admin CSS nur auf Admin-Seiten laden

## Zielwerte
- Performance: ≥92
- Accessibility: ≥92
- LCP: <2.5s
