# Architecture

## Overview

This site is a statically generated personal academic website. All pages are pre-rendered to HTML at build time and served as static files — there is no server, no database, and no runtime. This keeps hosting costs near zero and eliminates whole categories of security risk.

---

## Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Content Editing                      │
│                                                         │
│   Pages CMS (pagescms.org)   Decap CMS (/admin/)        │
│   — web-based editor         — alternative web editor   │
│   — reads/writes via         — reads/writes via         │
│     GitHub API                 GitHub OAuth             │
└───────────────────┬─────────────────────────────────────┘
                    │ Git commits to main
                    ▼
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                                                         │
│   site/src/content/blog/*.md   ← blog posts            │
│   site/src/content/pages/*.md  ← page content          │
│   site/src/pages/*.astro       ← page templates        │
│   site/src/components/*.astro  ← UI components         │
└───────────────────┬─────────────────────────────────────┘
                    │ Push to main triggers
                    ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions (.github/workflows/)         │
│                                                         │
│   1. actions/checkout@v4                                │
│   2. actions/setup-node@v4 (Node 20)                    │
│   3. npm ci (in site/)                                  │
│   4. npm run build → site/dist/                         │
│   5. upload-pages-artifact                              │
│   6. deploy-pages                                       │
└───────────────────┬─────────────────────────────────────┘
                    │ Deploys static files
                    ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Pages (CDN)                          │
│                                                         │
│   https://GITHUB_USERNAME.github.io/professional_site/  │
│   — HTML, CSS, JS served globally                       │
│   — HTTPS included at no cost                           │
└─────────────────────────────────────────────────────────┘
```

---

## Key Technologies

### Astro
Astro is the core framework. It generates static HTML at build time using `.astro` component files, which support any combination of HTML, TypeScript, and UI framework components. The site uses Astro's built-in **Content Collections** feature to manage Markdown content with typed schemas (via Zod).

### Tailwind CSS
Tailwind is a utility-first CSS framework. All styling is done with Tailwind class names directly in component markup. The `tailwind.config.mjs` file controls the design system. In this project, Tailwind is integrated via the `@astrojs/tailwind` integration.

### Astro Content Collections
Content Collections give type-safe access to Markdown files at build time. The schema in `site/src/content/config.ts` ensures that every blog post has a valid `title`, `date`, etc. If a post has missing or incorrectly typed frontmatter, the build fails with a clear error rather than silently producing broken pages.

### Pages CMS
Pages CMS is a free, open-source CMS that works directly with GitHub. When connected to a repository, it reads `.pages.yml` to know what content can be edited, then commits changes directly through the GitHub API. No server is required.

### Decap CMS (formerly Netlify CMS)
Decap CMS is the alternative visual editor, configured in `site/public/admin/config.yml`. It is loaded from a CDN script tag in `site/public/admin/index.html` and authenticates via GitHub OAuth. It serves the same purpose as Pages CMS; the site ships with both configured so the owner can choose.

### GitHub Actions + GitHub Pages
The deploy workflow in `.github/workflows/deploy.yml` runs on every push to `main`. It installs dependencies, runs the Astro build, and deploys the output to GitHub Pages using the official `actions/deploy-pages` action. No third-party hosting service is required.

---

## Content Model

```
blog (Content Collection)
├── title: string           (required)
├── description: string     (optional, shown in post list)
├── date: Date              (required, coerced from string)
├── tags: string[]          (optional)
└── cover: string           (optional, path to image)

pages (Markdown files, not a Content Collection)
├── home.md
├── research.md
├── teaching.md
└── contact.md
```

---

## File-to-URL Mapping

| Source file | Built URL |
|---|---|
| `src/pages/index.astro` | `/professional_site/` |
| `src/pages/research.astro` | `/professional_site/research/` |
| `src/pages/teaching.astro` | `/professional_site/teaching/` |
| `src/pages/writing/index.astro` | `/professional_site/writing/` |
| `src/pages/writing/[slug].astro` | `/professional_site/writing/{slug}/` |
| `src/pages/contact.astro` | `/professional_site/contact/` |
