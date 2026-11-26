# Team-Zusammenfassung: Website und Wallbox-Ausbau

**Stand: 26. November 2026**

Die Website `leipzig-photovoltaik.de` bleibt eine statische Astro-Website mit den vorhandenen Vercel-Funktionen für Anfragen. Es erfolgt keine neue Websiteanlage oder Hostingmigration. Der aktuelle Remote-Produktionscommit ist `adcab1e41b1c02997d999f1807a8a3a4bafd817c`.

## Bereits produktiv veröffentlichte Novemberänderungen

**Kontakt und Zustellung:** Die Website nutzt den verifizierten Absender `kontakt@leipzig-photovoltaik.de`; die Website-Domain wurde mit DKIM und DMARC-Reporting eingerichtet. Ein echter Kontaktlauf und sechs weitere Anfragequellen sind bis zum jeweiligen Betreiberpostfach dokumentiert. Neue Bestätigungslinks sind seit dem Release vom 6. November 24 Stunden gültig. Das ist nicht gleichbedeutend mit einer 24-stündigen Garantie gegen erneute Verarbeitung: Das Provider-Deduplizierungsfenster bleibt getrennt davon.

**Realistische Solarrechner-Ergebnisse:** Seit dem 7. November ersetzt eine stündliche Energiebilanz die frühere pauschale Jahresverrechnung. Netzbezug, zwölf Monatswerte und die winterliche Versorgungslücke werden angezeigt. Die Daten beruhen auf einer echten PVGIS-Wetterreferenz und gekennzeichneten Modellannahmen, nicht auf gemessenen Kundenwerten. Die PDF-Bibliothek wird erst bei Bedarf geladen. Produktionscommit: `f1f97423a8a7ef11526086c031472386b08420b9`.

**Kontaktmessung und Website-Verknüpfungen:** Seit dem 19. November sind Telefonziele vereinheitlicht; WhatsApp, X, der Footer-Bereich „Unsere Fachseiten“ und `llms.txt` sind veröffentlicht. Die Anfrageherkunft wird datensparsam durch den bestehenden Double-Opt-in-Prozess geführt. GA4-Kontaktereignisse respektieren die Analytics-Einwilligung. `generate_lead` bezeichnet eine vom Server zur Mailbestätigung angenommene Anfrage, nicht einen Verkauf. Die administrative Markierung als GA4-Schlüsselereignis übernimmt der Betreiber. Produktionscommit: `c3bb8b1d93c0b2565fdb15c560efc797a6a422bc`.

**Firmendaten und Blogautoren:** Der Release vom 20. November vereinheitlicht die beauftragten Firmenschemas auf Presolaris UG (haftungsbeschränkt), einen Sitz in Leipzig und andere Orte als Einzugsgebiet. Zehn Blogartikel und elf Autorenanzeigen wurden bereinigt; sieben vorhandene Article-Autorenobjekte verwenden eine Organisation. Genau zwölf freigegebene Standortüberschriften, das falsche Schema-Telefon auf „Über uns“ und ein kanonisches WebSite-Schema ohne `www` wurden angepasst. 443 unzugeordnete Zahlenfundstellen in Artikeltexten wurden dokumentiert, nicht pauschal umgeschrieben. Passendes Vercel-Deployment und neun damalige Live-GETs waren erfolgreich. Produktionscommit: `adcab1e41b1c02997d999f1807a8a3a4bafd817c`.

Der bestehende Google-Unternehmensprofilname bleibt entsprechend der Betreiberentscheidung unverändert. Diese Websiteänderungen sind keine Profilumbenennung.

## Neuer Wallbox-Ausbau: umgesetzt, noch nicht veröffentlicht

Die Seite `/wallbox/` bleibt das Hauptziel für „Wallbox Leipzig“ und kaufnahe Installationsanfragen. Die vorhandenen URLs `/wallbox-leipzig/` und `/standorte/wallbox-leipzig/` bleiben erreichbar, verwenden aber denselben gepflegten Inhalt und verweisen per Canonical/OG/Schema auf `/wallbox/`. Beide Sitemap-Varianten empfehlen nur das Wallbox-Hauptziel. Ein Link in der Standortübersicht wurde entsprechend korrigiert.

Der neue Inhalt behandelt Anschlussvoraussetzungen, Kostenfaktoren, Fahrzeug-/Gerätekompatibilität, Anmeldung und Zustimmung des Netzbetreibers, § 14a EnWG, PV-Überschussladen sowie Lastmanagement. Eine konkrete Anfragecheckliste und zehn konsistente FAQs ergänzen die bisherigen Anfragewege. Leipzig ist der einzige Firmensitz; Anfragen aus Sachsen werden nach Installationsort und Verfügbarkeit geprüft.

Entfernt wurden widersprüchliche Wallbox-Komplettpreise und Montagezeiten, die alte KfW-442-Förderzusage sowie pauschale Einspar-/CO₂-Neutralitätsversprechen auf den Wallbox-Seiten. Bestehende Bilder, Header/Footer, Formulare, Kontaktmessung, Rechner und Mailrouten bleiben erhalten. Es gibt keine neuen Pakete, keine neuen Kundendatenfelder und keine neue Standortfiktion.

**Abnahme des umgesetzten Stands:** Der Astro-Build umfasst weiterhin 69 Seiten bzw. 72 HTML-Dateien einschließlich statischer Zusatzdateien. Zwölf Wallbox-Browserfälle für drei URLs, zwei Viewports und Chromium/WebKit bestanden. Zusätzlich bestanden 35 API-/Herkunftstests, 23 Formularfälle und vier Rechnerfälle. Es gibt keine neuen defekten internen Links; 68 übrige HTML-Dateien sind bis auf mögliche CSS-Dateiverweise unverändert. Die Client-JavaScript-Dateien sind bytegleich; die CSS-Dateisumme ist nicht gestiegen. Kein produktiver PageSpeed- oder neuer Rankingwert wird daraus abgeleitet.

Alle Tests waren lokal und nichtsendend: keine echten Leads, E-Mails oder Analytics-Ereignisse. Die geschützte Vorschau trägt einen sichtbaren Hinweis und `noindex`; ihr API-Versand ist gesperrt. WebKit ist Safari-nah, kein tatsächlicher iPhone-Test. Der neue Wallbox-Stand ist noch nicht auf der Live-Domain und hat daher noch keinen neuen Produktionsdeployment-Nachweis.

## Offene Punkte für das nächste Update

Vorrangig sind die separat zu prüfenden Sicherheitswarnungen im unveränderten Astro-/jsPDF-Abhängigkeitsbestand und der vollständige aktuelle GSC-Query-/Zielseitenexport. Danach folgen freigegebene eigene Wallbox-Referenzen/Fotos, Korrekturen abweichender Verzeichniseinträge, Bing-/Apple-Inhaberzugänge sowie eine reproduzierbare ortsbezogene Local-Pack-Messung.

Das tägliche automatisierte QA-Gate ist weiterhin nicht aktiviert; die manuellen Checks bleiben maßgeblich. Die echten Zustellläufe 008–010 sind separat offen. Der ausdrücklich zurückgestellte FAQ-Scriptfehler auf `/standorte/solaranlage-kaufen-leipzig/` gehört in einen eigenen kleinen Folgeauftrag. Bereits veröffentlichte Kontakt-, Firmen-, Rechner-, Sitemap- und Bildarbeiten werden nicht erneut als offene Implementierungen empfohlen.

**Nächster Freigabeschritt:** Den konkret geprüften Wallbox-Vorschaustand veröffentlichen und anschließend die tatsächlichen drei Live-URLs, Hauptseiten-Canonical, Sitemap und Kontaktverknüpfungen lesen. Keine DNS-, Mail-, Profil-, Zahlungs-, Firewall- oder GA4-Adminänderung gehört zu diesem Release.

## Projektbelege

Die Abschlussnachweise stehen in `todo.md`, `.manus/knowledge-base.md` und den vorhandenen November-Releaseunterlagen. Eine Kopie des bestätigten Firmen-Produktionsabschlusses liegt neben diesem Bericht als `prior-production-status.json`. Der neue Wallbox-Test ist `qa/test_wallbox.py`; seine Ergebnisse und Screenshots liegen unter `.manus/wallbox-2026-11-26/`. Der aktuelle Keyword-/Updateplan und die amtlichen Fachquellen werden in demselben Ordner gepflegt.
