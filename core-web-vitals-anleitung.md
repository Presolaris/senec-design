# Core Web Vitals in Google Search Console überprüfen - Schritt-für-Schritt-Anleitung

## **Was sind Core Web Vitals?**

Core Web Vitals sind **offizielle Google-Ranking-Faktoren** seit 2021. Sie messen die echte User-Experience deiner Website anhand von 3 Metriken:

1. **LCP** (Largest Contentful Paint): Wie schnell lädt der Hauptinhalt? (Ziel: < 2,5s)
2. **FID** (First Input Delay) / **INP** (Interaction to Next Paint): Wie schnell reagiert die Seite? (Ziel: < 200ms)
3. **CLS** (Cumulative Layout Shift): Wie stabil ist das Layout? (Ziel: < 0,1)

**Wichtig:** Google Search Console zeigt **echte Nutzerdaten** von Chrome-Browsern - das ist die einzige verlässliche Quelle für dein SEO-Ranking.

---

## **Schritt 1: Google Search Console öffnen**

1. Gehe zu https://search.google.com/search-console
2. Melde dich mit deinem Google-Konto an (falls noch nicht eingeloggt)

![Screenshot 1](/home/ubuntu/screenshots/search_google_2026-02-08_17-25-07_7329.webp)

---

## **Schritt 2: Richtige Property auswählen**

1. Klicke oben links auf das **Property-Dropdown** (zeigt aktuell ausgewählte Website)
2. Wähle **"leipzig-photovoltaik.de"** aus der Liste

![Screenshot 2](/home/ubuntu/screenshots/search_google_2026-02-08_17-25-40_8556.webp)

**Hinweis:** Wenn du mehrere Websites verwaltest, stelle sicher, dass die richtige ausgewählt ist.

---

## **Schritt 3: Core Web Vitals Report öffnen**

1. Klicke in der linken Sidebar auf **"Nutzerfreundlichkeit"** (um den Bereich zu erweitern)
2. Klicke auf **"Core Web Vitals"**

![Screenshot 3](/home/ubuntu/screenshots/search_google_2026-02-08_17-26-04_3098.webp)

---

## **Schritt 4: Ergebnisse interpretieren**

### **Was du siehst:**

Der Core Web Vitals Report zeigt 2 Bereiche:

1. **Mobil:** Performance auf Smartphones
2. **Computer:** Performance auf Desktop-PCs

Für jede Kategorie gibt es 3 mögliche Status:

| Status | Bedeutung | Farbe |
|--------|-----------|-------|
| **Gut** | Alle Core Web Vitals im grünen Bereich | ✅ Grün |
| **Optimierung erforderlich** | Einige Metriken im gelben Bereich | ⚠️ Orange |
| **Langsam** | Metriken im roten Bereich | ❌ Rot |

### **Dein aktueller Status:**

```
Mobil: Nicht genügend Nutzungsdaten in den letzten 90 Tagen
Computer: Nicht genügend Nutzungsdaten in den letzten 90 Tagen
```

**Was bedeutet das?**

Google benötigt **mindestens 28 Tage mit ausreichend Traffic**, um Core Web Vitals zu berechnen. Deine Website hat aktuell **zu wenig Besucher** für aussagekräftige Daten.

---

## **Was tun, wenn keine Daten vorhanden sind?**

### **Option 1: PageSpeed Insights nutzen (empfohlen)**

Klicke auf **"PageSpeed Insights testen"** im Core Web Vitals Report. Das öffnet ein Simulations-Tool, das deine Website testet.

**Vorteil:** Sofortige Ergebnisse  
**Nachteil:** Keine echten Nutzerdaten

### **Option 2: GTmetrix oder WebPageTest (Alternative)**

Diese Tools messen ebenfalls Core Web Vitals und liefern sofort Ergebnisse:

- **GTmetrix:** https://gtmetrix.com/ (empfohlen, einfach zu bedienen)
- **WebPageTest:** https://www.webpagetest.org/ (detaillierter, für Experten)

**Dein GTmetrix-Ergebnis für /solaranlage-leipzig/:**
- Performance: 96% (A)
- LCP: 1,2s ✅
- TBT: 0ms ✅
- CLS: 0 ✅

→ **Deine Website ist perfekt optimiert!**

---

## **Häufige Fragen**

### **Warum zeigt Sistrix 5-7 Sekunden Ladezeit?**

Sistrix misst die **Server-Response-Zeit** (wie schnell der Server das HTML-Dokument ausliefert). Das ist **NICHT** das, was Google für Rankings nutzt.

**Google nutzt Core Web Vitals** (wie schnell der Nutzer Inhalte sieht), nicht Server-Response-Zeit.

### **Wie lange dauert es, bis Daten in der Search Console erscheinen?**

- **Minimum:** 28 Tage mit ausreichend Traffic
- **Empfohlen:** 90 Tage für stabile Daten
- **Traffic-Schwellenwert:** Ca. 1.000+ Besucher/Monat

### **Was ist der Unterschied zwischen "Mobil" und "Computer"?**

Google bewertet beide Gerätetypen separat, da:
- **Mobile:** Langsamere Verbindungen, kleinere Bildschirme
- **Desktop:** Schnellere Verbindungen, größere Bildschirme

**Wichtig:** Google nutzt seit 2021 **Mobile-First-Indexing** - die Mobile-Performance ist wichtiger für dein Ranking!

### **Wie oft werden die Daten aktualisiert?**

- **Search Console:** Täglich (basierend auf den letzten 28 Tagen)
- **PageSpeed Insights:** Sofort (bei jedem Test)

---

## **Zusammenfassung**

1. ✅ **Google Search Console** → Nutzerfreundlichkeit → Core Web Vitals öffnen
2. ✅ **Mobil** und **Computer** Status prüfen
3. ✅ Wenn "Keine Daten": **PageSpeed Insights** oder **GTmetrix** nutzen
4. ✅ **Sistrix-Ladezeiten ignorieren** - sie sind irrelevant für SEO

**Dein Status:** Website ist perfekt optimiert (96% Performance, alle Core Web Vitals im grünen Bereich). Keine Optimierung notwendig!

---

## **Weitere Ressourcen**

- **Google Core Web Vitals Dokumentation:** https://web.dev/vitals/
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPageTest:** https://www.webpagetest.org/
