# Button-Name Best Practices (Deque University)

**Quelle:** https://dequeuniversity.com/rules/axe/4.11/button-name  
**User Impact:** Critical (Blind, Deafblind)  
**WCAG:** 4.1.2 Name, Role, Value (Level A)

---

## ✅ Korrekte Lösungen (5 Patterns)

### 1. Sichtbarer Text (Best Practice)
```html
<button id="text">Name</button>
```

### 2. aria-label
```html
<button id="al" aria-label="Name"></button>
```

### 3. aria-labelledby
```html
<button id="alb" aria-labelledby="labeldiv"></button>
<div id="labeldiv">Button label</div>
```

### 4. Kombination (aria-label + sichtbarer Text)
```html
<button id="combo" aria-label="Aria Name">Name</button>
```

### 5. title-Attribut (Fallback)
```html
<button id="buttonTitle" title="Title"></button>
```

---

## ❌ Falsche Lösungen (6 Patterns)

1. **Leerer Button:** `<button id="empty"></button>`
2. **value-Attribut:** `<button id="val" value="Button Name"></button>` (funktioniert nicht!)
3. **Leeres aria-label:** `<button id="alempty" aria-label=""></button>`
4. **Fehlendes aria-labelledby:** `<button id="albmissing" aria-labelledby="nonexistent"></button>`
5. **Leeres aria-labelledby:** `<button id="albempty" aria-labelledby="emptydiv"></button>`
6. **value + tabindex:** `<button id="buttonvalue" value="foo" tabindex="-1"></button>`

---

## 🎯 Anforderungen

Jeder `<button>` und jedes Element mit `role="button"` muss **eine** dieser Eigenschaften haben:

1. **Sichtbarer Text** (innerhalb des Elements)
2. **aria-label** (nicht leer)
3. **aria-labelledby** (zeigt auf Element mit Text)
4. **role="presentation"** oder **role="none"** + **tabindex="-1"** (wenn Button dekorativ ist)

---

## 🔍 Nächste Schritte

1. Alle `<button>` Elemente in der Website finden
2. Prüfen ob sie sichtbaren Text ODER aria-label haben
3. Fehlende Labels hinzufügen
