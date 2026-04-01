# professional_site

A personal / professional website for Agreni, built with Astro + Tailwind CSS.

---

## Links

| | URL | Access |
|---|---|---|
| **Live site** | <https://rainonej.github.io/profesional_site/> | Public |
| **Pages CMS** | <https://app.pagescms.org> | Requires GitHub login |
| **Public preview (Vercel)** | <https://profesional-site.vercel.app> | Public — reflects latest `dev`, no comment toolbar |
| **Review preview (Vercel)** | <https://profesional-site-git-dev-rainonejs-projects.vercel.app> | Requires GitHub login — has comment toolbar for feedback |

The live site reflects `main`. The public preview reflects `dev` and updates within ~1 minute of any CMS save or code push. The review preview URL is generated per deployment — see [CONTRIBUTING.md — Vercel environments](CONTRIBUTING.md#vercel-environments) for details.

---

## Repository structure

```text
professional_site/
├── CLAUDE.md           — Claude Code autonomy configuration
├── CONTRIBUTING.md     — Instructions for site owner, developers, and AI agents
├── README.md           — this file
├── .pages.yml          — Pages CMS configuration
├── .github/
│   └── workflows/      — CI/CD (lint, build, deploy, Claude agent)
└── site/               — website source (Astro)
```

---

## Who are you?

- **Agreni (site owner):** See [CONTRIBUTING.md — Site Owner](CONTRIBUTING.md#site-owner-agreni) for how to edit your content and leave feedback.
- **Developer:** See [CONTRIBUTING.md — Human Developer](CONTRIBUTING.md#human-developer) for setup and workflow.
- **AI agent:** See [CONTRIBUTING.md — AI](CONTRIBUTING.md#ai) and [CLAUDE.md](CLAUDE.md) for autonomy config and constraints.
