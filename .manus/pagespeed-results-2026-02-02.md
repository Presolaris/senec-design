# PageSpeed Insights Ergebnisse - 02.02.2026

## Mobile Scores
- **Performance:** 73/100 (Orange)
- **Accessibility:** 89/100 (Orange)
- **Best Practices:** 96/100 (Grün)
- **SEO:** 100/100 (Grün) ✅

## Core Web Vitals
| Metrik | Wert | Status |
|--------|------|--------|
| First Contentful Paint (FCP) | 1.9s | Orange |
| Largest Contentful Paint (LCP) | 5.9s | Rot |
| Total Blocking Time (TBT) | 0ms | Grün ✅ |
| Cumulative Layout Shift (CLS) | 0 | Grün ✅ |
| Speed Index | 5.3s | Orange |

## Hauptprobleme identifiziert

### 1. Bildoptimierung (Est. savings: 224 KiB)
- `/images/hero-home.png` - 307.5 KiB → sollte WebP sein (215.8 KiB Einsparung)
- `/images/installation.webp` - könnte stärker komprimiert werden (7.8 KiB Einsparung)

### 2. Render-Blocking CSS (Est. savings: 310ms)
- `/_astro/admin.CCqcspMr.css` - 11.3 KiB blockiert das Rendering

### 3. Ungenutztes JavaScript (Est. savings: 190 KiB)
- `SolarCalculator.B6NZYcRd.js` - 130.2 KiB ungenutzt
- `supabase.BbMMbSWz.js` - 36.4 KiB ungenutzt
- `client.BVBpxyZO.js` - 23.4 KiB ungenutzt

## Positive Aspekte ✅
- SEO Score: 100/100
- CLS: 0 (keine Layout-Verschiebungen)
- TBT: 0ms (keine Blockierung)
- Server Response: 4ms (sehr schnell)
- Caching: Effizient konfiguriert
- Text-Komprimierung: Aktiviert

## Empfohlene Optimierungen
1. Hero-Bild von PNG auf WebP konvertieren
2. fetchpriority="high" für LCP-Bild hinzufügen
3. CSS inlinen oder defer
4. JavaScript Code-Splitting verbessern


---

## Desktop Scores ✅ EXCELLENT!
- **Performance:** 99/100 (Grün) ✅
- **Accessibility:** 89/100 (Orange)
- **Best Practices:** 96/100 (Grün)
- **SEO:** 100/100 (Grün) ✅

## Desktop Core Web Vitals - ALLE GRÜN! ✅
| Metrik | Wert | Status |
|--------|------|--------|
| First Contentful Paint (FCP) | 0.3s | Grün ✅ |
| Largest Contentful Paint (LCP) | 0.9s | Grün ✅ |
| Total Blocking Time (TBT) | 0ms | Grün ✅ |
| Cumulative Layout Shift (CLS) | 0 | Grün ✅ |
| Speed Index | 0.6s | Grün ✅ |

## Zusammenfassung
- **Desktop:** Exzellente Performance (99/100)
- **Mobile:** Gute Performance (73/100), LCP könnte verbessert werden
- **SEO:** Perfekt (100/100) auf beiden Geräten
- **Lazy Loading:** Funktioniert korrekt
- **WebP-Bilder:** Werden verwendet
