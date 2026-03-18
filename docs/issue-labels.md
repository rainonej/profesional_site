# Issue label system (proposal)

Labels answer: **who can execute this work?** Multiple labels per issue are allowed when a ticket needs more than one kind of contributor.

---

## Labels vs tags, and select-one vs select-many

**In GitHub there are only labels.** (What people often call "tags" are just labels.) Every label is **multi-select**: you can add as many labels to an issue as you want. GitHub does not support "pick exactly one from this set" in the UI.

So the useful distinction is how we **design** each label set:

| Kind | Meaning | Example | Fits GitHub? |
|------|--------|--------|--------------|
| **Select all that apply** | Multiple labels from the set can apply to one issue. | "This needs the site owner *and* then agentic AI to implement." | Yes — native. |
| **At most one** | Only one label from the set should apply (e.g. one priority). | "This is P0" (not also P1). | Yes, but only by convention: we document "use at most one priority label" and rely on discipline (or a bot). GitHub won't enforce it. |

**This proposal uses only "select all that apply"** for the executor set at the **parent** level. For **child** issues we use **exactly one** executor label each (see Parent/child structure below).

---

## Parent/child structure (epics and deliverables)

- **Parent issue** = one **deliverable** from a product manager’s perspective: the outcome of a sprint, the thing end users (or the site owner) actually get. E.g. “Booking and contact work,” “Site reflects Agreni’s positioning.”
- **Child issues** = tasks; title is a **task name only** (e.g. "Implement blog, testimonials, singleton pages, CMS config"), **not** "Epic N: …". Each child has **exactly one** executor label. If a piece of work needs two executor types (e.g. site owner provides copy *and* agentic AI implements), split it into two children.
- **Parent labels** = **epic** plus the union of its children’s executor labels. Use **Blocking** (issue dependencies) so tasks show "Blocked by" / "Blocking" in the Relationships sidebar; API: `POST .../issues/{n}/dependencies/blocked_by` with `{"issue_id": <blocker id>}`. See `docs/epic-briefs.md` for epic body template and `docs/github-project-views.md` for project views (Epics, Unblocked tasks, Unblocked but blocking others).

**Linking:**

- Use GitHub's **Sub-Issues API** so the Relationships sidebar shows the parent (see Summary). In the parent body, keep a task list e.g. `- [ ] #14`. When a child is closed, check the box (or use “closes” in the child’s PR).
- In each **child** issue body: `**Parent:** #N` (link to the parent).

**Rule:** Every child has **exactly one** executor label. Split work so that each sub-issue is clearly one type (simple-ai, agentic-ai, human-dev, or needs-site-owner).

---

## Executor labels (who does the work)

**On children:** **Exactly one** per child. **On parents:** **All** labels that any of its children have (union).

| Label | Color | Meaning | When to use |
|-------|--------|--------|-------------|
| **simple-ai** | `#0E8A16` (green) | Fully specced; straightforward implementation. A simple AI (single-shot, narrow scope) can implement it. | Add a script to CI, expand a config list, apply a documented code change. |
| **agentic-ai** | `#1D76DB` (blue) | Multi-step, codebase-wide, or needs exploration. Suited to agentic AI (e.g. Claude, multi-file refactors, following audit). | Migrate to one CMS spine, add content collections + routes, implement from audit report. |
| **human-dev** | `#F9D0C4` (peach) or `#FBCA04` (yellow) | Needs human developer: judgment, security, infra, or complex debugging. | Preview deploy setup, auth/credentials, performance investigation, architectural decisions. |
| **needs-site-owner** | `#C5DEF5` (light blue) or `#D93F0B` (red) | Needs the site/product owner: content, copy, positioning, or product/priority decisions. | Replace placeholder copy, choose booking URL, approve IA, provide testimonials or blog content. |

**Rules of thumb**

- **simple-ai**: “A clear PR description could be written and a capable AI could implement it without opening 10 files.”
- **agentic-ai**: “Requires reading the codebase, docs, and maybe the audit; might touch many files or have ambiguous steps.”
- **human-dev**: “Involves secrets, deploy config, or decisions we don’t want to automate.”
- **needs-site-owner**: “Blocked until the site owner provides content, a decision, or a preference.”

---

## Optional: spec clarity (if you want to track “AI ready”)

| Label | Meaning |
|-------|--------|
| **spec: complete** | Acceptance criteria and scope are clear enough for an AI or junior dev to execute. |
| **spec: draft** | Direction is set but details need refinement before implementation. |

Use these only if you find it useful to filter “ready to implement” vs “needs more spec.”

---

## Parent deliverables and children (mapping)

Each row is one **parent** (deliverable). Children are split so each has **exactly one** executor label. Parent gets the **union** of its children’s labels.

| Parent (deliverable) | Children (each exactly one label) | Parent labels |
|----------------------|-----------------------------------|---------------|
| **Single CMS path** | Choose CMS spine and remove conflicting artifacts → agentic-ai | agentic-ai |
| **Site reflects positioning** | (1) Site owner provides positioning and copy → needs-site-owner; (2) Implement brand and IA changes → agentic-ai | needs-site-owner, agentic-ai |
| **Blog, testimonials, richer settings** | (1) Implement blog, testimonials, singleton pages, CMS config → agentic-ai; (2) Content for blog/testimonials → needs-site-owner | agentic-ai, needs-site-owner |
| **Type-safe content and no placeholders** | (1) Content schemas and refactor → agentic-ai; (2) Replace placeholder copy and booking URL → needs-site-owner | agentic-ai, needs-site-owner |
| **Editor help and guidance** | Add help text and document single editor path → simple-ai (or agentic-ai if multi-file) | simple-ai |
| **Editor notes become issues** | (1) Schema + workflow (no secrets) → agentic-ai; (2) Token/secret setup if needed → human-dev | agentic-ai, human-dev |
| **CI complete and PR previews** | (1) Add astro check to CI → simple-ai; (2) Preview deploys and branch protection → human-dev | simple-ai, human-dev |
| **Booking and contact work** | (1) Wire booking URL from settings to components → simple-ai; (2) Site owner provides real booking URL → needs-site-owner | simple-ai, needs-site-owner |
| **Writing and collaboration in nav** | Nav/layout changes for writing-first UX → agentic-ai | agentic-ai |
| **Documentation and launch content** | (1) Docs structure and for-agreni pack → agentic-ai; (2) Launch content (site owner) → needs-site-owner | agentic-ai, needs-site-owner |

---

## Suggested mapping for current epics (legacy reference)

| Epic | Focus | Becomes children with exactly one label each |
|------|--------|-----------------------------------------------|
| 0 | Choose one CMS spine + remove conflict | One child: agentic-ai |
| 1 | Reposition brand language and IA | Two children: needs-site-owner + agentic-ai |
| 2 | Singleton pages, blog, testimonials, richer settings | Two children: agentic-ai + needs-site-owner |
| 3 | Content schemas + hardcode cleanup | Two children: agentic-ai + needs-site-owner |
| 4 | Editor UX and labels/help text | One child: simple-ai or agentic-ai |
| 5 | Automation notes_to_dev_team → issues | Two children: agentic-ai + human-dev (if secrets) |
| 6 | CI completeness + preview deploys | Two children: simple-ai + human-dev |
| 7 | Booking/contact consolidation | Two children: simple-ai + needs-site-owner |
| 8 | Nav/layout writing-first collaboration UX | One child: agentic-ai |
| 9–10 | Docs + launch content production | Two children: agentic-ai + needs-site-owner |

---

## Summary

- **Parent** = one deliverable (PM view; what users get). **Child** = one work item with **exactly one** executor label. Parent has **task list of children** and **union of children’s labels**.
- **Four executor labels**: `simple-ai`, `agentic-ai`, `human-dev`, `needs-site-owner`. On children: exactly one. On parents: all that apply across children.
- **Optional**: `spec: complete` / `spec: draft` for spec readiness.
- Linking: parent body lists `- [ ] #N` for each child; each child body has `**Parent:** #M`.

**Labels:** Create the four executor labels (e.g. via GitHub UI or `gh api` as repo owner). Apply exactly one to each child and the union to each parent. Use the **rainonej** account for `gh` when creating labels or sub-issues on this repo (owner has permission; other accounts may get 404).

**Epic body (human-readable):** Each parent should have a rich body: Goal, Context, Success criteria, Scope, Out of scope, Children (task list), Notes for agent. See `docs/epic-briefs.md` for the template and full text. Written so a human can hand the epic to an agent, who then splits into tasks, assigns one label per task, and sets blocking relationships.

**Views:** To see all epics, unblocked tasks, and unblocked tasks that block others, use a GitHub Project with multiple views. See `docs/github-project-views.md`.

**Current parent/child issue numbers (as created):**

| Parent (Epic:) | #  | Children | Blocking (B blocked by A) |
|----------------|----|----------|----------------------------|
| Single CMS path | 25 | #14 | — |
| Site reflects positioning | 26 | #18, #35 | #18 by #35 |
| Blog, testimonials, richer settings | 28 | #15, #36 | #36 by #15 |
| Type-safe content and no placeholders | 27 | #16, #37 | #37 by #16 |
| Editor help and guidance | 29 | #17 | — |
| Editor notes become issues | 30 | #19, #38 | #38 by #19 |
| CI complete and PR previews | 31 | #20, #39 | #39 by #20 |
| Booking and contact work | 33 | #21, #40 | #21 by #40 |
| Writing and collaboration in nav | 32 | #22 | — |
| Documentation and launch content | 34 | #23, #41 | #41 by #23 |
