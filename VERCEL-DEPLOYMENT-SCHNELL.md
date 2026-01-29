# Vercel-Deployment - Schnellanleitung (3 Minuten)

## ✅ Voraussetzungen erfüllt

- ✅ Code ist auf GitHub: https://github.com/Presolaris/senec-design
- ✅ Repository ist deployment-ready
- ✅ Alle Konfigurationen sind vorbereitet

**Jetzt nur noch 3 Schritte bis zur Live-Website!**

---

## Schritt 1: Vercel-Account erstellen (1 Minute)

### Option A: Mit GitHub anmelden (EMPFOHLEN)

1. **Vercel öffnen:**
   - Gehen Sie zu: **https://vercel.com**

2. **Sign Up klicken:**
   - Klicken Sie oben rechts auf **"Sign Up"**

3. **Mit GitHub anmelden:**
   - Klicken Sie auf **"Continue with GitHub"**
   - Sie werden zu GitHub weitergeleitet
   - Klicken Sie auf **"Authorize Vercel"**

4. **Fertig!**
   - Sie sind jetzt bei Vercel angemeldet ✅
   - Vercel hat Zugriff auf Ihre GitHub-Repositories

### Option B: Mit E-Mail anmelden

1. Gehen Sie zu **https://vercel.com**
2. Klicken Sie auf **"Sign Up"**
3. Geben Sie Ihre E-Mail ein
4. Bestätigen Sie die E-Mail
5. Verbinden Sie GitHub später

---

## Schritt 2: Projekt importieren (1 Minute)

### Projekt auswählen

1. **Dashboard öffnen:**
   - Nach dem Login sehen Sie das Vercel-Dashboard
   - URL: https://vercel.com/dashboard

2. **Neues Projekt erstellen:**
   - Klicken Sie auf **"Add New..."** (oben rechts)
   - Wählen Sie **"Project"**

3. **GitHub-Repository auswählen:**
   - Sie sehen eine Liste Ihrer GitHub-Repositories
   - **Suchen Sie:** `senec-design`
   - Klicken Sie auf **"Import"** neben dem Repository

   **Wenn Sie das Repository NICHT sehen:**
   - Klicken Sie auf **"Adjust GitHub App Permissions"**
   - Wählen Sie **"All repositories"** ODER
   - Wählen Sie **"Only select repositories"** → Wählen Sie `senec-design`
   - Klicken Sie auf **"Save"**
   - Gehen Sie zurück zu Vercel → Repository sollte jetzt sichtbar sein

### Projekt konfigurieren

**Wichtig:** Vercel erkennt Astro automatisch!

1. **Project Name:**
   ```
   senec-design
   ```
   - Wird automatisch ausgefüllt
   - Können Sie so lassen

2. **Framework Preset:**
   - Vercel erkennt automatisch: **"Astro"** ✅
   - Falls nicht: Wählen Sie **"Astro"** aus dem Dropdown

3. **Root Directory:**
   - Lassen Sie: **"./"** (Wurzelverzeichnis)

4. **Build and Output Settings:**
   - **NICHTS ÄNDERN!** ✅
   - Vercel verwendet automatisch:
     * Build Command: `npm run build`
     * Output Directory: `dist`
     * Install Command: `npm install`

5. **Environment Variables:**
   - **KEINE NÖTIG!** ✅
   - Ihre Website braucht keine Umgebungsvariablen

### Deployment starten

1. **Deploy klicken:**
   - Scrollen Sie nach unten
   - Klicken Sie auf den großen blauen Button **"Deploy"**

2. **Warten:**
   - Vercel zeigt Fortschritt an
   - Dauer: **1-3 Minuten**
   - Sie sehen:
     * ✅ Building...
     * ✅ Deploying...
     * ✅ Success!

3. **Fertig!**
   - Nach erfolgreichem Deployment sehen Sie:
     * 🎉 **Congratulations!**
     * Ihre Website-URL
     * Screenshot-Preview

---

## Schritt 3: Website testen (1 Minute)

### Preview-URL öffnen

Nach dem Deployment sehen Sie:

```
https://senec-design-xxxx.vercel.app
```

**So öffnen Sie die Website:**

1. **URL kopieren:**
   - Klicken Sie auf die URL
   - ODER klicken Sie auf **"Visit"**

2. **Website testen:**
   - ✅ Homepage lädt?
   - ✅ Navigation funktioniert?
   - ✅ Solarrechner funktioniert?
   - ✅ Bilder werden angezeigt?
   - ✅ Standort-Seiten erreichbar?

3. **Performance prüfen:**
   - Website sollte **extrem schnell** laden
   - Unter 1 Sekunde Ladezeit ✅

### Was Sie jetzt haben

✅ Live-Website auf Vercel  
✅ Automatische HTTPS (SSL-Zertifikat)  
✅ Globales CDN (schnell weltweit)  
✅ Automatische Deployments bei Git-Push  
✅ Preview-URL: `senec-design-xxxx.vercel.app`

---

## Schritt 4: Custom Domain verbinden (OPTIONAL - 15 Minuten)

**Wenn Sie leipzig-photovoltaik.de verbinden möchten:**

### Domain zu Vercel hinzufügen

1. **Project Settings öffnen:**
   - Klicken Sie auf **"Settings"** (oben)

2. **Domains öffnen:**
   - Linke Seitenleiste: **"Domains"**

3. **Domain hinzufügen:**
   - Geben Sie ein: `leipzig-photovoltaik.de`
   - Klicken Sie auf **"Add"**

4. **DNS-Konfiguration:**
   - Vercel zeigt Ihnen die benötigten DNS-Einträge
   - Folgen Sie der Anleitung in **DNS-KONFIGURATION.md**

### DNS-Einträge (Kurzversion)

**Bei Ihrem Domain-Anbieter (z.B. 1&1, Strato, GoDaddy):**

1. **A-Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600
   ```

2. **CNAME-Record:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Warten:**
   - DNS-Propagation: 15 Minuten bis 24 Stunden
   - Meist: 15-60 Minuten

4. **SSL-Zertifikat:**
   - Vercel erstellt automatisch SSL-Zertifikat
   - Nach DNS-Propagation: HTTPS automatisch aktiv ✅

---

## Automatische Deployments

**Ab jetzt:** Jeder Git-Push deployed automatisch!

### Workflow

1. **Änderungen machen:**
   - Bearbeiten Sie Dateien lokal

2. **Committen:**
   ```bash
   git add .
   git commit -m "Beschreibung der Änderung"
   ```

3. **Pushen:**
   ```bash
   git push
   ```

4. **Automatisches Deployment:**
   - Vercel erkennt Push automatisch
   - Baut neue Version
   - Deployed in 2-3 Minuten
   - Website wird aktualisiert ✅

### Preview-Deployments

**Jeder Branch bekommt eigene Preview-URL!**

- `main` Branch → Produktions-URL
- Andere Branches → Preview-URLs
- Perfekt zum Testen vor Live-Schaltung

---

## Vercel-Dashboard-Übersicht

### Was Sie im Dashboard sehen

1. **Deployments:**
   - Liste aller Deployments
   - Status: Success / Building / Failed
   - Deployment-Zeit
   - Commit-Message

2. **Analytics:**
   - Besucher-Statistiken
   - Ladezeiten
   - Geografische Verteilung

3. **Settings:**
   - Domains
   - Environment Variables
   - Build & Development Settings

4. **Logs:**
   - Build-Logs
   - Function-Logs
   - Fehler-Logs

---

## Häufige Probleme & Lösungen

### Problem: "Repository not found"

**Ursache:** Vercel hat keinen Zugriff auf Ihr Repository

**Lösung:**
1. Gehen Sie zu: https://github.com/settings/installations
2. Klicken Sie auf **"Vercel"**
3. Wählen Sie **"All repositories"** ODER
4. Fügen Sie `senec-design` hinzu
5. Klicken Sie auf **"Save"**

### Problem: "Build failed"

**Ursache:** Build-Fehler im Code

**Lösung:**
1. Klicken Sie auf das fehlgeschlagene Deployment
2. Lesen Sie die Build-Logs
3. Suchen Sie nach Fehlermeldungen
4. Fixen Sie den Fehler lokal
5. Pushen Sie erneut

### Problem: "Domain not verified"

**Ursache:** DNS-Einträge noch nicht propagiert

**Lösung:**
1. Warten Sie 15-60 Minuten
2. Prüfen Sie DNS mit: https://dnschecker.org
3. Wenn nach 24h nicht funktioniert: DNS-Einträge prüfen

### Problem: "SSL Certificate pending"

**Ursache:** DNS noch nicht vollständig propagiert

**Lösung:**
- Warten Sie 15-60 Minuten
- Vercel erstellt SSL automatisch nach DNS-Propagation

---

## Performance-Optimierung

### Automatisch aktiv

✅ **Globales CDN** - Website wird weltweit gecacht  
✅ **Brotli-Kompression** - Kleinere Dateien  
✅ **HTTP/2** - Schnellere Verbindungen  
✅ **Image Optimization** - Automatische Bildoptimierung  
✅ **Edge Caching** - Millisekunden-Ladezeiten

### Erwartete PageSpeed-Scores

- **Mobile:** 90-95
- **Desktop:** 95-100

**Nach WebP-Optimierung (bereits gemacht):**
- **Mobile:** 95-100
- **Desktop:** 100

---

## Kosten

### Free Plan (Ihr aktueller Plan)

✅ **100 GB Bandwidth** pro Monat  
✅ **Unlimited Deployments**  
✅ **Unlimited Domains**  
✅ **Automatic HTTPS**  
✅ **Global CDN**  
✅ **Analytics (Basic)**

**Für Ihre Website:** Völlig ausreichend! ✅

**Kosten:** **0€ / Monat**

### Wann upgraden?

Nur wenn Sie:
- Mehr als 100 GB Traffic/Monat haben
- Advanced Analytics brauchen
- Prioritären Support wollen

**Für Start:** Free Plan ist perfekt! ✅

---

## Zusammenfassung

**Was Sie geschafft haben:**

✅ Vercel-Account erstellt  
✅ GitHub-Repository importiert  
✅ Website deployed  
✅ Live-URL erhalten  
✅ Automatische Deployments aktiviert

**Zeitaufwand:** 3 Minuten

**Ihre Website ist jetzt live!** 🎉

---

## Nächste Schritte

1. **Custom Domain verbinden** (Optional)
   - Folgen Sie Schritt 4 oben
   - Oder: DNS-KONFIGURATION.md

2. **PageSpeed testen:**
   - Gehen Sie zu: https://pagespeed.web.dev
   - Geben Sie Ihre Vercel-URL ein
   - Erwarteter Score: 95-100 ✅

3. **Google Search Console:**
   - Melden Sie Website an
   - Reichen Sie Sitemap ein
   - Starten Sie SEO-Tracking

4. **Google My Business:**
   - Folgen Sie GOOGLE-MY-BUSINESS-SETUP.md
   - Erstellen Sie Standort-Profile
   - Sammeln Sie Bewertungen

---

## Support

**Vercel-Dokumentation:**
- https://vercel.com/docs

**Vercel-Support:**
- https://vercel.com/support

**Community:**
- https://github.com/vercel/vercel/discussions

**Bei Problemen:**
- Senden Sie mir einen Screenshot
- Ich helfe Ihnen weiter!

---

**Viel Erfolg mit Ihrer Live-Website! 🚀**

*Ihre Photovoltaik-Website ist jetzt online und bereit, Kunden zu gewinnen!*
