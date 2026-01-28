// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Static site generation (default)
  output: 'static',
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  
  build: {
    inlineStylesheets: 'always', // Embed all CSS inline
    format: 'file' // Generate /page.html instead of /page/index.html
  }
});