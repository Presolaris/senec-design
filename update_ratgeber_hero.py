#!/usr/bin/env python3
"""
Skript zum automatischen Anpassen der Hero-Sections aller Ratgeber-Unterseiten.
"""

import re
from pathlib import Path

# Ratgeber-Verzeichnis
RATGEBER_DIR = Path("/home/ubuntu/senec-design/src/pages/ratgeber")

def update_hero_section(file_path):
    """Aktualisiert die Hero-Section einer Ratgeber-Seite."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern für Hero-Section (py-20 md:py-32 -> py-16 md:py-20)
    content = re.sub(
        r'py-20 md:py-32',
        'py-16 md:py-20',
        content
    )
    
    # Pattern für H1-Größe
    content = re.sub(
        r'text-4xl md:text-5xl lg:text-6xl',
        'text-3xl md:text-4xl lg:text-5xl',
        content
    )
    
    # Pattern für Abstände
    content = re.sub(
        r'mb-6">',
        'mb-4">',
        content,
        count=1  # Nur erste H1
    )
    
    content = re.sub(
        r'text-xl text-gray-200 mb-8',
        'text-lg md:text-xl text-gray-200 mb-6',
        content
    )
    
    # Pattern für Button-Spacing
    content = re.sub(
        r'<div class="flex flex-col sm:flex-row gap-4">',
        '<div class="flex flex-col sm:flex-row gap-3">',
        content
    )
    
    # Pattern für Button-Padding
    content = re.sub(
        r'class="btn-accent text-center">',
        'class="btn-accent text-center px-6 py-3">',
        content
    )
    
    content = re.sub(
        r'class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-\[var\(--senec-blue\)\] text-center">',
        'class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-[var(--senec-blue)] text-center px-6 py-3">',
        content
    )
    
    # Schreibe aktualisierte Datei
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {file_path.name} aktualisiert")

def main():
    """Hauptfunktion."""
    
    print("🚀 Starte Aktualisierung der Ratgeber-Unterseiten...")
    print()
    
    astro_files = list(RATGEBER_DIR.glob("*.astro"))
    
    if not astro_files:
        print("❌ Keine Ratgeber-Seiten gefunden!")
        return
    
    print(f"📁 Gefunden: {len(astro_files)} Ratgeber-Seiten")
    print()
    
    for file_path in sorted(astro_files):
        update_hero_section(file_path)
    
    print()
    print(f"✨ Fertig! {len(astro_files)} Seiten erfolgreich aktualisiert.")

if __name__ == "__main__":
    main()
