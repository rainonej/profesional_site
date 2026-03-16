# Cost Analysis

All figures are approximate and current as of early 2026. Prices may change.

---

## Scenario 1: Demo Only (this repository as-is)

| Item | Cost |
|---|---|
| GitHub repository (public) | Free |
| GitHub Pages hosting | Free |
| GitHub Actions CI/CD (public repo) | Free |
| Pages CMS | Free (open source) |
| Decap CMS | Free (open source, CDN-loaded) |
| Calendly (basic scheduling) | Free (limited features) |
| Custom domain (optional) | ~$12–$15/year |
| **Total** | **$0–$15/year** |

Notes:
- GitHub Pages is free for public repositories with up to 1 GB storage and 100 GB/month bandwidth
- No server, no database, no runtime infrastructure

---

## Scenario 2: Production Minimal (go-live with real content)

| Item | Cost |
|---|---|
| GitHub Pages hosting | Free |
| Custom domain (.com) | ~$12–$15/year |
| Calendly Standard (more event types, branding removal) | ~$10/month |
| Email (Google Workspace or similar) | ~$6–$12/month |
| **Total** | **~$16–$27/month (~$200–$325/year)** |

Notes:
- All infrastructure remains free; costs come from optional services
- Calendly Free tier is sufficient for a simple "30-minute intro call" link

---

## Scenario 3: Production with Premium Visual Editing

| Item | Cost |
|---|---|
| GitHub Pages or Netlify hosting | Free–$19/month |
| Custom domain | ~$12–$15/year |
| Tina CMS (live visual editing, cloud) | Free–$29/month |
| Calendly Standard | ~$10/month |
| Email | ~$6–$12/month |
| **Total** | **~$26–$70/month (~$312–$840/year)** |

Notes:
- Tina CMS provides a live, in-page visual editor with a free tier for small sites
- Netlify Pro ($19/month) adds form handling, faster builds, and branch deploys
- This scenario is appropriate if the site will be updated very frequently by a non-technical editor who needs a visual preview of changes

---

## Comparison of CMS Options

| CMS | Cost | Visual editing | Setup effort | Best for |
|---|---|---|---|---|
| Pages CMS | Free | Form-based | 5 minutes | Most users |
| Decap CMS | Free | Form-based | 30 minutes (OAuth setup) | Users already familiar with Netlify CMS |
| Tina CMS | Free / $29+/mo | Live in-page | 1–2 hours | Frequent non-technical editors |
| Sanity | Free / $99+/mo | Studio UI | 2–4 hours | Complex content models |

---

## Summary Recommendation

For a personal academic site with infrequent updates:

- Start with **Scenario 1** (free) using Pages CMS for content editing
- Add a custom domain (~$12/year) when going live
- Upgrade Calendly only if the free tier's limitations become a constraint
- Total cost at launch: **~$12–$15/year**
