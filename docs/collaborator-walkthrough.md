# Collaborator Walkthrough — Editing the Site (No Code Required)

This guide is for Agreni. You do not need to touch code, the terminal, or GitHub directly.

---

## Option A: Pages CMS (recommended starting point)

### First-time setup
1. Go to **https://pagescms.org**
2. Click **Sign in with GitHub**
3. Authorize Pages CMS to access your repositories
4. Select **rainonej / profesional_site**
5. You'll see two editable collections: **Site Pages** and **Writing**

### Editing an existing page
1. Click **Site Pages**
2. Click the page you want to edit (e.g., Home, Research)
3. Edit the body text using the rich-text editor
4. Click **Save** — this commits the change to GitHub
5. The site rebuilds automatically and is live within ~1 minute

### Writing a new post
1. Click **Writing**
2. Click **New entry**
3. Fill in: Title, Description (optional), Publish date, Tags (optional)
4. Write the post body
5. Click **Save**
6. The post appears on the Writing page of the live site within ~1 minute

### Uploading an image
1. In any entry, click the image field
2. Pages CMS opens a media manager
3. Drag and drop an image or click to upload
4. The image is saved to `site/public/media/` in the repo

---

## Option B: Decap CMS

### Access
Visit: **https://rainonej.github.io/profesional_site/admin/**

### Login
- Click **Login with GitHub**
- Authorize access

### Editing works the same as Pages CMS
Collections and fields are identical. Decap supports an "Editorial Workflow" (draft → review → publish via PR) if that becomes useful later.

---

## What you can edit without a developer

- Bio text and tagline (via Home page entry)
- Research interest descriptions
- Teaching philosophy text
- Any blog/writing post
- Images in any entry

## What requires a developer

- Adding or removing pages
- Changing layout, fonts, or colors
- Adding new types of content fields
- Updating the Calendly link (search for `PLACEHOLDER` in the codebase)
- Custom domain setup

---

## Replacing the Calendly link

When you have a real Calendly account, search the repo for `PLACEHOLDER` — it appears in two files:
- `site/src/pages/index.astro` (popup button on Home)
- `site/src/pages/contact.astro` (inline embed on Contact)

Replace `PLACEHOLDER` with your actual Calendly username in both places.
