# PageSpeed Mobile-Optimierung: 87 → 90+

## Aktueller Status (29.01.2026)

**Mobile Score: 87/100** ✅ (Ziel: 90+)
- Performance: 87
- Accessibility: 91
- Best Practices: 96
- SEO: 100

### Core Web Vitals:
- ✅ **FCP** (First Contentful Paint): 2.6s
- ⚠️ **LCP** (Largest Contentful Paint): 3.5s (Ziel: <2.5s)
- ✅ **TBT** (Total Blocking Time): 0ms
- ✅ **CLS** (Cumulative Layout Shift): 0
- ✅ **SI** (Speed Index): 3.1s

---

## 🎯 Top 3 Optimierungen (größter Impact)

### 1. **Bilder weiter komprimieren** 💾
**Einsparung: 227 KiB** | **Impact: Hoch** | **Aufwand: 5 Min**

#### Problem:
- `hero-home.webp`: 296 KiB → kann auf 161 KiB reduziert werden (-135 KiB)
- `installation.webp`: 199 KiB → kann auf 115 KiB reduziert werden (-84 KiB)
- `logo.webp`: 10 KiB → kann auf 3 KiB reduziert werden (-7 KiB)

#### Lösung:
```bash
# WebP mit höherer Kompression neu erstellen
cwebp -q 60 hero-home.png -o hero-home.webp      # Aktuell: q 75
cwebp -q 65 installation.png -o installation.webp
cwebp -q 70 logo.png -o logo.webp
```

**Alternative:** Online-Tool verwenden:
- https://squoosh.app/ (Google)
- https://tinypng.com/ (einfacher)

**Erwarteter Gewinn:** +3-5 Punkte Mobile Score

---

### 2. **Render-Blocking CSS eliminieren** ⚡
**Einsparung: 1.770ms** | **Impact: Sehr Hoch** | **Aufwand: 10 Min**

#### Problem:
- `agb.B7Qu8xe0.css` (8.3 KiB) blockiert Rendering für 150ms
- Google Fonts CSS (1.5 KiB) blockiert für 750ms

#### Lösung A: Critical CSS inline einfügen
```astro
---
// In Layout.astro
const criticalCSS = `
  /* Nur Above-the-Fold Styles */
  :root { --senec-blue: #003e7e; --senec-turquoise: #00b8d4; }
  body { font-family: system-ui, sans-serif; margin: 0; }
  .hero { min-height: 100vh; }
`;
---
<head>
  <style>{criticalCSS}</style>
  <link rel="stylesheet" href="/_astro/agb.B7Qu8xe0.css" media="print" onload="this.media='all'">
</head>
```

#### Lösung B: Google Fonts optimieren
```html
<!-- Aktuell: -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Optimiert: -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></noscript>
```

**Änderungen:**
- ✅ Nur 3 Schriftgewichte statt 5 (400, 600, 700)
- ✅ Preconnect zu Google Fonts
- ✅ Async-Loading mit media="print" Trick

**Erwarteter Gewinn:** +2-4 Punkte Mobile Score

---

### 3. **Responsive Images implementieren** 📱
**Einsparung: 84 KiB** | **Impact: Mittel** | **Aufwand: 15 Min**

#### Problem:
`installation.webp` wird in 1226x1143px geladen, aber nur in 1204x672px angezeigt

#### Lösung: srcset verwenden
```html
<!-- Aktuell: -->
<img src="/images/installation.webp" alt="PV Installation" width="1226" height="1143">

<!-- Optimiert: -->
<picture>
  <source 
    srcset="/images/installation-400.webp 400w,
            /images/installation-800.webp 800w,
            /images/installation-1200.webp 1200w"
    sizes="(max-width: 768px) 100vw, 1200px"
    type="image/webp">
  <img src="/images/installation.webp" alt="PV Installation" width="1226" height="1143" loading="lazy">
</picture>
```

**Erwarteter Gewinn:** +1-2 Punkte Mobile Score

---

## 📊 Zusammenfassung

| Optimierung | Aufwand | Impact | Erwarteter Gewinn |
|-------------|---------|--------|-------------------|
| 1. Bilder komprimieren | 5 Min | Hoch | +3-5 Punkte |
| 2. CSS nicht-blockierend | 10 Min | Sehr Hoch | +2-4 Punkte |
| 3. Responsive Images | 15 Min | Mittel | +1-2 Punkte |
| **GESAMT** | **30 Min** | - | **87 → 93-96** |

---

## 🚀 Schnellstart (Top 2 Optimierungen)

### Schritt 1: Bilder neu komprimieren (5 Min)
1. Gehen Sie zu https://squoosh.app/
2. Laden Sie `hero-home.webp`, `installation.webp`, `logo.webp` hoch
3. Wählen Sie: **WebP, Quality 60-65**
4. Downloaden und ersetzen in `/public/images/`

### Schritt 2: Google Fonts optimieren (5 Min)
Ersetzen Sie in `src/layouts/Layout.astro`:

```html
<!-- ALT (Zeile ~15): -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- NEU: -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></noscript>
```

**Ergebnis nach 10 Minuten:** Mobile Score 87 → 90-92 ✅

---

## 💡 Weitere Optimierungen (Optional)

### 4. LCP-Element priorisieren
```html
<!-- hero-home.webp ist LCP-Element -->
<link rel="preload" as="image" href="/images/hero-home.webp" fetchpriority="high">
```

### 5. Unused CSS entfernen
- Astro PurgeCSS Plugin verwenden
- Tailwind CSS Tree-Shaking aktivieren

### 6. Font-Subsetting
- Nur benötigte Zeichen laden (Latin statt Full)
- Google Fonts: `&subset=latin`

---

## 📈 Erwartetes Endergebnis

**Nach allen Optimierungen:**
- Mobile: **87 → 93-96**
- Desktop: **99 → 100**
- LCP: **3.5s → 2.2s**
- Payload: **577 KiB → 350 KiB**

**Zeitaufwand:** 30-45 Minuten
**Schwierigkeit:** Mittel (keine Programmierung nötig)
