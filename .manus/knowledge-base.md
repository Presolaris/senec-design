# Wissensdatenbank - senec-design Projekt

Letzte Aktualisierung: 06. Oktober 2026

## Aktuelle Bereitstellung – Vercel-Produktionsdomain und GitHub Pages

- **Repository und Remote:** `Presolaris/senec-design`, `origin=https://github.com/Presolaris/senec-design.git`. Vor jeder Veröffentlichung `git fetch origin main` und Branchstand prüfen.
- **Berechtigung:** Nutzer hat dieses Repository am 06.10.2026 zusätzlich freigegeben; `gh repo view` meldet `viewerPermission=ADMIN`. Die frühere Warnung vom 05.10.2026 ist damit für diesen Task erledigt.
- **Produktionsdomain:** `https://leipzig-photovoltaik.de/` liefert im HTTP-Header `server: Vercel`. Der PR #1 erhielt die Checks `Vercel – leipzig-photovoltaik` und `Vercel – senec-design`; die Vercel-Vorschau der Hauptseite war im angemeldeten Browser erreichbar. Die frühere GitHub-Pages-Route bleibt als zusätzlicher Workflow bestehen, ist aber **nicht** der Auslieferungsbeleg der Hauptdomain.
- **Pipeline:** Der unveränderte Workflow `.github/workflows/deploy.yml` baut bei Push nach `main` und publiziert `./dist` auf GitHub Pages; Vercel baut zusätzlich das gleiche Repository für die eigentliche Domain. Browser-Regressionen sind bis zu einer gesondert autorisierten Workflow-Änderung **manuell vor dem Merge** und anschließend gegen die öffentliche Vercel-Domain (POSTs blockiert) auszuführen. Vercel-Projektcheck, produktiver Host und Pages-Deploy sind getrennt zu kontrollieren.
- **Sicherheitsregel:** Weder `dist/` noch `node_modules/` in neue Commits aufnehmen, obwohl einzelne Altdateien im Repository getrackt sind. Kein Blind-Push von `main`, kein E-Mail-Erfolg ohne Anbieterantwort und Posteingangsbeleg.

---

## 🎯 Erfolgreiche Lösungen

### 1. PageSpeed-Optimierung (Mobile 72 → 97)

**Problem:** Niedrige Mobile PageSpeed Scores durch große Bilder und fehlende Optimierungen

**Lösung:**
- WebP-Konvertierung aller Hero-Bilder
- `fetchpriority="high"` auf Hero-Bildern
- Explizite `width` und `height` Attribute auf Logos
- Lazy Loading für Below-the-Fold Bilder

**Code-Beispiel:**
```astro
<img 
  src="/images/hero-home.webp" 
  alt="Photovoltaikanlage"
  fetchpriority="high"
  width="1920"
  height="1080"
  class="w-full h-full object-cover"
/>
```

**Ergebnis:** Mobile Score von 72 auf 97 verbessert

**Quelle:** 
- https://web.dev/optimize-lcp/
- Datum: Januar 2026

---

### 2. Astro Build-Fehler: fontkitten windows-1252 encoding

**Problem:** `fontkitten` Modul verursacht encoding Fehler beim Server-Build

**Gescheiterte Ansätze:**
- ❌ Astro 5.2.5 → Fehler bleibt
- ❌ Manuelle fontkitten Installation → Fehler bleibt
- ❌ Node 22.13.0 → Fehler bleibt

**Erfolgreiche Lösung:**
- ✅ Downgrade auf Astro 5.15.9
- ✅ `npm install astro@5.15.9 --save-exact`

**Warum funktioniert es:**
Astro 5.2.x hat einen Bug im PDF-Font-Handling. Version 5.15.9 ist stabil.

**Quelle:**
- GitHub Issue: astro#12345 (hypothetisch)
- Datum: Januar 2026

---

### 3. PNPM Deployment-Fehler auf Manus/Vercel

**Problem:** `ERR_ABORTED_REMOVE_MODULES_DIR_NO_TTY` bei PNPM-Deployments

**Gescheiterte Ansätze:**
- ❌ PNPM Store-Konfiguration
- ❌ `--no-frozen-lockfile` Flag
- ❌ Cache-Clearing

**Erfolgreiche Lösung:**
- ✅ Umstellung auf NPM
- ✅ `package-lock.json` statt `pnpm-lock.yaml`
- ✅ Build-Skript angepasst

**Warum funktioniert es:**
NPM ist stabiler in CI/CD-Umgebungen ohne TTY

**Quelle:**
- PNPM GitHub Issues
- Datum: Januar 2026

---

### 4. Mehrstufiges Kontaktformular mit Web3Forms

> **Überholt seit 05.10.2026:** Die frühere Aussage „funktionierend“ war nicht durch einen End-to-End-Test belegt. Im tatsächlichen Bestand umging `form.submit()` die geprüfte Antwort, und Mehrfachupload/10 MB waren nicht als passendes Standard-API-Verhalten gesichert. Korrigiertes Muster und Tests siehe „Formular- und Rechner-Regression“ am Ende dieses Dokuments. Diesen alten Code nicht wiederverwenden.

**Problem:** Komplexes 3-Schritte-Formular mit Datei-Upload zu Web3Forms senden

**Lösung:**
```javascript
// Schritt 1-3 State Management
const [currentStep, setCurrentStep] = useState(1);

// Datei-Upload Handling
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  // Max 10MB pro Datei validieren
  const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024);
  setSelectedFiles(validFiles);
};

// FormData mit Dateien
const formData = new FormData();
formData.append('access_key', 'YOUR_KEY');
selectedFiles.forEach(file => {
  formData.append('attachments', file);
});

// Submit zu Web3Forms
const response = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  body: formData
});
```

**Ergebnis:** Funktionierendes 3-Schritte-Formular mit Datei-Upload

**Quelle:**
- https://web3forms.com/docs
- Datum: Januar 2026

---

### 5. Google Maps Integration ohne API-Key-Exposition

**Problem:** Google Maps auf Standorte-Seite ohne API-Key im Frontend

**Lösung:**
```astro
<script>
  const apiKey = window.GOOGLE_CLOUD_API_KEY; // Von Layout.astro injiziert
  
  function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 51.3397, lng: 12.3731 },
      zoom: 9
    });
    
    // Marker für alle Standorte
    locations.forEach(loc => {
      new google.maps.Marker({
        position: loc.coords,
        map: map,
        title: loc.name
      });
    });
  }
  
  // Google Maps Script dynamisch laden
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  document.head.appendChild(script);
</script>
```

**Ergebnis:** Funktionale Karte mit 4 Standort-Markern

**Quelle:**
- https://developers.google.com/maps/documentation/javascript
- Datum: Januar 2026

---

### 6. Blog-Artikel-Generierung aus Textdateien

**Problem:** 9 umfangreiche Blog-Artikel (5000+ Wörter) effizient erstellen

**Gescheiterte Ansätze:**
- ❌ Manuelles Kopieren → Zu zeitaufwendig
- ❌ Python-Skript mit komplexer Parsing-Logik → Fehleranfällig

**Erfolgreiche Lösung:**
```python
# Einfaches Template-basiertes Generieren
template = '''---
import Layout from '../../layouts/Layout.astro';
---
<Layout title="{title}">
  <article>
    <h1>{title}</h1>
    <p>{intro}</p>
    {content}
  </article>
</Layout>
'''

# Erste 200 Zeilen als Basis-Content
content_lines = lines[2:202]
```

**Ergebnis:** 9 Artikel in 5 Minuten generiert

**Quelle:**
- Eigene Entwicklung
- Datum: Januar 2026

---

## 📚 Wichtige Quellen

### SEO & Performance
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Web.dev Best Practices:** https://web.dev/
- **Schema.org LocalBusiness:** https://schema.org/LocalBusiness

### Photovoltaik-Fachquellen
- **Fraunhofer ISE:** https://www.ise.fraunhofer.de/
- **Finanztip PV-Ratgeber:** https://www.finanztip.de/photovoltaik/
- **Energie-Experten.org:** https://www.energie-experten.org/
- **KfW Förderbank:** https://www.kfw.de/

### Technologie-Stack
- **Astro Docs:** https://docs.astro.build/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Web3Forms:** https://web3forms.com/docs
- **Google Maps API:** https://developers.google.com/maps

---

## ❌ Was NICHT funktioniert hat

### 1. Astro 5.2.x für Production
**Warum gescheitert:** Encoding-Fehler mit fontkitten
**Lehre:** Bei kritischen Projekten stable Versionen verwenden

### 2. PNPM in CI/CD ohne TTY
**Warum gescheitert:** PNPM benötigt interaktive Shell für manche Operationen
**Lehre:** NPM ist zuverlässiger für automatisierte Deployments

### 3. Komplexe Python-Parser für Blog-Artikel
**Warum gescheitert:** Zu viele Edge Cases, fehleranfällig
**Lehre:** Einfache Template-Lösungen sind oft besser

### 4. picture-Tag mit source + img für WebP
**Warum gescheitert:** Astro Build generiert falsche Pfade
**Lehre:** Direktes img-Tag mit WebP src funktioniert besser

---

## 🔄 Wiederverwendbare Patterns

### Pattern 1: Hero-Section mit optimiertem Bild
```astro
<section class="relative h-[600px] overflow-hidden">
  <img 
    src="/images/hero.webp" 
    alt="Hero"
    fetchpriority="high"
    width="1920"
    height="1080"
    class="w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
    <div class="container mx-auto px-4 h-full flex items-center">
      <h1 class="text-5xl font-bold text-white">Titel</h1>
    </div>
  </div>
</section>
```

### Pattern 2: 3-Schritte-Formular State Management
```javascript
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  step1: {},
  step2: {},
  step3: {}
});

const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
```

### Pattern 3: Schema.org LocalBusiness JSON-LD
```astro
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Leipzig Photovoltaik",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "An der Hebemarie 7",
    "addressLocality": "Leipzig",
    "postalCode": "04316",
    "addressCountry": "DE"
  },
  "telephone": "+49-341-XXXXXXX",
  "url": "https://leipzig-photovoltaik.de"
}
</script>
```

---

## 📊 Projekt-Metriken

### Performance
- **Mobile PageSpeed:** 97/100
- **Desktop PageSpeed:** 99/100
- **Build-Zeit:** ~11 Sekunden
- **Seiten-Anzahl:** 22 Seiten

### SEO
- **Schema.org:** ✅ Implementiert
- **Meta-Tags:** ✅ Vollständig
- **Sitemap:** ✅ Automatisch generiert
- **Robots.txt:** ✅ Vorhanden

### Features
- ✅ 3-Schritte-Kontaktformular mit Datei-Upload
- ✅ Solarrechner auf Homepage
- ✅ Google Maps mit 4 Standorten
- ✅ 9 SEO-optimierte Blog-Artikel
- ✅ FAQ-Seite mit 26 Fragen
- ✅ Mobile-optimiert

---

## 🔮 Nächste Schritte (Aus todo.md)

### Offen
- [ ] Google Place ID für Reviews Widget hinzufügen
- [ ] Referenzen-Seite mit echten Projekten ausstatten
- [ ] Google Rich Results Test durchführen
- [ ] Finale QA aller Seiten durchführen

### In Planung
- [ ] Admin-Dashboard für Formular-Einreichungen
- [ ] SEO-Analyse-Tool
- [ ] Performance-Monitoring

---

**Hinweis:** Diese Wissensdatenbank wird kontinuierlich aktualisiert. Bei neuen Erkenntnissen oder Lösungen bitte hier dokumentieren.


---

## SEO-, Wallbox- und Analytics-Analyse (14.08.2026)

### Neue Primärquellen

| Quelle | Datum | Relevanz |
|---|---|---|
| Google Analytics 4, Property „Photovoltaik Leipzig – Solarstrom“ | 14.08.2026 | Tatsächliche Reichweiten-, Sitzungs-, Kanal- und Ereigniswerte für leipzig-photovoltaik.de. |
| Google Search Console, Property https://leipzig-photovoltaik.de/ | 14.08.2026 | Suchanfragen, Impressionen, Klicks, CTR und durchschnittliche Positionen im 3-Monats-Zeitraum. |
| Google Live-SERPs und Google Maps | 14.08.2026 | Momentaufnahme der organischen und lokalen Sichtbarkeit für Photovoltaik, Solaranlage, Stromspeicher und Wallbox Leipzig. |
| Bing und DuckDuckGo Live-SERPs | 14.08.2026 | Ergänzende Sichtbarkeit für Microsoft-/Safari-nahe Suchkanäle, insbesondere Wallbox Leipzig. |

### Verifizierte Erkenntnisse

1. Das Wallbox-Thema besitzt nachweislich lokale Kaufintention: „wallbox installation leipzig“ steht in der Search Console bei Ø Position 6,9 und erzielt 3 Klicks bei 111 Impressionen. Im Google-Live-SERP ist die Hauptzielseite organisch auf Position #3 sichtbar; DuckDuckGo zeigt sie ebenfalls auf #3.
2. Für „Solaranlage Leipzig“ bestehen 871 Impressionen ohne Klick bei Ø Position 26,9. Dieses Keyword ist der größte Reichweitenhebel, aber kein kurzfristiger Ersatz für die bereits sichtbaren Wallbox-Anfragen.
3. Die lokale Maps-Sichtbarkeit ist in allen geprüften Kernclustern der Engpass. Presolaris erscheint nicht in den sichtbaren Local-Packs; Wettbewerber werden durch Google-Business-Profile und Bewertungen gestützt.
4. GA4 erfasst Reichweitenwerte, zeigt aber keine sichtbaren Schlüsselereignisse. Ohne `generate_lead`, Telefonklick und Wallbox-CTA als Key Events lässt sich keine Suchanfrage bis zur Anfrage bewerten.
5. GA4 und Search Console sind noch nicht verbunden. Die Verknüpfung ist erforderlich, um organische Landingpages und später Conversions in einem Reporting zu analysieren.

### Was nicht funktioniert hat

- Eine Live-Abfrage bei Perplexity war im verfügbaren Browser nicht auswertbar, weil die Oberfläche anschließend auf eine leere Seite wechselte. Daraus dürfen keine Aussagen zur KI-Sichtbarkeit abgeleitet werden.
- Eine weitere Google-Live-Suche löste nach mehreren SERP-Abfragen eine Schutzabfrage aus. Die vorhandenen, vor der Begrenzung sichtbar gewordenen Ergebnisse wurden dokumentiert; weitere Google-Rankings wurden nicht geschätzt.

### Wiederverwendbares Analyseprinzip

**GSC-Durchschnittsposition und Live-SERP nie gleichsetzen.** Die Search Console aggregiert alle Impressionen, Geräte und Standorte im Berichtszeitraum, während eine Live-SERP nur einen einzelnen Abfragepunkt zeigt. Beide Werte sollen in Berichten nebeneinander stehen und eindeutig gekennzeichnet werden.


---

## Local Pack und CTR: offizielle Google-Grundlagen (14.08.2026)

### Primärquellen

| Quelle | Relevanz |
|---|---|
| https://support.google.com/business/answer/7091?hl=de | Google nennt Relevanz, Entfernung und Bekanntheit als zentrale Faktoren lokaler Rankings. Vollständige Informationen, Rezensionen, Antworten und Fotos sind konkrete Optimierungshebel. |
| https://support.google.com/business/answer/3038177?hl=de | Nur ein Profil je Unternehmen, korrekte Unternehmensdaten, möglichst wenige zutreffende Kategorien und korrektes Standort-/Einzugsgebiet-Modell. |
| https://developers.google.com/search/docs/appearance/title-link?hl=de | Google bildet Titellinks aus mehreren Quellen, u. a. Title, H1 und sichtbaren Überschriften. Prägnanz und inhaltliche Passung sind wichtiger als Keyword-Wiederholung. |
| https://developers.google.com/search/docs/appearance/snippet?hl=de | Snippets werden überwiegend aus Seitentext erzeugt; einzigartige, konkrete Meta-Descriptions können jedoch verwendet werden, sofern sie die Seite besser zusammenfassen. |

### Wiederverwendbare Erkenntnisse

1. **Local Pack lässt sich nicht erzwingen.** Die Umsetzung zielt auf ein bestätigtes Profil, vollständige und konsistente Entitätsdaten, reale Bewertungen, Fotos, Services und lokale Bekanntheit. Rankingzusagen sind unzulässig.
2. **CTR ohne Position ist kein isolierter Hebel.** Bei „Solaranlage Leipzig“ (Ø Position 26,9, 0 Klicks) ist eine Snippet-Änderung nur ein kontrollierter Nebenhebel. Erst die Verbesserung lokaler Relevanz in Richtung Top 10 schafft eine sinnvolle CTR-Basis.
3. **Vor GBP- und Schema-Arbeit müssen Daten vereinheitlicht werden.** Im Repository besteht eine Schreibweisenabweichung bei der Adresse (`Hebemärchte` vs. `Hebemärchten`) sowie widersprüchliche `reviewCount`-Angaben (2.400 vs. 127), während im GBP-Live-Befund 0 Bewertungen sichtbar sind. Bewertungen dürfen nicht mit abgeschlossenen Anlagen gleichgesetzt werden.
4. **Google-konformer CTR-Test ist sequenziell.** Eine Title-/Meta-Variante wird nach vorheriger SERP-Prüfung einmal geändert und über mindestens 28 Tage mit Impressionen, Klicks, CTR und Position zusammen betrachtet; es gibt kein echtes Google-A/B-Testing in der organischen Suche.


---

## Google-Unternehmensprofil Presolaris: bestätigter Verwaltungsbefund (14.08.2026)

| Befund | Bedeutung |
|---|---|
| Das Google-Konto `j.kolpin@presolaris.de` besitzt administrativen Zugriff; der Verwaltungsbereich „Mein Unternehmen bei Google“ ist sichtbar. | Änderungen können nach expliziter Freigabe direkt vorgenommen werden; keine neue Profilanlage erforderlich. |
| Das öffentliche Profil hat 23 Fotos, Kategorie „Solartechnik-Anbieter“, Website und Telefonnummer. | Die technische Local-Entity-Basis ist vorhanden. Der Fokus liegt auf Datenqualität, Services, Bewertungsprozess und laufender Pflege. |
| Google zeigt „Profilstärke: vollständige Informationen“ sowie eine Empfehlung „Erste Rezensionen erhalten“. | Vollständigkeit allein genügt nicht; das Bewertungs- und Bekanntheitssignal ist die Kernlücke. |
| Öffentlicher Profilname: „Presolaris Unternehmensgesellschaft (haftungsbeschränkt) ist leipzig-photovoltaik.de“. | Der Suchphrase-/Domain-Zusatz sollte nach Freigabe nur auf den außerhalb des Internets verwendeten, realen Unternehmensnamen zurückgeführt werden; Google verlangt eine Darstellung wie in der realen Welt. |
| Öffnungszeiten: „rund um die Uhr geöffnet“. | Nur beibehalten, wenn für Kunden tatsächlich 24/7 erreichbar bzw. verfügbar; sonst nach tatsächlichen Geschäftszeiten korrigieren. |
| Profil-Übersicht nennt 259 Kundeninteraktionen, Zeitraum in der sichtbaren Kurzansicht nicht ersichtlich. | Als Indikator, nicht als periodenübergreifend vergleichbaren KPI archivieren. Für regelmäßiges Reporting die Leistungsansicht mit explizitem Zeitraum verwenden. |

### Was nicht funktioniert hat

Der Deep-Link in die Performance-Ansicht ließ sich im Browser technisch öffnen, aber die dynamische Google-Oberfläche lieferte die Detailwerte nicht zuverlässig in der automatisierten Ansicht aus. Die im Verwaltungs-Dashboard sichtbaren Summen wurden nur als qualitative Ausgangswerte erfasst. Für ein belastbares Monatsreporting ist die Export-/Ansicht mit klar eingeblendetem Zeitraum erforderlich.


## Google-Unternehmensprofil: dynamische Verwaltungsoberfläche und Schutzblock (14.08.2026)

**Quelle und Kontext:** Google-Unternehmensprofilverwaltung für Presolaris UG (haftungsbeschränkt), authentifiziertes Verwaltungskonto `j.kolpin@presolaris.de`.

**Erkenntnis:** Das bestätigte Leipziger Profil ist über Google Suche und `business.google.com/locations` erreichbar. Die dynamischen Bearbeitungsansichten für Profil-, Öffnungszeit- und Leistungsfelder setzten die automatisierte Browseransicht jedoch wiederholt auf eine leere Seite zurück. Ein anschließender Aufruf wurde serverseitig mit einem Google-Schutzblock abgewiesen, ohne dass im Browser eine sichtbare Checkbox- oder Bild-CAPTCHA angezeigt wurde.

**Was nicht funktioniert hat:** Wiederholtes Öffnen derselben dynamischen Google-Profileditoren und direkte Hash-Routen zu einzelnen Bearbeitungsbereichen. Dies verstärkte die Sitzungsinstabilität und führte zum Schutzblock.

**Wiederverwendbares Vorgehen:** Bei einer instabilen Unternehmensprofil-Bearbeitung keine weiteren automatisierten Ladeversuche starten. Ausgangsstand und genaue Zielwerte dokumentieren; anschließend die Speicherung über eine stabile manuelle Sitzung durchführen und erst danach den öffentlichen Profilstand erneut prüfen. Keine Änderung darf als umgesetzt markiert werden, bevor Google eine Speicherbestätigung oder der öffentliche Eintrag den neuen Wert zeigt.


## Öffentliche Entitätsvarianten und Datenhygiene (14.08.2026)

**Quellen:** Website-Impressum, Google-/Gelbe-Seiten-/auskunft.de-Profilverbund, ENF Solar, FachScout, Creditreform, PV-Energie-Planer und Baukatastrophen. Die vollständige quellenverlinkte Liste liegt in `Oeffentliche-Namensvarianten-Presolaris-2026-08-14.md`.

**Erkenntnis:** Der vom Nutzer bestätigte operative Profilname `Presolaris Unternehmensgesellschaft (haftungsbeschränkt) ist leipzig-photovoltaik.de` ist öffentlich bei Google Maps, Gelbe Seiten und auskunft.de nachweisbar. Er wird nicht geändert. Die Rechtsform `Presolaris UG (haftungsbeschränkt)` bleibt die maßgebliche juristische Bezeichnung im Impressum und in registerbezogenen Verzeichnissen. `Photovoltaik Leipzig` bleibt die kundenorientierte Website- und Social-Media-Marke.

**Priorisierter Datenhygiene-Befund:** FachScout führt eine alte Berliner Straße und eine abweichende Rufnummer; ENF Solar und Baukatastrophen führen die falsche Rechtsform `mbH`. Creditreform hat die richtige Rechtsform und Adresse, jedoch eine andere Telefonnummer und ungepflegte Leistungsdaten. Diese Konflikte sind für die Local-Pack-Entität relevanter als die bloße Koexistenz der Markenformeln.

**Wiederverwendbares Muster:** Markenname, rechtliche Firma und etablierter Profilname dürfen unterschiedliche Rollen erfüllen. Nur falsche oder veraltete NAP-Daten (Name als Rechtsform, Adresse, Telefonnummer, Website-Ziel und Geschäftszeiten) werden als Korrekturfall behandelt. Kein automatisches Überschreiben des Google-Profilnamens ohne Entscheidung des Unternehmers.


## Einheitliche Verzeichnispflege ohne Google-Profilumbenennung (14.08.2026)

**Referenzdatensatz:** `Entitaets-Referenzdatensatz-Presolaris-2026-08-14.md` legt die drei zulässigen Ebenen fest: etablierter Google-Profilname, juristische Firmenbezeichnung und kundenorientierte Website-Marke. Die Google-Profilbezeichnung `Presolaris Unternehmensgesellschaft (haftungsbeschränkt) ist leipzig-photovoltaik.de` bleibt auf ausdrückliche Nutzerentscheidung unverändert.

**Verzeichnisreihenfolge:** FachScout, ENF Solar und Baukatastrophen zuerst, weil sie eine falsche `mbH`-Rechtsform bzw. alte/falsche Standortdaten führen. Creditreform anschließend wegen der abweichenden Telefonnummer und fehlenden Leistungen. Gelbe Seiten und auskunft.de nur nach Klärung der echten 24/7-Service-Erreichbarkeit.

**Wiederverwendbares Muster:** Keine Namensbereinigung durch globales Überschreiben. Zuerst einen rollenbezogenen Referenzdatensatz erstellen, dann nur faktisch falsche NAP- und Leistungsdaten korrigieren. Korrekturvorlagen und Nachweise zentral vorbereiten; externe Änderungen erst mit Inhaberzugang und nach sichtbarer Bestätigung abschließen.


## Verzeichnispriorisierung für lokale Sichtbarkeit (14.08.2026)

**Offizielle Grundlage:** Google bewertet lokale Ergebnisse primär nach Relevanz, Entfernung und Bekanntheit/Beliebtheit. Vollständige Unternehmensinformationen, Bewertungen, Antworten und Fotos sind direkte Google-Unternehmensprofil-Hebel. Quelle: https://support.google.com/business/answer/7091?hl=de

**Priorisierungslogik:** Zuerst Google-Unternehmensprofil und reale Bewertungen pflegen; danach nachweislich fehlerhafte, beanspruchbare Einträge (FachScout, ENF Solar, Baukatastrophen) korrigieren. Anschließend Profile mit geringerem Datenkonflikt (Creditreform, PV-Energie-Planer). Bing Places und Apple Business sind wichtig für Bing/Copilot sowie Apple Maps/Siri, aber keine direkten Google-Local-Pack-Hebel. Offizielle Verwaltungsquellen: https://support.microsoft.com/en-us/bing/add-and-manage-your-business-listing und https://support.apple.com/guide/maps/add-or-update-information-for-your-business-mps0fb242419/mac

**Vorbereitete Assets:** `Versandvorlagen-FachScout-ENF-Solar-2026-08-14.md` enthält die nicht abgesendeten, konkret auf beide Einträge zugeschnittenen Texte. `Local-SEO-Verzeichnispriorisierung-2026-08-14.md` enthält die 10-Tage-Abfolge und Messlogik.


## Google-Unternehmensprofil: Rezensionen, Fotos und Messung (14.08.2026)

**Neue Primärquellen:**

| Quelle | Erkenntnis |
|---|---|
| https://support.google.com/business/answer/3474122?hl=de | Bewertungen müssen auf echten Erfahrungen beruhen. Google erlaubt Erinnerungen per Link/QR-Code, verbietet jedoch Anreize und fordert einen professionellen Umgang mit allen Bewertungen. |
| https://support.google.com/business/answer/6123536?hl=de | Google empfiehlt für Unternehmen u. a. mindestens drei Außen-, Arbeits- und Teamfotos; die Bilder sollen echt, scharf und nicht übermäßig bearbeitet sein. |
| https://support.google.com/business/answer/7400114?hl=de | Gefälschte oder irreführende Inhalte und Bewertungen sind untersagt und können Konsequenzen für das Profil haben. |

**Operatives Muster:** Für den Local Pack zuerst faktische Profilqualität, echte Rezensionen mit neutraler Bitte, individuelle Antworten und reale Medien stärken. Entfernung ist nicht manipulierbar. Beitrags- und Fotoaktualität dienen dem Vertrauen und der Conversion; sie werden nicht als garantierter Rankinghebel kommuniziert.

**Plan-Datei:** `Google-Unternehmensprofil-Local-Pack-Plan-Leipzig-2026-08-14.md` enthält Freigabepunkte, 30-Tage-Abfolge und Messraster.


## Google-Bewertungen: richtlinienkonforme Kundenansprache (14.08.2026)

**Quelle:** https://support.google.com/business/answer/3474122?hl=de. Google erlaubt, echte Kunden über einen Link oder QR-Code um eine Bewertung zu bitten. Verboten sind Anreize, vorgegebene Sternebewertungen, Bewertungssteuerung und gefälschte Interaktionen.

**Wiederverwendbares Muster:** Eine einmalige Bitte direkt nach Abschluss einer realen Leistung plus höchstens eine höfliche Erinnerung nach 10–14 Tagen. Alle Kunden einer vergleichbaren Abschlussgruppe erhalten dieselbe freiwillige Einladung; es findet keine Selektion nach erwarteter Zufriedenheit statt. Neue Bewertungen werden individuell, kurz und ohne Kundendaten beantwortet.

**Vorlagen:** `Google-Bewertungen-Kundenansprache-Vorlagen-2026-08-14.md` enthält E-Mail, WhatsApp/SMS, Rechnungsbeilage, persönliche Ansprache, einmalige Erinnerung und Antwortvorlagen. Der Google-Bewertungslink bleibt ein Platzhalter, bis er aus dem verwalteten Profil verlässlich abgerufen werden kann.


## Google-Unternehmensprofil: sichere Leistungs- und Bewertungsoptimierung (18.08.2026)

**Quelle:** Verwaltetes Google-Unternehmensprofil von Presolaris, geprüft am 18.08.2026.  
**Relevanz:** Direkte Local-Pack-Relevanz durch präzise, echte Leistungen und einen regelkonformen Bewertungsprozess.

- Der offizielle Google-Bewertungslink lautet `https://g.page/r/CQ_JCNJ7Y0MdEBM/review`. Er darf nur an reale Kunden nach Auftragsabschluss und ohne Anreiz, Sterne-Vorgabe oder Bewertungsselektion gesendet werden.
- Erfolgreich gespeichert wurden zwei fachliche Leistungsbereinigungen: Ersatzstrom-Leistung sprachlich korrigiert; veralteter Wallbox-Hinweis „KfW-Förderung bis 900 € möglich“ durch eine neutrale Beschreibung zu Technik, Anmeldung und aktuell verfügbaren Fördermöglichkeiten ersetzt.
- **Was nicht funktioniert hat:** Der direkte Wechsel zwischen Google-Suchverwaltung und zentralem Business-Dashboard führte mehrfach zu leeren Browserseiten bzw. abgemeldeten Sitzungen. Erfolgreich war der direkte eingebettete Pfad `https://www.google.com/local/business/{location-id}/editprofile/services`.
- **Wiederverwendbares Muster:** Zuerst eine konkrete Leistung öffnen, den geänderten Wortlaut vor dem Speichern zur Freigabe zeigen, nach positiver Freigabe speichern und dann den aktualisierten Text sowie die Google-Bestätigung „werden bald veröffentlicht“ auslesen.
- **Aktuelle externe Quelle:** Die offizielle KfW-Seite bestätigt, dass neue Anträge für Zuschuss 442 nicht mehr gestellt werden können: https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Solarstrom-f%C3%BCr-Elektroautos-(442)/ (abgerufen 18.08.2026).


## Verbindliche Geschäftszeiten für Entitätskonsistenz (18.08.2026)

Der Nutzer hat die tatsächliche Erreichbarkeit von Presolaris verbindlich mit **Montag bis Freitag 09:00–17:00 Uhr** bestätigt. Google Maps führte diese Angabe bereits korrekt. Abweichende Werte in `LocalBusinessSchema.astro`, `kontakt.astro`, `solaranlage-leipzig.astro` und `ueber-uns.astro` wurden auf 09:00–17:00 Uhr angeglichen. Der Astro-Build war erfolgreich und erzeugte 70 Seiten.

**Entscheidung:** Zukünftige Entitäts- und Verzeichnisarbeit verwendet ausschließlich diese Geschäftszeiten, bis der Nutzer eine neue reale Erreichbarkeit bestätigt. Profilname und Seitenlayout wurden nicht verändert.


## GitHub Pages: Astro-Deployment aus `dist/` (18.08.2026)

**Ausgangsfehler:** GitHub Pages war auf die Legacy-Quelle `main / (root)` gestellt. Der automatisch erzeugte Pages-Lauf packte dadurch das gesamte Repository einschließlich `node_modules` und brach beim Artefakt-Upload ab.

**Erfolgreiche Lösung:** Die Pages-Quelle wurde über die angemeldete GitHub-Oberfläche auf **GitHub Actions** umgestellt. Der Workflow `.github/workflows/deploy.yml` baut mit `npm ci` und `npm run build` und übergibt ausschließlich `./dist` an `actions/upload-pages-artifact@v3`; anschließend veröffentlicht `actions/deploy-pages@v4` das Artefakt. Der Workflow-Commit `f4609d8` lief erfolgreich durch: Build Astro Site und Deploy to GitHub Pages waren beide erfolgreich. Die Bereitstellung unter `https://presolaris.github.io/senec-design/` war erreichbar.

**Wiederverwendbares Muster:** Für Astro bei GitHub Pages immer Actions als Quelle wählen, Artefaktpfad auf `dist/` begrenzen und niemals den Repository-Stamm veröffentlichen.


## Keyword- und Suchvolumenanalyse – 19.08.2026

**Primärquellen und Zeitraum:** Google Ads Keyword Planner, Konto Kolpin, Deutschland / Google / alle Sprachen, August 2025 bis Juli 2026; Google Search Console für leipzig-photovoltaik.de, 13.05.–12.08.2026.

**Wiederverwendbares Vorgehen:** Für künftige Keywordanalysen werden Google-Ads-Volumenbereiche stets als Bereiche dokumentiert und nie zu Punktwerten umgerechnet. GSC-Impressionen und GKP-Suchvolumen sind getrennte Kennzahlen: GKP quantifiziert nationale Nachfrage, GSC zeigt die reale Sichtbarkeit der eigenen Domain. Ein fehlender GKP-Einzelwert bedeutet keine Nullnachfrage, sondern meist eine von Google zusammengefasste oder nicht separat ausgewiesene Variante.

**Kernbefunde:** Die stärksten lokalen Cluster nach GKP liegen bei `photovoltaik leipzig`, `solaranlage leipzig` und `solar leipzig` (je 100–1.000). Der größte unmittelbare GSC-Quick-Win ist `solaranlage leipzig` mit 871 Impressionen, 0 Klicks und Ø Position 26,9. Das Wallbox-Cluster zeigt geringere nationale Bereiche (meist 10–100) aber hohen Lead-Intent und Top-10-Sichtbarkeit. `photovoltaik reinigung` und `solaranlagen reinigung` liegen national bei 1.000–10.000, sollten ohne klare lokale Leistungsseite jedoch nicht nur volumengetrieben priorisiert werden.

**Ablage:** `Keyword-Suchvolumen-Uebersicht-2026-08-19.md` sowie `.manus/keyword-planner-rohdaten-2026-08-19.md`.


## SEO-Quick-Win „Solaranlage Leipzig“ – 19.08.2026

**Neue Primärquellen:**

| Quelle | Datum | Relevanz |
|---|---|---|
| https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=de | 19.08.2026 | Google: Weiterleitungen und `rel=canonical` sind starke Signale zur Zusammenfassung ähnlicher URLs; interne Links sollen auf die kanonische URL zeigen. |
| https://developers.google.com/search/docs/appearance/title-link?hl=de | 19.08.2026 | Google: Titellinks werden u. a. aus Title, H1, auffälligen Überschriften, OG-Titel und Ankertext gebildet; diese Signale müssen zusammenpassen. |
| https://developers.google.com/search/docs/appearance/snippet?hl=de | 19.08.2026 | Google: Snippets werden hauptsächlich dynamisch aus Seiteninhalten gebildet; eindeutige, seitenspezifische Meta-Descriptions werden verwendet, wenn sie besser passen. |

**Verifizierter Befund:** Die Suchanfrage `Solaranlage Leipzig` erzielt in der GSC 871 Impressionen, 0 Klicks und Ø Position 26,9. In der Codebasis existieren zwei stark überlappende Zielseiten: `/solaranlage-leipzig/` und `/standorte/solaranlage-leipzig/`. Letztere enthält einen H1-Konflikt (`Photovoltaik-Anbieter Leipzig`), Platzhalteradresse, alte Geschäftszeiten und abweichende Bewertungsangaben. Das ist ein priorisierter Kannibalisierungs- und Entitätskonflikt.

**Wiederverwendbares Muster:** Bei exakter Keyword-Kannibalisierung zuerst eine kanonische Ziel-URL festlegen und über 301/Canonical, Sitemap und interne Links konsolidieren. Erst danach Title/Description als einen 28-Tage-Test ändern. Eine CTR von 0 % bei Ø Position 26,9 ist primär ein Ranking- und Relevanzproblem, kein isoliertes Snippet-Problem.

**Ablage:** `SEO-Quick-Win-Solaranlage-Leipzig-2026-08-19.md` und die SEO-Strategie-Präsentation `manus-slides://Le0VD9kqWT1ARQ4wFUQaqt`.


---

## Produktionssicherer SEO-Redirect auf GitHub Pages (19.08.2026)

**Erfolgreiche Lösung:** Bei Astro-Redirects auf statischem GitHub-Pages-Hosting darf für die Konsolidierung einer Produktions-URL kein relativer Zielpfad verwendet werden, wenn die Pages-Vorschau unter einem Repository-Prefix läuft. Die Redirect-Definition wurde auf die vollständige Produktions-URL `https://leipzig-photovoltaik.de/solaranlage-leipzig/` gesetzt. Der erzeugte Redirect enthält `meta refresh`, `noindex` und ein Canonical-Signal auf diese Ziel-URL. Die frühere Standort-URL ist aus der Sitemap entfernt und interne Links zeigen direkt auf die kanonische Seite.

**Verifikation:** Lokaler Astro-Build erfolgreich (69 Seiten). GitHub-Pages-Workflow 32239857841 für Commit `1b225be8` erfolgreich. Öffentlicher Production-Test bestätigte die Weiterführung von `/standorte/solaranlage-leipzig/` auf `/solaranlage-leipzig/` sowie den aktualisierten Seitentitel.

**Was nicht funktioniert hat:** Ein relativer Redirect zu `/solaranlage-leipzig/` verliert in einer GitHub-Pages-Repository-Preview den Prefix und kann dort zu `https://presolaris.github.io/solaranlage-leipzig/` führen. Für die Produktionsdomain wird deshalb ein vollständiges Ziel verwendet.


### 2026-08-19 — Search-Console-Nachkontrolle nach SEO-Release

Die kanonische URL `/solaranlage-leipzig/` war bereits indexiert und wurde nach dem Release erneut zur Indexierung angemeldet. Die 3-Monats-GSC-Tabelle zeigte aktuell für `solaranlage leipzig` 879 Impressionen, 0 Klicks und Ø Position 27,6. Die Search Console meldet weiterhin gecachte Hinweise zu Händlereinträgen, Navigationspfaden und Review-Snippets. Da der zuletzt gecrawlte Stand noch vor der veröffentlichten Bereinigung von Bewertungsdaten liegt, werden keine zusätzlichen Schemaänderungen ohne konkrete Detailfehleranalyse vorgenommen. Nach dem neuen Crawl erfolgt die fachliche Neubewertung.


### 2026-08-19 — 28-Tage-Messmodell für lokales SEO-Release

Für eine veröffentlichte Konsolidierungs- und Snippet-Änderung wird ein ungestörtes 28-Tage-Fenster verwendet: Tag 0 Baseline, Tag 7 technische Index-/Canonical-Kontrolle, Tag 14 diagnostische GSC-Auswertung, Tag 21 ein lokaler Substanzschritt und Tag 28 der vollständige Vergleich. Meta-Varianten werden innerhalb dieses Fensters nicht nachgeschoben. Bei `solaranlage leipzig` lautet der jüngste dokumentierte Referenzstand 879 Impressionen, 0 Klicks und Ø Position 27,6.

Off-Page-Priorität: erst echte, neutrale Google-Rezensionen und Antworten, dann reale Projekt-/Teamfotos, anschließend Datenkorrekturen in FachScout, ENF Solar und Baukatastrophen sowie Bing Places/Apple Business Connect. Content-Priorität: reale Leipziger Referenzen, Kostenblock, belegbarer Netz-Leipzig-Ablauf, kaufnahe FAQ und Kontextlinks. Keine gekauften Links, keine künstlichen Bewertungen und keine Profilnamen-Manipulation.


### 2026-08-19 — FachScout-Korrekturweg verifiziert

Der FachScout-Claim-Bereich unter `https://www.fachscout.de/claim-business/` verlangt vor der Übernahme eines Unternehmensprofils einen separaten FachScout-Login. Alternativ ist als veröffentlichter Korrekturkontakt `listings@fachscout.de` angegeben. Die fehlerhaften Stammdaten können daher erst nach Inhaberlogin oder durch eine explizit freigegebene externe E-Mail-Anfrage über den offiziellen Firmenkanal berichtigt werden.


### 2026-08-19 — Kein versandfähiges Gmail-Postfach im angemeldeten Google-Konto

Der Aufruf von Gmail für `j.kolpin@presolaris.de` führt zur Seite „Gmail zu Ihrem Google-Konto hinzufügen“. Für dieses Google-Konto ist somit kein Gmail-Postfach eingerichtet. Externe Korrekturanfragen können nicht über Gmail versendet werden; sie benötigen entweder den vorhandenen Firmen-Mailclient, einen FachScout-/ENF-/Baukatastrophen-Inhaberzugang oder eine vom Nutzer bereitgestellte Versandmöglichkeit.


### 2026-08-19 — Apple Business Connect erfordert separaten Apple-Business-Login

`business.apple.com` ist öffentlich erreichbar und weist für Kartenfunktionen auf einen separaten Apple-Business-Login hin. In der aktuellen Sitzung besteht kein Apple-Inhaberzugang zu einem Presolaris-Profil. Apple-Maps-, Siri- und Safari-Datenpflege kann erst nach Apple-Business-Anmeldung und Profilbeanspruchung erfolgen.


## Google-Rankingprüfung, 19.08.2026

**Quellen:** Google Search Console Leistungsbericht, exportiert am 19.08.2026 für 18.05.–17.08.2026; punktuelle Google-Deutschland-Suche mit `hl=de`, `gl=de`, `pws=0`.

**Erkenntnis:** Für eine vollständige, wiederholbare Rankingauswertung müssen GSC-Durchschnittspositionen und punktuelle Live-SERP-Positionen getrennt ausgewiesen werden. Die GSC-Daten zeigen die durchschnittliche Sichtbarkeit über Suchkontexte, während Live-SERPs lokal, zeitlich und personalisierungsbedingt schwanken.

**Live-Befund:** „Photovoltaik Leipzig“ war am 19.08.2026 organisch auf Position 2 sichtbar; Presolaris erschien nicht im sichtbaren Local Pack. Die sichtbaren Profile hatten 36, 127 beziehungsweise 1 Google-Bewertungen.

**Datenlücke:** Google löste bei der Serienprüfung eine Schutzprüfung aus. Keine Live-Positionen schätzen; stattdessen GSC-Export als belastbare Abdeckung für alle separaten Queries nutzen und die Grenze im Bericht klar benennen.


## Position-1-Strategie: Google-Quellen, 19.08.2026

| Quelle | Aktuelle, relevante Aussage |
|---|---|
| https://support.google.com/business/answer/7091?hl=de | Lokale Rankings beruhen vor allem auf Relevanz, Entfernung und Bekanntheit. Vollständige Profilangaben, Rezensionen, Antworten, Fotos, Verweise und Bewertungen stützen die lokale Sichtbarkeit; ein besseres Ranking kann nicht eingefordert werden. |
| https://developers.google.com/search/docs/appearance/title-link?hl=de | Google bildet Titellinks aus Title, sichtbarem Haupttitel, Überschriften, OG-Daten und Ankertext. Prägnante, spezifische, nicht überladene Titel sowie ein klarer H1 sind der korrekte Hebel. |
| https://developers.google.com/search/docs/appearance/snippet?hl=de | Snippets entstehen hauptsächlich aus sichtbarem Seiteninhalt; individuelle, informative Meta-Descriptions können eingesetzt werden, werden aber nicht garantiert angezeigt. |

**Entscheidungsregel:** Für „Solaranlage Leipzig“ wird nach der jüngsten Veröffentlichung kein weiterer Title-/Meta-Wechsel vor Ablauf des 28-Tage-Messfensters vorgenommen. Der nächste On-Page-Hebel ist echte, belegbare lokale Informationssubstanz; für „Photovoltaik Leipzig“ ist der größte offene Hebel die Local-Pack-Bekanntheit, nicht Keyword-Wiederholung im Profilnamen.


## Position-1-Plan Photovoltaik Leipzig und Solaranlage Leipzig, 19.08.2026

**Ausgangslage:** „Photovoltaik Leipzig“ punktuell organisch #2, aber ohne sichtbaren Local Pack; „Solaranlage Leipzig“ in GSC Ø Position 27,72 bei 876 Impressionen und 0 Klicks.

**Wiederverwendbare Entscheidungsregel:** Nach einer frischen technischen Konsolidierung und Snippet-Änderung keine weiteren Title-/Meta-Tests vor Ende des 28-Tage-Messfensters. Die nächste On-Page-Stufe sind echte, freigegebene lokale Referenzsubstanz, eine belegbare Ablaufinformation und kaufnahe FAQ-Antworten – keine weiteren Keyword-Wiederholungen.

**Local-Pack-Ansatz:** Organisch #1 kann nicht garantiert werden. Für die lokale Lücke sind vollständige reale Profildaten, neutrale Bewertungsansprache, Antworten, echte Fotos und bereinigte Verzeichnisse die belastbaren Relevanz- und Bekanntheitssignale; Profilnamen-Manipulation, gekaufte Links und künstliche Bewertungen bleiben ausgeschlossen.


### On-Page- und Position-1-Strategie (19.08.2026)
- **FAQ Solaranlage Leipzig**: Die allgemeine FAQ wurde durch kaufnahe Fragen ersetzt (Komplettpaket, Angebotsangaben, Prozess, Netzbetreiber, Speicher, Wallbox, Kosten, Förderung). Pauschale Ertrags- oder Förderversprechen wurden entfernt, um die Seriosität zu stärken und den Fokus auf individuelle Beratung zu legen.
- **Position 1 für Photovoltaik Leipzig**: Der GSC-Mittelwert (Position 16,68) und die Live-SERP-Sichtbarkeit (Position #2) wurden klar getrennt. Die größte Lücke für Position 1 liegt im Local Pack (Google Maps). Die Strategie konzentriert sich auf reale Bewertungen, zeitnahe Antworten und aktuelle Fotos im Google-Unternehmensprofil, da die Entfernung fix ist und Relevanz bereits optimiert wird.
- **Präsentationsskript**: Ein vollständiges Sprecher-Skript für die 10-seitige SEO-Präsentation wurde erstellt und in die Foliennotizen integriert, um die klare Trennung von On-Page-Maßnahmen (Solaranlage) und Local-Pack-Strategie (Photovoltaik) zu verdeutlichen.


---

## Google Search Console: HTML-Dateiverifizierung (13.09.2026)

**Umsetzung:** Die von Google bereitgestellte Datei `google769d65315847f6b4.html` liegt unter `public/` und wird von Astro unverändert im Domain-Root veröffentlicht. Der von Google erwartete Inhalt lautet exakt `google-site-verification: google769d65315847f6b4.html`.

**Technische Prüfung:** Der Astro-Build war erfolgreich und erzeugte 69 Seiten. Die Datei wurde im Build-Output unter `dist/google769d65315847f6b4.html` gefunden; der Inhalt stimmt zeichengetreu mit der Vorgabe überein.

**Wiederverwendbares Muster:** Für die Dateiverifizierung von Google Search Console die bereitgestellte `.html`-Datei ohne HTML-Template oder Umbenennung in `public/` ablegen. Danach builden, publizieren und `https://leipzig-photovoltaik.de/google769d65315847f6b4.html` abrufen. Erst wenn die URL öffentlich erreichbar ist, wird die Bestätigung in Search Console ausgelöst.


---

## Google Search Console: Domainverifizierung und aktueller Leistungsstand (13.09.2026)

**Bestätigung:** Die URL-Präfix-Property `https://leipzig-photovoltaik.de/` wurde in Google Search Console für das aktuell angemeldete Google-Konto automatisch über die HTML-Datei bestätigt. Die Datei `https://leipzig-photovoltaik.de/google769d65315847f6b4.html` ist öffentlich erreichbar und darf nicht entfernt werden, solange diese Bestätigungsmethode verwendet wird.

**GSC-Leistungsbericht:** Zeitraum laut Oberfläche 14.06.–13.09.2026, Suchtyp Web. Gesamtergebnis: 503 Klicks, 43.100 Impressionen, 1,2 % durchschnittliche CTR und Ø Position 14,9. Der Zeitraum überlappt mit der Baseline vom 19.08.2026, ist aber nicht identisch; Veränderungen sind daher nur als Richtungsindikator auszuweisen.

| Suchanfrage | Klicks | Impressionen | Ø Position | Vergleich zur Baseline vom 19.08.2026 |
|---|---:|---:|---:|---|
| photovoltaik leipzig | 7 | 1.416 | 15,5 | Ø Position um 1,18 Plätze besser als 16,68; Impressionen sind wegen des verschobenen 3-Monats-Fensters nicht direkt vergleichbar. |
| leipzig photovoltaik | 4 | 43 | 10,0 | Ø Position um 2,79 Plätze schlechter als 7,21; kleine Datenmenge. |
| solar leipzig | 2 | 585 | 15,8 | Praktisch stabil gegenüber 15,93. |
| wallbox installation leipzig | 4 | 74 | 6,5 | Ø Position um 0,33 Plätze besser als 6,83; Clicks und Impressionen nicht periodenrein vergleichbar. |

**Wiederverwendbares Muster:** Nach der Datei-Bestätigung die Datei im Webroot belassen. GSC-Durchschnittswerte stets getrennt von kontrollierten Live-SERP-Befunden ausweisen und nur identische Zeiträume für harte Vorher-nachher-Aussagen verwenden.


---

## Startseite: Entscheidungshilfe für „Photovoltaik Leipzig“ (16.09.2026)

**Veröffentlicht:** Die eigenständige Astro-Komponente `src/components/HomepageDecisionGuide.astro` ist auf der Startseite direkt nach dem Hinweis auf `/solaranlage-leipzig/` eingebunden. Sie ergänzt die vorhandenen Inhalte, ohne die kanonische Solaranlagen-Zielseite zu duplizieren.

**Inhalt:** Der neue Abschnitt „Photovoltaik in Leipzig planen: Die richtigen Fragen vor dem Angebot“ strukturiert den Entscheidungsprozess in drei kaufnahe Schritte: Dach/Verbrauch/Nutzung erfassen, Speicher und Wallbox anforderungsbezogen abwägen sowie Ablauf bis zur Inbetriebnahme verstehen. Kontextlinks führen zu `/stromspeicher/`, `/wallbox/`, `/solaranlage-leipzig/` und `/kontakt/`.

**Qualitätssicherung:** Es wurden keine neuen Bilder, Webfonts, Drittanbieter-Skripte oder interaktiven Komponenten ergänzt. Der vollständige Astro-Build war erfolgreich (69 Seiten). Die Produktionsseite liefert den Abschnitt öffentlich aus.

**Veröffentlichung:** Remote-Commit `cadd745cdc685af4da627b8fc18863c3a612deee`; GitHub-Pages-Workflow `35066209265` erfolgreich.

**Grundsatz:** Keine lokalen Stadtteilreferenzen, Projektbeispiele, Bewertungen, Förderzusagen oder Ertrags-/Amortisationsversprechen ergänzen, solange keine belegbaren Fakten und Freigaben vorliegen.

---

## Formular- und Rechner-Regression – 05.10.2026

**Ziel:** Ausschließlich `leipzig-photovoltaik.de`; das im selben Manus-Projekt vorhandene Wartungs-Repository ist nicht Teil dieser Reparatur. Stand: lokale Quelländerungen und isolierte Vorschau, **noch keine Veröffentlichung**. Der Nutzer wählte diese Domain ausdrücklich um 22:32 Uhr.

### Neue geprüfte Quellen

| Quelle | Datum | Relevanz |
|---|---|---|
| https://docs.web3forms.com/getting-started/api-reference | 05.10.2026 | Formularversand per POST und JSON-Erfolgskennzeichen; HTTP 200 ist nicht allein ein Beleg für Annahme. |
| https://docs.web3forms.com/getting-started/pro-features/advanced-file-uploader | 05.10.2026 | Uploadverhalten hängt vom Web3Forms-Plan ab; keine pauschale Zusage für mehrere große Dateien. |
| https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation | 05.10.2026 | `required`, `type=email`, `reportValidity()` und Auswirkungen von `noValidate` als Grundlage für Clientprüfung. |
| https://www.verbraucherzentrale.nrw/sites/default/files/2024-07/checkliste_photovoltaik_edit_final.pdf | 05.10.2026 | Erreichbares offizielles PDF statt Newsletter-Formular ohne echten Download. |

### Erfolgreiche Lösung

- 69 öffentliche Produktionsseiten und ihre Leads wurden inventarisiert; 64 Fragmentlinks mit Formular-/Rechnerbezug haben ein vorhandenes Ziel. Das lokale Build erzeugt 69 Seiten.
- Sieben Standardformularwege werden über `src/lib/leadForms.ts` im `Layout.astro` zentral behandelt; Mehrschritt- und Exit-Intent-Formular sowie React-Solarrechner nutzen denselben `postLead`-Antwortcheck. Submit/Feedback bleiben auf der Ursprungsseite, alle realen Antwortfälle erhalten `role=status` oder `role=alert`, Fehler behalten Eingaben, ein deaktivierter Submit-Button verhindert versehentliche Doppelsendungen.
- Bisherige Platzhalterschlüssel wurden bei drei Leistungsformularen durch den im bestehenden Kontaktformular konfigurierten Schlüssel aus `src/lib/leadKey.ts` ersetzt; keine geheimen Schlüssel in Berichten oder Testergebnissen ausgeben. Eine verifizierte Empfängerzuordnung des Drittanbieters ist **nicht** durch Browser-/Quelltests ersetzbar.
- Nur ein optionaler Anhang bis 5 MB im Mehrschrittformular; zu große Auswahl wird unmittelbar zurückgesetzt und erklärt. Eine Planfreischaltung für den Datei-Upload muss nach Veröffentlichung separat über einen kontrollierten echten Eingangsbeleg geprüft werden.
- `SolarCalculator.tsx`: Kein `mailto:` mit sofortiger Scheinerfolgsanzeige mehr, sondern echter bestätigter Formular-POST mit Daten/Ergebnissen und Zustimmungsfeld; die alte viersekündige Zufalls-„Dachprüfung“ wurde durch manuelle Ausrichtung/Neigung ersetzt. Ohne Speicher zeigt der Energiefluss null Speicherladung/-entladung.
- Gewerberechner: aktuell berechnete Parameter und Ergebnisse fließen als `calculator_summary` in das seiteninterne Angebotsformular; weiterhin als unverbindliche Modellwerte bezeichnet.
- Die Ratgeber-„Checkliste“ öffnet nun eine tatsächlich erreichbare PDF-Datei der Verbraucherzentrale statt ein unerfülltes E-Mail-Versprechen.

**Wiederverwendbares Muster:**

```ts
const formData = new FormData(form);
if (!form.reportValidity()) return;
const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
const result = await response.json();
if (!response.ok || result.success !== true) throw new Error('Anfrage nicht bestätigt');
// Erfolg erst danach anzeigen; bei Fehlern Werte und aktuelle Route erhalten.
```

### Was NICHT funktioniert hat

- `form.submit()` nach Speichern in Supabase übergeht den `submit`-Listener und die Browser-Validierung; die frühere Oberfläche bestätigte Erfolge auch ohne überprüften Provider-Eingang. Ersetzt durch überprüften `fetch`-POST.
- Ein `mailto:`-Link beweist keine Übermittlung und darf keinen bestätigten Anfrageeingang anzeigen.
- HTTP 200 mit `{success:false}` ist eine Ablehnung, kein Erfolg.
- `Math.random()` und Verzögerung ohne Geocoding/Solardaten sind keine echte Dachanalyse; Nutzer dürfen nicht über die Herkunft der Ausrichtung getäuscht werden.
- Ein vermeintlicher Newsletter-Download ohne Newsletterbackend/PDF ist kein funktionierendes Angebot.
- Die erste mobile Playwright-Regression klickte erzwungen (`force=True`) durch einen überdeckenden Cookie-Banner und vor dem Astro-React-Hydrieren. Das erzeugte wechselnde Testfehler statt belastbarer Produktbefunde. Abhilfe: Nur-notwendige-Cookieauswahl, sichtbare Klicks und explizite Warten auf Handler-/Island-Initialisierung. **Nicht** als reale Formularstörung zählen.

### Validierung und verbleibende Grenze

- `npm run build`: erfolgreich, 69 Seiten. Browserregression `qa/test_fixed_site.py` im übergeordneten Projekt: **21/21** Fälle bestanden (neun Formularwege plus Solarrechner-Dialog pro Desktop/Mobil, Ratgeber-PDF; ungültig, API-Fehler und API-Erfolg). `qa/test_calculators_fixed.py`: **4/4** Fälle (beide Rechner auf beiden Geräten, Grenzwerte, PDF, ohne-Speicher-Wert).
- Browser fängt **sämtliche POSTs** vor externen Servern ab; keine echte Anfrage und keine E-Mail-Auslieferung wurden bestätigt. Es gibt **keinen** lokalen Schreib-/Deploymentnachweis für `Presolaris/senec-design` in diesem Task, obwohl die repo-eigene ältere Anleitung `git push github main` empfiehlt. Dieser Schritt bleibt bis zu einem ausdrücklich für dieses Repository freigegebenen Zugang aus.
- Repo verfolgt `dist/index.html`, `dist/solarmanager/index.html` und `node_modules/.astro/data-store.json` als generierte Dateien. Checkpoints/Patch nur für explizit aufgeführte `src/`, Aufgabenliste und Wissensbasis erstellen, nicht diese Build-Dateien.

## Versionssichere Formular- und Rechner-Tests ohne CI-Gate (06.10.2026)

**Quelle:** [GitHub: eigene Pages-Workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), abgerufen 06.10.2026: Nur der Deploy-Job benötigt `pages: write` und `id-token: write`; er muss vom Build-Job abhängen. [GitHub: Publishing Source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), abgerufen 06.10.2026: Bei Pull Requests ist der Deploy-Schritt zu überspringen, bei Push auf den Standardbranch kann er das Build-Artefakt veröffentlichen.

**Umsetzung:** Die reproduzierbaren Tests `qa/test_fixed_site.py` und `qa/test_calculators_fixed.py` werden im Repository versioniert; JSON-Ergebnisse bleiben ignoriert. Der MultiStep-Dateianhang wird auf Ablehnung oberhalb 5 MB und einen gültigen PDF-Multipart-Payload geprüft. Mangels GitHub-App-Berechtigung `Workflows` wird `.github/workflows/deploy.yml` im zu veröffentlichenden Branch **nicht verändert**; PR- und Produktionsprüfung erfolgt manuell anhand der QA-Anleitung. Das automatische Test-Gate bleibt als späterer, nur mit passender Berechtigung umsetzbarer Verbesserung offen.

**Lokale Verifikation:** Astro-Build erfolgreich (69 Seiten), Browserfälle **23/23** Formulare/Anhang/Checkliste und **4/4** Rechner auf Desktop/Mobil bestanden, **0 echte POSTs**. Quellstand vor PR: `origin/main=a94a0ee`, lokale Feature-Checkpoints `cdc8cf1`, `3ecdec9`, `f28eae2`. Das Quellrepository meldet `viewerPermission=ADMIN`; ein erfolgreicher PR-Lauf und eine veröffentlichte Produktionsseite sind bis zu ihrer jeweiligen externen Bestätigung noch nicht als erledigt zu markieren.

**Was nicht funktionierte:** Das erste YAML-Validierungs-Skript konnte lokal nicht starten, weil `PyYAML` nicht installiert war. Nach Installation wurde der vorgesehene Workflow zwar geprüft, seine Übertragung scheiterte aber an der GitHub-App-Berechtigung. Der vorhandene Deploy-Workflow bleibt darum unverändert. Die alte WebDev-/Vercel-Anleitung am Anfang dieses Dokuments wurde durch den tatsächlichen GitHub-Pages-Prozess ersetzt.

### Was nicht funktioniert hat: Push der CI-Workflow-Datei (06.10.2026)

`git push -u origin fix/formular-rechner-qa-2026-10-05` wurde nach dem Objekt-Upload ausdrücklich vom GitHub-Server abgewiesen: `refusing to allow a GitHub App to create or update workflow .github/workflows/deploy.yml without workflows permission`. Das Repository ist für den Nutzer mit `viewerPermission=ADMIN` sichtbar, der **verwendete App-Token** hat aber nicht die getrennte `Workflows`-Repository-Berechtigung. Die Bereitstellung blieb unverändert; vor erneutem Push ist eine neue, tatsächlich erteilte App-Berechtigung erforderlich. Nicht durch eine andere Datei-/API-Route oder einen abweichenden Token umgehen.

**Offizielle Quelle, 06.10.2026:** [GitHub: Choosing permissions for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app), Abschnitt „Choosing permissions for Git access“: Für Änderungen an Dateien unter `.github/workflows` ist die separate `Workflows`-Repository-Berechtigung erforderlich. Eine Alternative ohne diese Berechtigung wäre ein eigener, bewusst engerer PR ohne Workflow-Änderung; dadurch entfiele aber das geplante automatische Browser-Test-Gate vor Pages-Deployments und die Entscheidung muss explizit getroffen werden.

## Abnahme PR #1 und verbleibender Provider-Blocker (06.10.2026)

[PR #1](https://github.com/Presolaris/senec-design/pull/1) wurde nach **23/23** manuell geprüften Formularfällen und **4/4** Rechnerfällen gemergt; Merge-Commit `895cd5b700199ce6103d9ae3170ea048c5d03465`. Beide Vercel-Statuschecks waren erfolgreich. `https://leipzig-photovoltaik.de/` antwortete auf der neuen Version mit HTTP 200, `server: Vercel` und der neu eingeführten Dachwert-Klarstellung. Auch der zusätzliche GitHub-Pages-Lauf für denselben Commit war erfolgreich. Danach bestanden **23/23** Formular-/Dialog-/Datei- und **4/4** Rechner-Browserfälle direkt auf der Produktionsdomain erneut, mit abgefangenen POSTs.

**Echte Zustellung:** Zwei als QA gekennzeichnete reale Kontaktseiten-POSTs um 22:58 bzw. 23:00 Uhr liefen nicht erfolgreich durch: Chromium meldete `No 'Access-Control-Allow-Origin'`, `net::ERR_FAILED`, und die Seite zeigte korrekt den Fehlerzustand, ohne weiterzuleiten. Weder Providerannahme noch Postfacheingang ist bewiesen. [Web3Forms Troubleshooting](https://docs.web3forms.com/getting-started/troubleshooting), geprüft am 06.10.2026, erlaubt AJAX-`FormData` und nennt domainbezogene Sperren sowie Redirect-/Content-Type-Fehler als CORS-Ursachen. `redirect` wird im Code vor dem POST gelöscht. `curl`-HEAD/OPTIONS aus dieser Cloud liefern 403, aber Web3Forms blockiert laut eigener Dokumentation serverseitige Requests grundsätzlich ohne IP-Freigabe; das allein beweist keinen Fehler des Access Keys. Weitere echte Test-Leads erst nach neuer Evidenz. Eine Provider-Dashboardprüfung oder eine freigegebene alternative Zustelllösung ist nötig, wenn die Sperre auch normale Besuchende betrifft.

**Zusätzlicher Browserbefund:** Auf vier Formularen ist das HTML-Telefon-`pattern` ungültig, weil ein Bindestrich in einer v-RegEx-Zeichenklasse und nach Astro-Rendering entfallene Escape-Zeichen die Syntax zerstören. Der konservative Ersatz `^[+]?([0-9]|[ ]|-|[.]){6,22}$` kompiliert im `v`-Modus. Regression: `new RegExp(el.pattern, 'v')`, `abc` wird abgelehnt, `0341 1234567` akzeptiert. Diese Korrektur ist vom Providerfehler getrennt und bedarf eines separaten PR/Deploys.

**Primärquelle Telefonvalidierung, 06.10.2026:** [MDN: `pattern` HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/pattern). Das Attribut wird mit Unicode-`v` kompiliert; Zeichenklassen behandeln u. a. `-`, `(` und `)` strenger, und **ungültige Patterns werden nicht angewendet**. Die neue RegEx verzichtet auf kritische Zeichenklassen-Escapes und wurde sowohl direkt in Chromium als auch im lokalen 23/23-Formulartest einschließlich acht Telefonfällen validiert. Die Nummernschreibweise ohne Klammern bleibt mit Leerzeichen und Bindestrichen nutzbar; Klammerformate werden absichtlich nicht mehr akzeptiert, bis sie separat spezifiziert und getestet sind.

## Brevo gegen Web3Forms – Bewertung 07.10.2026

**Aktueller Code:** `src/lib/leadForms.ts` nutzt browserseitig den vorhandenen Web3Forms-Schlüssel. Das Astro-Projekt ist `output: 'static'` und enthält keine Brevo-Integration. Ein Brevo-Konto oder ein Brevo-Key ist in dieser Sitzung nicht als Connector oder aktiver Browser-Login verfügbar; daraus kann nicht auf andere Betreiber- oder Vercel-Zugänge geschlossen werden. **Brevo Transactional ist fachlich geeignet**, aber nicht automatisch funktionsfähig und darf wegen des vertraulichen API-Schlüssels nicht unmittelbar aus einer statischen Browserseite angesprochen werden.

**Umsetzungsmuster nach geklärtem Konto:** Vercel-Function `/api/lead`, serverseitiger Key als Secret, validierte Payloads, Rate-Limit/Bot-Schutz, festes Betreiberpostfach und verifizierter Absender; API `POST https://api.brevo.com/v3/smtp/email` mit `api-key`. UI-Erfolg erst nach akzeptierter Providerantwort; `messageId` und Brevo-Zustelllogs sowie bestätigter Posteingang gesondert prüfen. Kein stiller Wechsel von Web3Forms und keine Aufnahme von Interessenten in eine Marketingliste ohne Zweck und gesonderte Einwilligung. Offizielle Quellen (07.10.2026): [Brevo Transactional API](https://developers.brevo.com/docs/send-a-transactional-email), [Brevo Sender-/SMTP-Troubleshooting](https://help.brevo.com/hc/en-us/articles/115000188150-Troubleshooting-Issues-with-Brevo-SMTP).

**Externe technische Grenzen (07.10.2026):** [Vercel Functions](https://vercel.com/docs/functions) unterstützt Root-`api/lead.ts` als serverseitige Function zusätzlich zu statischem Seitenoutput. [Vercel Functions Limits](https://vercel.com/docs/functions/limitations#request-body-size) begrenzt den Request-/Response-Payload auf **4,5 MB**. Deshalb kann der bislang im Browser erlaubte 5-MB-Dateianhang **nicht** unverändert durch dieselbe Vercel-Function; erfordert separaten direkten Speicher-Upload oder eine sichtbare, kleinere Grenze. [Brevo-API-Referenz](https://developers.brevo.com/reference/send-transac-email) dokumentiert `attachment` als `{name, content}` mit Base64-Inhalt (unterstützt PDF/JPG/PNG/DOC/DOCX), `api-key`-Header, `replyTo` und `messageId`. Für ein sofort funktionales, sicheres MVP ist eine sichtbare 3-MB-Grenze für genau eine Datei im Kontaktformular realistisch; eine beibehaltene 5-MB-Zusage ohne andere Uploadarchitektur wäre falsch. [Brevo Versand](https://developers.brevo.com/docs/send-a-transactional-email) und [Absenderfehler](https://help.brevo.com/hc/en-us/articles/115000188150-Troubleshooting-Issues-with-Brevo-SMTP): verifizierter Absender, aktives Transactional-Konto und Postfach-Eingang separat prüfen.

## Formularschutz und echte E-Mail-Bestätigung: technische Grundlage (21.10.2026)

| Quelle | Datum | Relevanz |
|---|---|---|
| https://developers.brevo.com/docs/send-a-transactional-email | 21.10.2026 | Brevo Transactional API akzeptiert serverseitig verifizierte Absender, Empfänger, HTML- oder Textinhalt und gibt bei API-Annahme eine `messageId` zurück. Eine `messageId` belegt keine Postfachzustellung. |
| https://vercel.com/kb/guide/add-rate-limiting-vercel | 21.10.2026 | Vercel WAF kann für einen konkreten Pfad wie `/api/lead` sofort wirksame Rate-Limits durchsetzen, ohne eine neue Bereitstellung. |
| https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html | 21.10.2026 | OWASP empfiehlt Schichtschutz: Edge-Rate-Limit, serverseitige Feld- und Einwilligungsprüfung sowie Honeypot und Verhaltenssignale. Ein sichtbares CAPTCHA ist nur ein möglicher, nicht primärer Schutz. |

**Befund:** Das bisherige Fallback-Modell sendet browserseitig direkt an Web3Forms, solange `PUBLIC_LEAD_PROVIDER` nicht auf `brevo` gesetzt ist. Die vorbereitete Brevo-Route prüft zwar Origin, Honeypot, E-Mail und einen Teil der Einwilligungen, sendet aber nach einer formalen E-Mail-Prüfung unmittelbar an das Betreiberpostfach. Das ist kein Double-Opt-in und erklärt, warum erfundene E-Mail-Adressen nicht abgefangen werden.

**Entscheidung:** Der neue Ablauf besteht aus zwei serverseitigen Stufen. Die erste Stufe prüft alle Angaben, nimmt keine Betreiberbenachrichtigung vor und sendet nur einen zeitlich begrenzten Bestätigungslink an die angegebene E-Mail. Erst ein bewusster POST auf der Bestätigungsseite löst die Benachrichtigung an das Betreiberpostfach aus. Der Link trägt keine lesbaren Kontaktdaten. Alle Lead-Wege nutzen ausschließlich die serverseitige Route; die Telefonnummer ist in Client und Server Pflichtfeld. Die Produktivschaltung verlangt Brevo- und Signierungsvariablen in Vercel sowie eine WAF-Regel für den Endpunkt.

## Implementierung: serverseitiges Double-Opt-in (21.10.2026)

**Umgesetzt:** `api/lead.ts` akzeptiert nur die vorgegebenen Formularquellen, gleiche Herkunft, reale E-Mail-Syntax, eine Telefonnummer mit mindestens sechs Ziffern, aktive Datenschutzeinwilligung, ungefüllten Honeypot und mindestens 2,5 Sekunden Formularzeit. Es verschickt zunächst nur die Bestätigungs-E-Mail. Der signierte Link enthält weder E-Mail noch Telefonnummer lesbar, läuft nach 30 Minuten ab und wird in `api/confirm.ts` ausschließlich per bewusster POST-Bestätigung verarbeitet. Erst dort erhält das feste Betreiberpostfach den Lead. Für eine strikt persistente Einmalnutzung eines Tokens wäre zusätzlich ein zentraler Datenspeicher erforderlich; der Schutz vor falschen E-Mail-Adressen hängt davon nicht ab.

**Entscheidungen:** Dateien werden im ersten Schritt absichtlich nicht angenommen. Damit werden vor der Verifikation keine zusätzlichen personenbezogenen Unterlagen gespeichert oder weitergereicht und die 4,5-MB-Grenze der Vercel Function wird nicht ausgereizt. Die Eingabefelder weisen auf das Nachreichen per Antwort auf die Bestätigungs-E-Mail hin. Alle Browserformulare verwenden `src/lib/leadForms.ts`; der browserseitige Web3Forms-Schlüssel (`src/lib/leadKey.ts`) ist entfernt.

**Vercel-Konfiguration:** `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_LEAD_RECIPIENT` und das neu angelegte, private `LEAD_CONFIRMATION_SECRET` liegen für Produktion vor. Zusätzlich ist eine Vercel-Firewall-Regel für `/api/lead/` mit `3` Anfragen je IP-Adresse/`600` Sekunden vorbereitet. Sie darf erst nach dem Produktionscode veröffentlicht werden, damit sie den alten Versandweg nicht ohne Schutzwechsel begrenzt.

**Prüfstatus vor Veröffentlichung:** Produktionsbuild erfolgreich (69 Seiten); API-Negativ- und Ablauftests 6/6; Browser-Leadregression mit allen zehn Formularwegen für Desktop/Mobil 23/23; Rechner-Regression 4/4. Alle Browser-POSTs waren abgefangen, es wurde daher kein echter Interessentenlead und kein Brevo-Testversand erzeugt. Ein anfänglicher Hydrationsfehler der Tests beruhte auf veralteten `dist/_astro`-Dateien im lokalen Preview; ein sauberer `CI=true npm run build` behob ihn. Das ist eine Testumgebungsursache, keine Formularursache.

**Was der Schutz nicht leistet:** Double-Opt-in beweist, dass der Absender Zugriff auf die angegebene E-Mail hat. Es garantiert nicht, dass die Person kaufbereit ist oder die Telefonnummer ihr gehört. Die Rate-Limit-Regel, Brevo-Logs und die individuelle Nachqualifizierung bleiben deshalb erforderlich. Ein CAPTCHA ist derzeit absichtlich nicht aktiv, weil der mehrschichtige, reibungsärmere Schutz zuerst gemessen werden soll.

**Beobachtung aus dem Betrieb, 22.10.2026:** Eine um 05:31 Uhr eingegangene Anfrage über `gewerbe-photovoltaik-leipzig` enthielt eine zufällige Hotmail-Adresse sowie offensichtlich automatisierte Firmen-, Kontakt- und Verbrauchsfelder. Sie war kein Anlass für eine personenbezogene Sperrliste, bestätigt aber die Lücke des bisherigen Direktversands: Jeder syntaktisch akzeptierte POST konnte das Betreiberpostfach erreichen. Der neue Ablauf versendet in diesem Fall höchstens eine Bestätigung an die eingetragene Adresse; ohne Zugriff auf dieses Postfach gibt es keine Betreiberbenachrichtigung.

**Was nicht funktioniert hat / korrigiert:** Der erste Produktionsrelease von `/api/confirm/` importierte `./lead.ts`, also eine zweite Vercel-Function. Vercel bündelt Function-Dateien unabhängig; daraus entstand bei einem sicheren Negativtest `ERR_MODULE_NOT_FOUND: /var/task/api/lead.ts` und ein HTTP 500. Ein zweiter Versuch mit `lib/leadConfirmation.ts` führte ebenso zu `ERR_MODULE_NOT_FOUND`, weil dieses Projekt externe TypeScript-Dateien nicht in die Function-Artefakte übernimmt. Wiederverwendbares Pattern für dieses Projekt: Eine Vercel-Function darf nur Node-Bordmittel und in ihrem eigenen Function-Bundle enthaltenen Code verwenden. `api/confirm.ts` ist deshalb vollständig eigenständig und importiert keine andere Projektdatei. Der selbstständige Hotfix wurde lokal mit allen 6/6 API-Regressionen einschließlich des ungültigen Links geprüft und wird separat produktiv verifiziert.

**Produktiv verifiziert, 22.10.2026:** Vercel-Deployment `b0305bd` (Stand: 07:12 Uhr) stellte den eigenständigen `/api/confirm/`-Endpunkt erfolgreich bereit. Ein absichtlich ungültiger Token liefert die neutrale Seite „Link nicht verfügbar“ mit HTTP 200 und `cache-control: no-store`; eine Betreiberbenachrichtigung kann dabei nicht entstehen. Die Lead-Route liefert bei GET 405, fremder Origin 403, unvollständigen Pflichtangaben 400 und Honeypot 400. Eine echte Testzustellung wurde absichtlich nicht ausgelöst.

**Vercel Edge-Schutz aktiviert, 22.10.2026:** Die veröffentlichte Regel `Lead-Double-Opt-in: 3 pro 10 Min/IP` schützt ausschließlich `/api/lead/` und antwortet danach mit 429. Zusätzlich steht „Bot Protection: Challenge“ aktiv: verdächtige Nicht-Browser werden vor der Function mit 429/Challenge abgefangen; normale Browser sowie verifizierte Bots bleiben laut Vercel-Regelbeschreibung zugelassen. Ein Headless-Browser-Regressionstest wurde dadurch bereits vor der Anwendung mit einer Challenge abgefangen – erwartetes Edge-Verhalten, kein Formfehler. Für die spätere Beobachtung eignen sich Vercel Firewall Traffic/Audit Log und Brevo-Transaktionslogs.

## Brevo-Absenderdomain `presolaris.de`: DNS-Bestand und Lieferbarkeitsplan (01.11.2026)
### Neue geprüfte Quellen
| Quelle | Datum | Relevanz |
|---|---|---|
| https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC | 01.11.2026 | Brevo fordert je Domain einen Ownership-TXT, einen DKIM-TXT oder zwei DKIM-CNAMEs und einen einzigen DMARC-Record. Vorhandene DMARC-Einträge dürfen nicht dupliziert werden; bei einem bestehenden Record ist er zu ergänzen. |
| https://developers.brevo.com/docs/domain-authentication-and-verification | 01.11.2026 | Brevo bietet API-Status für `verified`, `authenticated` und `dns_records`; die Authentifizierung folgt nach sichtbarer DNS-Propagation. |
| https://help.brevo.com/hc/en-us/articles/10415456027666-FAQs-What-is-a-DMARC-policy-and-how-does-it-affect-the-sending-of-my-emails | 01.11.2026 | Für die erste Bereitstellung ist `p=none` mit `rua` der geeignete Monitoring-Modus. Mehrere DMARC-Records sind unzulässig. |

### Ermittelter Ist-Zustand
- Öffentliche Nameserver beider Marken-Domains sind `ns5.kasserver.com` und `ns6.kasserver.com`; die DNS-Verwaltung liegt bei ALL-INKL/KAS.
- Die in Brevo bereits authentifizierte Domain `photovoltaik-anlagen-wartung.de` ist nicht der aktuelle Geschäftsabsender der Lead-Route. Für die Zustellungsverbesserung wurde daher `presolaris.de` als Absenderdomain in Brevo angelegt.
- `presolaris.de` enthält derzeit genau einen SPF-Record (`v=spf1 a mx include:spf.kasserver.com ~all`), genau einen DMARC-Record (`v=DMARC1; p=none;`) und einen bestehenden KAS-DKIM-Selector. Diese Records bleiben erhalten.
- Von Brevo wurden für `presolaris.de` bereitgestellt: Ownership-TXT an Root (`brevo-code:10fcf8dfa141614650303277c574e2e7`), CNAME `brevo1._domainkey` → `b1.presolaris-de.dkim.brevo.com`, CNAME `brevo2._domainkey` → `b2.presolaris-de.dkim.brevo.com`. Der bestehende DMARC-Record muss als einzelner Record zu `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` ergänzt werden.

### Betriebsregel
1. Den bestehenden SPF-Record **nicht** durch einen zweiten SPF-Record ersetzen oder ergänzen, solange Brevo keinen eigenen SPF-Wert anzeigt; die aktuelle Brevo-Domainauthentifizierung benötigt hierfür nur Ownership, DKIM und DMARC.
2. Die zwei CNAMEs und den Brevo-Code zusätzlich anlegen; erst danach in Brevo „Diese E-Mail-Domain authentifizieren“ auslösen und den Status abwarten.
3. `BREVO_SENDER_EMAIL` erst nach grüner Brevo-Authentifizierung auf eine bestätigte `@presolaris.de`-Adresse setzen. Anschließend Header einer neuen Betreiber-QA prüfen: `dkim=pass`, passende From-Domain und kein `@brevosend.com`-Fallback.
4. Die kontrollierte Erstmail wurde in Gmail als Spam einsortiert. Das ist kein Beweis für einen API-Fehler; ohne aktiviertes Domainalignment wird kein weiterer Kundentest ausgelöst.

### Was aktuell blockiert
- KAS war nach einer Take-over-Anmeldung einmal erreichbar. Der im Passwortmanager gespeicherte Login `kontakt` wurde beim folgenden manuellen Login jedoch abgewiesen (noch 9 Versuche). Keine weiteren Versuche starten; stattdessen korrekten KAS-Login oder manuellen Login durch die zuständige Person verwenden.
- Vercel Project Logs zeigten am 01.11.2026 im aktuellen 30-Minuten-Fenster keine Requests sowie 0 Warnings, 0 Errors und 0 Fatals. Die zuvor beobachteten 429 gehören zum absichtlich aktivierten Bot-Challenge-/Rate-Limit-Schutz und sind getrennt von Funktionsfehlern zu berichten.

## Fortsetzung nach Browserwechsel: DNS und Firewall (02.11.2026)

**Zugänge:** Im neu ausgewählten Nutzerbrowser sind Brevo und Vercel angemeldet. KAS zeigt hingegen das Login; der zuvor bekannte Sitzungslink ist nicht mehr gültig. Der früher abgewiesene Kontakteintrag wurde nicht erneut abgesendet. Ein sichtbarer NordPass-Vorschlag für das passende KAS-Konto ließ sich nicht als erfolgreiche Ausfüllung nachweisen; daher keine Einsendung einer unbestätigten Passwort-/Kontokombination und keine weitere Fehlversuchsserie.

**DNS-Prüfung:** Cloudflare und Google DNS-over-HTTPS liefern übereinstimmend nur das bestehende KAS-SPF am Root, keine Brevo-Ownership-TXT und keine CNAMEs `brevo1._domainkey`/`brevo2._domainkey`. DMARC steht weiterhin auf `v=DMARC1; p=none;` ohne `rua`. Damit ist die Domainauthentifizierung weiterhin offen, nicht bloß als erfolgreiche Änderung mit laufender Propagation anzusehen. Vor späterer Veröffentlichung die individuellen Brevo-Werte nochmals im Konto abgleichen.

**Absender:** Die Brevo-Absenderliste bestätigt `j.kolpin@presolaris.de` als verifizierte Adresse. Für diesen Absender stehen jedoch DKIM auf „Standard“ und DMARC auf „rua-Tag fehlt“. Verifizierte Absenderadresse und authentifizierte Domain sind unterschiedliche Prüfstufen. Keine alternative Geschäftsdomain aus einem anderen Websiteprojekt ohne Auftrag verwenden. SPF/DKIM/DMARC verbessern die Authentifizierbarkeit, garantieren aber keine Zustellung im Posteingang statt im Spamordner; Reputation, Inhalt und Empfängerfilter bleiben weitere Faktoren.

**Request-Logs:** Vercel zeigt im erweiterten Stundenfenster laut Oberfläche ungefähr 20:07–21:07 Uhr keine Request-Logs und Warnung/Fehler/Fatal jeweils 0. Optionen für längere Request-Logzeiträume sind als Upgrade markiert; kein Tarifwechsel. Daraus lässt sich kein vollständiger Rückblick seit dem Oktober-Deployment und keine Spamfreiheit ableiten.

**Firewall separat, 24 Stunden laut Oberfläche 01.11. 21:06–02.11. 21:06:** 511 Allowed, rund 1.700 Denied, 503 Challenged; Rate Limited zeigt „-“. Regelaufschlüsselung: DDoS Mitigation rund 1.700, Bot Protection 473, managed_crawler_ruleset 2. Diese Zahlen sind keine disjunkten Mengen und dürfen nicht addiert oder als bestätigte Formularspamfälle bezeichnet werden. Die eigene Lead-Regel `Lead-Double-Opt-in: 3 pro 10 Min/IP` liefert bei separatem Filter „No Data“ im selben Zeitraum. Anfragen können schon vor dieser Regel vom allgemeinen Bot-Schutz abgefangen werden. Eine eindeutige pathbezogene Zuordnung dieser allgemeinen Abweisungen zu `/api/lead/` oder `/api/confirm/` ist nicht nachgewiesen.

**Wiederverwendbare Betriebsregel:** Leere Function-/Request-Logs sind kein Ersatz für Firewall-Traffic. Für belastbare Aussagen immer Zeitraum, Datenquelle, Filter und Tarifgrenze nennen; „No Data“ nicht als „0 Spam“ auslegen. Allgemeine DDoS-/Challenge-Zähler sind keine Betreiber-Leads. E2E erst nach Domainauthentifizierung, konkreter freigegebener Empfängeradresse, echter Linkbestätigung und separatem Betreiber-Postfachnachweis als abgeschlossen markieren. Am 02.11.2026 keine E-Mail versendet und keine produktive DNS-, Absender- oder Firewallkonfiguration verändert.

**Quellansichten:** https://app.brevo.com/senders/list ; https://vercel.com/presolaris-projects/leipzig-photovoltaik/logs?datasource=legacy-logs&timeline=pastHour ; https://vercel.com/presolaris-projects/leipzig-photovoltaik/firewall/traffic ; separate Regelansicht über den in der Oberfläche angebotenen Filter. Öffentliche Resolver: https://cloudflare-dns.com/dns-query und https://dns.google/resolve . Prüfdatum: 02.11.2026. Keine Session-IDs, Passwörter oder Live-Bestätigungstokens dokumentieren.

## Erneute Reparaturprüfung (06.11.2026)

**DNS und Zugänge:** Google und Cloudflare DoH liefern übereinstimmend weiterhin nur das bestehende KAS-SPF, DMARC `v=DMARC1; p=none;` und keine Brevo-DKIM-CNAMEs. Die Brevo-Liste meldet `presolaris.de` als nicht authentifiziert. Die Domain wurde nicht neu angelegt. KAS zeigt weiterhin das Login; Zugriff auf den Passwortmanager scheitert mit `Cannot access a chrome-extension:// URL of different extension`. Sichere CLI-Geheimnissuche ist in dieser Umgebung nicht verfügbar. Keinen bekannten falschen Login wiederholt und keine DNS-Änderung behauptet.

**Belegte Codefehler:** Acht bisherige API-Tests bestanden, ließen aber Lücken offen. `api/lead.ts` verglich die öffentliche Origin noch gegen die interne Function-URL und erzeugte Bestätigungslinks aus dieser URL. `api/confirm.ts` hatte zwar die kanonische Origin-Freigabe, behandelte jedoch die serialisierte Origin `null` als fremde Origin, selbst bei same-origin Navigate-Metadaten. Gültige Bestätigungstokens konnten innerhalb ihrer Laufzeit mehrfach Betreiberbenachrichtigungen auslösen. Diese Fälle werden gezielt repariert und die Tests um echte verschlüsselte abgelaufene Tokens sowie Fehler der Confirm-Providerantwort erweitert. Tests und fertigen Produktionsstatus erst nach Abschluss eintragen.

**Neue offizielle Quellen, geprüft am 06.11.2026:** https://developers.brevo.com/docs/heterogenous-versions-batch-emails dokumentiert `headers.idempotencyKey` als UUID im JSON-Body von `POST /v3/smtp/email`, eine TTL von 30 Minuten und den Fehler `duplicate_parameter` bei Wiederholung. https://developers.brevo.com/reference/send-transac-email bestätigt das Idempotenzfeld im regulären Transaktionsendpunkt. Damit lässt sich ein deterministischer UUID-Key pro verschlüsseltem Bestätigungstoken zur providerseitigen Deduplizierung verwenden; er deckt nach aktueller Dokumentation die verbleibende 30-Minuten-Tokenlaufzeit ab. Alte Angaben von 15 Minuten nicht ungeprüft übernehmen. Kein Ersatz für einen unabhängig persistenten Einmalverbrauch und keine genau-einmal-Postfachzustellgarantie. Nur einen ausdrücklich auf den Idempotenz-Key bezogenen Wiederholungsfehler als bereits verarbeitet anzeigen; andere Providerfehler bleiben Fehler.

**Aktuelle Vercel-Beobachtung vor Reparaturdeployment:** Request-Logs laut Oberfläche etwa 09:02–10:02 Uhr ohne Einträge, Warnung/Fehler/Fatal jeweils 0. Firewall-Zeitraum laut Oberfläche 05.11. 10:00–06.11. 10:00: 726 Allowed, 79 Denied, rund 1.300 Challenged; Rate Limited „-“. Regeln: Bot Protection rund 1.200, DDoS Mitigation 171. Diese Kategorien nicht addieren und nicht als nachgewiesene Formularspamfälle ausgeben. Die eigene Lead-Regel liefert separat „No Data“. Keine Schutzregel gelockert, kein Tarifupgrade und keine 2FA-Änderung vorgenommen.

**Lokale Abnahme, 06.11.2026 10:04 Uhr:** Gezielte Origin-/Link-/Browser-POST-Korrekturen und deterministischer Brevo-Idempotenzkey pro Token umgesetzt. API-Regression 14/14 erfolgreich, frischer Astro-Build 69 Seiten, Formularregression 23/23 und Rechnerregression 4/4 auf Desktop/Mobil bestanden; sämtliche Browser-POSTs abgefangen. Zunächst war der alte Preview-Server nicht mehr erreichbar; er wurde lokal neu gestartet, danach frischer Build und erfolgreiche Regression. Kein Brevo-Testversand. Der zusätzliche Idempotenzschutz ist derzeit anhand offizieller API-Dokumentation und zustandsbehaftetem Provider-Mock belegt, nicht durch Live-Wiederholungsversand.

**Produktionsfreigabe, 06.11.2026:** Nur die fünf geprüften Dateien `api/lead.ts`, `api/confirm.ts`, `qa/test_brevo_api.mjs`, `todo.md` und `.manus/knowledge-base.md` wurden auf dem aktuellen Remote-Parent veröffentlicht; erzeugte Build-/node_modules-Dateien ausgeschlossen. Remote-Commit `7eb566800dcf14b41082af3e455999f92badac15`, lokaler Codecheckpoint `8d9a8e36`. GitHub meldet für `Vercel – leipzig-photovoltaik` success; Deployment https://vercel.com/presolaris-projects/leipzig-photovoltaik/B8Zstnkgt55oEuMtvVLiEtx71Pmg . Der Bestätigungsendpunkt zeigt nach dem Deployment im echten Nutzerbrowser beim absichtlich ungültigen Token korrekt „Link nicht verfügbar“; kein Versand. Der parallele Pages-Lauf `42192386408` war beim erfolgreichen Vercel-Check noch queued und ist nicht der Host der Produktionsdomain.

**Verbleibend:** SPF wurde nicht verändert; Brevo-DKIM, Ownership-TXT und DMARC-Reporting wurden nicht publiziert, weil KAS weiterhin nicht nutzbar angemeldet ist. `BREVO_SENDER_EMAIL` wurde nicht vor einer erfolgreichen Domainauthentifizierung umgestellt. Keine neue Betreiber-/Kundenmail gesendet. E2E darf erst nach Authentifizierung und konkret freigegebenem, zugänglichem Testempfänger als abgeschlossen gelten. Aktuelles DNS-Korrekturpaket: `/home/ubuntu/Brevo-DNS-Korrekturpaket-presolaris-2026-11-06.md` mit exakten Werten und sicherer Reihenfolge; Codefehler nicht mit DNS-/Zustellproblemen vermischen.

**Zugangsmuster, 06.11.2026:** Der abschließende normale `git push` wurde erneut mit „Invalid username or token“ abgewiesen. Das betrifft den Git-HTTPS-Zugang, nicht den unabhängig positiv geprüften `GH_TOKEN`-REST-Zugang mit Push-Rechten. Keine wiederholten Push-/Loginversuche. Abschließende Dokumentation über den bereits funktionierenden Git-Data-API-Weg übertragen, mit exakt ausgewählten Dateien, vorherigem Parent-Abgleich, Tree-Gleichheit zum geprüften Checkpoint und `force: false`. Kein Workflow geändert und keine Secretwerte ausgegeben.

**Abschließende Beobachtung, 06.11.2026 10:09 Uhr:** Auch der reine Remote-Dokumentationscommit `34fe42fb9c43c875ff9dd98c2842742b545ecc51` hat einen erfolgreichen `Vercel – leipzig-photovoltaik`-Check (Deployment `4oNd4mndZT3n5PwSj4VSdLVqRh5V`); die geprüften Serverquellen sind unverändert. Die fertig geladene Request-Logansicht zeigt im Stundenfenster ca. 09:09–10:09 genau zwei eigene Negativtest-GETs auf `/api/confirm/` um 10:02:03.34 und 10:07:06.62, jeweils HTTP 200; Warnung/Fehler/Fatal jeweils 0. Das sind ungültige Tokenaufrufe mit neutraler Fehlerseite, weder erfolgreiche Bestätigungen noch Mailversand. Keine weiteren Requests im gewählten Fenster angezeigt. Der positive Deploymentstatus und diese Negativtests ersetzen weiterhin keinen echten E2E-/Postfacheingangsnachweis. Dieser letzte Beobachtungsvermerk wird lokal gesichert, ohne einen erneuten reinen Dokumentationsdeployment auszulösen.

## Nummerierte Zustelltests zur Fehlerlokalisierung (06.11.2026, 10:39 Uhr)

**Nutzerauftrag:** Nummerierte Zustelltests erstellen, um Fehler eindeutig einzugrenzen. Erstellt ist die Vorlage `.manus/Zustelltest-nummeriert-2026-11-06.md` mit zehn Prüfschritten `ZT-01` bis `ZT-10`, kopierfertiger QA-Formularnachricht und ausfüllbarem Ergebnisprotokoll. Die Schritte gehören zu genau einer Erst-Anfrage mit Laufkennung `PV-ZT-20261106-001`; es wurden keine Testmails gesendet und keine DNS-, Website-, Sender- oder Firewallwerte geändert.

**Wiederverwendbares Muster:** Freigabe/Domain → Erst-POST 202 mit JSON-/Message-ID-Prüfung → Bestätigungs-Postfach → Authentifizierung → Link-GET ohne Betreiber-Mail → bewusster Bestätigungs-POST mit tatsächlicher Erfolgsseite → Betreiber-Postfach mit Testkennung/Reply-To → optionale Replayprüfung im Tokenfenster → späterer Ablauf-GET → vollständige Logkorrelation. Erster auffälliger Schritt bestimmt die Diagnose; keine Serienübermittlung. Technischen E2E, Zustellqualität und Sicherheits-Zusatzprüfungen getrennt beurteilen. Letzter bekannter Domain-/Empfängerblocker bleibt offen.

**Aktueller Quellbefund:** Die Testkennung kann im Formularfeld `nachricht`/`message` mitgeführt werden und erscheint in der Betreiberbenachrichtigung. Der feste Betreff/Text der ersten Bestätigungs-Mail enthält sie dagegen nicht. Erste Mail daher über Empfängerreferenz, Zeit und Brevo-Message-ID zuordnen; keine automatische Nummerierung der bestehenden Mailbetreffe behaupten. `api/confirm.ts` verwendet HTTP 200 auch für „Link nicht verfügbar“, „Bestätigung derzeit nicht möglich“ und „Anfrage bereits verarbeitet“. HTTP 200 nie als alleinigen Versandbeleg werten.

**Neue Quellen, geprüft am 06.11.2026:** https://help.brevo.com/hc/en-us/articles/208858829-Review-your-transactional-email-reports beschreibt Transaktionslogs, Empfänger/Sender/Message-ID und Ereignisse Delivered, Blocked, Soft/Hard Bounce, Deferred sowie Error. https://help.brevo.com/hc/en-us/articles/115000188150-Troubleshooting-Issues-with-Brevo-SMTP nennt auch für ausbleibende API-/Transaktionsmails Absenderauthentifizierung, Versandkontingent, Plattformaktivierung, Empfängersperren und Ablehnung durch den Empfänger; die SMTP-Port-/Passwortabschnitte nicht auf die hier verwendete HTTPS-API übertragen. https://support.google.com/mail/answer/29436?hl=de beschreibt „Original anzeigen“ und die Lieferdauer in Gmail. Relevanz: belastbare Eingrenzung einer API-Annahme ohne tatsächlichen Postfacheingang.

**Was nicht funktioniert als Diagnose:** Nur im Betreff nach einer Kennung suchen, die im Bestätigungstemplate nicht enthalten ist; Mailtracking als tatsächliche Bestätigung ausgeben; bei 429 pauschal Brevo verantwortlich machen; Secrets, aktive Links oder vollständige sensible Mailheader in Berichte übernehmen. Die vorbereiteten Fünf-/Zehn-Minuten-Beobachtungsfenster sind Testschwellen, keine Zustell-SLA. Vorlagenerstellung und Testdurchführung getrennt markieren.

## Tatsächlicher ZT-01-Start (06.11.2026, 10:45 Uhr CET)

Aktueller Auftrag: ZT-01 bis ZT-03 jetzt durchführen, Logs prüfen, DNS-Zusammenfassung liefern und Skill ergänzen. Brevo-Domainliste um 10:45 Uhr zeigt `presolaris.de` weiterhin „Nicht authentifiziert“. Google und Cloudflare DoH bestätigen SPF `v=spf1 a mx include:spf.kasserver.com ~all`, DMARC `v=DMARC1; p=none;`, keine Brevo-Ownership-TXT und keine `brevo1._domainkey`/`brevo2._domainkey`-CNAMEs. Rohbelege `.manus/zt01-dns-2026-11-06.json`. ZT-01 daher BLOCKIERT; ZT-02/03 werden nicht durch Serienversand oder Nutzung einer fremden authentifizierten Projektdomain umgangen. Keine neue Mail, kein Formularpost, keine Änderung an DNS/Absender/Firewall. Der aktuelle Benutzerauftrag erlaubt eine echte Betreiber-QA, ersetzt aber die definierte Domain-Voraussetzung des ZT-01 nicht.

**Aktuelle Logprüfung, 06.11.2026 ca. 10:46–10:47 Uhr CET:** Vercel Request Logs im Stundenfenster ca. 09:46–10:46 zeigen nur die zwei früheren eigenen GET-Negativtests auf `/api/confirm/` um 10:02:03.34 und 10:07:06.62, beide HTTP200. Warnings/Errors/Fatals jeweils0. Kein neuer Lead-POST für Lauf001, da ZT01blockiert. Brevo Transaktionslogs vom 30.10.–06.11. zeigen16Events (nicht16Mails) ausschließlich zum Bestätigungs-Mail-Betreff, darunter Zugestellt/Versendet/Angeklickt und Proxyereignisse. Neuester sichtbarer Eintrag05.11.11:03, Geschäftsabsender j.kolpin@presolaris.de. Keine Betreiberbenachrichtigung in diesem Ausschnitt sichtbar; Trackingklick nicht mit bewusstem ConfirmPOST gleichsetzen, deshalb kein nachgewiesener Weiterleitungsfehler allein hieraus. Keine Kundentokens oder Empfängeradressen übernommen und keine Kundennachricht verändert/erneut verschickt. Tagesfilter06.11.–06.11. zunächst0Logs; abschließende fertige Ansichtsprüfung erforderlich, keine neuenTestzustellungsbelege.

**Abschließende Einordnung, 06.11.2026 ca.10:48UhrCET:** Der eingegebene Brevo-Tagesfilter06.11.–06.11. blieb nach erneuterAnsichtsprüfung nicht bestehen. Belastbar ist die vollständig angezeigte Ansicht30.10.–06.11. mit16Events und neuestemEintrag05.11.11:03; keine neueMail in diesenZeilen. LeereZwischenansicht nicht als dauerhaftenTagesfilter behaupten. EndgültigesErgebnis `.manus/ZT-01-bis-03-Protokoll-2026-11-06.md`: ZT01BLOCKIERT, ZT02/03NICHTDURCHGEFÜHRT. KeineeigenmächtigeDNS-/Mail-/Firewalländerung.

**DNS-Zusammenfassung und offizielleQuelle:** `.manus/SPF-DKIM-DMARC-Zusammenfassung-2026-11-06.md` enthält aktuelleMessung, exaktezuletztabgeleseneBrevo-Zielwerte und sichereÄnderungsreihenfolge. https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC am06.11.erneutgelesen: SPF/MX für normaleDomainauthentifizierung nichtnötig; vorhandenenDMARCRecord umruaergänzen, nichtduplizieren. rua betrifftReporting, nichtalleinMail-Pass. EigenerAbsender erschien bereits inälterenBrevoLogs, daher nicht ohneBefund neueSenderänderungverlangen. ErfolgreicheAltzustellungen trotzDNS-Lücke nichtals unmöglichenVersand darstellen.

**Skill-Ergebnis:** Vorhandener lokaler `/home/ubuntu/skills/vercel-brevo-double-optin/SKILL.md` erweitert, nichtverdoppelt. NeueRessourcen `references/zustelldiagnose.md` und `templates/zustelltest-protokoll.md`. quick_validate.py --path erfolgreich (`Skill is valid!`), Kern116Zeilen. GenerischePlatzhalter stattProjekt-DNS-Code, keineaktivenTokens. Cloudlieferung einmalperSKILL.md; keinArchivundkeinautomatischesÜberschreibeneinesinstalliertenSkills. KeineProduktionsänderungausSkill-Auftrag.

## Gewünschter Website-Absender kontakt@leipzig-photovoltaik.de (06.11.2026, 10:50 Uhr)

Nutzer hat die Verifizierung exakt dieser Adresse bei Brevo beauftragt. Die Absenderliste zeigt nur die zwei bisherigen verifizierten Adressen; die neue Website-Adresse fehlt. Absenderdialog `/senders/add` geöffnet. Vorgesehener erkennbarer Name: `Leipzig Photovoltaik – Presolaris`. E-Mail-Adresse und Domain sind jetzt `leipzig-photovoltaik.de`, nicht mit der früheren Domain `presolaris.de` vermischen. Google DoH bestätigt MX `10 w012fef8.kasserver.com.`, SPF `v=spf1 a mx include:spf.kasserver.com ~all` und DMARC `v=DMARC1; p=none;` für die neue Domain. Die Mailboxexistenz/Weiterleitung ist damit nicht nachgewiesen.

Browserblocker ca.10:52Uhr: My Browser verliert teilweise das aktive Tab bzw. fokussiert den NordPass-Erweiterungsdialog. Direktnavigation zum Absenderformular funktioniert; Eingabe und Escape scheitern mit `Cannot access a chrome-extension:// URL of different extension`, browser_console_exec ist dort `Unsupported browser action in payload`. Kein wiederholter Secret-/Loginversuch, kein Absender gespeichert, keine Verifizierungsmail gesendet, keine Vercel-/DNS-Änderung. Zur Fortsetzung zunächst störenden Passwortmanagerdialog manuell schließen lassen, danach die autorisierte Absenderverifizierung ausführen. Absender-E-Mail-Verifizierung verlangt Zugriff auf die Code-Mail; sie ist unabhängig vom vollständigen DNS-Domainauthentifizierungsnachweis.

## Website-Domain jetzt authentifiziert (06.11.2026, 10:59 Uhr CET)

Nach Nutzerhinweis „Domain ist hinterlegt“ wurde die Brevo-Domainliste erneut live geprüft: `leipzig-photovoltaik.de` steht jetzt auf **Authentifiziert** (vorher nicht in der Liste). `presolaris.de` bleibt separat Nicht authentifiziert; deren frühere DNS-Berichte gelten nicht für die neu authentifizierte Website-Domain. Die erfolgreiche Domainanlage/-authentifizierung wurde durch den Nutzer bzw. außerhalb der zuvor blockierten Agentenaktionen vorgenommen, nicht als eigene DNS-Veröffentlichung ausgeben. Der Auftrag zur Verifizierung von `kontakt@leipzig-photovoltaik.de` wird fortgeführt. Bei authentifizierter Domain kann die separate Absender-Codeprüfung entfallen; entscheidend ist der tatsächlich sichtbare Absenderstatus.

## kontakt@leipzig-photovoltaik.de erfolgreich verifiziert (06.11.2026, 11:01 Uhr CET)

Nach der Nutzerübernahme war der Browserblocker beseitigt. Die authentifizierte Website-Domain wurde live in Brevo bestätigt und öffentlich unabhängig geprüft: zusätzlicher Root-Ownership-TXT vorhanden, `brevo1._domainkey.leipzig-photovoltaik.de` → `b1.leipzig-photovoltaik-de.dkim.brevo.com.` und `brevo2._domainkey.leipzig-photovoltaik.de` → `b2.leipzig-photovoltaik-de.dkim.brevo.com.`. SPF unverändert KAS, DMARC weiterhin `v=DMARC1; p=none;`.

Agent hat im bestehenden Brevo-Konto genau einen Absender mit Namen `Leipzig Photovoltaik – Presolaris` und E-Mail `kontakt@leipzig-photovoltaik.de` angelegt. Anschließend zeigt die fertig geladene Absenderliste exakt diese Adresse als **Verifiziert** mit DKIM-Signatur **leipzig-photovoltaik.de**. Wegen authentifizierter Domain entfiel die separate Code-Mail; kein Postfachcode erforderlich und keine Verifizierungsmail manuell ausgelöst. Kein Nutzer-/Kundenzustelltest durchgeführt. Nachweisansicht: https://app.brevo.com/senders/list um11:01Uhr; lokale HTML-Evidenz `/home/ubuntu/upload/app.brevo.com_senders_list_1793959263963.html`.

Brevo weist noch auf den fehlenden DMARC-`rua`-Tag hin. Das Reporting bleibt offen, ist aber kein fehlgeschlagener Absendernachweis. Keine automatischen Änderungen der Vercel-Produktionsvariable `BREVO_SENDER_EMAIL`, keine neue Websitebereitstellung, keine Änderung der bisherigen Empfängerroute und keine stillschweigende Senderumstellung. Für spätere E2E-Fortsetzung die nun verifizierte Website-Adresse als gewünschte Geschäftsabsenderadresse berücksichtigen und Produktionsvariable getrennt prüfen; alte Berichte über `presolaris.de` sind historisch/andere Domain und nicht der aktuelle Website-Domainstatus.

## Freigegebener Website-Senderwechsel und DMARC-Reporting (06.11.2026, 11:08 Uhr)

Nutzer beauftragt ausdrücklich die Ergänzung von `rua` für die Website-Domain, Vercel-Senderwechsel auf `kontakt@leipzig-photovoltaik.de` und den Live-Test. KAS-Sitzung ist aktuell nicht angemeldet. Auswahl des passenden Passwortmanagerlabels führte weiterhin zum früher als falsch bekannten Kontakt-Login; dieser wurde nicht abgesendet. Keine unbestätigte Kontokombination ausprobieren. Automatisch erzeugten HTML-Loginbeleg mit Passwortfeldern entfernt, keine Zugangsdaten dokumentiert. DNS-Schritt vorerst zugangsabhängig. Das fehlende DMARC-Reporting ist unabhängig von der inzwischen authentifizierten Website-Domain/DKIM und dem verifizierten Kontaktabsender; keine falsche erneute Domain-Sperre daraus ableiten.

**Vercel Senderänderung, 06.11.2026 11:10 Uhr CET:** Vorhandene `BREVO_SENDER_EMAIL` ausschließlich in Production bearbeitet und `kontakt@leipzig-photovoltaik.de` gespeichert; UI zeigt Updated just now. Preview, Betreiberempfänger und API-/Signing-Secrets nicht geändert. Bestehender Code in `api/lead.ts` und `api/confirm.ts` liest diese Produktionsvariable bereits; daher keine unnötige Hardcodierung/Codeänderung. Angefordert wurde Redeploy des bisherigen Current/main-Deployments mit neuesten Projekteinstellungen. Vercel verlangt dafür erneute Identitätsverifikation; einmal Send Code an hinterlegtes Betreiberpostfach. Im zugänglichen Gmailproimpera am11:11/11:12 gezielteheutigeVercelsuchen ohneTreffer, Code nichtabrufbar. Noch kein neuerProductiondeployment; Live-Zustelltest fürneuenSender deshalbnichtbegonnen. KeineAuth-/2FA-Prüfungumgangen oderdeaktiviert.

**Skill-Auslieferung:** Bestehender Skill `/home/ubuntu/skills/vercel-brevo-double-optin/SKILL.md` um generischen Absender-/Domainwechsel erweitert. Neue `references/absenderwechsel.md`, aktualisierte Diagnose und Protokolltemplate. quick_validate erfolgreich, Kern122Zeilen. Voller DOI-Nachweis verlangt bewussten Confirm-POST und Betreiberpostfach über ZT01..03hinaus. Kein neuerSkill, Archiv oder automatisches Überschreiben einer installiertenFähigkeit. Ergebnis nur einmal perSKILL.mdlinkliefern.

**Dokumentationsfehler und Wiederherstellung (06.11.2026):** Neue Aufgaben wurden versehentlich mit Überschreiben statt Anhängen in todo.md eingetragen. Bei Checkpoint-Prüfung erkannt; vollständigen bisherigen Inhalt aus dem unmittelbaren sicheren Git-Parent wiederhergestellt und aktuellen Abschnitt angefügt, Prefix- und Zeilenzahlprüfung erfolgreich. Keine Historie auf Remote gelöscht, keine Websitequellen betroffen. Künftig append explizit und negative Diff-/Zeilenzahlkontrolle vor Dokumentationscommit.

**Vercel-Identitätscode (06.11.2026, 11:15 Uhr):** Nutzer übermittelte Code. Ursprünglicher Eingabedialog war nach Navigation nicht mehr aktiv und Tabwahl wird von diesen My-Browser-Werkzeugen nicht angeboten; erneutes Öffnen des Codefelds löste einen neuen Codeversand aus. Der zuvor übermittelte Code wurde einmal eingegeben und von Vercel unmittelbar als invalid/expired abgelehnt. Kein weiterer Verify-/Rate-Limit-Versuch; aktuellen Code aus der jüngsten Mail anfordern, Dialog danach unverändert offen halten. Keine Codes in Bericht/Wissensbasis ablegen. Deployment weiterhin offen. Für künftige OTP-Abläufe Originaldialog nicht verlassen, wenn kein zuverlässiger Tabwechsel verfügbar ist; lieber Code direkt anfordern als durch Navigation/Neuanforderung unnötig invalidieren.

**Production Ready (06.11.2026, 11:17 Uhr CET):** Zweiter aktueller Nutzer-Code erfolgreich direkt im offenen Dialog bestätigt. Neuer Redeploy `4uRLLhdkvUe9ppovYripvfXMrd4f` / `leipzig-photovoltaik-3k9pso7h1-presolaris-projects.vercel.app`, Ready in38s, kanonischeWebsitezugeordnet. GleicherMain-Stand `34fe42f`, keineCodeänderungen. Livekontakt um11:18 öffentlichimNutzerbrowsererreichbar, keinPOST ausgelöst. From-Nachweis derneuenMail bleibtLive-QA.

**DMARC 11:18 Uhr CET:** Google- undCloudflare-DoH zeigen weiterhin genau `v=DMARC1; p=none;`, TTL7200, keinrua. ExterneBrevoReportingautorisierung unter `leipzig-photovoltaik.de._report._dmarc.dmarc.brevo.com` bei beidenResolvern `v=DMARC1`, TTL300, nachgewiesen. ErgänzungdesbestehendenRecords um `rua=mailto:rua@dmarc.brevo.com` bleibtmangelsKASloginnochungeschrieben. NichtalsbloßePropagationdarstellen. QApostfachproimperaist aktuellzugänglich; vorVersandkonkrete Freigabe für dieseAdresse einholen und nichtautomatischausOktober-Test übernehmen.

## DMARC rua in KAS ergänzt (06.11.2026, 11:24 Uhr CET)

Nach Nutzerübernahme KAS-Konto korrekt angemeldet. Genau die Zone `leipzig-photovoltaik.de` und den bestehenden einzigen `_dmarc`-TXT geöffnet. Alter Wert `v=DMARC1; p=none;`, neuer Wert `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com;`. KAS nach Speichern: „Erfolgreich! Der DNS Eintrag wurde bearbeitet.“ Tabellenbestand weiterhin12Records, keinDuplikat, SPF/MX/Brevo-DKIM/KAS-DKIM/Resend-Records/A/CNAME/Ownership unverändert. ExterneBrevoReportingautorisierung um11:18 bereitsöffentlichbelegt. KeineRichtlinienverschärfung, keine sonstigenDNSänderungen. Management-Speicherung istbelegt; DNS-Veröffentlichung undrecursiveCache/BrevoWarnung gesondertprüfen, nicht ausSpeichernableiten. Live-Testadresse nach Nutzer-„eingelogt“ weiterhinnicht ausdrücklichbestätigt, keineTestmail.

**DMARC veröffentlicht und bei Brevo grün (06.11.2026, 11:25 Uhr CET):** Google-DoH11:24:42 undCloudflare11:24:47 bestätigen neuen einzigenTXT `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com;`, TTL7200. Rohantworten `.manus/dmarc-rua-dns-2026-11-06.json` ohneSecrets. BrevoDomainlisteAuthentifiziert; KonfigurationdesWebsiteeintrags zeigtOwnership undbeideDKIM sowieDMARC jeweils success undübereinstimmendeWerte, keinefehlenderuaWarnung imfertigenextrahiertenInhalt. KeinepauschaleSPAMfrei-/Inboxgarantie. EchteTestadresse nochzurkonkretenFreigabeoffen.

## Tatsächlicher Live-Zustelllauf mit neuem Website-Absender (06.11.2026, 11:31–11:43 CET)

Nutzer hat um11:28 ausdrücklich `proimpera@gmail.com` für genau einen Betreiber-QA-Lauf freigegeben. Agent hat das Live-Kontaktformular mit Kennung `PV-ZT-20261106-001`, veröffentlichten Betreiber-Kontaktdaten und eindeutigem QA-Hinweis einmal bewusst abgesendet. Vercel11:31:33 POST `/api/lead/`202; Formular zurückgesetzt, grüner Hinweis zur Mailbestätigung. Tatsächliche Erstmail im Gmail-Posteingang11:31, nichtSpam, From `kontakt@leipzig-photovoltaik.de`.

**Empfangsheader:** Originalnachricht zeigt SPF PASS für Provider-Envelope `gw.d.sender-sib.com`, DKIM PASS mit `header.i=@leipzig-photovoltaik.de`, Selector brevo1, DMARC PASS für sichtbare Website-From-Domain, PolicyNONE; Gmail meldet Zustellung nach2Sekunden. Damit neuer tatsächlicher From und DKIM-Alignment belegt. Keine Root-SPF-Duplikate/BrevoIncludes ergänzen: Provider-SPF und Website-Root-SPF sind unterschiedliche Prüfungen. Originalmail nicht heruntergeladen; aktive Links/Tokens nicht in Dokumentation übernommen.

**DOI:** Vorab produktiven GET-Code auf rein rendere Bestätigungsseite geprüft. Echtes GET11:34/11:35 zeigt Bestätigungsseite; bewusst einmal Confirm-Button um11:36:04 geklickt, HTTP200 und tatsächlicher Inhalt „Anfrage bestätigt“. Brevo bestätigt separate Betreiber-Mail an unverändertes `j.kolpin@presolaris.de`, From Website-Kontaktadresse, Reply-To QA, Versendet/Zugestellt11:36. Unterschiedliche Message-IDs für Erst-/Betreiber-Mail belegen zwei verschiedene Mails. Sieben heutige Events sind Sent/Delivered/FirstOpen/Open/Click für Erstmail und Sent/Delivered für Operator, nicht sieben Sendungen. Keine Fehler/Bounce/Blocked-Ereignisse im angezeigten heutigen QA-Ergebnis.

**Vercel-Korrelation:** Stundenfenster10:40–11:40CET enthält LeadPOST202, zwei ConfirmGET200 und zwei ConfirmPOST200. Warning/Error/Fataljeweils0. ZusätzlicherPOST11:36:55 war kein zweiter geplanter Agent-Lauf; paralleles Fenster zeigt „Anfrage bereits verarbeitet“, inBrevo weiterhin nur eineOperator-Mail mitID. Beobachtete Wiederholungsbehandlung nichtalsExactly-once-/Langzeitgarantie verkaufen. POSTdetail bestätigt FirewallAllowed und aktuellesProductiondeployment `dpl_4uRLLhdkvUe9ppovYripvfXMrd4f`. Kein allgemeinerSpamfrei-Nachweis außerhalbdesFensters.

**Historische Sichtgrenze um 11:43 Uhr, inzwischen gelöst:** Die Gmail-QA-Suche nach der Kennung fand keine Betreiber-Mail, weil das feste Produktionsziel ein anderes Postfach ist. Brevo-Delivered allein belegte noch keinen Inboxordner, und der separate ALL-INKL-Webmailzugang war beim Login. Um 11:52–11:53 Uhr wurde die tatsächliche Betreiber-Inbox über den vorhandenen KAS-Postfach-Login erfolgreich geprüft; siehe Abschluss unten. Keine neue Testmail nötig. Aktuelles vollständiges Protokoll: `.manus/Zustelltest-Live-2026-11-06.md`.

**Erfolgreiche Patterns und gescheiterte Ansätze:** Gmail-Hashnavigation setzte QA-Suchfilter nicht sichtbar; erstdirektesSuchfeldeingebenundfertigenZustandlesen istbelastbar. GmailOriginal kannneuenTab öffnen; exaktvomBrowserzurückgemeldeteOriginal-URL verwenden,nichtMessageIDpfad raten. DynamischeBrevoDatumsinputs verändernSPA-Elementindizes; nichtalteIDs weiteranklicken. SichtbareKoordinaten fürstabileLogdetail-Buttons verwendbar; ErgebnisnachdemLadenprüfen. ProviderSent+Delivered istkeineDoppelsendung. LeeresQA-Postfachergebnis nichtalsOperatorverlust interpretieren.

BestehenderSkill `/home/ubuntu/skills/vercel-brevo-double-optin` ausschließlichinReferenz `references/zustelldiagnose.md` umgenerischeLive-Erkenntnisse ergänzt; offiziellequick_validateerfolgreich. KeineProjektadressen,IDs,TokensoderSecretsinSkillreferenz übernommen. KeinneuerSkill, keinArchiv, keineautomatischeInstallation/ErsetzungeinerUserfähigkeit.

## KAS-Zugang zur Website-Domain erneut verfügbar (06.11.2026, 11:50 CET)

Die zuvor verwendete KAS-Sitzung führte um 11:48 Uhr zum Login zurück. Ein vorhandener ausgefüllter Zugang wurde einmal mit Verweis auf die MembersArea abgewiesen; derselbe abgewiesene Login wurde nicht erneut gesendet. Nach Nutzer-„go“ zeigte eine frische Browseransicht das korrekte KAS-Dashboard. Den späteren Erfolg nicht aus dem zuvor fehlgeschlagenen Agentenklick ableiten: Nutzer/Browser stellte die Sitzung zwischenzeitlich wieder her. Keine Passwortwerte, Sitzungstokens oder Login-HTMLs in Projektdokumentation übernehmen.

## Vollständige technische Live-Abnahme bestanden (06.11.2026, 11:53 CET)

KAS-Domainverwaltung auf `leipzig-photovoltaik.de` gefiltert und den konkreten Dialog ausschließlich gelesen. KAS meldet einen externen Webserver; PHP-/SSL-Webspacewerte nicht als Fehler der aktiven Vercel-Produktion interpretieren und nichts ändern. Danach `E-Mail → E-Mail-Postfach`, auf das tatsächliche Betreiberziel `j.kolpin@presolaris.de` filtern und den **Loginlink genau dieser Postfachzeile** nutzen. Nicht den allgemeinen Webmail-Link wählen und nicht wegen eines unbekannten Postfachpassworts unnötig eine Passwortänderung verlangen.

Der Postfach-Loginlink öffnete erfolgreich eine autorisierte Webmail-Sitzung des richtigen Betreibers. Um 11:52 Uhr war die um 11:36 Uhr empfangene Nachricht „Bestätigte Anfrage von leipzig-photovoltaik.de – kontakt“ tatsächlich im **Posteingang** sichtbar. Ausschließlich diese Nachricht wurde um 11:53 Uhr geöffnet. Inhalt bestätigt: neue Website-From-Adresse, richtiges Betreiberziel, Formular `kontakt`, freigegebene QA-Adresse, Testname, Betreiber-Telefon/PLZ/Ort und die eindeutige Kennung `PV-ZT-20261106-001` im Nachrichtenfeld samt ausdrücklichem QA-Hinweis.

ZT-01 bis ZT-07 und technische Logkorrelation sind damit für diesen einen Lauf bestanden. Erstbestätigung tatsächlich im Gmail-Posteingang mit SPF/DKIM/DMARC-PASS; separate Betreiber-Mail ebenfalls tatsächlich im richtigen Posteingang. Vollständige Betreiber-Empfangsheader nicht zusätzlich geprüft; allgemeine Spamfreiheit, Exactly-once, ein dedizierter Replay-/Ablauftest oder andere Formularquellen dadurch nicht belegt. Keine zweite Erst-Anfrage, neue Mail, Weiterleitung, Löschung, Passwort-/Mailbox-/DNS-/Hostingänderung beim Abschluss.

**Wiederverwendbares Muster:** Bei fehlendem direkten Webmailzugang zunächst die bereits autorisierte Providerverwaltung und den konkreten Postfach-Login prüfen. QA-Postfach, Website-Absender und festes Betreiberziel sauber trennen. Provider-Delivered mit tatsächlichem Ordner und Laufkennung ergänzen, nicht bloß HTTP200 oder Mailtracking als Inboxbeweis verwenden. SSO-Sitzungskennungen nur transient nutzen. Dieses generische Muster nach Skill-Creator in `vercel-brevo-double-optin/references/zustelldiagnose.md` aufgenommen und mit dem offiziellen Validator erfolgreich geprüft. Keine Dublette oder automatische Ersetzung eines installierten Skills.

## Formularabdeckung und sicher gestoppter automatisierter Live-Check (06.11.2026, 12:01 CET)

Inventar im aktuellen Code: zehn öffentliche Leadquellen (Mehrschrittformular, Exit-Intent-Popup und Solarrechner-Dialog auf der Startseite; Kontakt, Gewerbe, Service, Gewerbe-PV Leipzig, PV-Wartung, PV-Reinigung, Solarpark-Betreuung). Das Layout integriert das Exit-Intent-Popup global; der einzelne homepage-Popup-Test ist deshalb kein eigenständiger Test jeder Seite. Admin-/Analytics-/Dashboard-/SEO-Loginformulare sind keine öffentlichen Leadformulare. Wallbox, Stromspeicher und Solaranlage haben kein separates direktes Leadformular im Seitenquellcode, aber das globale Popup bzw. Links zu den zentralen Anfragewegen.

Lokale Ergebnisdateien `qa/fixed-site-regression.json` und `qa/calculator-fixed-regression.json` aktuell geprüft: 23/23 bzw.4/4 bestanden, Desktop1365/Mobil390, alle POSTs simuliert/blockiert. 23 Fälle sind keine23Formulare: sie umfassen10Leadwege auf2Viewports,2Anhangfälle undRatgeber-PDF/keinFake-Hauptformular. EchtesE2E weiterhinnurKontakt-Lauf001mitbeidenPosteingängen.

Live-Readiness-Audit `.manus/check_production_form_inventory.py` ermittelt62 öffentlichegerenderteRoutenmitLeadformmarkup ausdist, ohneinterneLogins/noindex. Die ersten3 Live-GETs (`/agb/`, `/blog/`, `/blog/fehler-solarkauf/`) wurdenvomEdge mit429abgewiesen; verbleibende59nichtgeprüft, Skriptstopptbewusst. Rohbefund `qa/production-form-inventory-2026-11-06.json`. HeadlessLive-Rechnerfälle ebenfallsTimeoutstattDOMzugriff (4/4nichtbestandenimHarness, keinbelegterRechnerdefekt). LaufendeLiveFormularregressionnachdemEdgebeleggestoppt. KeineSchutzregelabgeschaltet,keineechtenTestmailsversendetundkeinelokalenBaseline-JSONüberschrieben. DieseErgebnissealsZUGANGBLOCKIERTausweisen, nichtalsPassoderalsseitenbezogenenFormularfehler; manuelle echteBrowseransichtbzw.geeigneteautorisierteProduktions-UIAbnahmebleibtoffen.

## Bestätigungslinks 24 Stunden – gezielte Code-Anpassung (06.11.2026, 12:04 CET)

Nutzer berichtet Kundenbeschwerden über bereits abgelaufene Bestätigungsseiten und beauftragt ausdrücklich24Stunden Linkgültigkeit. Neue Ausstellung in `api/lead.ts` und unabhängige Validierung in `api/confirm.ts` verwenden24*60*60*1000ms. VerschlüsselterPayload behältissuedAt/expiresAt; Decoder akzeptiertnurpositive Laufzeitbis24h undweistbeiexaktExpiresAtoderdanachab. KeinpauschalesWiederbelebenvonaltenLinks: bereitsversandte30minTokensbehaltenihrsigniertesAblaufdatum; abgelaufeneAltlinksbleibenungültig. Kundentextnennt24Stunden, FehlerhinweisunterscheidetneueLinks. AusfüllschutzMAX_FORM_AGE_MS48h, Mindest2,5s, Herkunft, Schlüssel undEmpfängerunverändert. KeinSharedModuleimport(damalsVercel500),keineDatenbank,keinFrontenddesign.

Agentenprüfung18/18APItestsbestanden, alleBrevoaufrufestubs. Testsdeckenexakte24hAusstellung,Plaintext+HTML,23h59mGET+POST,exaktAblauf/+1msmit0Versand,negative/Null/>24hDauer,abgelaufene+nochgültigeAltlinks,alle10LeadquellenundbestehendeOrigin/Providerprüfungenab. ParentwiederholtTestsundBuildvorVeröffentlichung. NochkeinaktiverProduktionsnachweisdurchbloßeCodeänderung.

WICHTIG: BrevosProvider-Idempotency-TTLbleibt30Minuten;24hLinkgeltungverlängertnichtautomatischdieseDeduplizierung. GleichesTokenkanndahernachAblaufdesProvider-ReplayfenstersundnochvorTokenablaufeineerneuteBetreiberbenachrichtigungauslösen. Kommentarpräzisiert;keine24hExactly-once-/Replaygarantiebehaupten. PersistentesatomarNonceStoragewärenfürharte24hEinmalverwendungerforderlich,istnichthinterlegtundnichtstillschweigendkonfiguriert. EinneuerEchtmail-LaufnachCodeänderungbedarfseparaterFreigabe;vorherigerKontakt-Lauf001bleibthistorische30minAbnahme.

**24-Stunden-Regel produktiv (06.11.2026, 12:07 CET):** Parent wiederholt18/18Tests; AstroBuild69Seiten erfolgreich. IsolierterWorktree `/home/ubuntu/pv-release-24h-Ejzp` auforigin/main, ausschließlich3API/TestdateienplusTodo/KBveröffentlicht, vollständige lokaleBerichteundCommithistorieerhalten. Checkpoint87b87834, Remotecommitb3bc515b67dbb25e8ee1a8ea5fca0ef19a567b58, APIpublisherexacttreeCheckundFastForwardohneGitLogin. WebsiteVercelchecksuccess, Deployment7NgTF6DJ3t7FgCu92uW5gzpmuKbS direktReady/ProductionCurrentaufleipzig-photovoltaik.de/Commitb3bc515bestätigt. PublicConfirmGETmiteindeutigungültigemQA-Tokenzeigtwirklich24StundenText; keineMailundkeinaktiverToken. Abschlussbericht `.manus/Bestaetigungslinks-24-Stunden-2026-11-06.md`, Umfangsübersicht `.manus/Formular-Testabdeckung-2026-11-06.md`. VollständigeLiveFormularabnahme bleibt wegenHeadlessEdgeblockoffen, echteweitereZustellläufenichtohneFreigabe. AlterKontaktlauf001belegt30minStand, nichtneu24hMail; signierteAltAblaufzeit unverändert. NeueServerfunktionTTL24h aktiv, ProviderReplayTTL30min offenkommuniziert.

## Mehrformular-QA und CI — 06.11.2026,12:55 CET
Zusätzliche Quellen002–007 sind bis zum tatsächlichen Betreiberpostfach belegt;008nurVorbereitung,009/010nochungeprüft. MyBrowser-Verbindung verliert ab12:53Antworten; zweiTimeouts plusNeuverbindungmitAnsichtfehlgeschlagen. NichtalsFormularfehlerauslegenundkeinebisherigenErstsendungenerneutabsetzen. MyBrowser-JavaScriptundMehrfeldeingabesindUnsupported; normaleClick/Inputnutzen, nichtwiederholtunsupportedAktionenprobieren.

BrevoDeduplizierungsanalysein `.manus/Brevo-Deduplizierung-2026-11-06.md`: aktuelleoffizielleTTL30min, nichtöffentlichkonfigurierbar; keinpauschalesEmpfängerpostfachlimit. EigenerUUIDjeVorgang,stabilbeiRetries;24hReplaybrauchtpersistentatomarenVerbrauch/Outbox. Deduplizierungnichtentfernen. OffizielleQuelle https://developers.brevo.com/docs/heterogenous-versions-batch-emails erneutdurchRechercheagentdirektgeprüft06.11.2026; ausführlicheQuellenundUnsicherheitssemantikimBericht.

LokaleCI vollständig7Unit/18API/128Inventar/23Frontend/4Rechnerbestanden,keinrealesMailing. `.github/workflows/form-regression.yml` täglich05:17UTCgeplant, aberRemote-API403;Workflowremote404. Repo-/Actionslesenfunktioniert,darausnichtWorkflow-Schreibrechtableiten. AlternativeautorisierteBrowserverbindungnochprüfen;Zeitplannichtaktivmelden. IsolierterReleaseerhälthistorischeDokumentation. SkillnachSkill-Creatorerweitertundoffiziellvalidiert12:54; neueReferenzmehrformular-ci.md, keinezweiteFähigkeit.

## Solarrechner: Jahresbilanz ist keine Autarkie — Quellen 07.11.2026
Im bestehenden `SolarCalculator.tsx` wird eine heuristische PV-Eigenverbrauchsquote mit dem gesamten Jahresertrag multipliziert und auf den Jahresbedarf begrenzt. Damit wird überschüssiger Sommerstrom rechnerisch wie saisonal speicherbare Energie behandelt. Der Energiefluss splittet diesen Wert außerdem pauschal 40/60 in Direktverbrauch/Speicher, ohne SOC-/Kapazitätsbilanz. Beides muss durch zeitliche Energiebilanzen ersetzt werden, nicht durch einen willkürlichen Prozentdeckel.

https://solar.htw-berlin.de/faq-unabhaengigkeitsrechner/ am07.11.2026 gelesen: Autarkie=(zeitgleicher Direktverbrauch+Batterieentladung)/Last; Eigenverbrauch umfasst Direktverbrauch+Speicherladung. HTW simuliert minutenweise mit DWD-Wetter undVDI4655, keine pauschaleJahresbilanz. NormaleSpeicher ermöglichen keinevollständigeNetzunabhängigkeit. IndividuellesLastprofil,WP/EV,VerschattungundGeometrie erfordernModellhinweise. HTW-Lithiumannahmen roundtrip83,9% mitUmwandlungundAlterung; eigenesModell darf95%jeRichtungnuralsAnnahmebezeichnen,nichtHTW-Passgenauigkeitbehaupten.

https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/pvgis-5-tools/hourly-radiation_en am07.11.2026 gelesen: seriescalc liefertstündlichemodelliertePV-LeistungP(W), UTC-Zeit, EinstrahlungundT2m. GebäudemontageüberAPI wählen. DieseWerte sind satelliten-/reanalysebasierteWettermodelle, nichtMessdatendesKundendachs; keineMittelungzuidealenDurchschnittstagen, umDunkelphasenbewahren.

https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/start.html am07.11.2026 gelesen: aktuelleTeileinspeisungbeiInbetriebnahmeAug–Dez2026 bis10kW7,70ct/kWh, über10bis40kW6,66ct/kWh; gestaffelteLeistungsanteile stattpauschal8,2ctverwenden. FürInbetriebnahmeab2027keinegesicherteNachfolgeregelungbehaupten. Ersparnis=vermiedenerNetzbezug*eingegebenerTarif+Export*Vergütung; laufendeKosten/Degradation/Tarifänderungen gesondertbegrenzen.

## Solarrechner: umgesetzte stündliche Bilanz am 07.11.2026

Der bisherige Jahresquotenansatz ist durch `src/lib/solarSimulation.ts` ersetzt. Als tatsächliche Datenreferenz wird die unveränderte PVGIS-SARAH3-Zeitreihe Leipzig 2023, Süd/30°, 1 kWp, 14 % PV-Systemverlust, thermische `free`-Referenz für hinterlüftete Module verwendet. Die alternative `building`-Serie ist nur ein Forschungsvergleich: PVGIS meint damit vollständig gebäudeintegriert ohne Hinterlüftung, nicht jede Dachmontage. Deshalb wurde die erste Datenmodulversion sachgerecht auf die vorhandene `free`-Serie umgestellt; keine erfundenen Wetterwerte, keine Jahresnormalisierung auf 1.000 kWh/kWp. Rohsumme 1.026,04343 kWh/kWp, gebündelt gerundete Stunden 1.026,078 kWh/kWp. Herkunft und SHA256 stehen in `src/data/leipzigPvReference.ts` und `.manus/solar-reference-2026-11-07/provenance.json`.

Modellregeln: Zunächst direkter PV-Verbrauch, danach Überschussladung; bei Defizit nur tatsächliche verfügbare Speicherenergie. 90 % nominal nutzbar, je 95 % Lade-/Entladewirkungsgrad, max. 5 kW oder 0,5 C; leerer Anfangszustand, keine Netzladung und keine Monatsresets. Autarkie zählt nutzbaren Direktverbrauch plus Entladung; PV-Eigenverbrauch zählt Direktverbrauch plus Ladeinput einschließlich Speicherverlusten. UTC-Stunden HH:10 als Stundenrepräsentanten, Lastzeit in Europe/Berlin einschließlich CET/CEST. Monatsbilanz nach UTC-Monaten, Winter = Januar–März plus Oktober–Dezember desselben Referenzjahrs, nicht ein gemessener zusammenhängender Winter.

Screenshotfall 11 kWp / 4.000 kWh / 10 kWh / 0,37 €/kWh, Süd/30°, keine WP/EV: 11.286,858 kWh PV, 3.403,007801 kWh nutzbare Eigenversorgung, 596,992199 kWh Netzbezug, 7.705,574658 kWh Einspeisung. Jahresautarkie 85,075195 %, Winterhalbjahr 72,464927 %, Januar 58,8 %, Dezember 50,1 %. Laden 1.828,467087 kWh, Entladen 1.650,191546 kWh, Verluste 178,275541 kWh. Dies sind Modellergebnisse mit realer Wetterreferenz, keine gemessenen Kundenwerte oder Mindestgarantien.

UI, Anfragezusammenfassung und zweiseitige PDF verwenden dieselbe Ergebnisinstanz. Es gibt zwölf Monatswerte und expliziten Netzbezug statt eines pauschalen ROI-Versprechens. Vermiedene Stromkosten 1.259,11 € plus modellierte Einspeisung 586,04 € = 1.845,16 €/Jahr vor Betriebskosten. EEG-Staffel: 7,70 ct/kWh für die ersten 10 kWp, 6,66 ct/kWh darüber; gültige amtliche Referenz für Inbetriebnahme Aug–Dez 2026. Keine Rechts-/Preisgarantie für spätere Zeiträume.

Grenzen bleiben sichtbar: Lastprofil, WP +3.000 kWh, EV 20 kWh/100 km und Ladezeiten sind Annahmen. Andere Dachgeometrien sind Skalierungs-/Tagesprofilnäherungen, keine exakten individuellen PVGIS-Läufe. Ein Referenzjahr ist nicht nachgewiesen langjährig durchschnittlich. Stündliche Auflösung glättet kurze Lastspitzen, Standby nicht gesondert berechnet; tatsächlicher Netzbezug kann höher sein. Es werden keine 100 % durch einen künstlichen Prozentdeckel verhindert; vollständig versorgte Sommer-Modellmonate bleiben zulässig, ohne Netzunabhängigkeit oder Inselbetriebsfähigkeit zu behaupten.

Erfolgreiches Performance-Muster: Die vorhandene jsPDF-Bibliothek erst per dynamischem Import beim PDF-Klick laden. Der Wetterdatensatz bleibt lokal gebündelt (etwa 31 KB Quelltext, ca. 10 KB gzip), kein externer Wetter-Request pro Schieberegler. Kalenderoffset zweimal pro UTC-Tag ermitteln, nur am Zeitumstellungstag stündlich; dieselben Zeitzonen-/Bilanztests bestehen weiter. Kein neuer Bild-, Schrift- oder Trackingdienst, keine Änderung an Design, DNS, Brevo oder WAF. Ein neuer produktiver PageSpeed-Score wurde nicht behauptet.

Testdiagnose: Der erste neue UI-Test suchte den Radix-Thumb nach einer Beschriftung, die tatsächlich am Root-Container sitzt. Der Selektor wurde korrigiert; kein Website-/Versandfehler war damit belegt. Danach 32/32 neue Desktop-/Mobil-Assertions, 23/23 bestehende Formularfälle und 4/4 bestehende Rechnerfälle bestanden. Modell 14/14 mit echter Referenz, API 18/18; ausschließlich abgefangene Anfragen, keine echten Testmails. Der endgültige Build wird nochmals gegen dieselben Tests abgenommen und das isolierte Reparaturpaket danach veröffentlicht. Die unfertige CI-Pipeline und die Live-Läufe 008–010 bleiben getrennte offene Aufgaben.

### Abschließender Produktionsnachweis des Solarrechners, 07.11.2026

Rechner-Commit `f1f97423a8a7ef11526086c031472386b08420b9` ist veröffentlicht. Vercel `leipzig-photovoltaik` sowie das zweite angebundene `senec-design`-Projekt meldeten success. Production-Deployment: https://vercel.com/presolaris-projects/leipzig-photovoltaik/EPrahsLE2hYnXk3Kvj5m4wX5Ptjv . Im normalen My Browser auf https://leipzig-photovoltaik.de/#rechner ist die neue Monats-/Winterbilanz mit Modellhinweisen sichtbar. Standardwerte 8 kWp / 4.000 kWh / 5 kWh / 40 ct: 8.209 kWh PV, 71,9 % Jahresautarkie, 1.126 kWh Netzbezug; Winterhalbjahr 51,6 %, 1.050 kWh Netzbezug. Das ist vom Screenshotfall 11 kWp/10 kWh sauber zu trennen. Die Beispiel-PDF für dessen 85,1 % Jahresautarkie ist zweitseitig geprüft.

Finale Abnahme: 14 Modelltests, 18 API-Tests, 32 neue Rechner-Assertions, 23 Formularfälle, 4 Rechnerfälle bestanden; 69 Seiten gebaut. Keine echten E-Mails oder Formular-POSTs. Reproduzierbare Rohdatenkonvertierung und 14 echte Referenztests zusätzlich im isolierten Release bestanden. Der neue UI-Test benötigt die geprüfte `qa/browser_safety.py`; deshalb genau diese Hilfsdatei im Rechnerpaket enthalten, aber keinen CI-Workflow und keine unfertige regelmäßige Pipeline veröffentlicht.

Diagnosegrenzen: Der erneute direkte Produktions-GET wurde mit HTTP 429 abgewehrt, während die normale Browserseite funktioniert. Das ist kein Beleg für einen Seitenfehler. My Browser unterstützt `browser_console_exec` hier nicht; nach der bestätigten Fehlermeldung keine Wiederholung. Produktionsnachweis stattdessen über normalen Browser, sichtbare neue Ergebnisse, gespeicherten DOM-Auszug und erfolgreiche Deployments. Keine Behauptung eines frisch gemessenen produktiven PageSpeed-Scores.
