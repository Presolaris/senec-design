import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// When running from dist/index.js, __dirname is already the dist folder
const distPath = __dirname;

console.log(`[Server] Starting with distPath: ${distPath}`);
console.log(`[Server] Files in distPath:`, readdirSync(distPath).filter(f => f.endsWith('.html')));

// Explicit routes for all pages FIRST (before static middleware)
const pages = [
  'gewerbe', 'privat', 'service', 'wallbox', 'kontakt', 'referenzen',
  'impressum', 'datenschutz', 'solaranlage-leipzig', 'stromspeicher'
];

pages.forEach(page => {
  const htmlPath = join(distPath, `${page}.html`);
  if (existsSync(htmlPath)) {
    app.get(`/${page}`, (req, res) => {
      console.log(`[Route] Serving /${page} -> ${htmlPath}`);
      res.sendFile(htmlPath);
    });
  }
});

// Standorte routes
const standorteDir = join(distPath, 'standorte');
if (existsSync(standorteDir)) {
  const standorte = readdirSync(standorteDir).filter(f => f.endsWith('.html'));
  console.log(`[Server] Standorte found:`, standorte);
  
  standorte.forEach(file => {
    const name = file.replace('.html', '');
    const htmlPath = join(standorteDir, file);
    
    if (name === 'index') {
      app.get('/standorte', (req, res) => {
        console.log(`[Route] Serving /standorte -> ${htmlPath}`);
        res.sendFile(htmlPath);
      });
    } else {
      app.get(`/standorte/${name}`, (req, res) => {
        console.log(`[Route] Serving /standorte/${name} -> ${htmlPath}`);
        res.sendFile(htmlPath);
      });
    }
  });
}

// Ratgeber routes
const ratgeberDir = join(distPath, 'ratgeber');
if (existsSync(ratgeberDir)) {
  const ratgeber = readdirSync(ratgeberDir).filter(f => f.endsWith('.html'));
  console.log(`[Server] Ratgeber found:`, ratgeber);
  
  ratgeber.forEach(file => {
    const name = file.replace('.html', '');
    const htmlPath = join(ratgeberDir, file);
    
    if (name === 'index') {
      app.get('/ratgeber', (req, res) => {
        console.log(`[Route] Serving /ratgeber -> ${htmlPath}`);
        res.sendFile(htmlPath);
      });
    } else {
      app.get(`/ratgeber/${name}`, (req, res) => {
        console.log(`[Route] Serving /ratgeber/${name} -> ${htmlPath}`);
        res.sendFile(htmlPath);
      });
    }
  });
}

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(distPath, {
  extensions: ['html'],
  index: 'index.html'
}));

// Homepage
app.get('/', (req, res) => {
  console.log(`[Route] Serving / -> index.html`);
  res.sendFile(join(distPath, 'index.html'));
});

// 404 handler - serve index.html for SPA fallback
app.use((req, res) => {
  console.log(`[404] Not found: ${req.path}, serving index.html`);
  res.status(404).sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`Serving files from: ${distPath}`);
});
