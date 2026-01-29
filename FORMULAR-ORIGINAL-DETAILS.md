# Original-Formular Detailanalyse (leipzig-photovoltaik.de)

## Layout-Struktur

### Hintergrund
- **Farbe:** Dunkles Blau (#003e7e oder ähnlich)
- **Padding:** Großzügig (py-24 oder mehr)

### Container-Layout
- **2-Spalten-Grid** auf Desktop
- **Linke Spalte (ca. 35-40%):** Text-Content
- **Rechte Spalte (ca. 55-60%):** Weißes Formular-Card
- **Gap zwischen Spalten:** Sehr groß (16-20 Einheiten)
- **Formular ist weit nach RECHTS positioniert**

## Linke Spalte (Text-Content)

### Überschrift
- **Text:** "Bereit für Ihre eigene Energiewende?"
- **Größe:** Sehr groß (text-5xl oder größer)
- **Farbe:** Weiß
- **Font-Weight:** Bold
- **Margin-Bottom:** Groß

### Untertitel
- **Text:** "Lassen Sie uns gemeinsam herausfinden, wie viel Sie sparen können..."
- **Größe:** Groß (text-xl)
- **Farbe:** Hellgrau/Weiß
- **Line-Height:** Relaxed

### Benefits (2 Stück)
**Layout:** Vertikal gestapelt (space-y-6)

**Benefit 1:**
- **Icon:** Gelber Checkmark-Circle (links)
- **Titel:** "Kostenlose Wirtschaftlichkeitsberechnung" (Weiß, Bold, text-lg)
- **Text:** "Individuell für Ihr Dach und Ihren Verbrauch." (Hellgrau, text-base)

**Benefit 2:**
- **Icon:** Gelbes Schild/Shield (links)
- **Titel:** "Festpreis-Garantie" (Weiß, Bold, text-lg)
- **Text:** "Keine versteckten Kosten. Alles inklusive." (Hellgrau, text-base)

## Rechte Spalte (Formular-Card)

### Card-Container
- **Hintergrund:** Weiß
- **Border-Radius:** Groß (rounded-2xl)
- **Padding:** Sehr groß (p-12)
- **Shadow:** Stark (shadow-2xl)
- **Position:** Weit nach rechts

### Formular-Header
- **Titel:** "Angebot anfordern" (text-2xl, Bold, Schwarz, Zentriert)
- **Untertitel:** "In nur 3 Schritten zu Ihrem individuellen Angebot" (text-gray-600, Zentriert)

### Step-Indicator
- **Layout:** Horizontal, 3 Schritte
- **Aktiver Schritt (1):** Türkiser Kreis mit "1", Label "Projekt"
- **Inaktive Schritte (2, 3):** Graue Kreise, graue Labels
- **Verbindungslinien:** Horizontale graue Linien zwischen Kreisen

### Schritt 1: Projekttyp
**Label:** "Projekttyp *" (Bold, Schwarz)

**2 große Karten nebeneinander:**

**Karte 1 - Privat:**
- **Icon:** Haus-Symbol (oben)
- **Titel:** "Privat" (Bold)
- **Untertitel:** "Einfamilienhaus, Eigenheim" (Klein, Grau)
- **Border:** Bei Auswahl türkis
- **Hover:** Leichter Schatten

**Karte 2 - Gewerbe:**
- **Icon:** Fabrik/Gebäude-Symbol (oben)
- **Titel:** "Gewerbe" (Bold)
- **Untertitel:** "Unternehmen, Industrie" (Klein, Grau)

### Schritt 2: Anlagengröße
**4 Radio-Optionen vertikal:**
- 5-6 kWp (2-3 Personen, ca. 7.500-9.500€)
- 8-10 kWp (4-5 Personen, ca. 9.500-12.500€)
- 12-15 kWp (5+ Personen / Gewerbe, ca. 13.500-18.500€)
- Individuelle Größe (Beratung erforderlich)

### Schritt 3: Zeitrahmen
**4 Radio-Optionen:**
- Sofort
- 1-3 Monate
- 3-6 Monate
- Nur Informationen

### Weiter-Button
- **Farbe:** Dunkles Blau (wie Hintergrund)
- **Text:** "Weiter" mit Pfeil-Icon
- **Breite:** Volle Breite
- **Padding:** Groß
- **Border-Radius:** Abgerundet

## Wichtige Details

1. **Icons:** Alle Icons sind custom und thematisch passend (Haus, Fabrik, etc.)
2. **Spacing:** Sehr großzügig zwischen allen Elementen
3. **Typography:** Klare Hierarchie mit verschiedenen Größen und Gewichten
4. **Colors:**
   - Hintergrund: Dunkles Blau (#003e7e)
   - Akzent: Türkis/Cyan für aktive Elemente
   - Gelb: Für Icons und wichtige Elemente
   - Weiß: Für Formular-Card
5. **Responsive:** Auf Mobile wird es 1-spaltig
6. **Formular ist deutlich nach RECHTS positioniert** - nicht zentriert!
