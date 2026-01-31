# Accessibility-Probleme (86/100 → Ziel: 92+)

## PageSpeed Insights Report (31.01.2026)

**Aktueller Score: 86/100**  
**Ziel: 92+**

---

## 🔴 Kritische Probleme (müssen behoben werden)

### 1. **Buttons do not have an accessible name**
**Kategorie:** NAMES AND LABELS  
**Impact:** Hoch

**Problem:**  
Buttons ohne zugängliche Namen (aria-label oder text content) sind für Screen-Reader nicht nutzbar.

**Lösung:**
```html
<!-- ❌ Schlecht -->
<button class="menu-toggle">
  <svg>...</svg>
</button>

<!-- ✅ Gut -->
<button class="menu-toggle" aria-label="Menü öffnen">
  <svg>...</svg>
</button>
```

**Betroffene Komponenten:**
- Mobile Menu Toggle
- Close-Buttons in Popups
- Icon-Only Buttons

---

### 2. **ARIA input fields do not have accessible names**
**Kategorie:** ARIA  
**Impact:** Hoch

**Problem:**  
Input-Felder mit ARIA-Attributen haben keine Labels oder aria-label.

**Lösung:**
```html
<!-- ❌ Schlecht -->
<input type="text" placeholder="Name" />

<!-- ✅ Gut -->
<label for="name">Name</label>
<input id="name" type="text" placeholder="Name" />

<!-- ✅ Alternativ -->
<input type="text" aria-label="Name" placeholder="Name" />
```

**Betroffene Komponenten:**
- SolarCalculator Input-Felder
- Kontaktformular
- Newsletter-Anmeldung

---

### 3. **Background and foreground colors do not have a sufficient contrast ratio**
**Kategorie:** CONTRAST  
**Impact:** Mittel

**Problem:**  
Einige Text-Hintergrund-Kombinationen haben zu geringen Kontrast (<4.5:1 für normalen Text, <3:1 für großen Text).

**WCAG 2.1 Level AA Anforderungen:**
- Normaler Text: **4.5:1**
- Großer Text (18pt+ oder 14pt+ bold): **3:1**

**Lösung:**
```css
/* ❌ Schlecht (Kontrast 3.2:1) */
.btn-secondary {
  color: #00b0ca; /* SENEC Turquoise */
  background: white;
}

/* ✅ Gut (Kontrast 4.6:1) */
.btn-secondary {
  color: #008fa8; /* Dunkleres Turquoise */
  background: white;
}
```

**Betroffene Elemente:**
- Türkise Buttons/Links auf weißem Hintergrund
- Graue Texte (z.B. Footer, Metadaten)
- Hero-Text über Bildern (opacity-Problem)

---

### 4. **Heading elements are not in a sequentially-descending order**
**Kategorie:** NAMES AND LABELS  
**Impact:** Niedrig

**Problem:**  
Überschriften-Hierarchie ist nicht korrekt (z.B. h1 → h3 ohne h2).

**Lösung:**
```html
<!-- ❌ Schlecht -->
<h1>Photovoltaik Leipzig</h1>
<h3>Unsere Leistungen</h3>

<!-- ✅ Gut -->
<h1>Photovoltaik Leipzig</h1>
<h2>Unsere Leistungen</h2>
```

**Betroffene Seiten:**
- Homepage (h1 → h3 Sprung)
- Blog-Artikel (inkonsistente Hierarchie)

---

## 📋 Zusammenfassung

| Problem | Impact | Aufwand | Priorität |
|---------|--------|---------|-----------|
| Buttons ohne Namen | Hoch | 10 Min | 1 |
| ARIA Input Labels | Hoch | 15 Min | 1 |
| Kontrast-Probleme | Mittel | 20 Min | 2 |
| Heading-Hierarchie | Niedrig | 10 Min | 3 |

**Gesamt-Aufwand:** 55 Minuten  
**Erwarteter Score:** 86 → 93-95

---

## 🎯 Umsetzungsplan

### Phase 1: Buttons (10 Min)
1. Header.astro: Mobile Menu Toggle
2. ExitIntentPopup.astro: Close Button
3. Alle Icon-Only Buttons mit aria-label versehen

### Phase 2: Input Labels (15 Min)
1. SolarCalculator.astro: Alle Input-Felder
2. Kontaktformular: Labels hinzufügen
3. Newsletter: aria-label

### Phase 3: Kontrast (20 Min)
1. global.css: Türkis-Farbe anpassen (#00b0ca → #008fa8)
2. Hero-Overlay: opacity erhöhen (0.4 → 0.6)
3. Footer-Texte: Grau aufhellen (#6b7280 → #4b5563)

### Phase 4: Headings (10 Min)
1. Homepage: h3 → h2
2. Blog-Artikel: Hierarchie prüfen

---

## 🔗 Quellen

- [PageSpeed Insights Report](https://pagespeed.web.dev/analysis/https-senec-design-vercel-app/ssfk0q3b8x?form_factor=mobile)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [ARIA Button Labels](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
