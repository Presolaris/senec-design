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
    },
    // Exclude fontkitten from optimization to avoid SSR issues
    optimizeDeps: {
      exclude: ['fontkitten', 'fontace', '@capsizecss/unpack']
    },
    ssr: {
      // Mark these as external to prevent SSR bundling issues
      external: ['fontkitten', 'fontace', '@capsizecss/unpack'],
      noExternal: []
    }
  }
});
