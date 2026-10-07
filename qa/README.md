# Versandlose Formular- und Rechner-Regression

Diese Tests prüfen die öffentlich erreichbaren Anfragewege auf `leipzig-photovoltaik.de` zuerst gegen einen lokalen Astro-Build. Nach Veröffentlichung kann der Lese-/Bedientest mit `QA_BASE_URL=https://leipzig-photovoltaik.de` wiederholt werden. Das Browser-Routing fängt auch dann **alle POSTs** ab; an Web3Forms, Supabase oder ein Betreiberpostfach wird nichts gesendet.

## Lokal ausführen

```bash
npm ci
npm run build
python3 -m pip install playwright==1.62.0
python3 -m playwright install chromium
npm run preview -- --host 127.0.0.1 --port 4321
# Zweite Shell:
python3 qa/test_fixed_site.py
python3 qa/test_calculators_fixed.py
```

Wird unter Linux bereits `/usr/bin/chromium` gefunden, nutzen die Tests ihn; `QA_CHROMIUM_PATH` kann eine explizite Browserdatei vorgeben. Die Ergebnisse werden lokal in `qa/*-regression.json` geschrieben und nicht versioniert.

`test_fixed_site.py` prüft zehn Anfragewege und den Angebotsdialog auf Desktop/Mobil einschließlich leerer Felder, ungültiger E-Mail, abgelehnter und bestätigter API-Antwort, Seitentreue und Anfragekontext. Bei Telefonfeldern mit `pattern` werden gültige RegEx-`v`-Syntax, Ablehnung von `ungueltig` und Annahme von `0341 1234567` geprüft. Außerdem: ein zu großer beziehungsweise gültiger optionaler PDF-Anhang und der echte Ratgeber-Downloadlink. `test_calculators_fixed.py` prüft beide vorhandenen Rechner auf Desktop/Mobil: Ergebnisse bei Slider-Grenzwerten, Speicher-aus, PDF und Übergabe der Gewerbe-Ergebnisse.

Die öffentliche Domain wird über **Vercel** ausgeliefert. Der ebenfalls vorhandene GitHub-Pages-Workflow baut bei Push nach `main`, führt diese Browser-Tests aber **nicht** automatisch aus; der GitHub-App fehlen separate Rechte für Workflow-Änderungen. Vor dem Merge müssen `npm run build` und beide Python-Skripte **manuell** erfolgreich durchlaufen. Nach dem Vercel-Produktionsdeployment die Seite mit `QA_BASE_URL=https://leipzig-photovoltaik.de python3 qa/test_fixed_site.py` und entsprechend `qa/test_calculators_fixed.py` erneut ohne echte Übermittlung prüfen. Ein grüner Mock-Test ist kein Beweis für den Eingang einer echten E-Mail; dazu ist eine kontrollierte Betreiberprüfung nötig.

## Brevo-Transactional-Vorstufe (07.10.2026)

`api/lead.ts` ist eine gleichursprüngliche Vercel-Function. Die Website bleibt standardmäßig bei Web3Forms, solange `PUBLIC_LEAD_PROVIDER` **nicht** auf `brevo` gesetzt wurde. Die Brevo-Function hat ohne private Vercel-Umgebungsvariablen einen eindeutigen 503-Fehler statt eines vorgetäuschten Erfolgs. Sie nimmt nur die zehn festen Anfragequellen an und sendet ausschließlich an `BREVO_LEAD_RECIPIENT` aus dem Server-Secret; der Browser kann keinen Empfänger bestimmen. Private Schlüssel gehören niemals zu `PUBLIC_`-Variablen.

Voraussetzungen **vor produktiver Aktivierung**: Im richtigen Vercel-Projekt einen tatsächlich nutzbaren Brevo Transactional API-Key als `BREVO_API_KEY` hinterlegen; `BREVO_SENDER_EMAIL` als verifizierten Absender und `BREVO_LEAD_RECIPIENT` als festes Betreiberpostfach setzen. Brevo Transactional muss aktiv sein. Zusätzlich Honeypot/Origin-Checks um Vercel-WAF-Rate-Limiting ergänzen; ein öffentlicher Formularendpunkt bleibt sonst gegen verteilten Spam verwundbar. Datenschutzhinweise vor dem Umschalten auf den tatsächlich genutzten Dienst und den Auftragsverarbeitungsvertrag prüfen. Dann `PUBLIC_LEAD_PROVIDER=brevo` als Build-Variable setzen, Vorschau testen, Postfach-Eingang einer einzelnen ausdrücklich markierten Testanfrage bestätigen und erst danach auf Produktion veröffentlichen. Bei Bedarf ist der Schalter reversibel; Providerfehler lösen **keine** automatische Doppelübermittlung an Web3Forms aus.

```bash
# Backend ohne echten Versand:
node --experimental-strip-types --test qa/test_brevo_api.mjs
# Brevo-Browser-Build (alle POSTs in qa/test_fixed_site.py abgefangen):
PUBLIC_LEAD_PROVIDER=brevo npm run build
npm run preview -- --host 127.0.0.1 --port 4321
QA_LEAD_PROVIDER=brevo python3 qa/test_fixed_site.py
python3 qa/test_calculators_fixed.py
```

Achtung: [Vercel Functions](https://vercel.com/docs/functions/limitations#request-body-size) erlaubt pro Request maximal 4,5 MB. Deshalb zeigt und akzeptiert der Brevo-Modus bei einem optionalen Anhang maximal **3 MB**, der alte Web3Forms-Modus weiterhin 5 MB. Mehr als 3 MB erfordert eine zusätzliche direkte Upload-/Speicherarchitektur, nicht bloß eine größere JavaScript-Zahl. Die Brevo-`messageId` belegt ausschließlich die API-Annahme, nicht den Eingang im Empfängerpostfach. Browser-Tests simulieren beide API-Antworten und senden keine realen Leads.
