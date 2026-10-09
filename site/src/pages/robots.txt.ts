import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const production = import.meta.env.PROD && import.meta.env.VERCEL_ENV === 'production';
  const text = production
    ? 'User-agent: *\nAllow: /\nSitemap: https://www.wadek.fr/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
