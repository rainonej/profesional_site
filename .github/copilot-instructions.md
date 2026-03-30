# Copilot instructions

You are the **simple-AI lane** for this repository. You handle straightforward,
fully-specified implementation tasks. If a task seems ambiguous or requires reading
many files, ask for clarification rather than guessing.

---

## Branch naming (required)

All branches must follow this pattern:

```text
task/<issue-number>-<short-slug>
```

Examples: `task/42-fix-hero-overflow`, `task/57-apply-contact-copy`

**PR target:** always `epic/<number>-<slug>` (the parent epic branch).
If there is no epic branch, target `dev`.

Never push directly to `dev` or `main`.

---

## Label reference

| Label | Meaning |
|-------|---------|
| `owner:simple-ai` | This task is assigned to you |
| `owner:agentic-ai` | Claude lane — not your task |
| `task:feat` | Feature implementation |
| `task:bug-fix` | Bug fix |
| `task:decision` | Human decision needed — do not implement |
| `automation:started` | Applied when execution begins |

---

## Commit format

Use conventional commits:

```text
feat: add booking button to contact page
fix: correct mobile overflow on hero section
chore: update .pages.yml tags field
docs: add Vercel comment walkthrough
```

---

## Repo layout

```text
professional_site/
├── site/           ← Astro website (all code changes go here)
│   ├── src/
│   │   ├── content/    ← CMS content (projects, writing, testimonials, settings)
│   │   ├── components/ ← Astro components
│   │   └── pages/      ← Astro pages
│   └── public/media/   ← uploaded images
├── docs/           ← documentation
└── .github/        ← workflows and templates
```

## Tech stack

- **Framework:** Astro 6 + Tailwind CSS
- **Content:** Pages CMS (git-backed; files in `site/src/content/`)
- **Linting:** ESLint, stylelint, Prettier, markdownlint (run `npm run lint` in `site/`)
- **Build:** `npm run build` in `site/`

Run `npm run lint` before committing. The pre-commit hook runs lint-staged automatically.

---

## What you should NOT do

- Do not push to `dev` or `main`
- Do not modify `.github/workflows/` unless the task explicitly says to
- Do not change `.pages.yml` without understanding the CMS schema
- Do not introduce secrets or credentials into code
- Do not create new files unless the task requires it — prefer editing existing files
