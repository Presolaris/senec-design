# Schema-Markup Analyse und Implementierungsplan

## 📊 Aktuelle Situation

**Gesamt-Seiten:** 70  
**Seiten mit Schemas:** 2 (2,9%)  
**Seiten ohne Schemas:** 68 (97,1%)

### Bestehende Schemas

| Seite | Schema-Typ | Status |
|-------|-----------|--------|
| solarmanager | BreadcrumbList | ✅ Vorhanden |
| wallbox-leipzig | FAQPage | ✅ Vorhanden |

---

## 🎯 Fehlende Schema-Markups nach Seitentyp

### 1. **Hauptseiten (Priorität: HOCH)**

Seiten ohne jegliche Schemas:
- `index` (Homepage)
- `privat`
- `gewerbe`
- `stromspeicher`
- `wallbox`
- `service`
- `kontakt`
- `ueber-uns`
- `impressum`
- `datenschutz`
- `agb`

**Benötigte Schemas:**
- Organization (auf Homepage + Footer-Seiten)
- LocalBusiness (auf Standort-Seiten)
- Product (auf Produkt-Seiten)
- BreadcrumbList (auf allen Seiten)
- FAQPage (auf FAQ-Seiten)

### 2. **Blog-Seiten (Priorität: MITTEL)**

Seiten ohne Schemas:
- `blog` (Blog-Übersicht)
- `blog/fehler-solarkauf`
- `blog/neue-speicher-technologien-2026`
- `blog/photovoltaik-foerderung-2026`
- `blog/photovoltaik-kosten-2026`
- `blog/solar-leipzig`
- `blog/solaranlage-wartung`
- `blog/stromspeicher-2026-lohnt-sich`
- `blog/stromspeicher-nachruesten`
- `blog/stromspeicher-vergleich-2026`
- `blog/wartungstipps-winter`

**Benötigte Schemas:**
- BlogPosting (auf Blog-Artikeln)
- BreadcrumbList (auf allen Blog-Seiten)

### 3. **Standort-Seiten (Priorität: HOCH)**

Seiten ohne Schemas:
- `standorte/index`
- `standorte/delitzsch`
- `standorte/eilenburg`
- `standorte/markkleeberg`
- `standorte/taucha`
- `standorte/wurzen`
- `standorte/elbe-elster`
- `standorte/naumburg`
- `standorte/weissenfels`
- `standorte/photovoltaik-delitzsch`
- `standorte/photovoltaik-eilenburg`
- `standorte/photovoltaik-markkleeberg`
- `standorte/photovoltaik-taucha`
- `standorte/photovoltaik-wurzen`
- `standorte/solaranlage-kaufen-leipzig`
- `standorte/solaranlage-leipzig`
- `standorte/stromspeicher-leipzig`
- `standorte/wallbox-leipzig`

**Benötigte Schemas:**
- LocalBusiness (auf jeder Standort-Seite)
- BreadcrumbList (auf allen Seiten)
- Product (auf Produkt-Seiten)

### 4. **Ratgeber-Seiten (Priorität: MITTEL)**

Seiten ohne Schemas:
- `ratgeber/index`
- `ratgeber/foerderung`
- `ratgeber/kosten`
- `ratgeber/wirtschaftlichkeit`

**Benötigte Schemas:**
- BreadcrumbList (auf allen Seiten)
- FAQPage (auf Ratgeber-Seiten)

### 5. **Admin/Dashboard-Seiten (Priorität: NIEDRIG)**

Seiten ohne Schemas:
- `admin`
- `analytics`
- `dashboard`
- `dashboard/cta-tracking`

**Hinweis:** Diese Seiten benötigen möglicherweise keine öffentlichen Schemas.

---

## 🔧 Implementierungsplan

### Phase 1: Kritische Schemas (Priorität: HOCH)

1. **Organization Schema** - auf Homepage
   - Name: "Presolaris Unternehmensgesellschaft"
   - Logo: Logo-URL
   - Kontakt: Telefon, E-Mail, Adresse
   - Social Media Links

2. **LocalBusiness Schemas** - auf allen Standort-Seiten
   - Name: "Presolaris Leipzig" / "Presolaris [Stadt]"
   - Adresse: Vollständige Adresse
   - Telefon: +49-341-98990391
   - Öffnungszeiten
   - Bewertungen (falls vorhanden)

3. **BreadcrumbList** - auf ALLEN Seiten
   - Hierarchische Navigation
   - Strukturierte Breadcrumbs

### Phase 2: Content Schemas (Priorität: MITTEL)

4. **BlogPosting** - auf Blog-Artikeln
   - Headline
   - Description
   - Author
   - DatePublished
   - Image

5. **FAQPage** - auf FAQ- und Ratgeber-Seiten
   - Fragen und Antworten
   - Strukturierte Daten

### Phase 3: Product Schemas (Priorität: MITTEL)

6. **Product** - auf Produkt-Seiten
   - Name
   - Description
   - Price
   - Availability
   - Aggregates Rating (falls vorhanden)

---

## 📈 Erwartete SEO-Verbesserungen

| Schema-Typ | Auswirkung | Priorität |
|-----------|-----------|-----------|
| Organization | Markenvertrauen, Knowledge Panel | HOCH |
| LocalBusiness | Lokale Rankings, Google Maps | HOCH |
| BreadcrumbList | Navigation, Crawlability | HOCH |
| BlogPosting | Blog-Rankings, Featured Snippets | MITTEL |
| FAQPage | FAQ-Rich-Results, Featured Snippets | MITTEL |
| Product | E-Commerce-Snippets, Preisvergleiche | MITTEL |

---

## ✅ Validierungschecklist

Nach der Implementierung müssen folgende Punkte überprüft werden:

- [ ] Alle Schemas sind gültig (JSON-LD Syntax)
- [ ] Alle erforderlichen Felder sind vorhanden
- [ ] Keine doppelten Schemas auf einer Seite
- [ ] Google Rich Results Test zeigt keine Fehler
- [ ] Rich Snippets werden in Suchergebnissen angezeigt
- [ ] Keine Validierungswarnungen in Google Search Console

---

## 🚀 Nächste Schritte

1. **Phase 1 implementieren:** Organization + LocalBusiness + BreadcrumbList
2. **Validieren:** Google Rich Results Test durchführen
3. **Phase 2 implementieren:** BlogPosting + FAQPage
4. **Phase 3 implementieren:** Product Schemas
5. **Finale Validierung:** Alle Schemas testen
6. **Deployment:** Zu GitHub pushen und Vercel deployen

---

**Geschätzte Zeit:** 4-6 Stunden für vollständige Implementierung  
**Priorität:** HOCH - Schemas sind kritisch für SEO-Rankings
