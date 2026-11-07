# Solarrechner: realistische Autarkie statt Jahresüberschuss-Pauschale

**Stand: 07.11.2026.** Die Korrektur ist implementiert, erfolgreich veröffentlicht und auf der Produktionswebsite bestätigt: [Solarrechner öffnen](https://leipzig-photovoltaik.de/#rechner).

## Warum das bisherige Beispiel falsch war

Der Screenshot zeigt 11 kWp PV-Leistung, 4.000 kWh Jahresverbrauch, einen 10-kWh-Speicher und 37 ct/kWh Strompreis. Daraus wurden 100 % „Unabhängigkeit“ berechnet. Der alte Rechner betrachtete jedoch nur die Jahresmengen: Er verrechnete einen Anteil der gesamten PV-Erzeugung mit dem Jahresverbrauch. Ob der Strom zur benötigten Stunde vorhanden war, wurde nicht geprüft. Auch die Aufteilung in direkten Verbrauch und Speicherladung war pauschal.

Das ist keine belastbare Autarkieberechnung. Sommerüberschüsse stehen im Dezember nicht zur Verfügung. Ein Hausspeicher überbrückt typischerweise Stunden, nicht mehrere Monate.

## Neue Ergebnisse für dasselbe Beispiel

Die folgenden Werte gelten **für das Modell mit Süd-Ausrichtung, 30° Dachneigung, hinterlüfteter Aufdachreferenz, ohne Wärmepumpe und ohne E-Auto**. Es ist keine Messung des Kundendachs und keine Ertragsgarantie.

| Kennzahl | Alte Anzeige | Neue Modellrechnung |
|---|---:|---:|
| Jahresautarkie | 100 % | **85,1 %** |
| Netzbezug im Jahr | rechnerisch 0 kWh | **597 kWh** |
| Autarkie im Winterhalbjahr, Oktober–März | nicht ausgewiesen | **72,5 %** |
| Autarkie im Januar | nicht ausgewiesen | **58,8 %** |
| Autarkie im Dezember | nicht ausgewiesen | **50,1 %** |
| PV-Ertrag im Jahr | 11.000 kWh, Faustformel | 11.287 kWh, Wetterreferenz |
| Einspeisung im Jahr | 7.000 kWh | 7.706 kWh |
| Speicherladung im Jahr | 2.400 kWh, pauschal | 1.828 kWh |
| Nutzbare Speicherentladung im Jahr | nicht konsistent ausgewiesen | 1.650 kWh |
| Speicherverluste im Jahr | nicht konsistent berücksichtigt | 178 kWh |
| PV-Eigenverbrauch inkl. Speicherladung | 36 % | 31,7 % |
| Stromkostenvorteil inkl. Einspeisung, vor laufenden Kosten | 2.054 € | rund 1.845 € |

**Wichtig:** 72,5 % im Winterhalbjahr ist nicht der Wert für jeden Wintermonat. März und Oktober fallen deutlich besser aus als Dezember und Januar. Deshalb zeigt der Rechner nun alle zwölf Monate. Im Modell entfallen sämtliche 597 kWh Jahresnetzbezug auf Oktober bis März; dies ist ein Ergebnis dieses Referenzjahrs und Lastprofils, keine Zusicherung für einen Haushalt.

## Monatsbilanz

| Monat | PV-Ertrag kWh | Bedarf kWh | Netzbezug kWh | Autarkie |
|---|---:|---:|---:|---:|
| Januar | 299 | 387 | 159 | 58,8 % |
| Februar | 560 | 338 | 70 | 79,1 % |
| März | 817 | 353 | 14 | 95,9 % |
| April | 1.108 | 324 | 0 | 100,0 % |
| Mai | 1.648 | 313 | 0 | 100,0 % |
| Juni | 1.590 | 290 | 0 | 100,0 % |
| Juli | 1.507 | 294 | 0 | 100,0 % |
| August | 1.230 | 300 | 0 | 100,0 % |
| September | 1.328 | 310 | 0 | 100,0 % |
| Oktober | 602 | 347 | 54 | 84,4 % |
| November | 336 | 355 | 105 | 70,4 % |
| Dezember | 262 | 388 | 194 | 50,1 % |

Die Werte werden erst für die Anzeige gerundet. Deshalb können gerundete Monatswerte geringfügig von der gerundeten Jahressumme abweichen. 100 % in einem einzelnen Modell-Sommermonat bedeutet lediglich, dass der modellierte Bedarf in dessen Stunden gedeckt wird – nicht Netzunabhängigkeit im ganzen Jahr oder Inselbetriebsfähigkeit.

## Wie jetzt gerechnet wird

Grundlage sind 8.760 lückenlose Stunden der offiziellen PVGIS-SARAH3-Wetterreferenz für Leipzig aus 2023. Die PV-Leistung wurde von PVGIS modelliert, nicht auf der Kundenanlage gemessen. Die hinterlüftete Süd-/30°-Referenz liefert rund 1.026 kWh/kWp im verwendeten Jahr. Die 14 % PV-Systemverluste der Datenquelle sind bereits enthalten und werden nicht nochmals abgezogen.

Für jede Stunde wird zunächst direkter Solarverbrauch bilanziert. Überschüsse können den Speicher nur innerhalb seiner verfügbaren Kapazität und Ladeleistung laden. Bei einem Defizit wird nur die tatsächlich vorhandene Speicherenergie entladen. Der verbleibende Bedarf kommt aus dem Netz. Der Ladezustand läuft durch Nächte, Monate und Jahreszeiten weiter; er wird nicht monatlich mit freier Energie aufgefüllt. Der Speicher beginnt leer und wird nicht aus dem Netz geladen.

Die Speicherannahmen sind 90 % nutzbare Nennkapazität, 95 % Wirkungsgrad je Richtung und maximal 5 kW beziehungsweise 0,5 C Lade-/Entladeleistung. Das sind transparente Modellannahmen, keine zugesicherten Eigenschaften eines bestimmten Produkts.

Der Autarkiegrad zählt nur den direkt gelieferten PV-Strom und die nutzbare Speicherentladung im Verhältnis zum Verbrauch. Der PV-Eigenverbrauch zählt Direktverbrauch und Speicherladung; darin sind Speicherverluste enthalten. Diese beiden Prozentzahlen sind nicht austauschbar.

## Was weiterhin eine Annahme bleibt

Der individuelle Stundenverbrauch ist ohne Zählerdaten unbekannt. Verwendet wird ein nachvollziehbares Haushaltsprofil mit Morgen-/Abendspitzen und höherem Winterbedarf. Die Wärmepumpe wird weiterhin mit zusätzlich 3.000 kWh Jahresstrom angenommen, jetzt aber überwiegend in die Heizperiode verteilt. Beim E-Auto gelten 20 kWh/100 km und die gewählte Tages- oder Abendladezeit. Das sind keine gemessenen Kundenprofile.

Andere Dachausrichtungen und Neigungen werden aus der Süd-/30°-Referenz vereinfacht angepasst. Es findet keine genaue PVGIS-Neuberechnung jedes individuellen Dachs statt. Verschattung, kurze Lastspitzen, Speicher-Standby, tatsächliche Leistungswirkungsgrade, Alterung und Abregelung sind nicht vollständig modelliert. Stündliche Glättung kann die Eigenversorgung überschätzen. Die Werte sind deshalb eine deutlich realistischere Orientierung, keine zugesicherte Mindestautarkie.

2023 ist ein verfügbares vollständiges Wetterjahr, aber nicht nachgewiesen ein langjähriges Durchschnittsjahr. Winterhalbjahr bezeichnet Januar–März plus Oktober–Dezember dieses Referenzjahrs; es ist keine Messung eines zusammenhängenden Winters 2023/24.

## Wirtschaftlichkeit ohne pauschales ROI-Versprechen

Die Ersparnis zählt nur tatsächlich vermiedenen Netzbezug und den modellierten Einspeiseerlös. Für das Beispiel sind das etwa 1.259 € vermiedene Stromkosten plus 586 € Einspeisung, insgesamt 1.845 € im Jahr **vor laufenden Kosten**.

Die Vergütung wird nach Leistungsanteilen gestaffelt: 7,70 ct/kWh für die ersten 10 kWp, 6,66 ct/kWh für den Anteil darüber. Daraus ergeben sich bei 11 kWp rund 7,61 ct/kWh. Diese amtliche Referenz gilt für Inbetriebnahme August–Dezember 2026, nicht als Garantie für spätere Inbetriebnahme. Betriebskosten, Ersatzteile, Finanzierung und künftige Preis-/Rechtsänderungen sind nicht enthalten. Die bislang ohne ausreichenden Kontext angezeigte 25-Jahre-ROI-Zahl wurde aus der Ergebnisanzeige entfernt.

## Qualität und Veröffentlichung

Die neue Berechnung verwendet dieselben Werte in Energiefluss, Kennzahlkarten, Winter-/Monatsübersicht, PDF und Anfragezusammenfassung. Farben, Seitenlayout und vorhandene Formulare bleiben erhalten. Es wurden keine neuen Bild-, Schrift- oder Trackingdienste hinzugefügt. Die vorhandene PDF-Bibliothek wird erst beim PDF-Klick geladen, um die initiale JavaScript-Last zu reduzieren.

Bestanden sind 14 Modelltests einschließlich echter Referenzdaten und Sommer-/Winterzeit, 18 API-Tests, 32 neue Desktop-/Mobil-Assertions einschließlich zweiseitiger PDF, 23 bestehende Formularfälle und 4 Rechnerfälle. Der endgültige Astro-Build enthält 69 Seiten. Alle Anfragen wurden lokal abgefangen; es entstanden keine echten Testmails. Ein künstlicher Autarkiedeckel wird nicht verwendet.

Veröffentlicht wurde das isolierte Rechnerpaket mit Commit `f1f97423a8a7ef11526086c031472386b08420b9`. Beide angebundenen Vercel-Projekte meldeten Erfolg; die neue Winter- und Monatsbilanz ist im normalen Nutzerbrowser auf der Produktionsdomain sichtbar. Ein direkter automatisierter Abruf wurde dagegen mit HTTP 429 durch den Botschutz begrenzt. Das ist kein Beleg für einen Seitenfehler. Brevo, DNS und Botschutz bleiben unverändert; die noch offene regelmäßige Testpipeline wurde nicht mitveröffentlicht. Ein neuer produktiver PageSpeed-Score wurde nicht erhoben.

## Quellen und Reproduzierbarkeit

Alle Quellen wurden am 07.11.2026 geprüft.

- [JRC/PVGIS: stündliche Daten](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/pvgis-5-tools/hourly-radiation_en): Leistung, UTC-Zeitstempel, Wettervariablen und API.
- [PVGIS-Handbuch](https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/pvgis-5-user-manual_en): Wetterjahre, Hinterlüftung, Verlustannahmen und Interpretation.
- [HTW Berlin: Autarkie und Modellgrenzen](https://solar.htw-berlin.de/faq-unabhaengigkeitsrechner/): zeitgleiche Versorgung, Speicherverluste, Verbrauchsprofile und Grenzen normaler Hausspeicher.
- [Bundesnetzagentur: EEG-Fördersätze](https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/start.html): aktuelle leistungsabhängige Vergütung und zeitliche Gültigkeit.

Datenprovenienz, Rohdaten-Hash und das genaue Rechenprotokoll liegen unter `.manus/solar-reference-2026-11-07/`. Das gebündelte Datenmodul ist `src/data/leipzigPvReference.ts`, das Rechenmodul `src/lib/solarSimulation.ts`. Die Modelltests laufen mit `REQUIRE_REAL_SOLAR_REFERENCE=1 node qa/test_solar_simulation.mjs`. Die neue Desktop-/Mobilprüfung ist `qa/test_solar_realism_ui.py` und verwendet ausschließlich eine lokale Produktionsvorschau mit abgefangenen Netzwerkaufrufen.
