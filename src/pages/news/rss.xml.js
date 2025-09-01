import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const posts = await getCollection('news');
  posts.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  return rss({
    title: 'Light No Fire — News',
    description: 'Pre-launch news & trailer analyses for Light No Fire.',
    site: context.site, // kommt aus astro.config.mjs -> site
    stylesheet: undefined,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      link: `/news/${p.slug}/`,
      pubDate: p.data.pubDate,
    })),
  });
}
