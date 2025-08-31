import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('news');
  const items = posts
    .sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate))
    .map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: `/news/${p.slug}/`,
      pubDate: p.data.pubDate
    }));

  return rss({
    title: 'LNF Guides — News',
    description: 'Pre-launch news & trailer breakdowns',
    site: context.site,
    items
  });
}

// explizit statisch
export const prerender = true;
