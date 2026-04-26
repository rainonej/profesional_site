# Issue labels

Labels encode four things about every issue: where it came from, what kind of work it
is, who executes it, and what automation state it's in.

Every issue should have exactly one label from each applicable group below.

---

## Source labels

Where did this issue originate?

| Label | Meaning |
|-------|---------|
| `source:human` | Opened directly by a human in GitHub |
| `source:vercel` | Created via Vercel's "Convert to GitHub Issue" button on a preview comment |
| `source:cms` | Originated from CMS content (reserved for future use) |

---

## Task-kind labels

What kind of work is this?

| Label | Meaning |
|-------|---------|
| `type:epic` | Parent deliverable with child task issues |
| `task:feat` | Feature implementation |
| `task:bug-fix` | Bug fix |
| `task:decision` | A tracked human decision that blocks other work |
| `task:content` | Content entry or editing |

**Epics vs tasks:** A `type:epic` issue is the parent. Its children are individual tasks,
each with exactly one `task:*` label and one `owner:*` label. Split work so that each
child is clearly one type — if a task needs the site owner to provide copy *and* an
AI to implement it, those are two separate child issues.

---

## Owner labels

Who executes this issue?

| Label | Meaning | When to use |
|-------|---------|-------------|
| `owner:simple-ai` | GitHub Copilot coding agent | Fully specced, small, unambiguous. A clear PR description is all it needs. |
| `owner:agentic-ai` | Claude Code Action | Scoped but multi-file, needs codebase exploration, or benefits from reasoning. |
| `owner:human-dev` | Human developer | Architectural decisions, secrets/infra, security, complex debugging. |
| `owner:site-owner` | Agreni (site/product owner) | Content, copy, positioning, product decisions, approvals. |

**Rule for simple-ai:** Only route to `owner:simple-ai` if the task is completely
specified. Copilot works from the issue text as written; new requirements go on the PR.

**Rule for epics:** Each child gets exactly one `owner:*`. The parent gets the union of
all its children's owner labels.

---

## Automation state labels

What stage is this issue in?

| Label | Meaning |
|-------|---------|
| `automation:plan` | Added by a maintainer to trigger the planner workflow |
| `automation:planned` | Planner has finished shaping this issue |
| `automation:started` | AI execution is currently underway |

---

## Approval gate label

| Label | Meaning |
|-------|---------|
| `claude-ready` | A human has approved this issue for Claude to execute |

This is a temporary gate. When the system is trusted after initial testing, it will be
removed from `claude.yml` so that the unblocker triggers Claude automatically.

---

## Parent/child structure

- **Parent (epic):** `type:epic` + union of all children's `owner:*` labels
- **Children (tasks):** one `task:*` + one `owner:*` each
- Link children as sub-issues (Relationships sidebar → Sub-issues)
- Set blocking relationships where one task truly cannot start until another finishes

See `docs/ai-workflows.md` for the full planning and routing model.

---

## Board and Status hints

These labels align with the GitHub Project **Status** field described in
`docs/github-project-board.md`:

| Label | Typical Status / use on board |
|-------|------------------------------|
| `automation:plan` | Still **Inbox** until planner runs; use **Planner queue** view |
| `automation:planned` | **Planned** (after planner removes `automation:plan`) |
| `automation:started` | Often **In Progress** — workflows add it when Claude starts but **nothing removes it** when a PR opens; clear manually if it drifts |
| `claude-ready` | **Ready** / **In Progress** — required for gated Claude runs |

Executor labels pair with views (e.g. **Ready for Claude**, **Copilot lane**) — see
`.github/project-views/*.json`.
