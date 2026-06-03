# Google Search Console – Praxisanleitung für Photovoltaik Leipzig
### Maßgeschneidert für: leipzig-photovoltaik.de | Stand: Juni 2026

---

## Inhaltsverzeichnis

1. [Einrichtung & Verifikation](#1-einrichtung--verifikation)
2. [Sitemap einreichen](#2-sitemap-einreichen)
3. [URL-Indexierung prüfen & anfordern](#3-url-indexierung-prüfen--anfordern)
4. [Performance-Bericht: Keywords & Rankings analysieren](#4-performance-bericht-keywords--rankings-analysieren)
5. [Core Web Vitals & PageSpeed überwachen](#5-core-web-vitals--pagespeed-überwachen)
6. [Crawling-Fehler & technische Probleme beheben](#6-crawling-fehler--technische-probleme-beheben)
7. [Rich Results & Structured Data prüfen](#7-rich-results--structured-data-prüfen)
8. [Wöchentliche SEO-Routine (Checkliste)](#8-wöchentliche-seo-routine-checkliste)
9. [Wichtige Keywords für PV Leipzig – Tracking-Tabelle](#9-wichtige-keywords-für-pv-leipzig--tracking-tabelle)

---

## 1. Einrichtung & Verifikation

### Schritt 1: Domain-Property anlegen

Die Verifikationsdatei `google4c3539e1918b88a0.html` ist bereits live unter `https://leipzig-photovoltaik.de/google4c3539e1918b88a0.html`. Damit ist die Grundvoraussetzung erfüllt.

**Vorgehen in der Search Console:**

1. Öffne [search.google.com/search-console](https://search.google.com/search-console)
2. Klicke links oben auf **"Property hinzufügen"**
3. Wähle **"URL-Präfix"** (nicht Domain-Property, da die HTML-Datei-Methode genutzt wird)
4. Gib `https://leipzig-photovoltaik.de/` ein und klicke **"Weiter"**
5. Wähle **"HTML-Datei"** als Verifikationsmethode
6. Google erkennt die Datei automatisch – klicke **"Bestätigen"**

> **Empfehlung:** Lege zusätzlich eine zweite Property für `https://www.leipzig-photovoltaik.de/` an (mit www), damit beide Varianten überwacht werden, auch wenn eine davon auf die andere weiterleitet.

---

## 2. Sitemap einreichen

Die Website verfügt über eine vollständige Sitemap-Struktur mit 6 Kategorie-Sitemaps und einem Index.

### Sitemap-Index einreichen

1. Navigiere in der GSC zu **"Indexierung" → "Sitemaps"**
2. Gib im Feld "Neue Sitemap hinzufügen" folgende URL ein:

```
https://leipzig-photovoltaik.de/sitemap-index.xml
```

3. Klicke **"Senden"**

Google liest dann automatisch alle 6 Kategorie-Sitemaps ein:

| Sitemap-Datei | Inhalt |
| :--- | :--- |
| `sitemap-main.xml` | Startseite, Privat, Gewerbe, Service, Kontakt, FAQ, Blog, Standorte |
| `sitemap-products.xml` | Solaranlage Leipzig, Stromspeicher, Wallbox, Solarmanager |
| `sitemap-services.xml` | PV-Reinigung, PV-Wartung, Gewerbe-PV, Heizung |
| `sitemap-ratgeber.xml` | Alle Ratgeber-Unterseiten |
| `sitemap-blog.xml` | Alle 9 Blog-Artikel |
| `sitemap-standorte.xml` | Leipzig, Dresden, Halle, Nordsachsen und alle Unterstandorte |

> **Wichtig:** Nach dem Einreichen dauert es 1–3 Tage, bis Google alle URLs gecrawlt hat. Der Status wechselt von "Ausstehend" auf "Erfolg".

---

## 3. URL-Indexierung prüfen & anfordern

### Einzelne URLs zur Indexierung anmelden

Wenn neue Seiten live gehen oder bestehende Seiten stark überarbeitet wurden (wie die Startseite nach dem GEO/SEO-Update vom 03.06.2026), sollte Google aktiv zur Neuindexierung aufgefordert werden.

**Vorgehen:**

1. Navigiere zu **"URL-Prüfung"** (oben in der Suchleiste der GSC)
2. Gib die URL ein, z. B. `https://leipzig-photovoltaik.de/`
3. Klicke auf **"Indexierung anfordern"**
4. Google crawlt die Seite innerhalb von Minuten bis Stunden neu

**Prioritäts-URLs für sofortige Indexierungsanfrage:**

```
https://leipzig-photovoltaik.de/
https://leipzig-photovoltaik.de/solaranlage-leipzig/
https://leipzig-photovoltaik.de/stromspeicher/
https://leipzig-photovoltaik.de/wallbox/
https://leipzig-photovoltaik.de/privat/
https://leipzig-photovoltaik.de/gewerbe/
```

> **Warum jetzt wichtig:** Die Startseite wurde am 03.06.2026 mit neuen SEO-Texten, der GEO-Fakten-Tabelle und dem FAQ-Schema aktualisiert. Eine Indexierungsanfrage beschleunigt die Aufnahme dieser Änderungen in den Google-Index um mehrere Wochen.

---

## 4. Performance-Bericht: Keywords & Rankings analysieren

Der Performance-Bericht ist das wichtigste Werkzeug zur täglichen SEO-Arbeit. Hier siehst du, für welche Suchanfragen die Website erscheint, auf welcher Position und wie viele Klicks generiert werden.

### Navigation

**"Leistung" → "Suchergebnisse"**

### Wichtige Metriken verstehen

| Metrik | Bedeutung | Zielwert für PV Leipzig |
| :--- | :--- | :--- |
| **Klicks** | Nutzer, die auf dein Ergebnis geklickt haben | Wächst monatlich |
| **Impressionen** | Wie oft die Website in Suchergebnissen erschien | Zeigt Sichtbarkeit |
| **CTR (Klickrate)** | Klicks ÷ Impressionen | Ziel: >5% für Top-Keywords |
| **Position** | Durchschnittliche Ranking-Position | Ziel: <3 für Haupt-Keywords |

### Filter setzen für maximale Erkenntnisse

**Filter 1 – Nur lokale Keywords anzeigen:**
Klicke auf **"+ Neu"** → **"Abfrage"** → **"enthält"** → `Leipzig`

Damit siehst du alle Suchanfragen mit Leipzig-Bezug und kannst erkennen, welche Keywords bereits gut ranken und welche noch Potenzial haben.

**Filter 2 – Seiten mit schlechter CTR identifizieren:**
Sortiere nach **"CTR"** aufsteigend. Seiten mit hohen Impressionen aber niedriger CTR haben einen schlechten Title-Tag oder eine schlechte Meta-Description – diese sollten zuerst optimiert werden.

**Filter 3 – Keywords auf Position 4–10 finden (Quick Wins):**
Klicke auf **"+ Neu"** → **"Position"** → **"kleiner als"** → `11` und **"größer als"** → `3`

Diese Keywords stehen kurz vor Seite 1 und brauchen nur kleine Optimierungen für einen großen Sprung.

---

## 5. Core Web Vitals & PageSpeed überwachen

### Navigation

**"Nutzererfahrung" → "Core Web Vitals"**

Die Website hat aktuell **Mobile 97/100 und Desktop 99/100** auf PageSpeed Insights. Die GSC zeigt, ob diese Werte im echten Nutzerverhalten (Field Data) bestätigt werden.

### Die drei Core Web Vitals

| Metrik | Was wird gemessen | Grenzwert "Gut" |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | Ladezeit des größten sichtbaren Elements (Hero-Bild) | < 2,5 Sekunden |
| **INP** (Interaction to Next Paint) | Reaktionszeit auf Nutzereingaben (Buttons, Rechner) | < 200 Millisekunden |
| **CLS** (Cumulative Layout Shift) | Unerwartete Layout-Verschiebungen beim Laden | < 0,1 |

> **Für PV Leipzig relevant:** Das Hero-Bild (`hero-home.webp`) ist mit `fetchpriority="high"` optimiert. Sollte der LCP-Wert in der GSC trotzdem rot erscheinen, muss das Bild weiter komprimiert oder ein Preload-Link hinzugefügt werden.

### Handlungsempfehlung bei schlechten Werten

Wenn URLs als "Schlecht" oder "Verbesserungsbedürftig" markiert sind:
1. Klicke auf die betroffene URL
2. Öffne den **PageSpeed Insights-Link** direkt aus der GSC
3. Behebe die angezeigten Probleme (häufig: Bilder zu groß, JavaScript blockiert Rendering)
4. Fordere anschließend eine Neuindexierung an

---

## 6. Crawling-Fehler & technische Probleme beheben

### Navigation

**"Indexierung" → "Seiten"**

Hier siehst du, welche Seiten Google erfolgreich indexiert hat und welche Probleme aufgetreten sind.

### Häufige Fehlertypen und Lösungen

| Fehlertyp | Ursache | Lösung für PV Leipzig |
| :--- | :--- | :--- |
| **404 – Nicht gefunden** | URL existiert nicht mehr | Weiterleitung in `vercel.json` einrichten |
| **Noindex-Tag** | Seite hat `<meta name="robots" content="noindex">` | Tag aus der Seite entfernen |
| **Soft 404** | Seite liefert 200er-Status, aber leerer Inhalt | Content der Seite ergänzen |
| **Weiterleitungsfehler** | Redirect-Kette zu lang | Direkte Weiterleitung einrichten |
| **Doppelter Inhalt** | Zwei URLs mit identischem Inhalt | Canonical-Tag setzen |

### Robots.txt prüfen

Die `robots.txt` unter `https://leipzig-photovoltaik.de/robots.txt` sollte folgende Einträge enthalten:

```
User-agent: *
Allow: /
Sitemap: https://leipzig-photovoltaik.de/sitemap-index.xml
```

In der GSC kann die Robots.txt unter **"Einstellungen" → "robots.txt"** direkt geprüft werden.

---

## 7. Rich Results & Structured Data prüfen

Die Website nutzt mehrere Schema.org-Markups, die in der GSC überwacht werden können.

### Navigation

**"Verbesserungen" → (jeweiliger Schema-Typ)**

### Implementierte Schema-Typen auf PV Leipzig

| Schema-Typ | Seite | Erwartetes Rich Result |
| :--- | :--- | :--- |
| **LocalBusiness** | Alle Seiten (via LocalBusinessSchema.astro) | Knowledge Panel, Adresse in Suchergebnissen |
| **FAQPage** | Startseite (seit 03.06.2026) | Aufklappbare FAQ-Antworten unter dem Suchergebnis |
| **Product** | solaranlage-leipzig.astro | Preis, Bewertung im Suchergebnis |
| **BreadcrumbList** | Alle Seiten | Breadcrumb-Navigation im Suchergebnis |

### Rich Results testen

Bevor du Änderungen live schaltest, teste das Schema immer unter:
**[search.google.com/test/rich-results](https://search.google.com/test/rich-results)**

Gib die URL ein und prüfe, ob alle Schema-Typen fehlerfrei erkannt werden. Fehler hier bedeuten, dass das Rich Result nicht angezeigt wird.

> **Nächster Schritt:** Nach der Indexierung der aktualisierten Startseite (FAQ-Schema vom 03.06.2026) sollte unter "Verbesserungen" ein neuer Eintrag **"FAQ"** erscheinen. Klicke darauf, um zu sehen, ob Google die 4 FAQ-Fragen korrekt erkannt hat.

---

## 8. Wöchentliche SEO-Routine (Checkliste)

Eine strukturierte Wochenroutine in der GSC dauert maximal 15–20 Minuten und liefert kontinuierliche Verbesserungen.

### Montag – Performance-Check (5 Min.)

- [ ] Performance-Bericht öffnen: Zeitraum "Letzte 7 Tage" vs. "Vorherige 7 Tage" vergleichen
- [ ] Klicks und Impressionen gestiegen? Falls nein: Welche Keywords verloren?
- [ ] Top-3-Keywords nach Klicks notieren und mit Vorwoche vergleichen

### Mittwoch – Fehler & Crawling (5 Min.)

- [ ] "Seiten" → Neue Fehler seit letzter Woche?
- [ ] Core Web Vitals → Neue "Schlechte" URLs?
- [ ] URL-Prüfung für die zuletzt geänderte Seite durchführen

### Freitag – Optimierungspotenzial (10 Min.)

- [ ] Filter "Position 4–10" setzen → Quick-Win-Keywords identifizieren
- [ ] CTR unter 3% bei >100 Impressionen? → Title-Tag und Meta-Description überarbeiten
- [ ] Neue Keywords entdeckt, die noch keine eigene Seite haben? → In Content-Plan aufnehmen

---

## 9. Wichtige Keywords für PV Leipzig – Tracking-Tabelle

Nutze diese Tabelle als Referenz beim wöchentlichen Performance-Check. Trage die aktuellen Werte aus der GSC ein.

| Keyword | Ziel-URL | Aktuelles Ranking (03.06.2026) | Ziel-Ranking | Priorität |
| :--- | :--- | :---: | :---: | :---: |
| Photovoltaik Leipzig | `/` | **#1** | #1 halten | 🔴 Kritisch |
| Solaranlage Leipzig | `/solaranlage-leipzig/` | >10 | Top 5 | 🔴 Kritisch |
| PV Anlage Leipzig Kosten | `/` | #2 | #1 | 🟡 Hoch |
| Stromspeicher Leipzig | `/stromspeicher/` | #3 | #1 | 🟡 Hoch |
| Wallbox Leipzig | `/wallbox/` | #5 | #1–3 | 🟡 Hoch |
| Photovoltaik Leipzig Gewerbe | `/gewerbe/` | unbekannt | Top 5 | 🟢 Mittel |
| Solaranlage Leipzig kaufen | `/solaranlage-leipzig/` | unbekannt | Top 3 | 🟢 Mittel |
| PV Anlage Leipzig Förderung | `/ratgeber/` | unbekannt | Top 5 | 🟢 Mittel |
| Photovoltaik Leipzig Preise | `/solaranlage-leipzig/` | unbekannt | Top 5 | 🟢 Mittel |
| Wallbox Leipzig installieren | `/wallbox/` | unbekannt | Top 5 | 🟢 Mittel |

> **Tipp:** In der GSC unter "Leistung" → Filter "Abfrage enthält Leipzig" → nach Impressionen sortieren. So findest du alle Keywords, für die die Website bereits erscheint – auch solche, die noch nicht auf dem Radar sind.

---

## Anhang: Nützliche Links

| Ressource | URL |
| :--- | :--- |
| Google Search Console | [search.google.com/search-console](https://search.google.com/search-console) |
| Rich Results Test | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev) |
| Google Indexierungsstatus | [search.google.com/search-console/inspect](https://search.google.com/search-console/inspect) |
| Sitemap-Index | [leipzig-photovoltaik.de/sitemap-index.xml](https://leipzig-photovoltaik.de/sitemap-index.xml) |
| Robots.txt | [leipzig-photovoltaik.de/robots.txt](https://leipzig-photovoltaik.de/robots.txt) |

---

*Erstellt von Manus AI für das Projekt Photovoltaik Leipzig (Presolaris UG) · Juni 2026*
