import type { APIRoute } from 'astro';
export const prerender = true;

export const GET: APIRoute = () => {
  const allow = (import.meta.env.ALLOW_INDEXING ?? 'true') !== 'false';
  const site = (import.meta.env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  const lines = [
    'User-agent: *',
    allow ? 'Allow: /' : 'Disallow: /',
    site ? `Sitemap: ${site}/sitemap.xml` : 'Sitemap: /sitemap.xml',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
