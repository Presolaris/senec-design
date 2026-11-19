# Punkt 3 – Kontakt-Ereignisse und Consent

Stand: 19.11.2026, ausschließlich Arbeitskopie/Vorschau. Nicht veröffentlicht. Die Property-ID **G-08NXYDBB4F** bleibt unverändert. Keine echten GA-Aufrufe, keine E-Mails, keine GA-Adminänderungen, keine neue Marketing-Integration und kein Build durch diesen Agenten.

## A. Umgesetzt

### Geänderte bzw. neue Dateien

| Datei | Änderung |
|---|---|
| `src/lib/contactAnalytics.ts` (neu) | Zentrale Opt-in-gesteuerte GA-Lade-/Widerrufslogik; delegierte Kontaktlink-Ereignisse; internes Lead-Accepted-Event; reine In-Memory-Receipt-Deduplizierung; datensparsame GA-Defaults. |
| `src/components/CookieBanner.astro` | Alte separate GA-Ladelogik entfernt. Speicherung weiterhin als `cookie-consent`, neue Werte URL-kodiert; alte rohe JSON-Werte lesbar. Nach dem Speichern `window.dispatchEvent('presolaris:consent-updated')` als CustomEvent mit `{ analytics, marketing }`. Gleichwertige Ablehnen-/Akzeptieren-Buttons, „Nur notwendige“ auch im Modal, Toggles bei jedem Öffnen aus tatsächlicher Auswahl. |
| `src/layouts/Layout.astro` | `initContactAnalytics()` vor dem bestehenden `bindLeadForms()` aufgerufen. Kein zusätzlicher Attributions-Init: `bindLeadForms()` übernimmt ihn bereits. |
| `.manus/contact-preview-2026-11-19/test_contact_analytics.mjs` (neu) | Wiederholbare netzfreie QA mit GA-Script-/DataLayer-Stubs, API-Stubs und Astro-Syntaxprüfung. |
| `.manus/contact-preview-2026-11-19/test_contact_analytics.log` (neu) | Ausgabe des letzten vollständig grünen QA-Laufs. |
| `.manus/contact-preview-2026-11-19/analytics-ergebnis.md` (neu) | Dieser Bericht. |

Andere Projektdateien wurden durch diesen Agenten nicht geändert. Insbesondere keine Änderungen an Formularen, API, Footer, Kontaktseite oder Datenschutzerklärung; kein Git und keine externen Schreibvorgänge.

### Abgeglichener Vertrag mit der Formular-/Attributionsarbeit

`postLead()` sendet `presolaris:lead-accepted` erst bei HTTP-Erfolg und `success === true`, `verificationRequired === true` sowie vorhandener stringbasierter `messageId`. Detail: `{ form_name, page, receipt }`.

Analytics hört ausschließlich auf dieses Annahme-Event, nicht auf `submit`, Formularreset, Fehlertext oder einen unspezifischen Erfolg. `receipt` dient nur der Deduplizierung im Arbeitsspeicher und gelangt nie in GA-Parameter, Cookies oder Storage. Die Formularnamen werden gegen den tatsächlich vorhandenen `LEAD_SOURCES`-Vertrag geprüft: `multi_step_form`, `Exit-Intent-Popup`, `solarrechner`, `kontakt`, `gewerbe`, `service`, `gewerbe-photovoltaik-leipzig`, `pv-wartung-leipzig`, `pv-reinigung-leipzig`, `solarpark-betreuung`.

Der öffentliche Routenfilter `sanitizeLeadPath` wird für Analytics wiederverwendet. Query, Fragment, unbekannte/personalisierte Pfade, externe URLs und interne Admin-Routen gehen nicht als Seitenpfad an GA. Unsichere/unbekannte Analytics-Pfade werden auf `/` begrenzt.

### Consent und Ladephase

Ohne explizites Analytics-Opt-in werden weder GA-Script noch `gtag`-/DataLayer-Ereignisse erzeugt. Es gibt keine Consent-Mode-/cookieless-Pings bei Ablehnung. Marketing-Auswahl allein aktiviert keine Integration.

Nach Zustimmung stehen Standard-`gtag` und `dataLayer` unmittelbar bereit: `js`, datensparsame `config`, anschließend erlaubte Ereignisse. Ereignisse nach Einwilligung während des Script-Loads können normal warten. Ereignisse vor der Einwilligung werden nicht gespeichert oder nachgeliefert; eine schon vorher angenommene DOI-Anfrage wird auch bei erneutem Handoff derselben Quittung nach Einwilligung nicht nachgezählt.

Widerruf setzt `ga-disable-G-08NXYDBB4F = true`, sperrt Ereignisse, verwirft die noch vorhandene Queue und löscht erreichbare `_ga`-/`_ga_*`-/`_gid`-/`_gat`-Cookies. Notwendige Cookies bleiben. Ein spät eintreffendes Script-Onload reaktiviert nichts. Erneute Einwilligung hebt die Sperre auf und verwendet dasselbe Script; keine doppelten Script-Tags oder delegierten Listener.

### Datensparsame GA-Defaults

- `page_location`: feste kanonische Origin `https://leipzig-photovoltaik.de` plus geprüfter öffentlicher Pfad, ohne Query oder Fragment.
- `page_referrer`: nur Hostname, ohne Zugangsdaten, Pfad, Query oder Fragment.
- `page_title`: fest `Presolaris – Photovoltaik Leipzig`, nie Formular-/Nutzereingaben oder dynamischer Dokumenttitel.
- `allow_google_signals: false`, `allow_ad_personalization_signals: false`; bisherige `anonymize_ip`-/Cookie-Flags bleiben.
- Kein `value`, `currency`, Umsatz oder erfundener Conversion-Wert. Keine Linkziel-URL, Telefonnummer, E-Mail-Adresse, UTM-Parameter, Quittung oder Formularfelder in Kontakt-Ereignissen.
- Die tatsächliche Seiten-URL wird nicht verändert; die separate Lead-Attribution kann die zulässige Herkunft weiterhin selbst behandeln.

## Soll-Ereignismatrix

| Situation | Analytics-Consent | GA-Ereignis | Exakte Kontakt-Parameter |
|---|---|---|---|
| API nimmt DOI-Anfrage strikt an; neue gültige Quittung | Ja | `generate_lead` genau einmal | `{ form_name, page }` |
| Dieselbe Quittung erneut | Ja | Keines | – |
| API-Fehler, fehlende/ungültige Erfolgsmerkmale, Abbruch, ungültiges Formular | Beliebig | Keines | – |
| Angenommene Anfrage vor Opt-in, später Zustimmung | Nein zum Annahmezeitpunkt | Keines, auch kein späteres Replay | – |
| Klick auf `tel:`; auch verschachteltes Span | Ja | `click_phone` | `{ page }` |
| Klick auf `mailto:`; auch verschachteltes Span | Ja | `click_email` | `{ page }` |
| Klick auf HTTPS-Link mit exakt Host `wa.me`; auch verschachteltes Span | Ja | `click_whatsapp` | `{ page }` |
| Externer normaler Link, interner Link oder falscher WhatsApp-Host | Ja | Kein Ereignis durch Kontakttracking | – |
| Kontaktklick/Lead nach Ablehnung oder Widerruf | Nein | Keines | – |
| Erlaubtes Ereignis nach Opt-in während Script-Load | Ja | Normale `dataLayer`-Queue | Wie oben |
| Widerruf, solange Script noch lädt | Danach nein | Bereits wartende Ereignisse verworfen; kein Onload-Replay | – |

`generate_lead` bedeutet hier die vom Server angenommene Anfrage zur DOI-Bestätigung, nicht den späteren tatsächlichen Klick auf den DOI-Link und nicht eine bereits weitergeleitete Kundenanfrage.

## Tests

**12/12 Tests bestanden.** Alle GA-Scriptanfragen und API-Antworten lokal gestubbt; **0 echte Netzaufrufe**. Zusätzlich strenge TypeScript-Prüfung des Kontaktanalytics-Moduls inklusive importierter Attribution erfolgreich. Astro-Dateien wurden syntaktisch geparst; kein paralleler Build.

Aufruf innerhalb der Arbeitskopie:

```sh
node .manus/contact-preview-2026-11-19/test_contact_analytics.mjs
./node_modules/.bin/tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution bundler --lib ES2022,DOM --skipLibCheck src/lib/contactAnalytics.ts
```

Abgedeckt: kein Opt-in/kein Replay; rohe und URL-kodierte Consent-Werte; defekte Consent-Werte; datensparsame Defaults einschließlich PII-behafteter Testquery und Referrer; `js/config/event`-Reihenfolge während Script-Load; Onload nach Widerruf; erneute Zustimmung ohne doppeltes Script; Widerruf nach Onload, Cookie-Löschung und Reload; verschachtelte Kontaktlinks und externe Nicht-Kontaktlinks; Receipt-Deduplizierung für alle tatsächlichen Formularnamen; ungültige/Error-/Abbruch-Handoffs und Routenfilter; echte `postLead()`-Logik mit ausschließlich gestubbten API-Antworten; gleichwertige Buttonklassen und Toggle-Vorbelegung; DOM-ready-Varianten und Layout-Reihenfolge.

## B. Nicht umgesetzt und Grund

`generate_lead` wurde **nicht als Schlüsselereignis in GA4 gesetzt**. Die Arbeit ist ausdrücklich Vorschau; keine GA-Admin-Schreibfreigabe. Read-only-Property-Zugriff und Gesamtbericht liegen beim koordinierenden Agenten.

Keine Veröffentlichung, kein Deploy, kein echter GA-DebugView-/Netzwerktest und kein Live-Formularversand. Die Tests prüfen eigenen Code, Queue und Annahmevertrag mit Stubs. Sie behaupten nicht, eine bestehende GA4-Property-Konfiguration für Enhanced Measurement oder automatisch konfigurierte Ereignisse geprüft zu haben; das gehört zur zentralen Read-only-Prüfung. Eine echte visuelle Browser-/Vorschauprüfung und der Gesamtbuild erfolgen zentral.

## C. Offene Punkte für die Koordination

Kein Implementierungsblocker. Die Imports von `LEAD_SOURCES` und `sanitizeLeadPath` sind nach Lesung des bereits vorhandenen Vertrags abgeglichen. Bitte diese Exporte bei der Zusammenführung beibehalten und die QA nach dem gemeinsamen finalen Stand wiederholen.

Vor einem späteren Live-Schritt bitte Property-Einstellungen/Enhanced Measurement read-only prüfen und eine GA4-Schlüsselereignis-Änderung erst nach Freigabe behandeln.

## D. Vorschau und Stand

Nur lokale Arbeitskopie `/home/ubuntu/pv-preview-kontakt-messbarkeit-20261119-RoIv`. Kein eigener Vorschau-Server/Build gestartet; der koordinierende Agent übernimmt Vorschau-Link und Gesamtprüfung.

## E. Geänderte sichtbare Texte im Wortlaut

- Cookie-Banner, Ablehnungsbutton: **„Nur notwendige“ → „Ablehnen“**.
- Cookie-Einstellungsmodal: zusätzlicher Button **„Nur notwendige“**.

Andere sichtbare Texte und bestehende Firmen-/Leistungsaussagen wurden durch diesen Agenten nicht geändert. „Alle akzeptieren“, „Einstellungen“ und „Auswahl speichern“ bleiben im Wortlaut erhalten. Die vollständigen Fundstellen aus Auftragspunkt 5 erstellt der koordinierende Agent.

## Nachtrag – Browser-QA und Property-Zugriff (21:13 Uhr)

Die koordinierende Read-only-Prüfung meldet im Konto „Presolaris“ keine sichtbaren Properties; die globale Suche nach „Photovoltaik“ ergab ebenfalls keinen Treffer. Daher keine GA4-Schlüsselereignis-Markierung und keine Produktionsänderung. Die vorhandene Measurement-ID wurde nicht geändert.

Zusätzlich bereitgestellt: `.manus/contact-preview-2026-11-19/test_contact_analytics.py`. Das Skript ist syntaktisch geprüft und führt Desktop-/Mobil-Browser-QA gegen einen vorhandenen lokalen Build durch. Nur HTTP-Loopback ist zugelassen; Google-Scriptanfragen werden abgefangen und lokal beantwortet, alle anderen externen Requests und echten Schreibanfragen blockiert, `/api/lead/` ausschließlich gestubbt. Es prüft echte Buttonabmessungen/-Styles, Consent-Widerruf/Reload, verschachtelte Kontaktlinks, PII-sichere Defaults, Quittungs-Deduplizierung und den echten Kontaktformular-Handler mit Fehler-/ungültiger-/strikter Annahmeantwort. Screenshots und Ergebnis-JSON schreibt es nur in diesen freigegebenen Auftragsordner.

**Noch nicht ausgeführt:** Um 21:13 Uhr war kein lokaler Preview-Server auf 4321/4328 aktiv und `dist/kontakt/index.html` fehlte. Kein eigener Build wurde gestartet. Nach dem zentralen Build und Start eines normalen lokalen Preview-Servers:

```sh
QA_BASE_URL=http://127.0.0.1:4321 python3 .manus/contact-preview-2026-11-19/test_contact_analytics.py
```

Der sichere Gateway auf 4328 ist ebenfalls als Ziel möglich, wobei dann dessen zusätzlicher CSP-/Script-Stubsandbox-Schutz gilt. Die 12/12 bereits ausgeführten MJS-Tests bleiben davon getrennt; sie enthalten insbesondere die Script-Load-Intervalltests vor/nach Onload und Widerruf.
