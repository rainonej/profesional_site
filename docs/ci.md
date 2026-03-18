# CI workflow

The main workflow is in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). It runs lint, Astro check, build, and (on main) deploy.

## Triggers

| Event | When it runs |
|-------|----------------|
| **pull_request** (targeting `main`) | When a PR is opened or updated. One run per PR update. |
| **push** (to `main` only) | When commits are pushed to `main` (e.g. after a merge). One run per push. Deploy runs in this case. |
| **workflow_dispatch** | Manual run from the Actions tab. |

Pushing to a feature branch does **not** trigger the workflow (so you get one run per PR, not duplicate runs).

## Jobs

| Job | What it does |
|-----|----------------|
| **lint** | YAML lint (Pages CMS, Decap, workflows), ESLint, stylelint, Prettier. |
| **astro-check** | Runs `npm run check` (Astro type and diagnostic check). |
| **build** | Runs `npm run build` (Astro build). Uploads artifact when on `main`. |
| **deploy** | Only on `main`. Deploys the built site to GitHub Pages. |

Jobs run in order: `lint` → `astro-check` and then `build` (both need `lint`; `build` also needs `astro-check`) → `deploy` (only on `main`, needs `build`).

## Branch protection (recommended)

For `main`, require these status checks before merge:

- **CI / lint**
- **CI / astro-check**
- **CI / build**

(Do not require **CI / deploy** — it only runs on `main` after merge.)

To set this up: **Settings** → **Branches** → **Add branch protection rule** (or edit the rule for `main`) → enable **Require status checks to pass** → search for and select the three job names above.
