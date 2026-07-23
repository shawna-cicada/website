# Migration Map — Wix → New Site

Maps the current Wix site's routes to the new information architecture and marks which need 301 redirects. Redirects will be implemented in `next.config.ts` (`redirects()`) or `vercel.json` during Phase 8.

## Status of this map

The known pages come from the redesign brief: **Home, Offerings, About, Contact, Meet With Us, Articles**. The exact live Wix slugs could **not** be verified from this environment — the network policy blocks requests to `cicadaagility.com` — so paths below marked *(verify)* are the conventional Wix patterns and must be confirmed against the live site's `sitemap.xml` / Google Search Console URL inventory **before** cutover. Treat this document as authoritative for *targets* and provisional for *sources* until that inventory lands.

## Route map

| Current Wix route | New route | Action | Notes |
|---|---|---|---|
| `/` | `/` | Keep (no redirect) | Homepage rebuilt per brief structure. |
| `/offerings` *(verify)* | `/how-we-help` | **301** | Brief explicitly replaces "Offerings" with "How We Help." |
| Offerings sub-anchors or sub-pages, if any *(verify)* | `/how-we-help/leadership-team-effectiveness`, `/how-we-help/organizational-effectiveness`, `/how-we-help/ai-enablement`, `/how-we-help/founder-growth` | **301** per sub-page | Map each old service section to its closest new service page; anything unmatched falls back to `/how-we-help`. |
| `/about` *(verify)* | `/about` | Keep (no redirect) | Same path; content rewritten. |
| `/contact` *(verify)* | `/book` | **301** | Brief consolidates Contact + Meet With Us into `/book`, with a contact option below the scheduler. |
| `/meet-with-us` *(verify)* | `/book` | **301** | See above. |
| `/articles` *(verify — Wix blogs also commonly live at `/blog`)* | `/insights` | **301** | Index page rename. |
| `/articles/<slug>` or Wix blog pattern `/post/<slug>` *(verify)* | `/insights/<slug>` | **301** per article | Preserve original slugs in the CMS wherever possible so most redirects are a single pattern rule (`/post/:slug → /insights/:slug`); hand-map any slug that changes. |
| Wix system/auxiliary URLs (e.g., `/blog/categories/*`, `/blog/tags/*`, search pages) *(verify)* | `/insights` | **301** (catch-all) | Only if they exist and have inbound traffic; otherwise let them 410/404 with a helpful not-found page. |
| Any Wix-generated media URLs (`static.wixstatic.com/...`) | n/a | No redirect possible | Off-domain; re-host all images during export. Update any hardcoded references in migrated article bodies. |

## New routes with no Wix predecessor

No redirects needed — these are net-new: `/assessments`, `/clients` (optional at launch), `/privacy`, `/terms`, and the four `/how-we-help/*` sub-pages (unless matched to old sub-pages above).

## Redirect rules of thumb

- **301 (permanent)**, never 302 — SEO equity transfer is the point.
- Redirect to the most specific equivalent, not the homepage; only unmatched long-tail URLs fall back to a section index.
- Keep the map data-driven (one JSON/TS source consumed by `redirects()`), so the verified Wix inventory drops in without rewriting logic.
- After cutover, run the automated check (Phase 8 acceptance): every URL in the legacy inventory must return 200 or 301 to its mapped target, with no redirect chains longer than one hop.

## Pre-cutover checklist

1. Obtain live URL inventory: Wix `sitemap.xml`, Google Search Console pages report, and analytics top-pages export.
2. Confirm/replace every *(verify)* source path above.
3. Export all article content + images from Wix; re-host images.
4. Record existing DNS (including MX/email records) before any change; only web records move.
5. Freeze Wix content once export is taken.
