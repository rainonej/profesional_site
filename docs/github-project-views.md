# GitHub Project and views for epics and tasks

Use a **GitHub Project** (new Projects, not classic) to get views of:

1. **All Epics** — parent deliverables
2. **Unblocked tasks** — child issues that can be worked on now (no "blocked by" or blockers are closed)
3. **Unblocked but blocking others** — tasks that are not blocked and that block at least one other issue (high leverage to complete next)

You can create the project and views in the GitHub UI; this doc explains how.

---

## 1. Create a project

1. In the repo, go to **Projects** (or your profile/org **Projects**).
2. Click **New project** → **New project** (blank or from template).
3. Name it e.g. **professional_site roadmap**.
4. Under **Add**, link the project to the repository **rainonej/profesional_site** (or **professional_site** if that’s the repo name).

---

## 2. Add views

Create **multiple views** in the same project so you can switch between them.

### Quick add (in the UI)

1. Open your project: [github.com/users/rainonej/projects/2](https://github.com/users/rainonej/projects/2).
2. Click the **"+ New view"** (or view dropdown) and add three **Table** views. For each, set the **view name** and **Filter** as below (click the filter icon / "Filter" and paste the query).

| View name | Filter |
|-----------|--------|
| **Epics** | `label:epic is:open is:issue` |
| **Unblocked tasks** | `is:open is:issue -label:epic -is:blocked` |
| **Unblocked, blocking others** | `is:open is:issue -label:epic -is:blocked is:blocking` |

If `-is:blocked` or `is:blocking` don’t work in your project (filter bar may not support them yet), both task views will show the same list; then use the **Relationships** column to see Blocked by / Blocking, or the static list in View C for “unblocked and blocking” issues.

---

### View A: All Epics

- **Name:** Epics
- **Purpose:** See all parent deliverables (features/epics).
- **How:** Add a **Table** or **Board** view. In the view:
  - **Filter:** `label:epic` and `is:open` (and `is:issue` if the project mixes issues and PRs).
- **Columns (if board):** e.g. Todo, In progress, Done — or keep a single “Open” column and use **Status** or **Labels** to group.

So: filter = `label:epic is:open` gives you only the 10 epic (parent) issues.

### View B: Unblocked tasks (children ready to work on)

- **Name:** Unblocked tasks
- **Purpose:** Child issues that are not blocked (no open “blocked by” dependency).
- **How:** GitHub’s filter does not have a built-in “is:unblocked” yet. Two options:
  - **Manual:** In the project, add a **Board** or **Table** view. Filter by `is:issue is:open -label:epic` to get non-epic issues (the children). Then use the **Relationships** or **Blocked by** field (if you added it to the project) to sort or filter. If the project has a “Blocked by” field linked to issue dependencies, you can show only rows where “Blocked by” is empty.
  - **Saved search:** In **Issues**, use the search: `is:open is:issue repo:rainonej/profesional_site -label:epic` and then scan the sidebar “Blocked by” on each, or use a list view and sort by “Blocked by” count (0 = unblocked). You can bookmark that issue search as a pseudo-view.

**Practical approach:** Filter: `is:open is:issue -label:epic -is:blocked` (if supported). Otherwise same filter as Epics view and use a **Blocked by** or **Relationships** column to see dependencies; sort by “Blocked by” empty for unblocked.

### View C: Unblocked tasks that are blocking others

- **Name:** Unblocked, blocking others
- **Purpose:** Tasks that (a) are not blocked and (b) block at least one other issue. Finishing these unblocks more work.
- **How:** If the project filter bar supports it, use `is:open is:issue -label:epic -is:blocked is:blocking` so only unblocked issues that block at least one other appear. If not, use the same filter as View B and add a **Blocking** column; sort or filter to show issues where Blocking ≥ 1, or use the static list below.

**Current unblocked tasks that block others (as of last update):**  
Issues that have no “Blocked by” and have “Blocking” ≥ 1 are: #35 (blocks #18), #15 (blocks #36), #16 (blocks #37), #19 (blocks #38), #20 (blocks #39), #40 (blocks #21), #23 (blocks #41). So the “unblocked and blocking” set is: **#35, #15, #16, #19, #20, #40, #23** (and single-task epics like #14, #17, #22 are unblocked but don’t block another in-repo issue).

---

## 3. Quick reference: filters

| View            | Purpose                         | Suggested filter / note                                      |
|-----------------|----------------------------------|---------------------------------------------------------------|
| Epics           | All parent deliverables         | `label:epic is:open is:issue`                                 |
| Unblocked tasks | Children with no open blockers   | `is:open is:issue -label:epic -is:blocked` (or use Blocked by column) |
| Blocking others | Unblocked and block ≥1 issue    | `is:open is:issue -label:epic -is:blocked is:blocking` (or use Blocking column) |

---

## 4. Using Projects with issue dependencies

- When you set **Blocked by** / **Blocking** in the issue’s **Relationships** sidebar (or via API), that data is on the issue. Projects that are linked to the repo will show those issues; if the project has a field for “Blocked by” or “Blocking” (from issue relationships), you can show them as columns.
- GitHub’s new Projects can have **custom fields**. If “Blocked by” is not built-in, you can add a **Tracked by** or link field, but the native **Relationships** on the issue (Blocked by / Blocking) are the source of truth; the project just surfaces them when the field is available.

---

## 5. One-time: link project to repo

Ensure the project is linked to **rainonej/profesional_site** (or your repo name) so that repo’s issues appear. Then the views above will show the right issues.

---

## 5b. Status field (what to do with “Status”)

The project’s **Status** column (e.g. Backlog, In progress, Done) is per-item state. Use it so the board reflects reality:

| Status        | Meaning | When to set |
|---------------|--------|-------------|
| **Backlog**   | Not started; no one working on it. | Default for new items. |
| **Todo**      | Ready to be picked up (unblocked, spec clear). | Optional; use if you want a “ready” bucket. |
| **In progress** | Someone is actively working on it (branch open, PR draft, or agent running). | Set when you or an agent starts the task. |
| **Done**      | Delivered (PR merged or issue closed as completed). | Set when the PR is merged or the issue is closed. |

**Recommendation:** Keep it simple: **Backlog** (default) → **In progress** (when you start) → **Done** (when merged/closed). If your template only has “Backlog”, add **In progress** and **Done** in the project’s Status field settings (e.g. **Project settings** → **Fields** → **Status** → add options). You can optionally use **Todo** for “ready and unblocked” so the Epics and Unblocked tasks views double as a prioritization list.

Summary: create one project, add three views (Epics; Unblocked tasks; Unblocked, blocking others), use the filters and optional Blocked by/Blocking columns as above. Use Status to reflect who’s working on what and what’s done.

---

## 6. Optional: create views via API

The REST API can create views: `POST /users/{user_id}/projectsV2/{project_number}/views` with body `{"name":"Epics","layout":"table","filter":"label:epic is:open is:issue"}`. This requires your `gh` token to have the **project** scope. Use **username** in the path (e.g. `rainonej`), not numeric user ID, and **X-GitHub-Api-Version: 2026-03-10**. If you get 404, run:

```bash
gh auth refresh -s project
```

Then from the repo root (user-owned project; use your GitHub username and project number):

```bash
gh api --method POST "users/rainonej/projectsV2/2/views" --input .gh-parent-bodies/view-epics.json -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2026-03-10"
gh api --method POST "users/rainonej/projectsV2/2/views" --input .gh-parent-bodies/view-unblocked-tasks.json -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2026-03-10"
gh api --method POST "users/rainonej/projectsV2/2/views" --input .gh-parent-bodies/view-unblocked-blocking.json -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2026-03-10"
```

The JSON files in `.gh-parent-bodies/` define the three views (Epics, Unblocked tasks, Unblocked, blocking others).
