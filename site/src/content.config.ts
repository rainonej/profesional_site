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
  notesToDevTeam: z.string().optional(),
});

const writingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
  notesToDevTeam: z.string().optional(),
});

const testimonialsSchema = z.object({
  author: z.string(),
  role: z.string().optional(),
  quote: z.string(),
  featured: z.boolean().optional().default(false),
  notesToDevTeam: z.string().optional(),
});

const settingsSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  bio: z.string(),
  email: z.string(),
  bookingUrl: z.string().optional(),
  photo: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  notesToDevTeam: z.string().optional(),
});

const projects = defineCollection({
  type: 'content',
  schema: projectsSchema,
});

const writing = defineCollection({
  type: 'content',
  schema: writingSchema,
});

const testimonials = defineCollection({
  type: 'data',
  schema: testimonialsSchema,
});

const settings = defineCollection({
  type: 'data',
  schema: settingsSchema,
});

export const collections = {
  projects,
  writing,
  testimonials,
  settings,
};
