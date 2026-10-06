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
