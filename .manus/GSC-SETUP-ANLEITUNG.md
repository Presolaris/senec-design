# 🔧 Google Search Console Setup-Anleitung

**Für:** leipzig-photovoltaik.de  
**Datum:** Februar 2026

---

## Was ist Google Search Console?

Google Search Console (GSC) ist ein **kostenloses Tool von Google**, das dir zeigt:
- Für welche Keywords deine Seite bei Google erscheint
- Wie oft deine Seite angezeigt wird (Impressionen)
- Wie oft darauf geklickt wird (Klicks)
- Auf welcher Position du im Durchschnitt stehst

---

## Schritt 1: Google Search Console öffnen

1. Gehe zu: **https://search.google.com/search-console**
2. Melde dich mit deinem Google-Konto an
3. Falls du noch kein Konto hast: Erstelle eines unter google.com

---

## Schritt 2: Property hinzufügen

1. Klicke auf **"Property hinzufügen"** (oben links)
2. Wähle **"URL-Präfix"** (einfacher)
3. Gib ein: `https://leipzig-photovoltaik.de`
4. Klicke **"Weiter"**

---

## Schritt 3: Inhaberschaft bestätigen

Google muss wissen, dass du der Besitzer der Website bist.

### Option A: HTML-Tag (Empfohlen)
1. Kopiere den Meta-Tag, den Google dir zeigt
2. Füge ihn in den `<head>` Bereich deiner Website ein
3. Klicke **"Bestätigen"**

### Option B: DNS-Eintrag
1. Kopiere den TXT-Eintrag
2. Füge ihn bei deinem Domain-Anbieter hinzu
3. Warte 24-48 Stunden
4. Klicke **"Bestätigen"**

---

## Schritt 4: Sitemap einreichen

1. Gehe zu **"Sitemaps"** (linkes Menü)
2. Gib ein: `sitemap-index.xml`
3. Klicke **"Senden"**

Die Sitemap hilft Google, alle deine Seiten zu finden.

---

## Schritt 5: Daten abrufen (nach 2-3 Tagen)

Nach der Einrichtung dauert es **2-3 Tage**, bis erste Daten erscheinen.

### Leistungsbericht ansehen:
1. Klicke auf **"Leistung"** (linkes Menü)
2. Du siehst: Klicks, Impressionen, CTR, Position
3. Klicke auf **"Suchanfragen"** für Keyword-Daten

### Daten exportieren:
1. Klicke auf **"Exportieren"** (oben rechts)
2. Wähle **"Google Tabellen"** oder **"CSV"**
3. Die Daten kannst du dann im SEO-Dashboard eintragen

---

## Automatische Integration (Fortgeschritten)

Für eine automatische Integration mit dem SEO-Dashboard benötigst du:

1. **Google Cloud Project** erstellen
2. **Search Console API** aktivieren
3. **Service Account** erstellen
4. **JSON-Key** herunterladen
5. **Key in Supabase** speichern

Diese Einrichtung ist komplex und erfordert technisches Wissen. Für den Anfang reicht die manuelle Übertragung der Daten.

---

## Tipps für die Nutzung

### Wöchentlich prüfen:
- Welche Keywords haben die meisten Impressionen?
- Welche Keywords haben eine schlechte CTR (unter 3%)?
- Gibt es neue Keywords, für die du rankst?

### Monatlich analysieren:
- Vergleiche mit dem Vormonat
- Identifiziere Trends (steigend/fallend)
- Finde Keywords mit Potenzial (hohe Impressionen, niedrige Position)

---

## Häufige Probleme

### "Keine Daten vorhanden"
- Warte 2-3 Tage nach der Einrichtung
- Prüfe ob die Inhaberschaft bestätigt ist
- Prüfe ob die Sitemap eingereicht wurde

### "Weniger Klicks als erwartet"
- Prüfe deine Meta-Descriptions (sind sie ansprechend?)
- Prüfe deine Titles (enthalten sie das Keyword?)
- Vergleiche mit Wettbewerbern

### "Position schwankt stark"
- Das ist normal bei neuen Seiten
- Google testet verschiedene Positionen
- Fokussiere auf den Durchschnitt über 28 Tage

---

*Diese Anleitung wurde erstellt von Manus am 01.02.2026*
