# GitHub-Repository erstellen - Anfänger-Anleitung

## 📋 Was Sie brauchen

- ✅ Einen Computer mit Internetverbindung
- ✅ 10 Minuten Zeit
- ✅ Eine E-Mail-Adresse

**Keine Vorkenntnisse nötig!** Diese Anleitung erklärt jeden Schritt.

---

## Teil 1: GitHub-Account erstellen (falls noch nicht vorhanden)

### Schritt 1: GitHub.com öffnen

1. Öffnen Sie Ihren Browser (Chrome, Firefox, Safari, Edge)
2. Geben Sie in die Adresszeile ein: **github.com**
3. Drücken Sie **Enter**

### Schritt 2: Account erstellen

**Wenn Sie bereits einen GitHub-Account haben:** Springen Sie zu Teil 2!

**Wenn Sie noch keinen Account haben:**

1. Klicken Sie oben rechts auf **"Sign up"** (Anmelden)

2. **E-Mail eingeben:**
   - Geben Sie Ihre E-Mail-Adresse ein
   - Klicken Sie auf **"Continue"**

3. **Passwort erstellen:**
   - Mindestens 15 Zeichen ODER
   - Mindestens 8 Zeichen mit Zahl und Kleinbuchstabe
   - Beispiel: `MeinSicheres2024!`
   - Klicken Sie auf **"Continue"**

4. **Benutzername wählen:**
   - Wählen Sie einen eindeutigen Namen
   - Beispiel: `senec-design-leipzig` oder `ihr-name-pv`
   - Klicken Sie auf **"Continue"**

5. **E-Mail-Benachrichtigungen:**
   - Wählen Sie **"y"** (ja) oder **"n"** (nein)
   - Klicken Sie auf **"Continue"**

6. **Verifizierung:**
   - Lösen Sie das Puzzle (z.B. "Wählen Sie alle Bilder mit Autos")
   - Klicken Sie auf **"Create account"**

7. **E-Mail bestätigen:**
   - Öffnen Sie Ihr E-Mail-Postfach
   - Suchen Sie E-Mail von GitHub
   - Klicken Sie auf den Bestätigungslink
   - **Fertig!** Sie haben jetzt einen GitHub-Account ✅

---

## Teil 2: GitHub-Repository erstellen

### Schritt 1: Bei GitHub anmelden

1. Gehen Sie zu **github.com**
2. Klicken Sie oben rechts auf **"Sign in"**
3. Geben Sie Ihre E-Mail und Passwort ein
4. Klicken Sie auf **"Sign in"**

### Schritt 2: Neues Repository erstellen

1. **Plus-Symbol klicken:**
   - Oben rechts sehen Sie ein **"+"** Symbol
   - Klicken Sie darauf
   - Wählen Sie **"New repository"**

2. **Repository-Name eingeben:**
   ```
   senec-design
   ```
   - **Wichtig:** Genau so schreiben (ohne Leerzeichen!)
   - Kleinbuchstaben, Bindestrich ist OK

3. **Beschreibung hinzufügen (optional):**
   ```
   SENEC-Design Photovoltaik Website für Leipzig und Umgebung
   ```

4. **Sichtbarkeit wählen:**
   - **Private** (empfohlen): Nur Sie können es sehen
   - **Public**: Jeder kann es sehen
   
   **Für Ihre Website:** Wählen Sie **Private**

5. **WICHTIG - Nichts ankreuzen!**
   - ❌ **NICHT** ankreuzen: "Add a README file"
   - ❌ **NICHT** ankreuzen: "Add .gitignore"
   - ❌ **NICHT** ankreuzen: "Choose a license"
   
   **Warum?** Ihr Projekt ist bereits vorbereitet!

6. **Repository erstellen:**
   - Klicken Sie auf den grünen Button **"Create repository"**

### Schritt 3: Repository-URL kopieren

Nach dem Erstellen sehen Sie eine Seite mit Anleitungen.

**Wichtig:** Kopieren Sie die URL oben!

Sie sieht so aus:
```
https://github.com/IHR-BENUTZERNAME/senec-design.git
```

**So kopieren Sie:**
1. Klicken Sie auf das **Clipboard-Symbol** (📋) neben der URL
2. ODER: Markieren Sie die URL mit der Maus
3. Drücken Sie **Strg+C** (Windows) oder **Cmd+C** (Mac)

**Speichern Sie diese URL!** Sie brauchen sie gleich.

---

## Teil 3: Personal Access Token erstellen

**Was ist ein Personal Access Token?**
- Ein "Passwort" speziell für Programme (nicht Ihr GitHub-Passwort!)
- Sicherer als Ihr normales Passwort
- Kann jederzeit gelöscht werden

### Schritt 1: Settings öffnen

1. Klicken Sie oben rechts auf Ihr **Profilbild**
2. Wählen Sie **"Settings"** (Einstellungen)

### Schritt 2: Developer Settings öffnen

1. Scrollen Sie ganz nach unten in der linken Seitenleiste
2. Klicken Sie auf **"Developer settings"**

### Schritt 3: Personal Access Token erstellen

1. **Tokens (classic) wählen:**
   - Linke Seitenleiste: **"Personal access tokens"**
   - Klicken Sie auf **"Tokens (classic)"**

2. **Neues Token erstellen:**
   - Klicken Sie auf **"Generate new token"**
   - Wählen Sie **"Generate new token (classic)"**

3. **Passwort eingeben:**
   - GitHub fragt nach Ihrem Passwort
   - Geben Sie es ein
   - Klicken Sie auf **"Confirm"**

### Schritt 4: Token konfigurieren

1. **Note (Name):**
   ```
   Vercel Deployment SENEC-Design
   ```
   - Das ist nur eine Beschreibung für Sie

2. **Expiration (Ablaufdatum):**
   - Wählen Sie **"90 days"** (90 Tage)
   - Nach 90 Tagen müssen Sie neues Token erstellen

3. **Scopes (Berechtigungen):**
   - **Wichtig:** Kreuzen Sie NUR **"repo"** an!
   - Klicken Sie auf das Kästchen neben **"repo"**
   - Alle Unter-Punkte werden automatisch angekreuzt ✅

4. **Token erstellen:**
   - Scrollen Sie nach unten
   - Klicken Sie auf grünen Button **"Generate token"**

### Schritt 5: Token kopieren und speichern

**⚠️ SEHR WICHTIG:**

Nach dem Erstellen sehen Sie Ihr Token:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Dieses Token wird NUR EINMAL angezeigt!**

**So speichern Sie es sicher:**

1. **Kopieren:**
   - Klicken Sie auf das **Clipboard-Symbol** (📋)
   - ODER markieren Sie und drücken **Strg+C** / **Cmd+C**

2. **Speichern:**
   - Öffnen Sie **Notepad** (Windows) oder **TextEdit** (Mac)
   - Fügen Sie das Token ein (**Strg+V** / **Cmd+V**)
   - Speichern Sie die Datei als **"github-token.txt"**
   - Speichern Sie sie an einem sicheren Ort!

**Wenn Sie das Token verlieren:**
- Kein Problem! Erstellen Sie einfach ein neues
- Gehen Sie zurück zu "Developer settings" → "Tokens (classic)"
- Löschen Sie das alte Token
- Erstellen Sie ein neues

---

## Teil 4: Code zu GitHub pushen

**Jetzt kommt der spannende Teil!** Sie laden Ihren Code zu GitHub hoch.

### Was Sie jetzt haben sollten:

✅ GitHub-Repository erstellt  
✅ Repository-URL kopiert  
✅ Personal Access Token erstellt und gespeichert

### Option A: Manus führt Push automatisch durch

**Wenn Sie mir das Token geben, kann ich den Push für Sie durchführen!**

Senden Sie mir:
```
Repository-URL: https://github.com/IHR-BENUTZERNAME/senec-design.git
Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Ich führe dann automatisch aus:
1. `git remote add origin [URL]`
2. `git push -u origin main`

**Fertig in 30 Sekunden!** ✅

### Option B: Sie führen Push selbst durch (Terminal)

**Wenn Sie es selbst machen möchten:**

1. **Terminal/Kommandozeile öffnen:**
   - **Windows:** Drücken Sie **Win+R**, tippen Sie `cmd`, drücken Sie **Enter**
   - **Mac:** Drücken Sie **Cmd+Space**, tippen Sie `Terminal`, drücken Sie **Enter**

2. **Zum Projekt navigieren:**
   ```bash
   cd /pfad/zum/senec-design
   ```
   
   **Beispiel Windows:**
   ```bash
   cd C:\Users\IhrName\senec-design
   ```
   
   **Beispiel Mac:**
   ```bash
   cd /Users/IhrName/senec-design
   ```

3. **Remote hinzufügen:**
   ```bash
   git remote add origin https://github.com/IHR-BENUTZERNAME/senec-design.git
   ```
   
   **Ersetzen Sie `IHR-BENUTZERNAME` mit Ihrem GitHub-Namen!**

4. **Code pushen:**
   ```bash
   git push -u origin main
   ```

5. **Login-Daten eingeben:**
   - **Username:** Ihr GitHub-Benutzername
   - **Password:** **IHR PERSONAL ACCESS TOKEN** (nicht Ihr Passwort!)
   
   **Wichtig:** Fügen Sie das Token aus Ihrer gespeicherten Datei ein!

6. **Warten:**
   - Der Upload dauert 10-30 Sekunden
   - Sie sehen Fortschrittsanzeige
   - Am Ende: **"Branch 'main' set up to track remote branch 'main'"**

**Fertig!** ✅ Ihr Code ist jetzt auf GitHub!

---

## Teil 5: Überprüfen

### Schritt 1: GitHub-Repository öffnen

1. Gehen Sie zu:
   ```
   https://github.com/IHR-BENUTZERNAME/senec-design
   ```

2. **Was Sie sehen sollten:**
   - ✅ Viele Dateien und Ordner
   - ✅ `README-DEPLOYMENT.md` sichtbar
   - ✅ `package.json` vorhanden
   - ✅ `public/` Ordner
   - ✅ `src/` Ordner
   - ✅ Oben links: "main" Branch
   - ✅ Rechts: "X commits" (mehrere Commits)

### Schritt 2: Commit-Historie prüfen

1. Klicken Sie oben links auf **"X commits"**
2. Sie sollten sehen:
   ```
   ✅ Vite allowedHosts-Fehler behoben
   ✅ Git-Repository für GitHub-Push vorbereitet
   ✅ Komplettes Vercel-Deployment-Paket fertiggestellt
   ✅ Projekt vollständig für Vercel-Deployment vorbereitet
   ... und mehr
   ```

**Wenn Sie das alles sehen: Perfekt!** ✅

---

## Nächster Schritt: Vercel-Deployment

**Jetzt ist Ihr Code auf GitHub!** 🎉

**Als nächstes:**
1. Gehen Sie zu **vercel.com**
2. Melden Sie sich an (mit GitHub-Account)
3. Klicken Sie auf **"Add New"** → **"Project"**
4. Wählen Sie **"senec-design"**
5. Klicken Sie auf **"Deploy"**

**In 3 Minuten ist Ihre Website live!** 🚀

---

## Häufige Probleme & Lösungen

### Problem: "Repository name already exists"

**Lösung:**
- Wählen Sie einen anderen Namen
- Beispiel: `senec-design-2024` oder `senec-design-website`

### Problem: "Authentication failed"

**Ursache:** Sie haben Ihr Passwort statt Token verwendet

**Lösung:**
- Verwenden Sie Ihr **Personal Access Token** als Passwort
- Kopieren Sie es aus Ihrer gespeicherten Datei

### Problem: "Permission denied"

**Ursache:** Token hat nicht die richtigen Berechtigungen

**Lösung:**
1. Gehen Sie zu GitHub → Settings → Developer settings
2. Löschen Sie das alte Token
3. Erstellen Sie neues Token mit **"repo"** Scope

### Problem: "remote origin already exists"

**Lösung:**
```bash
git remote remove origin
git remote add origin https://github.com/IHR-BENUTZERNAME/senec-design.git
```

### Problem: Token verloren

**Lösung:**
1. GitHub → Settings → Developer settings → Tokens (classic)
2. Löschen Sie altes Token
3. Erstellen Sie neues Token (siehe Teil 3)

---

## Zusammenfassung

**Was Sie geschafft haben:**

✅ GitHub-Account erstellt  
✅ GitHub-Repository erstellt  
✅ Personal Access Token erstellt  
✅ Code zu GitHub gepusht  
✅ Repository verifiziert

**Zeitaufwand:** 10 Minuten

**Nächster Schritt:** Vercel-Deployment (3 Minuten)

---

## Support

**GitHub-Hilfe:**
- https://docs.github.com/de

**Video-Tutorials:**
- YouTube: "GitHub für Anfänger Deutsch"
- YouTube: "GitHub Repository erstellen"

**Bei Problemen:**
- Senden Sie mir einen Screenshot
- Ich helfe Ihnen weiter!

---

**Viel Erfolg! 🚀**

*Sie schaffen das!*
