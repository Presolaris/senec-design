import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://leipzig-photovoltaik.de',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We handle base styles in global.css
    }),
    // Wallbox-Aliasse bleiben erreichbar, empfehlen aber dieselbe kanonische Seite.
    sitemap({
      filter: (page) => !['/wallbox-leipzig/', '/standorte/wallbox-leipzig/'].includes(new URL(page).pathname),
    }),
  ],
  // Optimized for static deployment on Vercel
  output: 'static',
  // Kanonische URL-Konsolidierung: Die frühere Standortvariante führt dauerhaft zur Money-Page.
  redirects: {
    '/standorte/solaranlage-leipzig/': 'https://leipzig-photovoltaik.de/solaranlage-leipzig/',
  },
  // Trailing Slash vereinheitlichen - verhindert Duplicate Content
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  // Remove Manus-specific config for Vercel
  server: {
    host: true,
    port: 3000,
    // Allow Manus preview hosts
    allowedHosts: true,
  },
});
