# v1 Non-Goals

_Locked: 2026-04-28. These are standing architectural constraints for the v1 `portfolio-engine` extraction. Use this document as the canonical reference when evaluating new dependencies, patterns, or feature requests._

---

## What we are explicitly not building in v1

### No third-party theme packages

- **No `astro-theme-provider`** — the engine ships its own integration layer, not a theme provider abstraction
- **No `astro-pages`** — route management is handled directly via Astro's file-based router
- **No `astro-public`** — packaged `public/` directory support is out of scope for v1

These packages were evaluated and rejected. Do not re-open these discussions without a concrete use case that cannot be served by the approved integration helper.

### No generic content patterns

- **No generic content collection injection** — collections are explicit and schema-typed (projects, writing, testimonials, settings). No dynamic/arbitrary collection registration.
- **No content collection codegen from external schemas** — schemas are hand-authored in `content.config.ts` with Zod

### No multi-theme support

- **No multi-theme runtime** — one theme, one site. No theme switching, no theme context providers, no `themes[]` config arrays.
- **No theme marketplace abstractions** — the engine is not a platform for distributing arbitrary themes

### No packaged `public/` directory

Static assets are managed in the consumer repo (`agreni-site`), not packaged into the engine. This avoids asset path conflicts and keeps the engine footprint minimal.

### No automation beyond scope

- **No automatic patch cleanup in v1** — patch tracking (Epic 10) is planned, but auto-cleanup automation is explicitly deferred
- **No Dependabot or automatic dependency update merges** — updates are human-reviewed

---

## What is approved

| Tool | Purpose | Notes |
|------|---------|-------|
| `astro-integration-kit` | Integration helper for building engine packages | The **only** approved integration helper for `engine-core` and `editorial-theme` |
| `@astrojs/tailwind` | CSS framework integration | Already in use |
| `@astrojs/vercel` | Serverless adapter | Required for auth/admin routes |
| `zod` | Schema validation | Used in content collections |

If `astro-integration-kit` proves unfit during Epic 3 work, document the finding and open a decision issue before substituting.

---

## Why this document exists

Without explicit non-goals, well-intentioned contributors (human or AI) will reach for `astro-theme-provider` because it solves a real problem. The engine solves that problem differently. This document is the standing "we decided not to do this" record so the decision is not re-litigated on every PR.

Reference this file in Epic 3, 4, and 7 task reviews.
