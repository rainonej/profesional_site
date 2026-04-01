# GitHub Project board

This document describes how the GitHub Project is configured: **Status** values, **views**,
branch flow, and how Actions interact with issues. **Versioned view definitions** (API
request bodies) live under [`.github/project-views/`](../.github/project-views/) — see
[Syncing views from the repo](#syncing-views-from-the-repo).

Project hub: [github.com/users/rainonej/projects](https://github.com/users/rainonej/projects)

---

## Related GitHub issues (tracking)

| Item | Role |
|------|------|
| **#34** | Epic: Documentation and launch content — docs + `.github/project-views/` |
| **#31** | Epic: CI complete and PR previews — `close-task-on-merge.yml` and merge automation |
| **#81** | Epic: Usable Contributing Guide — CONTRIBUTING / developer-facing CI text |
| **#78** | Open: `ANTHROPIC_API_KEY` — required to test planner/Claude in Actions |
| **#89** (closed) | Prior delivery automation epic; **#91** / **#92** implemented first workflow + doc wave |

Reference these in PR bodies when shipping changes that match that scope.

---

## Status field

Use a single **Status** field with these values (aligns with labels and automations):

| Status | Meaning | Set when |
|--------|---------|----------|
| **Inbox** | New issue, not yet planned | Issue created (auto-add automation) |
| **Planned** | Planner has shaped this issue | `automation:planned` label applied |
| **Blocked** | Open dependencies | Blocking relationship exists |
| **Ready** | No open blockers; work may begin | Maintainer sets Status; unblocker **comments** when blockers clear (see below) |
| **In Progress** | Work started | Human/agent picks up; optional `automation:started` |
| **In Review** | Open PR linked | Native automation or manual |
| **Done** | Closed / delivered | Issue closed or native “Item closed → Done” |

`unblocker.yml` **does not** call the GitHub Projects API — it **comments** on issues that
are newly unblocked. Move **Blocked → Ready** in the Project UI when that comment appears
(or rely on your own discipline). Optional future workflow could set Status with
`projects: write`.

---

## View definitions (versioned in git)

Each row matches a JSON file in `.github/project-views/`. Filters use the project search
syntax; verify in the UI if the API rejects a query.

| View | JSON file | Filter (summary) |
|------|-----------|------------------|
| Epics | `epics.json` | Open issues with `type:epic` |
| Decisions | `decisions.json` | Open issues with `task:decision` |
| Planner queue | `planner-queue.json` | Open issues with `automation:plan` |
| Ready for Claude | `ready-for-claude.json` | Open, `claude-ready` + `owner:agentic-ai` |
| Copilot lane | `copilot-lane.json` | Open, `owner:simple-ai` + `automation:planned` |
| Tasks (unblocked) | `tasks-unblocked.json` | Open non-epics, `-is:blocked` if supported |
| Tasks unblocked, blocking | `tasks-unblocked-blocking.json` | Above + `is:blocking` if supported |
| Human dev | `human-dev.json` | Open, `owner:human-dev` |
| Site owner | `site-owner.json` | Open, `owner:site-owner` |

**Main board:** keep a default **Board** or **Table** grouped by **Status** (no filter or
`is:issue`). That layout is easiest to set once in the UI rather than duplicating here.

If `-is:blocked` / `is:blocking` are unsupported in your project, use the Relationships
columns and the owner/label views above.

---

## Syncing views from the repo

1. Change or add JSON under `.github/project-views/`.
2. Merge to your integration branch.
3. With a token that has **project** scope, run the loop in
   [`.github/project-views/README.md`](../.github/project-views/README.md) (set `USER`,
   `PROJECT_NUMBER`, and `X-GitHub-Api-Version` per current GitHub docs).

Alternatively, open each JSON file and **paste the `filter`** string into **New view →
Filter** in the Project UI.

**Not in JSON:** Project **Settings → Workflows** automations (e.g. **Auto-add issues**,
**Item closed → Done**, **Pull request merged → Done**). Configure those once in GitHub;
they are not exported with these files.

---

## Branch model

```text
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

GitHub only auto-closes linked issues when a PR merges into the **default branch**. Task
PRs usually target `epic/*`, so [`.github/workflows/close-task-on-merge.yml`](../.github/workflows/close-task-on-merge.yml)
closes by **branch name**:

| Merge | Issue closed |
|-------|----------------|
| `task/<N>-*` → `epic/*` | #N |
| `task/<N>-*` → `dev` | #N (standalone tasks) |
| `epic/<N>-*` → `dev` | #N |
| `dev` → `main` | *(none — release only)* |

If the workflow cannot close an issue, it **fails the job** so logs show the error (unless
the issue is already closed).

---

## Blockers and dependencies

- **Sub-issues:** epic → child tasks (Relationships → Sub-issues).
- **Blocking:** Relationships → Blocked by / Blocking.
- When a blocking issue closes, `unblocker.yml` finds dependents and **comments**; it may
  post `@claude` when `owner:agentic-ai` and `claude-ready` are both present.

---

## How workflows relate to the board

| Event | Workflow | Typical board follow-up |
|-------|----------|-------------------------|
| Issue created | Auto-add | Inbox |
| `automation:planned` | planner | Planned (or manual) |
| Blockers | manual | Blocked |
| Last blocker closed | unblocker | Comment → set **Ready** manually |
| `claude-ready` / `@claude` | claude | In Progress |
| PR opened | native / manual | In Review |
| Task/epic merge per table above | close-task-on-merge | Issue closes → Done |

Other workflows: **`update-pr-branches.yml`** (on push to `dev`, updates open PRs targeting
`dev` so auto-merge is not stuck behind “behind dev”). See [docs/ai-workflows.md](ai-workflows.md).

---

## One-time checklist

- [ ] Status field has all seven values above
- [ ] Main view grouped by Status
- [ ] Auto-add, Item closed → Done, PR merged → Done (as desired)
- [ ] Apply views from `.github/project-views/*.json` via API or UI
- [ ] Confirm filters parse (especially `-is:blocked` / `is:blocking`)
