# Vercel Deployment - Schritt-für-Schritt Anleitung

## Voraussetzungen

✅ **Bereits erledigt:**
- Code ist Vercel-optimiert
- `vercel.json` Konfiguration erstellt
- Build-Prozess verifiziert (20 Seiten in 12 Sekunden)
- Astro 5.15.9 (stabil, ohne encoding-Probleme)

## Teil 1: GitHub Repository vorbereiten

### Schritt 1: GitHub Repository erstellen

1. Gehen Sie zu https://github.com/new
2. **Repository Name**: `senec-design` (oder beliebig)
3. **Visibility**: Private (empfohlen) oder Public
4. **NICHT** "Initialize with README" ankreuzen
5. Klicken Sie auf "Create repository"

### Schritt 2: Code zu GitHub pushen

Öffnen Sie ein Terminal im Projekt-Verzeichnis und führen Sie aus:

```bash
# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "Vercel-optimiertes Astro Projekt"

# Remote Repository hinzufügen (ersetzen Sie USERNAME)
git remote add origin https://github.com/USERNAME/senec-design.git

# Code pushen
git branch -M main
git push -u origin main
```

**Wichtig**: Ersetzen Sie `USERNAME` mit Ihrem GitHub-Benutzernamen.

---

## Teil 2: Vercel Account & Deployment

### Schritt 3: Vercel Account erstellen

1. Gehen Sie zu https://vercel.com/signup
2. Klicken Sie auf "Continue with GitHub"
3. Autorisieren Sie Vercel für GitHub-Zugriff
4. Wählen Sie "Hobby" Plan (kostenlos)

### Schritt 4: Projekt importieren

1. Im Vercel Dashboard: Klicken Sie auf "Add New..." → "Project"
2. Wählen Sie "Import Git Repository"
3. Suchen Sie nach `senec-design` Repository
4. Klicken Sie auf "Import"

### Schritt 5: Build-Einstellungen konfigurieren

Vercel erkennt Astro automatisch. Überprüfen Sie die Einstellungen:

- **Framework Preset**: Astro (automatisch erkannt)
- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist` ✓
- **Install Command**: `npm install` ✓

**Keine Änderungen nötig!** Klicken Sie auf "Deploy".

### Schritt 6: Deployment abwarten

- Dauer: ~60-90 Sekunden
- Sie sehen Live-Logs des Build-Prozesses
- Bei Erfolg: "Congratulations! Your project has been deployed."

### Schritt 7: Preview URL testen

1. Klicken Sie auf "Visit" oder die angezeigte URL
2. Format: `https://senec-design-xxx.vercel.app`
3. Testen Sie alle Seiten:
   - Homepage
   - Solarrechner (interaktiv!)
   - Standort-Seiten
   - Kontaktformular

---

## Teil 3: Custom Domain konfigurieren

### Schritt 8: Domain zu Vercel hinzufügen

1. Im Vercel Dashboard: Gehen Sie zu Ihrem Projekt
2. Klicken Sie auf "Settings" → "Domains"
3. Geben Sie ein: `leipzig-photovoltaik.de`
4. Klicken Sie auf "Add"

Vercel zeigt jetzt DNS-Einträge an, die Sie konfigurieren müssen.

### Schritt 9: DNS bei Ihrem Domain-Anbieter konfigurieren

**Option A: A-Record (empfohlen für Root-Domain)**

Fügen Sie bei Ihrem Domain-Anbieter hinzu:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Option B: CNAME (für www-Subdomain)**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Für beide (Root + www):**

```
# Root Domain
Type: A
Name: @
Value: 76.76.21.21

# www Subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Schritt 10: DNS-Propagation abwarten

- **Dauer**: 5 Minuten bis 48 Stunden (meist < 1 Stunde)
- **Prüfen**: https://dnschecker.org/#A/leipzig-photovoltaik.de
- Vercel zeigt "Valid Configuration" wenn DNS korrekt ist

### Schritt 11: SSL-Zertifikat

- **Automatisch**: Vercel erstellt Let's Encrypt SSL-Zertifikat
- **Dauer**: ~60 Sekunden nach DNS-Propagation
- **Status**: Settings → Domains → "Certificate issued"

---

## Teil 4: Finale Checks

### Schritt 12: Website testen

Besuchen Sie https://leipzig-photovoltaik.de und prüfen Sie:

- ✅ Alle Seiten laden korrekt
- ✅ Solarrechner funktioniert (React-Komponente)
- ✅ Bilder werden angezeigt
- ✅ Navigation funktioniert
- ✅ Kontaktformular ist sichtbar
- ✅ SSL-Zertifikat aktiv (Schloss-Symbol im Browser)

### Schritt 13: PageSpeed Score prüfen

1. Gehen Sie zu https://pagespeed.web.dev/
2. Geben Sie ein: `https://leipzig-photovoltaik.de`
3. Klicken Sie auf "Analyze"
4. **Ziel**: 90+ Mobile, 95+ Desktop

**Wenn Score < 90:**
- Siehe `PAGESPEED-OPTIMIERUNG.md` für Verbesserungen

### Schritt 14: Google Search Console einrichten

1. Gehen Sie zu https://search.google.com/search-console
2. Klicken Sie auf "Add Property"
3. Wählen Sie "URL prefix"
4. Geben Sie ein: `https://leipzig-photovoltaik.de`
5. **Verifizierung**: Vercel-Methode (DNS TXT Record)

Vercel zeigt den TXT-Record in Settings → Domains.

---

## Automatische Deployments

### Wie es funktioniert

**Jeder Git-Push löst automatisch ein Deployment aus:**

```bash
# Änderungen machen
git add .
git commit -m "Update Preise"
git push

# Vercel deployed automatisch in ~60 Sekunden
```

**Preview Deployments:**
- Jeder Branch bekommt eigene URL
- Perfekt zum Testen vor dem Merge

**Production Deployments:**
- Nur `main` Branch wird auf `leipzig-photovoltaik.de` deployed
- Automatische Rollbacks möglich

---

## Troubleshooting

### Problem: Build schlägt fehl

**Lösung:**
1. Prüfen Sie Build-Logs in Vercel Dashboard
2. Testen Sie lokal: `npm run build`
3. Häufige Ursachen:
   - Fehlende Dependencies
   - TypeScript-Fehler
   - Broken Links

### Problem: Domain zeigt "Not Found"

**Lösung:**
1. Prüfen Sie DNS mit https://dnschecker.org
2. Warten Sie bis zu 48h (meist < 1h)
3. Verifizieren Sie DNS-Einträge bei Domain-Anbieter

### Problem: SSL-Zertifikat fehlt

**Lösung:**
1. Warten Sie 5-10 Minuten nach DNS-Propagation
2. Vercel erstellt Zertifikat automatisch
3. Bei Problemen: Settings → Domains → "Renew Certificate"

### Problem: Seite lädt langsam

**Lösung:**
1. Prüfen Sie PageSpeed Score
2. Siehe `PAGESPEED-OPTIMIERUNG.md`
3. Häufige Ursachen:
   - Große Bilder (WebP verwenden!)
   - Zu viel JavaScript
   - Fehlende Cache-Headers (bereits in vercel.json)

---

## Kosten & Limits (Hobby Plan)

**Kostenlos inkludiert:**
- ✅ 100 GB Bandwidth/Monat (~50.000 Besucher)
- ✅ Unlimited Deployments
- ✅ Unlimited Custom Domains
- ✅ Automatisches SSL
- ✅ DDoS Protection
- ✅ Analytics (Basic)

**Wenn Limits überschritten:**
- Vercel sendet Email-Warnung
- Upgrade auf Pro Plan: $20/Monat
- Oder: Bandwidth-Optimierung (siehe PAGESPEED-OPTIMIERUNG.md)

---

## Support & Ressourcen

**Vercel Dokumentation:**
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/astro

**Community:**
- Vercel Discord: https://vercel.com/discord
- Astro Discord: https://astro.build/chat

**Bei Problemen:**
1. Vercel Support: https://vercel.com/support
2. Vercel Status: https://vercel-status.com

---

## Nächste Schritte nach Deployment

1. ✅ **Google Search Console** einrichten (siehe Schritt 14)
2. ✅ **Google Analytics** integrieren (optional)
3. ✅ **Sitemap** bei Google einreichen (`/sitemap.xml`)
4. ✅ **PageSpeed** optimieren (Ziel: 100/100)
5. ✅ **Schema.org** LocalBusiness Markup hinzufügen
6. ✅ **Backlinks** aufbauen für SEO

Siehe `SEO-SETUP.md` für detaillierte Anleitung.

---

## Zusammenfassung

**Zeitaufwand:**
- GitHub Setup: 5 Minuten
- Vercel Deployment: 10 Minuten
- DNS-Konfiguration: 5 Minuten
- DNS-Propagation: 15-60 Minuten (Wartezeit)

**Gesamt: ~30 Minuten Arbeit + Wartezeit**

**Ergebnis:**
- ✅ Live Website auf leipzig-photovoltaik.de
- ✅ Automatische Deployments bei Git-Push
- ✅ SSL-Zertifikat aktiv
- ✅ PageSpeed-optimiert
- ✅ SEO-ready

**Viel Erfolg! 🚀**
