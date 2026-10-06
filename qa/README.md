# Versandlose Formular- und Rechner-Regression

Diese Tests prüfen die öffentlich erreichbaren Anfragewege auf `leipzig-photovoltaik.de` **gegen einen lokalen Astro-Build**, niemals direkt gegen die Produktivseite. Das Browser-Routing fängt **alle POSTs** ab; an Web3Forms, Supabase oder ein Betreiberpostfach wird nichts gesendet.

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

`test_fixed_site.py` prüft zehn Anfragewege und den Angebotsdialog auf Desktop/Mobil einschließlich leerer Felder, ungültiger E-Mail, abgelehnter und bestätigter API-Antwort, Seitentreue und Anfragekontext. Außerdem: ein zu großer beziehungsweise gültiger optionaler PDF-Anhang und der echte Ratgeber-Downloadlink. `test_calculators_fixed.py` prüft beide vorhandenen Rechner auf Desktop/Mobil: Ergebnisse bei Slider-Grenzwerten, Speicher-aus, PDF und Übergabe der Gewerbe-Ergebnisse.

Der bestehende GitHub-Workflow `.github/workflows/deploy.yml` baut und veröffentlicht die Astro-Seite bei Push nach `main`, führt diese Browser-Tests aber **nicht** automatisch aus. Der GitHub-App fehlen die separaten Rechte für Workflow-Änderungen. Vor dem Merge müssen deshalb `npm run build` und beide Python-Skripte **manuell** erfolgreich durchlaufen; nach dem Pages-Deployment sind die Live-Seiten erneut ohne echte Übermittlung zu prüfen. Ein grüner Mock-Test ist kein Beweis für den Eingang einer echten E-Mail; für diesen Nachweis ist anschließend eine kontrollierte Betreiberprüfung notwendig.
