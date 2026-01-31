import re
from pathlib import Path

# Seiten ohne Hero-CTAs
pages_without_hero_cta = [
    "src/pages/gewerbe.astro",
    "src/pages/wallbox.astro",
    "src/pages/ratgeber.astro",
    "src/pages/standorte.astro",
    "src/pages/solarmanager.astro",
    "src/pages/ratgeber/foerderung.astro",
    "src/pages/ratgeber/kosten.astro",
    "src/pages/ratgeber/wirtschaftlichkeit.astro",
    "src/pages/faq.astro",
    "src/pages/referenzen.astro",
    "src/pages/kontakt.astro",
    "src/pages/blog.astro",
]

# CTA-Buttons-HTML
cta_buttons = '''
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/#kontakt" class="btn-primary px-6 py-3">Kostenlos Ersparnis berechnen</a>
          <a href="/kontakt" class="btn-secondary px-6 py-3">Beratungstermin vereinbaren</a>
        </div>
'''

for file_path_str in pages_without_hero_cta:
    file_path = Path(file_path_str)
    
    if not file_path.exists():
        print(f"⚠️  Datei nicht gefunden: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Hero-Section finden
    hero_pattern = r'(<section[^>]*class="[^"]*bg-\[var\(--senec-blue\)\][^"]*"[^>]*>.*?<p[^>]*>.*?</p>)'
    
    match = re.search(hero_pattern, content, re.DOTALL)
    
    if match:
        # CTAs nach dem letzten </p> im Hero einfügen
        hero_end = match.end()
        new_content = content[:hero_end] + cta_buttons + content[hero_end:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Hero-CTA hinzugefügt: {file_path.name}")
    else:
        print(f"⚠️  Hero-Section nicht gefunden: {file_path.name}")

print(f"\n✅ {len(pages_without_hero_cta)} Seiten bearbeitet")
