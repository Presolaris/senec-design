import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// When running from dist/index.js, __dirname is already the dist folder
// So we serve from current directory, not dist subdirectory
const distPath = __dirname;

// Serve static files from dist folder
app.use(express.static(distPath, {
  extensions: ['html'],
  index: 'index.html'
}));

// Fallback middleware for clean URLs
app.use((req, res, next) => {
  // Skip if already has extension
  if (req.path.includes('.')) {
    return next();
  }
  
  // Try path.html
  const htmlPath = join(distPath, req.path + '.html');
  if (existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  
  // Try path/index.html
  const indexPath = join(distPath, req.path, 'index.html');
  if (existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // Fallback to index.html
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on port ${PORT}`);
});
