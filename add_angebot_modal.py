#!/usr/bin/env python3
"""
Fügt AngebotModal zu allen Seiten hinzu und ändert "Angebot anfordern"-Links
"""

import os
import re

pages_dir = "src/pages"

# Alle .astro-Dateien finden
astro_files = []
for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith(".astro"):
            astro_files.append(os.path.join(root, file))

print(f"Gefundene Astro-Dateien: {len(astro_files)}")

for file_path in astro_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    
    # 1. AngebotModal importieren (falls noch nicht vorhanden)
    if "AngebotModal" not in content and ("Angebot anfordern" in content or "ANGEBOT ANFORDERN" in content):
        # Import nach anderen Komponenten-Imports einfügen
        if "import" in content and "from" in content:
            # Finde letzte Import-Zeile
            import_pattern = r"(import .+ from ['\"].+['\"];?\n)"
            imports = list(re.finditer(import_pattern, content))
            if imports:
                last_import = imports[-1]
                insert_pos = last_import.end()
                content = content[:insert_pos] + 'import AngebotModal from "../components/AngebotModal.astro";\n' + content[insert_pos:]
                modified = True
                print(f"✓ Import hinzugefügt: {file_path}")
    
    # 2. AngebotModal vor </body> einfügen (falls noch nicht vorhanden)
    if "<AngebotModal" not in content and "AngebotModal" in content:
        if "</body>" in content:
            content = content.replace("</body>", "  <AngebotModal />\n</body>")
            modified = True
            print(f"✓ Modal hinzugefügt: {file_path}")
    
    # 3. Alle "Angebot anfordern"-Links auf Modal-Trigger ändern
    # Pattern: <a href="#beratung" ... >Angebot anfordern</a>
    # Ersetzen durch: <button data-open-angebot-modal ... >Angebot anfordern</button>
    
    # Variante 1: href="#beratung"
    if 'href="#beratung"' in content:
        # Link-Tag durch Button ersetzen
        content = re.sub(
            r'<a\s+href="#beratung"([^>]*)>(.*?Angebot anfordern.*?)</a>',
            r'<button data-open-angebot-modal\1>\2</button>',
            content,
            flags=re.DOTALL
        )
        modified = True
        print(f"✓ Buttons geändert (#beratung): {file_path}")
    
    # Variante 2: href="/kontakt"
    if 'href="/kontakt"' in content and "Angebot anfordern" in content:
        # Nur Links mit "Angebot anfordern"-Text ändern
        content = re.sub(
            r'<a\s+href="/kontakt"([^>]*)>(.*?Angebot anfordern.*?)</a>',
            r'<button data-open-angebot-modal\1>\2</button>',
            content,
            flags=re.DOTALL
        )
        modified = True
        print(f"✓ Buttons geändert (/kontakt): {file_path}")
    
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Datei aktualisiert: {file_path}\n")

print("\n✅ Alle Seiten aktualisiert!")
