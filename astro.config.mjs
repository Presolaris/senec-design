import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We handle base styles in global.css
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  vite: {
    server: {
      allowedHosts: ['.manus.computer']
    }
  }
});
