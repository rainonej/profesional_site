import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://GITHUB_USERNAME.github.io',
  base: '/professional_site',
  integrations: [tailwind()],
});
