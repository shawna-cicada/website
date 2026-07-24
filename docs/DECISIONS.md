# Decision Log

Lightweight ADR-style log for the cicadaagility.com rebuild. The repository was empty at project start (one commit, stub README), so nothing pre-existing constrained these choices. Defaults below were confirmed by the project owner on 2026-07-23; the brief (`WEBSITE_REDESIGN.md`) is the source for context and alternatives considered.

Statuses: **Accepted** (build on it) · **Deferred** (decide later; design keeps it swappable) · **Superseded** (replaced by a later entry).

## D-001 — Framework: Next.js (App Router) + TypeScript — Accepted
The brief's recommended stack; nothing in the repo establishes an alternative. App Router gives us layouts, streaming, route groups (`app/(site)/`), and first-class metadata/sitemap support for the SEO requirements.

## D-002 — Styling: Tailwind CSS — Accepted
Design tokens (color, type scale, spacing) live in the Tailwind theme so the brand system is enforced in one place. WCAG AA contrast is validated at the token level, not per-page.

## D-003 — Motion: CSS-first, Framer Motion where it earns its place — Accepted
Per the brief: CSS animation by default; Framer Motion only for the scroll-linked Shed → Emerge → Expand sequence and other interactions needing real orchestration. All motion respects `prefers-reduced-motion`.

## D-004 — CMS: Sanity, isolated behind a content adapter — Accepted
Sanity was the brief's default recommendation and is confirmed. **All page/data access goes through `lib/cms/` adapter interfaces** — components never import Sanity clients or GROQ directly. This keeps a future migration (e.g., to Storyblok) a lib-level change, and lets tests and seed content run against a fixture-backed adapter. The customized Studio (branded dashboard, guided workflows, plain-language labels) is a core deliverable, not default Sanity config.

## D-005 — Hosting: Vercel — Accepted
Preview deploys per PR, native Next.js support, redirects/headers config for the 301 map, and image optimization.

## D-006 — Booking: Calendly, isolated behind a booking adapter — Accepted
Calendly is the fastest path to a working `/book` page. **The embed, event-type config, prefill/UTM passthrough, and analytics hooks live behind `lib/booking/`** so Cal.com remains a drop-in replacement if Cicada later wants a branded/self-hosted experience. A plain fallback link renders if the embed is blocked.

## D-007 — Analytics: Vercel Analytics — Accepted
Custom events implemented through a thin `lib/analytics/` wrapper (`track(event, props)`) emitting the brief's event taxonomy (`cta_click`, `assessment_external_click`, `booking_*`, etc.). The wrapper keeps a later move to Plausible or a dual-send trivial.

## D-008 — Testing: Vitest + Playwright — Accepted
Vitest for unit/component tests (adapters, validation, LinkedIn copy generation); Playwright for e2e journeys (homepage CTAs, booking flow, assessment outbound links, insights render, redirect map verification) plus axe-based accessibility checks.

## D-009 — Validation & forms: Zod + React Hook Form — Accepted
Per the brief. Zod schemas double as the contract for CMS-shaped data crossing the content adapter.

## D-010 — Email: Resend for contact form delivery — Accepted
Per the brief. Used by the contact option on `/book`.

## D-011 — LinkedIn syndication: Phase 1 (manual with generated copy) — Accepted
The CMS generates suggested post copy + canonical URL with a one-click copy action; posting is manual. Automation (Phase 2 webhook → approval, Phase 3 direct API) is isolated behind `lib/linkedin/` and deferred until LinkedIn app permissions exist.

## D-012 — First assessment provider — Deferred
The Growth Stage Assessment CTA links to a CMS-managed external URL, so the provider can be chosen (and changed) without a deploy. If none is live at launch, "Book a Discovery Call" is promoted to primary CTA via CMS settings.

## D-013 — Client logos and case-study links — Deferred
Every logo record carries `active` and permission-review status in the CMS; nothing renders publicly until approved. Case-study links ship only if content exists at launch.

## D-014 — Newsletter — Deferred
Not in launch scope. The final-CTA section leaves room for it; adding it later is a CMS + one-component change.

## D-015 — Logo retained or refreshed — Deferred
The design system treats the logo as a swappable asset; token-based color means a refresh doesn't ripple through the build.

## D-017 — Adopt the official Cicada brand assets — Accepted (2026-07-23)
Cicada supplied the official brand presentation and logo EPS. The design
system's speculative palette (warm ivory / chartreuse / copper) was replaced
with the real brand: Mountain Meadow green, Big Stone/Rhino navy, White
Lilac, Melrose, Malibu, Silver — plus AA-validated derived tints. Fonts moved
to brand Open Sans (body) + Montserrat (labels/buttons); Fraunces stays as
the editorial display face per the brief's "modernize" direction. The logo
mark and CICADA logotype were extracted from the EPS into vector React
components. Full mapping: `docs/BRAND.md`. This supersedes the visual
speculation in D-002's original execution; the token architecture is
unchanged.

## D-018 — Admin built ahead of the Sanity project; Next.js upgraded to 16 — Accepted (2026-07-23)
The Phase 7 admin experience shipped before the Sanity project exists: all
editorial logic (slugs, checklist, templates, permissions, workflow
transitions, LinkedIn copy) lives in pure, fully-tested `lib/editorial/`
modules; the Studio (`sanity.config.tsx`, `sanity/`) is a thin shell over
them, embedded at `/admin`, which renders a plain-language setup notice
until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set. Sanity v6 requires a React
export that Next 15's vendored React lacked, so the framework moved to
Next 16 (with `next-sanity` 13) — all suites pass unchanged. Social
syndication is provider-neutral behind `lib/linkedin/` with a manual-only
default and a tested no-network guarantee (docs/LINKEDIN_WORKFLOW.md).

## D-019 — Framework stage order is Emerge → Shed → Expand — Accepted (2026-07-23)
Confirmed directly by the founder, twice, superseding the order printed in
WEBSITE_REDESIGN.md ("Shed → Emerge → Expand") and the earlier mockup. Do
NOT "fix" the order back to match the brief — the brief is outdated on
this point. Applied to the homepage framework, the About-page metaphor
copy, the design-system sample, and the content contract test.

## D-020 — Sanity project coordinates committed; /insights reads published content — Accepted (2026-07-23)
The live Sanity project (`66n8qkam`, dataset `production`) is committed as
the default in `lib/sanity/config.ts`. Project ID and dataset are public
identifiers — they appear in every browser request the site makes — so
committing them removes deploy-time env coupling without weakening
security; access control lives entirely in Sanity sign-in + roles. The
env vars remain as overrides for forks or a staging dataset. Phase 6's
public pages (`/insights`, `/insights/[slug]`) read ONLY documents with
`workflowStatus == "published"` through an untokened, CDN-cached client
(drafts are unreachable by construction), revalidate every 5 minutes, and
degrade to an honest empty state / 404 whenever Sanity is unreachable —
the site builds and runs with zero network access to Sanity.

## D-021 — Site content merge model: Studio overrides, seed fallback — Accepted (2026-07-23)
Editor-managed documents now drive parts of the public site beyond
insights, with committed seed content as the always-present fallback:
- **Client logos**: `clientLogo` documents (uploaded, alt-texted, and
  permission-gated in /admin) replace the seed records the moment the
  first active one exists. The public gate is unchanged — only
  `permissionConfirmed` records render; until any exist, the labeled
  demo placeholders remain.
- **Homepage**: the singleton "Homepage Content" document overrides the
  hero headline/copy field-by-field (blank fields fall through to seed)
  and can feature a published insight in the homepage insight section.
Merging is pure, unit-tested logic (`lib/cms/mappers.ts`); fetching
degrades to "no override" on any Sanity failure, so the site can never
render blank from a CMS outage. Pages consuming this content revalidate
every 5 minutes — editor changes reach the live site without redeploys.
Practices, About, and the remaining homepage sections stay seed-managed
until schemas for them are deliberately designed (they encode layout
constraints an unstructured text field would break).

## D-022 — Assessments are proprietary; responses are collected for follow-up — Accepted (2026-07-23)
Founder correction, superseding the earlier "third-party assessments"
framing: the assessments are Cicada Agility's own instruments, hosted on
an external survey platform, and respondents' answers and contact
details ARE collected — used to deliver results, follow up, and build
the CRM. The /assessments disclosure and per-assessment privacy notes
now say this plainly. The launch-gated privacy policy must cover this
collection before cutover (see LAUNCH_CHECKLIST).

## D-023 — Coaching added as a first-class engagement and booking type — Accepted (2026-07-23)
Founder addition: the engagement list was operations-heavy, missing the
individual dimension. "Executive & Leadership Coaching" (1:1 coaching,
360° feedback, culture-shaping behaviors) joins the engagement records,
serving the Leadership & Team Effectiveness and Founder Challenges
practices. /book gains a fourth event type, "Coaching Session", for
existing clients (CALENDLY_EVENT_URL_COACHING_SESSION; email fallback
until set, like every event type).

## D-024 — Cal.com is the live booking provider; public event links committed — Accepted (2026-07-24)
Founder set up Cal.com (account `cicadaagility`). BOOKING_PROVIDER now
defaults to calcom, and the three public event links are committed as
defaults in lib/booking/calcom.ts (same reasoning as D-020 — they are
the pages visitors are sent to): discovery `30min` (free, badged on the
homepage), debrief `60min`, coaching `coaching-session`. Env vars remain
as overrides; hostname validation applies to defaults and overrides
alike. "Existing Client Session" was removed from the offering —
coaching covers the returning-client path. The homepage final CTA now
renders one card per bookable conversation, deep-linking /book#<event>,
which pre-selects the matching type.

## D-016 — Wix content export & URL inventory — Open action item (not a design decision)
Required before Phase 8 (migration) and before any DNS change. See `docs/MIGRATION_MAP.md` for what depends on it. Note: this remote environment's network policy currently blocks `cicadaagility.com`, so the crawl/export must run elsewhere or the policy must be widened.
