#!/usr/bin/env python3
"""
Skript zum automatischen Anpassen der Hero-Sections aller Standorte-Unterseiten.
Macht die Hero-Sections kompakter und fügt CTA-Buttons hinzu.
"""

import re
import os
from pathlib import Path

# Standorte-Verzeichnis
STANDORTE_DIR = Path("/home/ubuntu/senec-design/src/pages/standorte")

# Mapping: Dateiname -> Stadt/Region-Name für SEO
STANDORTE_NAMES = {
    "dresden": "Dresden",
    "halle": "Halle (Saale)",
    "magdeburg": "Magdeburg",
    "erfurt": "Erfurt",
    "gera": "Gera",
    "borna": "Borna",
    "grimma": "Grimma",
    "naumburg": "Naumburg",
    "weissenfels": "Weißenfels",
    "zeitz": "Zeitz",
    "burgenlandkreis": "Burgenlandkreis",
    "saalekreis": "Saalekreis",
    "nordsachsen": "Nordsachsen",
    "anhalt-bitterfeld": "Anhalt-Bitterfeld"
}

def update_hero_section(file_path):
    """Aktualisiert die Hero-Section einer Standort-Seite."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrahiere Standort-Namen aus Dateinamen
    filename = file_path.stem
    standort_name = STANDORTE_NAMES.get(filename, filename.title())
    
    # Pattern für Hero-Section (py-20 md:py-32 -> py-16 md:py-20)
    content = re.sub(
        r'py-20 md:py-32',
        'py-16 md:py-20',
        content
    )
    
    # Pattern für H1-Größe (text-4xl md:text-5xl lg:text-6xl -> text-3xl md:text-4xl lg:text-5xl)
    content = re.sub(
        r'text-4xl md:text-5xl lg:text-6xl',
        'text-3xl md:text-4xl lg:text-5xl',
        content
    )
    
    # Pattern für mb-6 nach H1 -> mb-4
    content = re.sub(
        r'(<h1[^>]*>.*?</h1>)\s*\n\s*<p class="text-xl text-gray-200 mb-8',
        r'\1\n          <p class="text-lg md:text-xl text-gray-200 mb-6',
        content,
        flags=re.DOTALL
    )
    
    # Pattern für Button-Spacing (gap-4 -> gap-3)
    content = re.sub(
        r'<div class="flex flex-col sm:flex-row gap-4">',
        '<div class="flex flex-col sm:flex-row gap-3">',
        content
    )
    
    # Pattern für Button-Padding (füge px-6 py-3 hinzu)
    content = re.sub(
        r'<a href="/#rechner" class="btn-accent text-center">',
        '<a href="/#rechner" class="btn-accent text-center px-6 py-3">',
        content
    )
    
    content = re.sub(
        r'<a href="/kontakt\.html" class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-\[var\(--senec-blue\)\] text-center">',
        '<a href="/kontakt.html" class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-[var(--senec-blue)] text-center px-6 py-3">',
        content
    )
    
    # Schreibe aktualisierte Datei
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {filename}.astro aktualisiert")

def main():
    """Hauptfunktion zum Aktualisieren aller Standorte-Seiten."""
    
    print("🚀 Starte Aktualisierung der Standorte-Unterseiten...")
    print()
    
    # Finde alle .astro-Dateien im Standorte-Verzeichnis
    astro_files = list(STANDORTE_DIR.glob("*.astro"))
    
    if not astro_files:
        print("❌ Keine Standorte-Seiten gefunden!")
        return
    
    print(f"📁 Gefunden: {len(astro_files)} Standorte-Seiten")
    print()
    
    # Aktualisiere jede Datei
    for file_path in sorted(astro_files):
        update_hero_section(file_path)
    
    print()
    print(f"✨ Fertig! {len(astro_files)} Seiten erfolgreich aktualisiert.")

if __name__ == "__main__":
    main()
