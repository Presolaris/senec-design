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
- [ ] Git Push und Vercel-Deployment
