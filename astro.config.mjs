import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Domain später anpassen
const SITE = 'https://lnf-guides.com';

// Mini-Integration: kopiert sitemap-index.xml -> sitemap.xml nach dem Build
const copySitemap = () => ({
  name: 'copy-sitemap-index-to-sitemap',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const { fileURLToPath } = await import('node:url');
      const outDir = fileURLToPath(dir);
      const src = path.join(outDir, 'sitemap-index.xml');
      const dst = path.join(outDir, 'sitemap.xml');
      try {
        await fs.copyFile(src, dst);
        logger.info('[sitemap] copied sitemap-index.xml -> sitemap.xml');
      } catch (err) {
        logger.warn(`[sitemap] could not copy sitemap-index.xml: ${err?.message ?? err}`);
      }
    },
  },
});

export default defineConfig({
  site: SITE,
  integrations: [sitemap(), mdx(), copySitemap()],
  server: { host: true },
  vite: {
    plugins: [tailwindcss()],
    build: { sourcemap: true },
  },
});
