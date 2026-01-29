# GitHub-Push Anleitung - Sofort einsatzbereit

## Status: Git-Repository ist vorbereitet ✅

Das lokale Git-Repository wurde bereits initialisiert und committed:
- Commit: `8c28562a`
- Branch: `main`
- Alle Dateien sind bereit zum Push

**Sie müssen nur noch:**
1. GitHub-Repository erstellen (2 Minuten)
2. Code pushen (1 Minute)

---

## Schritt 1: GitHub-Repository erstellen (2 Min)

### 1.1 GitHub öffnen

1. Gehen Sie zu https://github.com
2. Melden Sie sich an (oder erstellen Sie Account)

### 1.2 Neues Repository erstellen

1. Klicken Sie auf **"+"** (oben rechts) → **"New repository"**

2. **Repository-Einstellungen:**
   ```
   Repository name: senec-design
   Description: SENEC-Design Photovoltaik Website - Leipzig, Dresden, Halle, Nordsachsen
   Visibility: Private (empfohlen) oder Public
   
   ❌ NICHT initialisieren mit:
   - README
   - .gitignore
   - License
   
   (Projekt ist bereits initialisiert!)
   ```

3. Klicken Sie auf **"Create repository"**

### 1.3 Repository-URL kopieren

GitHub zeigt jetzt Ihre Repository-URL:

```
https://github.com/IHR-USERNAME/senec-design.git
```

**Kopieren Sie diese URL!** Sie brauchen sie im nächsten Schritt.

---

## Schritt 2: Code zu GitHub pushen (1 Min)

### Option A: Mit HTTPS (einfacher, empfohlen)

**Öffnen Sie Terminal/Kommandozeile und führen Sie aus:**

```bash
# 1. Navigieren Sie zum Projekt-Ordner
cd /pfad/zum/senec-design

# 2. Remote hinzufügen (ersetzen Sie IHR-USERNAME)
git remote add origin https://github.com/IHR-USERNAME/senec-design.git

# 3. Code pushen
git push -u origin main
```

**GitHub fragt nach Login:**
- Username: Ihr GitHub-Username
- Password: **Personal Access Token** (nicht Ihr Passwort!)

**Personal Access Token erstellen:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Name: "Vercel Deployment"
4. Scopes: ✅ `repo` (alle)
5. "Generate token"
6. **Kopieren Sie Token sofort** (wird nur einmal angezeigt!)
7. Verwenden Sie Token als "Password" beim Push

### Option B: Mit SSH (fortgeschritten)

**Wenn Sie bereits SSH-Key haben:**

```bash
# 1. Navigieren Sie zum Projekt-Ordner
cd /pfad/zum/senec-design

# 2. Remote hinzufügen (ersetzen Sie IHR-USERNAME)
git remote add origin git@github.com:IHR-USERNAME/senec-design.git

# 3. Code pushen
git push -u origin main
```

**SSH-Key erstellen (falls noch nicht vorhanden):**

```bash
# SSH-Key generieren
ssh-keygen -t ed25519 -C "ihre-email@example.com"

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub

# Kopieren Sie den Output und fügen Sie ihn hinzu:
# GitHub → Settings → SSH and GPG keys → New SSH key
```

---

## Schritt 3: Push verifizieren

### 3.1 GitHub-Repository prüfen

1. Gehen Sie zu `https://github.com/IHR-USERNAME/senec-design`
2. Sie sollten sehen:
   - ✅ 20+ Dateien
   - ✅ `README-DEPLOYMENT.md` sichtbar
   - ✅ `package.json` vorhanden
   - ✅ `public/` Ordner mit Bildern
   - ✅ `src/` Ordner mit Seiten

### 3.2 Commit-Historie prüfen

Klicken Sie auf "X commits" (oben links):

```
✅ Vercel-Deployment vorbereitet: WebP-Bilder, Dokumentation, Git-Config
✅ Komplettes Vercel-Deployment-Paket fertiggestellt
✅ Projekt vollständig für Vercel-Deployment vorbereitet
✅ Astro auf 5.15.9 downgraded
✅ Von PNPM auf NPM konvertiert
```

**Wenn Sie alle Commits sehen: Push erfolgreich!** ✅

---

## Häufige Probleme & Lösungen

### Problem: "remote origin already exists"

**Lösung:**
```bash
# Remote entfernen
git remote remove origin

# Neu hinzufügen
git remote add origin https://github.com/IHR-USERNAME/senec-design.git
```

### Problem: "Authentication failed"

**Ursache:** Sie verwenden Ihr Passwort statt Personal Access Token

**Lösung:**
1. Erstellen Sie Personal Access Token (siehe oben)
2. Verwenden Sie Token als Passwort

### Problem: "Permission denied (publickey)"

**Ursache:** SSH-Key nicht konfiguriert

**Lösung:**
- Verwenden Sie HTTPS statt SSH (Option A)
- Oder konfigurieren Sie SSH-Key (siehe Option B)

### Problem: "Updates were rejected"

**Ursache:** Remote-Repository hat Änderungen

**Lösung:**
```bash
# Pull mit Rebase
git pull --rebase origin main

# Dann erneut pushen
git push -u origin main
```

---

## Nächster Schritt: Vercel-Import

**Nach erfolgreichem Push:**

1. Gehen Sie zu https://vercel.com
2. Klicken Sie auf "Add New" → "Project"
3. Wählen Sie "Import Git Repository"
4. Wählen Sie `senec-design`
5. Klicken Sie auf "Import"

**Vercel erkennt automatisch:**
- ✅ Framework: Astro
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**Keine manuelle Konfiguration nötig!**

6. Klicken Sie auf "Deploy"
7. Warten Sie 2-3 Minuten
8. **Website ist live!** 🎉

**Preview-URL:**
```
https://senec-design-xxx.vercel.app
```

---

## Zusammenfassung

**Was Sie tun müssen:**

1. ✅ GitHub-Repository erstellen (2 Min)
2. ✅ Code pushen mit HTTPS + Personal Access Token (1 Min)
3. ✅ Vercel-Import starten (siehe VERCEL-DEPLOYMENT.md)

**Zeitaufwand:** 3 Minuten

**Danach:**
- Website ist live auf Vercel
- Automatische Deployments bei jedem Git-Push
- Preview-Deployments für Branches

---

## Befehle zum Kopieren

**Komplett-Workflow (kopieren Sie alles):**

```bash
# Navigieren Sie zum Projekt
cd /pfad/zum/senec-design

# Remote hinzufügen (ersetzen Sie IHR-USERNAME!)
git remote add origin https://github.com/IHR-USERNAME/senec-design.git

# Code pushen
git push -u origin main

# Bei Login-Aufforderung:
# Username: IHR-GITHUB-USERNAME
# Password: IHR-PERSONAL-ACCESS-TOKEN
```

**Zukünftige Updates pushen:**

```bash
# Änderungen committen
git add .
git commit -m "Beschreibung der Änderung"

# Pushen (triggert automatisch Vercel-Deployment!)
git push
```

---

## Support

**GitHub-Hilfe:**
- https://docs.github.com/en/get-started/quickstart/create-a-repo
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

**Vercel-Hilfe:**
- https://vercel.com/docs/git

**Bei Problemen:**
- Prüfen Sie GitHub-Repository: Sind alle Dateien da?
- Prüfen Sie Personal Access Token: Richtige Scopes?
- Prüfen Sie Remote-URL: `git remote -v`

---

**Viel Erfolg! 🚀**

*Nächster Schritt: VERCEL-DEPLOYMENT.md*
