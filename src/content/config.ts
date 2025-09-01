import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().optional().default('misc'),
    tags: z.array(z.string()).default([]),

    // akzeptiert String-Pfad ODER Objekt mit src (falls du irgendwann importierst)
    cover: z
      .union([
        z.string(),
        z.object({ src: z.string() }).passthrough()
      ])
      .optional(),

    readingTime: z.number().optional(),
    toc: z.boolean().optional().default(true),
    schema: z.any().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z
      .union([
        z.string(),
        z.object({ src: z.string() }).passthrough()
      ])
      .optional(),
    schema: z.any().optional(),
  }),
});

const updates = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    version: z.string(),
    pubDate: z.coerce.date(),
    changes: z.object({
      added: z.array(z.string()).optional(),
      changed: z.array(z.string()).optional(),
      fixed: z.array(z.string()).optional(),
      removed: z.array(z.string()).optional(),
      known: z.array(z.string()).optional(),
    }).optional(),
  }),
});

export const collections = { guides, news, updates };
