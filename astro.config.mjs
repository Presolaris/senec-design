// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Static site generation (default)
  output: 'static',

  integrations: [
    tailwind(),
    react()
  ],
  
  build: {
    inlineStylesheets: 'always', // Embed all CSS inline
    format: 'file' // Generate /page.html instead of /page/index.html
  }
});
