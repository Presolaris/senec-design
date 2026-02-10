# Website bearbeiten: Code-Speicherort & Tools

## 📁 Wo liegt der Code deiner Website?

### **Haupt-Speicherorte:**

1. **GitHub Repository (Online, Haupt-Quelle)**
   - URL: https://github.com/Janos-Balogh/senec-design
   - Zugriff: Über deinen GitHub-Account
   - **Das ist die Haupt-Quelle** - hier liegt der offizielle Code

2. **Vercel (Live-Website)**
   - URL: https://leipzig-photovoltaik.de
   - Deployment: Automatisch von GitHub
   - **Das ist die Live-Version** - was Besucher sehen

3. **Manus Sandbox (Temporär, nur während unserer Arbeit)**
   - Pfad: `/home/ubuntu/senec-design`
   - **Nur für Entwicklung** - wird nach Task gelöscht

---

## 🛠️ Mit welchen Tools kannst du die Website bearbeiten?

### **Option 1: Direkt über GitHub (Einfach, für kleine Änderungen)**

**Geeignet für:**
- Texte ändern
- Bilder austauschen
- Kleine Korrekturen

**Anleitung:**

1. **Gehe zu:** https://github.com/Janos-Balogh/senec-design
2. **Navigiere zur Datei:**
   - Beispiel: `src/pages/index.astro` (Startseite)
   - Beispiel: `src/pages/solaranlage-leipzig.astro` (Solaranlage Leipzig Seite)
3. **Klicke auf:** Stift-Symbol (✏️ "Edit this file")
4. **Bearbeite** den Code direkt im Browser
5. **Klicke auf:** "Commit changes" (grüner Button)
6. **Warte 2-3 Minuten** → Vercel deployed automatisch

**Vorteile:**
- ✅ Keine Software-Installation nötig
- ✅ Funktioniert im Browser
- ✅ Automatisches Deployment

**Nachteile:**
- ❌ Keine Vorschau vor dem Speichern
- ❌ Nur für einfache Änderungen geeignet

---

### **Option 2: Visual Studio Code (Empfohlen, für größere Änderungen)**

**Geeignet für:**
- Mehrere Dateien gleichzeitig bearbeiten
- Neue Seiten erstellen
- Komplexe Änderungen

**Anleitung:**

#### **Schritt 1: Software installieren (einmalig)**

1. **Visual Studio Code herunterladen:**
   - URL: https://code.visualstudio.com/
   - Klicke auf "Download for Windows/Mac/Linux"
   - Installiere die Software

2. **Git installieren:**
   - URL: https://git-scm.com/downloads
   - Klicke auf "Download for Windows/Mac/Linux"
   - Installiere die Software

3. **Node.js installieren:**
   - URL: https://nodejs.org/
   - Klicke auf "LTS" Version (aktuell 22.x)
   - Installiere die Software

#### **Schritt 2: Projekt herunterladen (einmalig)**

1. **Öffne Visual Studio Code**

2. **Öffne Terminal:**
   - Menü: Terminal → New Terminal
   - Oder: `Strg + Ö` (Windows) / `Cmd + Ö` (Mac)

3. **Navigiere zu deinem Arbeitsverzeichnis:**
   ```bash
   cd C:\Users\DEIN-NAME\Projekte
   ```

4. **Klone das Repository:**
   ```bash
   git clone https://github.com/Janos-Balogh/senec-design.git
   ```

5. **Öffne das Projekt:**
   ```bash
   cd senec-design
   code .
   ```

#### **Schritt 3: Abhängigkeiten installieren (einmalig)**

1. **Im Terminal (in VS Code):**
   ```bash
   npm install
   ```

2. **Warte 1-2 Minuten** bis alle Pakete installiert sind

#### **Schritt 4: Lokalen Server starten**

1. **Im Terminal:**
   ```bash
   npm run dev
   ```

2. **Öffne Browser:**
   - URL: http://localhost:4321
   - **Jetzt siehst du deine Website lokal!**

3. **Änderungen testen:**
   - Bearbeite eine Datei in VS Code
   - Speichere mit `Strg + S`
   - Browser aktualisiert automatisch

#### **Schritt 5: Änderungen hochladen**

1. **Im Terminal:**
   ```bash
   git add .
   git commit -m "Beschreibung der Änderung"
   git push
   ```

2. **Warte 2-3 Minuten** → Vercel deployed automatisch

**Vorteile:**
- ✅ Lokale Vorschau vor dem Hochladen
- ✅ Mehrere Dateien gleichzeitig bearbeiten
- ✅ Code-Vervollständigung & Fehlerprüfung
- ✅ Professioneller Workflow

**Nachteile:**
- ❌ Software-Installation nötig
- ❌ Etwas komplexer für Anfänger

---

### **Option 3: Über Manus (Aktuell, während unserer Zusammenarbeit)**

**Geeignet für:**
- Komplexe Änderungen
- Neue Features
- SEO-Optimierungen

**Wie es funktioniert:**

1. **Du sagst mir, was du ändern möchtest**
2. **Ich bearbeite den Code** in `/home/ubuntu/senec-design`
3. **Ich teste die Änderungen** mit `npm run build`
4. **Ich pushe zu GitHub** mit `git push`
5. **Vercel deployed automatisch** nach 2-3 Minuten

**Vorteile:**
- ✅ Keine technischen Kenntnisse nötig
- ✅ Ich teste alles vor dem Deployment
- ✅ Ich erkläre dir, was ich geändert habe

**Nachteile:**
- ❌ Nur während unserer Chat-Sessions verfügbar
- ❌ Du kannst nicht selbstständig Änderungen vornehmen

---

## 📂 Projekt-Struktur (Wichtigste Dateien)

```
senec-design/
├── src/
│   ├── pages/                    ← Hier liegen alle Seiten
│   │   ├── index.astro          ← Startseite
│   │   ├── solaranlage-leipzig.astro
│   │   ├── gewerbe-photovoltaik-leipzig.astro
│   │   ├── privat.astro
│   │   ├── stromspeicher.astro
│   │   ├── wallbox.astro
│   │   └── blog/                ← Blog-Artikel
│   │       ├── photovoltaik-kosten-2026.astro
│   │       └── ...
│   ├── components/              ← Wiederverwendbare Komponenten
│   │   ├── Header.astro         ← Navigation
│   │   ├── Footer.astro         ← Fußzeile
│   │   └── ...
│   └── layouts/                 ← Layout-Vorlagen
│       └── Layout.astro         ← Haupt-Layout
├── public/                      ← Statische Dateien
│   ├── images/                  ← Alle Bilder
│   │   ├── solaranlage-leipzig-hero.webp
│   │   ├── gewerbe-hero.jpg
│   │   └── ...
│   └── favicon.ico
├── package.json                 ← Projekt-Konfiguration
└── astro.config.mjs            ← Astro-Konfiguration
```

### **Welche Datei bearbeiten für welche Änderung?**

| Was ändern? | Datei |
|-------------|-------|
| **Startseite Text** | `src/pages/index.astro` |
| **Solaranlage Leipzig Seite** | `src/pages/solaranlage-leipzig.astro` |
| **Gewerbe-Seite** | `src/pages/gewerbe-photovoltaik-leipzig.astro` |
| **Privat-Seite** | `src/pages/privat.astro` |
| **Navigation (Menü)** | `src/components/Header.astro` |
| **Fußzeile** | `src/components/Footer.astro` |
| **Logo** | `public/images/logo.svg` |
| **Hero-Bilder** | `public/images/*.webp` |
| **Blog-Artikel** | `src/pages/blog/*.astro` |

---

## 🎨 Häufige Änderungen (Copy & Paste Beispiele)

### **1. Text auf Startseite ändern**

**Datei:** `src/pages/index.astro`

**Suche nach:**
```html
<h1>Ihre Solaranlage in Leipzig</h1>
```

**Ändere zu:**
```html
<h1>Ihr neuer Text hier</h1>
```

---

### **2. Bild austauschen**

**Datei:** `src/pages/solaranlage-leipzig.astro`

**Suche nach:**
```html
<img src="/images/solaranlage-leipzig-hero.webp" alt="..." />
```

**Ändere zu:**
```html
<img src="/images/NEUES-BILD.webp" alt="..." />
```

**Wichtig:** Neues Bild in `public/images/` hochladen!

---

### **3. Telefonnummer ändern**

**Datei:** `src/components/Header.astro`

**Suche nach:**
```html
<a href="tel:034198990391">0341 98 99 03 91</a>
```

**Ändere zu:**
```html
<a href="tel:NEUE-NUMMER">NEUE NUMMER</a>
```

---

### **4. Farbe ändern**

**Datei:** `src/pages/index.astro` (oder andere Seite)

**Suche nach:**
```html
<div class="bg-primary-blue">
```

**Ändere zu:**
```html
<div class="bg-[#DEINE-FARBE]">
```

**Beispiel:** `bg-[#FF0000]` für Rot

---

## 🚀 Deployment-Workflow

### **Automatisches Deployment (Standard)**

1. **Änderung in GitHub pushen:**
   ```bash
   git add .
   git commit -m "Beschreibung"
   git push
   ```

2. **Vercel erkennt Änderung automatisch**

3. **Vercel baut die Website neu** (1-2 Minuten)

4. **Live auf leipzig-photovoltaik.de** (2-3 Minuten)

### **Manuelles Deployment (falls nötig)**

1. **Gehe zu:** https://vercel.com/dashboard
2. **Wähle:** senec-design Projekt
3. **Klicke:** "Redeploy" Button
4. **Warte 2-3 Minuten**

---

## 🔧 Nützliche Befehle

### **Lokale Entwicklung**

```bash
# Projekt starten (mit Live-Reload)
npm run dev

# Website bauen (Produktions-Version)
npm run build

# Produktions-Version lokal testen
npm run preview
```

### **Git-Befehle**

```bash
# Aktuelle Änderungen anzeigen
git status

# Änderungen speichern
git add .
git commit -m "Beschreibung der Änderung"

# Zu GitHub hochladen
git push

# Neueste Version herunterladen
git pull
```

---

## 📞 Hilfe & Support

### **Wenn etwas nicht funktioniert:**

1. **Fehler im Terminal lesen:**
   - Oft steht dort, was das Problem ist
   - Kopiere die Fehlermeldung und frage mich

2. **Änderungen rückgängig machen:**
   ```bash
   git reset --hard
   ```

3. **Neueste Version von GitHub holen:**
   ```bash
   git pull
   ```

4. **Lokalen Server neu starten:**
   - `Strg + C` (Server stoppen)
   - `npm run dev` (Server starten)

### **Fragen?**

- **Während unserer Chats:** Frag mich einfach!
- **GitHub Issues:** https://github.com/Janos-Balogh/senec-design/issues
- **Astro Dokumentation:** https://docs.astro.build/

---

## 🎯 Empfehlung für dich

**Für kleine Änderungen (Text, Bilder):**
→ **Option 1: Direkt über GitHub** (einfach, schnell)

**Für größere Projekte (neue Seiten, Features):**
→ **Option 3: Über Manus** (während unserer Chats)

**Wenn du selbstständig entwickeln möchtest:**
→ **Option 2: Visual Studio Code** (professionell, volle Kontrolle)

---

**Welche Option möchtest du nutzen? Ich helfe dir gerne beim Einrichten!**
