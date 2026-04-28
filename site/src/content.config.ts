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
  image: z.string().optional(),
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

export const awardSchema = z.object({
  title: z.string(),
  context: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string().optional(),
  year: z.string().optional(),
  note: z.string().optional(),
});

export const cvSchema = z.object({
  awards: z.array(awardSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
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
