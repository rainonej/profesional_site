# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro | Static-site friendly, Markdown content collections, TypeScript support |
| Styling | Tailwind CSS | Utility-first, no runtime CSS |
| Content | Markdown files in `site/src/content/` | Git-backed, CMS-editable, human-readable |
| CMS | Pages CMS | Free, Git-backed, no database |
| Hosting | GitHub Pages | Free for public repos, automatic via Actions |
| Booking | Calendly embed | No backend required, public immediately |

## Repository layout

```
professional_site/
  .pages.yml              ← Pages CMS configuration
  .github/
    workflows/
      ci.yml              ← Build + deploy to GitHub Pages on push to main
  site/
    astro.config.mjs      ← Sets site URL and /profesional_site base path
    src/
      pages/              ← Route files (.astro)
      components/         ← Nav, Footer, etc.
      layouts/            ← BaseLayout wrapping all pages
      content/
        settings/         ← main.json (name, tagline, bio, email)
        projects/         ← Work/portfolio items (.md)
      styles/
        global.css
    public/
      media/              ← Uploaded images (managed by Pages CMS)
  docs/                   ← Project documentation (this folder)
```

## Deployment flow

```
Push to main
  → GitHub Actions CI (ci.yml)
    → npm install (regenerates lockfile for Linux)
    → astro build
    → upload artifact
  → GitHub Pages deploy
    → live at https://rainonej.github.io/profesional_site/
```

## Single editor path

**Use Pages CMS as the one place to edit content.**

1. Go to [pagescms.org](https://pagescms.org), sign in with GitHub, and select this repo.
2. Edit **Site Settings** (name, tagline, bio, email, photo, social links) or **Work / Projects** (portfolio items).
3. Save → the CMS commits changes to the repo → GitHub Actions rebuilds → the site updates in about a minute.

Pages CMS is the only supported editor. The Decap CMS admin has been removed.

## Image upload flow

- **Where images go:** All CMS-uploaded images are stored in `site/public/media/`. The site and both CMSes use this folder.
- **In Pages CMS:** When you add or change an image on a field (e.g. Profile Photo, Cover Image), choose or upload a file; it is saved into the `media` library and written to `site/public/media/`. The path in content is relative to the site (e.g. `/media/filename.jpg`).
- **In the repo:** `site/public/media/` is committed to Git. Keep image filenames simple (letters, numbers, hyphens) to avoid path issues.

## Content editing flow

```
Agreni opens Pages CMS (pagescms.org)
  → signs in with GitHub
  → selects rainonej/profesional_site repo
  → edits a post or page field
  → saves → CMS commits Markdown to repo
  → GitHub Actions rebuilds → site updates in ~1 min
```

## Base path note

The site is hosted at `/profesional_site/` (GitHub Pages subdirectory), so `astro.config.mjs` sets:
```js
site: 'https://rainonej.github.io',
base: '/profesional_site',
```
All internal links must use `import.meta.env.BASE_URL` as a prefix.
