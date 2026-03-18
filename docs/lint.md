# Lint & format

CI runs these checks on every push and PR. Fixes from the [audit report](audit-report.html) are applied; this doc describes the lint pipeline.

## What runs in CI

| Tool | What it checks |
|------|----------------|
| **yamllint** | `.pages.yml`, `site/public/admin/config.yml`, `.github/workflows/*.yml` — syntax and style (config: `.yamllint`) |
| **ESLint** | `.astro`, `.ts`, `.js` in `site/` — Astro + TypeScript recommended rules (`site/eslint.config.mjs`) |
| **stylelint** | `site/src/**/*.css` — standard CSS rules + Tailwind at-rules allowed (`.stylelintrc.json`) |
| **Prettier** | All project files in `site/` — formatting (`.prettierrc`, `.prettierignore`) |

The **lint** job runs first; **build** runs only if lint passes. Both use `npm ci` and the npm cache for speed.

## Local commands (in `site/`)

```bash
npm run lint       # ESLint + stylelint + Prettier check (no write)
npm run lint:fix   # ESLint --fix + stylelint --fix + Prettier --write
npm run format     # Prettier --write only
```

## Editor setup

- **VS Code / Cursor**: Install **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**, and **YAML** extensions. Format on save with Prettier for consistent style.
- **“Unknown at rule @tailwind”**: The repo’s `.vscode/settings.json` sets `css.lint.unknownAtRules: "ignore"` so the built-in CSS validator doesn’t flag Tailwind directives. stylelint (and CI) already allow them via `.stylelintrc.json`.
- **Astro**: The official Astro extension includes ESLint for `.astro`; ensure `eslint.validate` includes `"astro"` in settings.

## Equivalent to “Ruff / Pylance” for this stack

This repo is Astro/TS/HTML/CSS/YAML (no Python), so:

- **ESLint + eslint-plugin-astro** ≈ JS/TS/Astro “lint + type-aware” checks.
- **stylelint** ≈ CSS/SCSS lint.
- **Prettier** ≈ consistent formatting (HTML, CSS, JS, YAML, JSON, MD).
- **yamllint** ≈ YAML and CMS config validation.

No Pylance equivalent is needed; TypeScript and Astro’s types provide editor type-checking.
