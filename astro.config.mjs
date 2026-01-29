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
    sitemap(),
  ],
  // Optimized for static deployment on Vercel
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  // Remove Manus-specific config for Vercel
  server: {
    host: true,
    port: 3000,
  },
});
