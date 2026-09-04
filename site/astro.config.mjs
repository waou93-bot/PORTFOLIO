// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // SITE_URL is injected by the deployment environment (local, preview, production).
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [sitemap()],
  image: {
    // Default Astro sharp service. Generates AVIF/WebP variants with srcset/sizes.
    service: { entrypoint: 'astro/assets', config: { formats: ['avif', 'webp'] } },
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
