# PageSpeed-Optimierung für 100/100 Score

## Aktueller Status

✅ **Bereits optimiert:**
- Astro Static Site Generation (minimales JavaScript)
- Tailwind CSS (optimiert, unused styles entfernt)
- React Partial Hydration (nur Solarrechner lädt JS)
- Vercel CDN (globale Edge-Auslieferung)
- Cache-Headers in vercel.json konfiguriert

⚠️ **Verbesserungspotenzial:**
- Bilder sind PNG (sollten WebP/AVIF sein)
- Keine explizite Image Optimization
- Font-Loading könnte optimiert werden

---

## Ziel: PageSpeed 100/100

### Core Web Vitals Ziele

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## Optimierung 1: Bilder zu WebP konvertieren

### Warum WebP?

- **30-50% kleinere Dateigröße** als PNG/JPEG
- Moderne Browser-Unterstützung (>95%)
- Bessere Kompression bei gleicher Qualität

### Aktuelle Bilder (PNG):

```
hero-home.png         → 308 KB
battery-storage.png   → 317 KB
installation.png      → 210 KB
wallbox.png           → 181 KB
logo.png              → 40 KB
```

### Manuelle Konvertierung

**Online-Tool (einfachste Methode):**
1. Gehen Sie zu https://squoosh.app
2. Laden Sie jedes Bild hoch
3. Wählen Sie "WebP" als Format
4. Quality: 85
5. Download und ersetzen Sie Original

**Lokale Konvertierung (mit ImageMagick):**

```bash
# ImageMagick installieren (falls nicht vorhanden)
# Mac: brew install imagemagick
# Ubuntu: sudo apt install imagemagick
# Windows: https://imagemagick.org/script/download.php

# Konvertieren
cd public/images
convert hero-home.png -quality 85 hero-home.webp
convert battery-storage.png -quality 85 battery-storage.webp
convert installation.png -quality 85 installation.webp
convert wallbox.png -quality 85 wallbox.webp
```

**Erwartete Größen nach Konvertierung:**

```
hero-home.webp         → ~100 KB (67% kleiner)
battery-storage.webp   → ~105 KB (67% kleiner)
installation.webp      → ~70 KB (67% kleiner)
wallbox.webp           → ~60 KB (67% kleiner)
```

### Bilder in Astro-Komponenten aktualisieren

**Vorher:**
```astro
<img src="/images/hero-home.png" alt="Photovoltaik Leipzig" />
```

**Nachher (mit Fallback):**
```astro
<picture>
  <source srcset="/images/hero-home.webp" type="image/webp">
  <img src="/images/hero-home.png" alt="Photovoltaik Leipzig" loading="lazy" />
</picture>
```

**Oder mit Astro Image Component (empfohlen):**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero-home.png';
---

<Image 
  src={heroImage} 
  alt="Photovoltaik Leipzig" 
  format="webp"
  quality={85}
  loading="lazy"
/>
```

---

## Optimierung 2: Lazy Loading für Bilder

### Warum Lazy Loading?

- Bilder laden nur, wenn sie sichtbar werden
- Reduziert initiale Ladezeit
- Spart Bandwidth

### Implementation

**Für alle Bilder außer Hero-Bild:**

```astro
<img 
  src="/images/battery-storage.webp" 
  alt="Stromspeicher" 
  loading="lazy"
  decoding="async"
/>
```

**Hero-Bild (above-the-fold) OHNE lazy loading:**

```astro
<img 
  src="/images/hero-home.webp" 
  alt="Photovoltaik Leipzig" 
  loading="eager"
  fetchpriority="high"
/>
```

---

## Optimierung 3: Font-Loading optimieren

### Aktueller Font-Loading (Layout.astro)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Optimierte Version

```html
<!-- Preconnect für schnellere DNS-Auflösung -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font mit display=swap für sofortige Textanzeige -->
<link 
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" 
  rel="stylesheet"
>

<!-- Preload für kritische Font-Weights -->
<link 
  rel="preload" 
  href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>
```

**Änderungen:**
- Nur 3 Font-Weights laden (400, 600, 700) statt 5
- `display=swap` für sofortige Textanzeige
- Preload für kritischen Font

**Einsparung:** ~30KB, ~200ms schnellere First Contentful Paint

---

## Optimierung 4: CSS Inlining für Critical CSS

### Warum Critical CSS?

- Inline-CSS im `<head>` für above-the-fold Content
- Vermeidet Render-Blocking durch externe CSS-Dateien
- Schnellere First Contentful Paint

### Astro automatisches Inlining

Bereits aktiviert in `astro.config.mjs`:

```javascript
build: {
  inlineStylesheets: 'auto',
}
```

Astro inline automatisch kleine CSS-Dateien (< 4KB).

**Keine weitere Aktion nötig!** ✓

---

## Optimierung 5: JavaScript-Bundle optimieren

### Aktueller Status

- **Solarrechner**: React-Komponente (~50KB gzipped)
- **Restliche Seite**: Kein JavaScript (statisches HTML)

### Optimierung: Code-Splitting

Astro macht das automatisch! React-Code wird nur geladen, wenn Solarrechner sichtbar ist.

**Verifizieren:**

1. Öffnen Sie Chrome DevTools (F12)
2. Network Tab → JS Filter
3. Laden Sie Homepage
4. **Erwartung**: Nur ~50KB JavaScript für Solarrechner

**Wenn mehr JavaScript geladen wird:**

Prüfen Sie `client:load` Direktiven in Astro-Komponenten:

```astro
<!-- ❌ Lädt JavaScript sofort -->
<SolarCalculator client:load />

<!-- ✅ Lädt JavaScript nur wenn sichtbar -->
<SolarCalculator client:visible />
```

---

## Optimierung 6: Preload für kritische Ressourcen

### In Layout.astro hinzufügen

```astro
<head>
  <!-- ... existing meta tags ... -->
  
  <!-- Preload Hero-Bild -->
  <link rel="preload" as="image" href="/images/hero-home.webp" type="image/webp">
  
  <!-- Preload kritisches CSS (falls extern) -->
  <link rel="preload" as="style" href="/styles/global.css">
  
  <!-- Preload Font -->
  <link 
    rel="preload" 
    href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
</head>
```

**Effekt:** Browser lädt kritische Ressourcen parallel, nicht sequenziell.

---

## Optimierung 7: Compression (Gzip/Brotli)

### Vercel automatische Compression

Vercel komprimiert automatisch:
- **Gzip** für alle Browser
- **Brotli** für moderne Browser (~20% besser als Gzip)

**Keine Konfiguration nötig!** ✓

**Verifizieren:**

```bash
curl -H "Accept-Encoding: br" -I https://leipzig-photovoltaik.de
```

Erwartete Response-Header:
```
content-encoding: br
```

---

## Optimierung 8: Minimize Third-Party Scripts

### Aktueller Status

Prüfen Sie alle `<script>` Tags in Layout.astro:

```astro
<!-- ❌ Vermeiden: Synchrone Third-Party Scripts -->
<script src="https://example.com/analytics.js"></script>

<!-- ✅ Besser: Async oder Defer -->
<script src="https://example.com/analytics.js" async></script>
<script src="https://example.com/analytics.js" defer></script>
```

**Regel:**
- **async**: Script lädt parallel, führt sofort aus
- **defer**: Script lädt parallel, führt nach DOM aus
- **Für Analytics**: `defer` verwenden

---

## PageSpeed-Test Workflow

### Schritt 1: Baseline-Test

1. Gehen Sie zu https://pagespeed.web.dev/
2. Geben Sie ein: `https://leipzig-photovoltaik.de`
3. Klicken Sie auf "Analyze"
4. Notieren Sie Scores:
   - Mobile: ___
   - Desktop: ___

### Schritt 2: Optimierungen anwenden

Arbeiten Sie die Optimierungen in dieser Reihenfolge ab:

1. ✅ Bilder zu WebP konvertieren (größter Effekt!)
2. ✅ Lazy Loading aktivieren
3. ✅ Font-Loading optimieren
4. ✅ Preload für kritische Ressourcen
5. ✅ Third-Party Scripts überprüfen

### Schritt 3: Re-Test nach jeder Optimierung

Nach jeder Änderung:

```bash
# Lokal testen
npm run build
npm run preview

# Zu Git pushen (triggert Vercel-Deployment)
git add .
git commit -m "PageSpeed: WebP images + lazy loading"
git push

# Warten Sie 60 Sekunden für Deployment
# Dann PageSpeed-Test wiederholen
```

### Schritt 4: Ziel erreicht?

**Ziel-Scores:**
- Mobile: 90+ (100 ist schwer auf Mobile)
- Desktop: 95+ (100 ist erreichbar!)

**Wenn Ziel nicht erreicht:**

Prüfen Sie PageSpeed-Report "Opportunities":
- Largest Contentful Paint
- First Input Delay
- Cumulative Layout Shift

Fokussieren Sie auf die größten "Opportunities" (gemessen in Sekunden).

---

## Erwartete Verbesserungen

### Vor Optimierung (geschätzt)

- **Mobile**: 70-80
- **Desktop**: 85-90
- **LCP**: 3-4s
- **FID**: 50-100ms
- **CLS**: 0.05-0.1

### Nach Optimierung (Ziel)

- **Mobile**: 90-95
- **Desktop**: 95-100
- **LCP**: 1.5-2.5s
- **FID**: <50ms
- **CLS**: <0.05

### Realistische Erwartung

**Desktop 100/100 ist erreichbar!** (siehe Cox Code Beispiel)

**Mobile 100/100 ist schwer** wegen:
- Langsamere Mobilgeräte
- Langsamere Mobilnetze
- Strengere PageSpeed-Kriterien

**Mobile 90+ ist exzellent** und reicht für Top-SEO-Rankings.

---

## Monitoring nach Deployment

### Google Search Console

1. Gehen Sie zu https://search.google.com/search-console
2. Core Web Vitals Report
3. Prüfen Sie "Good URLs" (sollte 100% sein)

### Vercel Analytics (optional)

1. Vercel Dashboard → Ihr Projekt
2. Analytics Tab
3. Aktivieren Sie "Web Analytics"
4. Kostenlos im Hobby Plan!

Zeigt Real User Metrics (RUM):
- Core Web Vitals von echten Besuchern
- Geografische Verteilung
- Device-Breakdown

---

## Troubleshooting

### Problem: PageSpeed Score verbessert sich nicht

**Lösung:**
1. Leeren Sie PageSpeed-Cache: Fügen Sie `?v=2` an URL an
2. Testen Sie mit Lighthouse (Chrome DevTools)
3. Prüfen Sie, ob Vercel-Deployment erfolgreich war

### Problem: LCP zu hoch (>2.5s)

**Ursachen:**
- Hero-Bild zu groß → WebP verwenden
- Hero-Bild nicht preloaded → `<link rel="preload">` hinzufügen
- Font blockiert Rendering → `display=swap` verwenden

### Problem: CLS zu hoch (>0.1)

**Ursachen:**
- Bilder ohne `width` und `height` Attribute
- Fonts laden ohne Fallback
- Dynamischer Content verschiebt Layout

**Lösung:**
```astro
<!-- ❌ Verursacht CLS -->
<img src="/images/hero.webp" alt="Hero">

<!-- ✅ Verhindert CLS -->
<img 
  src="/images/hero.webp" 
  alt="Hero"
  width="1200"
  height="600"
  style="aspect-ratio: 2/1;"
>
```

### Problem: FID zu hoch (>100ms)

**Ursachen:**
- Zu viel JavaScript
- JavaScript blockiert Main Thread
- Synchrone Third-Party Scripts

**Lösung:**
- Verwenden Sie `client:visible` statt `client:load`
- Verschieben Sie Third-Party Scripts ans Ende
- Verwenden Sie `defer` für alle Scripts

---

## Quick Wins (30 Minuten)

**Priorität 1 (größter Effekt):**
1. ✅ Bilder zu WebP konvertieren (Squoosh.app)
2. ✅ Lazy Loading für Bilder aktivieren
3. ✅ Font-Weights reduzieren (nur 400, 600, 700)

**Priorität 2 (mittlerer Effekt):**
4. ✅ Preload für Hero-Bild
5. ✅ `client:visible` für Solarrechner
6. ✅ `display=swap` für Fonts

**Priorität 3 (kleiner Effekt):**
7. ✅ Width/Height für alle Bilder
8. ✅ Third-Party Scripts mit `defer`
9. ✅ Preload für kritische Font

---

## Zusammenfassung

**Zeitaufwand:**
- Bilder konvertieren: 15 Minuten
- Code-Änderungen: 15 Minuten
- Testing: 10 Minuten

**Gesamt: ~40 Minuten**

**Erwartete Verbesserung:**
- Desktop: 85 → 95-100
- Mobile: 75 → 90-95

**ROI:**
- Bessere SEO-Rankings
- Niedrigere Bounce Rate
- Höhere Conversion Rate
- Bessere User Experience

**Viel Erfolg! 🚀**
