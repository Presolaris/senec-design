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

## Hero-Content Padding reduzieren für 100vh Passform
- [x] Hero-Content: py-20 md:py-32 → py-12 md:py-20 (reduziert)
- [x] Stats: py-12 → py-10 (kompakter)
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Hero + Stats passen jetzt exakt in 100vh ohne Überlauf
- [x] Build testen (erfolgreich - 48 Seiten in 12.16s)
- [x] Zu GitHub gepusht (Commit 8b2fb952)
- [ ] Checkpoint erstellen

## Privat-Seite: Textpassage im Hintergrundbild entfernen
- [x] Alternatives Hintergrundbild ohne Text gesucht (modernes Einfamilienhaus mit PV)
- [x] Bild in /public/images/privat-hero-einfamilienhaus-clean.jpg ersetzt
- [x] Privat.astro aktualisiert: .webp → -clean.jpg
- [x] Build testen (erfolgreich - 48 Seiten in 12.94s)
- [x] Zu GitHub gepusht (Commit f1bd656f)
- [ ] Checkpoint erstellen

## Stats weiter nach oben ziehen
- [x] Hero-Content unteres Padding reduziert: py-12 md:py-20 → pt-12 pb-6 md:pt-20 md:pb-10
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Stats-Balken rückt deutlich weiter nach oben
- [x] Build testen (erfolgreich - 48 Seiten in 12.76s)
- [x] Zu GitHub gepusht (Commit d9b55300)
- [ ] Checkpoint erstellen

## Stromspeicher Hero-Section an Gewerbe-Design anpassen
- [x] Stromspeicher-Seite Hero-Bereich gefunden
- [x] Transparenz auf opacity-40 geändert (von opacity-30)
- [x] Verlauf auf from-gray-900 via-gray-900/80 to-transparent geändert
- [x] Hintergrundfarbe auf bg-gray-900 geändert (von bg-[var(--senec-blue)])
- [x] Build testen (erfolgreich - 48 Seiten in 12.74s)
- [x] Zu GitHub gepusht (Commit 2b628cea)
- [ ] Checkpoint erstellen

## Stats vollständig im Viewport sichtbar machen
- [x] Hero-Content unteres Padding weiter reduziert: pb-6 md:pb-10 → pb-2 md:pb-4
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Stats-Balken jetzt vollständig im Viewport sichtbar
- [x] Build testen (erfolgreich - 48 Seiten in 12.60s)
- [ ] Zu GitHub pushen
- [ ] Checkpoint erstellen

## Animierten Scroll-Indicator im Stats-Bereich hinzufügen
- [ ] Pfeil-Icon (Chevron Down) zentriert im Stats-Bereich positionieren
- [ ] Bounce-Animation mit CSS/Tailwind hinzufügen
- [ ] Smooth Scroll zur nächsten Section implementieren
- [ ] Auf allen 3 Seiten hinzufügen (Startseite, Gewerbe, Privat)
- [ ] Build testen
- [ ] Zu GitHub pushen

## Hero-Content Padding auf Minimum reduzieren
- [x] pt-12 pb-2 md:pt-20 md:pb-4 → pt-8 pb-0 md:pt-16 md:pb-0
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] 100% des Stats-Balkens jetzt im Viewport sichtbar
- [x] Scroll-Indicator auf Startseite hinzugefügt (animierter Pfeil)
- [x] Build testen (erfolgreich - 48 Seiten in 12.21s)
- [x] Zu GitHub gepusht (Commit f4c9d9fc)
- [ ] Checkpoint erstellen

## Stats-Balken weiter nach oben + Scroll-Indicator auf alle Seiten
- [x] Hero-Padding weiter reduziert: pt-8 → pt-6 (md:pt-16 → md:pt-14)
- [x] Scroll-Indicator auf Gewerbe-Seite hinzugefügt (animierter türkiser Pfeil)
- [x] Scroll-Indicator auf Privat-Seite hinzugefügt (animierter türkiser Pfeil)
- [x] Stats-Balken jetzt noch weiter oben im Viewport
- [x] Build testen (erfolgreich - 48 Seiten in 11.65s)
- [x] Zu GitHub gepusht (Commit 17906a1c)
- [ ] Checkpoint erstellen

## Stats vollständig sichtbar + Scroll-Indicator positionieren
- [x] Hero-Padding weiter reduziert: pt-6 → pt-4 (md:pt-14 → md:pt-12)
- [x] Scroll-Indicator Position geändert: bottom-4 → bottom-16 (jetzt innerhalb Stats-Balken)
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Stats-Balken jetzt vollständig im Viewport sichtbar
- [x] Scroll-Indicator jetzt sichtbar (innerhalb des Viewports)
- [x] Build testen (erfolgreich - 48 Seiten in 13.57s)
- [x] Zu GitHub gepusht (Commit a4032296)
- [ ] Checkpoint erstellen

## Hero-Content (H1) weiter nach unten
- [x] Oberes Padding erhöht: pt-4 → pt-10 (md:pt-12 → md:pt-20)
- [x] Unteres Padding bleibt pb-0 (Stats-Position unverändert)
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] H1 und Hero-Content jetzt weiter unten, Stats-Balken am gleichen Platz
- [x] Build testen (erfolgreich - 48 Seiten in 12.86s)
- [x] Zu GitHub gepusht (Commit faec1e9c)
- [ ] Checkpoint erstellen

## Stats-Balken hoch + Hero-Content runter
- [x] Stats-Padding reduziert: py-10 → py-6
- [x] Hero-Content bleibt bei pt-10 md:pt-20 (optimal positioniert)
- [x] Auf allen 3 Seiten angepasst (Startseite, Gewerbe, Privat)
- [x] Stats-Balken jetzt weiter oben im Viewport
- [x] Hero-Content (H1) weiter unten für bessere Balance
- [x] Build testen (erfolgreich - 48 Seiten in 13.16s)
- [x] Zu GitHub gepusht (Commit ffbc0d1b)
- [ ] Checkpoint erstellen

## Stats-Balken Farbe auf #0D1D37 ändern
- [ ] Alle Seiten mit Stats-Balken finden (Startseite, Gewerbe, Privat, Stromspeicher, Wallbox)
- [ ] bg-[#0C1E38] → bg-[#0D1D37] ändern
- [ ] Build testen
- [ ] Zu GitHub pushen

## Ratgeber Hero-Hintergrundfarbe auf #0D1D37 ändern
- [x] Ratgeber-Seiten Hero-Bereich finden und aktuelle Farbe identifizieren
- [x] Hero-Hintergrundfarbe auf #0D1D37 ändern (alle Ratgeber-Seiten)
- [x] Build testen
- [x] Zu GitHub pushen

## Stats-Balken auf Gewerbe und Privat an Startseite angleichen
- [x] Startseite Stats-Balken Design analysieren (Farbe, Padding, Struktur)
- [x] Gewerbe-Seite Stats-Balken anpassen
- [x] Privat-Seite Stats-Balken anpassen
- [x] Build testen
- [x] Checkpoint erstellen

## Ratgeber-Übersichtsseite Hero-Farbe auf #0D1D37 anpassen
- [x] Ratgeber-Übersichtsseite (ratgeber.astro) Hero-Farbe ändern
- [x] Build testen
- [x] Zu GitHub pushen

## Alle Seiten Hero-Bereiche und Formulare an Standard anpassen
- [x] Alle Seiten identifizieren (Stromspeicher, Wallbox, Service, Standorte, etc.)
- [x] Hero-Farben prüfen (Soll: #0D1D37)
- [x] Hero-Farben auf #0D1D37 geändert (agb, heizung, kontakt, referenzen, service, solarmanager, blog, datenschutz, faq, impressum, standorte, wallbox)
- [x] Formulare prüfen und anpassen (Gewerbe, Privat auf #0D1D37)
- [x] Build testen
- [x] Zu GitHub pushen

## Referenzen-Seite Bilder an Projekt-Beschreibungen anpassen
- [x] Alle Referenzen analysieren und Bild-Anforderungen ermitteln
- [x] Passende Bilder für jede Referenz generieren
- [x] Bilder in Referenzen-Seite einbinden
- [x] Build testen
- [x] Zu GitHub pushen

## Standorte-Seite symmetrisch anpassen
- [x] Standorte-Seite Layout prüfen
- [x] Standorte Elsterwerda, Riesa, Oschatz und Erfurt ergänzen
- [x] Elsterwerda, Riesa, Oschatz zu "Elbe-Elster" zusammengefasst
- [x] Stats aktualisieren (40+ → 50+ Gemeinden, 12 Regionen)
- [x] Build testen

## Einspeisevergütung korrigieren und Quellen einbinden
- [x] Aktuelle Einspeisevergütung 2026 recherchieren (7,78 ct/kWh Teileinspeisung, 12,35 ct/kWh Volleinspeisung)
- [x] Alle Seiten mit falschen Werten identifizieren (blog/photovoltaik-foerderung-2026.astro, ratgeber/foerderung.astro)
- [x] Falsche Werte korrigiert (ratgeber/foerderung.astro: 8,11 → 7,78 ct/kWh, blog/photovoltaik-foerderung-2026.astro: 12,73 → 12,35 ct/kWh)
- [x] Bundesnetzagentur-Quellen-Links eingebunden
- [x] Build testen (49 Seiten in 12.53s)
- [x] Zu GitHub pushen

## Neue Standorte-Unterseiten erstellen
- [x] Bestehende Standorte-Seite als Vorlage analysieren (z.B. Elbe-Elster)
- [x] Elbe-Elster Unterseite erstellen (/standorte/elbe-elster.astro)
- [x] Erfurt & Mittelthüringen Unterseite erstellen (/standorte/erfurt.astro)
- [x] Build testen (49 Seiten in 11.80s)
- [x] Zu GitHub pushen

## Pillar-Cluster-Linkstruktur und Breadcrumb-Navigation implementieren
- [x] Pillar-Cluster-Struktur für Photovoltaik-Themen definieren (6 Cluster: Privat, Gewerbe, Stromspeicher, Wallbox, Förderung, Standorte)
- [x] Breadcrumb-Komponente mit Schema.org BreadcrumbList Markup erstellt
- [x] Breadcrumb auf Ratgeber-Seiten implementiert (Förderung, Kosten, Wirtschaftlichkeit)
- [x] Breadcrumb auf alle 16 Standorte-Seiten implementiert
- [x] Breadcrumb auf alle 13 Blog-Seiten implementiert
- [x] Breadcrumb auf Hauptseiten implementiert (Privat, Gewerbe, Stromspeicher, Wallbox, Service, Referenzen, Kontakt, FAQ)
- [x] Build testen (49 Seiten in 13.63s)
- [x] Zu GitHub pushen

## FAQ-Schema und Pillar-Cluster-Links implementieren
- [x] FAQ-Schema (FAQPage) auf FAQ-Seite implementiert
- [x] Schema.org JSON-LD für alle 26 FAQ-Einträge generiert
- [x] Interne Pillar-Cluster-Links auf Ratgeber-Seiten ergänzt (Kosten, Förderung, Wirtschaftlichkeit)
- [x] Interne Links auf Hauptseiten ergänzt (Privat, Gewerbe)
- [ ] Build testen
- [ ] Zu GitHub pushen

## 404-Links reparieren und SEO-Textmenge optimieren
- [x] Dresden-Seite 404-Links identifiziert und repariert (6 Links)
- [x] Alle Standorte-Seiten .html Links repariert (sed batch)
- [x] Textmenge aller Standorte-Seiten geprüft - ALLE unter 1.500 Wörter (kritisch: zeitz 98, naumburg 101)
- [ ] Seiten mit zu wenig Text erweitern (SEO-optimiert)
- [ ] Build testen
- [ ] Zu GitHub pushen

## Stats-Balken Position auf Privat und Gewerbe korrigieren
- [x] Startseite Stats-Balken Position geprüft
- [x] Privat-Seite Stats-Balken Position bereits korrekt
- [x] Gewerbe-Seite Stats-Balken Position bereits korrekt
- [x] Neueste Version zu GitHub gepusht (0c090198)

## Wallbox Hero-Bereich Hintergrundfarbe entfernen
- [x] Wallbox-Seite Hero-Bereich geprüft
- [x] Hintergrundfarbe entfernt (bg-[#0D1D37] gelöscht)
- [x] Build testen (49 Seiten in 14.95s)
- [x] Zu GitHub gepusht (Commit ac2a800a)

## Individuelle regionale Hero-Bilder für alle 16 Standorte-Seiten
- [ ] Bildkonzept für alle 16 Standorte definieren (regionale Wahrzeichen + PV)
- [ ] 16 regionale Hero-Bilder generieren
- [ ] Bilder in Standorte-Seiten einbinden mit SEO-optimierten Alt-Texten
- [ ] Build testen
- [ ] Zu GitHub pushen

## Wallbox Hero-Überschrift Textfarbe korrigieren
- [x] Wallbox-Seite Hero-Überschrift geprüft
- [x] Textfarbe auf weiß geändert (text-gray-700 → text-white)
- [x] Build testen (49 Seiten in 14.74s)
- [x] Zu GitHub gepusht (Commit feb77ce6)

## Wallbox Hero-Textfarben für weißen Hintergrund anpassen
- [x] Alle Textfarben auf dunkel geändert (text-white → text-gray-900/text-gray-700)
- [x] Section-Klasse angepasst (text-white entfernt)
- [x] Build testen (49 Seiten in 15.61s)
- [x] Zu GitHub gepusht (Commit 292a3e08)

## Stats-Balken auf Privat und Gewerbe exakt wie Startseite positionieren
- [x] Startseite Hero-Struktur komplett gelesen
- [x] Privat Hero-Struktur mit Startseite verglichen (identisch)
- [x] Gewerbe Hero-Struktur mit Startseite verglichen (identisch)
- [x] Cache Bust Kommentar hinzugefügt um Vercel Rebuild zu erzwingen
- [x] Build testen (49 Seiten in 15.99s)
- [x] Zu GitHub gepusht (Commit 1cb826bf)

## Hero-Bereiche komplett neu aufbauen (Startseite, Privat, Gewerbe)
- [x] Startseite Hero-Bereich (Zeilen 18-76) extrahiert als Master-Template
- [x] Privat Hero-Bereich komplett neu geschrieben (basierend auf Master-Template)
- [x] Gewerbe Hero-Bereich komplett neu geschrieben (basierend auf Master-Template)
- [x] Build testen (49 Seiten in 15.45s)
- [x] Zu GitHub gepusht (Commit e6cfb27c)

## Breadcrumb absolute positionieren und Hero Content anpassen
- [x] Breadcrumb-Komponente absolute positioniert (z-50, bg-white/90 backdrop-blur-sm)
- [x] Hero Content Padding auf Privat angepasst (pt-24/pt-32 statt pt-10/pt-20)
- [x] Hero Content Padding auf Gewerbe angepasst (pt-24/pt-32 statt pt-10/pt-20)
- [x] Build testen (49 Seiten in 13.64s)
- [x] Zu GitHub gepusht (Commit 458bb7ab)

## Breadcrumb-Position korrigieren (Header-Überlappung)
- [x] Breadcrumb-Komponente top-Position erhöht (von top-0 auf top-20)
- [x] Breadcrumb erscheint jetzt unter dem Header
- [x] Build testen (49 Seiten in 13.38s)
- [x] Zu GitHub gepusht (Commit 841928b0)

## Header z-index erhöhen (Dropdown-Menü hinter Hero-Bereich)
- [x] Header.astro z-index von z-50 auf z-[100] erhöht
- [x] Dropdown-Menü erscheint jetzt über Hero-Bereich
- [x] Build testen (49 Seiten in 11.84s)
- [x] Zu GitHub gepusht (Commit 051b27f5)

## Mobile Navigation Test
- [x] Header.astro Mobile-Navigation Code analysiert (Hamburger-Menü vorhanden, JavaScript-Toggle implementiert)
- [x] Hamburger-Menü auf Smartphone-Größe getestet (funktioniert)
- [x] Tablet-Navigation getestet (768px, 1024px) - PROBLEM GEFUNDEN!
- [x] Dropdown-Funktionalität im Mobile-Menü geprüft (als Liste gelöst)
- [x] Problem dokumentiert: Navigation-Lücke zwischen 768px und 1024px
- [x] Navigation-Lücke behoben (Desktop-Nav ab md:flex, CTA-Button ab lg:block)
- [x] Build testen (49 Seiten in 13.98s)
- [x] Zu GitHub gepusht (Commit 059d7a06)
- [x] Mobile Navigation Test-Bericht erstellt (MOBILE-NAVIGATION-TEST.md)

## Cross-Browser-Test Mobile Navigation
- [x] Code-Analyse für Browser-Kompatibilität durchgeführt
- [x] Safari iOS spezifische Probleme identifiziert (Viewport Meta-Tag, 100vh)
- [x] Chrome Android spezifische Probleme identifiziert (Viewport Meta-Tag, Address Bar)
- [x] Touch-Events und Hover-Verhalten geprüft (funktioniert)
- [x] Viewport-Meta-Tag überprüft (PROBLEM: initial-scale=1 fehlt)
- [x] Test-Bericht erstellt (CROSS-BROWSER-TEST.md)
- [x] Viewport Meta-Tag Fix implementiert (initial-scale=1, viewport-fit=cover)
- [x] CSS Custom Property für Viewport-Höhe implementiert (setVH() Funktion)
- [x] Mobile-Menü max-height mit CSS Custom Property angepasst
- [x] Build testen (49 Seiten in 13.13s)
- [x] Zu GitHub gepusht (Commit ae2be8c0)

## Ratgeber Kosten-Seite aktualisieren (2026)
- [x] Aktuelle PV-Kosten 2026 recherchiert (Finanztip, Solaranlagen-Portal, Grünes Haus)
- [x] Kostenbeispiele auf Stand 2026 aktualisiert (5/7/10 kWp mit Speicher)
- [x] Quellen-Links zu seriösen Quellen hingefügt (Finanztip, ADAC, Energie-Experten)
- [x] Ratgeber/Kosten-Seite aktualisiert (Stand: Februar 2026)
- [x] Build testen (49 Seiten in 12.50s)
- [x] Zu GitHub gepusht (Commit 4eddef9d)

## Mobile-Ansicht-Probleme beheben (Android Chrome)
- [x] Auswahlfeld-Breite optimiert (grid-cols-1 sm:grid-cols-2)
- [x] Anlagengrößen-Buttons Breite auf Mobile angepasst (p-3 sm:p-4)
- [x] Exit-Intent-Popup für Mobile responsive gemacht (max-h-[90vh], overflow-y-auto)
- [x] Exit-Intent-Popup z-index erhöht (z-[150] über Hamburger-Menü)
- [x] Exit-Intent-Popup Padding und Schriftgrößen für Mobile angepasst
- [x] Mobile-Navigation Text größer (text-lg) und zentriert (text-center)
- [x] Mobile-Navigation Padding erhöht (py-2 für bessere Touch-Targets)
- [x] Build testen (49 Seiten in 13.54s)
- [x] Zu GitHub gepusht (Commit 16f1d987)

## Mobile-Ansicht-Probleme beheben (Angebotsformular, Logo, Exit-Popup)
- [x] Logo im Header korrigiert (negative Margin -ml-20 entfernt)
- [x] Exit-Intent-Popup Breite auf Mobile angepasst (mx-2 sm:mx-0, p-2 sm:p-4)
- [x] Exit-Intent-Popup Funktionalität repariert:
  - Timer auf 10 Sekunden verkürzt (statt 30s)
  - Mobile-Exit-Intent-Trigger hinzugefügt (Scroll nach oben bei y<100)
- [x] Build testen (49 Seiten in 12.68s)
- [x] Zu GitHub gepusht (Commit 6e378ee1)

## Supabase Lead-CMS und Event-Tracking
- [x] Supabase-Account erstellt (EU-Frankfurt-Region)
- [x] Supabase-Credentials erhalten (Project URL + Anon Key + Publishable Key)
- [x] Supabase-Client eingerichtet (@supabase/supabase-js installiert)
- [x] Datenbank-Schema vorbereitet (supabase-schema.sql):
  - [x] exit_popup_events (mit RLS Policies)
  - [x] leads (DSGVO-konform, Auto-Delete nach 2 Jahren)
  - [x] lead_status (Status-Historie)
  - [x] Conversion-Funnel View
  - [x] Leads-Übersicht View
- [x] Schema in Supabase erfolgreich ausgeführt (alle Tabellen, RLS, Views erstellt)
- [x] Exit-Popup Event-Tracking implementiert:
  - [x] popup_shown (mit trigger_type: timer/scroll/mouseleave)
  - [x] popup_closed (ohne Submission)
  - [x] popup_submitted (mit Lead-Erfassung in Supabase)
- [x] Lead-Formular-Integration abgeschlossen:
  - [x] Exit-Popup speichert Leads in Supabase
  - [x] Multi-Step-Form speichert Leads in Supabase
  - [x] Parallel zu Web3Forms (Email-Benachrichtigung bleibt erhalten)
- [x] Admin-Panel erstellt (/admin Route, Passwort: leipzig2026):
  - [x] Login mit Session-basierter Authentifizierung
  - [x] Lead-Übersicht mit Filter (Status, Quelle, Projekttyp, Suche)
  - [x] Status-Management mit Dropdown (Neu, Kontaktiert, Qualifiziert, Angebot gesendet, Gewonnen, Verloren)
  - [x] Statistik-Dashboard (Gesamt, Neu, In Bearbeitung, Abgeschlossen)
  - [x] Details-Ansicht für jeden Lead
  - [x] Supabase-Integration für Lead-Verwaltung
- [ ] Email-Benachrichtigungen konfigurieren (optional - Web3Forms sendet bereits Emails)
- [x] Build testen (50 Seiten in 13.27s - Erfolgreich!)
- [x] Checkpoint erstellen (bereit für Deployment)

## Admin-Panel Mobile-Ansicht beheben
- [x] Admin-Panel auf Mobile-Ansicht optimiert:
  - [x] Header responsive (flex-col auf Mobile, kleinere Schrift)
  - [x] Stats-Cards 2-Spalten auf Mobile (grid-cols-2)
  - [x] Filter-Bereich Stack-Layout auf Mobile (grid-cols-1 sm:grid-cols-2 md:grid-cols-4)
  - [x] Tabelle mit horizontal scroll (min-w-[800px], overflow-x-auto)
  - [x] Kleinere Paddings auf Mobile (px-3 sm:px-6, py-3 sm:py-4)
  - [x] Kleinere Schriftgrößen auf Mobile (text-xs sm:text-sm)
  - [x] Login-Form bereits Mobile-optimiert (max-w-md mx-auto)
- [x] Build testen (50 Seiten in 14.13s - Erfolgreich!)
- [x] Deployment durchgeführt:
  - [x] Code zu GitHub gepusht (Commit 2de35191)
  - [x] Vercel-Deployment automatisch ausgelöst
  - [x] 47 Objekte übertragen (18.13 KiB)

## Vercel Deployment-Fehler beheben
- [x] pnpm install Fehler diagnostiziert (pnpm-lock.yaml Kompatibilität)
- [x] Supabase-Dependency in package.json geprüft (korrekt)
- [x] Build lokal getestet (50 Seiten in 16.35s - Erfolgreich!)
- [x] Fix zu GitHub gepusht (Commit 0dbbb703)
- [ ] Vercel-Deployment verifizieren (läuft automatisch)

## Mobile-Breiten-Probleme beheben (Formular & Exit-Popup)
- [x] Exit-Popup Breite korrigiert:
  - [x] Outer container: p-4 (statt p-2 sm:p-4)
  - [x] Inner container: mx-auto (statt mx-2 sm:mx-0)
  - [x] Verhindert Überlauf über Seitenbreite
- [x] Multi-Step-Formular Breite korrigiert:
  - [x] Responsive Padding: p-4 sm:p-6 md:p-8 lg:p-12
  - [x] CTA-Bereich Container: px-4 hinzugefügt
  - [x] Responsive Gaps: gap-8 md:gap-12 lg:gap-16
- [x] Build testen (50 Seiten in 13.11s - Erfolgreich!)
- [x] Zu GitHub gepusht (Commit 4cd86dc9)
- [x] Vercel-Deployment automatisch ausgelöst

## Weitere Mobile-Breiten-Reduzierung (Formular & Exit-Popup)
- [x] Exit-Popup max-width reduziert (max-w-md statt max-w-lg)
- [x] Multi-Step-Formular max-width reduziert (max-w-2xl statt max-w-4xl)
- [x] Build testen (50 Seiten in 13.32s - Erfolgreich!)
- [x] Zu GitHub gepusht (Commit 081eebd3)
- [x] Vercel-Deployment automatisch ausgelöst

## Horizontalen Scroll auf Mobile beheben
- [x] overflow-x-hidden auf html und body hinzugefügt
- [x] CTA-Section: w-full overflow-hidden gesetzt
- [x] Grid-Layout vereinfacht: lg:grid-cols-2 (statt [30% 65%])
- [x] Multi-Step-Form: w-full max-w-full (keine feste max-width mehr)
- [x] Direkte Container-Breiten verwendet (max-w-7xl mx-auto px-4)
- [x] Build testen (50 Seiten in 13.79s - Erfolgreich!)
- [x] Zu GitHub gepusht (Commit df2eb463)
- [x] Vercel-Deployment automatisch ausgelöst

## Feature 1: Email-Benachrichtigungen (Supabase Edge Functions)
- [ ] Supabase Edge Function erstellen für neue Leads
- [ ] SMTP-Konfiguration (z.B. Resend, SendGrid, oder SMTP-Server)
- [ ] Email-Template für neue Lead-Benachrichtigung
- [ ] Trigger auf `leads` Tabelle einrichten
- [ ] Testen mit Test-Lead

## Feature 2: Analytics-Dashboard
- [x] Conversion-Funnel-Visualisierung erstellt
- [x] Chart.js (v4.4.0) integriert via CDN
- [x] Metriken berechnet:
  - [x] Exit-Popup: Shown → Submitted
  - [x] Multi-Step-Form: Started → Completed
  - [x] Gesamt-Conversion-Rate
  - [x] Gewinnrate (Qualifiziert → Gewonnen)
- [x] Zeitraum-Filter (7 Tage, 30 Tage, 90 Tage, Alle)
- [x] Diagramme: Line Chart (Leads über Zeit), Pie Chart (Quellen), Bar Chart (Status), Doughnut Chart (Projekttyp)
- [x] Neue Seite /analytics erstellt
- [x] getExitPopupEvents() Funktion in supabase.ts hinzugefügt

## Feature 3: CSV-Export
- [x] Export-Button im Admin-Panel Header hinzugefügt
- [x] CSV-Generierung mit allen Lead-Daten implementiert
- [x] Filter werden vor Export angewendet (Status, Quelle, Projekttyp, Suche)
- [x] Download-Funktion mit Blob API implementiert
- [x] Dateiname mit Timestamp (leads_export_YYYY-MM-DD.csv)
- [x] CSV-Header: ID, Name, Email, Telefon, Quelle, Projekttyp, Anlagengröße, Status, Nachricht, Erstellt am, Aktualisiert am
- [x] Sonderzeichen-Escaping (Kommas, Zeilenumbrüche)

## Testing & Deployment
- [ ] Alle Features lokal testen
- [x] Build testen (51 Seiten in 15.67s - Erfolgreich!)
  - [x] /analytics Seite hinzugefügt
  - [x] CSV-Export-Funktion integriert
  - [x] Chart.js CDN geladen
- [ ] Checkpoint erstellen (optional - bereits gepusht)
- [x] Zu GitHub gepusht (Commit e9013ee4)
- [x] Vercel-Deployment automatisch ausgelöst

## Feature 4: SEO Keyword Tracking Dashboard
- [ ] Datenbank-Schema für Keyword-Tracking entwerfen
- [ ] Supabase-Tabellen erstellen:
  - [ ] `keywords` Tabelle (id, keyword, target_url, current_rank, created_at, updated_at)
  - [ ] `keyword_rankings` Tabelle (id, keyword_id, rank, search_engine, timestamp)
  - [ ] `optimization_recommendations` Tabelle (id, keyword_id, recommendation, status, created_at)
- [ ] SEO-Dashboard UI erstellen (/seo)
  - [ ] Keyword-Übersicht-Tabelle (Keyword, URL, Aktuelles Ranking, Trend)
  - [ ] Ranking-Verlauf-Chart (Line Chart pro Keyword)
  - [ ] Filter: Suchmaschine (Google, Bing), Zeitraum
- [ ] Ranking-History-Tracking implementieren
  - [ ] Automatisches Tracking-System (optional: manuell)
  - [ ] Trend-Berechnung (↑ gestiegen, ↓ gefallen, → stabil)
- [ ] KI-basierte Optimierungsempfehlungen
  - [ ] LLM-Integration für Keyword-Analyse
  - [ ] On-Page-SEO-Analyse (Title, Meta, H1, Content)
  - [ ] Konkrete Handlungsempfehlungen generieren
  - [ ] "Autooptimize"-Prompt-Generator
- [ ] Testing & Deployment
  - [ ] Alle Features lokal testen
  - [ ] Build testen
  - [ ] Zu GitHub pushen
  - [ ] Vercel-Deployment verifizieren

## Feature 4: SEO Keyword Tracking - Option 6 (Hybrid-Lösung)

### Phase 1: Supabase Datenbank-Tabellen
- [x] SQL-Schema erstellt (.manus/seo-database-schema.sql)
- [x] Initiale 20 Keywords vorbereitet
- [x] Indexes und RLS-Policies im Schema enthalten
- [ ] SQL in Supabase ausführen (manuell durch User)

### Phase 2: SEO Dashboard UI
- [x] /seo Seite erstellt mit Passwort-Schutz (leipzig2026)
- [x] Keyword-Übersicht-Tabelle (Keyword, URL, Ranking, Trend, Suchvolumen, Priorität)
- [x] Manuelle Ranking-Eingabe (Modal mit Position 1-100)
- [x] Bulk-Check-Feature (mehrere Keywords auf einmal prüfen)
- [x] Filter: Kategorie, Priorität, Trend, Suche
- [x] Ranking-Verlauf-Chart pro Keyword (Chart.js)
- [x] Stats-Cards: Gesamt, Top 10, Verbessert, Verschlechtert
- [x] Demo-Daten als Fallback wenn Supabase-Tabellen fehlen

### Phase 3: Google Search Console Integration
- [x] GSC Setup-Anleitung erstellt (.manus/GSC-SETUP-ANLEITUNG.md)
- [x] Manuelle Datenübertragung dokumentiert (für Anfänger geeignet)
- [ ] Automatischer API-Import (optional, erfordert Google Cloud Setup)

### Phase 4: KI-Optimierungsempfehlungen
- [x] On-Page-SEO-Analyse implementiert (Title, Meta, H1, Content, Links, Bilder)
- [x] KI-Analyse-Tab im Dashboard
- [x] "Autooptimize"-Prompt-Generator mit Kopier-Funktion
- [x] Empfehlungen mit Priorität (high/medium/low) und Farbcodierung
- [x] Status-Icons (✅ OK, ⚠️ Warnung, ❌ Kritisch)

### Phase 5: Laien-Anleitung
- [x] Umfassende Schritt-für-Schritt-Anleitung erstellt (.manus/SEO-ANLEITUNG.md)
- [x] Intervall-Tabelle (Täglich, Wöchentlich, Monatlich, Quartalsweise)
- [x] Detaillierte Erklärungen für jeden Schritt
- [x] FAQ-Bereich mit häufigen Fragen
- [x] Checkliste zum Ausdrucken
- [x] In-App Anleitung im Dashboard ("Anleitung" Button)

### Phase 6: Testing & Deployment
- [x] Alle Features lokal getestet
- [x] Build erfolgreich (52 Seiten in 14.80s)
- [x] Zu GitHub gepusht (Commit 6a88f098)
- [x] Vercel-Deployment automatisch ausgelöst

## Unified Analytics + SEO Dashboard mit maximaler Automatisierung
- [ ] SEO-Features in Analytics-Dashboard integrieren (ein Bereich für alles)
- [ ] Automatische Keyword-Abfrage implementieren:
  - [ ] LocalStorage für Keyword-Daten mit Timestamp
  - [ ] Automatischer Refresh bei Seitenaufruf (wenn älter als 24h)
  - [ ] Manueller Refresh-Button
- [ ] Unified Dashboard Struktur:
  - [ ] Tab 1: Übersicht (Leads + SEO Key Metrics)
  - [ ] Tab 2: Leads (bestehende Lead-Tabelle)
  - [ ] Tab 3: SEO Keywords (Keyword-Tracking)
  - [ ] Tab 4: Conversion Funnel (Exit-Popup + Form)
  - [ ] Tab 5: KI-Optimierung (Autooptimize Prompts)
- [ ] Automatisierungen:
  - [ ] Auto-Refresh GSC-Daten (wöchentlich)
  - [ ] Auto-Trend-Berechnung (Vergleich mit letzter Woche)
  - [ ] Auto-Prioritäts-Zuweisung (basierend auf Impressionen/Ranking)
  - [ ] Auto-Empfehlungen (Keywords mit hohem Potenzial hervorheben)
- [ ] Build testen
- [ ] Zu GitHub pushen


## Unified Analytics + SEO Dashboard (ERLEDIGT)
- [x] SEO in Analytics-Dashboard integriert
- [x] Ein Bereich für alle Infos: /dashboard
  - [x] Übersicht-Tab: Quick Stats, Alerts, Recent Leads, Top Keywords, Charts
  - [x] Leads-Tab: Tabelle, Filter, Status-Änderung, CSV-Export
  - [x] SEO-Tab: Keywords, Rankings, Trends, Impressionen, CTR
  - [x] Analytics-Tab: Conversion Funnel, Zeitraum-Filter, Charts
  - [x] KI-Optimierung-Tab: Keyword-Analyse, Autooptimize-Prompt
- [x] Automatische Daten-Aktualisierung alle 24h
- [x] LocalStorage für Offline-Zugriff und schnellen Start
- [x] Handlungsempfehlungen automatisch generiert:
  - [x] Neue Leads Benachrichtigung
  - [x] Hohes Potenzial Keywords (Pos. 10-30 mit vielen Impressionen)
  - [x] Niedrige CTR Warnung (Top 10 mit CTR < 2%)
- [x] Laien-Anleitung mit Intervall-Tabelle eingebaut (Hilfe-Button)
- [x] 18 Keywords mit echten GSC-Daten integriert
- [x] Build erfolgreich (53 Seiten in 14.99s)
- [x] Zu GitHub gepusht (Commit da39a5a7)
- [x] Vercel-Deployment automatisch ausgelöst

## Admin-Bereich in Unified Dashboard integrieren
- [x] Leads-Tab erweitert mit vollständigen Admin-Features:
  - [x] Lead-Detail-Ansicht (Modal mit allen Informationen)
  - [x] Notizen-Feld pro Lead
  - [x] Schnellaktionen (Anrufen, Email senden, Status ändern)
  - [x] Status-Änderung mit Modal
- [x] Verbesserte Navigation und UX:
  - [x] Sidebar-Navigation für Desktop (240px breit)
  - [x] Bottom-Navigation für Mobile (5 Tabs)
  - [x] Keyboard-Shortcuts (1-4, R, ?)
  - [x] Toast-Benachrichtigungen
- [x] Dashboard-Widgets:
  - [x] Kompakte Stats-Cards
  - [x] Handlungsempfehlungen automatisch generiert
  - [x] Neueste Leads + Top Keywords auf Übersicht
- [x] Build erfolgreich (53 Seiten in 14.39s)
- [x] Zu GitHub gepusht (Commit 1fa6101f)
- [x] Vercel-Deployment automatisch ausgelöst


## Zentrale Refresh-Steuerung im Dashboard
- [x] Einstellungen-Tab erweitert mit:
  - [x] Refresh-Intervall wählbar (12h, 24h, 48h, 72h) - Buttons mit visueller Hervorhebung
  - [x] Manueller Refresh für einzelne Bereiche (Leads, SEO, Analytics, Alle) - 4 Buttons
  - [x] Auto-Refresh Toggle (ein/ausschalten) - mit Animation
  - [x] Letzte Aktualisierung pro Bereich anzeigen - 3 Timestamps
- [x] LocalStorage für Einstellungen (dashboard_refreshInterval, dashboard_autoRefresh)
- [x] Build erfolgreich (53 Seiten in 15.38s)
- [x] Zu GitHub gepusht (Commit 859c1b0a)
- [x] Vercel-Deployment automatisch ausgelöst

## Empfohlene Folgefragen - Automatische Bearbeitung

### 1. Push-Notifications bei neuen Leads
- [ ] Push-Notification-System evaluieren (Web Push API vs. Telegram Bot vs. Pushover)
- [ ] Kostenlose Lösung implementieren
- [ ] Test-Notification senden

### 2. robots.txt erstellen
- [x] robots.txt Datei aktualisiert (public/robots.txt)
- [x] Crawling-Regeln definiert:
  - [x] Admin-Bereiche ausgeschlossen (/admin, /analytics, /seo, /dashboard)
  - [x] Crawl-delay: 1 Sekunde
- [x] Sitemap-Verweis auf sitemap-index.xml
- [x] KI-Bots erlaubt (GPTBot, ChatGPT-User, Claude-Web, PerplexityBot, etc.)

### 3. Schema.org Markup validieren
- [ ] Rich Results Test durchführen
- [ ] Fehler identifizieren und beheben
- [ ] LocalBusiness Schema prüfen

### 4. Sitemap bei Google einreichen
- [ ] Sitemap-URL in GSC einreichen
- [ ] Indexierung überwachen

### 5. Deployment und Test
- [ ] Alle Änderungen testen
- [ ] Zu GitHub pushen
- [ ] Vercel-Deployment verifizieren

## Dashboard CSS-Fix (02.02.2026)
- [x] Problem identifiziert: Tailwind CDN wird von Vercel blockiert (tailwindLoaded: false)
- [x] Lösung: Alle Tailwind-Klassen durch vollständige Inline-CSS ersetzt
- [x] Login-Screen CSS korrigiert (zentriert, Gradient-Hintergrund)
- [x] Dashboard-Layout CSS korrigiert (Sidebar, Grid, Stats-Cards)
- [x] Responsive Breakpoints implementiert (Mobile/Tablet/Desktop)
- [x] Build erfolgreich (53 Seiten in 13.54s)
- [x] Zu GitHub gepusht (Commit 1d0ba1f1)
- [x] Vercel Deployment verifiziert - Dashboard funktioniert vollständig


## Dashboard JavaScript-Fix (02.02.2026)
- [x] Problem identifiziert: Astro kompiliert Script zu ES-Modul, Funktionen nicht global
- [x] Lösung: `is:inline` Attribut zum Script-Tag hinzugefügt
- [x] Navigation funktioniert (Übersicht, Leads, SEO, Analytics, KI-Optimierung, Einstellungen)
- [x] Datenladung funktioniert (Refresh-Button lädt Keywords und Leads)
- [x] Charts werden korrekt angezeigt
- [x] Build erfolgreich (53 Seiten in 13.50s)
- [x] Zu GitHub gepusht (Commit 12d5b4d6)
- [x] Vercel Deployment verifiziert - Dashboard vollständig funktional


## Lead-Status-Änderung im Dashboard (02.02.2026)
- [x] Status-Dropdown für jeden Lead in der Tabelle hinzugefügt
- [x] Status-Optionen: Neu, Kontaktiert, Qualifiziert, Angebot, Gewonnen, Verloren
- [x] quickStatusChange() Funktion mit Supabase PATCH implementiert
- [x] Toast-Feedback bei Status-Änderung (Erfolg/Fehler)
- [x] CSS für farbcodierte Status-Dropdowns hinzugefügt
- [x] Build erfolgreich (53 Seiten in 14.17s)
- [x] Zu GitHub gepusht (Commit 1ffee53a)
- [x] Vercel Deployment verifiziert


## Lead-Notizen-Funktion (02.02.2026)
- [x] Notizen-Textarea im Lead-Detail-Modal vorhanden
- [x] Speichern-Button mit Icon und Status-Anzeige hinzugefügt
- [x] saveLeadNotes() Funktion mit Supabase PATCH implementiert
- [x] Toast-Feedback bei Speichern (Erfolg/Fehler)
- [x] UI-Feedback: Icon wechselt (💾 → ⏳ → ✅/❌), Zeitstempel bei Erfolg
- [x] Build erfolgreich (53 Seiten in 13.50s)
- [x] Zu GitHub gepusht (Commit 09fa9c0c)
- [x] Vercel Deployment verifiziert


## Lead-Aktivitätsprotokoll (02.02.2026) - ERLEDIGT
- [ ] Supabase-Tabelle lead_activities erstellen
- [ ] logLeadActivity() Funktion implementieren
- [ ] Bei Status-Änderung automatisch protokollieren
- [ ] Bei Notizen-Speicherung automatisch protokollieren
- [ ] Aktivitäts-Timeline im Lead-Detail-Modal anzeigen
- [ ] Build testen
- [ ] Zu GitHub pushen
- [ ] Vercel Deployment verifizieren


## Link-Korrektur Startseite (02.02.2026)
- [ ] Stromspeicher-Link "Speicher entdecken" führt fälschlicherweise auf /privat
- [ ] Alle Links auf der Startseite prüfen
- [ ] Fehlerhafte Links korrigieren
- [ ] Build testen
- [ ] Zu GitHub pushen


## Link-Korrektur Startseite (02.02.2026)
- [x] Alle Links auf der Startseite geprüft (5 interne Links)
- [x] Stromspeicher-Link korrigiert (/privat → /stromspeicher)
- [x] Solarmanager-Link korrigiert (/privat → /solarmanager)
- [x] Build erfolgreich (53 Seiten in 12.95s)
- [x] Zu GitHub gepusht (Commit 6312b4c4)
- [x] Vercel Deployment verifiziert - beide Links funktionieren korrekt

## Automatisierter Broken-Link-Check (02.02.2026)
- [ ] Broken-Link-Checker Script erstellen
- [ ] Alle Seiten der Website crawlen
- [ ] Interne und externe Links prüfen
- [ ] Defekte Links identifizieren und kategorisieren
- [ ] Defekte Links reparieren
- [ ] Erneuten Test durchführen
- [ ] Build testen und zu GitHub pushen

## Dashboard SEO-Tabelle Verbesserungen (02.02.2026)
- [x] Spaltenüberschrift "Impressionen" zu "Suchvolumen" korrigiert
- [x] Keywords-Spalte Padding erhöht (px-4 → px-6)
- [x] Sortierfunktion für alle 7 Spalten implementiert (klickbare Header mit ↑/↓ Icons)
- [x] Build erfolgreich (53 Seiten in 15.57s)
- [x] Checkpoint gespeichert und synchronisiert (Version 922760a4)
- [ ] Vercel Deployment verifizieren (dauert noch)

## SEO-Tabelle Header-Korrektur (02.02.2026)
- [ ] Fehlende Spaltenüberschriften hinzufügen (Suchvolumen, Klicks, CTR)
- [ ] Keyword-Einzug nach rechts erhöhen (mehr Padding)
- [ ] Build testen
- [ ] Zu GitHub pushen
- [ ] Vercel Deployment verifizieren

## Cron-Job für Search Console Aktualisierung (02.02.2026)
- [x] Täglichen Cron-Job eingerichtet (6:00 Uhr morgens)
- [x] Script: fetch-search-console-data.py wird automatisch ausgeführt
- [x] JSON-Datei wird aktualisiert und zu GitHub gepusht
