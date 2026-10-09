// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // SITE_URL may override this for previews; production canonical is the confirmed domain.
  site: process.env.SITE_URL ?? 'https://www.wadek.fr',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  integrations: [sitemap({filter: page => !/\/(univers[^/]*|autres-projets|mentions-legales|confidentialite|404)(\/|$)/.test(new URL(page).pathname)})],
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
