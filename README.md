# Agreni Batra — Professional Academic Website

A demo personal academic website for Agreni Batra, built with Astro, Tailwind CSS, and deployed to GitHub Pages. All content is placeholder text until updated for launch.

---

## Tech Stack

- **Framework**: [Astro](https://astro.build) (static site generation)
- **Styling**: Tailwind CSS v3
- **Content**: Astro Content Collections with Zod schemas
- **CMS**: [Pages CMS](https://pagescms.org) (`.pages.yml`) + [Decap CMS](https://decapcms.org) (`site/public/admin/`)
- **Deployment**: GitHub Pages via GitHub Actions

---

## Running Locally

**Prerequisites**: Node.js 18+ and npm

```bash
# Clone the repository
git clone https://github.com/GITHUB_USERNAME/professional_site.git
cd professional_site/site

# Install dependencies
npm install

# Start the dev server (http://localhost:4321)
npm run dev
```

---

## Building for Production

```bash
cd site
npm run build
# Output goes to site/dist/
```

---

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

**One-time setup**:
1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Update `astro.config.mjs`: replace `GITHUB_USERNAME` with your actual GitHub username

---

## Editing Content

### Option A: Pages CMS (recommended for non-technical editors)
1. Visit [pagescms.org](https://pagescms.org) and connect your GitHub repo
2. The `.pages.yml` at the repo root configures what Pages CMS can edit
3. Editors can update pages and blog posts through a visual interface without touching code

### Option B: Decap CMS
1. Update `site/public/admin/config.yml`: replace `GITHUB_USERNAME` with your username
2. Visit `https://GITHUB_USERNAME.github.io/professional_site/admin/` to access the editor

### Option C: Direct file editing
- **Blog posts**: Add Markdown files to `site/src/content/blog/` with the naming pattern `YYYY-MM-DD-slug.md`
- **Page content**: Edit Markdown files in `site/src/content/pages/`
- **Page layout/design**: Edit `.astro` files in `site/src/pages/`

---

## Before Launch Checklist

- [ ] Replace all `PLACEHOLDER` and `GITHUB_USERNAME` references
- [ ] Update Calendly link in `site/src/pages/contact.astro` and `site/src/components/Hero.astro`
- [ ] Update email address in `site/src/pages/contact.astro`
- [ ] Replace placeholder bio text on the home page (`site/src/pages/index.astro`)
- [ ] Update GitHub link in `site/src/components/Footer.astro`
- [ ] Update `site` URL in `site/astro.config.mjs`
- [ ] Enable GitHub Pages in repository Settings → Pages

---

## Project Structure

```
professional_site/
├── .pages.yml              ← Pages CMS configuration
├── .github/workflows/      ← GitHub Actions deploy workflow
├── docs/                   ← Architecture and planning docs
└── site/
    ├── astro.config.mjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    ├── src/
    │   ├── pages/          ← Astro page routes
    │   ├── layouts/        ← Base layout
    │   ├── components/     ← Reusable UI components (Nav, Footer, Hero, PostCard)
    │   ├── content/        ← Markdown content + Zod schema
    │   └── styles/         ← Global CSS
    └── public/
        ├── admin/          ← Decap CMS files
        ├── media/          ← Uploaded images
        └── files/          ← Downloadable files (CV, etc.)
```

---

*Autonomously developed by Claude Code inside this repository.*
