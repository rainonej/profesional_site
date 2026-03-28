# Contributing

## Prerequisites

- Node 20+
- npm

## Setup

```bash
cd site
npm install
```

This also activates the pre-commit hook (husky + lint-staged), which runs Prettier and ESLint on staged files before every commit. If hooks stop firing, re-run `npm install` to restore them.

## Development

```bash
cd site
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build to site/dist/
```

## Linting

CI runs ESLint (Astro/JS/TS), stylelint (CSS), Prettier (formatting), and yamllint (`.pages.yml`, workflow files). Locally:

```bash
cd site
npm run lint      # check only
npm run lint:fix  # fix and format in-place
```

## Branch model

- **Feature/fix branches** are created from `dev` and named `feat/<description>` or `fix/<description>`.
- **PRs target `dev`** (not `main`).
- **Release PRs** go from `dev` → `main` when ready to deploy to GitHub Pages.
- Never force-push `dev` or `main`.

## Commit format

[Conventional commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, etc.

## Merging

Always merge with auto-merge so the PR lands after CI passes:

```bash
gh pr merge <number> --auto --merge
```

## Reference

- CI pipeline details: [docs/ci.md](docs/ci.md)
- Label taxonomy and issue workflow: [docs/issue-labels.md](docs/issue-labels.md)
- Project management conventions: [docs/project-management.md](docs/project-management.md)
