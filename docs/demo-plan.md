# Demo Plan

## Goal

Show Agreni a credible, live academic website that she can edit herself — without writing code — so she can decide whether to invest in it for PhD applications, public scholarship, and/or consulting.

## Phases

### Phase 1 — Scaffold (done)

- Astro project in `site/` with Tailwind CSS
- Pages: Home, About, Work, Contact
- Placeholder content (name, tagline, bio)
- Local build passing

### Phase 2 — Booking (done)

- Calendly popup button on Home hero ("Book a conversation")
- Calendly inline embed on Contact page
- Both use `PLACEHOLDER` username — swap when Agreni has a Calendly account

### Phase 3 — CMS configuration (done)

- `.pages.yml` at repo root → Pages CMS can edit pages and blog posts
- `site/public/admin/` → Decap CMS as an alternative

### Phase 4 — Deployment (done)

- GitHub Pages via Actions (`ci.yml`)
- Live at: <https://rainonej.github.io/profesional_site/>
- Default branch set to `main`
- Deploy environment protection configured for `main`

---

## Remaining before handing to Agreni

- [ ] Replace `PLACEHOLDER` in Calendly links with her real username
- [ ] Swap placeholder bio, tagline, and research content with her actual text
- [ ] Upload a real headshot to `site/public/media/`
- [ ] Decide: Pages CMS or Decap for day-to-day editing
- [ ] Optional: custom domain (see `docs/costs.md`)
- [ ] Optional: professional email

## If the site grows beyond the demo

- Add Research and Teaching pages (currently stubbed as About/Work)
- Add a Writing/blog section with content collections
- Connect a custom domain
- Consider Decap editorial workflow for draft → publish flow
