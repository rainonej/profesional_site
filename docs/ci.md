# CI workflow

The main workflow is in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). It runs lint, Astro check, build, and (on `main`) deploy.

## Triggers

| Event | When it runs |
|-------|----------------|
| **pull_request** (into `main`, `dev`, or any **`epic/**`** branch) | When a PR is opened, updated, or synchronized. One run per update to the PR head. |
| **push** (to `main` or `dev`) | Every push to those branches (merge, direct push, Pages CMS commits to `dev`, etc.). |
| **workflow_dispatch** | Manual run from the Actions tab. |

Pushing to a **task** or **epic** branch alone does **not** trigger this workflow until a **PR** is opened against `dev`, `main`, or `epic/**` (then you get one run per PR update).

## Jobs

| Job | What it does |
|-----|--------------|
| **lint** | yamllint (`.pages.yml`, workflows), ESLint, stylelint, Prettier (in `site/`), markdownlint (repo Markdown via `markdownlint-cli2`) |
| **astro-check** | Runs `npm run check` (Astro type and diagnostic check) |
| **build** | Runs `npm run build`; uploads Pages artifact when ref is `main` |
| **deploy** | Only on `main`. Deploys the built site to GitHub Pages |

Jobs run in order: `lint` → `astro-check` and then `build` (both need `lint`; `build` also needs `astro-check`) → `deploy` (only on `main`, needs `build`).

## Auto-update PR branches (merge `dev` into open PRs)

When **`dev` advances** (push to `dev`), the workflow [`.github/workflows/update-pr-branches.yml`](../.github/workflows/update-pr-branches.yml) runs and calls GitHub’s **Update branch** API for **every open PR whose base branch is `dev`**. For each PR, if merging `dev` into the head branch **succeeds**, you get a new merge commit and fresh checks; if GitHub reports a **merge conflict**, that PR is left unchanged until you fix it—the other PRs still update. You can run the same logic on demand via **workflow_dispatch** in the Actions tab (**Auto-update PR branches** → **Run workflow**).

Together, that means:

- Branch protection rules such as **Require branches to be up to date before merging** can be satisfied without clicking **Update branch** on every PR.
- A **new commit** appears on each successfully updated PR branch, which triggers **`pull_request`** workflows again (CI, branch name check, etc.).

**Important:** That update must be performed with a **personal access token** stored as the Actions secret **`WORKFLOW_TRIGGER_PAT`**, not the default `GITHUB_TOKEN`. Events caused by `GITHUB_TOKEN` do not start new workflow runs, so required checks would stay stale and auto-merge could stall. See GitHub’s note on [using `GITHUB_TOKEN` in a workflow](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

**Maintainer setup:** Settings → Secrets and variables → Actions → add **`WORKFLOW_TRIGGER_PAT`** (fine-grained PAT on this repo: **Contents** and **Pull requests** read/write, or classic PAT with `repo` scope).

Fork PRs are skipped (updating the fork’s branch needs the contributor’s permissions).

## Branch protection (recommended)

For `main`, require these status checks before merge:

- **CI / lint**
- **CI / astro-check**
- **CI / build**

(Do not require **CI / deploy** — it only runs on `main` after merge.)

To set this up: **Settings** → **Branches** → **Add branch protection rule** (or edit the rule for `main`) → enable **Require status checks to pass** → search for and select the three job names above.

For **`dev`**, apply the same required checks if you want PRs into `dev` gated the same way.
