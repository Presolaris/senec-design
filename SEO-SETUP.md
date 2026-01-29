# SEO-Setup für leipzig-photovoltaik.de

## Bereits implementiert ✅

- ✅ **Sitemap**: Automatisch generiert bei jedem Build (`sitemap-index.xml`)
- ✅ **robots.txt**: Konfiguriert für optimales Crawling
- ✅ **Meta-Tags**: Title, Description in Layout.astro
- ✅ **Semantic HTML**: Korrekte HTML5-Struktur
- ✅ **Mobile-First**: Responsive Design mit Tailwind
- ✅ **Fast Loading**: Astro Static Site Generation
- ✅ **Clean URLs**: `/privat/` statt `/privat.html`

---

## Teil 1: Google Search Console einrichten

### Schritt 1: Property hinzufügen

1. Gehen Sie zu https://search.google.com/search-console
2. Klicken Sie auf "Property hinzufügen"
3. Wählen Sie "URL-Präfix"
4. Geben Sie ein: `https://leipzig-photovoltaik.de`
5. Klicken Sie auf "Weiter"

### Schritt 2: Domain verifizieren

**Methode 1: HTML-Tag (einfachste)**

Google zeigt einen Meta-Tag an:
```html
<meta name="google-site-verification" content="xxx...xxx" />
```

Fügen Sie diesen in `src/layouts/Layout.astro` ein:

```astro
<head>
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width" />
  
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="HIER_IHR_CODE" />
  
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <!-- ... rest ... -->
</head>
```

Dann:
1. Code zu Git pushen
2. Warten Sie auf Vercel-Deployment (~60 Sekunden)
3. In Google Search Console: Klicken Sie auf "Bestätigen"

**Methode 2: DNS TXT-Record**

Falls Sie DNS-Verifizierung bevorzugen:

1. Google zeigt TXT-Record an
2. Fügen Sie bei Ihrem Domain-Anbieter hinzu:
   ```
   Type: TXT
   Name: @
   Value: google-site-verification=xxx...xxx
   TTL: 3600
   ```
3. Warten Sie 5-60 Minuten
4. In Google Search Console: Klicken Sie auf "Bestätigen"

### Schritt 3: Sitemap einreichen

1. In Google Search Console: Gehen Sie zu "Sitemaps"
2. Geben Sie ein: `sitemap-index.xml`
3. Klicken Sie auf "Senden"

**Status prüfen:**
- "Erfolgreich": Sitemap wurde verarbeitet
- "Ausstehend": Google crawlt noch
- "Fehler": Prüfen Sie Sitemap-URL

### Schritt 4: Indexierung überwachen

**Erste Indexierung:**
- Dauer: 1-7 Tage
- Google crawlt alle 20 Seiten
- Status: Sitemaps → "Ermittelte URLs"

**Beschleunigen:**
1. Gehen Sie zu "URL-Prüfung"
2. Geben Sie ein: `https://leipzig-photovoltaik.de`
3. Klicken Sie auf "Indexierung beantragen"
4. Wiederholen Sie für wichtige Seiten:
   - `/privat/`
   - `/gewerbe/`
   - `/standorte/leipzig/`
   - `/standorte/dresden/`

---

## Teil 2: Erweiterte Meta-Tags

### Open Graph (Facebook, LinkedIn)

Fügen Sie in `Layout.astro` hinzu:

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string; // Neu
}

const { 
  title, 
  description = "Ihr Experte für Photovoltaik, Stromspeicher und Wallboxen in Leipzig und Umgebung.",
  image = "/images/og-image.jpg" // Neu
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <!-- Existing meta tags -->
  <meta charset="UTF-8" />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={`${title} | SENEC-Design`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image, Astro.site)} />
  <meta property="og:locale" content="de_DE" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={canonicalURL} />
  <meta name="twitter:title" content={`${title} | SENEC-Design`} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(image, Astro.site)} />
  
  <!-- ... rest ... -->
</head>
```

### OG-Image erstellen

Erstellen Sie ein Bild für Social Media Sharing:

**Spezifikationen:**
- Größe: 1200x630 px
- Format: JPG oder PNG
- Dateigröße: < 1 MB
- Speicherort: `public/images/og-image.jpg`

**Inhalt:**
- Logo
- Slogan: "Premium Photovoltaik für Leipzig"
- Hintergrundbild (Solaranlage)
- Call-to-Action: "Jetzt Beratung anfragen"

**Tool:** Canva (https://canva.com) - Template "Facebook Post"

---

## Teil 3: Schema.org Structured Data

### LocalBusiness Schema für Standort-Seiten

Fügen Sie in jede Standort-Seite (z.B. `src/pages/standorte/leipzig.astro`):

```astro
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Photovoltaik Leipzig" description="...">
  <!-- Existing content -->
  
  <!-- Schema.org LocalBusiness -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SENEC-Design - Photovoltaik Leipzig",
    "image": "https://leipzig-photovoltaik.de/images/logo.png",
    "@id": "https://leipzig-photovoltaik.de/standorte/leipzig/",
    "url": "https://leipzig-photovoltaik.de/standorte/leipzig/",
    "telephone": "+49-XXX-XXXXXXX",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Leipzig",
      "postalCode": "04109",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.3396955,
      "longitude": 12.3730747
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/SENEC-Design",
      "https://www.linkedin.com/company/senec-design"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 51.3396955,
        "longitude": 12.3730747
      },
      "geoRadius": "50000"
    }
  }
  </script>
</Layout>
```

**Wichtig:**
- Ersetzen Sie Telefonnummer, Adresse, Koordinaten
- Wiederholen Sie für alle 4 Standorte (Leipzig, Dresden, Halle, Nordsachsen)
- Passen Sie Geo-Koordinaten pro Standort an

**Geo-Koordinaten finden:**
1. Gehen Sie zu https://google.com/maps
2. Suchen Sie Ihre Adresse
3. Rechtsklick → "Was ist hier?"
4. Koordinaten werden angezeigt

### Product Schema für Solarrechner

Fügen Sie in `src/pages/privat.astro` (wo Solarrechner ist):

```astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Photovoltaik-Anlage für Privathaushalte",
  "description": "Hochwertige Photovoltaik-Anlagen für Einfamilienhäuser in Leipzig und Umgebung. Inklusive Planung, Installation und Wartung.",
  "brand": {
    "@type": "Brand",
    "name": "SENEC-Design"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "8000",
    "highPrice": "25000",
    "offerCount": "3",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
</script>
```

**Anpassen:**
- Preise basierend auf Ihren Angeboten
- Rating/Reviews falls vorhanden (sonst entfernen)

### Schema.org Validierung

**Testen Sie Structured Data:**
1. Gehen Sie zu https://validator.schema.org/
2. Geben Sie URL ein: `https://leipzig-photovoltaik.de/standorte/leipzig/`
3. Prüfen Sie auf Fehler

**Oder Google Rich Results Test:**
https://search.google.com/test/rich-results

---

## Teil 4: Keyword-Optimierung

### Primäre Keywords (bereits gut integriert)

✅ **Photovoltaik Leipzig** - Homepage, Standort-Seite  
✅ **Solaranlage Leipzig** - Privat-Seite  
✅ **Stromspeicher Leipzig** - Stromspeicher-Seite  
✅ **Wallbox Leipzig** - Wallbox-Seite  

### Sekundäre Keywords (optimieren)

Fügen Sie in relevante Seiten ein:

**Leipzig-spezifisch:**
- "Photovoltaik Förderung Leipzig"
- "Solaranlage Kosten Leipzig"
- "PV-Anlage Leipzig kaufen"
- "Solarteur Leipzig"

**Standort-spezifisch:**
- "Photovoltaik Dresden"
- "Solaranlage Halle"
- "PV-Anlage Nordsachsen"

### Long-Tail Keywords

Erstellen Sie Blog-Posts oder FAQ-Einträge für:

- "Was kostet eine Photovoltaik-Anlage in Leipzig?"
- "Lohnt sich Photovoltaik in Sachsen?"
- "Photovoltaik Förderung 2026 Leipzig"
- "Stromspeicher nachrüsten Leipzig"

**Wo einfügen:**
- Ratgeber-Seiten (`/ratgeber/`)
- FAQ (`/faq/`)
- Blog (falls geplant)

---

## Teil 5: Google My Business

### Schritt 1: Profil erstellen

1. Gehen Sie zu https://business.google.com
2. Klicken Sie auf "Jetzt verwalten"
3. Geben Sie Firmennamen ein: "SENEC-Design"
4. Kategorie: "Solaranlagen-Anbieter"
5. Standort: Ihre Geschäftsadresse

### Schritt 2: Verifizierung

**Methoden:**
- Postkarte (5-7 Tage)
- Telefon (sofort, falls verfügbar)
- E-Mail (falls verfügbar)

### Schritt 3: Profil optimieren

**Pflichtfelder:**
- ✅ Name: SENEC-Design
- ✅ Kategorie: Solaranlagen-Anbieter
- ✅ Adresse: Vollständige Geschäftsadresse
- ✅ Telefon: Geschäftsnummer
- ✅ Website: https://leipzig-photovoltaik.de
- ✅ Öffnungszeiten: Mo-Fr 8:00-18:00

**Optional (aber empfohlen):**
- ✅ Beschreibung (750 Zeichen max)
- ✅ Fotos (mindestens 10):
  - Logo
  - Außenansicht Büro
  - Team-Fotos
  - Referenz-Projekte (Solaranlagen)
  - Produkte (Wechselrichter, Speicher)
- ✅ Attribute:
  - "Kostenlose Beratung"
  - "Online-Termine"
  - "Kostenvoranschlag"
- ✅ Leistungen:
  - Photovoltaik-Anlagen
  - Stromspeicher
  - Wallboxen
  - Wartung & Service

### Schritt 4: Bewertungen sammeln

**Wichtig für lokales SEO!**

1. Erstellen Sie Review-Link:
   - Google My Business → "Bewertungen"
   - "Bewertungsformular teilen"
2. Senden Sie Link an zufriedene Kunden
3. Antworten Sie auf ALLE Bewertungen (positiv + negativ)

**Ziel:** 20+ Bewertungen mit 4.5+ Sternen

---

## Teil 6: Backlink-Strategie

### Lokale Verzeichnisse

Tragen Sie Ihre Website ein in:

**Pflicht (kostenlos):**
- ✅ Google My Business (siehe oben)
- ✅ Bing Places: https://www.bingplaces.com
- ✅ Apple Maps Connect: https://mapsconnect.apple.com
- ✅ Gelbe Seiten: https://www.gelbeseiten.de
- ✅ Das Örtliche: https://www.dasoertliche.de

**Branchenspezifisch:**
- ✅ Photovoltaik-Anbieter-Verzeichnisse
- ✅ Handwerker-Portale (MyHammer, etc.)
- ✅ Energie-Portale

### Content-Marketing

**Gastbeiträge:**
- Lokale Blogs über erneuerbare Energien
- Immobilien-Blogs (Solaranlage bei Hauskauf)
- Nachhaltigkeits-Blogs

**PR:**
- Pressemitteilung: "Neuer Photovoltaik-Anbieter in Leipzig"
- Lokale Zeitungen kontaktieren
- Fachmagazine (Solarenergie, Handwerk)

### Partnerschaften

**Kooperationen:**
- Elektriker (Empfehlungen)
- Dachdecker (Cross-Promotion)
- Energieberater (Affiliate-Programm)
- Immobilienmakler (Referral-Programm)

---

## Teil 7: Monitoring & Analytics

### Google Analytics (optional)

**GA4 einrichten:**

1. Gehen Sie zu https://analytics.google.com
2. Erstellen Sie Property: "leipzig-photovoltaik.de"
3. Kopieren Sie Measurement ID: `G-XXXXXXXXXX`

**In Layout.astro einfügen:**

```astro
<head>
  <!-- ... existing meta tags ... -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script is:inline>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

**Datenschutz:**
- Fügen Sie GA4 zur Datenschutzerklärung hinzu
- Cookie-Banner implementieren (falls nicht vorhanden)

### Vercel Analytics (empfohlen)

**Einfacher als GA4, DSGVO-konform:**

1. Vercel Dashboard → Ihr Projekt
2. Analytics Tab
3. "Enable Web Analytics"
4. Kostenlos im Hobby Plan!

**Vorteile:**
- Keine Cookies
- DSGVO-konform
- Core Web Vitals Tracking
- Real User Monitoring

---

## Teil 8: Lokales SEO

### NAP-Konsistenz

**NAP = Name, Address, Phone**

Stellen Sie sicher, dass NAP **identisch** ist auf:
- ✅ Website (Footer, Kontakt-Seite)
- ✅ Google My Business
- ✅ Bing Places
- ✅ Gelbe Seiten
- ✅ Das Örtliche
- ✅ Social Media Profile

**Beispiel:**
```
SENEC-Design
Musterstraße 123
04109 Leipzig
+49 341 123456
```

**Wichtig:** Keine Abweichungen! (z.B. "Str." vs "Straße")

### Lokale Keywords in Content

**Integrieren Sie Städtenamen:**

- ❌ "Wir installieren Photovoltaik-Anlagen"
- ✅ "Wir installieren Photovoltaik-Anlagen in Leipzig, Dresden, Halle und Nordsachsen"

**In jeder Seite:**
- Mindestens 1x im H1
- 2-3x im Body-Text
- 1x in Meta-Description

### Standort-Seiten optimieren

**Für jede Stadt (Leipzig, Dresden, Halle, Nordsachsen):**

1. ✅ Eigene Seite (`/standorte/leipzig/`)
2. ✅ Unique Content (nicht kopieren!)
3. ✅ Lokale Keywords
4. ✅ LocalBusiness Schema
5. ✅ Lokale Bilder (Wahrzeichen, Projekte)
6. ✅ Lokale Referenzen
7. ✅ Lokale Kontaktdaten

---

## Teil 9: Content-Strategie

### Blog/Ratgeber erweitern

**Themen-Ideen:**

**Förderung:**
- "KfW-Förderung für Photovoltaik 2026"
- "BAFA-Zuschuss für Stromspeicher"
- "Steuervorteile bei Solaranlagen"

**Kosten:**
- "Was kostet eine 10 kWp Photovoltaik-Anlage?"
- "Amortisationszeit Solaranlage berechnen"
- "Finanzierung Photovoltaik: Kredit vs. Leasing"

**Technik:**
- "Monokristallin vs. Polykristallin: Welche Module?"
- "Wechselrichter-Typen im Vergleich"
- "Stromspeicher: Lithium vs. Blei"

**Lokal:**
- "Photovoltaik in Leipzig: Lohnt sich das?"
- "Sonnenstunden in Sachsen 2025"
- "Beste Ausrichtung für Solaranlagen in Leipzig"

**Ziel:** 1 neuer Artikel pro Monat

### FAQ erweitern

**Häufige Fragen:**
- "Wie lange dauert die Installation?"
- "Brauche ich eine Baugenehmigung?"
- "Was passiert bei Stromausfall?"
- "Kann ich Überschuss-Strom verkaufen?"
- "Wie oft muss ich die Anlage warten?"

**Format:**
- Frage als H3
- Antwort 100-200 Wörter
- Interne Links zu relevanten Seiten

---

## Teil 10: Checkliste nach Go-Live

### Woche 1

- [ ] Google Search Console verifiziert
- [ ] Sitemap eingereicht
- [ ] Indexierung für Top-5 Seiten beantragt
- [ ] Google My Business erstellt
- [ ] Open Graph Tags getestet (Facebook Debugger)
- [ ] Schema.org validiert

### Woche 2-4

- [ ] Google My Business verifiziert (Postkarte)
- [ ] 10+ Fotos zu GMB hochgeladen
- [ ] Erste 5 Bewertungen gesammelt
- [ ] Lokale Verzeichnisse eingetragen (Gelbe Seiten, etc.)
- [ ] Analytics/Tracking aktiv

### Monat 2-3

- [ ] 20+ Bewertungen auf Google
- [ ] Erste Backlinks aufgebaut
- [ ] 2-3 Blog-Posts veröffentlicht
- [ ] Ranking-Tracking eingerichtet (z.B. Ahrefs, SEMrush)
- [ ] Konkurrenz-Analyse durchgeführt

### Monat 4-6

- [ ] Top 10 Ranking für "Photovoltaik Leipzig"
- [ ] Top 5 Ranking für Long-Tail Keywords
- [ ] 50+ organische Besucher/Monat
- [ ] 5+ Anfragen über Website/Monat
- [ ] Conversion-Rate optimiert

---

## Erwartete Rankings

### Realistische Zeitrahmen

**Monat 1-2:**
- Indexierung abgeschlossen
- Ranking für Brand-Keywords ("SENEC-Design")
- Ranking für Long-Tail Keywords (Position 20-50)

**Monat 3-4:**
- Ranking für primäre Keywords (Position 10-30)
- "Photovoltaik Leipzig" → Position 15-25
- "Solaranlage Leipzig" → Position 20-30

**Monat 5-6:**
- Top 10 für primäre Keywords
- "Photovoltaik Leipzig" → Position 5-10
- "Solaranlage Leipzig" → Position 10-15

**Monat 7-12:**
- Top 5 für primäre Keywords
- "Photovoltaik Leipzig" → Position 1-5
- Dominanz bei Long-Tail Keywords

**Faktoren:**
- Konkurrenz (mittel in Leipzig)
- Content-Qualität (hoch)
- Backlinks (aufbauen!)
- Bewertungen (sammeln!)
- Technische SEO (bereits optimiert ✅)

---

## Tools & Ressourcen

**Kostenlos:**
- Google Search Console (Pflicht)
- Google Analytics / Vercel Analytics
- Google My Business
- Bing Webmaster Tools
- Schema.org Validator

**Paid (optional):**
- Ahrefs ($99/Monat) - Backlink-Analyse, Ranking-Tracking
- SEMrush ($119/Monat) - Keyword-Research, Konkurrenz-Analyse
- Moz Local ($129/Jahr) - Lokale Verzeichnis-Verwaltung

**Empfehlung:** Starten Sie mit kostenlosen Tools, upgraden Sie nach 6 Monaten.

---

## Support & Weiterführende Infos

**Google SEO Starter Guide:**
https://developers.google.com/search/docs/beginner/seo-starter-guide

**Astro SEO Best Practices:**
https://docs.astro.build/en/guides/seo/

**Local SEO Checklist:**
https://moz.com/learn/seo/local

**Schema.org Documentation:**
https://schema.org/LocalBusiness

---

## Zusammenfassung

**Zeitaufwand:**
- Google Search Console: 15 Minuten
- Meta-Tags erweitern: 30 Minuten
- Schema.org implementieren: 60 Minuten
- Google My Business: 30 Minuten
- Verzeichnisse eintragen: 60 Minuten

**Gesamt: ~3 Stunden (einmalig)**

**Laufender Aufwand:**
- Bewertungen sammeln: 10 Min/Woche
- Content erstellen: 2-4 Stunden/Monat
- Monitoring: 15 Min/Woche

**ROI:**
- Organischer Traffic: 50-200 Besucher/Monat nach 6 Monaten
- Anfragen: 5-20/Monat
- Conversion-Rate: 10-20% (1-4 Kunden/Monat)

**Viel Erfolg mit Ihrem SEO! 🚀**
