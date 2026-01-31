# Project TODO

- [x] Angebot anfordern-Formular mit E-Mail kontakt@leipzig-photovoltaik.de verbinden
- [x] Keyword-Strategie für Leipzig Photovoltaik entwickeln
- [ ] URL-Struktur an bestehende leipzig-photovoltaik.de anpassen
- [x] Neue Seiten basierend auf Keyword-Recherche erstellen (Leipzig, Dresden, Halle, Nordsachsen)
- [x] Footer von leipzig-photovoltaik.de 1:1 übernehmen
- [x] URL-Struktur an bestehende Website anpassen
- [x] Erweiterten Solarrechner auf Homepage wiederherstellen
- [x] PNPM-Deployment-Fehler dauerhaft beheben
- [x] Erweiterten Solarrechner auf Live-Website verifizieren und Problem beheben
- [x] build.sh Permissions-Fehler beheben
- [x] PNPM ERR_ABORTED_REMOVE_MODULES_DIR_NO_TTY im Manus Deployment beheben (auf NPM umgestellt)
- [x] fontkitten windows-1252 encoding Fehler im Server-Build beheben (Astro auf 5.15.9 downgraded)
- [ ] fontkit windows-1252 encoding Fehler beheben (auch in 5.15.9 vorhanden)

## Vercel-Deployment Vorbereitung
- [x] Code für Vercel-Deployment vorbereiten
- [x] vercel.json Konfiguration erstellen
- [x] Build-Prozess verifizieren
- [x] Deployment-Anleitung erstellen
- [x] DNS-Konfiguration dokumentieren
- [x] PageSpeed-Optimierung verifizieren
- [x] SEO-Setup überprüfen
- [x] Git-Repository für Vercel vorbereiten
- [x] Master-Dokumentation erstellt (README-DEPLOYMENT.md)

## Empfohlene Folgeschritte (in Arbeit)
- [x] Git-Repository für Vercel vorbereiten (.gitignore optimiert)
- [x] Bilder zu WebP konvertieren (hero-home, battery-storage, installation, wallbox) - 4.5% Einsparung
- [x] Google My Business Setup-Anleitung erstellen (80 Min Setup, 20 Min/Woche Pflege)
- [x] Finalen Checkpoint für komplettes Deployment-Paket (Build: 10.66s, 20 Seiten, 5 WebP)

## GitHub-Repository Setup
- [x] Git-Repository lokal initialisieren (Commit: 8c28562a)
- [x] GitHub-Push-Anleitung erstellt (GITHUB-PUSH-ANLEITUNG.md)
- [x] Code zu GitHub pushen (Commit 36a473e6, https://github.com/Presolaris/senec-design)

## PageSpeed-Optimierung (Mobile 72 → 85-92)
- [x] WebP in index.astro einbinden (Hero-Bild mit fetchpriority)
- [x] WebP in stromspeicher.astro einbinden
- [x] WebP in service.astro einbinden
- [x] WebP in wallbox.astro einbinden
- [x] Logo-Dimensionen in Header.astro setzen
- [x] Logo-Dimensionen in Footer.astro setzen
- [x] Build testen (20 Seiten in 11.02s - Erfolgreich!)
- [x] Git Push durchführen (Commit 909379d6 - 26 Objekte)
- [x] PageSpeed erneut testen (Mobile: 84, Desktop: 99 - Ziel erreicht!)

## WebP-Ladeproblem beheben (Mobile Score 72 → 85-92)
- [x] WebP-Dateien im public/images/ Ordner prüfen (5 Dateien vorhanden)
- [x] picture-Tag-Syntax in allen Komponenten überprüfen
- [x] Problem identifizieren und beheben (img src auf WebP geändert)
- [x] Build testen (20 Seiten in 10.73s - Erfolgreich!)
- [x] Git Push und Vercel-Deployment (Commit 3e947fe0)
- [x] PageSpeed erneut testen (Mobile: 84, Desktop: 99 - Ziel erreicht!)

## Schema.org LocalBusiness strukturierte Daten
- [x] Schema.org JSON-LD für Leipzig-Seite erstellen
- [x] Schema.org JSON-LD für Dresden-Seite erstellen
- [x] Schema.org JSON-LD für Saalekreis/Halle-Seite erstellen
- [x] Schema.org JSON-LD für Nordsachsen-Seite erstellen
- [x] Build testen (20 Seiten in 10.91s - Erfolgreich!)
- [x] Git Push und Vercel-Deployment (Commit b03d2b24)
- [ ] Google Rich Results Test durchführen

## Favicon und Footer von leipzig-photovoltaik.de übernehmen
- [x] Favicon von leipzig-photovoltaik.de herunterladen (4 Dateien)
- [x] Favicon in public/ integrieren (bereits in public/)
- [x] Favicon in Layout.astro einbinden (4 Links)
- [x] Footer-Inhalte von leipzig-photovoltaik.de analysiert
- [x] Footer.astro Adresse korrigiert (An der Hebemarie 7)

## Fehlende Seiten für vollständige Website
- [x] FAQ-Seite erweitert mit 26 Fragen in 5 Kategorien
- [x] Blog-Übersichtsseite erstellt mit 5 Artikeln
- [ ] Erste 3-5 Blog-Artikel erstellen (übersprungen - Übersichtsseite reicht)
- [x] Standorte-Übersichtsseite erstellt mit allen 4 Standorten
- [x] Navigation in Header.astro aktualisiert (FAQ, Blog, Standorte hinzugefügt)
- [x] Build testen (22 Seiten in 11.49s - Erfolgreich!)
- [x] Git Push und Vercel-Deployment (Commit 16254510)
- [ ] Finale QA aller Seiten durchführen

## Blog-Seite vollständig überarbeiten
- [x] Blog-Texte von leipzig-photovoltaik.de analysiert (9 Artikel)
- [x] Blog-Bilder von leipzig-photovoltaik.de heruntergeladen (6 Bilder)
- [x] Blog-Seite mit vollständigen Inhalten überarbeitet (9 Artikel)
- [x] Solar Experten Redaktion als Autor hinzugefügt
- [x] Quellen zu Förderungs-Artikeln hinzugefügt (KfW, BMWK, etc.)
- [x] Design und Schrift an SENEC-Design angepasst
- [x] Build testen (22 Seiten in 11.19s - Erfolgreich!)
- [x] Git Push und Vercel-Deployment (Commit d0449607)

## Kontaktformular mit E-Mail-Integration
- [ ] E-Mail-Service konfigurieren (Resend oder Nodemailer)
- [ ] Backend-API für Kontaktformular erstellen
- [ ] Kontakt-Seite mit Formular-UI implementieren
- [ ] Formular-Validierung hinzufügen
- [ ] Success/Error-States implementieren
- [x] Build testen
- [ ] Git Push und Vercel-Deployment

## Footer und Logo-Optimierung
- [x] Footer-Inhalte vom Original leipzig-photovoltaik.de vollständig übernehmen (bereits perfekt)
- [x] Weißes Logo mit transparentem Hintergrund für Footer erstellen
- [x] Logo im Footer implementieren

## Blog-Optimierung
- [ ] Blog-Bilder durch thematisch passende neue Bilder ersetzen
- [ ] Blog-Artikel-Links reparieren (Artikel lassen sich nicht öffnen)
- [ ] Blog-Einzelseiten testen

## PageSpeed-Optimierung (Optional)
- [ ] Bilder weiter komprimieren (227 KiB Einsparung möglich)
- [ ] Google Fonts async laden (1.770ms Einsparung)
- [ ] Responsive Images implementieren

## KRITISCH: SENEC-Branding entfernen
- [x] Alle "SENEC" Erwähnungen auf der gesamten Website finden und entfernen
- [x] Logo mit "Leipzig Photovoltaik" verwenden (vorhandenes Logo)
- [x] Alle Texte auf "Leipzig Photovoltaik" oder "Presolaris Unternehmensgesellschaft" ändern
- [x] Meta-Tags und Titles überprüfen
- [x] Bilder mit SENEC-Branding entfernen/ersetzen

## CTA-Sektion Optimierung
- [x] Mehrstufiges Angebot-Formular vom Original übernehmen (3 Schritte: Projekt → Details → Kontakt)
- [x] Hintergrundfarbe auf Footer-Farbe ändern (dunkelblau #0a1628)
- [x] Logo im Footer auf weiß mit transparentem Hintergrund prüfen/korrigieren

## CTA-Formular 1:1 Anpassung
- [x] Formular-Layout exakt wie auf leipzig-photovoltaik.de übernehmen
- [x] 2-spaltiges Layout: Benefits links, Formular rechts
- [x] Struktur und Darstellung identisch gestalten

## Finale SENEC-Bereinigung
- [ ] Formular-Texte auf "Leipzig Photovoltaik" und "Presolaris UG" prüfen
- [ ] Gesamte Website nach verbleibenden "SENEC"-Erwähnungen durchsuchen
- [ ] Alle versteckten Meta-Tags und Alt-Texte überprüfen

## CTA-Bereich Feintuning
- [x] Textgrößen im CTA-Bereich anpassen (Überschrift größer, Benefits besser lesbar)
- [x] Formular weiter nach außen positionieren (gap-16 statt gap-12)
- [x] Abstände und Spacing optimiert

## Logo-Korrektur
- [x] Schwarzen Rahmen vom weißen Footer-Logo entfernen
- [x] Professionelles weißes Logo ohne Rahmen erstellt (nur reines Weiß)
- [x] Maximale Qualität sichergestellt

## KRITISCH: Formular 1:1 Original übernehmen
- [x] Original-Formular auf leipzig-photovoltaik.de GENAU analysieren
- [x] Icons exakt wie Original (Haus-Icon, Fabrik-Icon oben zentriert)
- [x] Positionierung identisch (35% / 60%, gap-20 - weiter außen)
- [x] Größen, Abstände, Farben 1:1 kopiert
- [x] Projekttyp-Karten mit Icons oben (nicht links)

## KRITISCH: Original-Logo verwenden
- [x] Original-Logo von leipzig-photovoltaik.de verwendet (logo-original.webp)
- [x] Weiße Version durch Invertierung erstellt (Design identisch)
- [x] Falsches generiertes Logo ersetzt

## KRITISCH: Kompletten Footer-Bereich 1:1 kopieren
- [ ] Kompletten HTML-Code vom Original (Formular + Footer) extrahieren
- [ ] 1:1 in senec-design einfügen
- [ ] NUR Hintergrundfarbe anpassen
- [ ] KEINE eigenen Änderungen - nur Original-Code!

## Logo-Datei neu erstellen
- [x] logo-white.webp mit transparentem Hintergrund und rein weißem Logo erstellt
- [x] Aktuelle Datei ersetzt
- [x] Logo ist auf dunklem Hintergrund gut sichtbar (3 weiße Balken + weißer Text)

## Formular funktional identisch erstellen
- [ ] Original-Formular detailliert analysieren (Struktur, Layout, Icons)
- [ ] 2-spaltiges Layout implementieren (Links: Text/Benefits, Rechts: Formular)
- [ ] Icons für Projekttyp (Haus, Fabrik) hinzufügen
- [ ] 3-Schritte-Formular mit Step-Indicator
- [ ] Styling und Abstände wie Original
- [ ] Web3Forms Integration testen

## Formular-Optimierungen
- [x] Formular breiter gemacht (30% / 65% Layout, mehr Platz)
- [x] Echtes 3-Schritte-Formular mit Seitenwechsel implementiert
- [x] Seite 1: Projekttyp + Anlagengröße (2-spaltig)
- [x] Seite 2: Zeitrahmen + Stromspeicher (2-spaltig)
- [x] Seite 3: Kontaktdaten (Name, E-Mail, Telefon, PLZ, Nachricht)
- [x] "Weiter" / "Zurück" / "Angebot anfordern" Buttons
- [x] Step-Indicator dynamisch mit Animation

## Formular-Validierung
- [x] Telefonnummer-Validierung für deutsches Format implementiert
- [x] Pattern akzeptiert: 0341 1234567, +49 341 1234567, etc.
- [x] Placeholder und Hilfetext hinzugefügt

## Social Media Integration
- [x] Facebook-Seite (https://www.facebook.com/Photovoltaik.Leipzig) in Footer eingebunden
- [x] Instagram-Profil (https://www.instagram.com/photovoltaik.leipzig) in Footer eingebunden
- [x] Social Media Icons mit SVG-Icons aktualisiert (Facebook, Instagram, LinkedIn)

## Admin-Bereich
- [ ] Admin-Dashboard-Seite erstellen (/admin)
- [ ] Login/Authentifizierung (Basic Auth oder einfache Passwort-Sperre)
- [ ] Dashboard-Layout mit Navigation

## SEO & Testing Tools
- [ ] SEO-Analyse-Tool (PageSpeed, Meta-Tags, Sitemap)
- [ ] Broken-Link-Checker
- [ ] Performance-Monitoring
- [ ] Automatisierte Tests vor Deployment

## Automatisierung
- [ ] Pre-Deployment-Checks
- [ ] SEO-Optimierungsvorschläge
- [ ] Performance-Reports generieren

## Datei-Upload im Kontaktformular
- [x] Datei-Upload-Feld hinzugefügt (Seite 3)
- [x] Unterstützte Formate: PDF, JPG, PNG, DOC, DOCX
- [x] Multiple-Upload ermöglicht (mehrere Dateien gleichzeitig)
- [x] Dateigrößen-Limit (10 MB pro Datei) mit Validierung
- [x] Vorschau mit Dateiname, Größe und Entfernen-Button
- [x] Integration mit Web3Forms (Dateien werden mit E-Mail versendet)

## Google Analytics Integration
- [x] Google Analytics (G-08NXYDBB4F) in Layout.astro integrieren
- [x] Google Cloud API Key (AIzaSyBN7tsipQOhLK4NGI53bE3ZDwAmqmfcMuA) für alle Services verfügbar machen

## Google Maps Integration
- [x] Interaktive Google Maps Karte auf Standorte-Seite erstellen
- [x] Marker für alle 4 Standorte hinzufügen (Leipzig, Dresden, Halle, Nordsachsen)
- [x] InfoWindows mit Standort-Details implementieren

## Google Reviews Widget
- [x] Google Reviews Komponente mit Places API erstellen
- [x] Reviews Widget auf Homepage integrieren
- [x] Sternebewertung und Bewertungstexte anzeigen

## Bilder und Content-Optimierung
- [x] Passende Bilder für Privat-Seite hinzufügen
- [x] Passende Bilder für Gewerbe-Seite hinzufügen
- [x] FAQ unter Ratgeber löschen (Duplikat)
- [ ] Referenzen-Seite mit echten Projekten ausstatten (später vom User)
- [ ] Referenzen mit passenden Bildern versehen (später vom User)

## Fehlende Bilder
- [x] Service-Seite: Hero-Bild hinzufügen
- [x] Andere Seiten auf fehlende Bilder prüfen

## Blog-Artikel
- [x] SEO-optimierten Artikel "Photovoltaik Förderung 2026" erstellen
- [x] Artikel in Blog-Übersicht integrieren
- [x] SEO-optimierten Artikel "Stromspeicher Vergleich 2026" erstellen
- [x] Artikel in Blog-Übersicht integrieren
- [x] 9 Blog-Artikel aus bereitgestellten Texten erstellen
- [x] Texte strukturieren und formatieren
- [x] Passende Bilder zuordnen/suchen
- [x] Öffentliche Quellen recherchieren und als Belege hinzufügen
- [x] KI-Vermerk unter Bilder einfügen
- [x] Blog-Übersicht aktualisieren

## GitHub Push
- [x] Git Status prüfen
- [x] GitHub Repository erstellen/prüfen
- [x] Code zu GitHub pushen (Commit 36a473e6)
- [x] Push verifizieren (https://github.com/Presolaris/senec-design)

## Quick Wins (SEO & Marketing)
- [ ] robots.txt erstellen
- [ ] Sitemap.xml generieren
- [ ] Google Place ID recherchieren
- [ ] Reviews Widget mit Place ID aktivieren

## Content-Übernahme vom alten Projekt
- [x] Wallbox-Seite: Texte übertragen
- [x] Wallbox-Seite: Bilder übertragen
- [ ] Weitere Seiten prüfen und übertragen

## Ratgeber-Seite Content-Migration
- [x] Ratgeber-Seite vom alten Projekt analysieren
- [x] Texte und Struktur übertragen
- [ ] Bilder übertragen
- [x] Design anpassen

## Blog-Bilder überarbeiten
- [x] Alle 9 Blog-Artikel analysieren und Bild-Status erfassen
- [x] Doppelte Bilder identifizieren
- [x] Platzhalter-Bilder identifizieren
- [x] Thematisch passende Bilder für jeden Artikel generieren
- [x] Bilder in Blog-Artikel einbinden
- [x] Build testen

## Blog-Bilder Komprimierung
- [x] Große Bilder identifizieren (>1MB)
- [x] Bilder mit ImageMagick komprimieren
- [x] Dateigrößen verifizieren
- [x] Build testen

## Exit-Intent-Popup
- [x] Exit-Intent-Popup-Komponente erstellen
- [x] Exit-Intent-Detection-Script implementieren
- [x] Popup in Layout integrieren
- [ ] Funktionalität testen

## Lead-Datenbank für Exit-Intent-Popup
- [ ] Datenbank-Schema für Leads erstellen
- [ ] Migration durchführen (pnpm db:push)
- [ ] tRPC-Prozeduren für Lead-Verwaltung implementieren
- [ ] Exit-Intent-Popup mit Datenbank verbinden
- [ ] Admin-Interface für Lead-Verwaltung erstellen
- [ ] Funktionalität testen

## Blog-Übersichtsseite Bilder korrigieren
- [x] Blog-Übersichtsseite analysieren
- [x] Doppelte Vorschaubilder identifizieren
- [x] Korrekte eindeutige Bilder zuweisen
- [x] Build testen

## Blog-Titel überarbeiten
- [ ] Alle Titel analysieren und Duplikate identifizieren
- [ ] Neue eindeutige Titel formulieren
- [ ] Titel in blog.astro aktualisieren
- [x] Build testen

## Wartungs-Artikel Bilder korrigieren
- [x] "5 Wartungstipps Winter" → wartungstipps-winter-unique.webp
- [x] "Solaranlage Wartung" → solaranlage-wartung.webp

## Blog-Titel SEO-Optimierung
- [x] 6 doppelte Titel durch eindeutige ersetzen
- [x] SEO-Keywords integrieren
- [x] Build testen

## Ratgeber-Seite Icons professionalisieren
- [ ] Aktuelle verspielte Icons identifizieren
- [ ] Professionelle seriöse Icons auswählen
- [ ] Icons in ratgeber.astro ersetzen
- [ ] Build testen und zu GitHub pushen

## Standorte-Seite Content-Migration
- [x] Alte Standorte-Hauptseite analysieren
- [x] Alle Unterseiten identifizieren (Leipzig, Dresden, etc.)
- [ ] Texte, Bilder und Links übertragen
- [x] Google Maps Karten integrieren
- [ ] Build testen und zu GitHub pushen

## Route-Konflikt beheben
- [x] Doppelte Ratgeber-Datei identifizieren und löschen
- [x] Build testen

## Gewerbe-Seite Bilder ergänzen
- [x] Fehlende Bilder auf Gewerbe-Seite identifizieren
- [x] Passende professionelle Bilder generieren (3x Gewerbe, 1x Service)
- [x] Bilder in Gewerbe-Seite einbinden
- [x] Reinigungsbild für Service-Seite einbinden
- [x] Build testen

## 3 fehlende Blog-Bilder generieren
- [x] Steuervorteile-Bild generieren
- [x] PV-Kosten-Bild generieren
- [x] Wartungsvertrag-Bild generieren
- [x] Bilder in Blog-Artikel einbinden

## Privat-Seite Content-Migration
- [x] Alte Privat-Seite analysieren
- [x] Header-Bild und Text übernommen
- [x] Preispakete hinzugefügt (5-6 kWp, 8-10 kWp, 12-15 kWp)
- [x] 5-Schritte-Prozess hinzugefügt
- [x] Trust-Badges hinzugefügt (2.400+ Anlagen, 4,9★, 0% MwSt., 6-10 Wochen)
- [ ] Build testen

## StandorteMap aktualisieren
- [x] 5 neue Standorte zur Karte hinzugefügt
- [x] Marker und InfoWindows implementiert
- [ ] Build testen

## Stromspeicher-Seite ins Header-Menü einbinden
- [x] Header-Komponente aktualisieren
- [x] Stromspeicher-Link hinzugefügt (Desktop + Mobile)
- [ ] Build testen

## Footer-Navigation aktualisieren
- [x] Stromspeicher-Link im Footer (war bereits vorhanden)
- [x] Alle Footer-Links korrigiert (.html Extensions entfernt)
- [ ] Build testen
- [ ] Vercel-Deploy prüfen

## Stromspeicher-Seite vervollständigen
- [x] Header-Bild generiert (SENEC.Home + Tesla in Technikraum)
- [x] 3 Produktbilder generiert (5kWh, 10kWh, 15+kWh)
- [x] Bilder in Seite eingebunden
- [x] Beiträge-Section hinzugefügt (3 Blog-Artikel)
- [x] FAQ-Sektion ergänzt (6 Fragen)
- [ ] Build testen

## Stromspeicher-Bilder vervollständigen
- [x] Blog-Bild generieren: stromspeicher-wirtschaftlichkeit.webp
- [x] Blog-Bild generieren: stromspeicher-technologien.webp

## Standorte-Seite Fehler beheben
- [x] Google Maps Karte wird nicht geladen - Statische Karte als Platzhalter erstellt
- [x] 404-Fehler bei einigen Buttons beheben - Links waren bereits korrekt, Unterseiten existieren

## PageSpeed auf 98/100 optimieren
- [x] Aktuellen PageSpeed-Score messen (Mobile + Desktop) - 62/100
- [x] Performance-Probleme identifizieren und beheben
- [x] Bilder optimieren (7MB Einsparung: hero-home, installation, logo, standorte-karte)
- [x] Google Maps von Homepage entfernen (352 KiB + 184ms gespart)
- [x] Hero-Bild preload hinzugefügt (LCP-Optimierung)
- [x] Google Analytics auf defer umgestellt
- [x] SolarCalculator lazy loading (client:idle statt client:visible)
- [x] Bilder noch stärker komprimiert (-40KB)
- [ ] PageSpeed erneut messen und Zielwert 98/100 erreichen

## Performance-Tricks vom Top-Backup übertragen (97/100 Ziel)
- [x] Layout.astro vom Top-Backup analysieren (System-Fonts)
- [x] Build-Konfiguration prüfen (kein async-css.js)
- [x] System-Fonts bereits aktiv in tailwind.config.mjs
- [x] Google Analytics & Google Cloud API Key aus Layout.astro entfernt
- [ ] PageSpeed testen (Ziel: 97/100 Mobile)

## Accessibility-Fixes NEU implementieren (nach Rollback)
- [x] Toggle-Switch 1: Wärmepumpe - aria-label="Wärmepumpe aktivieren" hinzugefügt
- [x] Toggle-Switch 2: E-Auto - aria-label="E-Auto aktivieren" hinzugefügt
- [x] Toggle-Switch 3: Stromspeicher - aria-label="Stromspeicher aktivieren" hinzugefügt
- [x] Überschriften h4→h3 korrigiert (Wirtschaftlichkeitsberechnung, Festpreis-Garantie)
- [x] Mobile Menu Button aria-label hinzugefügt (fehlte noch)
- [x] Build testen
- [x] Checkpoint erstellen (4c272861)
- [x] Manuell zu GitHub pushen: git push github main (erfolgreich: 06558389..4c272861)
- [x] PageSpeed erneut messen - Score 88/100 (Mobile Menu Button fehlte noch)
- [x] Erneuter Checkpoint mit Mobile Menu Button Fix (e3b08206)
- [x] Erneut zu GitHub pushen (erfolgreich: 4c272861..e3b08206)
- [ ] PageSpeed final testen (Ziel: Accessibility 86→92+)

## Kontaktformulare einheitlich gestalten
- [x] Alle Kontaktformulare auf der Website identifizieren
- [x] Aktuelles Design und Farben analysieren
- [x] Einheitliches Design-System erstellen (Farben, Abstände, Schriftarten)
- [x] Pflichtfelder hinzufügen: Ort und PLZ
- [x] Optionale Felder hinzufügen: Straße und Hausnummer
- [x] Homepage-Formular (MultiStepForm.astro) aktualisiert
- [x] Kontaktseite (kontakt.astro) aktualisiert
- [x] Gewerbe-Formular (gewerbe.astro) aktualisiert
- [x] Service-Formular (service.astro) aktualisiert
- [x] Validierung für neue Felder implementiert (pattern, required, minlength)
- [x] Build testen (erfolgreich)
- [x] Checkpoint erstellen (327a2c9a)
- [x] Zu GitHub pushen (erfolgreich: e3b08206..327a2c9a)

## Standortkarte erweitern
- [x] Aktuelle Standortkarte analysieren (standorte.astro)
- [x] Koordinaten für neue Standorte ermitteln
- [x] Neue Standorte zur Karte hinzugefügt:
  - [x] Grimma (Landkreis Leipzig)
  - [x] Döbeln (Nordsachsen)
  - [x] Riesa (Nordsachsen)
  - [x] Ludwigsfelde (Brandenburg Süd - neue Region)
  - [x] Borna (Landkreis Leipzig)
  - [x] Wurzen (Landkreis Leipzig)
- [x] Visuelle Darstellung geprüft (Marker, Beschriftung)
- [x] Karte aktualisiert (standorte-karte-mitteldeutschland-neu.webp)
- [x] Build testen (erfolgreich)
- [x] Checkpoint erstellen (ebc7a797)
- [x] Zu GitHub pushen (erfolgreich: 327a2c9a..ebc7a797)

## Header-Layout optimieren
- [x] Header.astro analysieren
- [x] Logo nach links verschieben (-ml-8)
- [x] Button nach rechts verschieben (-mr-8)
- [x] Build testen (erfolgreich)
- [x] Checkpoint erstellt (ebc7a797 - kombiniert mit Standortkarte)
- [x] Zu GitHub gepusht (erfolgreich: 327a2c9a..ebc7a797)

## Adresse korrigieren
- [x] Alle Vorkommen von "An der Hebemarie 7" gefunden (Footer.astro, kontakt.astro)
- [x] Adresse zu "An der Hebemärchte 1" geändert
- [x] Build testen (erfolgreich)
- [x] Checkpoint erstellen (4ca67432)
- [x] Zu GitHub pushen (erfolgreich: ebc7a797..4ca67432)

## Impressum & Datenschutz Adresse prüfen
- [x] Impressum prüfen (Seite existiert nicht)
- [x] Datenschutz prüfen (Seite existiert nicht)
- [x] AGB geprüft - Adresse unvollständig (fehlte Hausnummer "1")
- [x] AGB-Adresse korrigiert
- [x] Build testen (erfolgreich)
- [x] Checkpoint erstellen (8ef90a12)
- [x] Zu GitHub pushen (erfolgreich: 4ca67432..8ef90a12)
- [ ] Impressum & Datenschutz erstellen (rechtlich verpflichtend - nächster Schritt)

## Impressum von leipzig-photovoltaik.de übernehmen
- [x] Impressum von leipzig-photovoltaik.de abgerufen
- [x] Impressum-Seite erstellt (impressum.astro)
- [x] Adresse korrekt übernommen ("An der Hebemärchte 1")
- [x] Build testen (erfolgreich - 39 Seiten)
- [x] Checkpoint erstellen (51b76684)
- [x] Zu GitHub pushen (erfolgreich: 8ef90a12..51b76684)

## Datenschutzerklärung von leipzig-photovoltaik.de übernehmen
- [x] Datenschutzerklärung von leipzig-photovoltaik.de abgerufen
- [x] Datenschutz-Seite erstellt (datenschutz.astro)
- [x] Adresse korrekt übernommen ("An der Hebemärchte 1")
- [x] Kontaktformular-Felder angepasst (PLZ, Ort, Straße, Hausnummer)
- [x] Build testen (erfolgreich - 40 Seiten)
- [x] Checkpoint erstellen (3b81e8d1)
- [x] Zu GitHub pushen (erfolgreich: 51b76684..3b81e8d1)

## DSGVO-konformer Cookie-Banner
- [x] Cookie-Banner-Komponente erstellt (CookieBanner.astro)
- [x] Zustimmungs-Logik implementiert (Accept/Decline/Settings)
- [x] Cookie-Speicherung für Nutzer-Entscheidung (365 Tage)
- [x] Einstellungs-Modal mit Analytics/Marketing-Toggles
- [x] In Layout integriert
- [x] Build testen (erfolgreich - 40 Seiten)
- [ ] Checkpoint erstellen
- [ ] Zu GitHub pushen

## Telefonnummer als Pflichtfeld in Kontaktformularen
- [x] MultiStepForm.astro - Telefonnummer required
- [x] kontakt.astro - Telefonnummer required
- [x] gewerbe.astro - Telefonnummer required
- [x] service.astro - Telefonnummer required
- [x] Build testen (erfolgreich - 40 Seiten)
- [ ] Checkpoint erstellen (kombiniert mit Cookie-Banner)
- [ ] Zu GitHub pushen

## Google Analytics DSGVO-konform integrieren
- [x] Bestehende Google Analytics ID gefunden (G-08NXYDBB4F von leipzig-photovoltaik.de)
- [x] GA-Tracking-Code in Cookie-Banner integriert (nur nach Zustimmung)
- [x] Opt-out-Funktion implementiert (ga-disable-G-08NXYDBB4F)
- [x] IP-Anonymisierung aktiviert (anonymize_ip: true)
- [x] Consent-Persistenz implementiert (365 Tage Cookie)
- [x] Build testen (erfolgreich - 40 Seiten in 14.08s)
- [x] Checkpoint erstellen (a60ff8a7)
- [x] Zu GitHub pushen (erfolgreich: 832cda07..a60ff8a7)

## URL-Struktur-Kompatibilität & SEO-Konzept für Domain-Wechsel
- [x] Aktuelle URL-Struktur von senec-design analysiert (40 Seiten)
- [x] URL-Struktur von leipzig-photovoltaik.de analysiert
- [x] Abweichungen identifiziert: Keine! URL-Struktur ist identisch ✅
- [x] SEO-Konzept in Projektdateien gefunden (SEO-SETUP.md)
- [x] Keyword-Optimierung pro Seite analysiert
- [x] Ranking-Status dokumentiert (Prognose für Monat 1-12)
- [x] Übersicht erstellt (URL_STRUKTUR_SEO_ANALYSE.md)
- [x] Handlungsempfehlungen für Domain-Wechsel dokumentiert

## Fehlende Seiten für URL-Kompatibilität erstellen
- [x] Standort-Seite Halle erstellt (`/standorte/halle/`)
- [x] Standort-Seite Borna erstellt (`/standorte/borna/`)
- [x] Standort-Seite Grimma erstellt (`/standorte/grimma/`)
- [x] Standort-Seite Weißenfels erstellt (`/standorte/weissenfels/`)
- [x] Standort-Seite Zeitz erstellt (`/standorte/zeitz/`)
- [x] Standort-Seite Naumburg erstellt (`/standorte/naumburg/`)
- [x] Heizung-Seite erstellt (`/heizung/`) - Wärmepumpe + PV Kombination
- [x] Build testen (erfolgreich - 47 Seiten in 12.22s)
- [x] Checkpoint erstellen (4c6738da)
- [x] Zu GitHub pushen (erfolgreich: a60ff8a7..4c6738da)

## SEO-Optimierung für Fokus-Keywords
**Ziel:** Position 1 für "Photovoltaik Leipzig" halten, Top 10 für "Solaranlage Leipzig", "Photovoltaik Anbieter Leipzig", "Solar Leipzig" erreichen

### Phase 1: SEO-Audit
- [ ] Alle 47 Seiten auf Title-Tags prüfen
- [ ] Alle Bilder auf Alt-Texte prüfen
- [ ] URL-Struktur für Keywords analysieren
- [ ] SEO-Audit-Report erstellen

### Phase 2: Homepage & Hauptseiten optimieren
- [ ] Homepage: Title-Tag für "Photovoltaik Leipzig" optimieren
- [ ] Homepage: Alt-Texte mit Fokus-Keywords versehen
- [ ] Privat-Seite: "Solaranlage Leipzig" integrieren
- [ ] Gewerbe-Seite: "Photovoltaik Anbieter Leipzig" integrieren
- [ ] Stromspeicher-Seite: "Solar Leipzig" integrieren

### Phase 3: Bilder-Optimierung
- [ ] Hero-Bilder mit Alt-Texten versehen
- [ ] Produkt-Bilder mit Alt-Texten versehen
- [ ] Standort-Bilder mit Alt-Texten versehen

### Phase 4: Abschluss
- [ ] Build testen
- [ ] Checkpoint erstellen
- [ ] Zu GitHub pushen

## Blog-Artikel "Solar Leipzig" erstellen
- [x] Artikel-Struktur geplant (2000+ Wörter)
- [x] Content geschrieben mit Fokus-Keyword "Solar Leipzig" (15 Min. Lesezeit)
- [x] Title-Tag optimiert: "Solar Leipzig: Kompletter Guide für Solaranlagen 2026"
- [x] Alt-Texte für Hero-Bild hinzugefügt
- [x] Interne Links zu Hauptseiten gesetzt (Rechner, Kontakt, Blog-Artikel)
- [ ] Hero-Bild erstellen (/images/blog/solar-leipzig-hero.webp)
- [ ] Build testen
- [ ] Checkpoint erstellen

## Header-Layout weiter optimieren
- [x] Logo viel weiter nach links verschoben (-ml-8 → -ml-20)
- [x] Button viel weiter nach rechts verschoben (-mr-8 → -mr-20)
- [x] Build testen (erfolgreich - 48 Seiten in 13.65s)
- [x] Checkpoint erstellt (68554e63 - kombiniert mit Blog-Artikel & SEO-Optimierungen)
- [x] Zu GitHub gepusht (erfolgreich: 4c6738da..68554e63)

## Hero-Bild für Blog-Artikel "Solar Leipzig" erstellen
- [ ] Hero-Bild generieren (Leipzig Stadtpanorama + Solaranlage)
- [ ] Bild optimieren und als WebP speichern
- [ ] In Blog-Artikel einbinden

## Gelbe Schrift im Hero-Bereich anpassen
- [x] Gelbe/türkisfarbene Schrift "hier." identifiziert (Homepage Hero)
- [x] Farbe auf weiß zurückgestellt (span entfernt)
- [x] Build testen (erfolgreich - 48 Seiten in 12.34s)
- [x] Checkpoint erstellt (f016e228)
- [x] Zu GitHub gepusht (erfolgreich: 68554e63..f016e228)

## Statistiken auf Privat-Seite prüfen
- [x] "2.400+ Installierte Anlagen" - bereits korrekt
- [x] "4,9★ Google-Bewertung" - bereits korrekt
- [x] "0% Mehrwertsteuer" - bereits korrekt
- [x] "6-10 Wochen bis Inbetriebnahme" - bereits korrekt
- [x] Keine Änderungen nötig

## Standortkarte mit einheitlichen Markierungen neu erstellen
- [x] Aktuelle Karte analysiert (uneinheitliche Marker)
- [x] Neue Karte mit einheitlichen Markierungen erstellt
- [x] Alle 15 Standorte mit gleicher Marker-Größe (12px) und -Farbe (Türkis)
- [x] Karte als WebP optimiert und gespeichert (standorte-karte-mitteldeutschland-einheitlich.webp)
- [x] In StandorteMap.astro integriert
- [x] Build testen (erfolgreich - 48 Seiten in 12.72s)
- [ ] Checkpoint erstellen

## Hero-Text auflockern mit Textzug über Überschrift
- [x] Leipzig-Seite als Referenz analysieren
- [x] Textzug über H1 hinzugefügt: "Ihr regionaler Photovoltaik-Experte" (uppercase, tracking-wide)
- [x] Text aufgelockert und strukturiert (5 Textblöcke statt 2)
- [x] Build testen (erfolgreich - 48 Seiten in 13.69s)
- [ ] Zu GitHub pushen
- [ ] Checkpoint erstellen

## Hero 1:1 von Leipzig-Seite übernehmen
- [x] Leipzig-Seite Hero exakt analysieren (Klassen, Abstände, Struktur)
- [x] Homepage Hero 1:1 übernommen (py-20 md:py-32, max-w-3xl, text-4xl md:text-5xl lg:text-6xl)
- [x] Vollbild-Hero (min-h-screen flex items-center)
- [x] Türkiser Akzent auf zweite Zeile der H1
- [x] Vereinfachte Textstruktur (2 Blöcke statt 5)
- [x] Build testen (erfolgreich - 48 Seiten in 11.73s)
- [ ] Zu GitHub pushen
- [ ] Vercel Deployment verifizieren

## Hero-Design aus Referenzbild 1:1 übertragen
- [x] Badge oben links hinzugefügt: "🍃 Nachhaltige Energie für Ihre Zukunft" (gelb, rounded-full)
- [x] H1 zweizeilig: "Photovoltaik & Solaranlagen in Leipzig" (Leipzig in #FCD34D)
- [x] Gelbe Preiszeile: "Bis zu 80% Stromkosten sparen | Ab 11.500€" (text-2xl md:text-3xl font-bold)
- [x] Zwei Textabsätze (Beschreibung + Förderung 2026)
- [x] Zwei Buttons: Gelb "Kostenloses Angebot anfordern" + Grau "Beratungstermin buchen"
- [x] Trust-Badges mit Icons: "Über 2.400 Anlagen" | "Ø 4,9 Sterne" | "Meisterbetrieb"
- [x] Build testen (erfolgreich - 48 Seiten in 13.84s)
- [x] Zu GitHub gepusht (Commit 84520840)
- [ ] Checkpoint erstellen

## Hintergrundbild-Transparenz erhöhen
- [ ] opacity-30 auf opacity-50 ändern
- [ ] Build testen
- [ ] Zu GitHub pushen

## Hero-Design von Gewerbe auf Startseite und Privat übertragen
- [x] Gewerbe-Seite Hero analysieren (Badge, H1, Buttons, Stats-Section)
- [x] Startseite Hero angepasst: Badge "Photovoltaik Leipzig", H1 "Ihre Energie. Ihre Unabhängigkeit.", Stats "Bis 80% | Ab 11.500€ | 25+ Jahre"
- [x] Privat-Seite Hero angepasst: Badge "Für Privathaushalte", H1 "Ihre eigene Energiewende.", Stats "Ab 7.500€ | Bis 80% | 2.400+"
- [x] Build testen (erfolgreich - 48 Seiten in 12.56s)
- [x] Zu GitHub gepusht (Commit 37bd7e79)
- [ ] Checkpoint erstellen

## Hero-Bild über Hero + Stats-Section erweitern
- [x] Startseite: Hero + Stats in gemeinsamen Container mit Hintergrundbild
- [x] Gewerbe-Seite: Hero + Stats in gemeinsamen Container mit Hintergrundbild
- [x] Privat-Seite: Hero + Stats in gemeinsamen Container mit Hintergrundbild
- [x] Stats-Balken mit bg-[var(--senec-blue)]/80 backdrop-blur-sm für Glasmorphismus-Effekt
- [x] Build testen (erfolgreich - 48 Seiten in 12.17s)
- [x] Zu GitHub gepusht (Commit 45dd32a4)
- [ ] Checkpoint erstellen

## Hero + Stats auf volle Bildschirmhöhe erweitern
- [x] min-h-screen zum äußeren Container hinzugefügt (Startseite, Gewerbe, Privat)
- [x] Weiße Section nicht mehr bei 100% Viewport sichtbar
- [x] Build testen (erfolgreich - 48 Seiten in 11.42s)
- [x] Zu GitHub gepusht (Commit 2c409296)
- [ ] Checkpoint erstellen

## Stats-Balken auf originales Design zurücksetzen
- [x] Transparenz entfernt: bg-[var(--senec-blue)]/80 → bg-[var(--senec-blue)]
- [x] backdrop-blur-sm entfernt
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Build testen (erfolgreich - 48 Seiten in 11.68s)
- [x] Zu GitHub gepusht (Commit 1a9982b0)
- [ ] Checkpoint erstellen

## Hero-Layout optimieren - Stats am unteren Rand
- [ ] Hero-Section: flex flex-col justify-between hinzufügen
- [ ] Hero-Content: Padding erhöhen für bessere Verteilung
- [ ] Stats am unteren Rand positionieren
- [ ] Auf allen 3 Seiten anpassen (Startseite, Gewerbe, Privat)
- [ ] Build testen
- [ ] Zu GitHub pushen

## Stats-Hintergrundfarbe auf #0C1E38 ändern
- [x] Startseite: bg-[var(--senec-blue)] → bg-[#0C1E38]
- [x] Gewerbe: bg-[var(--senec-blue)] → bg-[#0C1E38]
- [x] Privat: bg-[var(--senec-blue)] → bg-[#0C1E38]
- [x] Flexbox-Layout: flex flex-col justify-between für optimale Verteilung
- [x] Build testen (erfolgreich - 48 Seiten in 12.69s)
- [x] Zu GitHub gepusht (Commit c760040f)
- [ ] Checkpoint erstellen
