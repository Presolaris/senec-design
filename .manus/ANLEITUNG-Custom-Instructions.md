# 📖 Anleitung: Custom Instructions in Manus hinterlegen

**Für Anfänger - Schritt für Schritt**

Letzte Aktualisierung: 30. Januar 2026

---

## 🎯 Was sind Custom Instructions?

Custom Instructions sind **permanente Anweisungen**, die Sie in Manus hinterlegen können. Diese Anweisungen werden bei **jedem neuen Task automatisch aktiviert** und helfen Manus dabei:

✅ Projekt-Struktur zu verstehen (todo.md, knowledge-base.md)  
✅ Bereits erledigte Aufgaben nicht zu wiederholen  
✅ Als Experte im jeweiligen Fachgebiet zu agieren  
✅ Lösungen zu dokumentieren und wiederzuverwenden  
✅ Aus Fehlern zu lernen und Zeit zu sparen  

---

## 📋 Schritt-für-Schritt-Anleitung

### Schritt 1: Manus öffnen

1. Öffnen Sie Ihren **Webbrowser** (Chrome, Firefox, Safari, etc.)
2. Gehen Sie zu **https://manus.im**
3. Melden Sie sich mit Ihren **Zugangsdaten** an

**📸 Screenshot-Platzhalter:** *Manus Login-Seite*

---

### Schritt 2: Einstellungen öffnen

1. Klicken Sie oben rechts auf Ihr **Profilbild** oder **Avatar**
2. Im Dropdown-Menü erscheinen mehrere Optionen
3. Klicken Sie auf **"Einstellungen"** oder **"Settings"**

**📸 Screenshot-Platzhalter:** *Dropdown-Menü mit Einstellungen-Option markiert*

> **💡 Tipp:** Das Einstellungen-Symbol sieht oft aus wie ein **Zahnrad** ⚙️

---

### Schritt 3: Custom Instructions finden

1. In den Einstellungen sehen Sie eine **Seitenleiste** mit verschiedenen Kategorien
2. Suchen Sie nach einem der folgenden Einträge:
   - **"Custom Instructions"**
   - **"System Prompt"**
   - **"Anweisungen"**
   - **"Personalisierung"**
3. Klicken Sie auf diesen Eintrag

**📸 Screenshot-Platzhalter:** *Einstellungen-Seitenleiste mit Custom Instructions markiert*

> **💡 Tipp:** Falls Sie den Eintrag nicht finden, nutzen Sie die **Suchfunktion** in den Einstellungen (oft oben rechts)

---

### Schritt 4: Prompt-Text vorbereiten

1. Öffnen Sie die Datei **`custom-instructions-prompt-universal.md`**
2. Diese Datei befindet sich in Ihrem Projekt unter:
   ```
   /home/ubuntu/senec-design/.manus/custom-instructions-prompt-universal.md
   ```
3. Scrollen Sie bis zur Überschrift **"Projekt-Management-Protokoll"**
4. Markieren Sie **den gesamten Text** von dort bis zum Ende des Protokolls
5. Kopieren Sie den markierten Text mit **Strg+C** (Windows/Linux) oder **Cmd+C** (Mac)

**📸 Screenshot-Platzhalter:** *Geöffnete Datei mit markiertem Prompt-Text*

> **💡 Tipp:** Der zu kopierende Text beginnt mit "## Projekt-Management-Protokoll" und endet mit "### Effizienz & Zeitersparnis:"

---

### Schritt 5: Prompt einfügen

1. Gehen Sie zurück zu den **Manus Einstellungen**
2. Im Bereich **"Custom Instructions"** sehen Sie ein **großes Textfeld**
3. Klicken Sie in das Textfeld
4. **Löschen Sie** eventuell vorhandenen alten Text (falls vorhanden)
5. Fügen Sie den kopierten Text ein mit **Strg+V** (Windows/Linux) oder **Cmd+V** (Mac)

**📸 Screenshot-Platzhalter:** *Textfeld mit eingefügtem Prompt*

> **⚠️ Wichtig:** Stellen Sie sicher, dass der **gesamte Text** korrekt eingefügt wurde. Scrollen Sie im Textfeld nach unten um zu prüfen, ob alles da ist.

---

### Schritt 6: Einstellungen speichern

1. Scrollen Sie nach unten bis zum Ende des Textfelds
2. Klicken Sie auf den Button **"Speichern"** oder **"Save"**
3. Eine **Bestätigungsmeldung** sollte erscheinen (z.B. "Einstellungen gespeichert")

**📸 Screenshot-Platzhalter:** *Speichern-Button und Bestätigungsmeldung*

> **💡 Tipp:** Falls kein Speichern-Button sichtbar ist, speichern manche Systeme automatisch. Schließen Sie dann einfach die Einstellungen.

---

### Schritt 7: Funktionalität testen

1. **Schließen Sie** die Einstellungen
2. **Starten Sie einen neuen Task** in Manus
3. Stellen Sie eine **Testfrage**, z.B.:
   ```
   "Lies die todo.md und sage mir welche Tasks bereits erledigt sind"
   ```
4. Wenn Manus die todo.md liest und antwortet, **funktioniert der Prompt!** ✅

**📸 Screenshot-Platzhalter:** *Neuer Task mit Testfrage und erfolgreicher Antwort*

---

## ✅ Checkliste: Ist alles richtig eingerichtet?

Gehen Sie diese Punkte durch um sicherzustellen, dass alles funktioniert:

- [ ] Custom Instructions in Manus Einstellungen geöffnet
- [ ] Kompletten Prompt-Text aus `custom-instructions-prompt-universal.md` kopiert
- [ ] Text vollständig in das Textfeld eingefügt
- [ ] Einstellungen gespeichert
- [ ] Neuen Task gestartet und Funktionalität getestet
- [ ] Manus liest todo.md und knowledge-base.md automatisch

---

## 🔧 Problemlösung

### Problem 1: "Ich finde Custom Instructions nicht"

**Lösung:**
- Suchen Sie nach alternativen Begriffen: "System Prompt", "Anweisungen", "Personalisierung"
- Nutzen Sie die Suchfunktion in den Einstellungen
- Prüfen Sie ob Sie die **neueste Version** von Manus verwenden
- Kontaktieren Sie den Manus-Support unter https://help.manus.im

### Problem 2: "Der Text wird nicht vollständig eingefügt"

**Lösung:**
- Kopieren Sie den Text in **kleineren Abschnitten**
- Prüfen Sie ob es eine **Zeichenbegrenzung** gibt
- Versuchen Sie einen anderen **Browser** (Chrome, Firefox)
- Speichern Sie nach jedem eingefügten Abschnitt

### Problem 3: "Manus ignoriert den Prompt"

**Lösung:**
- Starten Sie einen **komplett neuen Task** (nicht im alten Task fortfahren)
- Prüfen Sie ob der Prompt wirklich **gespeichert** wurde (Einstellungen erneut öffnen)
- Loggen Sie sich **aus und wieder ein**
- Leeren Sie den **Browser-Cache**

### Problem 4: "Manus liest todo.md nicht automatisch"

**Lösung:**
- Prüfen Sie ob `todo.md` im **Projekt-Hauptverzeichnis** liegt
- Stellen Sie sicher dass der Prompt **korrekt** eingefügt wurde
- Fragen Sie explizit: "Lies die todo.md und zeige mir den Inhalt"
- Falls es nicht funktioniert, erwähnen Sie es in der Aufgabenstellung

---

## 📚 Weiterführende Informationen

### Was passiert nach der Einrichtung?

Ab sofort wird Manus bei **jedem neuen Task**:

1. ✅ Automatisch nach `todo.md` im Projektverzeichnis suchen
2. ✅ Diese Datei lesen und bereits erledigte Tasks identifizieren
3. ✅ Keine Vorschläge für bereits erledigte Aufgaben machen
4. ✅ Die `knowledge-base.md` nutzen um Zeit zu sparen
5. ✅ Als Experte im jeweiligen Fachgebiet agieren
6. ✅ Neue Erkenntnisse dokumentieren

### Kann ich den Prompt später ändern?

**Ja!** Sie können den Prompt jederzeit anpassen:

1. Gehen Sie zurück in die **Manus Einstellungen**
2. Öffnen Sie **Custom Instructions**
3. Bearbeiten Sie den Text
4. Speichern Sie die Änderungen

Die Änderungen werden ab dem **nächsten neuen Task** aktiv.

### Gilt der Prompt für alle Projekte?

**Ja!** Der Prompt ist **projektübergreifend** aktiv. Er funktioniert für:

- 🌐 Web-Projekte
- 📊 Data Analysis
- 🤖 Automation
- 📝 Content-Erstellung
- 🔧 Alle anderen Projekttypen

Manus erkennt automatisch den Projekttyp und passt sich an.

---

## 🎉 Geschafft!

Sie haben erfolgreich Custom Instructions in Manus hinterlegt!

**Ihre Vorteile:**
- ⏱️ **Zeitersparnis:** Keine Wiederholungen bereits erledigter Aufgaben
- 📚 **Wissensdatenbank:** Lösungen werden dokumentiert und wiederverwendet
- 🎯 **Fokus:** Manus konzentriert sich auf offene Tasks
- 🚀 **Effizienz:** Experten-Verhalten in allen Fachgebieten
- 📖 **Lernen:** Aus Fehlern lernen und dokumentieren

---

## 📞 Hilfe & Support

Bei Fragen oder Problemen:

- 📧 **Manus Support:** https://help.manus.im
- 📖 **Dokumentation:** https://docs.manus.im
- 💬 **Community:** https://community.manus.im

---

**Viel Erfolg mit Ihren Projekten! 🚀**
