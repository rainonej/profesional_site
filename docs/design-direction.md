# Design Direction: Agreni's Site

> Synthesized from design review sessions and implementation critique.  
> Last updated: 2026-03-31

---

## Brand positioning

### "Warm Editorial Academic"

The site should communicate:

- intellectual depth
- care for people
- trust and credibility
- educational seriousness
- approachability

**Closest design archetype:** academic journal / essay magazine / elegant personal website  
**Not:** coaching funnel, startup landing page, creative portfolio, agency site

---

## Anti-goals

These patterns should never appear on Agreni's site:

- glassmorphism / translucent glassy sections
- ambient blob + backdrop blur as a dominant visual feature
- startup-trope polish (gradient hero, animated counters, sticky CTAs)
- icon-heavy service cards
- "passionate changemaker" copy
- LinkedIn filler language
- carousel-first testimonials
- star ratings
- heavy nonprofit teal/orange

---

## Color palette

| Role                     | Token         | Hex       |
| ------------------------ | ------------- | --------- |
| Background (primary)     | `paper`       | `#F7F4EF` |
| Background (section)     | `paper-light` | `#FCFBF8` |
| Text (primary)           | `ink`         | `#1E1A17` |
| Text (muted)             | `stone-soft`  | `#6B625B` |
| Accent (primary)         | `copper`      | `#9A5A2E` |
| Accent (secondary)       | `clay`        | `#B87C5A` |
| Border / line            | `warm-line`   | `#E6DED3` |
| Highlight band           | `pale-sand`   | `#EFE6DA` |
| Optional (tags/dividers) | `olive`       | `#5C6650` |

**Rule:** Accent color used rarely. The site should feel typographic and editorial — not color-driven.

---

## Typography

| Role                | Font                                               | Notes                                    |
| ------------------- | -------------------------------------------------- | ---------------------------------------- |
| Headlines / display | Cormorant Garamond (preferred) or Playfair Display | More literary and academic than Playfair |
| Body / UI           | Inter                                              | Modern, legible, not trendy              |

**Rules:**

- H1: large and confident, never shouty
- Body text: extremely readable, narrow line length (680–760px column)
- Italic serif used sparingly as a signature motif (e.g., her name, key concepts)

> The current implementation uses Playfair Display + Inter. Cormorant Garamond is the stronger recommendation for future typography work, but Playfair can stay if switching is not prioritized.

---

## Layout system

**Three content widths:**

| Mode                                           | Width      |
| ---------------------------------------------- | ---------- |
| Narrow reading column                          | 680–760px  |
| Standard content                               | 960–1100px |
| Wide band (full-bleed bg with inner container) | Full width |

**Spacing:** Err toward more whitespace. Section padding: 88–120px. Paragraph spacing: 20–28px.

**Grid:** Restrained. 12-col desktop, 1-col mobile. 6/6 or 7/5 splits. Avoid card-wall density.

---

## Animation and motion

### What is working (keep)

- `Reveal.astro` — scroll-triggered fade-in wrapper
- `AmbientBackground.astro` — one global visual layer (concept is sound)
- CSS-only animation via `global.css`
- `prefers-reduced-motion` handling

### What needs to change

**Reveal animation — tune down:**

| Property     | Current      | Target                      |
| ------------ | ------------ | --------------------------- |
| `translateY` | 18px         | 10–12px                     |
| `duration`   | 700ms        | 500–600ms                   |
| Easing       | `ease`       | soft, not dramatic          |
| Usage scope  | all sections | selective — not every block |

Use reveal for: homepage thematic sections, testimonials, featured writing, section intros.  
Do not use for: every card, every paragraph, every page block.

**Ambient background — quiet it significantly:**

| Property   | Current                 | Target                         |
| ---------- | ----------------------- | ------------------------------ |
| Blob count | 3 (amber, rose, slate)  | 2 max (amber, warm stone only) |
| Opacity    | 0.40                    | 0.20–0.25                      |
| Motion     | visible float animation | imperceptible or none          |
| Mobile     | animated                | static or hidden               |

Think: *paper atmosphere*, not *visual feature*.

**Section bands — remove glassy effects:**

Replace `bg-white/75 backdrop-blur-sm` → `bg-[#FCFBF8]` or solid `bg-white`  
Replace `bg-amber-50/80 backdrop-blur-sm` → `bg-[#EFE6DA]` (matte pale sand band)

No translucency. No backdrop blur. Use subtle borders or tonal shifts instead.

---

## Homepage structure

| Section                               | Notes                                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Hero**                              | Left-aligned or centered-left. Name + one-line identity + 2-paragraph intro + 2 CTAs. No giant image. Typography first.             |
| **Thematic pillars**                  | 3 elegant content blocks (not icon-heavy cards): Equitable Learning / Curriculum & Pedagogy / Teacher Learning & Public Scholarship |
| **Featured writing**                  | 2–3 essays with title + one-line description. Essential for personal brand.                                                         |
| **Selected projects / collaboration** | Quieter — workshops, curriculum work, research partnerships                                                                         |
| **Testimonials**                      | 2–3 editorial quotes. Not SaaS social proof.                                                                                        |
| **Footer CTA**                        | Calm invitation to collaborate.                                                                                                     |

---

## Component roadmap

### Immediate: fix visual polish layer

These exist and need tuning (see tickets):

- `AmbientBackground.astro` — quieter blobs, no glassy sections
- `Reveal.astro` — calmer motion parameters
- Section band colors in `index.astro`

### Next: editorial building blocks

These do not exist yet and are the higher-value work:

| Component          | Purpose                                                     |
| ------------------ | ----------------------------------------------------------- |
| `SectionIntro`     | Serif headline + short lead paragraph, generous spacing     |
| `TestimonialBlock` | 2–3 editorial quotes, serif style, attribution below        |
| `WritingList`      | Article list with date, title, one-liner — generous spacing |
| `EditorialCard`    | Project/work card — text-first, image optional              |
| `PaperBand`        | Full-bleed matte section wrapper with warm tonal background |
| `FeaturePillars`   | 3-column thematic cards (no icons)                          |
| `CollaborationCTA` | Quiet invitation block with booking link                    |
| `AccentRule`       | Decorative typographic divider                              |
| `QuoteBlock`       | Single large pull-quote in serif italic                     |
| `BioBlock`         | Portrait + narrative bio + optional milestones              |

---

## Testimonial design rules

- Serif quote character or elegant divider (not quotation-mark icons)
- Quote in medium-large text
- Attribution below in small sans
- Subtle context label: *Former student / Colleague / Collaborator / Client*
- Static layout (2–3 quotes), not carousel by default
- No star ratings, no photos in testimonial blocks

---

## Imagery

- One strong portrait of Agreni
- Contextual photos only if real and meaningful
- Optional: document / notebook / workshop imagery if authentic
- No stock classroom imagery, no abstract diversity stock

---

## Tone of voice

**Good:** "I'm interested in how curriculum, classroom practice, and educational context shape the development of critical thinking and belonging."

**Bad:** "Passionate changemaker transforming the future of education through innovative solutions."

---

## Interior pages (brief)

| Page                     | Priority direction                                                   |
| ------------------------ | -------------------------------------------------------------------- |
| About                    | Portrait, narrative bio, timeline or milestones, "what I care about" |
| Writing                  | Intellectual center — generous spacing, article list, clean reading  |
| Research / Interests     | 3–5 themes as short essays or idea cards, not academic CV            |
| Collaboration / Projects | Case-study summaries, not portfolio tile wall                        |
| Contact                  | Simple: invitation + booking + email                                 |

---

## Implementation notes

- Tailwind tokens do not currently include the brand palette above — add as CSS custom properties in `global.css` if needed
- Google Fonts load: Cormorant Garamond + Inter (swapped from Playfair Display in epic #112)
- The IntersectionObserver in `Layout.astro` is correct and should stay
