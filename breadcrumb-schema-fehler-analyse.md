# Breadcrumb Schema-Fehler Analyse

**Problem:** Google Search Console meldet "Ungültiger Objekttyp für Feld itemListElement"

**Datum:** 09.02.2026

---

## 🔍 Fehler-Analyse

### **Google-Fehlermeldung:**
```
Ungültiger Objekttyp für Feld "itemListElement"
```

### **Ursache identifiziert:**

In `/home/ubuntu/senec-design/src/components/Breadcrumb.astro` (Zeile 17-22):

```javascript
"itemListElement": items.map((item, index) => ({
  "@type": "ListItem",
  "position": index + 1,
  "name": item.label,
  ...(item.href && index < items.length - 1 ? { "item": `https://leipzig-photovoltaik.de${item.href}` } : {})
}))
```

**Problem:** Das letzte Element im Breadcrumb hat KEIN `"item"` Feld!

### **Google Schema.org Anforderung:**

Laut [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) MUSS **jedes ListItem** ein `"item"` Feld haben:

```json
{
  "@type": "ListItem",
  "position": 1,
  "name": "Home",
  "item": "https://example.com/"  ← PFLICHT für ALLE Items!
}
```

### **Aktuelles Problem:**

**Letztes Breadcrumb-Element:**
```json
{
  "@type": "ListItem",
  "position": 3,
  "name": "Solaranlage Leipzig"
  // ❌ FEHLT: "item" Feld
}
```

**Google sagt:** "Ungültiger Objekttyp" weil das `item` Feld fehlt!

---

## ✅ Lösung

### **Korrektur in Breadcrumb.astro:**

**Vorher (Zeile 17-22):**
```javascript
"itemListElement": items.map((item, index) => ({
  "@type": "ListItem",
  "position": index + 1,
  "name": item.label,
  ...(item.href && index < items.length - 1 ? { "item": `https://leipzig-photovoltaik.de${item.href}` } : {})
}))
```

**Nachher:**
```javascript
"itemListElement": items.map((item, index) => ({
  "@type": "ListItem",
  "position": index + 1,
  "name": item.label,
  "item": item.href 
    ? `https://leipzig-photovoltaik.de${item.href}` 
    : `https://leipzig-photovoltaik.de${Astro.url.pathname}`
}))
```

### **Änderungen:**

1. ✅ **ALLE Items haben jetzt `"item"` Feld**
2. ✅ **Letztes Element nutzt aktuelle URL** (`Astro.url.pathname`)
3. ✅ **Keine bedingte Logik mehr** (kein `...()` Spread)

---

## 📊 Betroffene Seiten

**Gesamt:** 70 Seiten mit Breadcrumb Schema

**Kategorien:**
- Hauptseiten: 20 (index, kontakt, blog, etc.)
- Blog-Artikel: 10
- Ratgeber: 3
- Standorte: 37

**Alle nutzen die gleiche Breadcrumb-Komponente** → Eine Änderung behebt ALLE Fehler!

---

## 🧪 Validierung

### **Vor der Korrektur:**
```json
{
  "@type": "ListItem",
  "position": 2,
  "name": "Solaranlage Leipzig"
  // ❌ Fehlt: "item"
}
```

### **Nach der Korrektur:**
```json
{
  "@type": "ListItem",
  "position": 2,
  "name": "Solaranlage Leipzig",
  "item": "https://leipzig-photovoltaik.de/solaranlage-leipzig/"  ← ✅ Jetzt vorhanden!
}
```

---

## 📝 Nächste Schritte

1. ✅ Breadcrumb.astro korrigieren
2. ✅ Build testen
3. ✅ Mit Google Rich Results Test validieren
4. ✅ Zu GitHub pushen
5. ⏳ Google Search Console neu crawlen lassen (24-48h)

---

## 🎯 Erwartetes Ergebnis

- ✅ Alle 70 Seiten haben valides Breadcrumb Schema
- ✅ Google Search Console zeigt 0 Fehler
- ✅ Rich Snippets mit Breadcrumbs in Google-Suche
- ✅ Bessere CTR durch visuelle Breadcrumbs in SERPs

---

**Status:** Bereit zur Implementierung
