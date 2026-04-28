# Architecture

> **Status (2026-04-28):** This document describes the *forward-looking* architecture being built across Epics 1–10. The repository is currently a single-repo, single-site setup. See [Migration note](#migration-note) at the bottom for the present state. Decisions recorded here are locked for the duration of the extraction work.

---

## Four-layer model

The portfolio engine separates concerns into four conceptual layers. Each layer has a single owner and communicates with adjacent layers only through typed schemas.

| Layer | What it contains | Who owns it |
|-------|-----------------|-------------|
| **Content** | Site-specific data: projects, writing, testimonials, site settings | Site owner (`agreni-site`) |
| **Config** | Consumer configuration: Astro config, theme options, enabled routes | Developer in `agreni-site` |
| **Engine** | Reusable packages: layouts, components, Zod schemas, admin UI | `portfolio-engine` (public repo) |
| **Workflow** | CI/CD templates and reusable GitHub Actions workflows | `portfolio-engine` (public repo) |

Rules:

- The Engine layer has no knowledge of site-specific content or configuration values.
- The Content layer contains only data — no rendering logic.
- Cross-layer communication uses the typed schemas in `@portfolio-engine/schema`.

---

## Two-repo model

| Repo | Visibility | Role |
|------|-----------|------|
| `rainonej/portfolio-engine` | **Public** | Monorepo containing all `@portfolio-engine/*` packages; no site-specific content |
| `rainonej/agreni-site` | **Private** | Consumer repo: Astro config, content files, and theme overrides only |

Why two repos:

1. **Open-source engine, private content** — The engine is reusable and publishable; Agreni's content and credentials stay private.
2. **Deployment constraints** — GitHub Pages requires a public repo (or a paid plan); `agreni-site` is private and must use Vercel.
3. **Clean API boundary** — Consumer developers depend only on versioned npm packages, not internal engine implementation details.

---

## Package list and responsibilities

npm scope: `@portfolio-engine/*`. Register scope before first publish.

| Package | npm name | Responsibility |
|---------|----------|---------------|
| Engine core | `@portfolio-engine/engine-core` | Astro integration, virtual module registry, route registration |
| Theme | `@portfolio-engine/editorial-theme` | Layouts, components (Nav, Footer, etc.), Tailwind CSS styles |
| Schema | `@portfolio-engine/schema` | Shared Zod schemas for all four content collections |
| Admin tools | `@portfolio-engine/admin-tools` | Admin UI, route inspection panels, design-token preview |
| Workflow kit | `@portfolio-engine/workflow-kit` | GitHub Actions reusable workflow templates |

See [docs/v1-non-goals.md](v1-non-goals.md) for a locked list of packages and patterns that are explicitly out of scope for v1.

---

## Installation and consumption model

### Installed mode (production — `agreni-site`)

`agreni-site` installs versioned packages from npm:

```bash
npm install @portfolio-engine/engine-core @portfolio-engine/editorial-theme @portfolio-engine/schema
```

`astro.config.mjs` in `agreni-site`:

```js
import { portfolioEngine } from '@portfolio-engine/engine-core';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [portfolioEngine(), editorialTheme()],
});
```

The consumer repo contains only content and config. The engine handles routes, layouts, and rendering.

### Local-dev mode (engine development — `portfolio-engine`)

Inside `portfolio-engine`, packages are linked via npm workspaces. A `demo/` or fixture site uses `workspace:*` references so changes are reflected immediately without publishing.

---

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

---

## Repository layout

### After extraction (`portfolio-engine` + `agreni-site`)

```text
portfolio-engine/               ← public repo (renamed from profesional_site)
  packages/
    engine-core/                ← @portfolio-engine/engine-core
    editorial-theme/            ← @portfolio-engine/editorial-theme
    schema/                     ← @portfolio-engine/schema
    admin-tools/                ← @portfolio-engine/admin-tools
    workflow-kit/               ← @portfolio-engine/workflow-kit
  demo/                         ← local fixture site for engine development
  .github/
    workflows/
      ci.yml
  docs/                         ← Project documentation

agreni-site/                    ← private consumer repo
  astro.config.mjs              ← Installs and configures engine packages
  src/
    content/
      settings/                 ← main.json (site-specific)
      projects/                 ← Portfolio items (.md)
      writing/                  ← Blog posts and essays (.md)
      testimonials/             ← Colleague quotes (.json)
    pages/                      ← Override pages only (engine provides defaults)
  public/
    media/                      ← Uploaded images (managed by Pages CMS)
  .pages.yml                    ← Pages CMS configuration
```

### Current layout (pre-extraction — `profesional_site`)

See [Migration note](#migration-note).

---

## Content model

| Collection | Format | Fields |
|---|---|---|
| **settings** | JSON (single file) | name, tagline, bio, email, bookingUrl, photo, linkedin, instagram |
| **projects** | Markdown | title, description, image, tags, link, date, featured |
| **writing** | Markdown | title, description, date, tags, draft |
| **testimonials** | JSON | author, role, quote, featured |

To leave feedback or request changes, use Vercel comments on the preview site — see [docs/collaborator-walkthrough.md](collaborator-walkthrough.md).

---

## Deployment model (locked 2026-04-28)

`agreni-site` is a **private repo** and is deployed **exclusively via Vercel**. GitHub Pages is not used for `agreni-site` because:

1. GitHub Pages on private repos requires a paid GitHub plan.
2. Auth and admin routes require serverless functions, which GitHub Pages cannot run regardless.

Vercel handles both the static HTML and the serverless routes (`/api/auth/*`, `/api/content`) from a single deployment.

The `portfolio-engine` public repo may use GitHub Pages for package documentation — that is an Epic 2 decision and does not affect this deployment model.

### Git / deployment flow (`agreni-site`)

```text
task/* or feat/* branch
  → PR targeting dev (or epic branch)
  → CI (lint, astro-check, build)
  → merge into dev
    → Vercel auto-deploys preview (~1 min)

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

---

## Image upload

All CMS-uploaded images are committed to Git. In the current single-repo state they go to `site/public/media/`; after extraction they go to `agreni-site/public/media/`. Keep filenames simple (letters, numbers, hyphens) to avoid path issues.

---

## v1 constraints

See [docs/v1-non-goals.md](v1-non-goals.md) for the full list of locked non-goals and approved packages. That document is the canonical reference for scope decisions during the `portfolio-engine` extraction (Epics 1–10).

---

## Migration note

**Current state (2026-04-28):** The extraction described in this document has not yet started. All code lives in a single repo (`rainonej/profesional_site`) as a standard Astro site:

```text
profesional_site/               ← current repo (will be renamed portfolio-engine)
  .pages.yml                    ← Pages CMS configuration
  .husky/pre-commit             ← Pre-commit hook (Prettier + ESLint on staged files)
  .github/
    workflows/
      ci.yml                    ← Lint, check, build, deploy to GitHub Pages
      update-pr-branches.yml
      claude-agent.yml
  site/
    astro.config.mjs
    src/
      pages/
      components/
      layouts/
      content/
        settings/
        projects/
        writing/
        testimonials/
      content.config.ts
      styles/
        global.css
    public/
      media/
  docs/
```

In the pre-extraction state:

- **Live site:** GitHub Pages (`rainonej.github.io/profesional_site/`), deployed from `main` via CI.
- **Preview:** Vercel tracks `dev`; per-PR previews are also created automatically.
- **CMS:** Pages CMS commits directly to `dev`; CI (lint, check, build) runs on every push to `dev`.

The operational docs (`docs/ci.md`, `docs/ai-workflows.md`, `CONTRIBUTING.md`) describe this current single-repo behavior and are the source of truth for day-to-day development until the extraction is complete.
