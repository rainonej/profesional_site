# Claude Code — Autonomous Development Config

This file grants Claude Code expanded autonomy for developing the demo website
inside this repository. It is intentionally stored at the repo root so it applies
to every conversation opened in this directory.

---

## Scope

All autonomous actions are sandboxed to this repository:
`c:/Users/raino/GitHub/professional_site/`

---

## Allowed Actions (no confirmation required)

- Read, create, edit, or delete **any file inside this repository**
- Create and switch git branches
- Commit changes with descriptive messages
- Push branches to `origin`
- Open pull requests via `gh pr create`
- Merge PRs with `gh pr merge <number> --auto --merge` (merge when CI passes; do not use `--merge` alone)
- Install dependencies inside the repo (`node_modules/`, `.venv/`, etc.)
- Run build, dev, lint, format, and test commands
- Create CI/CD configuration files (`.github/workflows/`)
- Restructure directories within the repo
- Create `.env.local` files containing only placeholder values

---

## Hard Limits (always require explicit user approval)

- Any action outside this repository directory
- Installing global software (`npm install -g`, `pip install --user`, etc.)
- Modifying OS or system configuration
- Accessing SSH keys, secrets, or credentials beyond placeholders
- Force-pushing to `main` or `dev`
- Merging PRs without `--auto` (branch protection blocks until checks pass)

---

## Project Layout

```text
professional_site/
├── CLAUDE.md           ← this file
├── CONTRIBUTING.md
├── README.md
├── .gitignore
├── .pages.yml          ← Pages CMS config
├── .github/
│   ├── copilot-instructions.md   ← Copilot coding agent instructions
│   └── workflows/      ← CI/CD and automation
├── docs/               ← documentation
└── site/               ← Astro website source
```

---

## Branch and PR conventions

Three-stage branch flow:

```
task/<number>-<slug>  →  epic/<number>-<slug>  →  dev  →  main
```

| Branch | Targets | Notes |
|--------|---------|-------|
| `task/<N>-<slug>` | `epic/<N>-<slug>` (or `dev` for standalone) | One issue per task branch |
| `epic/<N>-<slug>` | `dev` | Groups related task branches |
| `dev` | `main` | Release PR |

- Branch names are enforced by `branch-name-check.yml` — non-conforming names fail CI
- Issues close automatically when their branch merges (`close-task-on-merge.yml`)
- Always use `gh pr merge <number> --auto --merge`
- Never force-push `dev` or `main`

---

## Tech Stack

- **Framework**: Astro 6 (static-site, component islands)
- **Styling**: Tailwind CSS
- **CMS**: Pages CMS (git-backed, configured in `.pages.yml`)
- **Hosting (production)**: GitHub Pages (deploys from `main`)
- **Hosting (preview)**: Vercel (tracks `dev`; preview at <https://profesional-site.vercel.app>)

---

## Automation workflows

Five workflows handle the issue lifecycle. All logic is inline in the YAML — no external scripts.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `planner.yml` | `automation:plan` label | AI shapes issues into executable tasks |
| `claude.yml` | `claude-ready` label OR `@claude` comment | Executes agentic-AI tasks |
| `branch-name-check.yml` | PR opened/updated | Enforces branch naming convention |
| `close-task-on-merge.yml` | PR merged | Auto-closes issues from branch name |
| `unblocker.yml` | Issue closed | Releases newly unblocked dependent issues |

---

## Label taxonomy

| Group | Labels |
|-------|--------|
| **Owner** | `owner:simple-ai`, `owner:agentic-ai`, `owner:human-dev`, `owner:site-owner` |
| **Task kind** | `type:epic`, `task:feat`, `task:bug-fix`, `task:decision`, `task:content` |
| **Source** | `source:human`, `source:vercel`, `source:cms` |
| **Automation state** | `automation:plan`, `automation:planned`, `automation:started` |
| **Approval gate** | `claude-ready` |

---

## Notes for Future Sessions

- Always check existing branches before starting new work: `git branch -a`
- **Branch naming is enforced** — use `task/<number>-<slug>` and `epic/<number>-<slug>` formats
- **PR targets:** task branches → epic branches; epic branches → `dev`; never directly to `main`
- Prefer editing existing files over creating new ones
- Keep PRs focused — one logical change per PR
- `git pull --all` can error even when tracking is set; use `git pull` directly
- **`claude-ready` is a temporary approval gate** — it is one removable `if:` condition in `claude.yml`. When the system is trusted, delete the `issues: labeled` trigger block from that file.
- **`ANTHROPIC_API_KEY` secret** must be set in GitHub repo Settings → Secrets → Actions for `planner.yml` and `claude.yml` to work. Adding/rotating secrets is a hard limit — requires human action. See issue #78.
- **Vercel feedback workflow:** Agreni leaves comments on the Vercel preview → "Create GitHub Issue" → add `automation:plan` to trigger the planner. See `docs/ai-workflows.md`.
- **Pages CMS:** Agreni edits content directly — commits go to `dev` with no PR. Vercel auto-rebuilds. Content changes bypass the task/epic/PR pipeline entirely.
- **Abandoned:** `notesToDevTeam` CMS fields and `cms-notes-to-issues.yml` — never implemented. Issues #30, #38, #19 are closed. Do not attempt to build this.
- See `docs/ai-workflows.md` for the full operating model, and `docs/github-project-board.md` for board setup.
