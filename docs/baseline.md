# Baseline — Agreni Site System State

> **Purpose:** Regression reference for verifying parity after the
> `profesional_site` → `portfolio-engine` / `agreni-site` split (Epic 1).
> Captured 2026-04-28 from the `dev` branch.

---

## 1. Routes

All routes are file-based, defined in `site/src/pages/`.

| Route | File | Render mode | Description |
|---|---|---|---|
| `/` | `pages/index.astro` | Static (SSG) | Homepage — hero, pillars, featured work, recent writing, testimonials, CTA |
| `/about` | `pages/about.astro` | Static (SSG) | Bio, recognition, education |
| `/work` | `pages/work.astro` | Static (SSG) | Full project grid |
| `/work/[slug]` | `pages/work/[slug].astro` | Static (SSG) | Individual project detail page |
| `/writing` | `pages/writing/index.astro` | Static (SSG) | Writing index (excludes drafts) |
| `/writing/[slug]` | `pages/writing/[slug].astro` | Static (SSG) | Individual post |
| `/contact` | `pages/contact.astro` | Static (SSG) | Contact / Calendly booking embed |
| `/admin` | `pages/admin.astro` | Static (SSG) | Admin overview — auth-gated client-side |
| `/api/auth/github` | `pages/api/auth/github.ts` | Serverless | Initiates GitHub OAuth flow |
| `/api/auth/callback` | `pages/api/auth/callback.ts` | Serverless | OAuth callback — token exchange + collaborator check |
| `/api/auth/session` | `pages/api/auth/session.ts` | Serverless | Returns `{ authenticated, username }` for current session |
| `/api/auth/logout` | `pages/api/auth/logout.ts` | Serverless | Clears session cookie, redirects to `/` |
| `/api/content` | `pages/api/content.ts` | Serverless | GitHub Contents API proxy (GET/PUT/DELETE) for in-house CMS |

### Static-path generation

- `/work/[slug]` — `getStaticPaths()` iterates all entries in `projects` collection.
- `/writing/[slug]` — `getStaticPaths()` iterates `writing` collection filtered to
  `!data.draft`.

---

## 2. Content model

Defined in `site/src/content.config.ts` using Astro Content Collections + Zod.

### 2.1 `projects` collection

- **Format:** Markdown with YAML frontmatter
- **Location:** `site/src/content/projects/*.md`
- **Schema:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | |
| `description` | `string` | No | |
| `image` | `string` | No | Path relative to site root, e.g. `/media/…` |
| `tags` | `string[]` | No | |
| `link` | `string` | No | External URL |
| `date` | `date` (coerced) | Yes | Used for ordering |
| `featured` | `boolean` | No | Controls homepage inclusion |
| body | Markdown body | — | Rendered on `/work/[slug]` |

**Current entries (5):**
`lead-english-textbooks.md`, `media-justice-curriculum.md`,
`raabta-school-transformation.md`, `rescripted-framework.md`,
`trailblazer-heroes.md`

### 2.2 `writing` collection

- **Format:** Markdown with YAML frontmatter
- **Location:** `site/src/content/writing/*.md`
- **Schema:**

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | `string` | Yes | | |
| `description` | `string` | No | | |
| `image` | `string` | No | | |
| `date` | `date` (coerced) | Yes | | |
| `tags` | `string[]` | No | | |
| `draft` | `boolean` | No | `false` | When `true`, excluded from public pages |
| body | Markdown body | — | — | |

**Current entries (10):**
`brahmanical-femininity-and-the-schoolgirl.md`,
`curriculum-of-the-body-thesis.md`, `curriculum-that-fits.md`,
`stem-access-and-belonging.md`, `teaching-as-inquiry.md`,
`the-teacher-who-became-the-oppressor.md`,
`toward-schools-that-humanize.md`,
`what-girls-learn-when-no-one-is-teaching.md`,
`what-is-curriculum-of-the-body.md`,
`when-schools-teach-girls-to-disappear.md`

### 2.3 `testimonials` collection

- **Format:** JSON
- **Location:** `site/src/content/testimonials/*.json`
- **Schema:**

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `author` | `string` | Yes | | |
| `role` | `string` | No | | Affiliation line |
| `quote` | `string` | Yes | | Without surrounding quotation marks |
| `featured` | `boolean` | No | `false` | Controls homepage inclusion |

**Current entries (3):**
`collaborator.json`, `program-director.json`, `teacher-educator.json`

### 2.4 `settings` (single-file)

- **Format:** JSON
- **Location:** `site/src/content/settings/main.json`
- **Not an Astro Content Collection** — imported directly with
  `import settings from '../content/settings/main.json'`.

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Site owner name; shown in nav, hero, footer |
| `tagline` | `string` | Subtitle line on homepage hero |
| `bio` | `string` | Long-form bio; used on About and in `<meta description>` |
| `email` | `string` | Shown on About and Contact pages |
| `bookingUrl` | `string` | Calendly URL; empty string = widget hidden |
| `photo` | `string` | Path to profile image, e.g. `/media/agreni-columbia-portrait.jpg` |
| `linkedin` | `string` | Full LinkedIn URL |
| `instagram` | `string` | Full Instagram URL (currently empty) |

**Current live values (as of 2026-04-28):**

```json
{
  "name": "Agreni",
  "tagline": "curriculum designer, researcher, and educator working at the intersection of equity, power, and learning.",
  "email": "Agreni.Batra@gmail.com",
  "bookingUrl": "",
  "photo": "/media/agreni-columbia-portrait.jpg",
  "linkedin": "https://www.linkedin.com/in/agreni-batra/",
  "instagram": ""
}
```

---

## 3. CMS mapping (Pages CMS)

Configured in `.pages.yml` at the repo root. Pages CMS is git-backed; all edits
commit directly to the `dev` branch with no separate database.

| CMS section | Type | Git path | Notes |
|---|---|---|---|
| Site Settings | Single file | `site/src/content/settings/main.json` | Maps `name`, `tagline`, `bio`, `email`, `bookingUrl`, `photo`, `linkedin`, `instagram` |
| Work / Projects | Collection | `site/src/content/projects/` | YAML-frontmatter Markdown; `body` = rich-text |
| Writing | Collection | `site/src/content/writing/` | YAML-frontmatter Markdown; `body` = rich-text; `draft` toggle |
| Testimonials | Collection | `site/src/content/testimonials/` | JSON; filename pattern `{fields.author}.json` |
| Media | Media library | `site/public/media/` | PNG/JPG/JPEG/WebP/SVG/GIF; served at `/media/` |

Pages CMS does **not** control any page layout, hardcoded prose, or the
admin page structure — those live in source code.

---

## 4. Config model — `main.json` shape

`settings/main.json` is a flat JSON object mixing concerns that a future split
will need to separate:

- **Identity** — `name`, `tagline`, `bio`, `photo`
- **Contact / social** — `email`, `linkedin`, `instagram`
- **Feature toggle** — `bookingUrl` (empty = feature off)

There is no versioning, schema validation at the JSON level, or migration story.
The file is imported at build time in every page that uses site-wide data.

---

## 5. Admin page — behavior and auth flow

### 5.1 Auth flow overview

```text
/admin (client-side JS)
  └─ fetch /api/auth/session
       ├─ { authenticated: true }  → show admin content, hide gate overlay
       └─ { authenticated: false } → redirect to /api/auth/github

/api/auth/github (serverless)
  └─ redirect → https://github.com/login/oauth/authorize
                  (client_id, redirect_uri=/api/auth/callback, scope=read:user public_repo, state)
       └─ sets oauth_state cookie (HttpOnly, Secure, SameSite=Lax, Max-Age=600)

/api/auth/callback (serverless)
  ├─ validates state cookie (CSRF guard)
  ├─ exchanges code → GitHub access token
  ├─ fetches /user to get login
  ├─ checks GET /repos/rainonej/profesional_site/collaborators/{login}
  │    └─ 204 = authorized; any other status = 403
  ├─ builds session token:
  │    payload = "{login}.{issuedAt}.{accessToken}"
  │    token   = "{payload}.{HMAC-SHA256(payload, SESSION_SECRET)}"
  │    Max-Age = 86400 (24 h)
  └─ redirect → /admin

/api/auth/logout (serverless)
  └─ clears session cookie (Max-Age=0), redirect → /
```

### 5.2 Session token format

```text
{login}.{issuedAt_ms}.{github_access_token}.{hex(HMAC-SHA256(payload, SESSION_SECRET))}
```

- **Delimiter:** `.` (safe because GitHub OAuth tokens `gho_…` are alphanumeric + underscore)
- **Expiry:** 24 hours from `issuedAt`; verified in `verifySession()`
- **HMAC:** constant-time comparison via `timingSafeEqualHex()`

### 5.3 Environment variables required for auth

| Variable | Purpose |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `SESSION_SECRET` | HMAC key for signing session tokens |
| `PUBLIC_ADMIN_ORIGIN` | Optional override; defaults to Vercel preview URL |

### 5.4 Admin page content (post-auth)

The admin page (`/admin`) is a static Astro page that loads all collections
server-side at build time and renders a full site overview:

- Design token swatches (CSS custom properties)
- Typography specimens (font families, sizes)
- Live content listings — projects (sorted by date), writing (sorted by date, all including drafts), testimonials
- Site structure tree (nav links, pages, API routes)
- Booking status (whether `bookingUrl` is configured)

The auth gate is a full-screen overlay (`#gate`) dismissed client-side after a
successful `/api/auth/session` check. Unauthenticated visitors are redirected to
the GitHub OAuth flow.

---

## 6. Hardcoded content locations

The following content is **not** editable through Pages CMS and exists only in
source code. Any parity check after the split must verify these locations.

### 6.1 `Nav.astro` — logo text

```astro
<!-- site/src/components/Nav.astro:33 -->
<a href={`${base}/`} …>
  Agreni
</a>
```

The logo text is the literal string `"Agreni"`, not `settings.name`.

### 6.2 `Layout.astro` — footer copyright

```astro
<!-- site/src/layouts/Layout.astro:74 -->
<p>
  © {new Date().getFullYear()} Agreni &middot; Made with care &middot; …
</p>
```

`"Agreni"` is hardcoded, not `settings.name`. The year is dynamic (`Date.now()`).

### 6.3 `index.astro` — three thematic pillars

The "Areas of focus" section is defined as a literal JavaScript array in the
page frontmatter (not fetched from any collection or settings file):

```js
// site/src/pages/index.astro:33–49
const pillars = [
  {
    heading: 'Curriculum Design',
    body: 'Designing rigorous, contextually grounded learning experiences…',
    image: `${base}/media/focus-curriculum.jpg`,
  },
  {
    heading: 'Research & Analysis',
    body: "Qualitative research and literature synthesis…",
    image: `${base}/media/focus-research.jpg`,
  },
  {
    heading: 'Teacher Learning',
    body: 'Coaching and training educators…',
    image: `${base}/media/focus-teaching.jpg`,
  },
];
```

The CTA body copy is also hardcoded in the `<CollaborationCTA>` call:

```astro
<!-- site/src/pages/index.astro:246–248 -->
<CollaborationCTA
  href={`${base}/contact`}
  body="I'm always interested in thoughtful collaborations in education, curriculum, and public scholarship."
/>
```

### 6.4 `about.astro` — Recognition and Education sections

Both sections are fully hardcoded markup; they have no CMS backing.

**Recognition — Shirley Chisholm Trailblazer Award:**

```astro
<!-- site/src/pages/about.astro:100–122 -->
<h3 …>Shirley Chisholm Trailblazer Award</h3>
<p …>Provost&apos;s Student Excellence Awards 2023-24</p>
<p …>Named after Shirley Chisholm, the first Black woman elected to Congress…</p>
<img src="/media/agreni-trailblazer-award.jpg" alt="…" />
```

**Education:**

```astro
<!-- site/src/pages/about.astro:131–164 -->
<!-- Card 1 -->
M.A. Curriculum and Teaching
Teachers College, Columbia University
New York, NY | 2024
Thesis: Curriculum of the Body…

<!-- Card 2 -->
B.A. English Literature
Lady Shri Ram College, University of Delhi
New Delhi, India
Foundation in literary analysis…
```

### 6.5 `contact.astro` — heading and body copy

```astro
<!-- site/src/pages/contact.astro:32–38 -->
<h1 …>Let's work<br />together</h1>
<p …>
  Have a project in mind or just want to say hello? Send me a message and
  I'll get back to you.
</p>
```

These strings are not in settings or any content file.

### 6.6 `admin.astro` — site map tree

The site structure / page map rendered inside the admin overview is
hand-authored HTML markup in `site/src/pages/admin.astro`. It is not
auto-generated from the file system or route registry.

---

## 7. Page descriptions

### `/` — Homepage

Sections (top to bottom):

1. **Hero** — name + tagline (from `settings`), bio (from `settings`), "Explore
   my work" button, optional Calendly "Book a conversation" button
2. **Areas of focus** — three hardcoded pillars with images
3. **Featured Work** — up to 3 projects where `featured: true`, sorted by date
4. **Recent Writing** — up to 3 non-draft posts, sorted by date
5. **Testimonials** — up to 2 testimonials where `featured: true`
6. **CTA** — hardcoded body + link to `/contact`

### `/about`

Sections:

1. **Bio** — photo + name + bio (from `settings`), email + LinkedIn links
2. **Awards & Honors** — hardcoded Trailblazer Award block with image
3. **Academic Background** — two hardcoded education cards

### `/work`

Full grid of all projects sorted by date descending. Empty state: "Projects
coming soon."

### `/work/[slug]`

Individual project: tags, title, description, body markdown, optional external
link. Back link to `/work`.

### `/writing`

Index of non-draft posts sorted by date descending. Empty state: "Posts coming
soon." Hardcoded description: "Thoughts on curriculum design, equitable learning,
teacher development, and the practice-to-research bridge."

### `/writing/[slug]`

Individual post: date, tags, title, description, body markdown. Back link to
`/writing`.

### `/contact`

Hardcoded heading + body. When `bookingUrl` is set: inline Calendly widget.
When not set: "Booking coming soon" placeholder. Email link from `settings`.

### `/admin`

Auth-gated admin dashboard. Shows design tokens, typography specimens, all
content (including drafts), and site structure. Logout button clears session.

---

## 8. Known quirks

| Location | Quirk |
|---|---|
| `Nav.astro:33` | Logo text `"Agreni"` is literal, not `settings.name` |
| `Layout.astro:74` | Footer `"Agreni"` is literal, not `settings.name` |
| `index.astro:33–49` | Three pillars are hardcoded JS array — not CMS-backed |
| `index.astro:246–248` | CTA body copy is hardcoded in JSX prop |
| `about.astro:99–122` | Trailblazer Award block is hardcoded — name, year, description, image path |
| `about.astro:131–164` | Both education cards are hardcoded — institution, degree, year, thesis title |
| `contact.astro:32–38` | Heading "Let's work together" and body copy are hardcoded |
| `admin.astro` | Site map tree is hand-authored markup, not auto-generated |
| `api/content.ts:26` | `REPO` constant (`rainonej/profesional_site`) is hardcoded — must be parameterized before `agreni-site` split |
| `api/auth/callback.ts:75` | Collaborator check URL also hardcodes `rainonej/profesional_site` — same parameterization needed |
| `Layout.astro:15–19` | `adminOrigin` falls back to `https://profesional-site.vercel.app` if `PUBLIC_ADMIN_ORIGIN` is not set — will need updating after split |

---

## 9. Tech stack summary

| Layer | Technology | Notes |
|---|---|---|
| Framework | Astro 6 | Static site + serverless islands |
| Styling | Tailwind CSS + global.css | Design tokens via CSS custom properties |
| Fonts | Cormorant Garamond + Inter | Loaded from Google Fonts |
| Content | Astro Content Collections | Three collections; settings imported directly |
| CMS | Pages CMS | Git-backed; commits to `dev` |
| Hosting | Vercel | Static + serverless; also handles Pages CMS OAuth |
| Auth | GitHub OAuth + HMAC session cookie | Collaborator gate on `rainonej/profesional_site` |
| Booking | Calendly embed | Toggled by `bookingUrl` in settings |
| Build | `npm run build` in `site/` | `astro build` |
| Lint | ESLint + Prettier + Stylelint + markdownlint | `npm run lint` in `site/` |

---

## 10. Acceptance verification checklist

Use this list to verify parity after the split:

- [ ] `/` renders hero with correct name, tagline, bio from settings
- [ ] `/` shows three pillar cards with correct headings and body text
- [ ] `/` featured work section appears for projects with `featured: true`
- [ ] `/` recent writing section appears for non-draft posts
- [ ] `/` testimonials section appears for testimonials with `featured: true`
- [ ] `/about` bio section renders settings data; photo shows
- [ ] `/about` Trailblazer Award block is present with correct text and image
- [ ] `/about` both education cards are present with correct institution names
- [ ] `/work` lists all projects
- [ ] `/work/[slug]` renders project detail for each project
- [ ] `/writing` lists all non-draft posts
- [ ] `/writing/[slug]` renders post detail for each published post
- [ ] `/contact` shows hardcoded heading and body; Calendly widget when `bookingUrl` set
- [ ] `/admin` auth gate appears; GitHub OAuth flow works; admin content visible after auth
- [ ] `/api/auth/session` returns `{ authenticated: false }` without a cookie
- [ ] Nav logo text reads "Agreni" (or intentionally updated value)
- [ ] Footer copyright reads "© {year} Agreni" (or intentionally updated value)
- [ ] Pages CMS edits to settings, projects, writing, testimonials commit to the correct branch
- [ ] `REPO` constant in `api/content.ts` updated to target `agreni-site`
- [ ] `collaborators` check in `api/auth/callback.ts` updated to target `agreni-site`
