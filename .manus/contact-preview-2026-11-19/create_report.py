#!/usr/bin/env python3
from pathlib import Path
from collections import Counter
import json,subprocess,re
ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
BASE='fdd3d2ad2107023ecd7be6eb0b21a9dbf0f1d402'
URL='https://4328-iudrfwk8dm5k5eg20vufz-1c031293.us1.manus.computer'
subprocess.run(['python3',str(OUT/'audit_content.py')],check=True)
load=lambda n:json.loads((OUT/n).read_text())
links=load('kontakt-links-ergebnis.json');claims=load('geschuetzte-aussagen.json');changes=load('textaenderungen.json');company=load('firmenangaben-audit.json')
ui=load('preview-ui-validation.json');analytics=load('test_contact_analytics.browser.json');forms=load('fixed-site-regression.json');calculators=load('calculator-fixed-regression.json')
assert ui['status']=='passed' and all(x['passed'] for x in analytics+forms+calculators)
assert len(forms)==23 and len(calculators)==4
counts=Counter(x['category'] for x in claims)
addresses=[x for x in company if 'streetAddress' in x['wording'] and 'An der Hebemärchte 1' not in x['wording']]
text=f'''# A. Umgesetzt

**Stand: 19.11.2026 – ausschließlich Vorschau, nicht veröffentlicht.** Ausgangspunkt ist Remote main `{BASE}`. Die Änderungen liegen auf dem lokalen Feature-Branch `preview/kontakt-messbarkeit-2026-11-19`. Es wurden keine produktiven Konto-, DNS-, Domain-, Mail-, Zahlungs- oder Firewall-Einstellungen geändert. Die bereits vorhandenen Rechner-, Garantie-, Förder- und Referenzinhalte wurden nicht ausgebaut.

### 1. Telefon-Link repariert

Alle {len(links['exact_phone_changes'])} statisch vorhandenen Telefonanker im Quellcode wurden auf `tel:+4934198990391` und die Anzeige `0341 98990391` geprüft bzw. vereinheitlicht. Dabei wurde nicht nur die fehlende Endziffer im Footer gefunden: Auf der Kontaktseite fehlte ebenfalls eine Ziffer im Ziel. Bereits korrekte Telefonnummern wurden nur in der Anzeige vereinheitlicht. Betroffene Dateien:

'''
text+='\n'.join('- `'+x+'`' for x in links['changed_files'])+'\n\n'
text+='''Dynamisch aus Kundendaten erzeugte Telefonlinks in internen Admin-Komponenten sind keine Firmen-Kontaktlinks und wurden weder umgeschrieben noch mit Kundendaten getestet. Alle 102 Telefonanker des gerenderten Builds haben das korrekte Firmenziel. Die ausdrücklich gewünschte Rufnummer wurde auch im Telefonlink des Impressums konsistent eingesetzt; Adresse und Firmenname wurden nicht geraten oder überschrieben.

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

'''
for x in addresses:text+=f"- `{x['file']}:{x['line']}`: `{x['wording']}`\n"
text+='\n### Vorhandene strukturierte Namens-/Ort-/PLZ-Angaben zur Prüfung\n\n'
for x in company:
 if 'streetAddress' not in x['wording']:text+=f"- `{x['file']}:{x['line']}`: `{x['wording']}`\n"
text+=f'''
# D. Vorschau-Link(s) und Stand

**Stand: Vorschau – NICHT veröffentlicht.**

- [Startseite]({URL}/)
- [Kontakt mit korrigierter Telefonnummer und WhatsApp]({URL}/kontakt/)
- [Footer und Fachseitenblock auf der Kontaktseite unten]({URL}/kontakt/)
- [Datenschutzvorschau]({URL}/datenschutz/)
- [llms.txt]({URL}/llms.txt)

Die Links führen zu einer zeitlich verfügbaren Sandbox-Vorschau, nicht zu einer neuen produktiven Domain oder einem Vercel-Deployment. Der Server läuft auf Port 4328 und wurde extern mit HTTP 200 geprüft. Er ist durch `X-Robots-Tag`/robots.txt gegen Indexierung geschützt. Die Vorschau kennzeichnet sichtbar, dass Formularanfragen keine E-Mails auslösen. Ein tatsächlicher POST erhält eine neutrale Vorschauantwort statt einer falschen Bestätigungsmeldung. GA-Ereignisse verbleiben lokal im Browser und gehen nicht an Google. Telefon/WhatsApp/Social-Links sind echte externe Kontaktziele; zur Prüfung muss nichts davon ausgelöst werden.

Remote main wurde nach der Umsetzung erneut nur lesend geprüft und ist unverändert `{BASE}`. Alle Feature-Checkpoints sind ausschließlich lokal. Eine dauerhafte Produktionsveröffentlichung erfolgt erst nach Ihrer ausdrücklichen Freigabe als Inhaber J. Kolpin.

# E. Geänderte Texte im Wortlaut

### E.1 Technische Kontaktziele und Anzeigen: vorher → nachher

'''
for x in links['exact_phone_changes']:
 if not x['changed']:continue
 text+=f"**`{x['file']}` – Basiszeile {x['line_before']}**\n\n"
 text+=f"- Ziel: `{x['before']['href']}` → `{x['after']['href']}`\n"
 text+=f"- Anzeige: `{x['before']['text']}` → `{x['after']['text']}`\n\n"
text+='### E.2 Sichtbare Textblöcke: vorher → nachher\n\nDie folgenden Blöcke sind vollständig aus dem Vergleich mit der festgehaltenen Remote-Basis erzeugt. „Nicht vorhanden“ bedeutet eine Ergänzung, nicht einen ausgelassenen ursprünglichen Wortlaut. Markup-/Klassenänderungen ohne sichtbaren Text sind nicht als neue Aussagen dargestellt.\n\n'
for i,x in enumerate(changes,1):
 text+=f"**{i}. `{x['file']}`**\n\nVorher:\n\n```text\n"+'\n'.join(x['before'] or ['[nicht vorhanden]'])+'\n```\n\nNachher:\n\n```text\n'+'\n'.join(x['after'] or ['[entfallen]'])+'\n```\n\n'
text+='### E.3 Vollständiger Wortlaut von /llms.txt\n\nVorher: Datei nicht vorhanden.\n\nNachher:\n\n```text\n'+(ROOT/'public/llms.txt').read_text().rstrip()+'\n```\n\n'
text+='### E.4 Neuer Herkunftsblock der bestätigten Betreiberbenachrichtigung\n\nVorher: Kein gesonderter Herkunftsblock. Die bestehenden Kundenfelder und Mailbetreffe bleiben erhalten.\n\nNachher (wörtliche Beispielausgabe mit zulässigen Beispielwerten, keine echte Kundenanfrage):\n\n'
attr=(OUT/'attribution-ergebnis.md').read_text()
blocks=re.findall(r'```text\n(.*?)\n```',attr,re.S)
for block in blocks:text+='```text\n'+block+'\n```\n\n'
text+='### E.5 Sämtliche Fundstellen der unverändert zu erhaltenden Aussagen\n\n**Hinweis zu den Fundstellen:** Zeilennummern beziehen sich auf die eingefrorene ursprüngliche Remote-Basis, nicht auf durch Ergänzungen verschobene Zeilen. Die Kategorie zählt Varianten und Mehrfachvorkommen einschließlich Metadaten, JSON-LD und vorhandener technischer Texte. Der vollständige Fundstellenwortlaut ist übernommen; es werden keine Zahlen oder Referenzen neu bestätigt. Die Differenzprüfung belegt, dass die geschützten Treffer in der Vorschau unverändert erhalten bleiben.\n\n'
text+='| Kategorie | Fundstellen |\n|---|---:|\n'+''.join(f'| {k} | {v} |\n' for k,v in sorted(counts.items()))+'\n'
for i,x in enumerate(claims,1):
 text+=f"**{i}. {x['category']} – `{x['file']}:{x['baseline_line']}`**\n\n```text\n{x['wording']}\n```\n\n"
text=text.rstrip()+'\n'
assert len(claims)==316 and len(text)>30000
assert not re.search(r'xkeysib-|gh[pousr]_[A-Za-z0-9]{20,}|token=[A-Za-z0-9._-]{15,}',text)
headers=re.findall(r'^# [A-E][.].*$',text,re.M)
assert len(headers)==5 and [h[2] for h in headers]==list('ABCDE')
(OUT/'Bericht-Kontakt-SEO-Messbarkeit-Vorschau-2026-11-19.md').write_text(text)
print(json.dumps({'report_bytes':len(text.encode()),'protected_occurrences':len(claims),'text_change_blocks':len(changes),'schema_address_questions':len(addresses),'section_headers':headers},ensure_ascii=False))
