// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // SITE_URL may override this for previews; production canonical is the confirmed domain.
  site: process.env.SITE_URL ?? 'https://www.wadek.fr',
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
