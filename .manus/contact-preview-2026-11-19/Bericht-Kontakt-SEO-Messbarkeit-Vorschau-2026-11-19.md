# A. Umgesetzt

**Stand: 19.11.2026 – ausschließlich Vorschau, nicht veröffentlicht.** Ausgangspunkt ist Remote main `fdd3d2ad2107023ecd7be6eb0b21a9dbf0f1d402`. Die Änderungen liegen auf dem lokalen Feature-Branch `preview/kontakt-messbarkeit-2026-11-19`. Es wurden keine produktiven Konto-, DNS-, Domain-, Mail-, Zahlungs- oder Firewall-Einstellungen geändert. Die bereits vorhandenen Rechner-, Garantie-, Förder- und Referenzinhalte wurden nicht ausgebaut.

### 1. Telefon-Link repariert

Alle 37 statisch vorhandenen Telefonanker im Quellcode wurden auf `tel:+4934198990391` und die Anzeige `0341 98990391` geprüft bzw. vereinheitlicht. Dabei wurde nicht nur die fehlende Endziffer im Footer gefunden: Auf der Kontaktseite fehlte ebenfalls eine Ziffer im Ziel. Bereits korrekte Telefonnummern wurden nur in der Anzeige vereinheitlicht. Betroffene Dateien:

- `src/components/Footer.astro`
- `src/pages/faq.astro`
- `src/pages/impressum.astro`
- `src/pages/index.astro`
- `src/pages/kontakt.astro`
- `src/pages/solaranlage-leipzig.astro`
- `src/pages/standorte/elbe-elster.astro`
- `src/pages/standorte/erfurt.astro`
- `src/pages/standorte/leipzig.astro`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro`
- `src/pages/standorte/photovoltaik-delitzsch.astro`
- `src/pages/standorte/photovoltaik-eilenburg.astro`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro`
- `src/pages/standorte/photovoltaik-markkleeberg.astro`
- `src/pages/standorte/photovoltaik-taucha.astro`
- `src/pages/standorte/photovoltaik-wurzen.astro`
- `src/pages/standorte/solaranlage-kaufen-leipzig.astro`
- `src/pages/standorte/solarteur-leipzig.astro`
- `src/pages/standorte/stromspeicher-leipzig.astro`
- `src/pages/standorte/wallbox-leipzig.astro`
- `src/pages/standorte.astro`
- `src/pages/ueber-uns.astro`

Dynamisch aus Kundendaten erzeugte Telefonlinks in internen Admin-Komponenten sind keine Firmen-Kontaktlinks und wurden weder umgeschrieben noch mit Kundendaten getestet. Alle 102 Telefonanker des gerenderten Builds haben das korrekte Firmenziel. Die ausdrücklich gewünschte Rufnummer wurde auch im Telefonlink des Impressums konsistent eingesetzt; Adresse und Firmenname wurden nicht geraten oder überschrieben.

### 2. Anfrageherkunft ergänzt

`src/lib/leadAttribution.ts` erfasst öffentliche Einstiegs- und Formularpfade, die vier erlaubten UTM-Felder und nur die externe Referrer-Domain. `src/lib/leadForms.ts` ergänzt diese Daten zentral für alle zehn bestehenden Formularquellen. `api/lead.ts` und `api/confirm.ts` begrenzen und bereinigen sie nochmals unabhängig; beide Vercel-Funktionen bleiben eigenständig und verwenden keine neue lokale Servermodul-Struktur.

Der vorhandene verschlüsselte Bestätigungs-Token trägt die Herkunft bis zur bestätigten Betreiberbenachrichtigung. Es gibt keine neue Datenbank, keine Besucher-ID und keine zusätzlichen Kundeneingaben. Die erste Anfrage löst weiterhin ausschließlich die bestehende Bestätigungsmail aus; erst der bewusste gültige Bestätigungsklick kann den Betreiber informieren. Die 24-Stunden-Linkgültigkeit, Origin-Prüfung und bestehende Brevo-Deduplizierung bleiben erhalten. Ältere Tokens ohne Herkunft bleiben kompatibel.

**Erfassungsgrenze:** First Touch über vollständige Seitenwechsel wird nur bei Analytics-Einwilligung im `sessionStorage` bewahrt. Ohne Einwilligung bleiben nur sichere Angaben des aktuellen Dokuments im Arbeitsspeicher und können mit der freiwilligen Anfrage übermittelt werden. Frühere Einstiegsseiten oder UTMs werden dann nicht nachträglich erfunden. Diese Grenze ist im Herkunftsblock der Benachrichtigung ausdrücklich erkennbar. Ungültige, URL-/E-Mail-/Telefon-ähnliche Kampagnenwerte und unbekannte/private Pfade werden verworfen; Browserangaben sind kein unabhängig verifizierter Herkunftsnachweis.

### 3. Google-Analytics-Ereignisse ergänzt

Die bestehende Measurement-ID **G-08NXYDBB4F** bleibt erhalten. `src/lib/contactAnalytics.ts`, `src/components/CookieBanner.astro` und `src/layouts/Layout.astro` übernehmen die zentrale Einwilligungs-, Lade- und Widerrufslogik.

| Ereignis | Auslöser | Übermittelte Kontakt-Parameter |
|---|---|---|
| `generate_lead` | Strikt erfolgreiche API-Annahme der Anfrage zur E-Mail-Bestätigung | `form_name`, `page` |
| `click_phone` | Klick auf einen `tel:`-Link | `page` |
| `click_email` | Klick auf einen `mailto:`-Link | `page` |
| `click_whatsapp` | Klick auf einen HTTPS-Link mit exakt `wa.me` als Host | `page` |

Ohne Analytics-Opt-in werden weder GA geladen noch Ereignisse oder cookieless-Pings erzeugt. Ereignisse vor Zustimmung werden nicht nachgeliefert. Fehler, Abbruch und eine wiederholte Annahmequittung zählen nicht nochmals als Lead. Die Quittung dient nur im Arbeitsspeicher zur Deduplizierung und wird nicht an Google gesendet. Query/Hash, Mailadressen, Rufnummern, Formularwerte und Umsatzwerte gehen nicht in die neuen Ereignisparameter. Auch die GA-Seiten-Defaults sind auf öffentliche Pfade und die Referrer-Domain begrenzt.

**Wichtig:** `generate_lead` zählt hier die angenommene Anfrage zur Double-Opt-in-Bestätigung, nicht bereits eine bestätigte Kundenanfrage, einen Verkauf oder eine nachgewiesene Mailzustellung. Die spätere DOI-Betreiberweiterleitung erzeugt kein zusätzliches Browser-Lead-Ereignis.

„Ablehnen“ und „Alle akzeptieren“ sind im Banner gleich groß und gleich gestaltet. Im Einstellungsdialog steht zusätzlich „Nur notwendige“ gleichwertig bereit; Auswahl und Widerruf bleiben möglich. Die GA4-Markierung als Schlüsselereignis wurde nicht vorgenommen – siehe B.

### 4. WhatsApp-Kontakt ergänzt

`https://wa.me/4934198990391` mit der Beschriftung **„WhatsApp“** steht in `src/pages/kontakt.astro` und `src/components/Footer.astro`. Der Link nutzt dieselbe ausdrücklich vorgegebene Rufnummer und erzeugt nur nach Opt-in `click_whatsapp`. `src/pages/datenschutz.astro` beschreibt den freiwilligen Wechsel zu WhatsApp und verweist auf dessen Datenschutzinformation. Es wurde keine WhatsApp-Nachricht geschickt und kein WhatsApp-Konto verändert.

### 5. Bestehende Aussagen unverändert erhalten

Alle geschützten Wortlautvarianten zu 2002, „25+ Jahre“, 2.400 Anlagen, Leistungsgarantie, kostenlos, SAB und Festpreis-Garantie bleiben im Quellcode erhalten. Es wurden keine neuen Zahlen, Referenzen, Bewertungen, Zertifikate, Garantien, Förderzusagen oder Einsparversprechen hinzugefügt. Die automatisierte Differenzprüfung fand **0 geänderte geschützte Treffer**. Abschnitt E enthält sämtliche 316 Fundstellen einschließlich sichtbarer Texte, Metadaten und technischer Markierungen, nicht nur eine Auswahl. Erhaltung ist keine neue Tatsachenprüfung dieser bestehenden Aussagen.

### 6. Social-Links ergänzt

Facebook, Instagram, LinkedIn und YouTube im Footer sind in ihren bisherigen Zielen unverändert. Ergänzt wurde ausschließlich **X: `https://x.com/pv_leipzig`** in `src/components/Footer.astro`.

### 7. Querverweise ergänzt

Der Footer enthält den neuen Block **„Unsere Fachseiten“** mit:

- `https://presolaris.de/` – „presolaris.de – Energieberatung“
- `https://photovoltaik-anlagen-wartung.de/` – „photovoltaik-anlagen-wartung.de – PV-Wartung“

Es wurden nur die vorgegebenen Links ergänzt, keine neuen Leistungs-, Erfolgs- oder Kooperationsbehauptungen.

### 8. /llms.txt angelegt

`public/llms.txt` ist eine einfache Textdatei mit bestehenden Leistungen, Leipzig als Region, vorhandenem Kontakt und zentralen Seitenlinks. Sie enthält keine erfundenen Auszeichnungen oder Rankings und ist keine Garantie für Nennungen in KI-Modellen.

### Geprüfter Vorschauzustand

- Astro-Produktionsbuild: **69 Seiten erfolgreich erzeugt**; zusätzlich die bestehende Redirect-Datei im statischen Inventar.
- Backend/Herkunft: **35 Tests**, davon 18 bestehende API- und 17 neue Attributionsfälle, ohne echte Provideraufrufe.
- Analytics-Code: **12 netzfreie Tests**; strenge TypeScript- und Astro-Syntaxprüfung erfolgreich.
- Neue Analytics-Browserabnahme: **17/17 Assertions je Desktop und Mobil**; echte Consent-Buttons und Formularhandler, aber API/GA vollständig gestubbt.
- Kontakt-/Footer-/Privacy-/llms-Prüfung: **181 Checks erfolgreich**, 70 HTML-Dateien, 102 Telefonanker und 64 Footerinstanzen.
- Bestehende Formularregression: **23/23 Fälle erfolgreich**; bestehende Rechnerregression: **4/4 erfolgreich**.
- **0 echte E-Mails, 0 echte Analytics-Testdaten, keine Veröffentlichung.**

Die Besucher-Vorschau behält eine restriktive Content Security Policy. Nur kontrollierte Playwright-Debugger-Kontexte erlauben `wait_for_function`-Auswertungen; deren Netzwerk- und POST-Sperren bleiben aktiv. Damit wurden vorhandene CSP-bedingte Testfehler behoben, nicht die Website-Schutzregeln abgeschaltet. Die synthetischen Testdaten wurden an bestehende PLZ-/Hausnummern-Validatoren angepasst, ohne Formularregeln abzuschwächen.

# B. Nicht umgesetzt und Grund

1. **Veröffentlichung:** bewusst nicht vorgenommen. Es gab keinen Push, Pull Request, Production-Redeploy oder produktiven GA4-Schreibzugriff. Die Inhaberfreigabe fehlt noch.
2. **`generate_lead` als GA4-Schlüsselereignis:** nicht markiert. Der vorhandene Browserzugang zeigte im Presolaris-Konto keine verfügbare passende Property; eine globale Suche nach „Photovoltaik“ ergab keinen nutzbaren Zugriff. Die Website-Measurement-ID ist unverändert. Auch bei späterem Zugriff wird die produktive GA4-Änderung erst nach ausdrücklicher Freigabe ausgeführt.
3. **Unbedingte historische Herkunft bei abgelehnter Einwilligung:** nicht heimlich nachgerüstet. Ohne consentierten Sitzungsspeicher ist First Touch über vollständige Seitenwechsel nicht rekonstruierbar. Die freiwillige Anfrage kann trotzdem mit dem bereinigten Kontext des aktuellen Dokuments abgesendet werden. Aus Sicherheitsgründen können konservative UTM-Filter auch legitime Sonderzeichen oder lange numerische Kampagnennamen verwerfen.
4. **Abweichende Firmen-/Adressangaben:** nicht geraten oder pauschal überschrieben. In strukturierten Daten wurden unter anderem „Musterstraße 1“ und „An der Hebemarie 7“ gefunden, während das Impressum „An der Hebemärchte 1, 04316 Leipzig“ nennt. Die genauen Fundstellen stehen in C.
5. **Echte Mailzustellung, GA4-DebugView, WhatsApp-Registrierung:** nicht als erfolgreich behauptet. Die Vorschau sperrt produktiven Versand und echte Analytics-Übertragung; ein späterer Integrationstest benötigt gesonderte Freigabe. Auch GA4-Enhanced-Measurement-/Propertyeinstellungen wurden nicht als überprüft oder umkonfiguriert bezeichnet.

# C. Offene Fragen an mich

1. **Firmen-/Adresswidersprüche:** Welche der nachstehenden strukturierten Angaben sind tatsächliche Niederlassungen und welche reine Einzugsgebiets-/Platzhalterangaben? Dürfen diese nach Ihrer Bestätigung an die bestehenden Impressumsdaten angepasst bzw. als Einzugsgebiet modelliert werden? Bisher wurde kein neuer Standort erfunden.
2. **WhatsApp:** Ist die vorgegebene Festnetzrufnummer bei WhatsApp/WhatsApp Business tatsächlich registriert und von Ihnen kontrolliert? Das Linkziel ist wie beauftragt eingebaut; eine Nachricht oder Registrierung wurde nicht ausgelöst.
3. **GA4 und Veröffentlichung:** Bitte getrennt bestätigen, ob die geprüfte Vorschau veröffentlicht werden darf und ob `generate_lead` anschließend in der vorhandenen Website-Property als Schlüsselereignis gesetzt werden soll. Dafür muss der richtige GA4-Verwaltungszugang vorhanden sein. Eine bloße Vorschauprüfung ist keine Veröffentlichungsfreigabe.

### Konkrete abweichende Straßenangaben

- `src/pages/standorte/anhalt-bitterfeld.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/burgenlandkreis.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/dresden.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/elbe-elster.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/erfurt.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/gera.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/leipzig.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/magdeburg.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/nordsachsen.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:30`: `"streetAddress": "An der Hebemarie 7",`
- `src/pages/standorte/photovoltaik-delitzsch.astro:27`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/photovoltaik-eilenburg.astro:28`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:30`: `"streetAddress": "An der Hebemarie 7",`
- `src/pages/standorte/photovoltaik-markkleeberg.astro:27`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/photovoltaik-taucha.astro:28`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/photovoltaik-wurzen.astro:27`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/saalekreis.astro:30`: `"streetAddress": "Musterstraße 1",`
- `src/pages/standorte/solarteur-leipzig.astro:30`: `"streetAddress": "An der Hebemarie 7",`
- `src/pages/ueber-uns.astro:94`: `"streetAddress": "Musterstraße 1",`

### Vorhandene strukturierte Namens-/Ort-/PLZ-Angaben zur Prüfung

- `src/components/LocalBusinessSchema.astro:7`: `"name": "Presolaris Unternehmensgesellschaft (haftungsbeschränkt) ist leipzig-photovoltaik.de",`
- `src/components/LocalBusinessSchema.astro:19`: `"addressLocality": "Leipzig",`
- `src/components/LocalBusinessSchema.astro:20`: `"postalCode": "04316",`
- `src/pages/blog/fehler-solarkauf.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "10 h\u00e4ufigste Fehler beim Solarkauf - und wie Sie sie vermeiden", "description": "10 h\u00e4ufige Fehler beim Solarkauf \u2713 Falsche Dimensionierung \u2713 Billiganbieter \u2713 Keine F\u00f6rderung \u2713 So vermeiden Sie teure Fehler!", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.669537", "dateModified": "2026-02-06T10:42:47.669567", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/fehler-solarkauf/"}})}/>`
- `src/pages/blog/neue-speicher-technologien-2026.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "Neue Speicher-Technologien 2026: Die Revolution der Batteriespeicher", "description": "Neue Speicher-Technologien 2026 \u2713 Natrium-Ionen, Feststoff, Redox-Flow \u2713 Mehr Kapazit\u00e4t, l\u00e4ngere Lebensdauer \u2713 Die Zukunft der Batteriespeicher!", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.670159", "dateModified": "2026-02-06T10:42:47.670165", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/neue-speicher-technologien-2026/"}})}/>`
- `src/pages/blog/photovoltaik-kosten-2026.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "Photovoltaik Kosten 2026: Was kostet eine Solaranlage wirklich?", "description": "Photovoltaik Kosten 2026 \u2713 Was kostet eine Solaranlage? \u2713 1.000-1.400\u20ac pro kWp \u2713 F\u00f6rderung, Rendite, Amortisation \u2713 Jetzt berechnen!", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.670553", "dateModified": "2026-02-06T10:42:47.670558", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/photovoltaik-kosten-2026/"}})}/>`
- `src/pages/blog/solaranlage-wartung.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "Solaranlage Wartung: Warum regelm\u00e4\u00dfige Wartung Ihre Ertr\u00e4ge maximiert", "description": "Solaranlage Wartung Leipzig \u2713 Regelm\u00e4\u00dfige Wartung steigert Ertr\u00e4ge um bis zu 20% \u2713 Verschlei\u00df fr\u00fch erkennen \u2713 Garantie erhalten!", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.670896", "dateModified": "2026-02-06T10:42:47.670900", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/solaranlage-wartung/"}})}/>`
- `src/pages/blog/stromspeicher-2026-lohnt-sich.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "Stromspeicher 2026: Lohnt sich ein Batteriespeicher f\u00fcr Ihre Solaranlage?", "description": "Stromspeicher 2026 \u2713 Lohnt sich ein Batteriespeicher? \u2713 Kosten, F\u00f6rderung, Wirtschaftlichkeit \u2713 Bis 80% Autarkie \u2713 Jetzt informieren!", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.671185", "dateModified": "2026-02-06T10:42:47.671189", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/stromspeicher-2026-lohnt-sich/"}})}/>`
- `src/pages/blog/stromspeicher-nachruesten.astro:15`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "Stromspeicher nachr\u00fcsten: Lohnt sich ein Batteriespeicher f\u00fcr Bestandsanlagen?", "description": "Stromspeicher nachr\u00fcsten f\u00fcr Ihre PV-Anlage: Kosten, Vorteile und Wirtschaftlichkeit. Erfahren Sie, ob sich ein Batteriespeicher f\u00fcr Ihre Bestandsanlage lohnt.", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.671506", "dateModified": "2026-02-06T10:42:47.671511", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/stromspeicher-nachruesten/"}})}/>`
- `src/pages/blog/wartungstipps-winter.astro:18`: `<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "Article", "headline": "{pageTitle}", "description": "Blog Article", "image": "https://leipzig-photovoltaik.de/images/blog/default-article.webp", "author": {"@type": "Person", "name": "Markus Schmidt", "jobTitle": "Gesch\u00e4ftsf\u00fchrer & Solar-Experte", "description": "15 Jahre Erfahrung in der Photovoltaik-Branche"}, "publisher": {"@type": "Organization", "name": "Leipzig Photovoltaik - Presolaris UG", "logo": {"@type": "ImageObject", "url": "https://leipzig-photovoltaik.de/logo.webp"}}, "datePublished": "2026-02-06T10:42:47.671905", "dateModified": "2026-02-06T10:42:47.671910", "mainEntityOfPage": {"@type": "WebPage", "@id": "https://leipzig-photovoltaik.de/blog/wartungstipps-winter/"}})}/>`
- `src/pages/solaranlage-leipzig.astro:27`: `"name": "Presolaris Unternehmensgesellschaft (haftungsbeschränkt) ist leipzig-photovoltaik.de",`
- `src/pages/solaranlage-leipzig.astro:35`: `"addressLocality": "Leipzig",`
- `src/pages/solaranlage-leipzig.astro:36`: `"postalCode": "04316",`
- `src/pages/solaranlage-leipzig.astro:61`: `"name": "Presolaris"`
- `src/pages/solaranlage-leipzig.astro:82`: `"name": "Presolaris"`
- `src/pages/solaranlage-leipzig.astro:103`: `"name": "Presolaris"`
- `src/pages/standorte/anhalt-bitterfeld.astro:22`: `"name": "Presolaris - Photovoltaik Anhalt-Bitterfeld",`
- `src/pages/standorte/anhalt-bitterfeld.astro:31`: `"addressLocality": "Bitterfeld-Wolfen",`
- `src/pages/standorte/anhalt-bitterfeld.astro:32`: `"postalCode": "06749",`
- `src/pages/standorte/borna.astro:22`: `"name": "Presolaris - Photovoltaik Borna",`
- `src/pages/standorte/borna.astro:31`: `"addressLocality": "Borna",`
- `src/pages/standorte/borna.astro:32`: `"postalCode": "04552",`
- `src/pages/standorte/burgenlandkreis.astro:22`: `"name": "Presolaris - Photovoltaik Burgenlandkreis",`
- `src/pages/standorte/burgenlandkreis.astro:31`: `"addressLocality": "Naumburg",`
- `src/pages/standorte/burgenlandkreis.astro:32`: `"postalCode": "06618",`
- `src/pages/standorte/dresden.astro:22`: `"name": "Presolaris - Photovoltaik Dresden",`
- `src/pages/standorte/dresden.astro:31`: `"addressLocality": "Dresden",`
- `src/pages/standorte/dresden.astro:32`: `"postalCode": "01067",`
- `src/pages/standorte/elbe-elster.astro:22`: `"name": "Presolaris - Photovoltaik Elbe-Elster",`
- `src/pages/standorte/elbe-elster.astro:31`: `"addressLocality": "Elbe-Elster",`
- `src/pages/standorte/elbe-elster.astro:32`: `"postalCode": "04109",`
- `src/pages/standorte/erfurt.astro:22`: `"name": "Presolaris - Photovoltaik Erfurt",`
- `src/pages/standorte/erfurt.astro:31`: `"addressLocality": "Erfurt",`
- `src/pages/standorte/erfurt.astro:32`: `"postalCode": "04109",`
- `src/pages/standorte/gera.astro:22`: `"name": "Presolaris - Photovoltaik Gera",`
- `src/pages/standorte/gera.astro:31`: `"addressLocality": "Gera",`
- `src/pages/standorte/gera.astro:32`: `"postalCode": "07545",`
- `src/pages/standorte/grimma.astro:22`: `"name": "Presolaris - Photovoltaik Grimma",`
- `src/pages/standorte/grimma.astro:31`: `"addressLocality": "Grimma",`
- `src/pages/standorte/grimma.astro:32`: `"postalCode": "04668",`
- `src/pages/standorte/halle.astro:22`: `"name": "Presolaris - Photovoltaik Halle (Saale)",`
- `src/pages/standorte/halle.astro:31`: `"addressLocality": "Halle (Saale)",`
- `src/pages/standorte/halle.astro:32`: `"postalCode": "06108",`
- `src/pages/standorte/leipzig.astro:22`: `"name": "Presolaris - Photovoltaik Leipzig",`
- `src/pages/standorte/leipzig.astro:31`: `"addressLocality": "Leipzig",`
- `src/pages/standorte/leipzig.astro:32`: `"postalCode": "04109",`
- `src/pages/standorte/magdeburg.astro:22`: `"name": "Presolaris - Photovoltaik Magdeburg",`
- `src/pages/standorte/magdeburg.astro:31`: `"addressLocality": "Magdeburg",`
- `src/pages/standorte/magdeburg.astro:32`: `"postalCode": "39104",`
- `src/pages/standorte/naumburg.astro:22`: `"name": "Presolaris - Photovoltaik Naumburg",`
- `src/pages/standorte/naumburg.astro:30`: `"addressLocality": "Naumburg (Saale)",`
- `src/pages/standorte/naumburg.astro:31`: `"postalCode": "06618",`
- `src/pages/standorte/nordsachsen.astro:22`: `"name": "Presolaris - Photovoltaik Nordsachsen",`
- `src/pages/standorte/nordsachsen.astro:31`: `"addressLocality": "Delitzsch",`
- `src/pages/standorte/nordsachsen.astro:32`: `"postalCode": "04509",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:22`: `"name": "Presolaris - Photovoltaik Anbieter Leipzig",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:31`: `"addressLocality": "Leipzig",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:32`: `"postalCode": "04316",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:67`: `"name": "Was unterscheidet Presolaris von anderen Photovoltaik Anbietern?",`
- `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:75`: `"name": "Bietet Presolaris auch Wartung und Service an?",`
- `src/pages/standorte/photovoltaik-delitzsch.astro:21`: `"name": "Presolaris - Photovoltaik Delitzsch",`
- `src/pages/standorte/photovoltaik-delitzsch.astro:28`: `"addressLocality": "Delitzsch",`
- `src/pages/standorte/photovoltaik-delitzsch.astro:29`: `"postalCode": "04509",`
- `src/pages/standorte/photovoltaik-delitzsch.astro:50`: `"name": "Bietet Presolaris auch Service in Delitzsch?",`
- `src/pages/standorte/photovoltaik-eilenburg.astro:22`: `"name": "Presolaris - Photovoltaik Eilenburg",`
- `src/pages/standorte/photovoltaik-eilenburg.astro:29`: `"addressLocality": "Eilenburg",`
- `src/pages/standorte/photovoltaik-eilenburg.astro:30`: `"postalCode": "04838",`
- `src/pages/standorte/photovoltaik-eilenburg.astro:43`: `"name": "Bietet Presolaris auch Service in Eilenburg an?",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:22`: `"name": "Presolaris - Photovoltaik Firma Leipzig",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:31`: `"addressLocality": "Leipzig",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:32`: `"postalCode": "04316",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:58`: `"name": "Welche Leistungen bietet Presolaris als Photovoltaik Firma?",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:66`: `"name": "Wie viele Anlagen hat Presolaris bereits installiert?",`
- `src/pages/standorte/photovoltaik-firma-leipzig.astro:74`: `"name": "Bietet Presolaris auch Service nach der Installation?",`
- `src/pages/standorte/photovoltaik-markkleeberg.astro:21`: `"name": "Presolaris - Photovoltaik Markkleeberg",`
- `src/pages/standorte/photovoltaik-markkleeberg.astro:28`: `"addressLocality": "Markkleeberg",`
- `src/pages/standorte/photovoltaik-markkleeberg.astro:29`: `"postalCode": "04416",`
- `src/pages/standorte/photovoltaik-markkleeberg.astro:50`: `"name": "Wie weit ist Presolaris von Markkleeberg entfernt?",`
- `src/pages/standorte/photovoltaik-taucha.astro:22`: `"name": "Presolaris - Photovoltaik Taucha",`
- `src/pages/standorte/photovoltaik-taucha.astro:29`: `"addressLocality": "Taucha",`
- `src/pages/standorte/photovoltaik-taucha.astro:30`: `"postalCode": "04425",`
- `src/pages/standorte/photovoltaik-taucha.astro:43`: `"name": "Bietet Presolaris auch Service in Taucha an?",`
- `src/pages/standorte/photovoltaik-wurzen.astro:21`: `"name": "Presolaris - Photovoltaik Wurzen",`
- `src/pages/standorte/photovoltaik-wurzen.astro:28`: `"addressLocality": "Wurzen",`
- `src/pages/standorte/photovoltaik-wurzen.astro:29`: `"postalCode": "04808",`
- `src/pages/standorte/photovoltaik-wurzen.astro:42`: `"name": "Bietet Presolaris auch Service in Wurzen an?",`
- `src/pages/standorte/saalekreis.astro:22`: `"name": "Presolaris - Photovoltaik Halle & Saalekreis",`
- `src/pages/standorte/saalekreis.astro:31`: `"addressLocality": "Halle (Saale)",`
- `src/pages/standorte/saalekreis.astro:32`: `"postalCode": "06108",`
- `src/pages/standorte/solaranlage-kaufen-leipzig.astro:25`: `"name": "Presolaris"`
- `src/pages/standorte/solarteur-leipzig.astro:22`: `"name": "Presolaris - Solarteur Leipzig",`
- `src/pages/standorte/solarteur-leipzig.astro:31`: `"addressLocality": "Leipzig",`
- `src/pages/standorte/solarteur-leipzig.astro:32`: `"postalCode": "04316",`
- `src/pages/standorte/stromspeicher-leipzig.astro:25`: `"name": "Presolaris"`
- `src/pages/standorte/wallbox-leipzig.astro:25`: `"name": "Presolaris"`
- `src/pages/standorte/weissenfels.astro:22`: `"name": "Presolaris - Photovoltaik Weißenfels",`
- `src/pages/standorte/weissenfels.astro:30`: `"addressLocality": "Weißenfels",`
- `src/pages/standorte/weissenfels.astro:31`: `"postalCode": "06667",`
- `src/pages/standorte/zeitz.astro:22`: `"name": "Presolaris - Photovoltaik Zeitz",`
- `src/pages/standorte/zeitz.astro:30`: `"addressLocality": "Zeitz",`
- `src/pages/standorte/zeitz.astro:31`: `"postalCode": "06712",`
- `src/pages/ueber-uns.astro:95`: `"addressLocality": "Leipzig",`
- `src/pages/ueber-uns.astro:96`: `"postalCode": "04109",`

# D. Vorschau-Link(s) und Stand

**Stand: Vorschau – NICHT veröffentlicht.**

- [Startseite](https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer/)
- [Kontakt mit korrigierter Telefonnummer und WhatsApp](https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer/kontakt/)
- [Footer und Fachseitenblock auf der Kontaktseite unten](https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer/kontakt/)
- [Datenschutzvorschau](https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer/datenschutz/)
- [llms.txt](https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer/llms.txt)

Die Links führen zu einer zeitlich verfügbaren Sandbox-Vorschau, nicht zu einer neuen produktiven Domain oder einem Vercel-Deployment. Der Server läuft auf Port 4328 und wurde extern mit HTTP 200 geprüft. Er ist durch `X-Robots-Tag`/robots.txt gegen Indexierung geschützt. Die Vorschau kennzeichnet sichtbar, dass Formularanfragen keine E-Mails auslösen. Ein tatsächlicher POST erhält eine neutrale Vorschauantwort statt einer falschen Bestätigungsmeldung. GA-Ereignisse verbleiben lokal im Browser und gehen nicht an Google. Telefon/WhatsApp/Social-Links sind echte externe Kontaktziele; zur Prüfung muss nichts davon ausgelöst werden.

Remote main wurde nach der Umsetzung erneut nur lesend geprüft und ist unverändert `fdd3d2ad2107023ecd7be6eb0b21a9dbf0f1d402`. Alle Feature-Checkpoints sind ausschließlich lokal. Eine dauerhafte Produktionsveröffentlichung erfolgt erst nach Ihrer ausdrücklichen Freigabe als Inhaber J. Kolpin.

# E. Geänderte Texte im Wortlaut

### E.1 Technische Kontaktziele und Anzeigen: vorher → nachher

**`src/components/Footer.astro` – Basiszeile 80**

- Ziel: `tel:+493419899039` → `tel:+4934198990391`
- Anzeige: `+49 341 98 99 03 91` → `0341 98990391`

**`src/pages/faq.astro` – Basiszeile 270**

- Ziel: `tel:+493419899039` → `tel:+4934198990391`
- Anzeige: `+49 341 98 99 03 91` → `0341 98990391`

**`src/pages/impressum.astro` – Basiszeile 42**

- Ziel: `tel:+493419899039` → `tel:+4934198990391`
- Anzeige: `+49 341 98 99 03 91` → `0341 98990391`

**`src/pages/index.astro` – Basiszeile 355**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/kontakt.astro` – Basiszeile 67**

- Ziel: `tel:+493419899391` → `tel:+4934198990391`
- Anzeige: `+49 341 98 99 03 91` → `0341 98990391`

**`src/pages/solaranlage-leipzig.astro` – Basiszeile 167**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `📞 Direkt anrufen: 0341 98 99 03 91` → `📞 Direkt anrufen: 0341 98990391`

**`src/pages/solaranlage-leipzig.astro` – Basiszeile 1235**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/solaranlage-leipzig.astro` – Basiszeile 1260**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/solaranlage-leipzig.astro` – Basiszeile 1331**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/elbe-elster.astro` – Basiszeile 406**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `☎ 0341 98 99 03 91` → `☎ 0341 98990391`

**`src/pages/standorte/erfurt.astro` – Basiszeile 406**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `☎ 0341 98 99 03 91` → `☎ 0341 98990391`

**`src/pages/standorte/leipzig.astro` – Basiszeile 406**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `☎ 0341 98 99 03 91` → `☎ 0341 98990391`

**`src/pages/standorte/photovoltaik-anbieter-leipzig.astro` – Basiszeile 119**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-anbieter-leipzig.astro` – Basiszeile 399**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-delitzsch.astro` – Basiszeile 101**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-delitzsch.astro` – Basiszeile 300**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-eilenburg.astro` – Basiszeile 94**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-eilenburg.astro` – Basiszeile 243**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-firma-leipzig.astro` – Basiszeile 110**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-firma-leipzig.astro` – Basiszeile 351**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-markkleeberg.astro` – Basiszeile 93**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-markkleeberg.astro` – Basiszeile 268**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-taucha.astro` – Basiszeile 94**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-taucha.astro` – Basiszeile 243**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-wurzen.astro` – Basiszeile 93**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/photovoltaik-wurzen.astro` – Basiszeile 268**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/solaranlage-kaufen-leipzig.astro` – Basiszeile 108**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/solaranlage-kaufen-leipzig.astro` – Basiszeile 433**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/solarteur-leipzig.astro` – Basiszeile 110**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/solarteur-leipzig.astro` – Basiszeile 306**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/stromspeicher-leipzig.astro` – Basiszeile 108**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/stromspeicher-leipzig.astro` – Basiszeile 407**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/wallbox-leipzig.astro` – Basiszeile 103**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte/wallbox-leipzig.astro` – Basiszeile 379**

- Ziel: `tel:+4934198990391` → `tel:+4934198990391`
- Anzeige: `0341 98 99 03 91` → `0341 98990391`

**`src/pages/standorte.astro` – Basiszeile 367**

- Ziel: `tel:+493419899039` → `tel:+4934198990391`
- Anzeige: `+49 341 98 99 03 91` → `0341 98990391`

**`src/pages/ueber-uns.astro` – Basiszeile 302**

- Ziel: `tel:+4934112345678` → `tel:+4934198990391`
- Anzeige: `Jetzt anrufen` → `Jetzt anrufen`

**`src/pages/ueber-uns.astro` – Basiszeile 447**

- Ziel: `tel:+4934112345678` → `tel:+4934198990391`
- Anzeige: `0341 - 123 456 78` → `0341 98990391`

### E.2 Sichtbare Textblöcke: vorher → nachher

Die folgenden Blöcke sind vollständig aus dem Vergleich mit der festgehaltenen Remote-Basis erzeugt. „Nicht vorhanden“ bedeutet eine Ergänzung, nicht einen ausgelassenen ursprünglichen Wortlaut. Markup-/Klassenänderungen ohne sichtbaren Text sind nicht als neue Aussagen dargestellt.

**1. `src/components/CookieBanner.astro`**

Vorher:

```text
Nur notwendige
```

Nachher:

```text
Ablehnen
```

**2. `src/components/CookieBanner.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
Nur notwendige
```

**3. `src/components/Footer.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
X
```

**4. `src/components/Footer.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
Unsere Fachseiten
presolaris.de – Energieberatung
photovoltaik-anlagen-wartung.de – PV-Wartung
```

**5. `src/components/Footer.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**6. `src/components/Footer.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
WhatsApp
```

**7. `src/lib/leadForms.ts`**

Vorher:

```text
type ProviderResponse = {
  success?: boolean;
  message?: string;
  messageId?: string;
  verificationRequired?: boolean;
};

const MIN_COMPLETION_MS = 2_500;

export function addLeadProtectionFields(form: HTMLFormElement): void {
  if (!form.querySelector('input[name="form_started_at"]')) {
    const startedAt = document.createElement('input');
    startedAt.type = 'hidden';
    startedAt.name = 'form_started_at';
    startedAt.value = String(Date.now());
    form.appendChild(startedAt);
  }
  if (!form.querySelector('input[name="website"]')) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
    wrapper.innerHTML = '
```

Nachher:

```text
import { getLeadAttribution, initializeLeadAttribution, LEAD_SOURCES } from './leadAttribution';

type ProviderResponse = {
  success?: boolean;
  message?: string;
  messageId?: string;
  verificationRequired?: boolean;
};

const MIN_COMPLETION_MS = 2_500;

export function addLeadProtectionFields(form: HTMLFormElement): void {
  if (!form.querySelector('input[name="form_started_at"]')) {
    const startedAt = document.createElement('input');
    startedAt.type = 'hidden';
    startedAt.name = 'form_started_at';
    startedAt.value = String(Date.now());
    form.appendChild(startedAt);
  }
  if (!form.querySelector('input[name="website"]')) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = 'position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;';
    wrapper.innerHTML = '
```

**8. `src/lib/leadForms.ts`**

Vorher:

```text
{
  const startedAt = Number(formData.get('form_started_at'));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_COMPLETION_MS) {
    throw new Error('Bitte nehmen Sie sich einen Moment Zeit und versuchen Sie es erneut.');
  }
  // Keine browserseitigen Provider-Keys oder Fallbacks: Alle Leads werden serverseitig geprüft.
  formData.delete('access_key');
  formData.delete('redirect');
  const response = await fetch('/api/lead/', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });
  let result: ProviderResponse;
  try {
    result = await response.json() as ProviderResponse;
  } catch {
    throw new Error('Die Antwort des Formularservers konnte nicht gelesen werden.');
  }
  if (!response.ok || result.success !== true || result.verificationRequired !== true || !result.messageId) {
    throw new Error(result.message || 'Die Anfrage konnte nicht zur Bestätigung vorbereitet werden.');
  }
  return result;
}

export function bindLeadForms(): void {
  for (const form of document.querySelectorAll
```

Nachher:

```text
{
  const startedAt = Number(formData.get('form_started_at'));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_COMPLETION_MS) {
    throw new Error('Bitte nehmen Sie sich einen Moment Zeit und versuchen Sie es erneut.');
  }
  // Keine browserseitigen Provider-Keys oder Fallbacks: Alle Leads werden serverseitig geprüft.
  formData.delete('access_key');
  formData.delete('redirect');
  // Always replace caller-provided attribution; no form-specific customer fields.
  formData.delete('attribution');
  const attribution = getLeadAttribution();
  if (attribution) formData.set('attribution', JSON.stringify(attribution));
  const response = await fetch('/api/lead/', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  });
  let result: ProviderResponse;
  try {
    result = await response.json() as ProviderResponse;
  } catch {
    throw new Error('Die Antwort des Formularservers konnte nicht gelesen werden.');
  }
  if (!response.ok || result.success !== true || result.verificationRequired !== true ||
      typeof result.messageId !== 'string' || !result.messageId) {
    throw new Error(result.message || 'Die Anfrage konnte nicht zur Bestätigung vorbereitet werden.');
  }
  const source = formData.get('source');
  if (typeof window !== 'undefined' && typeof source === 'string' && LEAD_SOURCES.has(source)) {
    // Internal handoff only: receipt is an in-memory dedup key, never a GA parameter.
    window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
      detail: { form_name: source, page: window.location.pathname, receipt: result.messageId },
    }));
  }
  return result;
}

export function bindLeadForms(): void {
  initializeLeadAttribution();
  for (const form of document.querySelectorAll
```

**9. `src/pages/datenschutz.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**10. `src/pages/datenschutz.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
Herkunft Ihrer Anfrage
Mit einer Formularanfrage können der Pfad der Einstiegsseite, der Pfad der Formularseite und die Domain der verweisenden Website übermittelt werden, soweit diese Informationen im Browser verfügbar sind. Die Kampagnenangaben utm_source, utm_medium, utm_campaign und utm_content der aktuellen Seite können beim freiwilligen Absenden ebenfalls mitgegeben werden. Vollständige Verweis-URLs, andere URL-Parameter und Adressfragmente werden nicht übernommen. Es werden keine zusätzlichen persönlichen Angaben von Ihnen abgefragt.
Wenn Sie Analytics zugestimmt haben, merken wir uns zusätzlich die Kampagnenangaben utm_source, utm_medium, utm_campaign und utm_content des ersten Seitenaufrufs in der aktuellen Browsersitzung. Diese Angaben und die Einstiegsseite werden im sessionStorage Ihres Browsers gespeichert und können mit Ihrer Anfrage an unser Beratungsteam weitergegeben werden. Die Speicherung dient der Zuordnung von Anfragen zu unseren Informations- und Werbekanälen. Bei Ablehnung oder Widerruf erfolgt diese Zuordnung über mehrere Seitenaufrufe innerhalb des Besuchs nicht; die Formularnutzung bleibt möglich. Die Einwilligung können Sie jederzeit über die Cookie-Einstellungen im Footer ändern.
Per WhatsApp
Sie können über den Link
WhatsApp
Kontakt mit uns aufnehmen. Der Link ist ein einfacher Verweis: Erst wenn Sie ihn auswählen, wechseln Sie zu WhatsApp oder öffnen die WhatsApp-App. Auf unserer Website ist kein WhatsApp-Widget eingebunden.
Bei einer Kontaktaufnahme bearbeiten wir Ihre Telefonnummer und die von Ihnen übermittelten Nachrichten zur Beantwortung Ihrer Anfrage. Soweit es um einen Vertrag oder eine vorvertragliche Beratung geht, erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. WhatsApp verarbeitet bei der Nutzung des Dienstes auch Daten in eigener Verantwortung; dabei können Daten an Empfänger außerhalb des Europäischen Wirtschaftsraums übermittelt werden. Einzelheiten finden Sie in der
Datenschutzerklärung von WhatsApp
. Bitte senden Sie keine sensiblen Unterlagen über diesen Kanal. Alternativ erreichen Sie uns per Telefon oder E-Mail.
```

**11. `src/pages/datenschutz.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
Google Analytics und Kontakt-Ereignisse
Google Analytics wird auf dieser Website erst geladen, wenn Sie Analytics ausdrücklich zugestimmt haben. Ohne diese Einwilligung werden keine Google-Analytics-Ereignisse übermittelt. Sie können die Einwilligung im Cookie-Banner ablehnen und später über die Cookie-Einstellungen im Footer ändern oder widerrufen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO; die einwilligungsabhängige Speicherung im Browser richtet sich nach § 25 Abs. 1 TDDDG.
Nach Einwilligung erfassen wir das erfolgreich angenommene Absenden eines Formulars als generate_lead sowie Klicks auf Telefon-, E-Mail- und WhatsApp-Links als click_phone, click_email und click_whatsapp. Zu diesen Ereignissen gehören der Seitenpfad und bei Formularen die Formularbezeichnung. Namen, E-Mail-Adressen, private Telefonnummern, Nachrichtentexte und vollständige Kontakt- oder Bestätigungslinks werden nicht als Ereignisparameter übermittelt. Google Analytics verarbeitet außerdem Nutzungs- und Geräteinformationen; diese Daten sind nicht mit einer vollständig anonymen Erfassung gleichzusetzen. Weitere Informationen bietet die
Datenschutzerklärung von Google
.
```

**12. `src/pages/datenschutz.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**13. `src/pages/datenschutz.astro`**

Vorher:

```text
Januar 2026
```

Nachher:

```text
19. November 2026
```

**14. `src/pages/faq.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**15. `src/pages/impressum.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**16. `src/pages/index.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**17. `src/pages/kontakt.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**18. `src/pages/kontakt.astro`**

Vorher:

```text
[nicht vorhanden]
```

Nachher:

```text
WhatsApp
```

**19. `src/pages/solaranlage-leipzig.astro`**

Vorher:

```text
📞 Direkt anrufen: 0341 98 99 03 91
```

Nachher:

```text
📞 Direkt anrufen: 0341 98990391
```

**20. `src/pages/solaranlage-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**21. `src/pages/solaranlage-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**22. `src/pages/solaranlage-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**23. `src/pages/standorte.astro`**

Vorher:

```text
+49 341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**24. `src/pages/standorte/elbe-elster.astro`**

Vorher:

```text
☎ 0341 98 99 03 91
```

Nachher:

```text
☎ 0341 98990391
```

**25. `src/pages/standorte/erfurt.astro`**

Vorher:

```text
☎ 0341 98 99 03 91
```

Nachher:

```text
☎ 0341 98990391
```

**26. `src/pages/standorte/leipzig.astro`**

Vorher:

```text
☎ 0341 98 99 03 91
```

Nachher:

```text
☎ 0341 98990391
```

**27. `src/pages/standorte/photovoltaik-anbieter-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**28. `src/pages/standorte/photovoltaik-anbieter-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**29. `src/pages/standorte/photovoltaik-delitzsch.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**30. `src/pages/standorte/photovoltaik-delitzsch.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**31. `src/pages/standorte/photovoltaik-eilenburg.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**32. `src/pages/standorte/photovoltaik-eilenburg.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**33. `src/pages/standorte/photovoltaik-firma-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**34. `src/pages/standorte/photovoltaik-firma-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**35. `src/pages/standorte/photovoltaik-markkleeberg.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**36. `src/pages/standorte/photovoltaik-markkleeberg.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**37. `src/pages/standorte/photovoltaik-taucha.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**38. `src/pages/standorte/photovoltaik-taucha.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**39. `src/pages/standorte/photovoltaik-wurzen.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**40. `src/pages/standorte/photovoltaik-wurzen.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**41. `src/pages/standorte/solaranlage-kaufen-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**42. `src/pages/standorte/solaranlage-kaufen-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**43. `src/pages/standorte/solarteur-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**44. `src/pages/standorte/solarteur-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**45. `src/pages/standorte/stromspeicher-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**46. `src/pages/standorte/stromspeicher-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**47. `src/pages/standorte/wallbox-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**48. `src/pages/standorte/wallbox-leipzig.astro`**

Vorher:

```text
0341 98 99 03 91
```

Nachher:

```text
0341 98990391
```

**49. `src/pages/ueber-uns.astro`**

Vorher:

```text
0341 - 123 456 78
```

Nachher:

```text
0341 98990391
```

### E.3 Vollständiger Wortlaut von /llms.txt

Vorher: Datei nicht vorhanden.

Nachher:

```text
Presolaris UG (haftungsbeschränkt) – leipzig-photovoltaik.de

Presolaris bietet Photovoltaikanlagen für Privatkunden und Gewerbe, Stromspeicher, Wallbox-Installation und PV-Service in Leipzig und Umgebung. Zum PV-Service gehören Wartung, Reinigung und Solarpark-Betreuung.

Kontakt
An der Hebemärchte 1, 04316 Leipzig
Telefon: 0341 98990391
E-Mail: kontakt@leipzig-photovoltaik.de
Kontaktseite: https://leipzig-photovoltaik.de/kontakt/
Impressum: https://leipzig-photovoltaik.de/impressum/

Wichtige Seiten
Startseite: https://leipzig-photovoltaik.de/
Solaranlage Leipzig: https://leipzig-photovoltaik.de/solaranlage-leipzig/
Photovoltaik für Privatkunden: https://leipzig-photovoltaik.de/privat/
Photovoltaik für Gewerbe: https://leipzig-photovoltaik.de/gewerbe/
Stromspeicher: https://leipzig-photovoltaik.de/stromspeicher/
Wallbox: https://leipzig-photovoltaik.de/wallbox/
PV-Service: https://leipzig-photovoltaik.de/service/
PV-Wartung: https://leipzig-photovoltaik.de/pv-wartung-leipzig/
PV-Reinigung: https://leipzig-photovoltaik.de/pv-reinigung-leipzig/
Solarpark-Betreuung: https://leipzig-photovoltaik.de/solarpark-betreuung/
Datenschutz: https://leipzig-photovoltaik.de/datenschutz/
```

### E.4 Neuer Herkunftsblock der bestätigten Betreiberbenachrichtigung

Vorher: Kein gesonderter Herkunftsblock. Die bestehenden Kundenfelder und Mailbetreffe bleiben erhalten.

Nachher (wörtliche Beispielausgabe mit zulässigen Beispielwerten, keine echte Kundenanfrage):

```text
Herkunft der Anfrage
Einstiegsseitenpfad: /privat/
Formularseitenpfad: /kontakt/
utm_source: google
utm_medium: cpc
utm_campaign: Dach Herbst
utm_content: Variante-A
Verweis-Domain: google.com
Erfassungsart: Erster Besuchskontakt dieser Sitzung (Analytics-Einwilligung; Browserangabe)
Erfassungsgrenze: Keine zusätzliche Einschränkung; Angaben sind nicht unabhängig verifiziert.
```

```text
Herkunft der Anfrage
Einstiegsseitenpfad (aktuelles Dokument, Fallback): /kontakt/
Formularseitenpfad: /kontakt/
utm_source: nicht erfasst
utm_medium: nicht erfasst
utm_campaign: nicht erfasst
utm_content: nicht erfasst
Verweis-Domain: nicht erfasst
Erfassungsart: Aktueller Dokumentkontext (Fallback; kein belegter Mehrseiten-Erstbesuch)
Erfassungsgrenze: Keine Analytics-Einwilligung: keine gespeicherte Kampagnensitzung; frühere Seiten/UTMs unbekannt.
```

```text
Erfassungsgrenze: Sitzungsspeicher nicht verfügbar: frühere Seiten/UTMs unbekannt.
```

### E.5 Sämtliche Fundstellen der unverändert zu erhaltenden Aussagen

**Hinweis zu den Fundstellen:** Zeilennummern beziehen sich auf die eingefrorene ursprüngliche Remote-Basis, nicht auf durch Ergänzungen verschobene Zeilen. Die Kategorie zählt Varianten und Mehrfachvorkommen einschließlich Metadaten, JSON-LD und vorhandener technischer Texte. Der vollständige Fundstellenwortlaut ist übernommen; es werden keine Zahlen oder Referenzen neu bestätigt. Die Differenzprüfung belegt, dass die geschützten Treffer in der Vorschau unverändert erhalten bleiben.

| Kategorie | Fundstellen |
|---|---:|
| 2.400 Anlagen | 33 |
| 25+ Jahre | 3 |
| Festpreis-Garantie | 4 |
| Gründung / Fachbetrieb seit 2002 | 6 |
| Kostenlos / kostenloses Angebot | 240 |
| Leistungsgarantie | 12 |
| SAB-Förderhinweis | 18 |

**1. Kostenlos / kostenloses Angebot – `src/components/ExitIntentPopup.astro:35`**

```text
Sichern Sie sich jetzt Ihre kostenlose Beratung und erhalten Sie ein unverbindliches Angebot innerhalb von 24 Stunden.
```

**2. Kostenlos / kostenloses Angebot – `src/components/Footer.astro:90`**

```text
Kostenlose Beratung
```

**3. Gründung / Fachbetrieb seit 2002 – `src/components/LocalBusinessSchema.astro:37`**

```text
"foundingDate": "2002",
```

**4. 2.400 Anlagen – `src/components/LocalBusinessSchema.astro:9`**

```text
"description": "Ihr regionaler Experte für Photovoltaikanlagen, Solaranlagen und Stromspeicher in Leipzig. Über 2.400 erfolgreich installierte Solaranlagen in Leipzig und Sachsen. Festpreis-Garantie, 25 Jahre Leistungsgarantie. Komplettpaket ab 7.500 €, 0% MwSt.",
```

**5. Leistungsgarantie – `src/components/LocalBusinessSchema.astro:9`**

```text
"description": "Ihr regionaler Experte für Photovoltaikanlagen, Solaranlagen und Stromspeicher in Leipzig. Über 2.400 erfolgreich installierte Solaranlagen in Leipzig und Sachsen. Festpreis-Garantie, 25 Jahre Leistungsgarantie. Komplettpaket ab 7.500 €, 0% MwSt.",
```

**6. Festpreis-Garantie – `src/components/LocalBusinessSchema.astro:9`**

```text
"description": "Ihr regionaler Experte für Photovoltaikanlagen, Solaranlagen und Stromspeicher in Leipzig. Über 2.400 erfolgreich installierte Solaranlagen in Leipzig und Sachsen. Festpreis-Garantie, 25 Jahre Leistungsgarantie. Komplettpaket ab 7.500 €, 0% MwSt.",
```

**7. Kostenlos / kostenloses Angebot – `src/components/SolarCalculator.tsx:856`**

```text
Kostenloses Angebot anfordern
```

**8. 2.400 Anlagen – `src/lib/solarSimulation.ts:371`**

```text
}), config.heatPumpEnabled ? 2400 : 0);
```

**9. Kostenlos / kostenloses Angebot – `src/pages/blog.astro:236`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit Photovoltaik sparen können.
```

**10. 2.400 Anlagen – `src/pages/blog/fehler-solarkauf.astro:35`**

```text
Mal ehrlich: Beim Solarkauf kann man richtig viel Geld verbrennen. Wir haben das bei über 2.400 Anlagen gesehen – und leider auch die Tränen danach. Damit Ihnen das nicht passiert, zeigen wir die 10 größten Stolperfallen. Und wie Sie drumherum kommen.
```

**11. 2.400 Anlagen – `src/pages/blog/fehler-solarkauf.astro:216`**

```text
Basierend auf über 2.400 installierten Anlagen in Leipzig und Umgebung
```

**12. Kostenlos / kostenloses Angebot – `src/pages/blog/fehler-solarkauf.astro:152`**

```text
Wechselrichter-App installieren (meist kostenlos)
```

**13. Kostenlos / kostenloses Angebot – `src/pages/blog/fehler-solarkauf.astro:209`**

```text
Kostenlose Beratung mit Vor-Ort-Besichtigung
```

**14. SAB-Förderhinweis – `src/pages/blog/fehler-solarkauf.astro:131`**

```text
✅ SAB Sachsen Speicher-Zuschuss (bis 1.000€)
```

**15. Kostenlos / kostenloses Angebot – `src/pages/blog/photovoltaik-foerderung-2026.astro:219`**

```text
Kostenlose Beratung einholen
```

**16. Kostenlos / kostenloses Angebot – `src/pages/blog/photovoltaik-foerderung-2026.astro:271`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit einer PV-Anlage sparen können.
```

**17. Kostenlos / kostenloses Angebot – `src/pages/blog/photovoltaik-foerderung-2026.astro:275`**

```text
Kostenloses Angebot anfordern
```

**18. SAB-Förderhinweis – `src/pages/blog/photovoltaik-foerderung-2026.astro:163`**

```text
SAB Sachsenkredit Energie und Speicher
```

**19. SAB-Förderhinweis – `src/pages/blog/photovoltaik-foerderung-2026.astro:166`**

```text
In Sachsen gibt's noch was extra: Die SAB legt nochmal drauf – mit günstigen Krediten und Tilgungszuschüssen.
```

**20. SAB-Förderhinweis – `src/pages/blog/photovoltaik-foerderung-2026.astro:206`**

```text
SAB Sachsenkredit (Kredit + Tilgungszuschuss)
```

**21. 2.400 Anlagen – `src/pages/blog/photovoltaik-kosten-2026.astro:126`**

```text
Gesamtertrag pro Jahr: 2.400€
```

**22. Kostenlos / kostenloses Angebot – `src/pages/blog/photovoltaik-kosten-2026.astro:180`**

```text
Kostenlose Beratung vereinbaren - Wir analysieren Ihr Dach und erstellen ein individuelles Angebot
```

**23. SAB-Förderhinweis – `src/pages/blog/photovoltaik-kosten-2026.astro:117`**

```text
Sächsische Aufbaubank (SAB):
```

**24. Leistungsgarantie – `src/pages/blog/solar-leipzig.astro:213`**

```text
25 Jahre Leistungsgarantie, 10 Jahre Produktgarantie
```

**25. Kostenlos / kostenloses Angebot – `src/pages/blog/solar-leipzig.astro:275`**

```text
Kostenlose Vor-Ort-Beratung in Leipzig. Dachanalyse, Verbrauchsanalyse und individuelles Angebot.
```

**26. Kostenlos / kostenloses Angebot – `src/pages/blog/solar-leipzig.astro:374`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit Solar in Leipzig sparen können.
```

**27. Kostenlos / kostenloses Angebot – `src/pages/blog/solar-leipzig.astro:381`**

```text
Kostenlose Beratung
```

**28. Kostenlos / kostenloses Angebot – `src/pages/blog/stromspeicher-2026-lohnt-sich.astro:230`**

```text
Jetzt kostenlose Beratung vereinbaren und Eigenverbrauch maximieren!
```

**29. SAB-Förderhinweis – `src/pages/blog/stromspeicher-2026-lohnt-sich.astro:175`**

```text
Sächsische Aufbaubank (SAB)
```

**30. Leistungsgarantie – `src/pages/blog/stromspeicher-nachruesten.astro:181`**

```text
Leistungsgarantie: 80% Restkapazität nach 10 Jahren
```

**31. Kostenlos / kostenloses Angebot – `src/pages/blog/stromspeicher-nachruesten.astro:211`**

```text
Jetzt kostenlose Speicher-Beratung anfordern
```

**32. Kostenlos / kostenloses Angebot – `src/pages/blog/stromspeicher-vergleich-2026.astro:447`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, welcher Speicher optimal zu Ihrer PV-Anlage passt.
```

**33. Kostenlos / kostenloses Angebot – `src/pages/blog/stromspeicher-vergleich-2026.astro:451`**

```text
Kostenloses Angebot anfordern
```

**34. SAB-Förderhinweis – `src/pages/blog/stromspeicher-vergleich-2026.astro:373`**

```text
✅ SAB Sachsenkredit: Kredit + bis zu 10% Tilgungszuschuss
```

**35. 2.400 Anlagen – `src/pages/dashboard.astro:206`**

```text
.status-contacted { background: #fef3c7; color: #92400e; }
```

**36. 2.400 Anlagen – `src/pages/dashboard.astro:212`**

```text
.priority-medium { background: #fef3c7; color: #92400e; }
```

**37. 2.400 Anlagen – `src/pages/dashboard/cta-tracking.astro:45`**

```text
.badge.medium { background: #fef3c7; color: #92400e; }
```

**38. Leistungsgarantie – `src/pages/faq.astro:29`**

```text
answer: "Moderne Solarmodule haben eine Lebensdauer von 25-30 Jahren mit Leistungsgarantien von 80-90% nach 25 Jahren. Wechselrichter halten 10-15 Jahre, Batteriespeicher 10-15 Jahre. Die Gesamtanlage kann mit Austausch einzelner Komponenten 40+ Jahre betrieben werden."
```

**39. Leistungsgarantie – `src/pages/faq.astro:85`**

```text
answer: "Wir setzen auf Qualitätsmodule mit hohem Wirkungsgrad (20-22%) und langer Garantie (25-30 Jahre Leistungsgarantie). Bewährte Hersteller sind Meyer Burger, Solarwatt, JA Solar und Trina Solar. Die Modulwahl hängt von Dachfläche, Budget und Ertragswunsch ab."
```

**40. Kostenlos / kostenloses Angebot – `src/pages/faq.astro:13`**

```text
const pageDescription = "Photovoltaik FAQ Leipzig ➤ Alle Antworten zu Kosten, Förderungen, Installation & Wartung ✓ 26 Expertenfragen ✓ Verständlich erklärt ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**41. Kostenlos / kostenloses Angebot – `src/pages/faq.astro:63`**

```text
answer: "Bei aktuellen Strompreisen amortisiert sich eine Solaranlage in 8-12 Jahren. Mit Batteriespeicher verlängert sich die Amortisationszeit auf 10-14 Jahre. Bei steigenden Strompreisen verkürzt sich diese Zeit. Die Anlage produziert danach 15-20 Jahre lang nahezu kostenlosen Strom."
```

**42. Kostenlos / kostenloses Angebot – `src/pages/faq.astro:81`**

```text
answer: "Ideal sind Süddächer mit 30° Neigung, aber auch Ost-West-Dächer und Flachdächer sind geeignet. Wichtig: Mindestens 20m² Fläche, keine starke Verschattung, Dachzustand gut. Wir prüfen Ihr Dach kostenlos vor Ort und erstellen eine Ertragsprognose."
```

**43. Kostenlos / kostenloses Angebot – `src/pages/faq.astro:268`**

```text
Kostenlose Beratung anfordern
```

**44. 25+ Jahre – `src/pages/gewerbe-photovoltaik-leipzig.astro:77`**

```text
25+ Jahre
```

**45. 2.400 Anlagen – `src/pages/gewerbe-photovoltaik-leipzig.astro:45`**

```text
2.400+
```

**46. Kostenlos / kostenloses Angebot – `src/pages/gewerbe-photovoltaik-leipzig.astro:263`**

```text
Kostenloses Angebot anfordern
```

**47. Kostenlos / kostenloses Angebot – `src/pages/gewerbe-photovoltaik-leipzig.astro:397`**

```text
Kostenlose Potenzialanalyse
```

**48. Kostenlos / kostenloses Angebot – `src/pages/gewerbe.astro:14`**

```text
const pageDescription = "Photovoltaik Gewerbe Leipzig ➤ Maßgeschneiderte PV-Lösungen für Industrie & Landwirtschaft ✓ 0% MwSt. ✓ Betriebskosten bis 70% senken ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**49. Kostenlos / kostenloses Angebot – `src/pages/gewerbe.astro:104`**

```text
Hoher Tagesverbrauch trifft auf große Dachflächen. Nutzen Sie den Solarstrom direkt für Ihre Maschinen und kühlen Sie Ihre Hallen im Sommer quasi kostenlos.
```

**50. Kostenlos / kostenloses Angebot – `src/pages/gewerbe.astro:198`**

```text
Senden Sie uns Ihre Eckdaten. Wir erstellen Ihnen eine erste Potenzialanalyse – kostenlos und unverbindlich.
```

**51. Kostenlos / kostenloses Angebot – `src/pages/gewerbe.astro:366`**

```text
Die Investition in eine gewerbliche PV-Anlage amortisiert sich in der Regel innerhalb von 6-8 Jahren. Danach produzieren Sie Ihren Strom nahezu kostenlos – für weitere 20 Jahre und mehr. Zusätzlich profitieren Sie von attraktiven Förderprogrammen wie KfW-Krediten und steuerlichen Vorteilen durch Sonderabschreibungen. Wir unterstützen Sie bei der Beantragung aller Fördermittel.
```

**52. Kostenlos / kostenloses Angebot – `src/pages/gewerbe.astro:369`**

```text
Von der ersten Beratung über die Planung bis zur schlüsselfertigen Installation und Wartung erhalten Sie bei uns alles aus einer Hand. Unsere zertifizierten Monteure arbeiten mit hochwertigen Komponenten von führenden Herstellern wie SolarEdge, Huawei und Fronius. Kontaktieren Sie uns für eine kostenlose Wirtschaftlichkeitsberechnung für Ihr Gewerbeobjekt in Leipzig und Umgebung.
```

**53. 2.400 Anlagen – `src/pages/heizung.astro:129`**

```text
2.400€/Jahr
```

**54. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:7`**

```text
const pageDescription = "Wärmepumpe Leipzig ➤ Mit Solaranlage kombinieren & bis zu 80% Heizkosten sparen ✓ Optimale Planung ✓ Förderung 2026 ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**55. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:37`**

```text
Kostenlose Beratung
```

**56. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:157`**

```text
Kostenlose Vor-Ort-Beratung inklusive.
```

**57. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:211`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit der Kombination
```

**58. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:219`**

```text
Kostenlose Beratung
```

**59. Kostenlos / kostenloses Angebot – `src/pages/heizung.astro:231`**

```text
Die Kombination aus Wärmepumpe und Photovoltaik ist die effizienteste Art zu heizen. Eine Wärmepumpe erzeugt aus einer Kilowattstunde Strom bis zu vier Kilowattstunden Wärme. Wenn dieser Strom von Ihrer eigenen PV-Anlage kommt, heizen Sie nahezu kostenlos und vollständig CO2-neutral.
```

**60. Kostenlos / kostenloses Angebot – `src/pages/impressum.astro:89`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage.
```

**61. Gründung / Fachbetrieb seit 2002 – `src/pages/index.astro:15`**

```text
<Layout title="Photovoltaik Leipzig | Fachbetrieb seit 2002 | Presolaris" description="Photovoltaik in Leipzig: Planung, Installation und Speicher aus einer Hand. Über 2.400 realisierte Anlagen. Jetzt persönliche Beratung anfragen.">
```

**62. Gründung / Fachbetrieb seit 2002 – `src/pages/index.astro:36`**

```text
Ihr regionaler Fachbetrieb seit 2002
```

**63. 25+ Jahre – `src/pages/index.astro:66`**

```text
25+ Jahre
```

**64. 2.400 Anlagen – `src/pages/index.astro:15`**

```text
<Layout title="Photovoltaik Leipzig | Fachbetrieb seit 2002 | Presolaris" description="Photovoltaik in Leipzig: Planung, Installation und Speicher aus einer Hand. Über 2.400 realisierte Anlagen. Jetzt persönliche Beratung anfragen.">
```

**65. 2.400 Anlagen – `src/pages/index.astro:39`**

```text
Strom selbst produzieren, Energiekosten um bis zu 80% senken – und endlich unabhängig von steigenden Strompreisen werden. Über 2.400 Solaranlagen in Leipzig realisiert. Festpreis. Keine Überraschungen.
```

**66. 2.400 Anlagen – `src/pages/index.astro:289`**

```text
Ob Sie nach einer Solaranlage in Leipzig suchen oder eine komplette Photovoltaikanlage planen – wir sind der richtige Ansprechpartner. Über 2.400 realisierte Projekte in Leipzig und Umgebung sprechen für sich. Von der ersten Beratung bis zur fertigen Anlage auf Ihrem Dach: alles aus einer Hand, alles zum Festpreis.
```

**67. 2.400 Anlagen – `src/pages/index.astro:327`**

```text
Über 2.400 Solaranlagen in Leipzig und Sachsen
```

**68. 2.400 Anlagen – `src/pages/index.astro:443`**

```text
Über 2.400 Projekte
```

**69. Leistungsgarantie – `src/pages/index.astro:67`**

```text
Leistungsgarantie
```

**70. Leistungsgarantie – `src/pages/index.astro:338`**

```text
Leistungsgarantie
```

**71. Kostenlos / kostenloses Angebot – `src/pages/index.astro:43`**

```text
Kostenloses Angebot anfordern
```

**72. Kostenlos / kostenloses Angebot – `src/pages/index.astro:249`**

```text
Photovoltaik Leipzig – Jetzt kostenlos beraten lassen
```

**73. Kostenlos / kostenloses Angebot – `src/pages/index.astro:251`**

```text
Wie viel können Sie eigentlich sparen? Das finden wir gerne für Sie heraus – kostenlos und unverbindlich. Einfach Angebot anfordern oder direkt einen Termin buchen.
```

**74. Kostenlos / kostenloses Angebot – `src/pages/index.astro:261`**

```text
Kostenlose Wirtschaftlichkeitsberechnung
```

**75. Kostenlos / kostenloses Angebot – `src/pages/index.astro:375`**

```text
Eine Solaranlage in Leipzig kostet je nach Größe zwischen 7.500 € und 25.000 €. Ein typisches Einfamilienhaus mit 8–10 kWp Leistung liegt bei rund 11.500 € inklusive Stromspeicher und Montage. Dank 0% Mehrwertsteuer auf Photovoltaikanlagen seit 2023 und möglicher SAB-Förderung in Sachsen amortisiert sich die Anlage in Leipzig durchschnittlich in 8–12 Jahren. Wir bieten Festpreise ohne versteckte Kosten – fordern Sie jetzt Ihr kostenloses Angebot an.
```

**76. Kostenlos / kostenloses Angebot – `src/pages/index.astro:393`**

```text
In Leipzig gibt es viele denkmalgeschützte Gebäude – besonders in Gohlis, Connewitz und der Südvorstadt. Grundsätzlich ist eine Solaranlage auch an Denkmälern möglich, wenn sie von der Straße nicht sichtbar ist oder das Erscheinungsbild nicht wesentlich beeinträchtigt. Wir kennen die Leipziger Denkmalschutzbehörde und begleiten Sie durch den Genehmigungsprozess. Sprechen Sie uns an – wir prüfen kostenlos die Machbarkeit für Ihr Gebäude.
```

**77. Kostenlos / kostenloses Angebot – `src/pages/index.astro:402`**

```text
Für Solaranlagen in Leipzig und Sachsen gibt es 2026 mehrere Förderwege: (1) 0% Mehrwertsteuer auf Kauf und Installation der PV-Anlage (bundesweit). (2) KfW-Kredit 270 für Erneuerbare Energien mit günstigen Zinsen. (3) SAB-Förderprogramm Sachsen für Stromspeicher. (4) Einspeisevergütung nach EEG für überschüssigen Solarstrom. Wir berechnen in unserer kostenlosen Beratung, welche Kombination für Sie am günstigsten ist.
```

**78. SAB-Förderhinweis – `src/pages/index.astro:18`**

```text
<script type="application/ld+json" set:html={JSON.stringify({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Was kostet eine Solaranlage in Leipzig?", "acceptedAnswer": {"@type": "Answer", "text": "Eine Solaranlage in Leipzig kostet je nach Größe zwischen 7.500 € und 25.000 €. Ein typisches Einfamilienhaus mit 8–10 kWp Leistung liegt bei rund 11.500 € inklusive Stromspeicher und Montage. Dank 0% Mehrwertsteuer und möglicher SAB-Förderung in Sachsen amortisiert sich die Anlage in Leipzig durchschnittlich in 8–12 Jahren."}}, {"@type": "Question", "name": "Lohnt sich Photovoltaik in Leipzig wirklich?", "acceptedAnswer": {"@type": "Answer", "text": "Ja – Leipzig hat mit rund 1.600 Sonnenstunden pro Jahr überraschend gute Bedingungen für Photovoltaik. Eine 10-kWp-Anlage erzeugt hier jährlich etwa 9.000–10.000 kWh. Bei einem Strompreis von 40 Cent/kWh und 80% Eigenverbrauch mit Speicher sparen Sie über 2.500 € jährlich."}}, {"@type": "Question", "name": "Kann ich in Leipzig auch bei Denkmalschutz eine Solaranlage installieren?", "acceptedAnswer": {"@type": "Answer", "text": "Grundsätzlich ist eine Solaranlage auch an Denkmälern möglich, wenn sie von der Straße nicht sichtbar ist oder das Erscheinungsbild nicht wesentlich beeinträchtigt. Wir kennen die Leipziger Denkmalschutzbehörde und begleiten Sie durch den Genehmigungsprozess."}}, {"@type": "Question", "name": "Welche Förderungen gibt es für Solaranlagen in Leipzig 2026?", "acceptedAnswer": {"@type": "Answer", "text": "Für Solaranlagen in Leipzig gibt es 2026: (1) 0% Mehrwertsteuer auf Kauf und Installation, (2) KfW-Kredit 270 für Erneuerbare Energien, (3) SAB-Förderprogramm Sachsen für Stromspeicher, (4) Einspeisevergütung nach EEG."}}]})} />
```

**79. SAB-Förderhinweis – `src/pages/index.astro:295`**

```text
Dazu gibt's attraktive Förderungen – Sachsen bietet über die SAB zusätzliche Zuschüsse zur Bundesförderung. Ob Solaranlage fürs Eigenheim , PV-Anlage für Ihr Unternehmen oder Wallbox für Ihr E-Auto – wir liefern alles aus einer Hand.
```

**80. SAB-Förderhinweis – `src/pages/index.astro:350`**

```text
Förderung Sachsen (SAB)
```

**81. SAB-Förderhinweis – `src/pages/index.astro:351`**

```text
Bis zu 500 € Zuschuss über SAB-Programm 2026 möglich
```

**82. SAB-Förderhinweis – `src/pages/index.astro:375`**

```text
Eine Solaranlage in Leipzig kostet je nach Größe zwischen 7.500 € und 25.000 €. Ein typisches Einfamilienhaus mit 8–10 kWp Leistung liegt bei rund 11.500 € inklusive Stromspeicher und Montage. Dank 0% Mehrwertsteuer auf Photovoltaikanlagen seit 2023 und möglicher SAB-Förderung in Sachsen amortisiert sich die Anlage in Leipzig durchschnittlich in 8–12 Jahren. Wir bieten Festpreise ohne versteckte Kosten – fordern Sie jetzt Ihr kostenloses Angebot an.
```

**83. SAB-Förderhinweis – `src/pages/index.astro:402`**

```text
Für Solaranlagen in Leipzig und Sachsen gibt es 2026 mehrere Förderwege: (1) 0% Mehrwertsteuer auf Kauf und Installation der PV-Anlage (bundesweit). (2) KfW-Kredit 270 für Erneuerbare Energien mit günstigen Zinsen. (3) SAB-Förderprogramm Sachsen für Stromspeicher. (4) Einspeisevergütung nach EEG für überschüssigen Solarstrom. Wir berechnen in unserer kostenlosen Beratung, welche Kombination für Sie am günstigsten ist.
```

**84. Festpreis-Garantie – `src/pages/index.astro:270`**

```text
Festpreis-Garantie
```

**85. Festpreis-Garantie – `src/pages/index.astro:342`**

```text
Festpreis-Garantie
```

**86. Kostenlos / kostenloses Angebot – `src/pages/kontakt.astro:12`**

```text
const pageTitle = "Kontakt | Photovoltaik Leipzig – Kostenlose Beratung";
```

**87. Kostenlos / kostenloses Angebot – `src/pages/kontakt.astro:13`**

```text
const pageDescription = "Photovoltaik Leipzig kontaktieren ➤ Kostenlosen Beratungstermin vereinbaren ✓ Angebot in 24h ✓ Vor-Ort-Beratung ✓ An der Hebemärchte 1, 04316 Leipzig ☎ 0341 98 99 03 91";
```

**88. 2.400 Anlagen – `src/pages/privat.astro:14`**

```text
const pageDescription = "Solaranlage fürs Eigenheim Leipzig ➤ Komplettpaket ab 7.500€ ✓ 0% MwSt. ✓ 2.400+ realisierte Anlagen ✓ Bis 80% Stromkosten sparen ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**89. 2.400 Anlagen – `src/pages/privat.astro:68`**

```text
2.400+
```

**90. 2.400 Anlagen – `src/pages/privat.astro:90`**

```text
2.400+
```

**91. Kostenlos / kostenloses Angebot – `src/pages/privat.astro:14`**

```text
const pageDescription = "Solaranlage fürs Eigenheim Leipzig ➤ Komplettpaket ab 7.500€ ✓ 0% MwSt. ✓ 2.400+ realisierte Anlagen ✓ Bis 80% Stromkosten sparen ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**92. Kostenlos / kostenloses Angebot – `src/pages/privat.astro:48`**

```text
Kostenloses Angebot
```

**93. Kostenlos / kostenloses Angebot – `src/pages/privat.astro:194`**

```text
Nach der Amortisationszeit produzieren Sie kostenlosen Strom für weitere 20+ Jahre.
```

**94. Kostenlos / kostenloses Angebot – `src/pages/privat.astro:392`**

```text
Kostenloses Erstgespräch und Vor-Ort-Besichtigung zur Dachanalyse (Statik, Verschattung, Ausrichtung).
```

**95. Kostenlos / kostenloses Angebot – `src/pages/privat.astro:658`**

```text
Fordern Sie jetzt Ihr kostenloses, unverbindliches Angebot an und starten Sie in eine nachhaltige Zukunft.
```

**96. Kostenlos / kostenloses Angebot – `src/pages/ratgeber.astro:61`**

```text
Kostenlose Beratung zu Förderungen
```

**97. Kostenlos / kostenloses Angebot – `src/pages/ratgeber.astro:261`**

```text
Laden Sie die kostenlose PDF-Checkliste der Verbraucherzentrale herunter. So vergessen Sie garantiert nichts bei der Planung Ihrer Anlage.
```

**98. Kostenlos / kostenloses Angebot – `src/pages/ratgeber.astro:268`**

```text
Kostenloser externer Download; keine Eingabe persönlicher Daten nötig.
```

**99. Kostenlos / kostenloses Angebot – `src/pages/ratgeber.astro:280`**

```text
Unsere Solar-Experten beraten Sie gerne kostenlos und unverbindlich zu allen Themen rund um Photovoltaik.
```

**100. Kostenlos / kostenloses Angebot – `src/pages/ratgeber.astro:283`**

```text
Jetzt kostenlos beraten lassen
```

**101. SAB-Förderhinweis – `src/pages/ratgeber/foerderung.astro:14`**

```text
const pageDescription = "Aktuelle Förderprogramme für Photovoltaik, Speicher und Wallboxen. KfW, SAB und lokale Zuschüsse im Überblick.";
```

**102. SAB-Förderhinweis – `src/pages/ratgeber/foerderung.astro:70`**

```text
SAB Förderprogramme
```

**103. SAB-Förderhinweis – `src/pages/ratgeber/foerderung.astro:72`**

```text
Die Sächsische Aufbaubank (SAB) legt immer wieder Programme für Speicher oder Balkonkraftwerke auf. Die Situation ändert sich hier dynamisch.
```

**104. SAB-Förderhinweis – `src/pages/ratgeber/foerderung.astro:74`**

```text
Zur SAB Website →
```

**105. Kostenlos / kostenloses Angebot – `src/pages/ratgeber/kosten.astro:93`**

```text
Kostenloser Strom
```

**106. 2.400 Anlagen – `src/pages/referenzen.astro:13`**

```text
const pageDescription = "Photovoltaik Referenzen Leipzig ➤ Über 2.400 realisierte Solaranlagen ✓ Echte Projekte in Leipzig & Sachsen ✓ Bewertungen & Fotos ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**107. 2.400 Anlagen – `src/pages/referenzen.astro:215`**

```text
Seit unserer Gründung haben wir über 2.400 Photovoltaikanlagen in Leipzig und der Region installiert. Unsere Kunden schätzen die professionelle Beratung, die saubere Montage und den zuverlässigen Service. Das bestätigt auch unsere durchschnittliche Bewertung von 4,9 Sternen bei Google.
```

**108. Kostenlos / kostenloses Angebot – `src/pages/referenzen.astro:13`**

```text
const pageDescription = "Photovoltaik Referenzen Leipzig ➤ Über 2.400 realisierte Solaranlagen ✓ Echte Projekte in Leipzig & Sachsen ✓ Bewertungen & Fotos ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**109. Kostenlos / kostenloses Angebot – `src/pages/referenzen.astro:200`**

```text
Kostenlose Beratung anfordern
```

**110. Kostenlos / kostenloses Angebot – `src/pages/service.astro:14`**

```text
const pageDescription = "PV Wartung & Reinigung Leipzig ➤ Solaranlage warten & reinigen ✓ 24h Notdienst ✓ Solarpark Betreuung ✓ Wartungsvertrag ab 99€/Jahr ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**111. Gründung / Fachbetrieb seit 2002 – `src/pages/solaranlage-leipzig.astro:1251`**

```text
Wer eine Solaranlage in Leipzig plant, braucht eine Lösung, die zu Dach, Stromverbrauch und Alltag passt. Presolaris plant und installiert seit 2002 in Leipzig und Sachsen; über 2.400 realisierte Anlagen bilden die Erfahrung aus der Praxis. Unser Komplettpaket beginnt bei 8.900 € und umfasst Beratung, Planung, Montage, Anmeldung beim Netzbetreiber und Inbetriebnahme – nachvollziehbar kalkuliert und aus einer Hand.
```

**112. Gründung / Fachbetrieb seit 2002 – `src/pages/solaranlage-leipzig.astro:1323`**

```text
Solaranlage Leipzig kaufen – Warum Presolaris seit 2002 die erste Wahl ist
```

**113. Gründung / Fachbetrieb seit 2002 – `src/pages/solaranlage-leipzig.astro:1325`**

```text
Wenn Sie eine Solaranlage in Leipzig kaufen möchten, begleitet Presolaris Ihr Projekt von der ersten Dachprüfung bis zur Inbetriebnahme. Seit 2002 sind wir in Leipzig und Sachsen aktiv; über 2.400 realisierte Photovoltaikanlagen bilden dafür die praktische Grundlage. Planung, Montage und die Anmeldung beim Netzbetreiber Netz Leipzig werden in einem klaren Ablauf koordiniert.
```

**114. 2.400 Anlagen – `src/pages/solaranlage-leipzig.astro:137`**

```text
Sie möchten eine Solaranlage in Leipzig kaufen ? Presolaris plant und installiert Ihre Anlage als Komplettlösung ab 8.900 € inklusive Montage . Über 2.400 realisierte Anlagen in Leipzig und Sachsen stehen für Erfahrung aus der Praxis. Wir prüfen Ihr Dach, planen Module, Wechselrichter und auf Wunsch einen Stromspeicher, koordinieren die Anmeldung beim Netzbetreiber und begleiten die Inbetriebnahme. Sie erhalten eine nachvollziehbare Kalkulation für Ihr Zuhause – persönlich, regional und ohne unnötige Umwege. Fordern Sie jetzt Ihr kostenloses Angebot für Ihre Solaranlage in Leipzig an.
```

**115. 2.400 Anlagen – `src/pages/solaranlage-leipzig.astro:186`**

```text
2.400+ Solaranlagen installiert
```

**116. 2.400 Anlagen – `src/pages/solaranlage-leipzig.astro:1251`**

```text
Wer eine Solaranlage in Leipzig plant, braucht eine Lösung, die zu Dach, Stromverbrauch und Alltag passt. Presolaris plant und installiert seit 2002 in Leipzig und Sachsen; über 2.400 realisierte Anlagen bilden die Erfahrung aus der Praxis. Unser Komplettpaket beginnt bei 8.900 € und umfasst Beratung, Planung, Montage, Anmeldung beim Netzbetreiber und Inbetriebnahme – nachvollziehbar kalkuliert und aus einer Hand.
```

**117. 2.400 Anlagen – `src/pages/solaranlage-leipzig.astro:1325`**

```text
Wenn Sie eine Solaranlage in Leipzig kaufen möchten, begleitet Presolaris Ihr Projekt von der ersten Dachprüfung bis zur Inbetriebnahme. Seit 2002 sind wir in Leipzig und Sachsen aktiv; über 2.400 realisierte Photovoltaikanlagen bilden dafür die praktische Grundlage. Planung, Montage und die Anmeldung beim Netzbetreiber Netz Leipzig werden in einem klaren Ablauf koordiniert.
```

**118. Leistungsgarantie – `src/pages/solaranlage-leipzig.astro:192`**

```text
25 Jahre Leistungsgarantie
```

**119. Leistungsgarantie – `src/pages/solaranlage-leipzig.astro:239`**

```text
25 Jahre Leistungsgarantie
```

**120. Leistungsgarantie – `src/pages/solaranlage-leipzig.astro:240`**

```text
25 Jahre Leistungsgarantie auf alle Solarmodule – plus Festpreis ohne versteckte Kosten.
```

**121. Leistungsgarantie – `src/pages/solaranlage-leipzig.astro:605`**

```text
Premium-Module mit 25 Jahren Leistungsgarantie
```

**122. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:137`**

```text
Sie möchten eine Solaranlage in Leipzig kaufen ? Presolaris plant und installiert Ihre Anlage als Komplettlösung ab 8.900 € inklusive Montage . Über 2.400 realisierte Anlagen in Leipzig und Sachsen stehen für Erfahrung aus der Praxis. Wir prüfen Ihr Dach, planen Module, Wechselrichter und auf Wunsch einen Stromspeicher, koordinieren die Anmeldung beim Netzbetreiber und begleiten die Inbetriebnahme. Sie erhalten eine nachvollziehbare Kalkulation für Ihr Zuhause – persönlich, regional und ohne unnötige Umwege. Fordern Sie jetzt Ihr kostenloses Angebot für Ihre Solaranlage in Leipzig an.
```

**123. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:165`**

```text
Jetzt kostenloses Angebot in 24h erhalten
```

**124. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:277`**

```text
Kostenlose Vor-Ort-Beratung
```

**125. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:662`**

```text
Kostenlose Vor-Ort-Beratung
```

**126. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:665`**

```text
ein maßgeschneidertes Angebot – kostenlos und unverbindlich.
```

**127. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:960`**

```text
1. Kostenlose Beratung
```

**128. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1214`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**129. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1216`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**130. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1228`**

```text
Starten Sie noch heute in Ihre energieunabhängige Zukunft. Wir beraten Sie kostenlos
```

**131. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1233`**

```text
Kostenlose Beratung anfragen
```

**132. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1260`**

```text
Ob Solaranlage fürs Eigenheim , PV-Anlage für Ihr Unternehmen , Wallbox für Ihr E-Auto oder Stromspeicher für maximale Unabhängigkeit – wir liefern alles aus einer Hand. Fordern Sie jetzt Ihr kostenloses Angebot an: 0341 98 99 03 91
```

**133. Kostenlos / kostenloses Angebot – `src/pages/solaranlage-leipzig.astro:1331`**

```text
Fordern Sie jetzt Ihr kostenloses Angebot für Ihre Solaranlage in Leipzig an. Innerhalb von 24 Stunden erhalten Sie eine detaillierte Kalkulation – transparent, verständlich und ohne Verpflichtung. Rufen Sie uns an: 0341 98 99 03 91 .
```

**134. Kostenlos / kostenloses Angebot – `src/pages/solarmanager.astro:16`**

```text
description="Solarmanager Leipzig ➤ Intelligentes Energiemanagement ✓ PV, Stromspeicher & Wallbox zentral steuern ✓ Bis 30% mehr Eigenverbrauch ✓ Kostenlose Beratung ☎ 0341 98 99 03 91">
```

**135. Kostenlos / kostenloses Angebot – `src/pages/solarmanager.astro:394`**

```text
Machen Sie Ihr Zuhause smart und effizient. Wir beraten Sie gerne zur Integration des Solarmanagers in Ihr System – kostenlos und unverbindlich.
```

**136. Kostenlos / kostenloses Angebot – `src/pages/solarmanager.astro:397`**

```text
Jetzt kostenlose Beratung anfordern
```

**137. Kostenlos / kostenloses Angebot – `src/pages/standorte/anhalt-bitterfeld.astro:14`**

```text
const pageDescription = "Photovoltaik in Anhalt-Bitterfeld ➤ Bitterfeld-Wolfen, Dessau-Roßlau, Köthen ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**138. Kostenlos / kostenloses Angebot – `src/pages/standorte/anhalt-bitterfeld.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Anhalt-Bitterfeld für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**139. Kostenlos / kostenloses Angebot – `src/pages/standorte/anhalt-bitterfeld.astro:100`**

```text
Kostenlose Beratung
```

**140. Kostenlos / kostenloses Angebot – `src/pages/standorte/anhalt-bitterfeld.astro:317`**

```text
Lassen Sie sich von unseren Experten beraten. Kostenlos, unverbindlich und vor Ort.
```

**141. Kostenlos / kostenloses Angebot – `src/pages/standorte/anhalt-bitterfeld.astro:324`**

```text
Kostenlose Beratung
```

**142. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:14`**

```text
const pageDescription = "Photovoltaik Borna ➤ Solaranlage vom regionalen Fachbetrieb ✓ Bis 80% Stromkosten sparen ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**143. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Borna für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**144. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:104`**

```text
Kostenlose Beratung
```

**145. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:205`**

```text
Kostenlose Vor-Ort-Beratung und detaillierte Wirtschaftlichkeitsberechnung.
```

**146. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:257`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit Photovoltaik sparen können.
```

**147. Kostenlos / kostenloses Angebot – `src/pages/standorte/borna.astro:264`**

```text
Kostenlose Beratung
```

**148. Kostenlos / kostenloses Angebot – `src/pages/standorte/burgenlandkreis.astro:14`**

```text
const pageDescription = "Photovoltaik im Burgenlandkreis ➤ Naumburg, Weißenfels, Zeitz ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**149. Kostenlos / kostenloses Angebot – `src/pages/standorte/burgenlandkreis.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb im Burgenlandkreis für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**150. Kostenlos / kostenloses Angebot – `src/pages/standorte/burgenlandkreis.astro:100`**

```text
Kostenlose Beratung
```

**151. Kostenlos / kostenloses Angebot – `src/pages/standorte/burgenlandkreis.astro:318`**

```text
Lassen Sie sich von unseren Experten beraten. Kostenlos, unverbindlich und vor Ort.
```

**152. Kostenlos / kostenloses Angebot – `src/pages/standorte/burgenlandkreis.astro:325`**

```text
Kostenlose Beratung
```

**153. Kostenlos / kostenloses Angebot – `src/pages/standorte/dresden.astro:14`**

```text
const pageDescription = "Photovoltaik Dresden ➤ Neustadt, Blasewitz, Striesen ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ✓ Förderung & Finanzierung ☎ Jetzt anfragen";
```

**154. Kostenlos / kostenloses Angebot – `src/pages/standorte/dresden.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Dresden für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**155. Kostenlos / kostenloses Angebot – `src/pages/standorte/dresden.astro:108`**

```text
Kostenlose Beratung
```

**156. Kostenlos / kostenloses Angebot – `src/pages/standorte/dresden.astro:272`**

```text
Kostenlose Vor-Ort-Analyse in Dresden und Umgebung. Individuelles Angebot innerhalb von 48 Stunden.
```

**157. 2.400 Anlagen – `src/pages/standorte/elbe-elster.astro:365`**

```text
Autarkie: 85% | Ersparnis: 2.400€/Jahr
```

**158. Kostenlos / kostenloses Angebot – `src/pages/standorte/elbe-elster.astro:14`**

```text
const pageDescription = "Photovoltaik Elbe-Elster ➤ Elsterwerda, Riesa, Oschatz ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**159. Kostenlos / kostenloses Angebot – `src/pages/standorte/elbe-elster.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Elbe-Elster für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**160. Kostenlos / kostenloses Angebot – `src/pages/standorte/elbe-elster.astro:108`**

```text
Kostenlose Beratung
```

**161. Kostenlos / kostenloses Angebot – `src/pages/standorte/elbe-elster.astro:398`**

```text
Jetzt kostenlose Vor-Ort-Beratung vereinbaren
```

**162. Kostenlos / kostenloses Angebot – `src/pages/standorte/elbe-elster.astro:400`**

```text
Wir kommen zu Ihnen nach Hause, analysieren Ihr Dach und erstellen ein individuelles Angebot – kostenlos und unverbindlich.
```

**163. 2.400 Anlagen – `src/pages/standorte/erfurt.astro:365`**

```text
Autarkie: 85% | Ersparnis: 2.400€/Jahr
```

**164. Kostenlos / kostenloses Angebot – `src/pages/standorte/erfurt.astro:14`**

```text
const pageDescription = "Photovoltaik in Erfurt & Umgebung ➤ Weimar, Gotha, Arnstadt, Sömmerda ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**165. Kostenlos / kostenloses Angebot – `src/pages/standorte/erfurt.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Erfurt für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**166. Kostenlos / kostenloses Angebot – `src/pages/standorte/erfurt.astro:108`**

```text
Kostenlose Beratung
```

**167. Kostenlos / kostenloses Angebot – `src/pages/standorte/erfurt.astro:398`**

```text
Jetzt kostenlose Vor-Ort-Beratung vereinbaren
```

**168. Kostenlos / kostenloses Angebot – `src/pages/standorte/erfurt.astro:400`**

```text
Wir kommen zu Ihnen nach Hause, analysieren Ihr Dach und erstellen ein individuelles Angebot – kostenlos und unverbindlich.
```

**169. Kostenlos / kostenloses Angebot – `src/pages/standorte/gera.astro:14`**

```text
const pageDescription = "Photovoltaik in Gera & Umland ➤ Gera, Greiz, Altenburg, Schmölln ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**170. Kostenlos / kostenloses Angebot – `src/pages/standorte/gera.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Gera für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**171. Kostenlos / kostenloses Angebot – `src/pages/standorte/gera.astro:100`**

```text
Kostenlose Beratung
```

**172. Kostenlos / kostenloses Angebot – `src/pages/standorte/gera.astro:318`**

```text
Lassen Sie sich von unseren Experten beraten. Kostenlos, unverbindlich und vor Ort.
```

**173. Kostenlos / kostenloses Angebot – `src/pages/standorte/gera.astro:325`**

```text
Kostenlose Beratung
```

**174. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:14`**

```text
const pageDescription = "Photovoltaik Grimma ➤ Solaranlage vom regionalen Fachbetrieb ✓ Bis 80% Stromkosten sparen ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**175. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Grimma für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**176. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:100`**

```text
Kostenlose Beratung
```

**177. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:201`**

```text
Kostenlose Vor-Ort-Beratung und detaillierte Wirtschaftlichkeitsberechnung.
```

**178. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:253`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit Photovoltaik sparen können.
```

**179. Kostenlos / kostenloses Angebot – `src/pages/standorte/grimma.astro:260`**

```text
Kostenlose Beratung
```

**180. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:14`**

```text
const pageDescription = "Photovoltaik Halle ➤ Solaranlage Halle kaufen & installieren ✓ Bis 80% Stromkosten sparen ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**181. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Halle (Saale) für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**182. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:104`**

```text
Kostenlose Beratung
```

**183. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:205`**

```text
Kostenlose Vor-Ort-Beratung und detaillierte Wirtschaftlichkeitsberechnung.
```

**184. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:257`**

```text
Lassen Sie sich jetzt kostenlos beraten und erfahren Sie, wie viel Sie mit Photovoltaik sparen können.
```

**185. Kostenlos / kostenloses Angebot – `src/pages/standorte/halle.astro:264`**

```text
Kostenlose Beratung
```

**186. 2.400 Anlagen – `src/pages/standorte/leipzig.astro:365`**

```text
Autarkie: 85% | Ersparnis: 2.400€/Jahr
```

**187. Kostenlos / kostenloses Angebot – `src/pages/standorte/leipzig.astro:14`**

```text
const pageDescription = "Photovoltaik in Leipzig & Umgebung ➤ Gohlis, Connewitz, Plagwitz ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**188. Kostenlos / kostenloses Angebot – `src/pages/standorte/leipzig.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Leipzig für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**189. Kostenlos / kostenloses Angebot – `src/pages/standorte/leipzig.astro:108`**

```text
Kostenlose Beratung
```

**190. Kostenlos / kostenloses Angebot – `src/pages/standorte/leipzig.astro:398`**

```text
Jetzt kostenlose Vor-Ort-Beratung vereinbaren
```

**191. Kostenlos / kostenloses Angebot – `src/pages/standorte/leipzig.astro:400`**

```text
Wir kommen zu Ihnen nach Hause, analysieren Ihr Dach und erstellen ein individuelles Angebot – kostenlos und unverbindlich.
```

**192. Kostenlos / kostenloses Angebot – `src/pages/standorte/magdeburg.astro:14`**

```text
const pageDescription = "Photovoltaik in Magdeburg ➤ Magdeburg, Schönebeck, Burg, Haldensleben ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**193. Kostenlos / kostenloses Angebot – `src/pages/standorte/magdeburg.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Magdeburg für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**194. Kostenlos / kostenloses Angebot – `src/pages/standorte/magdeburg.astro:100`**

```text
Kostenlose Beratung
```

**195. Kostenlos / kostenloses Angebot – `src/pages/standorte/magdeburg.astro:318`**

```text
Lassen Sie sich von unseren Experten beraten. Kostenlos, unverbindlich und vor Ort.
```

**196. Kostenlos / kostenloses Angebot – `src/pages/standorte/magdeburg.astro:325`**

```text
Kostenlose Beratung
```

**197. Kostenlos / kostenloses Angebot – `src/pages/standorte/naumburg.astro:14`**

```text
const pageDescription = "Photovoltaik Naumburg ➤ Bad Kösen, Großjena ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**198. Kostenlos / kostenloses Angebot – `src/pages/standorte/naumburg.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Naumburg für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**199. Kostenlos / kostenloses Angebot – `src/pages/standorte/naumburg.astro:82`**

```text
Kostenlose Beratung
```

**200. Kostenlos / kostenloses Angebot – `src/pages/standorte/naumburg.astro:265`**

```text
Danach produzieren Sie 15-20 Jahre lang nahezu kostenlosen Strom.
```

**201. Kostenlos / kostenloses Angebot – `src/pages/standorte/naumburg.astro:462`**

```text
Kostenlose Vor-Ort-Analyse in Naumburg und dem Burgenlandkreis. Individuelles Angebot innerhalb von 48 Stunden.
```

**202. Kostenlos / kostenloses Angebot – `src/pages/standorte/nordsachsen.astro:14`**

```text
const pageDescription = "Photovoltaik Nordsachsen ➤ Delitzsch, Torgau, Eilenburg, Oschatz ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ✓ Förderung ☎ Jetzt anfragen";
```

**203. Kostenlos / kostenloses Angebot – `src/pages/standorte/nordsachsen.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Nordsachsen für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation.",
```

**204. Kostenlos / kostenloses Angebot – `src/pages/standorte/nordsachsen.astro:104`**

```text
Kostenlose Beratung
```

**205. Kostenlos / kostenloses Angebot – `src/pages/standorte/nordsachsen.astro:279`**

```text
Kostenlose Beratung in Nordsachsen
```

**206. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:14`**

```text
const pageDescription = "Photovoltaik Anbieter Leipzig gesucht? ➤ Presolaris - Ihr zertifizierter Fachbetrieb ✓ Über 500 Anlagen installiert ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**207. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:62`**

```text
"text": "Achten Sie auf Zertifizierungen, Erfahrung (Anzahl installierter Anlagen), Kundenbewertungen und regionale Präsenz. Ein guter Photovoltaik Anbieter bietet kostenlose Vor-Ort-Beratung und transparente Angebote."
```

**208. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:117`**

```text
Kostenlose Beratung
```

**209. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:331`**

```text
Achten Sie auf Zertifizierungen, Erfahrung (Anzahl installierter Anlagen), Kundenbewertungen und regionale Präsenz. Ein guter Photovoltaik Anbieter bietet kostenlose Vor-Ort-Beratung und transparente Angebote.
```

**210. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:378`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**211. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:380`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**212. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:392`**

```text
Kontaktieren Sie uns für eine kostenlose und unverbindliche Beratung.
```

**213. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-anbieter-leipzig.astro:397`**

```text
Kostenlose Beratung anfragen
```

**214. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-delitzsch.astro:14`**

```text
const pageDescription = "Photovoltaik Delitzsch ➤ Ihr regionaler Fachbetrieb ✓ Beratung, Installation & Service ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**215. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-delitzsch.astro:99`**

```text
Kostenlose Beratung
```

**216. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-delitzsch.astro:294`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage in Delitzsch.
```

**217. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-delitzsch.astro:298`**

```text
Kostenlose Beratung anfragen
```

**218. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-eilenburg.astro:92`**

```text
Kostenlose Beratung
```

**219. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-eilenburg.astro:237`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage in Eilenburg.
```

**220. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-eilenburg.astro:241`**

```text
Kostenlose Beratung anfragen
```

**221. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:14`**

```text
const pageDescription = "Photovoltaik Firma Leipzig ➤ Presolaris - Ihr lokaler Partner ✓ Über 500 Anlagen ✓ Komplettservice ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**222. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:108`**

```text
Kostenlose Beratung
```

**223. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:330`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**224. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:332`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**225. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:344`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung. Als Ihre lokale Photovoltaik Firma
```

**226. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-firma-leipzig.astro:349`**

```text
Kostenlose Beratung anfragen
```

**227. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-markkleeberg.astro:14`**

```text
const pageDescription = "Photovoltaik Markkleeberg ➤ Ihr regionaler Fachbetrieb ✓ Beratung, Installation & Service ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**228. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-markkleeberg.astro:91`**

```text
Kostenlose Beratung
```

**229. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-markkleeberg.astro:262`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage in Markkleeberg.
```

**230. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-markkleeberg.astro:266`**

```text
Kostenlose Beratung anfragen
```

**231. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-taucha.astro:92`**

```text
Kostenlose Beratung
```

**232. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-taucha.astro:237`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage in Taucha.
```

**233. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-taucha.astro:241`**

```text
Kostenlose Beratung anfragen
```

**234. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-wurzen.astro:14`**

```text
const pageDescription = "Photovoltaik Wurzen ➤ Ihr regionaler Fachbetrieb ✓ Beratung, Installation & Service ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**235. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-wurzen.astro:91`**

```text
Kostenlose Beratung
```

**236. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-wurzen.astro:262`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung zu Ihrer Photovoltaikanlage in Wurzen.
```

**237. Kostenlos / kostenloses Angebot – `src/pages/standorte/photovoltaik-wurzen.astro:266`**

```text
Kostenlose Beratung anfragen
```

**238. Kostenlos / kostenloses Angebot – `src/pages/standorte/saalekreis.astro:14`**

```text
const pageDescription = "Photovoltaik Halle & Saalekreis ➤ Neustadt, Kröllwitz, Merseburg, Querfurt ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ☎ Jetzt anfragen";
```

**239. Kostenlos / kostenloses Angebot – `src/pages/standorte/saalekreis.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Halle (Saale) und Saalekreis für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation.",
```

**240. Kostenlos / kostenloses Angebot – `src/pages/standorte/saalekreis.astro:108`**

```text
Kostenlose Beratung
```

**241. Kostenlos / kostenloses Angebot – `src/pages/standorte/saalekreis.astro:291`**

```text
Kostenlose Beratung in Halle & Saalekreis
```

**242. Kostenlos / kostenloses Angebot – `src/pages/standorte/saalekreis.astro:293`**

```text
Wir kommen zu Ihnen nach Hause, analysieren Ihr Dach und erstellen ein individuelles Angebot – kostenlos und unverbindlich.
```

**243. 25+ Jahre – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:158`**

```text
Hochwertige Module mit 25+ Jahren Leistungsgarantie von namhaften Herstellern.
```

**244. Leistungsgarantie – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:158`**

```text
Hochwertige Module mit 25+ Jahren Leistungsgarantie von namhaften Herstellern.
```

**245. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:14`**

```text
const pageDescription = "Solaranlage kaufen in Leipzig ➤ Komplettpaket ab 8.900€ ✓ Inkl. Installation ✓ 0% MwSt. ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**246. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:76`**

```text
"text": "Eine Solaranlage in Leipzig amortisiert sich in der Regel nach 8-12 Jahren. Danach produzieren Sie kostenlos Strom für weitere 15-20 Jahre."
```

**247. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:402`**

```text
Eine Solaranlage in Leipzig amortisiert sich in der Regel nach 8-12 Jahren. Danach produzieren Sie kostenlos Strom für weitere 15-20 Jahre.
```

**248. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:412`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**249. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:414`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**250. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:427`**

```text
kostenlos und erstellen Ihr individuelles Angebot.
```

**251. Kostenlos / kostenloses Angebot – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:431`**

```text
Kostenlose Beratung anfragen
```

**252. Festpreis-Garantie – `src/pages/standorte/solaranlage-kaufen-leipzig.astro:124`**

```text
Festpreis-Garantie
```

**253. Kostenlos / kostenloses Angebot – `src/pages/standorte/solarteur-leipzig.astro:108`**

```text
Kostenlose Beratung
```

**254. Kostenlos / kostenloses Angebot – `src/pages/standorte/solarteur-leipzig.astro:285`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**255. Kostenlos / kostenloses Angebot – `src/pages/standorte/solarteur-leipzig.astro:287`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**256. Kostenlos / kostenloses Angebot – `src/pages/standorte/solarteur-leipzig.astro:299`**

```text
Kontaktieren Sie uns für eine kostenlose Beratung. Als erfahrener Solarteur
```

**257. Kostenlos / kostenloses Angebot – `src/pages/standorte/solarteur-leipzig.astro:304`**

```text
Kostenlose Beratung anfragen
```

**258. Kostenlos / kostenloses Angebot – `src/pages/standorte/stromspeicher-leipzig.astro:14`**

```text
const pageDescription = "Stromspeicher Leipzig kaufen ➤ Bis 80% Eigenverbrauch ✓ Premium-Speicher ✓ Notstromfunktion ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**259. Kostenlos / kostenloses Angebot – `src/pages/standorte/stromspeicher-leipzig.astro:386`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**260. Kostenlos / kostenloses Angebot – `src/pages/standorte/stromspeicher-leipzig.astro:388`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**261. Kostenlos / kostenloses Angebot – `src/pages/standorte/stromspeicher-leipzig.astro:400`**

```text
Lassen Sie sich kostenlos beraten, welcher Stromspeicher optimal zu Ihrer
```

**262. Kostenlos / kostenloses Angebot – `src/pages/standorte/stromspeicher-leipzig.astro:405`**

```text
Kostenlose Beratung anfragen
```

**263. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:14`**

```text
const pageDescription = "Wallbox Leipzig kaufen ➤ E-Auto mit Solarstrom laden ✓ 11 kW & 22 kW ✓ Förderung möglich ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**264. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:62`**

```text
"text": "Ja, mit einer intelligenten Wallbox und PV-Überschussladen können Sie Ihr E-Auto bevorzugt mit eigenem Solarstrom laden. So fahren Sie nahezu kostenlos und CO2-neutral."
```

**265. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:163`**

```text
Laden Sie Ihr E-Auto mit Ihrem eigenen Solarstrom – kostenlos und CO₂-frei.
```

**266. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:335`**

```text
Ja, mit einer intelligenten Wallbox und PV-Überschussladen können Sie Ihr E-Auto bevorzugt mit eigenem Solarstrom laden. So fahren Sie nahezu kostenlos und CO2-neutral.
```

**267. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:358`**

```text
Jetzt kostenlosen Beratungstermin vereinbaren
```

**268. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:360`**

```text
Unverbindlich • Kostenlos • Vor Ort in Leipzig
```

**269. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:372`**

```text
Lassen Sie sich kostenlos beraten, welche Wallbox optimal zu Ihrem E-Auto
```

**270. Kostenlos / kostenloses Angebot – `src/pages/standorte/wallbox-leipzig.astro:377`**

```text
Kostenlose Beratung anfragen
```

**271. Kostenlos / kostenloses Angebot – `src/pages/standorte/weissenfels.astro:14`**

```text
const pageDescription = "Photovoltaik Weißenfels ➤ Langendorf, Uichteritz ✓ Lokaler Fachbetrieb ✓ Kostenlose Beratung ☎ 0341 98 99 03 91";
```

**272. Kostenlos / kostenloses Angebot – `src/pages/standorte/weissenfels.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Weißenfels für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**273. Kostenlos / kostenloses Angebot – `src/pages/standorte/weissenfels.astro:82`**

```text
Kostenlose Beratung
```

**274. Kostenlos / kostenloses Angebot – `src/pages/standorte/weissenfels.astro:265`**

```text
Danach produzieren Sie 15-20 Jahre lang nahezu kostenlosen Strom.
```

**275. Kostenlos / kostenloses Angebot – `src/pages/standorte/weissenfels.astro:462`**

```text
Kostenlose Vor-Ort-Analyse in Weißenfels und dem Burgenlandkreis. Individuelles Angebot innerhalb von 48 Stunden.
```

**276. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:14`**

```text
const pageDescription = "Photovoltaik in Zeitz & Burgenlandkreis ➤ Rasberg, Theißen, Kayna ✓ Lokaler Fachbetrieb ✓ Kostenlose Vor-Ort-Beratung ☎ 0341 98 99 03 91";
```

**277. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:24`**

```text
"description": "Photovoltaik-Fachbetrieb in Zeitz für Solaranlagen, Stromspeicher und Wallboxen. Kostenlose Beratung und Installation aus einer Hand.",
```

**278. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:82`**

```text
Kostenlose Beratung
```

**279. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:265`**

```text
Danach produzieren Sie 15-20 Jahre lang nahezu kostenlosen Strom.
```

**280. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:414`**

```text
Ja, Photovoltaik lohnt sich in Zeitz besonders gut. Mit durchschnittlich 1.620 Sonnenstunden pro Jahr und der aktuellen Mehrwertsteuerbefreiung amortisiert sich eine Anlage in 8-10 Jahren. Danach produzieren Sie 15-20 Jahre lang nahezu kostenlosen Strom und sparen bei aktuellen Strompreisen über 1.800 Euro jährlich.
```

**281. Kostenlos / kostenloses Angebot – `src/pages/standorte/zeitz.astro:462`**

```text
Kostenlose Vor-Ort-Analyse in Zeitz und dem Burgenlandkreis. Individuelles Angebot innerhalb von 48 Stunden.
```

**282. Kostenlos / kostenloses Angebot – `src/pages/stromspeicher.astro:303`**

```text
Lassen Sie sich kostenlos beraten. Wir finden die optimale Speicherlösung für Ihren Bedarf.
```

**283. Kostenlos / kostenloses Angebot – `src/pages/stromspeicher.astro:306`**

```text
Kostenlose Beratung anfordern
```

**284. Kostenlos / kostenloses Angebot – `src/pages/stromspeicher.astro:381`**

```text
Wir bieten Stromspeicher von führenden Herstellern wie BYD, Huawei und RCT Power in verschiedenen Größen von 5 bis über 20 kWh. Die richtige Speichergröße hängt von Ihrem Stromverbrauch und Ihrer PV-Anlagengröße ab. Unsere Experten berechnen die optimale Konfiguration für Ihren Haushalt – kostenlos und unverbindlich.
```

**285. SAB-Förderhinweis – `src/pages/stromspeicher.astro:253`**

```text
Die KfW bietet zinsgünstige Kredite über das Programm 270 (Erneuerbare Energien Standard). Einige Bundesländer und Kommunen gewähren zusätzliche Zuschüsse. In Sachsen fördert die SAB Stromspeicher mit bis zu 1.000 € pro kWh Speicherkapazität.
```

**286. 2.400 Anlagen – `src/pages/ueber-uns.astro:7`**

```text
const pageDescription = "Photovoltaik Leipzig - Ihr zertifizierter Solarexperte. Kostenlose Beratung, Planung & Umsetzung. Über 2.400 zufriedene Kunden.";
```

**287. 2.400 Anlagen – `src/pages/ueber-uns.astro:75`**

```text
"text": "Über 2.400 zufriedene Kunden, mehr als 10 Jahre Erfahrung, zertifizierte Fachkräfte und persönliche Betreuung vor Ort. Wir sind Ihr regionaler Partner – keine anonyme Hotline, sondern echte Menschen."
```

**288. 2.400 Anlagen – `src/pages/ueber-uns.astro:257`**

```text
answer: "Über 2.400 zufriedene Kunden, mehr als 10 Jahre Erfahrung, zertifizierte Fachkräfte und persönliche Betreuung vor Ort. Wir sind Ihr regionaler Partner – keine anonyme Hotline, sondern echte Menschen."
```

**289. 2.400 Anlagen – `src/pages/ueber-uns.astro:293`**

```text
Seit über einem Jahrzehnt für Sie vor Ort. Über 2.400 zufriedene Kunden vertrauen uns bereits.
```

**290. 2.400 Anlagen – `src/pages/ueber-uns.astro:318`**

```text
2.400+
```

**291. 2.400 Anlagen – `src/pages/ueber-uns.astro:349`**

```text
Unser erfahrenes Team begleitet Sie von der ersten Beratung bis zur fertigen Anlage – alles aus einer Hand . Über 2.400 zufriedene Kunden vertrauen uns bereits.
```

**292. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:7`**

```text
const pageDescription = "Photovoltaik Leipzig - Ihr zertifizierter Solarexperte. Kostenlose Beratung, Planung & Umsetzung. Über 2.400 zufriedene Kunden.";
```

**293. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:19`**

```text
"text": "Die Kosten hängen von Dachgröße und Ihrem Strombedarf ab. Wir bieten Komplettlösungen für jedes Budget – günstiger als Sie denken! Vereinbaren Sie eine kostenlose Beratung für ein individuelles Angebot."
```

**294. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:59`**

```text
"text": "Ja, es gibt attraktive Förderprogramme von Bund und Land. Wir beraten Sie kostenlos zu allen aktuellen Fördermöglichkeiten und übernehmen die Antragstellung für Sie."
```

**295. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:67`**

```text
"text": "Absolut! Mit einer Photovoltaikanlage senken Sie Ihre Stromkosten um bis zu 80%. Die Investition amortisiert sich in der Regel nach 8-12 Jahren – danach produzieren Sie quasi kostenlosen Strom für 20+ Jahre."
```

**296. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:88`**

```text
"description": "Ihr zertifizierter Solarexperte in Leipzig. Seit über einem Jahrzehnt bieten wir kostenlose Beratung, professionelle Planung und fachgerechte Umsetzung von Solaranlagen für Privat, Gewerbe und Solarparks.",
```

**297. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:219`**

```text
title: "Kostenlose Erstberatung",
```

**298. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:229`**

```text
answer: "Die Kosten hängen von Dachgröße und Ihrem Strombedarf ab. Wir bieten Komplettlösungen für jedes Budget – günstiger als Sie denken! Vereinbaren Sie eine kostenlose Beratung für ein individuelles Angebot."
```

**299. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:249`**

```text
answer: "Ja, es gibt attraktive Förderprogramme von Bund und Land. Wir beraten Sie kostenlos zu allen aktuellen Fördermöglichkeiten und übernehmen die Antragstellung für Sie."
```

**300. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:253`**

```text
answer: "Absolut! Mit einer Photovoltaikanlage senken Sie Ihre Stromkosten um bis zu 80%. Die Investition amortisiert sich in der Regel nach 8-12 Jahren – danach produzieren Sie quasi kostenlosen Strom für 20+ Jahre."
```

**301. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:290`**

```text
Kostenlose Beratung – Professionelle Planung – Fachgerechte Umsetzung
```

**302. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:297`**

```text
Kostenlose Beratung anfordern
```

**303. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:346`**

```text
Photovoltaik Leipzig ist Ihr zertifizierter Solarexperte in der Region. Seit über einem Jahrzehnt bieten wir kostenlose Beratung , professionelle Planung und fachgerechte Umsetzung von Solaranlagen für Privat, Gewerbe und Solarparks.
```

**304. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:441`**

```text
Vereinbaren Sie jetzt Ihre kostenlose und unverbindliche Beratung. Wir analysieren Ihr Dach und erstellen ein individuelles Angebot – günstiger als Sie denken!
```

**305. Kostenlos / kostenloses Angebot – `src/pages/ueber-uns.astro:445`**

```text
Kostenlose Beratung anfordern
```

**306. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:43`**

```text
Kostenlose Beratung
```

**307. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:326`**

```text
Lassen Sie sich kostenlos beraten und erhalten Sie ein individuelles Angebot für Ihre Wallbox mit Solarstrom-Integration.
```

**308. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:333`**

```text
Kostenlose Beratung
```

**309. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:339`**

```text
Kostenlose Vor-Ort-Besichtigung
```

**310. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:365`**

```text
Die **Wallbox Installation in Leipzig** ist unkompliziert: Nach einer kostenlosen Vor-Ort-Besichtigung erhalten Sie ein Festpreis-Angebot ohne versteckte Kosten. Die Installation erfolgt in der Regel innerhalb von 1-2 Tagen durch unsere zertifizierten Elektriker aus Leipzig. Auf Wunsch integrieren wir Ihre Wallbox in ein intelligentes Energiemanagement-System mit Solarmanager, das automatisch dann lädt, wenn Ihre PV-Anlage Überschuss produziert – so laden Sie Ihr E-Auto für nur 8-10 Cent/kWh.
```

**311. Kostenlos / kostenloses Angebot – `src/pages/wallbox-leipzig.astro:378`**

```text
Eine Wallbox Installation in Leipzig kostet ab 1.200€ inkl. Montage. Der Preis hängt von der Wallbox (11 kW oder 22 kW), der Kabellänge und den örtlichen Gegebenheiten ab. Wir erstellen Ihnen ein kostenloses Festpreis-Angebot nach einer Vor-Ort-Besichtigung.
```

**312. Kostenlos / kostenloses Angebot – `src/pages/wallbox.astro:42`**

```text
Kostenlose Beratung
```

**313. Kostenlos / kostenloses Angebot – `src/pages/wallbox.astro:325`**

```text
Lassen Sie sich kostenlos beraten und erhalten Sie ein individuelles Angebot für Ihre Wallbox mit Solarstrom-Integration.
```

**314. Kostenlos / kostenloses Angebot – `src/pages/wallbox.astro:332`**

```text
Kostenlose Beratung
```

**315. Kostenlos / kostenloses Angebot – `src/pages/wallbox.astro:338`**

```text
Kostenlose Vor-Ort-Besichtigung
```

**316. Kostenlos / kostenloses Angebot – `src/pages/wallbox.astro:413`**

```text
Die eigene Wallbox ist der Schlüssel zur unabhängigen E-Mobilität. In Kombination mit einer Photovoltaikanlage laden Sie Ihr Elektroauto mit selbst erzeugtem Solarstrom – umweltfreundlich und nahezu kostenlos. Unser Team in Leipzig installiert Ihre Wallbox fachgerecht und verbindet sie optimal mit Ihrer bestehenden oder neuen PV-Anlage.
```
