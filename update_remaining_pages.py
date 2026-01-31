#!/usr/bin/env python3
"""
Skript zum automatischen Anpassen der Hero-Sections der restlichen Seiten.
"""

import re
from pathlib import Path

# Seiten-Verzeichnis
PAGES_DIR = Path("/home/ubuntu/senec-design/src/pages")

# Liste der zu aktualisierenden Seiten
PAGES = ["faq.astro", "kontakt.astro", "referenzen.astro", "heizung.astro"]

def update_hero_section(file_path):
    """Aktualisiert die Hero-Section einer Seite."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern für Hero-Section (py-20 md:py-32 -> py-16 md:py-20)
    content = re.sub(
        r'py-20 md:py-32',
        'py-16 md:py-20',
        content
    )
    
    # Pattern für py-20 allein -> py-16 md:py-20
    content = re.sub(
        r'py-20(?! md:)',
        'py-16 md:py-20',
        content
    )
    
    # Pattern für H1-Größe
    content = re.sub(
        r'text-4xl md:text-5xl lg:text-6xl',
        'text-3xl md:text-4xl lg:text-5xl',
        content
    )
    
    content = re.sub(
        r'text-4xl md:text-5xl(?! lg:)',
        'text-3xl md:text-4xl lg:text-5xl',
        content
    )
    
    # Pattern für Abstände nach H1
    content = re.sub(
        r'(<h1[^>]*>.*?</h1>)\s*\n\s*<p class="text-xl',
        r'\1\n          <p class="text-lg md:text-xl',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r'mb-8 leading-relaxed">',
        'mb-6 leading-relaxed">',
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
        r'class="btn-primary">',
        'class="btn-primary px-6 py-3">',
        content
    )
    
    content = re.sub(
        r'class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-\[var\(--senec-blue\)\] text-center">',
        'class="btn-secondary bg-transparent text-white border-white hover:bg-white hover:text-[var(--senec-blue)] text-center px-6 py-3">',
        content
    )
    
    content = re.sub(
        r'class="btn-secondary">',
        'class="btn-secondary px-6 py-3">',
        content
    )
    
    # Schreibe aktualisierte Datei
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {file_path.name} aktualisiert")

def main():
    """Hauptfunktion."""
    
    print("🚀 Starte Aktualisierung der restlichen Seiten...")
    print()
    
    updated_count = 0
    
    for page in PAGES:
        file_path = PAGES_DIR / page
        if file_path.exists():
            update_hero_section(file_path)
            updated_count += 1
        else:
            print(f"⚠️  {page} nicht gefunden, überspringe...")
    
    print()
    print(f"✨ Fertig! {updated_count} Seiten erfolgreich aktualisiert.")

if __name__ == "__main__":
    main()
