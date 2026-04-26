# Project management conventions

This repo manages work in GitHub Issues and a GitHub Project board. The rules below
are the source of truth for how work is created, shaped, routed, and completed.

---

## Where the rules live

| Doc | Purpose |
|-----|--------|
| **[issue-labels.md](issue-labels.md)** | Label taxonomy: source, task-kind, owner, automation state |
| **[ai-workflows.md](ai-workflows.md)** | Lanes, planner policy, routing rules, unblocker behavior, automation inventory |
| **[github-project-board.md](github-project-board.md)** | Board setup, Status field, views, branch model, PR targets |

---

## Conventions at a glance

- **Epics** (`type:epic`): parent deliverables. Title: describe the outcome.
- **Tasks**: child issues, each with exactly one `task:*` and one `owner:*` label.
- **Linking**: use GitHub sub-issues (Relationships sidebar) to attach tasks to their epic.
- **Blocking**: use GitHub issue dependencies (Relationships → Blocked by / Blocking).
- **Status**: Inbox → Planned → Blocked/Ready → In Progress → In Review → Done

---

## How a new issue flows

1. Issue created (from Vercel, GitHub, or a human) — lands in **Inbox** on the board
2. Maintainer adds `automation:plan` — planner workflow runs
3. Planner shapes the issue and adds `automation:planned` — board moves to **Planned**
4. If the issue has dependencies, it becomes **Blocked**; otherwise it's **Ready**
5. When the last blocker closes, `unblocker.yml` releases it to **Ready**
6. AI or human picks it up — **In Progress** → PR opened → **In Review** → merged → **Done**

See `docs/ai-workflows.md` for detailed planner policy and routing rules.

---

## Automated issue-to-PR workflow

```text
Issue created → automation:plan label added → planner runs
→ automation:planned → (blockers clear) → Ready
→ claude-ready added (or @claude comment) → Claude opens PR
→ PR merges into `epic/*` or `dev` (standalone) → close-task-on-merge closes issue
→ unblocker checks dependents
```

**Vercel feedback:** Agreni leaves a comment on the Vercel preview → clicks
"Convert to GitHub Issue" → issue is labeled `source:vercel` → add `automation:plan`
to trigger the planner.

**`@claude` shortcut:** Comment `@claude <instruction>` on any issue or PR to trigger
Claude immediately (no label required).

---

## Branch and PR conventions

| Branch | Targets | Example |
|--------|---------|---------|
| `task/<N>-<slug>` | `epic/<N>-<slug>` (or `dev`) | `task/42-fix-hero-overflow` |
| `epic/<N>-<slug>` | `dev` | `epic/31-homepage-refresh` |
| `dev` | `main` | release PR |

Branch names are enforced by `branch-name-check.yml`.
Issues are closed automatically by `close-task-on-merge.yml` on merge.

---

## Pages CMS content flow

Agreni edits content directly in Pages CMS. These commits go straight to `dev` —
no PR, no issue, no CI. Vercel auto-rebuilds the preview on every push to `dev`.

Content changes do **not** flow through the task/epic/PR pipeline. This is intentional.
See `docs/ai-workflows.md` for details.
