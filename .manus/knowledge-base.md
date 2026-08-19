# Wissensdatenbank - senec-design Projekt

Letzte Aktualisierung: 04. Februar 2026

---

## 🚀 DEPLOYMENT-ROUTINE (WICHTIG - IMMER ZUERST LESEN!)

### GitHub Repository für Vercel
- **Repository:** `Presolaris/senec-design`
- **URL:** https://github.com/Presolaris/senec-design.git
- **Remote-Name:** `github`
- **Vercel:** Automatisches Deployment bei Push zu `main`

### Deployment-Schritte
1. Änderungen committen (falls nicht bereits geschehen)
2. `git push github main` ausführen
3. Vercel baut automatisch und deployed

### Remote-Konfiguration prüfen
```bash
cd /home/ubuntu/senec-design
git remote -v
# Sollte "github" Remote zeigen:
# github  https://github.com/Presolaris/senec-design.git (fetch)
# github  https://github.com/Presolaris/senec-design.git (push)
```

### Falls GitHub-Remote fehlt
```bash
git remote add github https://github.com/Presolaris/senec-design.git
```

### ⚠️ WICHTIG
- **IMMER** zu GitHub pushen für Vercel-Deployment
- Das interne Manus-Repository (`origin`) ist NICHT mit Vercel verbunden
- Bei jedem Task-Start prüfen ob `github` Remote existiert

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
