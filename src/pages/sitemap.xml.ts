import type { APIRoute } from 'astro';

// Define all pages with their metadata
const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/privat/', priority: 0.9, changefreq: 'monthly' },
  { url: '/gewerbe/', priority: 0.9, changefreq: 'monthly' },
  { url: '/service/', priority: 0.8, changefreq: 'monthly' },
  { url: '/wallbox/', priority: 0.8, changefreq: 'monthly' },
  { url: '/referenzen/', priority: 0.7, changefreq: 'monthly' },
  { url: '/kontakt/', priority: 0.8, changefreq: 'monthly' },
  { url: '/solarmanager/', priority: 0.9, changefreq: 'monthly' },
  { url: '/ratgeber/', priority: 0.8, changefreq: 'weekly' },
  { url: '/ratgeber/kosten/', priority: 0.7, changefreq: 'monthly' },
  { url: '/ratgeber/foerderung/', priority: 0.7, changefreq: 'monthly' },
  { url: '/ratgeber/faq/', priority: 0.7, changefreq: 'monthly' },
];

const SITE_URL = 'https://leipzig-photovoltaik.de';

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
