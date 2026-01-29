# AUTOOPTIMIZE-PROMPT: PageSpeed 95-100 erreichen

## 🎯 Ziel
Mobile PageSpeed von 72 auf 95-100 verbessern durch Bildoptimierung, Responsive Images und LCP-Priorisierung.

## 📋 Kontext
- **Projekt:** SENEC-Design Photovoltaik-Website
- **URL:** https://senec-design.vercel.app/
- **Aktueller Score:** Mobile 72, Desktop 96
- **Hauptproblem:** Große PNG-Bilder (504 KiB Einsparpotenzial)
- **WebP-Dateien:** Bereits vorhanden in `/images/` Ordner
- **Framework:** Astro 5.15.9

---

## ✅ SCHRITT 1: WebP-Bilder in Komponenten einbinden (15 Min)

### Datei: `src/pages/index.astro`

**Suchen Sie diese Zeilen:**

```html
<img src="/images/hero-home.png" alt="Photovoltaik Anlage auf Hausdach" class="w-full h-full object-cover opacity-40">
```

**Ersetzen durch:**

```html
<picture>
  <source srcset="/images/hero-home.webp" type="image/webp">
  <img src="/images/hero-home.png" 
       alt="Photovoltaik Anlage auf Hausdach" 
       class="w-full h-full object-cover opacity-40"
       fetchpriority="high"
       width="1920"
       height="1080"
       loading="eager">
</picture>
```

**Wichtig:**
- `fetchpriority="high"` → Priorisiert LCP-Bild
- `width` und `height` → Verhindert Layout Shift
- `loading="eager"` → Lädt sofort (nur für Hero-Bild!)

---

### Datei: `src/pages/stromspeicher.astro`

**Suchen Sie:**

```html
<img src="/images/battery-storage.png" alt="Stromspeicher" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
```

**Ersetzen durch:**

```html
<picture>
  <source srcset="/images/battery-storage.webp" type="image/webp">
  <img src="/images/battery-storage.png" 
       alt="Stromspeicher" 
       class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
       width="1226"
       height="1143"
       loading="lazy">
</picture>
```

**Wichtig:**
- `loading="lazy"` → Lädt nur bei Bedarf (nicht Hero-Bild!)

---

### Datei: `src/pages/service.astro`

**Suchen Sie:**

```html
<img src="/images/installation.png" alt="PV Installation" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
```

**Ersetzen durch:**

```html
<picture>
  <source srcset="/images/installation.webp" type="image/webp">
  <img src="/images/installation.png" 
       alt="PV Installation" 
       class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
       width="1226"
       height="1143"
       loading="lazy">
</picture>
```

---

### Datei: `src/pages/wallbox.astro`

**Suchen Sie:**

```html
<img src="/images/wallbox.png" alt="Wallbox E-Auto" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
```

**Ersetzen durch:**

```html
<picture>
  <source srcset="/images/wallbox.webp" type="image/webp">
  <img src="/images/wallbox.png" 
       alt="Wallbox E-Auto" 
       class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
       width="1226"
       height="1143"
       loading="lazy">
</picture>
```

---

### Datei: `src/layouts/Layout.astro` (Logo im Header)

**Suchen Sie:**

```html
<img src="/images/logo.webp" alt="SENEC Logo" class="h-12 w-auto">
```

**Ersetzen durch:**

```html
<img src="/images/logo.webp" 
     alt="SENEC Logo" 
     class="h-12 w-auto"
     width="200"
     height="111"
     loading="eager">
```

**Wichtig:**
- Logo braucht kein `<picture>` (ist bereits WebP)
- Aber `width` und `height` sind wichtig!

---

### Datei: `src/components/Footer.astro` (Logo im Footer)

**Suchen Sie:**

```html
<img src="/images/logo.webp" alt="Photovoltaik Leipzig Logo" class="h-10 w-auto mb-6 bg-white p-1 rounded">
```

**Ersetzen durch:**

```html
<img src="/images/logo.webp" 
     alt="Photovoltaik Leipzig Logo" 
     class="h-10 w-auto mb-6 bg-white p-1 rounded"
     width="200"
     height="111"
     loading="lazy">
```

---

## ✅ SCHRITT 2: Build und Test (5 Min)

### Lokal testen:

```bash
cd /home/ubuntu/senec-design
npm run build
```

**Erwartete Ausgabe:**
```
✓ Completed in 10s.
20 page(s) built in 10s
Complete!
```

**Wenn Fehler auftreten:**
- Prüfen Sie Syntax (fehlende `>` oder `"`)
- Prüfen Sie ob WebP-Dateien existieren: `ls -lh public/images/*.webp`

---

## ✅ SCHRITT 3: Git Commit und Push (3 Min)

```bash
cd /home/ubuntu/senec-design
git add .
git commit -m "PageSpeed-Optimierung: WebP-Bilder, fetchpriority und width/height"
git push
```

**Vercel deployed automatisch!** (2-3 Minuten Wartezeit)

---

## ✅ SCHRITT 4: PageSpeed erneut testen (2 Min)

1. Warten Sie 3 Minuten nach Git-Push
2. Öffnen Sie: https://pagespeed.web.dev
3. Geben Sie ein: `https://senec-design.vercel.app/`
4. Klicken Sie "Analyze"

**Erwartete Ergebnisse:**
- **Mobile:** 85-92 (vorher 72) ✅
- **Desktop:** 98-100 (vorher 96) ✅

---

## 🎯 BONUS: Responsive Images (Optional, +5-8 Punkte)

Falls Mobile-Score noch unter 95 ist, fügen Sie responsive Größen hinzu:

### Beispiel für Hero-Bild:

```html
<picture>
  <source 
    srcset="/images/hero-home-640.webp 640w,
            /images/hero-home-1024.webp 1024w,
            /images/hero-home.webp 1920w"
    sizes="(max-width: 640px) 640px,
           (max-width: 1024px) 1024px,
           1920px"
    type="image/webp">
  <img src="/images/hero-home.png" 
       alt="Photovoltaik Anlage auf Hausdach" 
       class="w-full h-full object-cover opacity-40"
       fetchpriority="high"
       width="1920"
       height="1080"
       loading="eager">
</picture>
```

**Hinweis:** Dafür müssen Sie erst kleinere Versionen erstellen:

```bash
cd /home/ubuntu/senec-design/public/images
convert hero-home.webp -resize 640x hero-home-640.webp
convert hero-home.webp -resize 1024x hero-home-1024.webp
```

---

## 📊 Erwartete Verbesserungen

### Nach Schritt 1-3:
- **Mobile:** 72 → 85-92
- **LCP Mobile:** 7.1s → 3-4s
- **FCP Mobile:** 2.6s → 1.5-2s
- **Desktop:** 96 → 98-100

### Nach Bonus-Schritt:
- **Mobile:** 85-92 → 95-100
- **LCP Mobile:** 3-4s → 2-2.5s

---

## ⚠️ Troubleshooting

### Problem: "File not found: /images/xxx.webp"

**Lösung:**
```bash
cd /home/ubuntu/senec-design/public/images
ls -lh *.webp
```

Falls Dateien fehlen, konvertieren Sie PNG zu WebP:
```bash
convert battery-storage.png -quality 75 battery-storage.webp
convert hero-home.png -quality 75 hero-home.webp
convert installation.png -quality 75 installation.webp
convert wallbox.png -quality 75 wallbox.webp
```

### Problem: Build-Fehler "Unexpected token"

**Ursache:** Syntax-Fehler in HTML

**Lösung:** Prüfen Sie:
- Alle `<picture>` Tags haben schließende `</picture>`
- Alle Attribute haben schließende `"`
- Keine fehlenden `>` am Ende von Tags

### Problem: Vercel-Deployment schlägt fehl

**Lösung:**
1. Öffnen Sie Vercel Dashboard
2. Klicken Sie auf das fehlgeschlagene Deployment
3. Lesen Sie Build-Logs
4. Fixen Sie Fehler lokal
5. Pushen Sie erneut

### Problem: PageSpeed-Score verbessert sich nicht

**Mögliche Ursachen:**
1. **Vercel-Deployment noch nicht live:** Warten Sie 5 Minuten
2. **Browser-Cache:** Testen Sie im Inkognito-Modus
3. **PageSpeed-Cache:** Warten Sie 1 Stunde oder nutzen Sie andere URL-Parameter

**Lösung:**
```
https://pagespeed.web.dev/analysis?url=https://senec-design.vercel.app/&hl=de
```

---

## ✅ Checkliste

- [ ] Schritt 1: WebP in `index.astro` eingebunden
- [ ] Schritt 1: WebP in `stromspeicher.astro` eingebunden
- [ ] Schritt 1: WebP in `service.astro` eingebunden
- [ ] Schritt 1: WebP in `wallbox.astro` eingebunden
- [ ] Schritt 1: Logo-Dimensionen in `Layout.astro` gesetzt
- [ ] Schritt 1: Logo-Dimensionen in `Footer.astro` gesetzt
- [ ] Schritt 2: Build erfolgreich (keine Fehler)
- [ ] Schritt 3: Git Commit und Push erfolgreich
- [ ] Schritt 3: Vercel-Deployment erfolgreich (grüner Haken)
- [ ] Schritt 4: PageSpeed-Test durchgeführt
- [ ] Schritt 4: Mobile-Score ≥ 85
- [ ] Schritt 4: Desktop-Score ≥ 98

---

## 🎉 Erfolg!

Nach diesen Schritten sollte Ihre Website:
- **Mobile:** 85-92 PageSpeed-Score ✅
- **Desktop:** 98-100 PageSpeed-Score ✅
- **LCP:** Unter 2.5s (Mobile) ✅
- **Bildgröße:** 504 KiB kleiner ✅

**Zeitaufwand:** 25 Minuten
**Schwierigkeit:** Einfach (Copy & Paste)

---

## 📚 Weitere Optimierungen (Optional)

Falls Sie 95-100 erreichen möchten:

1. **CSS Inline:** Kritisches CSS in `<head>` inline
2. **Preconnect:** Google Fonts preconnecten
3. **Font Display:** `font-display: swap` nutzen
4. **JavaScript Defer:** Nicht-kritisches JS defer laden
5. **Service Worker:** Für Offline-Caching

**Dokumentation:** Siehe `PAGESPEED-OPTIMIERUNG.md` für Details

---

**Viel Erfolg! 🚀**

*Dieser Prompt kann direkt kopiert und Schritt für Schritt ausgeführt werden.*
