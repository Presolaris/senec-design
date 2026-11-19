# Kontakt- und Messbarkeitsvorschau

Stand: 19.11.2026. Diese Änderung ist noch nicht veröffentlicht. Produktionsbasis: Remote main fdd3d2ad. Der Feature-Branch bleibt lokal; ein Push, Pull Request oder Vercel-Redeployment ist vor der ausdrücklichen Freigabe des Inhabers nicht vorgesehen.

## Vorschau starten

```sh
npm ci --no-audit --no-fund
CI=true npm run build
node qa/serve_contact_preview.mjs
```

Die Vorschau läuft auf Port 4328. Sie liefert den echten statischen Astro-Build mit einem außerhalb des Produktionscodes eingefügten Vorschauhinweis aus. Sie ist über X-Robots-Tag und robots.txt von der Indexierung ausgeschlossen. Canonical- und Linkziele der Website werden nicht für ein Deployment umgeschrieben.

## Keine echten Testanfragen

Die Preview-Serverdatei `qa/serve_contact_preview.mjs` leitet keine Anfrage an die Produktions-API oder Brevo weiter. Ein POST an /api/lead/ liefert bewusst eine verständliche Vorschau-Antwort ohne Erfolgsmeldung und ohne Speicherung oder E-Mail. Damit wird nicht fälschlich behauptet, eine Bestätigungsmail sei verschickt worden. Andere API-Schreibzugriffe sind gesperrt. Bei der Browser-Regression werden Erfolgs- und Fehlerfälle separat vor dem Netzwerk abgefangen; die echten Serverfunktionen werden mit Provider-Stubs getestet.

## Keine echten Analytics-Testdaten

Der Preview-Server lässt keine externe Analytics-Verbindung zu. Die lokale Harness-Datei ersetzt die angeforderte GA-Bibliothek durch einen lokalen Stub, ohne den späteren Produktionscode zu verändern. Ereignisse verbleiben nur im Browser unter `window.__previewAnalyticsCommands`. Der echte Cookie-Opt-in und die neuen Ereignishandler werden dadurch vorführbar, ohne die bestehende Property mit Preview-Testdaten zu füllen. Auch vor Einwilligung werden keine Ereignisse aufgezeichnet.

## Grenzen der Vorschau

Die Prüfung belegt den Build, die eigenen Consent-/Eventregeln, die Übernahme der Herkunftsdaten und den DOI-Weitergabeweg mit Stubs. Sie ist kein Nachweis eines echten Mail-Posteingangs, einer GA4-DebugView-Sitzung, der WhatsApp-Registrierung der Rufnummer oder einer erfolgten Produktivveröffentlichung. Die ausstehenden echten Integrationsschritte dürfen erst nach gesonderter Freigabe erfolgen.
