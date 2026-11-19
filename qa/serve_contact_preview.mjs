import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4328;
const harness = `(() => {
  window.__CONTACT_PREVIEW__ = true;
  window.__previewAnalyticsCommands = [];
  const descriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
  if (descriptor && descriptor.set && descriptor.get) {
    Object.defineProperty(HTMLScriptElement.prototype, 'src', {
      configurable: true,
      get: descriptor.get,
      set(value) {
        const target = String(value);
        descriptor.set.call(this, target.split('?')[0] === 'https://www.googletagmanager.com/gtag/js'
          ? '/_preview/ga-stub.js' : target);
      }
    });
  }
  const layer = [];
  const originalPush = layer.push.bind(layer);
  layer.push = (...args) => {
    for (const item of args) {
      const cmd = Array.from(item || []);
      if (cmd[0] === 'event') {
        const fields = cmd[2] || {};
        window.__previewAnalyticsCommands.push({ event: cmd[1], page: fields.page || '', form_name: fields.form_name || '' });
      }
    }
    return originalPush(...args);
  };
  window.dataLayer = layer;
})();`;
const banner = '<aside id="preview-notice" style="background:#0D1D37;color:#fff;padding:10px 14px;font:14px/1.45 system-ui;position:relative;z-index:100;text-align:center">VORSCHAU · Nicht veröffentlicht. Formulare versenden keine E-Mails. Analytics-Ereignisse bleiben lokal; keine Übermittlung an Google.</aside>';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2','.pdf':'application/pdf'};
const server = http.createServer((req,res) => {
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'");
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); }
  catch { res.writeHead(400);res.end('Ungültige URL');return; }
  if (pathname.startsWith('/api/')) {
    req.resume();
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.writeHead(req.method==='POST' && /^\/api\/lead\/?$/.test(pathname) ? 409 : 405);
    res.end(JSON.stringify({success:false,message:'Dies ist die unveröffentlichte Vorschau. Es wurde keine Anfrage gespeichert und keine E-Mail versendet. Die Formularlogik wird mit abgefangenen Testanfragen geprüft.'}));return;
  }
  if (!['GET','HEAD'].includes(req.method)) {req.resume();res.writeHead(405);res.end('Vorschau: Nur Ansicht');return;}
  if (pathname==='/_preview/analytics-sandbox.js') {res.setHeader('Content-Type',types['.js']);res.end(harness);return;}
  if (pathname==='/_preview/ga-stub.js') {res.setHeader('Content-Type',types['.js']);res.end('window.__previewGaStubLoaded=true;');return;}
  if (pathname==='/robots.txt') {res.setHeader('Content-Type',types['.txt']);res.end('User-agent: *\nDisallow: /\n');return;}
  let target = path.resolve(DIST, '.' + pathname);
  if (target !== DIST && !target.startsWith(DIST + path.sep)) {res.writeHead(403);res.end('Nicht verfügbar');return;}
  try {
    if (fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
    const ext=path.extname(target).toLowerCase();
    let data=fs.readFileSync(target);
    if (ext==='.html') {
      const text=data.toString('utf8').replace(/<head([^>]*)>/i,'<head$1><script src="/_preview/analytics-sandbox.js"></script>').replace(/<body([^>]*)>/i,'<body$1>'+banner);
      data=Buffer.from(text);
    }
    res.setHeader('Content-Type',types[ext] || 'application/octet-stream');
    res.writeHead(200);
    res.end(req.method==='HEAD' ? undefined : data);
  } catch {res.writeHead(404);res.end('Vorschau-Seite nicht vorhanden');}
});
server.listen(PORT,'0.0.0.0',()=>console.log('Kontakt-Vorschau bereit auf Port '+PORT+'; E-Mail/API und externe Analytics sind deaktiviert.'));
