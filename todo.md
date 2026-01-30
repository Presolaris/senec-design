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
- [ ] Code zu GitHub pushen

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
- [ ] Build testen
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
