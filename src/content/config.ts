import { defineCollection, z } from 'astro:content';

const common = {
  title: z.string(),
  description: z.string().max(200),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  readingTime: z.number().optional(),
  toc: z.boolean().default(true),
  schema: z
    .object({
      type: z.enum(['Article', 'HowTo', 'FAQPage']).default('Article'),
      faq: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .optional()
    })
    .optional()
};

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    ...common,
    category: z.string()
  })
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    ...common
  })
});

const updates = defineCollection({
  type: 'content',
  schema: z.object({
    ...common
  })
});

export const collections = { guides, news, updates };
