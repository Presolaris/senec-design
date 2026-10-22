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

`test_fixed_site.py` prüft zehn Anfragewege und den Angebotsdialog auf Desktop/Mobil einschließlich leerer Felder, ungültiger E-Mail, Pflichttelefon, abgelehnter und erfolgreich vorbereiteter Bestätigungs-E-Mail, Seitentreue und Anfragekontext. Bei Telefonfeldern mit `pattern` werden gültige RegEx-`v`-Syntax, Ablehnung von `ungueltig` und Annahme von `0341 1234567` geprüft. Anhänge werden vor der E-Mail-Bestätigung datensparsam zurückgewiesen; sie können anschließend als Antwort auf die Bestätigungs-E-Mail eingereicht werden. `test_calculators_fixed.py` prüft beide vorhandenen Rechner auf Desktop/Mobil: Ergebnisse bei Slider-Grenzwerten, Speicher-aus, PDF und Übergabe der Gewerbe-Ergebnisse.

Die öffentliche Domain wird über **Vercel** ausgeliefert. Der ebenfalls vorhandene GitHub-Pages-Workflow baut bei Push nach `main`, führt diese Browser-Tests aber **nicht** automatisch aus; der GitHub-App fehlen separate Rechte für Workflow-Änderungen. Vor dem Merge müssen `npm run build` und beide Python-Skripte **manuell** erfolgreich durchlaufen. Nach dem Vercel-Produktionsdeployment die Seite mit `QA_BASE_URL=https://leipzig-photovoltaik.de python3 qa/test_fixed_site.py` und entsprechend `qa/test_calculators_fixed.py` erneut ohne echte Übermittlung prüfen. Ein grüner Mock-Test ist kein Beweis für den Eingang einer echten E-Mail; dazu ist eine kontrollierte Betreiberprüfung nötig.

## Produktiver Double-Opt-in mit Brevo (21.10.2026)

Alle öffentlichen Formulare senden ausschließlich an die gleichursprüngliche Vercel-Function `/api/lead/`. Sie verlangt serverseitig: erlaubte Quelle, gültige E-Mail-Adresse, **Pflichttelefon** mit plausibler Nummer, Datenschutzeinwilligung, Honeypot und eine Mindestdauer von 2,5 Sekunden. Ein erster erfolgreicher POST sendet **ausschließlich** einen verschlüsselten, nicht lesbaren und 30 Minuten gültigen Bestätigungslink an die angegebene E-Mail-Adresse. Erst der bewusste POST auf `/api/confirm/` gibt die Anfrage an `BREVO_LEAD_RECIPIENT` weiter. Der Browser kann keinen Empfänger bestimmen. Private Schlüssel gehören niemals zu `PUBLIC_`-Variablen.

Vercel benötigt für Produktion `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_LEAD_RECIPIENT` und `LEAD_CONFIRMATION_SECRET`. Der Secretsatz liegt ausschließlich in den Vercel-Produktionsvariablen. Zusätzlich begrenzt die Vercel Firewall `/api/lead/` auf **3 Anfragen pro IP-Adresse in 10 Minuten** (HTTP 429). Die Brevo-`messageId` belegt ausschließlich die API-Annahme, nicht den Postfacheingang.

Wichtig: Der Double-Opt-in verhindert, dass eine frei erfundene oder fremde E-Mail-Adresse einen Betreiberlead erzeugt. Er beweist jedoch weder die wirtschaftliche Ernsthaftigkeit noch eine echte Telefonnummer. Wiederholte Anfragen müssen daher anhand der Vercel-Firewall und der Brevo-Logs überprüft werden. Ein CAPTCHA ist nicht implementiert, weil die Kombination aus E-Mail-Bestätigung, Honeypot, Ausfüllzeit, serverseitiger Prüfung und Rate-Limit den geringsten Reibungsverlust für echte Interessenten verursacht.

```bash
# Backend ohne echten Versand:
node --experimental-strip-types --test qa/test_brevo_api.mjs
# Browser-Build (alle POSTs in qa/test_fixed_site.py abgefangen):
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
python3 qa/test_fixed_site.py
python3 qa/test_calculators_fixed.py
```

Achtung: Die 4,5-MB-Grenze von [Vercel Functions](https://vercel.com/docs/functions/limitations#request-body-size) und das Ziel, vor der E-Mail-Bestätigung keine personenbezogenen Dateianhänge zu speichern, schließen einen Dateiupload im ersten Formularschritt bewusst aus. Mehrstufige Uploads nach Bestätigung erfordern später einen separaten direkten Speicher-Upload mit einmaliger Berechtigung. Browser-Tests simulieren beide API-Antworten und senden keine realen Leads.
