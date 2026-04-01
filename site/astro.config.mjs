import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// GitHub Actions sets GITHUB_ACTIONS=true. Vercel does not.
// Base path is only needed for GitHub Pages (repo sub-path).
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: isGitHubPages
    ? 'https://rainonej.github.io'
    : 'https://profesional-site.vercel.app',
  base: isGitHubPages ? '/profesional_site' : '/',
  // OAuth handlers in src/pages/api need an adapter; @astrojs/vercel bundles them for Vercel.
  // GitHub Actions builds with prerendered HTML under site/dist/client/ (see CI upload-pages-artifact).
  // The server bundle in dist/server is unused on Pages; Vercel runs the full build.
  adapter: vercel(),
  integrations: [tailwind()],
});
