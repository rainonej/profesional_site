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

## Admin page (`/admin`)

The site includes a private **Admin** page for maintainers: live design tokens (color swatches from CSS variables), typography samples, interactive UI previews, and a Mermaid diagram of site routes. It is meant for design review and orientation, not public visitors.

- **URLs:** The admin page only runs on **Vercel** (server routes for GitHub OAuth and session cookies), not on GitHub Pages (`rainonej.github.io/...`). It is available on both Production and Preview origins — e.g. <https://profesional-site.vercel.app/admin> on the public Production alias. **Vercel’s comment toolbar** (pin comments, convert to GitHub issues) appears only on **Preview** deployments, not on that Production host. For feedback that uses the toolbar **and** the admin overview, open **`/admin` on the review preview:** <https://profesional-site-git-dev-rainonejs-projects.vercel.app/admin> (see [CONTRIBUTING.md — Vercel environments](CONTRIBUTING.md#vercel-environments)).

See [CONTRIBUTING.md — Setting up the admin page](CONTRIBUTING.md#setting-up-the-admin-page) for OAuth and environment variables.

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
