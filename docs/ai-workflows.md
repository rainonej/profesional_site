# AI workflows and delivery automation

This document describes how work flows through this repository: from issue creation to
planning, execution, unblocking, and deployment.

---

## Work lanes

There are five lanes. Every issue is assigned to exactly one.

| Lane | Label | Who | When to use |
|------|-------|-----|-------------|
| **Planner** | *(no owner label — planner is a meta-lane)* | Claude (planner workflow) | Shapes incoming issues into executable tasks |
| **Simple AI** | `owner:simple-ai` | GitHub Copilot coding agent | Fully specced, small, unambiguous tasks |
| **Agentic AI** | `owner:agentic-ai` | Claude Code Action | Scoped but multi-file or needs reasoning |
| **Human dev** | `owner:human-dev` | Human developer | Architectural, risky, secrets/infra, high judgment |
| **Site owner** | `owner:site-owner` | Agreni | Content, copy, decisions, approvals |

---

## Label taxonomy

Every issue should have exactly one label from each applicable group:

### Source labels — where did this issue come from?
| Label | Meaning |
|-------|---------|
| `source:human` | Opened directly by a human in GitHub |
| `source:vercel` | Created via Vercel's "Convert to GitHub Issue" button |
| `source:cms` | Originated from CMS content (reserved for future use) |

### Task-kind labels — what kind of work is this?
| Label | Meaning |
|-------|---------|
| `type:epic` | Parent deliverable; has child task issues |
| `task:feat` | Feature implementation |
| `task:bug-fix` | Bug fix |
| `task:decision` | A tracked human decision that blocks other work |
| `task:content` | Content entry or editing |

### Owner labels — who executes this?
| Label | Meaning |
|-------|---------|
| `owner:simple-ai` | Copilot; task is fully specced and small |
| `owner:agentic-ai` | Claude; task needs reasoning or reads multiple files |
| `owner:human-dev` | Human developer |
| `owner:site-owner` | Site owner (Agreni) |

### Automation state labels
| Label | Meaning |
|-------|---------|
| `automation:plan` | Triggers the planner workflow |
| `automation:planned` | Planner has shaped this issue |
| `automation:started` | AI execution is underway |

### Approval gate
| Label | Meaning |
|-------|---------|
| `claude-ready` | Human has approved this issue for Claude to execute automatically |

> **Note:** `claude-ready` is a temporary gate. Once the system is trusted, it will be
> removed so that Claude auto-starts when the unblocker releases a task. To remove it,
> delete the `issues: labeled` trigger block in `.github/workflows/claude.yml`.

---

## Work sources

Issues come from three places:

| Source | Flow |
|--------|------|
| **Vercel preview comments** | Agreni leaves a comment on the preview → clicks "Create GitHub Issue" in Vercel → issue created with `source:vercel` |
| **Human-opened GitHub issues** | Developer or site owner opens an issue directly → add `source:human` |
| **CMS** | Reserved; not currently active |

---

## The planner

The planner is an AI that shapes incoming issues. It never writes code.

### Trigger
Add the `automation:plan` label to any issue.

### What the planner does
It reads the issue and chooses one of four paths:

**Path A — Clear single task**
The issue is concrete. Planner adds `source:*`, `task:*`, `owner:*` labels,
removes `automation:plan`, adds `automation:planned`.

**Path B — Multi-step work (epic)**
The issue needs multiple PRs. Planner labels the parent `type:epic`, creates child
issues (each with one `source:*`, `task:*`, `owner:*`), sets blocking relationships,
and adds `automation:planned` to the parent.

**Path C — Small ambiguity**
A small piece of information is missing. Planner asks in comments.
A maintainer re-adds `automation:plan` once the question is answered.

**Path D — Decision task**
The missing information is a substantial blocker. Planner creates a child
`task:decision` issue assigned to the appropriate owner, sets it as a dependency,
and marks the parent `automation:planned`.

### Clarification policy
- Use **Path C** (comment) when the missing information is small: which URL, which font,
  is this copy approved?
- Use **Path D** (decision task) when the decision blocks multiple tasks, may not happen
  soon, or belongs to a specific owner who needs to track it.

---

## Routing rules by task kind

| Task kind | Can be routed to |
|-----------|-----------------|
| `task:feat` | `owner:simple-ai`, `owner:agentic-ai`, `owner:human-dev` |
| `task:bug-fix` | `owner:simple-ai`, `owner:agentic-ai`, `owner:human-dev` |
| `task:decision` | `owner:site-owner`, `owner:human-dev` |
| `task:content` | `owner:site-owner`; sometimes `owner:simple-ai`/`owner:agentic-ai` if applying already-approved content |

**Simple AI routing rule**: only route to `owner:simple-ai` if the task is completely
specified. Copilot works from the issue text as written; additional clarification goes
on the PR it raises, not the issue.

---

## Pages CMS — the site owner content lane

Agreni edits content in Pages CMS (app.pagescms.org). Pages CMS commits directly to
`dev` — no PR, no branch, no CI check. This is intentional.

```
Agreni saves in Pages CMS → direct commit to dev → Vercel detects push
→ profesional-site.vercel.app rebuilds automatically
```

CMS commits bypass the task/epic/PR delivery pipeline entirely. Content is the
`owner:site-owner` lane and does not need code review.

> **If the preview stops updating after a CMS save:** check that the Pages CMS app
> (app.pagescms.org) is still configured to target the `dev` branch. This is set in
> the Pages CMS project settings, not in `.pages.yml`.

---

## Automation workflows

Five workflows handle the full lifecycle. All logic is inlined in the YAML — no external scripts.

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **Planner** | `planner.yml` | `automation:plan` label added | Shapes issues into executable tasks |
| **Claude** | `claude.yml` | `claude-ready` label OR `@claude` comment | Executes agentic-AI tasks |
| **Branch name check** | `branch-name-check.yml` | PR opened/updated | Enforces branch naming convention |
| **Close task on merge** | `close-task-on-merge.yml` | PR merged | Auto-closes issues from branch name |
| **Unblocker** | `unblocker.yml` | Issue closed | Releases newly unblocked dependent issues |

### Unblocker behavior

When any issue closes, the unblocker:
1. Finds issues that were blocked by the closed issue (via GraphQL `trackedByIssues`,
   with fallback to scanning issue bodies for `Blocked by #N` text).
2. For each candidate, checks if all its blockers are now closed.
3. If fully unblocked:
   - Posts a comment saying the issue is now **Ready**.
   - If `owner:agentic-ai` + `claude-ready`: posts `@claude` to trigger execution.
   - If `owner:simple-ai`, `owner:human-dev`, `owner:site-owner`: leaves at Ready.

---

## End-to-end examples

### Vercel comment → single bug fix → merged

1. Agreni comments on Vercel preview.
2. Comment is converted to GitHub issue (Vercel GitHub Issues integration).
3. Maintainer adds `automation:plan`.
4. Planner labels it `source:vercel`, `task:bug-fix`, `owner:simple-ai`, `automation:planned`.
5. Maintainer adds `claude-ready` (or assigns to Copilot).
6. Claude/Copilot opens PR on `task/<N>-<slug>` targeting `epic/*`.
7. PR merges → `close-task-on-merge` closes the issue.
8. `unblocker` checks for newly unblocked dependents.

### Human epic → decision blocks implementation

1. Developer opens "Epic: homepage refresh".
2. Maintainer adds `automation:plan`.
3. Planner creates:
   - `task:decision` "Approve final hero copy" → `owner:site-owner`
   - `task:feat` "Implement hero section" → `owner:agentic-ai` (blocked by decision)
4. Agreni resolves the copy decision and closes the decision issue.
5. `unblocker` releases the hero implementation task.
6. Maintainer adds `claude-ready`; Claude starts working.

---

## Prerequisites for full automation

| Prerequisite | Status | Issue |
|-------------|--------|-------|
| `ANTHROPIC_API_KEY` secret in GitHub Actions | Required for planner.yml and claude.yml | #78 |
| Vercel GitHub Issues integration installed | Required for source:vercel flow | #83 |
