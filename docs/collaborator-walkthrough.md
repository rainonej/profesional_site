# Collaborator Walkthrough

This guide is for non-technical editors who want to update content on the site using a web-based interface — no code editing required.

---

## Option A: Pages CMS (recommended)

Pages CMS is the simplest option. It runs in your browser and connects directly to GitHub.

### First-time setup

1. Go to [pagescms.org](https://pagescms.org)
2. Click **Sign in with GitHub** and authorize the application
3. You will see a list of repositories. Select `professional_site`
4. Pages CMS will read the `.pages.yml` file at the root of the repository and show you the editable content

### Editing a page (e.g., the Research page)

1. In the left sidebar, click **Site Pages**
2. Click **research** (or any other page)
3. Edit the **Title** and **Body** fields using the rich-text editor
4. When you are done, click **Save**
5. Pages CMS commits the change directly to GitHub — the site will rebuild automatically within about 2 minutes

### Writing a new blog post

1. In the left sidebar, click **Writing**
2. Click the **+ New** button (top right)
3. Fill in:
   - **Title**: the post title
   - **Description**: a one-sentence summary (shown in the post list)
   - **Publish date**: the date to show on the post
   - **Tags**: optional comma-separated tags
   - **Body**: the full post content
4. Click **Save**
5. The post will appear on the Writing page after the site rebuilds (~2 minutes)

### Uploading an image

1. In the left sidebar, click **Media**
2. Click **Upload** and select an image from your computer
3. Pages CMS stores it in `site/public/media/`
4. In any rich-text body field, click the image icon to insert it using the `/media/filename.jpg` path

---

## Option B: Decap CMS

Decap CMS is accessible at `https://GITHUB_USERNAME.github.io/professional_site/admin/` (replace `GITHUB_USERNAME` with the real username before using).

### First-time setup

Decap CMS requires a GitHub OAuth app to be configured. This is a one-time setup done by the site owner:

1. In the repository, go to Settings → Pages — make sure GitHub Pages is enabled
2. Follow the [Decap CMS GitHub backend guide](https://decapcms.org/docs/github-backend/) to set up OAuth

After setup, editors can:

1. Visit the admin URL above
2. Click **Login with GitHub**
3. Use the interface the same way as Pages CMS (the collections and fields are the same)

---

## Making Changes Without a CMS

If you are comfortable editing files directly, you can:

1. Navigate to the file in GitHub (e.g., `site/src/content/blog/2026-03-15-intro.md`)
2. Click the pencil icon to edit
3. Make your changes
4. Click **Commit changes** at the bottom
5. The site will rebuild automatically

---

## What triggers a rebuild?

Any commit pushed to the `main` branch triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`. The workflow installs dependencies, builds the site, and deploys the updated static files to GitHub Pages. This takes approximately 1–3 minutes.

---

## What can and cannot be changed through the CMS

**Can be changed through the CMS:**
- Blog post content (title, description, date, tags, body)
- Page body text (Home, Research, Teaching, Contact)
- Uploaded media

**Requires code changes (done by a developer):**
- Navigation structure (adding or removing pages)
- Visual design (colors, layout, typography)
- Adding new features (e.g., a publications page)
- Calendly URL (see `site/src/pages/contact.astro` and `site/src/components/Hero.astro`)
- Email address (see `site/src/pages/contact.astro`)
