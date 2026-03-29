# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro | Static-site friendly, content collections, TypeScript support |
| Styling | Tailwind CSS | Utility-first, no runtime CSS |
| Content | Files in `site/src/content/` | Git-backed, CMS-editable, human-readable |
| CMS | Pages CMS | Free, Git-backed, no database |
| Hosting (production) | GitHub Pages | Free for public repos, deploys from `main` |
| Hosting (preview) | Vercel | Deploys from `dev`; shows drafts before they go live |
| Booking | Calendly embed | Configured via `bookingUrl` in Site Settings; no backend required |

## Repository layout

```text
professional_site/
  .pages.yml                  ← Pages CMS configuration
  .husky/pre-commit           ← Pre-commit hook (Prettier + ESLint on staged files)
  .github/
    workflows/
      ci.yml                  ← Lint, check, build, deploy (GitHub Pages on main)
      update-pr-branches.yml  ← Auto-updates open PRs when dev advances
      claude-agent.yml        ← Runs Claude Code Action on claude-ready issues or @claude mentions
  site/
    astro.config.mjs          ← Base path: /profesional_site (GH Pages) or / (Vercel)
    src/
      pages/                  ← Route files (.astro)
      components/             ← Nav, Footer, etc.
      layouts/                ← BaseLayout wrapping all pages
      content/
        settings/             ← main.json (name, tagline, bio, bookingUrl, etc.)
        projects/             ← Portfolio items (.md)
        writing/              ← Blog posts and essays (.md)
        testimonials/         ← Colleague quotes (.json)
      content.config.ts       ← Zod schemas for all four collections
      styles/
        global.css
    public/
      media/                  ← Uploaded images (managed by Pages CMS)
  docs/                       ← Project documentation (this folder)
```

## Content model

| Collection | Format | Fields |
|---|---|---|
| **settings** | JSON (single file) | name, tagline, bio, email, bookingUrl, photo, linkedin, instagram |
| **projects** | Markdown | title, description, image, tags, link, date, featured |
| **writing** | Markdown | title, description, date, tags, draft |
| **testimonials** | JSON | author, role, quote, featured |

To leave feedback or request changes, use Vercel comments on the preview site — see [docs/collaborator-walkthrough.md](collaborator-walkthrough.md).

## Git / deployment flow

Two-branch model:

```text
feat/* branch
  → PR targeting dev
  → CI (lint, astro-check, build)
  → auto-merge into dev
    → Vercel preview rebuilds (~1 min)
    → preview at https://profesional-site.vercel.app

dev → main (release PR)
  → CI + deploy
    → GitHub Pages rebuilds (~1 min)
    → live at https://rainonej.github.io/profesional_site/
```

When Agreni edits via Pages CMS:

- Pages CMS commits to `dev`
- Vercel auto-deploys the preview
- Developer opens a `dev → main` release PR when ready to go live

## Base path

`astro.config.mjs` uses `process.env.GITHUB_ACTIONS === 'true'` to conditionally set the base:

- GitHub Pages build: `base: '/profesional_site'`
- Vercel / local: `base: '/'`

All internal links use `import.meta.env.BASE_URL` as a prefix.

## Image upload

All CMS-uploaded images go to `site/public/media/` and are committed to Git. Keep filenames simple (letters, numbers, hyphens) to avoid path issues.
