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
- Merge PRs with `gh pr merge <number> --auto` (merge when CI passes; do not use `--merge` alone, as branch protection blocks until checks pass)
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
- Merging PRs without `--auto` (always use `gh pr merge <number> --auto --merge` so the merge happens after required status checks pass)

---

## Project Layout

The demo website lives in the `/site` subdirectory.

```
professional_site/
├── CLAUDE.md           ← this file
├── README.md
├── .gitignore
├── .github/
│   └── workflows/      ← CI/CD
└── site/               ← website source (Astro / framework TBD)
```

---

## Git Workflow

Two-branch model: `dev` is the integration branch; `main` is production (GitHub Pages deploys from it).

1. Feature work goes on a branch named `feat/<description>` or `fix/<description>`, created from `dev`.
2. Commits use conventional format: `feat:`, `fix:`, `chore:`, `docs:`, etc.
3. Each logical chunk of work ends with a push and a PR **targeting `dev`**.
4. When ready to release, open a PR from `dev` → `main` (release PR).
5. Never force-push `dev` or `main`.

---

## Tech Stack (planned)

- **Framework**: Astro (static-site friendly, component islands)
- **Styling**: Tailwind CSS
- **Deployment target**: GitHub Pages (deploys from `main` only)

---

## Notes for Future Sessions

- Always check existing branches before starting new work (`git branch -a`).
- **Default integration branch is `dev`** — create feature branches from `dev`, and PRs target `dev`.
- Prefer editing existing files over creating new ones when appropriate.
- Keep PRs focused and small — one logical change per PR.
- **Merge PRs with `gh pr merge <number> --auto --merge`** so GitHub merges when CI passes. Auto-merge is enabled on this repo. Do not use `--merge` alone; branch protection blocks until checks pass.
- `dev` → `main` release PRs are opened manually when ready to deploy to production.
