# Punkt 2 – Herkunft von Formularanfragen

Stand: 19.11.2026, ausschließlich lokale Vorschau. Kein Deployment, Commit, Push, externer Schreibzugriff oder realer E-Mail-Versand durch diesen Teilauftrag. Änderungen anderer Agenten sind nicht Bestandteil dieses Ergebnisses. Der Parent koordiniert Build und Vorschau.

## Umsetzung

Geändert wurden nur `src/lib/leadForms.ts`, `api/lead.ts` und `api/confirm.ts`. Neu sind `src/lib/leadAttribution.ts`, `qa/test_lead_attribution.mjs` und diese Ergebnisdatei. CookieBanner, Layout, Seiten und einzelne Formular-Komponenten wurden ausschließlich zur Schnittstellenprüfung gelesen, nicht von diesem Agenten geändert. `todo.md` und die Knowledge Base wurden nicht bearbeitet.

`postLead()` ergänzt zentral eine optionale JSON-Eigenschaft `attribution` im vorhandenen Multipart-Formular. Vom Aufrufer mitgebrachte Attribution wird ersetzt, nicht übernommen. So profitieren sämtliche zehn bestehenden Sources ohne zusätzliche Kundenfelder:

`multi_step_form`, `Exit-Intent-Popup`, `solarrechner`, `kontakt`, `gewerbe`, `service`, `gewerbe-photovoltaik-leipzig`, `pv-wartung-leipzig`, `pv-reinigung-leipzig`, `solarpark-betreuung`.

Die Browserwerte werden in beiden unabhängigen API-Funktionen erneut mit derselben Allowlist und Längenbegrenzung sanitisiert. Beide Funktionen bleiben self-contained und importieren serverseitig nur `node:crypto`, keine lokalen Servermodule. Attribution gelangt als optionale Payload-Eigenschaft in den bestehenden AES-256-GCM-Bestätigungstoken. Es gibt keine neue Datenbank, keine zusätzliche Tracking-ID und keine unbestätigte Betreiberablage. Der erste Schritt sendet weiterhin ausschließlich die bestehende Bestätigungsnachricht an die im Formular angegebene Adresse. Erst ein gültiger bewusster Bestätigungs-POST erzeugt die Betreiberbenachrichtigung einschließlich Herkunftsblock. Ein GET versendet nichts.

Neue Tokens bleiben 24 Stunden gültig. Ältere Tokens ohne Attribution funktionieren weiterhin; ein vorhandener alter 30-Minuten-Token behält seine authentifizierte ursprüngliche Ablaufzeit. Kein alter abgelaufener Token wird durch die Änderung verlängert. Die bestehende providerseitige 30-Minuten-Idempotenz bleibt unverändert; sie ist weiterhin keine persistente 24-Stunden-Replay-Sperre.

## Consent- und Ereignisschnittstelle

**Abgleich mit dem tatsächlich vorliegenden C-Agent-Code:** Der bestehende Cookie heißt `cookie-consent`, nicht `pv-cookie-consent`. Sowohl der aktualisierte `CookieBanner.astro` als auch `contactAnalytics.ts` verwenden nach lesender Prüfung diesen Namen. Attribution unterstützt den früheren rohen JSON-Wert und den jetzt URL-kodierten JSON-Wert desselben Cookies. Ein anderer Cookie-Key oder ein bloßes Event kann kein Analytics-Opt-in erzeugen.

Nur `cookie-consent.analytics === true` erlaubt Lesen/Schreiben des First-Touch-Eintrags in `sessionStorage`. Marketing-Einwilligung allein genügt nicht. `presolaris:consent-updated` wird mit `detail: { analytics: boolean, marketing: boolean }` empfangen; Attribution setzt oder verändert keinen Consent. Der Cookie wird vor Speicherzugriffen erneut geprüft. Bei Ablehnung/Widerruf und beim Start ohne gültiges Opt-in wird der eigene Speicherkey ausschließlich gelöscht; es erfolgt kein Lesen oder Setzen der Kampagnensitzung bei Ablehnung. Ein fehlender/abgelaufener Cookie wird beim Initialisieren und vor dem Submit berücksichtigt. Die Löschung ist best-effort, wenn der Browser sogar `removeItem()` blockiert; gesperrter Speicher wird dennoch nicht für Attribution verwendet.

Speicherkey: `presolaris:lead-first-touch:v1`. Er enthält nur die sanitisierten Attributionseigenschaften, keine ID und keine Quittung. Vor Einwilligung bleibt ausschließlich der bereinigte Kontext der beim Modulimport aktuellen Dokument-URL im Arbeitsspeicher. Die unbereinigte vollständige URL wird nicht persistiert oder gesendet. Der Modulimport erfasst früh; `bindLeadForms()` initialisiert zusätzlich idempotent. Damit wird die bestehende Layout-Anbindung genutzt, ohne das Layout zu bearbeiten.

Nach und nur nach erfolgreicher Serverantwort (`response.ok`, `success === true`, `verificationRequired === true`, nichtleere `messageId` vom Typ String) veröffentlicht `postLead()` bei erlaubter Source:

```ts
window.dispatchEvent(new CustomEvent('presolaris:lead-accepted', {
  detail: {
    form_name: source,
    page: window.location.pathname,
    receipt: result.messageId,
  },
}));
```

Dies ist nur die interne Schnittstelle zum GA-Agenten. Attribution ruft weder `gtag()` auf noch verändert sie die Einwilligung. `receipt` wird in diesem Code nicht persistiert und nicht Bestandteil der Attribution. Der gelesene C-Agent-Code verwendet es ausschließlich im Arbeitsspeicher zur Deduplizierung und übergibt an GA nur `form_name` und den dort gefilterten `page`-Pfad. Das Ereignis bedeutet DOI-Vorbereitung/Providerannahme, nicht abgeschlossene E-Mail-Bestätigung oder nachgewiesene Mailzustellung.

## Payload

```ts
type LeadAttribution = {
  entry_path: string;       // öffentlicher Pfad, ohne Query/Hash, höchstens 200 Zeichen
  form_path: string;        // öffentlicher Submit-Pfad, ohne Query/Hash, höchstens 200 Zeichen
  utm_source: string;       // höchstens 120 Zeichen
  utm_medium: string;       // höchstens 120 Zeichen
  utm_campaign: string;     // höchstens 120 Zeichen
  utm_content: string;      // höchstens 120 Zeichen
  referrer_domain: string;  // nur Domain, höchstens 253 Zeichen
  capture_mode: 'consented_first_touch' | 'current_page_fallback';
  reporting_limit: '' | 'no_analytics_consent' | 'session_storage_unavailable';
};
```

Die vier UTMs stammen aus der ersten erfassbaren Dokument-URL, solange diese innerhalb des aktuellen Dokuments im Arbeitsspeicher vorliegt; mit Analytics-Opt-in bleibt diese erste Erfassung innerhalb der Browsersitzung auch bei weiteren Dokumentnavigationen erhalten. Auch zunächst leere UTMs werden nicht mit einer späteren Kampagne überschrieben. Ohne Opt-in wird bei einer neuen Dokumentnavigation nur deren neuer Kontext erfasst.

Pfadfilter erlaubt ausschließlich die bestehenden öffentlichen Routen einschließlich Blog-/Standort-Unterseiten. Interne Admin-, Analytics-, Dashboard- und API-Pfade sowie beliebige unbekannte Pfade bleiben leer. Query und Hash werden entfernt. Neue öffentliche Routen müssen bei Bedarf in den identischen drei Allowlists ergänzt werden. Die QA prüft deren Gleichheit.

UTMs erlauben konservativ Unicode-Buchstaben/Zahlen, Leerzeichen, `_`, `-` und `.`. Controlcharacters werden entfernt; URL-/Domain-/E-Mail-/Telefonmuster und sonstige nicht erlaubte Zeichen führen zu leerem Wert. Die Prüfung erfolgt vor einer Kürzung auf 120 Zeichen, damit auch lange PII-Eingaben nicht mit einem scheinbar harmlosen Präfix erhalten bleiben. Fehlende Werte bleiben im Payload leer. Diese konservative Heuristik kann legitime Kampagnen mit Sonderzeichen, domainartigen Namen oder langen Ziffernfolgen verwerfen; sie ist keine Garantie, beliebige frei formulierte Personennamen semantisch zu erkennen.

Der Browser extrahiert den Referrer nur aus HTTP(S)-URLs ohne eingebettete Zugangsdaten. Übertragen wird ausschließlich der Hostname, nie Referrer-Pfad, Query, Hash oder Port. Server akzeptieren nur einen syntaktisch gültigen Domainwert. Eigenverweise auf `leipzig-photovoltaik.de`, interne/lokale Domains, IP-Adressen und bekannte Vorschauhosts bleiben leer. Da der Server nur eine Browserangabe erhält, ist die tatsächliche Referrer-Herkunft nicht unabhängig verifizierbar.

Optional fehlende, nicht als Objekt vorliegende, fehlerhaft kodierte oder über 4096 Zeichen lange Attribution wird verworfen, ohne die bestehende Anfrage allein deswegen abzulehnen. Zusätzliche unbekannte Objektkeys werden nicht übernommen.

## Neuer Benachrichtigungs-Wortlaut

Nach den bisherigen Anfragefeldern folgt in beiden Betreiber-Versandfunktionen derselbe Zusatzblock. Hier der exakte Wortlaut für beispielhafte, zulässige Werte mit Opt-in (Beispieldaten, keine tatsächliche Anfrage):

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

Exakter Fallback-Wortlaut ohne Opt-in, wenn auf der aktuellen Kontaktseite keine UTMs und kein externer Referrer vorliegen:

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

Bei nicht nutzbarem Sitzungsspeicher und vorhandener Analytics-Einwilligung bleibt die Erfassungsart derselbe Fallback. Die letzte Zeile lautet dann exakt:

```text
Erfassungsgrenze: Sitzungsspeicher nicht verfügbar: frühere Seiten/UTMs unbekannt.
```

Alle nicht erfassten Einzelwerte erscheinen in der Benachrichtigung als `nicht erfasst`, im Payload selbst als leerer String. Bei älteren Tokens ohne Attribution wird kein Herkunftsblock erfunden oder ergänzt. Zusätzlich zum Textteil gibt es einen HTML-Textblock; sämtliche variablen Werte und die vorhandenen Anfragefelder werden dort durch `&`, `<`, `>`, `"` und `'`-Escaping sicher als Text dargestellt.

## Grenzen ohne Analytics-Einwilligung

**UTM-Übermittlung ist nicht generell an Analytics-Opt-in gebunden:** Enthält die beim Initial Capture aktuell offene Dokument-URL sichere `utm_source`, `utm_medium`, `utm_campaign` oder `utm_content`, werden diese auch ohne Analytics-Einwilligung ausschließlich im Arbeitsspeicher gehalten und mit dem freiwilligen Formular-Submit als aktueller Anfragekontext übermittelt. Sie erhalten dabei `current_page_fallback` und `no_analytics_consent`. Ebenso werden aktuelle, gefilterte Dokument-/Formularpfade und die datensparsame Referrer-Domain ergänzt. Nur die Speicherung in `sessionStorage` und damit der First Touch über weitere Dokumentseiten verlangen das bestehende Analytics-Opt-in. Der Datenschutztext darf deshalb nicht behaupten, dass sämtliche UTMs nur mit Einwilligung übermittelt werden.

Ohne Opt-in gibt es keine persistente Kampagnensitzung. Werden die ursprünglichen `utm_source`, `utm_medium`, `utm_campaign` und `utm_content` auf einer früheren Seite gesehen und anschließend per vollständiger Dokumentnavigation eine andere Seite ohne diese Parameter geöffnet, sind **alle vier ursprünglichen UTMs nicht mehr erfassbar**. Sie bleiben leer. Auch ursprünglicher Einstiegsseitenpfad und ursprüngliche externe Referrer-Domain können dann nicht zuverlässig rekonstruiert werden. Die Query einer internen Referrer-URL wird ausdrücklich nicht als Ersatz für den Erstbesuch ausgewertet.

Bleibt das Dokument unverändert geöffnet, darf der bereinigte Einstiegskontext im Arbeitsspeicher zum Submit ergänzt werden, auch wenn die sichtbare URL später per History-API geändert wurde. Er bleibt ohne nutzbaren consentierten Sitzungsspeicher trotzdem mit `current_page_fallback` und der passenden Erfassungsgrenze gekennzeichnet. Die Angaben werden niemals als dokumentübergreifend belegter ursprünglicher Besuch behauptet.

Eine spätere Einwilligung auf einer anderen Dokumentseite kann einen früheren abgelehnten Besuch nicht nachträglich rekonstruieren. Die erste dort erfassbare URL wird zum Startpunkt der neuen consentierten Sitzung. Bei Speicherfehlern wird die Anfrage nicht blockiert, aber ausdrücklich nur der aktuelle Dokumentkontext verwendet. First Touch gilt browserseitig für den verfügbaren `sessionStorage`-Kontext; es wurde kein zusätzliches Sitzungs-/Besucherkennzeichen und kein eigener Zeitablauf eingeführt.

## Limits und Tests

Bestehend unverändert: maximal 55 Multipart-Felder, 4 MiB Lead-Request, 3 MiB Dateigrenze mit unveränderter Ablehnung eines tatsächlichen Anhangs vor Bestätigung, Mindestfüllzeit 2,5 Sekunden und maximale Formularalterprüfung. Attribution ergänzt nur ein Multipart-Feld. Die 4-MiB-Prüfung berücksichtigt jetzt auch die tatsächlich gelesenen Bytes statt ausschließlich `Content-Length` zu vertrauen. Der Bestätigungs-POST wird vor FormData-Parsing auf 768 KiB begrenzt, der Token auf 512 KiB. Diese Grenzen lassen die vorhandenen begrenzten Textpayloads einschließlich Unicode und den kleinen Attribution-Zusatz zu. Der Origin- und Tokenablauf-Schutz bleibt erhalten.

Ausgeführt im vorgegebenen Arbeitsverzeichnis:

```bash
node --experimental-strip-types --test qa/test_lead_attribution.mjs
node --experimental-strip-types --test qa/test_brevo_api.mjs
node --experimental-strip-types --test qa/test_lead_attribution.mjs qa/test_brevo_api.mjs
git diff --check -- src/lib/leadForms.ts api/lead.ts api/confirm.ts
```

Letzter gemeinsamer Lauf: **35/35 Tests erfolgreich**, davon **17 eigene Attribution-Tests** und **18 vorhandene API-Regressionsfälle**. Keine übersprungenen Tests, Whitespace-Prüfung ohne Fehler. Die TypeScript-Strip-API von Node 22 meldet nur ihren üblichen ExperimentalWarning.

Geprüft wurden Initial Capture/Bind, alle zehn Sources, strikter Consent, alter/neuer Cookiewert, fehlender/malformed Cookie, Ablehnung, Widerruf, Cookieablauf im Dokument und nach Navigation, fehlende First-Touch-UTMs ohne späteres Backfill, Dokumentnavigation, fehlerhafter/readonly/blockierter Sitzungsspeicher, URL-Query-/Hashentfernung, UTM-PII vor Truncation, Path-/Domain-Allowlist, interne Referrer, optional alte Tokens, unabhängige Servervalidierung eines direkt erzeugten untrusted Tokens, identischer deutscher Benachrichtigungsblock, HTML-Escaping, unveränderte 24-Stunden-Laufzeit, GET ohne Betreiberbenachrichtigung, negative Providerantworten, Event-Gates und tatsächliche Body-/Feldlimits.

Alle externen `fetch`-Aufrufe sind in den Tests standardmäßig gesperrt. Explizite Provider-Stubs sammeln nur Nachrichtenobjekte im Arbeitsspeicher; Browserfälle laufen in frischen in-memory ESM-Instanzen mit Speicher-/Dokument-Stubs. Tests belegen daher lokale Logik, nicht reale Mailzustellung, Live-Vercel-Funktionsauflösung oder GA4-Datenannahme. Build/Deployment/Browser-Vorschauprüfung und der Preview-Gateway bleiben beim Parent. Keine realen Mails wurden angefordert.
