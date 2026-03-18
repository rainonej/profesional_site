import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://rainonej.github.io',
  base: '/profesional_site',
  integrations: [tailwind()],
});
