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

const settingsSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  bio: z.string(),
  email: z.string(),
  bookingUrl: z.string().optional(),
  photo: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
});

const projects = defineCollection({
  type: 'content',
  schema: projectsSchema,
});

const settings = defineCollection({
  type: 'data',
  schema: settingsSchema,
});

export const collections = {
  projects,
  settings,
};
