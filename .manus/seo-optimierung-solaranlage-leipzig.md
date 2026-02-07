# SEO-Optimierung für /solaranlage-leipzig/

Quelle: Solaranlage-Leipzig-SEO-Anleitung.pdf

## Phase 1: Technische Grundlage (Woche 1)

### 1.1 Title-Tag ändern
**Aktuell:** `Solaranlage Leipzig | Photovoltaik kaufen`
**Neu:** `Solaranlage Leipzig ⚡ Ab 8.900€ · 0% MwSt. · 500+ Anlagen`

**Warum:**
- Keyword "Solaranlage Leipzig" steht ganz vorne
- Preis (8.900€) als Clickbait im SERP
- USPs (0% MwSt., 500+ Anlagen) für höhere CTR
- Emoji ⚡ hebt sich im Suchergebnis ab

### 1.2 Meta-Description einfügen/ändern
```
Solaranlage in Leipzig kaufen ✓ Komplettpaket mit Beratung ✓ Planung & Installation ✓ Ab 8.900€ inkl. MwSt. ✓ 10 Jahre Garantie ✓ Kostenlose Beratung vor Ort!
```
Länge: 155 Zeichen (optimal)

### 1.3 Canonical Tag setzen
```html
<link rel="canonical" href="https://leipzig-photovoltaik.de/solaranlage-leipzig/">
```
**Warum:** Verhindert Duplicate Content, falls die Seite unter verschiedenen URLs erreichbar ist.

### 1.4 Open Graph Tags (für Social Sharing)
```html
<meta property="og:title" content="Solaranlage Leipzig ⚡ Ab 8.900€ | Kostenlose Beratung">
<meta property="og:description" content="Solaranlage in Leipzig kaufen ✓ Komplettpaket ✓ 10 Jahre Garantie ✓ 500+ Installationen ✓ Jetzt Angebot anfordern!">
<meta property="og:url" content="https://leipzig-photovoltaik.de/solaranlage-leipzig/">
<meta property="og:type" content="website">
<meta property="og:image" content="https://leipzig-photovoltaik.de/images/solaranlage-leipzig-og.jpg">
<meta property="og:locale" content="de_DE">
```

**Bild erstellen:**
- Größe: 1200 x 630 Pixel
- Text: "Solaranlage Leipzig – Ab 8.900€"
- Logo einfügen

## Phase 2: Schema.org Markup (Woche 1-2)

### 2.1 LocalBusiness Schema (ganz wichtig!)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Photovoltaik Leipzig",
  "description": "Ihr lokaler Fachbetrieb für Solaranlagen in Leipzig. Komplettpaket mit Beratung, Planung, Installation und Service.",
  "url": "https://leipzig-photovoltaik.de/solaranlage-leipzig/",
  "telephone": "+4934198990391",
  "email": "kontakt@leipzig-photovoltaik.de",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "An der Hebemärchten 1",
    "addressLocality": "Leipzig",
    "postalCode": "04316",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "51.3397",
    "longitude": "12.3731"
  },
  "openingHours": "Mo-Fr 08:00-18:00",
  "priceRange": "€€",
  "image": "https://leipzig-photovoltaik.de/images/logo.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  },
  "areaServed": {
    "@type": "City",
    "name": "Leipzig"
  }
}
```

### 2.2 Product Schema für die 3 Pakete
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Product",
      "name": "Solaranlage Leipzig Starter",
      "description": "Ideales Einsteigerpaket für kleine Haushalte in Leipzig",
      "offers": {
        "@type": "Offer",
        "price": "8900",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      }
    },
    {
      "@type": "Product",
      "name": "Solaranlage Leipzig Komfort",
      "description": "Optimales Paket für Einfamilienhäuser in Leipzig",
      "offers": {
        "@type": "Offer",
        "price": "14900",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      }
    },
    {
      "@type": "Product",
      "name": "Solaranlage Leipzig Premium",
      "description": "Premium-Paket mit Speicher und Wallbox für maximale Unabhängigkeit",
      "offers": {
        "@type": "Offer",
        "price": "22900",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      }
    }
  ]
}
```

### 2.3 FAQPage Schema (für Rich Snippets)
5 Fragen mit Antworten (siehe PDF Seite 4-5)

### 2.4 Breadcrumb Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://leipzig-photovoltaik.de/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Solaranlage Leipzig",
      "item": "https://leipzig-photovoltaik.de/solaranlage-leipzig/"
    }
  ]
}
```

## Phase 3: Content-Optimierung (Woche 2-3)

### 3.1 H1-Überschrift ändern
**Aktuell:** `Solaranlage Leipzig - Ihr Weg zur Energieunabhängigkeit`
**Neu:** `Solaranlage in Leipzig kaufen - Komplettpaket mit Installation`

**Warum:** "kaufen" und "Installation" sind transaktionale Keywords mit hoher Conversion-Rate.

### 3.2 Einleitung erweitern (mindestens 200 Wörter)
Text direkt nach der H1 einfügen (siehe PDF Seite 6-7)

### 3.3 Neue Content-Sektionen einfügen

**Sektion A: "Solaranlage Leipzig – Die besten Standorte"**
- Leipzig bietet mit 1.600 Sonnenstunden pro Jahr hervorragende Voraussetzungen
- Optimale Stadtteile: Plagwitz, Connewitz, Südvorstadt, Gohlis, Schleußig
- Link zu /standorte/

**Sektion B: "Solaranlage Leipzig Preise im Detail"**
- Preistabelle mit 3 Paketen (Starter, Komfort, Premium)
- Was ist im Preis enthalten?

**Sektion C: "Photovoltaik Förderung Leipzig 2026"**
- 0% Mehrwertsteuer auf Solaranlagen
- BAFA-Förderung für Batteriespeicher
- Einspeisevergütung nach EEG
- Steuerliche Vorteile

**Sektion D: "Solaranlage Leipzig mit Speicher"**
- Vorteile eines Stromspeichers
- Unser Premium-Paket mit Speicher

**Sektion E: "Der Ablauf – So installieren wir Ihre Solaranlage in Leipzig"**
- 5 Schritte: Beratung → Angebot → Planung → Installation → Inbetriebnahme

## Phase 4: Interne Verlinkung (Woche 3)

### 4.1 Links zu verwandten Seiten einfügen
- Link zu /ratgeber/kosten/
- Link zu /ratgeber/foerderung/
- Link zu /stromspeicher/
- Link zu /wallbox-leipzig/
- Link zu /standorte/

### 4.2 Anchor-Texte optimieren
- "Solaranlage Kosten" statt "Hier klicken"
- "Förderung Leipzig" statt "Mehr erfahren"

## Phase 5: Bilder-Optimierung (Woche 3-4)

### 5.1 Alt-Tags für alle Bilder
- `alt="Solaranlage Leipzig Installation auf Einfamilienhaus"`
- `alt="Photovoltaik Leipzig Preise Vergleich"`

### 5.2 Dateinamen optimieren
- `solaranlage-leipzig-installation.webp`
- `photovoltaik-leipzig-preise.webp`

### 5.3 Lazy Loading aktivieren
```html
<img loading="lazy" src="..." alt="...">
```

## Phase 6: Technische Performance (Woche 4)

### 6.1 Core Web Vitals optimieren
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### 6.2 Pagespeed verbessern
- Bilder komprimieren (WebP)
- CSS/JS minimieren
- Browser-Caching aktivieren

## Erfolgsmessung

### KPIs nach 4 Wochen:
- Google Ranking für "Solaranlage Leipzig": Platz 1-3
- Organischer Traffic: +50%
- Conversion Rate: +30%
- Rich Snippets aktiv

### Tools:
- Google Search Console
- Google Analytics
- Ahrefs/SEMrush
