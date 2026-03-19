# professional_site

**Live site: https://rainonej.github.io/profesional_site/**

Base path in `site/astro.config.mjs` matches the GitHub repo name (`profesional_site`); no change needed.

A personal / professional demo website built with Astro + Tailwind CSS.

## Structure

```
professional_site/
├── CLAUDE.md           — Claude Code autonomy configuration
├── README.md           — this file
├── .gitignore
├── .github/
│   └── workflows/      — CI/CD (lint, build, deploy)
└── site/               — website source
```

## Development

```bash
cd site
npm install
npm run dev
```

## Lint

CI runs ESLint (Astro/JS/TS), stylelint (CSS), Prettier (format), and yamllint (`.pages.yml`, workflows, CMS config). Locally:

```bash
cd site
npm ci
npm run lint        # check only
npm run lint:fix    # fix and format
```

## Build

```bash
cd site
npm run build
```

## Deployment

Static output is generated to `site/dist/`. Deployed to GitHub Pages.

---

*Autonomously developed by Claude Code inside this repository.*
