# Demo Plan

This document describes the phased implementation plan for the Agreni Batra professional academic website.

---

## Phase 1: Foundation (complete)

**Goal**: Get a buildable site with correct structure deployed to GitHub Pages.

- [x] Repository initialized with CLAUDE.md autonomy configuration
- [x] Branch `feat/demo-site` created
- [x] Astro project scaffolded manually in `site/`
- [x] Tailwind CSS integrated via `@astrojs/tailwind`
- [x] `tsconfig.json` with strict typing
- [x] Global CSS with Tailwind base + prose utilities
- [x] `BaseLayout.astro` with `<head>`, `Nav`, `Footer` slots
- [x] GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)
- [x] `npm run build` passes with 0 errors

---

## Phase 2: Content Collections (complete)

**Goal**: All pages render with real (placeholder) content; blog system works end-to-end.

- [x] Zod schema defined in `src/content/config.ts`
- [x] Three demo blog posts in `src/content/blog/`
- [x] Writing list page (`/writing/`) with posts sorted by date descending
- [x] Dynamic post page (`/writing/[slug]/`) renders full Markdown
- [x] Page-level Markdown files in `src/content/pages/` (managed by CMS)
- [x] PostCard component shows title, date, description, and "Read" link
- [x] All five pages (Home, Research, Teaching, Writing, Contact) have meaningful placeholder content

---

## Phase 3: Booking Integration (complete)

**Goal**: Calendly booking is accessible from the home page hero and the contact page.

- [x] Hero component includes Calendly popup button with Calendly widget script
- [x] Contact page includes Calendly inline embed widget
- [x] All Calendly URLs clearly marked with `<!-- REPLACE: ... -->` comments
- [x] Fallback mailto link on contact page

---

## Phase 4: Visual Editor (complete)

**Goal**: A non-technical editor can update content through a web interface without touching code.

- [x] `.pages.yml` at repo root configures Pages CMS
- [x] `site/public/admin/config.yml` configures Decap CMS
- [x] `site/public/admin/index.html` loads Decap CMS from CDN
- [x] Both CMS configurations cover: blog posts and all four pages
- [x] Media folder configured for image uploads

---

## Phase 5: Polish & Launch Prep (future)

**Goal**: Replace all placeholder content and go live.

- [ ] Replace all `PLACEHOLDER` and `GITHUB_USERNAME` tokens
- [ ] Write real bio and page content
- [ ] Upload headshot or avatar to `site/public/media/`
- [ ] Connect real Calendly account
- [ ] Update email address
- [ ] Enable GitHub Pages in repository settings
- [ ] Verify build and live URL
- [ ] Optionally: add custom domain (requires DNS CNAME configuration)
- [ ] Optionally: upgrade to Decap CMS with Netlify Identity for OAuth, or switch to Tina CMS for live visual editing

---

## Possible Future Enhancements

| Feature | Complexity | Notes |
|---|---|---|
| Custom domain | Low | Add CNAME file to `site/public/`, configure DNS |
| CV/publications page | Low | Add new `.astro` page + content file |
| Tag filtering on Writing page | Medium | Filter posts by tag client-side or at build time |
| Search | Medium | Pagefind (static search, works with Astro) |
| Newsletter signup | Medium | Buttondown, Substack, or ConvertKit embed |
| Live visual editing | High | Tina CMS or Sanity with Astro adapter |
| Analytics | Low | Plausible or Fathom script tag (privacy-first) |
