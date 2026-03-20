import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Actions sets GITHUB_ACTIONS=true. Vercel does not.
// Base path is only needed for GitHub Pages (repo sub-path).
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGitHubPages
    ? 'https://rainonej.github.io'
    : 'https://profesional-site.vercel.app',
  base: isGitHubPages ? '/profesional_site' : '/',
  integrations: [tailwind()],
});
