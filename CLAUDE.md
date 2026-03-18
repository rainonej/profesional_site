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
- Force-pushing to `main`
- Merging PRs without `--auto` (always use `gh pr merge <number> --auto` so the merge happens after required status checks pass)

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

1. Feature work goes on a branch named `feat/<description>` or `fix/<description>`.
2. Commits use conventional format: `feat:`, `fix:`, `chore:`, `docs:`, etc.
3. Each logical chunk of work ends with a push and a PR.
4. `main` is the integration branch; never force-push it.

---

## Tech Stack (planned)

- **Framework**: Astro (static-site friendly, component islands)
- **Styling**: Tailwind CSS
- **Deployment target**: GitHub Pages or Netlify (static export)

---

## Notes for Future Sessions

- Always check existing branches before starting new work (`git branch -a`).
- Prefer editing existing files over creating new ones when appropriate.
- Keep PRs focused and small — one logical change per PR.
- **Merge PRs with `gh pr merge <number> --auto`** so GitHub merges when lint/build pass. Do not use `gh pr merge <number> --merge`; branch protection requires status checks and will reject the merge until they pass.
