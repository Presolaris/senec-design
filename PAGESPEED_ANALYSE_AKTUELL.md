# PageSpeed Insights Analyse - Aktueller Stand

**Datum:** 31.01.2026, 14:40 Uhr  
**URL:** https://senec-design.vercel.app/  
**Test:** Mobile (Primary)

---

## 📊 SCORES

| Kategorie | Score | Ziel | Status |
|-----------|-------|------|--------|
| **Performance** | **62** | 98 | ❌ -36 Punkte |
| Accessibility | 86 | 92+ | ❌ -6 Punkte |
| Best Practices | 96 | 98+ | ✅ OK |
| SEO | 100 | 100 | ✅ Perfekt |

---

## ⚡ CORE WEB VITALS

| Metrik | Wert | Status | Ziel |
|--------|------|--------|------|
| **FCP** (First Contentful Paint) | 4.4s | ❌ Rot | <1.8s |
| **LCP** (Largest Contentful Paint) | 7.8s | ❌ Rot | <2.5s |
| **TBT** (Total Blocking Time) | 80ms | ✅ Grün | <200ms |
| **CLS** (Cumulative Layout Shift) | 0 | ✅ Grün | <0.1 |
| **SI** (Speed Index) | 5.8s | ❌ Orange | <3.4s |

---

## 🔴 KRITISCHE PROBLEME (Performance 62)

### 1. **Bilder nicht optimiert** (Est. 220 KiB Einsparung)
- `/images/hero-home.webp` (296.6 KiB → 135.4 KiB möglich)
  - Kompression zu niedrig
- `/images/installation.webp` (199.3 KiB → 84.2 KiB möglich)
  - Größe 1226x1143, angezeigt nur 1204x672 (Oversizing!)

### 2. **Render-Blocking CSS** (150ms Verzögerung)
- `/_astro/agb.BV4C-WeK.css` (9.1 KiB)
  - Blockiert initiales Rendering
  - Kritisches CSS sollte inline sein

### 3. **Google Maps lädt unnötig** (352 KiB + 184ms)
- Wird auf Homepage geladen, obwohl nicht sichtbar
- 173 KiB API-Script + 179 KiB weitere Maps-Dateien
- **Lösung:** Lazy Loading oder nur auf Standorte-Seite laden

### 4. **Ungenutztes JavaScript** (397 KiB Einsparung)
- Google Maps: 190.3 KiB ungenutzt
- `/astro/SolarCalculator.D8EltDSs.js`: 130.4 KiB ungenutzt
- `/astro/client.D9KyYa9T.js`: 23.4 KiB ungenutzt

### 5. **Cache-Lifetime zu kurz** (149 KiB Einsparung)
- Google Maps API: Nur 30 Minuten Cache
- Sollte: 1 Jahr für statische Ressourcen

### 6. **LCP-Element verzögert** (Element Render Delay: 2.030ms)
- Hero-Bild `/images/hero-home.webp` ist LCP-Element
- Resource Load Delay: 160ms
- Resource Load Duration: 110ms
- **Element Render Delay: 2.030ms** ← Hauptproblem!

---

## 🟡 WEITERE PROBLEME

### 7. **DOM-Größe**
- 609 Elemente (OK, aber optimierbar)
- Max Tiefe: 15 Ebenen

### 8. **3rd-Party Scripts**
- Google Tag Manager: 127 KiB + 89ms
- Google Analytics: 1 KiB

---

## ✅ OPTIMIERUNGSPLAN (Ziel: Performance 98)

### Phase 1: Bilder (Erwartung: +15 Punkte)
1. ✅ Hero-Bild komprimieren (296 KiB → 150 KiB)
2. ✅ Installation-Bild responsive (1226x1143 → 1204x672)
3. ✅ Alle Bilder auf Quality 80-85 setzen
4. ✅ Lazy Loading für Below-the-Fold Bilder

### Phase 2: JavaScript (Erwartung: +12 Punkte)
5. ✅ Google Maps nur auf /standorte laden (nicht Homepage)
6. ✅ SolarCalculator lazy laden
7. ✅ Code-Splitting für große Bundles

### Phase 3: CSS (Erwartung: +5 Punkte)
8. ✅ Kritisches CSS inline
9. ✅ Nicht-kritisches CSS defer

### Phase 4: Caching (Erwartung: +4 Punkte)
10. ✅ Cache-Headers für statische Assets (1 Jahr)
11. ✅ Vercel-Config optimieren

### Phase 5: LCP-Optimierung (Erwartung: +6 Punkte)
12. ✅ Hero-Bild preload
13. ✅ fetchpriority="high" (bereits gesetzt)
14. ✅ Element Render Delay reduzieren (CSS-Blocking entfernen)

---

## 🎯 ERWARTETE VERBESSERUNG

- **Aktuell:** Performance 62
- **Nach Optimierung:** Performance 98+ (Ziel erreicht)
- **Zeitersparnis LCP:** 7.8s → ~2.0s (5.8s schneller!)

---

## 📝 NÄCHSTE SCHRITTE

1. Bilder komprimieren und responsive machen
2. Google Maps von Homepage entfernen
3. Kritisches CSS inline + defer nicht-kritisches CSS
4. Cache-Headers konfigurieren
5. PageSpeed erneut testen
