import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function processHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Transform stylesheet links to async loading (except noscript)
      const originalContent = content;
      content = content.replace(
        /<link\s+rel="stylesheet"\s+href="([^"]+)"(?![^>]*noscript)/g,
        '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"'
      );
      
      // Add noscript fallback for browsers without JS
      if (content !== originalContent) {
        content = content.replace(
          /(<link rel="stylesheet" href="([^"]+)" media="print" onload="this\.media='all'")/g,
          '$1><noscript><link rel="stylesheet" href="$2"></noscript'
        );
        
        await writeFile(fullPath, content);
        console.log(`✓ Processed: ${fullPath}`);
      }
    }
  }
}

console.log('🚀 Making CSS non-render-blocking...');
await processHtmlFiles('./dist');
console.log('✅ All HTML files processed!');
