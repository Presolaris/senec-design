#!/usr/bin/env python3
"""
Skript zum Ersetzen von gelben und türkisen Text-Akzenten durch ruhigere Farben.
- Türkis → Weiß (Hero-Sections auf dunklem Hintergrund)
- Türkis → Dunkelblau (Links auf hellem Hintergrund)
- Gelb → Weiß (Statistik-Zahlen auf dunklem Hintergrund)
"""

import re
from pathlib import Path

# Seiten-Verzeichnis
PAGES_DIR = Path("/home/ubuntu/senec-design/src/pages")

def update_color_scheme(file_path):
    """Aktualisiert das Farbschema einer Seite."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Gelbe Statistik-Zahlen → Weiß
    # Pattern: text-[var(--senec-yellow)] bei Zahlen/Stats
    content = re.sub(
        r'text-4xl md:text-5xl font-bold text-\[var\(--senec-yellow\)\]',
        'text-4xl md:text-5xl font-bold text-white',
        content
    )
    
    content = re.sub(
        r'text-4xl font-bold text-\[var\(--senec-yellow\)\]',
        'text-4xl font-bold text-white',
        content
    )
    
    # 2. Gelbe Badges/Labels → Weiß
    content = re.sub(
        r'<span class="text-\[var\(--senec-yellow\)\] font-bold tracking-wider uppercase',
        '<span class="text-white font-bold tracking-wider uppercase',
        content
    )
    
    # 3. Gelbe Überschriften → Weiß
    content = re.sub(
        r'<h3 class="text-2xl md:text-3xl font-bold mb-6 text-\[var\(--senec-yellow\)\]">',
        '<h3 class="text-2xl md:text-3xl font-bold mb-6 text-white">',
        content
    )
    
    # 4. Türkise Text-Akzente in Hero-Sections → Weiß
    # Pattern: <span class="text-[var(--senec-turquoise)]">...</span> in H1
    content = re.sub(
        r'<span class="text-\[var\(--senec-turquoise\)\]">([^<]+)</span>',
        r'\1',
        content
    )
    
    # 5. Türkise Preisangaben → Weiß
    content = re.sub(
        r'text-2xl font-bold text-\[var\(--senec-turquoise\)\]',
        'text-2xl font-bold text-white',
        content
    )
    
    # 6. Türkise Icons/SVGs → Weiß (bei dunklem Hintergrund)
    # Nur bei text-[var(--senec-turquoise)] in SVG-Klassen
    content = re.sub(
        r'class="h-6 w-6 text-\[var\(--senec-turquoise\)\]"',
        'class="h-6 w-6 text-white"',
        content
    )
    
    content = re.sub(
        r'class="w-5 h-5 text-\[var\(--senec-turquoise\)\]',
        'class="w-5 h-5 text-white',
        content
    )
    
    # 7. Türkise Checkmarks → Dunkelblau (bei hellem Hintergrund)
    # Nur bei Listen-Items mit flex items-start
    content = re.sub(
        r'(<li class="flex items-start[^>]*>[\s\S]*?)text-\[var\(--senec-turquoise\)\]',
        r'\1text-[var(--senec-blue)]',
        content
    )
    
    # 8. Türkise Links auf hellem Hintergrund → Dunkelblau
    content = re.sub(
        r'hover:text-\[var\(--senec-turquoise\)\]',
        'hover:text-[var(--senec-blue)]',
        content
    )
    
    # 9. Türkise Font-Semibold Text → Weiß (bei Badges)
    content = re.sub(
        r'<span class="text-\[var\(--senec-turquoise\)\] text-sm font-semibold">',
        '<span class="text-white text-sm font-semibold">',
        content
    )
    
    # 10. Gelbe Icons/SVGs → Weiß
    content = re.sub(
        r'class="h-6 w-6 text-\[var\(--senec-yellow\)\]"',
        'class="h-6 w-6 text-white"',
        content
    )
    
    content = re.sub(
        r'class="w-5 h-5 text-\[var\(--senec-yellow\)\]',
        'class="w-5 h-5 text-white',
        content
    )
    
    # 11. Gelbe Hover-Effekte → Dunkelblau
    content = re.sub(
        r'group-hover:bg-\[var\(--senec-yellow\)\]',
        'group-hover:bg-[var(--senec-blue)]',
        content
    )
    
    # 12. Türkise Hover-Effekte bei Überschriften → Dunkelblau
    content = re.sub(
        r'group-hover:text-\[var\(--senec-turquoise\)\]',
        'group-hover:text-[var(--senec-blue)]',
        content
    )
    
    # Nur speichern wenn Änderungen vorgenommen wurden
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ {file_path.name} aktualisiert")
        return True
    else:
        print(f"⚪ {file_path.name} keine Änderungen")
        return False

def main():
    """Hauptfunktion."""
    
    print("🚀 Starte Farbschema-Anpassung...")
    print()
    
    updated_count = 0
    
    # Alle .astro-Dateien im pages-Verzeichnis
    astro_files = list(PAGES_DIR.glob("*.astro"))
    
    for file_path in sorted(astro_files):
        if update_color_scheme(file_path):
            updated_count += 1
    
    print()
    print(f"✨ Fertig! {updated_count} Seiten erfolgreich aktualisiert.")

if __name__ == "__main__":
    main()
