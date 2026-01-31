# Einheitliches Design-System für Kontaktformulare

## Analyse der aktuellen Formulare

### Identifizierte Formulare:
1. **MultiStepForm.astro** (Homepage) - Hauptformular mit 3 Schritten
2. **kontakt.astro** - Kontaktseite mit Standard-Formular
3. **gewerbe.astro** - Gewerbe-Kontaktformular
4. **service.astro** - Service-Anfrage-Formular
5. **ExitIntentPopup.astro** - Exit-Intent Popup mit E-Mail/Telefon

### Aktuelle Design-Elemente:

**MultiStepForm (Referenz-Design):**
- Hintergrund: `bg-white`
- Border: `border border-gray-300`
- Focus: `focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent`
- Padding: `px-4 py-3`
- Border Radius: `rounded-lg`
- Buttons: `bg-[var(--senec-turquoise)]` (Weiter), `bg-[#f5c518]` (Submit)

**Andere Formulare:**
- Inkonsistente Farben (teilweise `focus:ring-[var(--senec-blue)]`)
- Unterschiedliche Abstände und Größen
- Verschiedene Button-Styles

## Einheitliches Design-System

### Farben
- **Primary Action**: `bg-[var(--senec-turquoise)]` (#008fa8)
- **Secondary Action**: `bg-[#f5c518]` (SENEC Gelb)
- **Focus Ring**: `focus:ring-2 focus:ring-[var(--senec-turquoise)]`
- **Border**: `border-gray-300`
- **Background**: `bg-white` oder `bg-gray-50` (für Alternativ-Sections)

### Input-Felder
```html
<input 
  type="text" 
  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent"
>
```

### Labels
```html
<label class="block text-sm font-bold text-gray-900 mb-2">
  Feldname *
</label>
```

### Buttons
**Primary (Weiter/Absenden):**
```html
<button class="px-8 py-3 bg-[var(--senec-turquoise)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
  Button Text
</button>
```

**Secondary (Zurück):**
```html
<button class="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
  Zurück
</button>
```

**Submit (Final):**
```html
<button class="px-8 py-3 bg-[#f5c518] text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity">
  Angebot anfordern
</button>
```

### Abstände
- **Container Padding**: `p-8 md:p-12`
- **Form Spacing**: `space-y-6` oder `space-y-8`
- **Grid Gap**: `gap-6`
- **Label Margin**: `mb-2`

## Neue Adressfelder-Struktur

### Pflichtfelder:
1. **PLZ** (5-stellig, numerisch)
2. **Ort** (Text)

### Optionale Felder:
3. **Straße** (Text)
4. **Hausnummer** (Text/Nummer)

### HTML-Struktur:
```html
<!-- PLZ und Ort (Pflicht) -->
<div class="grid grid-cols-2 gap-6 mb-6">
  <div>
    <label for="plz" class="block text-sm font-bold text-gray-900 mb-2">PLZ *</label>
    <input 
      type="text" 
      id="plz" 
      name="plz" 
      required
      pattern="[0-9]{5}"
      placeholder="04103"
      title="Bitte geben Sie eine gültige 5-stellige PLZ ein"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent"
    >
  </div>
  <div>
    <label for="ort" class="block text-sm font-bold text-gray-900 mb-2">Ort *</label>
    <input 
      type="text" 
      id="ort" 
      name="ort" 
      required
      placeholder="Leipzig"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent"
    >
  </div>
</div>

<!-- Straße und Hausnummer (Optional) -->
<div class="grid grid-cols-3 gap-6 mb-6">
  <div class="col-span-2">
    <label for="strasse" class="block text-sm font-bold text-gray-900 mb-2">Straße (optional)</label>
    <input 
      type="text" 
      id="strasse" 
      name="strasse" 
      placeholder="Musterstraße"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent"
    >
  </div>
  <div>
    <label for="hausnummer" class="block text-sm font-bold text-gray-900 mb-2">Nr. (optional)</label>
    <input 
      type="text" 
      id="hausnummer" 
      name="hausnummer" 
      placeholder="12a"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--senec-turquoise)] focus:border-transparent"
    >
  </div>
</div>
```

## Validierung

### PLZ:
- Pattern: `[0-9]{5}`
- Required: Ja
- Fehlermeldung: "Bitte geben Sie eine gültige 5-stellige PLZ ein"

### Ort:
- Required: Ja
- Min-Length: 2 Zeichen

### Straße:
- Optional
- Max-Length: 100 Zeichen

### Hausnummer:
- Optional
- Pattern: `[0-9]{1,5}[a-zA-Z]?` (z.B. "12", "12a", "12A")

## Implementierungsreihenfolge

1. ✅ MultiStepForm.astro (Homepage) - Bereits gutes Design, nur Adressfelder ergänzen
2. kontakt.astro - Design anpassen + Adressfelder
3. gewerbe.astro - Design anpassen + Adressfelder
4. service.astro - Design anpassen + Adressfelder
5. ExitIntentPopup.astro - Minimal, nur Design anpassen

## Accessibility-Standards

- Alle Pflichtfelder mit `*` markieren
- `required` Attribut für Pflichtfelder
- `pattern` und `title` für Validierung
- Labels mit `for` Attribut verknüpfen
- Focus-States deutlich sichtbar
- Placeholder als Beispiel, nicht als Label-Ersatz
