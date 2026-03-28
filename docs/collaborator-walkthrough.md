# Collaborator Walkthrough — Editing the Site (No Code Required)

This guide is for Agreni. You do not need to touch code, the terminal, or GitHub directly.

---

## Your two site URLs

| URL | What it is |
|-----|-----------|
| **https://rainonej.github.io/profesional_site/** | Live site — what the world sees |
| **https://profesional-site.vercel.app** | Preview site — reflects the latest saved drafts; not indexed by Google |

When you save something in Pages CMS it goes to the preview site first (~1 minute). The live site is updated manually by the developer when you're ready to publish.

---

## Getting into Pages CMS

1. Go to **https://app.pagescms.org**
2. Click **Sign in with GitHub** and authorize it
3. You'll land on a project list — click **profesional_site**
4. You're in. The left sidebar shows:
   - **Site Settings** — your name, bio, email, social links, Calendly URL
   - **Work / Projects** — portfolio entries
   - **Writing** — blog posts and essays
   - **Testimonials** — quotes from colleagues
   - **Media** — image uploads

> **Ignore the gear icon ("Settings").** That is a raw config file — not your content. Your content is in the four sections above.

---

## Edit your bio, tagline, and contact info

1. Click **Site Settings**
2. Edit any field:
   - **Name** — shown in the nav and hero
   - **Tagline** — short line under your name on the homepage
   - **Bio** — your about-page text; line breaks are preserved
   - **Email** — shown on the About and Contact pages
   - **Booking URL** — your Calendly link (e.g. `https://calendly.com/yourname/30min`); leave empty to hide the booking widget
   - **Photo** — upload your headshot
   - **LinkedIn / Instagram** — full URLs, shown as icon links
3. Click **Save** (top right)

---

## Add or edit a work entry / project

1. Click **Work / Projects**
2. Click **Add an entry** (top right) — or click an existing entry to edit it
3. Fill in:
   - **Title** — required
   - **Description** — one or two sentences shown in the work grid
   - **Image** — optional cover image (upload via the Media button)
   - **Tags** — e.g. `Research`, `Curriculum`, `STEM`; press Enter after each
   - **External link** — link to a paper, report, or published project (optional)
   - **Date** — used for sorting (newest first)
   - **Show on homepage** — turn on to feature this entry on the homepage (max 3 shown)
   - **Details** — longer text shown when someone clicks into the entry
4. Click **Save**

---

## Write a blog post or essay

1. Click **Writing**
2. Click **Add an entry** to start a new post, or click an existing one to edit
3. Fill in:
   - **Title** — required
   - **Description** — one sentence shown in the writing list and on the homepage strip
   - **Date** — publish date (used for ordering)
   - **Tags** — e.g. `Curriculum`, `Equity`, `Teaching`; press Enter after each
   - **Draft** — turn on to hide the post from the site while you're working on it; turn off when ready to publish
   - **Post** — the full text; supports headings, bold/italic, lists, and links
4. Click **Save**

Posts marked as **Draft** will appear in the preview site but not on the live site, so you can review them before publishing.

---

## Add or edit a testimonial

1. Click **Testimonials**
2. Click **Add an entry** — or click an existing one
3. Fill in:
   - **Name** — the person's full name
   - **Role / Affiliation** — e.g. `Program Director, Girls Inc. NYC` (optional)
   - **Quote** — the testimonial text (no quotation marks — they are added automatically)
   - **Show on homepage** — turn on to feature this quote in the homepage section
4. Click **Save**

---

## Upload an image or headshot

**Option A — from the Media section:**
1. Click **Media** in the sidebar
2. If you see "Media folder missing," click **Create folder**
3. Click **Upload** and choose a file from your computer

**Option B — from inside an entry:**
1. Open any entry in Work / Projects or Site Settings
2. Click the Image field
3. A media picker opens — you can upload directly from there

---

## Leave feedback or a request for the developer

When you're reviewing the preview site and want to request a change or flag something:

1. Open the preview site: **https://profesional-site.vercel.app**
2. Click the **Comment** button (appears in the Vercel toolbar at the bottom of the page)
3. Click anywhere on the page to pin a comment — describe what you'd like changed
4. In the comment thread, click **Create GitHub Issue** to send it directly to the developer's task list
5. The developer (or automated agent) will pick it up from there

Your comment is attached to the exact spot on the page where you clicked, and the GitHub issue includes a screenshot automatically.

---

## After saving — how long until the site updates?

About 1 minute. The preview site (Vercel) updates first. The live site (GitHub Pages) is updated when the developer merges changes to the main branch — usually at the end of a development session.

---

## What you can edit without a developer

- Name, tagline, bio, email, social links, Calendly booking URL
- Work/project entries — add, edit, delete, reorder by date
- Writing posts — draft, publish, edit
- Testimonials — add, edit, feature on homepage
- Images via Media manager
- Leave feedback via Vercel comments on the preview site

## What requires a developer

- Adding new page types or sections
- Changing layout, fonts, or colors
- Custom domain setup
- Publishing a batch of changes from the preview site to the live site (this is intentional — you can draft freely without it going live)
