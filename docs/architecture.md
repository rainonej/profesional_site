# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro | Static-site friendly, content collections, TypeScript support |
| Styling | Tailwind CSS | Utility-first, no runtime CSS |
| Content | Files in `site/src/content/` | Git-backed, CMS-editable, human-readable |
| CMS | Pages CMS | Free, Git-backed, no database |
| Hosting | Vercel | Production and preview; required for auth/admin serverless routes |
| Booking | Calendly embed | Configured via `bookingUrl` in Site Settings; no backend required |

## Repo and package naming (locked 2026-04-28)

| Item | Name | Notes |
|------|------|-------|
| Public engine repo | `portfolio-engine` | GitHub: `rainonej/portfolio-engine` (rename from `profesional_site`) |
| Private consumer repo | `agreni-site` | New private repo; Agreni's actual site |
| npm scope | `@portfolio-engine/*` | Register scope before first publish |
| Core integration package | `@portfolio-engine/engine-core` | Astro integration, virtual modules, route registry |
| Theme package | `@portfolio-engine/editorial-theme` | Layouts, components, styles |
| Schema package | `@portfolio-engine/schema` | Shared Zod schemas and content types |
| Admin tools package | `@portfolio-engine/admin-tools` | Admin UI, route inspection panels |
| Workflow kit package | `@portfolio-engine/workflow-kit` | GitHub Actions workflow templates |

See [docs/v1-non-goals.md](v1-non-goals.md) for a locked list of packages and patterns that are explicitly out of scope for v1.

## Repository layout

```text
portfolio-engine/               ← public repo (renamed from profesional_site)
  .pages.yml                  ← Pages CMS configuration
  .husky/pre-commit           ← Pre-commit hook (Prettier + ESLint on staged files)
  .github/
    workflows/
      ci.yml                  ← Lint, check, build, deploy
      update-pr-branches.yml  ← Auto-updates open PRs when dev advances
      claude-agent.yml        ← Runs Claude Code Action on claude-ready issues or @claude mentions
  site/
    astro.config.mjs          ← Base path: / (Vercel only; no GitHub Pages base path)
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

## Deployment model (locked 2026-04-28)

`agreni-site` is a **private repo** and is deployed **exclusively via Vercel**. GitHub Pages is not used for `agreni-site` because:

1. GitHub Pages on private repos requires a paid GitHub plan
2. Auth and admin routes require serverless functions, which GitHub Pages cannot run regardless

Vercel handles both the static HTML and the serverless routes (`/api/auth/*`, `/api/content`) from a single deployment.

The `portfolio-engine` public repo may use GitHub Pages for package documentation — that is an Epic 2 decision and does not affect this deployment model.

### Git / deployment flow

```text
task/* or feat/* branch
  → PR targeting dev (or epic branch)
  → CI (lint, astro-check, build)
  → merge into dev
    → Vercel auto-deploys preview (~1 min)
    → preview at https://profesional-site.vercel.app

dev → main (release PR)
  → CI
  → Vercel promotes to production
```

When Agreni edits via Pages CMS:

- Pages CMS commits to `dev`
- Vercel auto-deploys the preview
- Developer opens a `dev → main` release PR when ready to go live

### Environment variables

All secrets are managed in the Vercel dashboard. Key variables:

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret (server-only) |
| `SESSION_SECRET` | HMAC key for signing session cookies (server-only) |
| `PUBLIC_ADMIN_ORIGIN` | Override admin origin for cross-origin setups (optional) |
| `GITHUB_CONTENT_REPO` | Target repo for the content API (`owner/repo`) — parameterized in Epic 1 |

### OAuth app

One OAuth app per deployment target. The production app callback URL must match the Vercel production domain. Update the `GITHUB_CONTENT_REPO` environment variable (once parameterized in Epic 1) when migrating to `agreni-site` — do not hardcode repo references in source.

## Image upload

All CMS-uploaded images go to `site/public/media/` and are committed to Git. Keep filenames simple (letters, numbers, hyphens) to avoid path issues.

## v1 constraints

See [docs/v1-non-goals.md](v1-non-goals.md) for the full list of locked non-goals and approved packages. That document is the canonical reference for scope decisions during the `portfolio-engine` extraction (Epics 1–10).
