# Implementation Plan — cicadaagility.com Rebuild

This is the working plan for building the new site described in `WEBSITE_REDESIGN.md`, using the stack confirmed in `docs/DECISIONS.md`. The repository is empty at time of writing, so this is a **clean greenfield build**; the only migration work is content (see `docs/MIGRATION_MAP.md`).

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion (selective) · Sanity CMS behind a content adapter · Vercel hosting · Vercel Analytics · Calendly behind a booking adapter · Resend · Zod + React Hook Form · Vitest + Playwright.

## Architectural spine

Two isolation rules hold across every phase:

1. **Content adapter (`lib/cms/`).** Components consume typed interfaces (`getHomepage()`, `getInsights()`, `getAssessments()`…) — never Sanity clients or GROQ directly. A fixture-backed implementation serves tests and local seed content (`content/seed/`).
2. **Provider adapters.** Booking (`lib/booking/`), analytics (`lib/analytics/`), and LinkedIn syndication (`lib/linkedin/`) each sit behind a small interface so Calendly→Cal.com, Vercel Analytics→Plausible, or manual→automated posting are lib-level swaps.

Target repository structure follows the brief:

```text
app/(site)/...      # pages: /, how-we-help, assessments, insights, about, clients, book
app/api/            # contact, preview, webhooks
components/         # layout, sections, cards, motion, forms, cms
lib/                # analytics, cms, booking, linkedin, seo, validation
content/seed/       # fixture content for dev and tests
public/             # images, logos, icons
tests/              # e2e specs
```

## Phases

Each phase ends deployable and verifiable. Phases 3–6 can partially overlap once Phase 2 lands; Phase 7 can begin alongside Phase 4.

### Phase 0 — Foundation
Scaffold Next.js + TypeScript + Tailwind; ESLint/Prettier; Vitest + Playwright wiring; CI (typecheck, lint, test, build); Vercel project with preview deploys.
**Done when:** CI is green, a preview URL serves a page, Lighthouse baseline is recorded.

### Phase 1 — Design system & tokens
Color tokens per the brief's direction (deep ink, warm ivory, cicada green/chartreuse accent, amber/copper, stone/sage) with WCAG AA contrast validated at the token level. Typography: editorial display serif + readable UI sans (variable, self-hosted, licensing verified). Base components: buttons, animated-underline links, cards, nav shell with persistent "Book a Conversation" button, footer. Motion primitives with `prefers-reduced-motion` support from day one.
**Done when:** a component gallery page renders every primitive; automated contrast checks pass; keyboard/focus audit passes.

### Phase 2 — CMS & content models
Sanity project + schemas: Service, Assessment, Insight (5 content types), Author/Founder, Client Logo, Testimonial, Homepage settings, Site settings — matching the brief's type definitions. Content adapter with both Sanity-backed and fixture-backed implementations; draft preview mode; seed content. Nothing on the brief's "do not hard-code" list is hard-coded.
**Done when:** Zod validation passes on all schemas; seed content renders through the adapter; preview mode shows drafts.

### Phase 3 — Homepage
All ten sections against CMS content: hero, recognition statements, scroll-linked Shed → Emerge → Expand (with static reduced-motion fallback), four How We Help cards, assessment feature, three-step engagement path, client logo marquee (grayscale, pauses on hover/reduced motion, CMS-managed), featured insight, founders section, final CTA. One primary + at most one secondary CTA per section.
**Done when:** Playwright covers nav + every CTA; axe passes; Lighthouse ≥ 90; motion fully disabled under reduced-motion.

### Phase 4 — How We Help & About
`/how-we-help` overview plus four subpages (leadership-team-effectiveness, organizational-effectiveness, ai-enablement, founder-growth), each with: problems solved, what we work on, what clients leave with, engagement formats, related insight, "Discuss Your Needs" CTA. `/about` with origin story, working principles, founder bios (CMS-managed profiles).
**Done when:** e2e passes per page; Organization/Person/Service structured data validates.

### Phase 5 — Assessments & Booking
`/assessments` hub: featured assessment, CMS-managed cards, external links open in new tabs with UTM parameters and privacy language shown before leaving. `/book`: Calendly embed via the booking adapter — expectation copy above, event types (Discovery Call, Assessment Debrief, Existing Client Session), auto time zone, mobile-accessible, fallback link when the embed is blocked — plus a simple contact form (React Hook Form + Zod + Resend, spam-protected, clear success/error states).
**Done when:** e2e booking flow passes on mobile viewport; embed-blocked fallback verified; `assessment_*` and `booking_*` events fire with CTA label/location/destination/UTM props.

### Phase 6 — Insights
`/insights` index and `/insights/[slug]` for article, video, podcast, guide, and case-insight types. Reading time, related articles by category, video embeds, Article/VideoObject schema, OG + LinkedIn social images. LinkedIn workflow Phase 1: generated post copy from title/summary/takeaway/canonical URL, one-click copy, ready/posted status, final post URL field — all behind `lib/linkedin/`.
**Done when:** publish-to-render e2e passes; social previews validate; articles appear in sitemap and internal links.
**Status (2026-07-23):** Core pages SHIPPED against the live Sanity project (D-020): index + article pages render published documents (Portable Text, YouTube/Vimeo embeds via an allowlisted converter, Article/VideoObject + Breadcrumb schema, OG images from the main image, sitemap entries, 5-minute revalidation, honest empty state). Remaining: related-articles module, per-article social image generation, publish-to-render e2e against real content, Wix article migration (Phase 8).

### Phase 7 — Admin & editorial experience
This is a core deliverable with its own budget, per the brief. Branded Sanity Studio dashboard with plain-language actions (Create a New Article, Add a Video, Manage Assessments, …) and views for drafts / scheduled / recently published / incomplete content. Guided 5-step article workflow (type → content → preview → promotion → publish) with the pre-publish checklist blocking incomplete articles. Article templates (Leadership Insight, Founder Lesson, Practical Guide, Video Post, Case Insight). Roles: Editor / Publisher / Administrator. Guardrails: confirm destructive actions, archive over delete, protect referenced authors/categories, revision history. Automatic behavior: slug generation, duplicate-URL warning, reading time, image optimization, default SEO/social metadata, autosave, related-article suggestions.
**Done when:** the brief's editorial acceptance criteria pass as a scripted usability test with a real nontechnical editor — observed, not coached; any step needing verbal explanation gets simplified and retested.

### Phase 8 — Migration & SEO
Execute `docs/MIGRATION_MAP.md`: Wix export (copy, articles, images, full URL inventory), migrate articles preserving slugs where possible, 301 redirects in `next.config` / `vercel.json`, rewrite Agile-first copy around growth and organizational evolution, replace placeholder Discovery Call text. sitemap.xml, robots.txt, canonical URLs, CMS-managed titles/descriptions, privacy and terms pages.
**Done when:** an automated check confirms every legacy URL in the inventory returns 200 or 301 to the mapped target.

### Phase 9 — Launch hardening & cutover
Full analytics event verification against the brief's taxonomy; final accessibility (WCAG 2.2 AA) and performance audit on the production build; DNS cutover runbook that preserves email records; rollback plan; content freeze checklist against the brief's "Initial Content Priorities" and "Definition of Done."
**Done when:** Definition of Done is signed off and the post-cutover smoke test passes on the live domain.

## Pre-requisites & external dependencies

| Item | Needed by | Status |
|------|-----------|--------|
| Sanity project/org access | Phase 2 | To be provisioned |
| Calendly account + event types | Phase 5 | To be provisioned |
| Wix export + URL inventory | Phase 8 (earlier is better — feeds seed content) | **Open** — note this environment's network policy blocks `cicadaagility.com`; run the crawl elsewhere or widen the policy |
| First external assessment URL | Launch (CMS-managed, hot-swappable) | Deferred (D-012) |
| Approved client logos | Launch (gated by CMS `active` flag) | Deferred (D-013) |
| Founder photos + updated bios | Phase 3/4 content | To be supplied |
| Font licenses for self-hosting | Phase 1 | To be verified at typeface selection |
