# CI workflow

The main workflow is in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). It runs lint, Astro check, build, and (on `main`) deploy.

## Triggers

| Event | When it runs |
|-------|----------------|
| **pull_request** (into `main`, `dev`, or any `epic/**` branch) | When a PR is opened or updated |
| **push** (to `main` or `dev`) | Every push to those branches (includes Pages CMS commits to `dev`) |
| **workflow_dispatch** | Manual run from the Actions tab |

Pushes to other branches do **not** trigger CI until a PR is opened.

## Jobs

| Job | What it does |
|-----|--------------|
| **lint** | yamllint (`.pages.yml`, workflows), ESLint, stylelint, Prettier, markdownlint |
| **astro-check** | Runs `npm run check` (Astro type and diagnostic check) |
| **build** | Runs `npm run build`; uploads Pages artifact when ref is `main` |
| **deploy** | Only on `main`. Deploys the built site to GitHub Pages |

Jobs run in order: `lint` → `astro-check` and then `build` (both need `lint`; `build` also needs `astro-check`) → `deploy` (only on `main`, needs `build`).

## Branch protection (recommended)

For `main`, require these status checks before merge:

- **CI / lint**
- **CI / astro-check**
- **CI / build**

(Do not require **CI / deploy** — it only runs on `main` after merge.)

To set this up: **Settings** → **Branches** → **Add branch protection rule** (or edit the rule for `main`) → enable **Require status checks to pass** → search for and select the three job names above.
