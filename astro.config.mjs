import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// IMPORTANT: Domain später anpassen
const SITE = 'https://lnf-guides.example';

export default defineConfig({
  site: SITE,
  integrations: [sitemap(), mdx()],
  server: { host: true },
  vite: {
    plugins: [tailwindcss()],
    build: { sourcemap: true }
  }
});
