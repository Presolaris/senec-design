# Top-Backup Performance-Analyse (97/100 Mobile)

## Commit: c8335710

**Scores:**
- Mobile: 97/100
- Desktop: 100/100
- Barrierefreiheit: 93/100
- Best Practices: 96/100
- SEO: 100/100

---

## 🔑 Performance-Tricks

### 1. System-Fonts (keine Google Fonts!)

**tailwind.config.mjs:**
```javascript
fontFamily: {
  sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
},
```

**Effekt:**
- ✅ Keine externen Font-Requests (0ms Latenz)
- ✅ CLS = 0 (kein Font-Wechsel)
- ✅ Sofortige Textanzeige

---

### 2. Layout.astro (minimal)

**Keine Google Fonts, keine externen Scripts:**
```astro
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <title>{title} | Leipzig Photovoltaik</title>
  <!-- System Fonts - keine externen Anfragen, kein CLS -->
</head>
```

**Aktuell (schlechter):**
```astro
<!-- Google Analytics (deferred for performance) -->
<script defer src="https://www.googletagmanager.com/gtag/js?id=G-08NXYDBB4F"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-08NXYDBB4F');
</script>

<!-- Google Cloud API Key für alle Services -->
<script>
  window.GOOGLE_CLOUD_API_KEY = 'AIzaSyBN7tsipQOhLK4NGI53bE3ZDwAmqmfcMuA';
</script>
```

**Problem:** Google Analytics + Google Cloud API Key laden unnötig auf Homepage!

---

### 3. Kein async-css.js Script

**Top-Backup Build-Befehl:**
```bash
astro build
```

**Aktuell (vermutlich gleich):**
```bash
npm run build  # = astro build
```

**Kein async-css.js Post-Build-Script!** (würde CLS verursachen)

---

### 4. GPU-Animationen

**Commit-Message erwähnt:**
> GPU-beschleunigte Animationen (transform statt height)

**Vermutlich in Komponenten:**
```css
/* ❌ Schlecht (CPU-Animation) */
.menu {
  transition: height 0.3s;
}

/* ✅ Gut (GPU-Animation) */
.menu {
  transition: transform 0.3s;
  will-change: transform;
}
```

---

## 📋 Änderungen für aktuellen Stand

### 1. System-Fonts aktivieren

**tailwind.config.mjs ändern:**
```javascript
fontFamily: {
  sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
},
```

### 2. Google Analytics entfernen (oder nur auf bestimmten Seiten)

**Layout.astro:**
- ❌ Google Analytics komplett entfernen (beste Performance)
- ⚠️ Oder nur auf `/kontakt`, `/danke` laden (Tracking nur wo nötig)

### 3. Google Cloud API Key nur auf Standorte-Seite

**Aktuell:** Lädt auf jeder Seite  
**Besser:** Nur in `/standorte` laden

### 4. GPU-Animationen prüfen

**Header.astro, Mobile-Menu, etc. prüfen:**
- Alle `height`-Animationen auf `transform` umstellen
- `will-change: transform` hinzufügen

---

## 🎯 Erwartetes Ergebnis

**Nach Änderungen:**
- Mobile: 74 → 95+ (Ziel: 97)
- Desktop: ? → 100
- CLS: 0 (System-Fonts)
- LCP: 5.0s → 2.5s (keine Google Fonts)

**Zeitaufwand:** 10-15 Minuten
