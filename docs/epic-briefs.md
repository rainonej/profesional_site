# Epic briefs (source for parent issue bodies)

Epics are parent issues with title **Epic: &lt;name&gt;** and label **`type:epic`**. Each epic body is written for humans first: enough context and success criteria that a person can hand it to an agent, who then splits it into tasks (child issues), assigns exactly one **`owner:*`** and one **`task:*`** label per task, and sets blocking relationships where one task depends on another.

---

## Epic: Single CMS path

**Goal:** Editors and contributors have one clear way to edit content. No conflicting tools or configs.

**Context:** The repo currently supports both Pages CMS (`.pages.yml`) and Decap CMS (`site/public/admin/`). CI and README assume GitHub Pages; Decap is set up for Netlify. This confuses contributors and makes docs and automation harder.

**Success criteria:**

- A single editor path is documented (e.g. "Use Pages CMS at app.pagescms.org").
- Config and UI for the rejected path are removed or clearly deprecated (with a short note where to look if someone needs them).

**Scope:** Decide Pages CMS + GitHub Pages vs Decap + Netlify; remove or deprecate the other path. Update `docs/architecture.md` and any README/collaborator docs.

**Out of scope:** Migrating content between CMSs; adding a new CMS.

**Tasks (sub-issues):** See issue body. When splitting: each task gets exactly one `owner:simple-ai`, `owner:agentic-ai`, `owner:human-dev`, or `owner:site-owner`. Add "blocked by" where a task depends on another (e.g. "Remove Decap" blocked by "Document decision").

---

## Epic: Site reflects positioning

**Goal:** Site messaging and information architecture match the site owner's real positioning: equitable learning, teacher development, STEM access, public scholarship, collaboration (per project brief). Not generic "creative professional" portfolio.

**Context:** Target audiences are PhD committees, education community, and consulting clients. Current copy and IA don't reflect that.

**Success criteria:**

- Homepage, about, and nav speak to those audiences.
- Messaging aligns with `docs/project-brief.md` (tone, content pillars).

**Scope:** Copy and IA changes. No new pages required unless the brief calls for them.

**Out of scope:** New content types (blog, testimonials) — those are other epics.

**Tasks:** (1) Site owner provides positioning, key messaging, and copy. (2) Implement brand and IA changes (copy, nav, layout). Task 2 is blocked by task 1.

---

## Epic: Blog, testimonials, richer settings

**Goal:** Blog/writing and testimonials exist and are editable via the CMS. Settings model is richer where needed (e.g. for booking or CTAs).

**Context:** Project brief calls for public scholarship and evidence; currently there is no blog or testimonials. Settings are in `main.json` with limited fields.

**Success criteria:**

- Blog/writing collection and at least one page; CMS can create/edit posts.
- Testimonials collection and a place they appear (e.g. homepage or about).
- Richer settings if needed for other epics (e.g. booking URL).

**Scope:** Content model, routes, CMS config, and minimal UI. Content itself can be a separate task (site owner).

**Out of scope:** Full CMS migration; redesign.

**Tasks:** (1) Implement blog, testimonials, singleton pages, CMS config. (2) Content for blog/testimonials (site owner). Task 2 blocked by task 1.

---

## Epic: Type-safe content and no placeholders

**Goal:** Content is type-safe (schemas where it matters) and the live site has no placeholder copy or broken booking URL.

**Context:** Settings are loaded via raw JSON import; some content still has placeholder text and PLACEHOLDER Calendly URL.

**Success criteria:**

- Schemas (e.g. content collections or validated settings) where we want type safety.
- Placeholder copy and booking URL replaced by real values or by editable settings.

**Scope:** content.config.ts (or equivalent), settings as data where appropriate; removal of hardcoded placeholders.

**Out of scope:** Full rewrite of all copy; that's site owner.

**Tasks:** (1) Content schemas and refactor. (2) Replace placeholder copy and booking URL (site owner). Task 2 blocked by task 1 (so wiring exists).

---

## Epic: Editor help and guidance

**Goal:** Editors get clear help text in the CMS and one documented editor entry point.

**Context:** Pages CMS (or chosen CMS) fields may have no hints; contributors may not know which tool to use.

**Success criteria:**

- Major editable fields have help/hint text where useful.
- `docs/architecture.md` (or collaborator doc) states the single editor path.

**Scope:** `.pages.yml` (or Decap config) hints; doc updates.

**Out of scope:** Building a new CMS; changing field types.

**Tasks:** One or more tasks; each with exactly one executor label. If site owner writes help text, that's an `owner:site-owner` task.

---

## Epic: Editor notes become issues

**Goal:** Editor notes (e.g. notes_to_dev_team) flow into GitHub issues or a similar trackable form, so devs see them without reading raw content.

**Context:** Content types may have a "notes to dev" field; we want automation or a clear process to turn those into issues.

**Success criteria:**

- A defined path from CMS note to issue (or equivalent).
- If it requires tokens/secrets, that setup is documented and done by a human.

**Scope:** Schema (field that never renders), workflow or script or manual process, and optional secret setup.

**Out of scope:** Full workflow engine; other integrations.

**Tasks:** (1) Schema + workflow (no secrets). (2) Token/secret setup if needed (human-dev). Task 2 blocked by task 1 so the workflow exists first.

---

## Epic: CI complete and PR previews

**Goal:** CI runs full checks (e.g. astro check), and PRs get preview deploys where feasible. Branch protection can require these checks.

**Context:** CI already runs lint and build; no astro check yet. No preview deploys.

**Success criteria:**

- `astro check` (or equivalent) in CI.
- Preview deploys for PRs (or doc for how to do it).
- Branch protection/required checks documented or configured.

**Scope:** Workflow and deploy config; branch protection settings.

**Out of scope:** Moving to a different host; full DevOps overhaul.

**Tasks:** (1) Add astro check to CI (simple-ai). (2) Preview deploys and branch protection (human-dev). Task 2 blocked by task 1 so checks exist before protecting.

---

## Epic: Booking and contact work

**Goal:** Booking and contact work: real booking URL, contact path consolidated, and ideally booking URL editable via settings.

**Context:** Calendly URL is still PLACEHOLDER; booking may be hardcoded. We want it configurable and working.

**Success criteria:**

- Booking link works in production.
- Booking URL comes from settings (or a single config) so the site owner can change it without code.

**Scope:** Settings model (if needed), wiring components to settings, and site owner providing the real URL.

**Out of scope:** New contact forms or CRM.

**Tasks:** (1) Site owner provides real booking URL. (2) Wire booking URL from settings to components. Task 2 blocked by task 1 so the URL exists to wire.

---

## Epic: Writing and collaboration in nav

**Goal:** Nav and layout put writing and collaboration first, so the site feels oriented to the project-brief audiences (public scholarship, collaboration).

**Context:** Nav is currently Home / About / Work / Contact. Writing and "who I work with" may need to be first-class.

**Success criteria:**

- Nav and layout support a writing-first and collaboration-friendly UX (e.g. Writing/Research and Collaboration visible).
- Aligns with project brief without requiring new content types in this epic.

**Scope:** Nav component, layout, and any new links/pages that are layout-only.

**Out of scope:** Full blog implementation (that's another epic); new copy.

**Tasks:** Implementation only (agentic-ai). No blocking between tasks if there's only one.

---

## Epic: Documentation and launch content

**Goal:** Documentation pack for the site owner and contributors is in place, and launch content (home, about, research, posts, testimonials as needed) is produced.

**Context:** We have some docs (collaborator walkthrough, lint, costs, architecture). We need a coherent pack and real content for launch.

**Success criteria:**

- Docs: for-agreni, content-model, deployment, README aligned.
- Launch content: site owner has provided or scheduled content for key pages and any new collections.

**Scope:** Doc structure and content; launch content production (site owner).

**Out of scope:** Ongoing content calendar; marketing.

**Tasks:** (1) Docs structure and for-agreni pack (agentic-ai). (2) Launch content (site owner). Task 2 blocked by task 1 so structure exists before filling.

---

## Notes for agents

When you create or update child issues from an epic:

1. **Title:** Use **Epic: &lt;name&gt;** only for the parent. Child titles are task names (e.g. "Implement brand and IA changes"), no "Epic N" prefix.
2. **Labels:** Each child has **exactly one** `owner:*` label: `owner:simple-ai`, `owner:agentic-ai`, `owner:human-dev`, or `owner:site-owner`. Parent gets the **union** of its children's labels. Parents also have **`type:epic`**.
3. **Blocking:** If task B cannot start until task A is done, set "B is blocked by A" via the Relationships sidebar or API: `POST .../issues/{B}/dependencies/blocked_by` with `{"issue_id": A's internal id}`.
4. **Linking:** Parents list children in the body (task list). Children have **Parent:** #N in the body. Use the Sub-Issues API so the Relationships sidebar shows the parent.
5. **Epic body:** Keep the epic body human-readable: goal, context, success criteria, scope, out of scope, and a short note for the agent (e.g. "Split into tasks; one label per task; set blocking where needed").
