# Blog-Bilder Analyse

## Probleme identifiziert:

### 1. Doppelte Bilder (gleiche Datei für verschiedene Artikel):
- **foerderungen-2026.webp** → verwendet in:
  - photovoltaik-foerderungen-2026-programme.astro
  - photovoltaik-foerderungen-2026.astro
  
- **solaranlage-wartung.webp** → verwendet in:
  - solaranlage-wartung.astro
  - wartungstipps-winter.astro

- **hero-home.webp** (Platzhalter) → verwendet in:
  - photovoltaik-foerderung-2026.astro
  - stromspeicher-vergleich-2026.astro

### 2. Sehr große Dateien (Performance-Problem):
- foerderungen-2026.webp: 6.1 MB
- photovoltaik-kosten-2026.webp: 7.1 MB
- solaranlage-wartung.webp: 7.1 MB
- solarkauf-fehler.webp: 5.5 MB
- stromspeicher-2026.webp: 5.3 MB

## Artikel-Liste mit Bild-Bedarf:

1. ✅ **fehler-solarkauf.astro** → solarkauf-fehler.webp (OK, aber zu groß)
2. ✅ **neue-speicher-technologien-2026.astro** → neue-speicher-technologien-2026.webp (OK, 84KB)
3. ❌ **photovoltaik-foerderung-2026.astro** → hero-home.webp (PLATZHALTER!)
4. ⚠️ **photovoltaik-foerderungen-2026-programme.astro** → foerderungen-2026.webp (DUPLIKAT)
5. ⚠️ **photovoltaik-foerderungen-2026.astro** → foerderungen-2026.webp (DUPLIKAT)
6. ✅ **photovoltaik-kosten-2026.astro** → photovoltaik-kosten-2026.webp (OK, aber zu groß)
7. ✅ **solaranlage-wartung.astro** → solaranlage-wartung.webp (OK, aber zu groß)
8. ✅ **stromspeicher-2026-lohnt-sich.astro** → stromspeicher-2026.webp (OK, aber zu groß)
9. ✅ **stromspeicher-nachruesten.astro** → stromspeicher-nachruesten.webp (OK, 563KB)
10. ❌ **stromspeicher-vergleich-2026.astro** → hero-home.webp (PLATZHALTER!)
11. ✅ **wartungstipps-photovoltaik-winter.astro** → blog-wartung-winter.webp (OK, 108KB)
12. ⚠️ **wartungstipps-winter.astro** → solaranlage-wartung.webp (DUPLIKAT)

## Benötigte neue Bilder (7 Stück):

1. **photovoltaik-foerderung-2026.webp** → Thema: KfW Förderung, Geld, Zuschüsse
2. **photovoltaik-foerderungen-programme.webp** → Thema: Verschiedene Förderprogramme, Dokumente
3. **stromspeicher-vergleich-2026.webp** → Thema: Verschiedene Batteriespeicher im Vergleich
4. **wartungstipps-winter-unique.webp** → Thema: Winterwartung (anders als blog-wartung-winter.webp)

## Zusätzlich: Bilder komprimieren (4 große Dateien):
- foerderungen-2026.webp (6.1 MB → ~200KB)
- photovoltaik-kosten-2026.webp (7.1 MB → ~200KB)
- solaranlage-wartung.webp (7.1 MB → ~200KB)
- solarkauf-fehler.webp (5.5 MB → ~200KB)
- stromspeicher-2026.webp (5.3 MB → ~200KB)
