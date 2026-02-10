#!/bin/bash
# Fix BreadcrumbList Schema - Replace "position" with "@type": "ListItem"

# Find all .astro files with BreadcrumbList and fix them
find src/pages -name "*.astro" -type f | while read file; do
  # Check if file contains BreadcrumbList
  if grep -q '"@type": "BreadcrumbList"' "$file" 2>/dev/null; then
    # Replace the inline JSON breadcrumb schema
    # Pattern: {"position": N, "name": "...", "item": "..."}
    # Replace with: {"@type": "ListItem", "position": N, "name": "...", "item": "..."}
    
    sed -i 's/{"position":/{"@type": "ListItem", "position":/g' "$file"
    
    echo "Fixed: $file"
  fi
done

echo "Breadcrumb schema fix completed!"
