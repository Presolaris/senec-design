# SEO-Optimierung Solaranlage Leipzig - Phasen 2-5

## Phase 3: Content-Optimierung

### 3.1 H1-Überschrift
**Aktuell:** "Solaranlage Leipzig – Ihr Weg zur Energieunabhängigkeit"
**Neu:** "Solaranlage Leipzig kaufen | Ab 8.900€ inkl. Installation"

### 3.2 Einleitung erweitern
Aktueller Text durch folgenden ersetzen:

"Sie möchten eine Solaranlage in Leipzig kaufen? Wir bieten Ihnen Komplettlösungen ab 8.900€ inklusive Installation. Als lokaler Fachbetrieb mit über 500 realisierten Projekten in Leipzig und Umgebung begleiten wir Sie von der kostenlosen Beratung bis zur Inbetriebnahme."

### 3.3 Neue Content-Sektionen hinzufügen

**Sektion: "Unser Service für Sie"**
- Kostenlose Vor-Ort-Beratung
- Individuelle Planung & Genehmigung  
- Professionelle Installation
- Anmeldung & Inbetriebnahme
- Wartung & Service

**Gesamtdauer:** 4-6 Wochen von der Beratung bis zur Inbetriebnahme

### 3.4 FAQ-Bereich erweitern

**Neue FAQs hinzufügen:**

1. **Was kostet eine Solaranlage in Leipzig?**
   - 8.900€ - 25.000€ je nach Größe
   - Typische 10 kWp Anlage: ca. 14.900€ inkl. Installation
   - 0% MwSt. sparen aktuell 19%

2. **Lohnt sich eine Solaranlage in Leipzig?**
   - Ja, Leipzig hat >1.600 Sonnenstunden/Jahr
   - Amortisation in 8-12 Jahren
   
3. **Wie lange dauert die Installation?**
   - Installation: 1-2 Tage
   - Planung: 2-3 Wochen
   - Gesamtdauer: 4-6 Wochen

4. **Gibt es Förderungen?**
   - 0% MwSt. auf Photovoltaikanlagen
   - BAFA-Förderung für Batteriespeicher (bis 500€/kWh)
   - Einspeisevergütung nach EEG

5. **Welche Dachausrichtung ist optimal?**
   - Süd mit 30-35 Grad Neigung
   - Ost/West-Dächer: 85-90% Effizienz

## Phase 4: Bild-Optimierung

### 4.1 ALT-Tags

**Hero-Bild:**
```html
<img src="solaranlage-leipzig-hero.jpg"
     alt="Solaranlage auf Einfamilienhaus in Leipzig mit blauem Himmel"
     width="1920" height="1080"
     loading="eager">
```

**Produktbild:**
```html
<img src="solaranlage-leipzig-starter.jpg"
     alt="Solaranlage Leipzig Starter Paket - 5 kWp Photovoltaikanlage"
     width="800" height="600"
     loading="lazy">
```

**Referenzbild:**
```html
<img src="solaranlage-leipzig-referenz.jpg"
     alt="Installierte Solaranlage in Leipzig Plagwitz - 10 kWp Anlage"
     width="800" height="600"
     loading="lazy">
```

### 4.2 Bilder komprimieren
- Format: WebP (mit JPG-Fallback)
- Größe: Max. 200 KB pro Bild
- Abmessungen: Max. 1920px Breite
- Tool: https://squoosh.app/ oder https://tinypng.com/

### 4.3 Lazy Loading aktivieren
```html
<img src="bild.jpg" alt="..." loading="lazy">
```

## Phase 5: Interne Verlinkung

### 5.1 Von der Startseite verlinken
Auf der Startseite (die ja schon für "Photovoltaik Leipzig" rankt):

```html
<section class="highlight">
  <h2>Solaranlage Leipzig kaufen</h2>
  <p>
    Möchten Sie eine Solaranlage in Leipzig kaufen? Wir bieten Komplettpakete
    ab 8.900€ inklusive Installation.
  </p>
  <a href="/solaranlage-leipzig/" class="btn-primary">
    Mehr über Solaranlagen in Leipzig erfahren →
  </a>
</section>
```

**Wichtig:** Der Link-Text sollte das Ziel-Keyword enthalten!

### 5.2 Von anderen Unterseiten verlinken

**Auf /privat/:**
```html
<p>
  Für Privathaushalte in Leipzig bieten wir spezielle
  <a href="/solaranlage-leipzig/">Solaranlagen-Pakete</a> an.
</p>
```

**Auf /gewerbe/:**
```html
<p>
  Auch für Gewerbekunden installieren wir
  <a href="/solaranlage-leipzig/">Solaranlagen in Leipzig</a>.
</p>
```

**Auf /stromspeicher/:**
```html
<p>
  Kombinieren Sie Ihre <a href="/solaranlage-leipzig/">Solaranlage in Leipzig</a>
  mit einem Stromspeicher für maximale Unabhängigkeit.
</p>
```

### 5.3 Interne Links auf der Seite selbst

**In der Navigation oder Sidebar:**
```html
<nav class="subnav">
  <ul>
    <li><a href="#preise">Preise</a></li>
    <li><a href="#foerderung">Förderung</a></li>
    <li><a href="#speicher">Mit Speicher</a></li>
    <li><a href="#ablauf">Ablauf</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
</nav>
```

## Phase 6: Call-to-Actions

### 6.1 CTAs optimieren

**Aktuell:** "Kostenlose Beratung"

**Besser:**
```html
<a href="/kontakt/" class="cta-primary">
  Jetzt kostenloses Angebot in 24h erhalten →
</a>

<a href="tel:+4934198990391" class="cta-secondary">
  📞 Direkt anrufen: 0341 98 99 03 91
</a>
```

## Phase 7: Mobile-Optimierung

### 7.1 Responsive Design prüfen

**Viewport-Tag (sollte bereits vorhanden sein):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 7.2 Touch-Elemente groß genug
```css
button, .btn, a {
  min-height: 44px;
  min-width: 44px;
}
```

## Phase 8: Ladezeit-Optimierung

### 8.1 Core Web Vitals Ziele
- LCP (Largest Contentful Paint): < 2,5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0,1

**Testen:** https://pagespeed.web.dev/
