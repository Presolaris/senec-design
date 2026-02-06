# Validierungsbericht: Strukturierte Daten (Schema.org)
**Datum:** 2026-02-06  
**Website:** leipzig-photovoltaik.de  
**Analysierte Seiten:** 70

---

## 📊 Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| **Seiten mit Fehlern** | 5 ❌ |
| **Seiten mit Warnungen** | 12 ⚠️ |
| **Seiten ohne Fehler** | 53 ✅ |
| **Gesamtseiten** | 70 |

**Fehlerquote:** 7,1% | **Warnungsquote:** 17,1%

---

## ✅ Behobene Fehler

### 1. **Fehlende Address-Felder in LocalBusiness (5 Seiten) - BEHOBEN**

**Betroffene Seiten (KORRIGIERT):**
- ✅ `standorte/photovoltaik-delitzsch/` - address hinzugefügt (PLZ: 04509)
- ✅ `standorte/photovoltaik-eilenburg/` - address hinzugefügt (PLZ: 04838)
- ✅ `standorte/photovoltaik-markkleeberg/` - address hinzugefügt (PLZ: 04416)
- ✅ `standorte/photovoltaik-taucha/` - address hinzugefügt (PLZ: 04425)
- ✅ `standorte/photovoltaik-wurzen/` - address hinzugefügt (PLZ: 04808)

**Behebung:** Alle 5 Seiten wurden mit vollständigen PostalAddress-Strukturen aktualisiert.

**Validierung:** ✅ Alle Korrektionen erfolgreich validiert (Build: erfolgreich, 70 Seiten)

---

## ⚠️ Warnungen (Empfehlungen)

### 1. **Fehlende Strukturierte Daten auf 12 Seiten**

**Betroffene Seiten:**
- admin/
- agb/
- analytics/
- blog/
- dashboard/
- dashboard/cta-tracking/
- datenschutz/
- heizung/
- impressum/
- ratgeber/
- seo/
- standorte/

**Problem:** Diese Seiten enthalten keine strukturierten Daten (ld+json).

**Auswirkung:** 
- Niedrig: Diese Seiten sind teilweise Verwaltungsseiten oder Übersichtsseiten
- Empfehlung: Mindestens `BreadcrumbList` hinzufügen für bessere Navigation in SERPs

**Priorität:** Niedrig (optional)

---

## ✅ Gefundene Strukturierte Daten (Positiv)

### Schema.org-Typen im Einsatz:

| Typ | Anzahl | Status |
|-----|--------|--------|
| **LocalBusiness** | 57 | ✅ Überwiegend korrekt |
| **FAQPage** | 1 | ✅ Korrekt (27 Fragen) |
| **BreadcrumbList** | 12 | ✅ Korrekt |
| **Product** | 0 | - |
| **Review/AggregateRating** | Enthalten in LocalBusiness | ✅ Korrekt |

### Validierte Elemente:

✅ **LocalBusiness-Struktur (Hauptseiten):**
- name: Vorhanden
- url: Vorhanden
- address: Vorhanden (außer 5 Standort-Seiten)
- telephone: Vorhanden
- aggregateRating: Vorhanden
- areaServed: Vorhanden

✅ **FAQPage-Struktur:**
- mainEntity: 27 Fragen
- Alle Fragen mit name und acceptedAnswer

✅ **BreadcrumbList:**
- itemListElement: Korrekt strukturiert

---

## 🔧 Behebungsplan

### Phase 1: Kritische Fehler beheben (SOFORT)

**Aufgabe:** Address-Feld zu 5 Standort-Seiten hinzufügen

```json
"address": {
  "@type": "PostalAddress",
  "streetAddress": "[Adresse]",
  "addressLocality": "[Stadt]",
  "postalCode": "[PLZ]",
  "addressRegion": "Sachsen",
  "addressCountry": "DE"
}
```

**Betroffene Dateien:**
- `src/pages/standorte/photovoltaik-delitzsch.astro`
- `src/pages/standorte/photovoltaik-eilenburg.astro`
- `src/pages/standorte/photovoltaik-markkleeberg.astro`
- `src/pages/standorte/photovoltaik-taucha.astro`
- `src/pages/standorte/photovoltaik-wurzen.astro`

### Phase 2: Warnungen beheben (OPTIONAL)

**Empfehlung:** BreadcrumbList zu folgenden Seiten hinzufügen:
- admin/
- agb/
- analytics/
- datenschutz/
- heizung/
- impressum/

**Nutzen:** Bessere Navigation in Google SERPs, erhöhte CTR

---

## 📈 SEO-Auswirkungen

| Fehler | Auswirkung auf SEO | Priorität |
|--------|-------------------|-----------|
| Fehlende address in LocalBusiness | Mittel (lokale Rankings) | 🔴 HOCH |
| Fehlende BreadcrumbList | Niedrig (UX in SERPs) | 🟡 MITTEL |
| Fehlende Strukturierte Daten auf Admin-Seiten | Sehr niedrig | 🟢 NIEDRIG |

---

## 🎯 Abgeschlossene Schritte

1. ✅ **Validierungsbericht erstellt** (ERLEDIGT)
2. ✅ **Fehler beheben** (ERLEDIGT)
3. ✅ **Neuen Build erstellen** (ERLEDIGT - 70 Seiten erfolgreich)
4. ✅ **Erneute Validierung durchführen** (ERLEDIGT - Alle Korrektionen bestätigt)
5. ⏳ **Google Search Console aktualisieren** (EMPFOHLEN)

## 📋 Empfohlene Nächste Schritte

1. **Google Search Console:** Sitemap neu einreichen und URL-Inspektionen durchführen
2. **Lokale Rankings:** Überwachen Sie die Rankings für lokale Keywords in den nächsten 2-4 Wochen
3. **Strukturierte Daten:** Regelmäßige Validierung durchführen (monatlich empfohlen)

---

## 📝 Technische Notizen

- **Validierungsmethode:** Automatisierte JSON-Analyse aller dist/index.html Dateien
- **Validierungsstandard:** Schema.org v13, Google Rich Results Guidelines
- **Test-Datum:** 2026-02-06 11:50 UTC
- **Validator:** Python re + json Module

---

**Bericht erstellt von:** Manus SEO Validator  
**Status:** ✅ ABGESCHLOSSEN  
**Validierungsdatum:** 2026-02-06 11:50 UTC  
**Korrektur-Validierungsdatum:** 2026-02-06 12:00 UTC  
**Nächste Überprüfung empfohlen:** 2026-03-06 (monatlich)
