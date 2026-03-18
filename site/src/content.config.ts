import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const projectsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  link: z.string().optional(),
  date: z.coerce.date(),
  featured: z.boolean().optional(),
});

const projects = defineCollection({
  type: 'content',
  schema: projectsSchema,
});

export const collections = {
  projects,
};
