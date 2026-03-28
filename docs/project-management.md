# Project management conventions

This repo records how we manage work in GitHub Issues and Projects. The rules below are the source of truth for epics, tasks, labels, blocking, and views.

---

## Where the rules live

| Doc | Purpose |
|-----|--------|
| **[issue-labels.md](issue-labels.md)** | Executor labels (simple-ai, agentic-ai, human-dev, needs-site-owner), parent/child structure, epic vs task titles, linking and blocking. |
| **[github-project-views.md](github-project-views.md)** | GitHub Project setup, three views (Epics, Unblocked tasks, Unblocked blocking others), filters, Status field usage, optional API commands. |
| **[epic-briefs.md](epic-briefs.md)** | Human-readable epic briefs (goal, context, success criteria, scope). Used as parent issue bodies and as input for agents that split epics into tasks. |

---

## Conventions at a glance

- **Parents** = Epics. Title: **Epic: &lt;name&gt;** (e.g. Epic: Single CMS path). Label: **epic**. Labels = epic + union of children’s executor labels.
- **Children** = Tasks. Title = **task name only** (no "Epic N:"). Exactly **one** executor label per child (simple-ai, agentic-ai, human-dev, or needs-site-owner).
- **Linking:** Sub-Issues API so Relationships show parent; parent body has task list `- [ ] #N`; each child body has `**Parent:** #M`.
- **Blocking:** Use issue dependencies (Relationships → Blocked by / Blocking). API: `POST .../issues/{n}/dependencies/blocked_by` with `{"issue_id": blocker_id}`.
- **Project views:** Epics (`label:epic is:open`), Unblocked tasks (`-label:epic -is:blocked`), Unblocked blocking others (`-label:epic -is:blocked is:blocking`). Status: Backlog → In progress → Done.

When in doubt, open the doc above that matches what you’re doing (labels/structure, project/views, or epic content).

---

## Automated issue-to-PR workflow (Vercel Comments + Claude)

The repo has a GitHub Action (`claude-agent.yml`) that lets Claude implement issues automatically. The label system drives it:

1. **Site owner leaves a comment** on a Vercel Preview deployment (the per-deployment hash URL shared by the developer — the comment toolbar is not available on the public alias `profesional-site.vercel.app`) using the Vercel comment toolbar.
2. **Convert to GitHub Issue** — click the button in the Vercel comment thread to create a GitHub issue with the comment text and a screenshot.
3. **Triage the issue** — add an executor label and optionally add `from-vercel`:
   - `simple-ai` — straightforward change (copy, layout tweak, small component fix)
   - `agentic-ai` — multi-step work (new section, refactor, content model change)
   - `human-dev` — needs a human (secrets, infrastructure, architectural decisions)
4. **Approve for automation** — when ready, add `claude-ready`. This triggers the GitHub Action:
   - `simple-ai + claude-ready` → Claude runs with a simple config (fast model, low max-turns)
   - `agentic-ai + claude-ready` → Claude runs with a full agentic config (high max-turns)
5. **Claude opens a PR** targeting `dev` → CI runs → Vercel creates a new preview.
6. **Review the preview** → merge or leave follow-up comments → repeat.

**`@claude` shortcut:** Comment `@claude <instruction>` on any issue to trigger Claude immediately (uses the simple config, no label required).

**Required secret:** `ANTHROPIC_API_KEY` must be set in GitHub repo Settings → Secrets and variables → Actions for the action to work.
