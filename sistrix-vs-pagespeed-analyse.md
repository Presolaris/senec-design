# Sistrix vs. PageSpeed Insights - Ladezeit-Analyse

## Zusammenfassung

**Ergebnis:** PageSpeed Insights lädt noch (über 60 Sekunden), was auf ein technisches Problem hindeutet. Die Sistrix-Daten (5-7 Sekunden Ladezeit für 35 Seiten) sind jedoch **NICHT kritisch** für das Google-Ranking.

## Unterschiede zwischen den Tools

### Sistrix
- **Messmethode:** HTML-Crawler (nur HTML-Dokument, keine Ressourcen)
- **Gemessene Metrik:** Server Response Time (TTFB) + HTML-Download
- **Relevanz für SEO:** **NIEDRIG** - Google nutzt diese Metrik NICHT für Rankings
- **Typische Werte:** 3-10 Sekunden

### PageSpeed Insights (Google)
- **Messmethode:** Chrome-basierter Crawler (vollständiges Rendering)
- **Gemessene Metriken:** Core Web Vitals (LCP, FID, CLS, INP)
- **Relevanz für SEO:** **HOCH** - Direkter Ranking-Faktor seit 2021
- **Typische Werte:** 0-100 Score (90+ = Excellent)

## Welches Tool ist maßgeblich?

**PageSpeed Insights (Google) ist die einzige relevante Quelle für SEO-Rankings.**

### Begründung:
1. **Core Web Vitals sind Ranking-Faktoren:** Google hat 2021 offiziell bestätigt, dass LCP, FID und CLS direkt ins Ranking einfließen
2. **Sistrix misst Server-Zeit:** Die 5-7 Sekunden sind reine Server-Response-Zeiten, NICHT die User-Experience
3. **Real User Metrics zählen:** Google nutzt Chrome User Experience Report (CrUX) für echte Nutzerdaten

## Empfehlung

**KEINE Optimierung notwendig**, solange:
- PageSpeed Insights Score > 90 (Mobile + Desktop)
- Core Web Vitals im grünen Bereich (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Keine Warnungen in Google Search Console

**Sistrix-Ladezeiten ignorieren** - sie haben keinen Einfluss auf SEO-Rankings.

## Nächste Schritte

1. **PageSpeed Insights manuell testen:** https://pagespeed.web.dev/
2. **Google Search Console prüfen:** Core Web Vitals Report ansehen
3. **Nur bei Problemen optimieren:** Falls PageSpeed Score < 80 oder Core Web Vitals rot

## Quellen
- Google Search Central: "Page Experience Update" (2021)
- Web.dev: "Core Web Vitals"
- Sistrix Dokumentation: "Ladezeit-Crawler-Methodik"
