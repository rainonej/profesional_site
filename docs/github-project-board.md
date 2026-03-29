# GitHub Project board

This document describes how the GitHub Project board is configured, what the Status
field means, and how workflows move issues through it.

The project is at: [github.com/users/rainonej/projects](https://github.com/users/rainonej/projects)

---

## Status field

The board uses a single **Status** field with these values:

| Status | Meaning | Set when |
|--------|---------|----------|
| **Inbox** | New issue, not yet planned | Issue is created (auto-add automation) |
| **Planned** | Planner has shaped this issue | `automation:planned` label is applied |
| **Blocked** | Has one or more open dependencies | Blocking relationship exists |
| **Ready** | No open blockers; work may begin | Last blocker closes (unblocker runs) |
| **In Progress** | Work has actually started | AI execution begins or human picks it up |
| **In Review** | A PR exists and is open | PR is opened |
| **Done** | Issue is closed | Issue closes (`close-task-on-merge` or manually) |

---

## Required board views

| View | Filter | Purpose |
|------|--------|---------|
| **Main Board** | *(all issues)* grouped by Status | Operational overview |
| **Epic View** | `label:type:epic` | All parent deliverables |
| **Decision View** | `label:task:decision` | Tracked human decisions blocking work |
| **AI Queue** | `label:owner:simple-ai,owner:agentic-ai` | Issues ready for AI execution |
| **Human Queue** | `label:owner:human-dev,owner:site-owner` | Issues needing human action |

---

## Branch model

```
task/<number>-<slug>  →  epic/<number>-<slug>  →  dev  →  main
```

| PR type | Head branch | Target branch |
|---------|-------------|---------------|
| Task PR | `task/<N>-<slug>` | `epic/<N>-<slug>` (or `dev` for standalone) |
| Epic PR | `epic/<N>-<slug>` | `dev` |
| Release PR | `dev` | `main` |

Branch names are enforced by `branch-name-check.yml` on every PR.

---

## PR targets and issue auto-close

GitHub only auto-closes issues for PRs merging into the **default branch**. Since
task PRs target `epic/*` (not the default), we use `close-task-on-merge.yml`:

- `task/<N>-*` merged into `epic/*` → closes issue #N
- `epic/<N>-*` merged into `dev` → closes issue #N
- `dev` → `main` (release PR) → no issue to close; this is a deployment event

---

## Blockers and dependencies

Use GitHub's native **sub-issues** and **issue dependencies**:

- **Sub-issues**: epic → child task hierarchy (Relationships sidebar → Sub-issues)
- **Blocking**: task B is blocked by task A (Relationships sidebar → Blocked by)

When a blocking issue closes, `unblocker.yml` runs and releases newly unblocked issues.

**Good blockers:**
- Final copy must be approved before implementation
- Task B depends on Task A's refactor landing first
- A scope decision must happen before work starts

**Not blockers:**
- Things that could proceed independently
- Vague "probably related" relationships
- Approvals not actually on the critical path

---

## How workflows move issues

| Event | Workflow | Board effect |
|-------|----------|-------------|
| Issue created | *(GitHub auto-add)* | Inbox |
| `automation:planned` label applied | planner.yml | Inbox → Planned |
| Blocking relationship added | *(manual)* | Planned → Blocked |
| Last blocker closes | unblocker.yml | Blocked → Ready |
| `claude-ready` label added or `@claude` comment | claude.yml | Ready → In Progress |
| PR opened | *(GitHub native)* | In Progress → In Review |
| `task/*` PR merged into `epic/*` | close-task-on-merge.yml | In Review → Done |
| `epic/*` PR merged into `dev` | close-task-on-merge.yml | In Review → Done |

> **Note:** Status field updates (e.g. Blocked → Ready) are performed by `unblocker.yml`
> via the GitHub Projects GraphQL API. The other transitions above may need to be set
> manually or via additional GitHub Projects automations configured in the UI.

---

## GitHub Project automations (built-in)

Configure these in the project Settings → Workflows:

| Automation | Setting |
|------------|---------|
| Auto-add issues from repo | On — adds new issues as Inbox |
| Item closed → Done | On |
| Pull request merged → Done | On |

---

## One-time setup checklist

- [ ] Status field has all 7 values: Inbox, Planned, Blocked, Ready, In Progress, In Review, Done
- [ ] Main Board view grouped by Status
- [ ] Epic View with filter `label:type:epic`
- [ ] Decision View with filter `label:task:decision`
- [ ] AI Queue with filter `label:owner:simple-ai,owner:agentic-ai` (or two separate labels)
- [ ] Human Queue with filter `label:owner:human-dev,owner:site-owner`
- [ ] Auto-add automation enabled for this repository
