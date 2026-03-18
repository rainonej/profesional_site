# Collaborator Walkthrough — Editing the Site (No Code Required)

This guide is for Agreni. You do not need to touch code, the terminal, or GitHub directly.

---

## Getting into Pages CMS

1. Go to **https://app.pagescms.org**
2. Click **Sign in with GitHub** and authorize it
3. You'll land on a project list — click **profesional_site**
4. You're in. The left sidebar has:
   - **Site Settings** — edit your name, tagline, bio, email, and social links
   - **Work / Projects** — add or edit portfolio/work entries
   - **Media** — upload images
   - **Settings** — this is the raw CMS config file, ignore it

> **Important:** "Settings" (gear icon) in the sidebar is NOT where you edit your content. That's the technical config file. Your content lives under "Site Settings" and "Work / Projects."

---

## Edit your bio and tagline

1. Click **Site Settings** in the sidebar
2. You'll see fields for Name, Tagline, Bio, Email, Photo, LinkedIn, Instagram
3. Edit any field
4. Click **Save** (top right)
5. The site rebuilds automatically — live in ~1 minute at https://rainonej.github.io/profesional_site/

---

## Add a new work entry / project

1. Click **Work / Projects** in the sidebar
2. Click **Add an entry** (top right)
3. Fill in:
   - **Title** — required
   - **Description** — one or two sentences shown on the homepage card
   - **Image** — upload via the Media button (optional)
   - **Tags** — e.g. `Research`, `Curriculum`, `STEM`
   - **External link** — link to a paper, report, or project page (optional)
   - **Date** — used for sorting
   - **Show on homepage** — check this to feature it on the home page (max 3 shown)
   - **Details** — longer description, shown if you click into the entry (optional)
4. Click **Save**

---

## Upload an image / headshot

**Option A — from Pages CMS:**
1. Click **Media** in the sidebar
2. If you see "Media folder missing," click **Create folder** — this sets up the folder on GitHub
3. Click **Upload** and pick a file from your computer
4. The image is now available to use in any entry's Image field

**Option B — from an entry:**
1. Open any entry in Work / Projects or Site Settings
2. Click the Image field
3. A media picker opens — you can upload directly from there

---

## Edit an existing work entry

1. Click **Work / Projects**
2. Click **Edit** next to the entry you want to change
3. Make your edits
4. Click **Save**

---

## After saving — how long until the site updates?

About 1 minute. GitHub Actions sees the new commit from Pages CMS and rebuilds the site automatically. Refresh https://rainonej.github.io/profesional_site/ after a minute to see the change.

---

## What you can edit without a developer

- Name, tagline, bio, email, social links (Site Settings)
- Work/project entries — add, edit, delete, reorder
- Images via Media manager

## What requires a developer

- Adding new types of pages (Research, Teaching, Blog — coming later)
- Changing layout, fonts, or colors
- Replacing the Calendly booking link (search the codebase for `PLACEHOLDER`)
- Custom domain setup
