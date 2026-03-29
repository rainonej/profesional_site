import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projectsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  link: z.string().optional(),
  date: z.coerce.date(),
  featured: z.boolean().optional(),
});

const writingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
});

const testimonialsSchema = z.object({
  author: z.string(),
  role: z.string().optional(),
  quote: z.string(),
  featured: z.boolean().optional().default(false),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: projectsSchema,
});

const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: writingSchema,
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: testimonialsSchema,
});

export const collections = { projects, writing, testimonials };
