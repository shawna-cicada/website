# Cicada Agility Redesign — Repository Audit & Implementation Plan

_Audit date: 2026-07-23. Prepared before any production code, per the redesign brief (`WEBSITE_REDESIGN.md`)._

> **Update (same day):** the stack decisions flagged as blocking in §6 were subsequently confirmed by the project owner — see `docs/DECISIONS.md`. The phased plan is maintained going forward in `docs/IMPLEMENTATION_PLAN.md`, and the route/redirect mapping in `docs/MIGRATION_MAP.md`.

## 1. Current framework, package manager, dependencies, and folder structure

**There are none.** The repository contains a single commit (`9480b63 Initial commit`) with one file: a 9-byte `README.md` containing `# website`.

- No `package.json`, lockfile, or package manager.
- No framework, build tooling, CI configuration, or deployment configuration.
- No source directories of any kind.

The current production website lives entirely on **Wix**, outside this repository. This repo is an empty vessel created to receive the rebuild.

## 2. Existing reusable components, styles, assets, and content

**In the repository: nothing.** No components, styles, images, fonts, or content files exist here.

All existing brand equity — copy, articles, founder bios, client logos, the current logo, photography — lives in the Wix site and must be exported. Note: this remote environment's network policy currently blocks outbound requests to `cicadaagility.com` (proxy 403), so the live site could not be crawled from here. A content inventory of the live site must come from a Wix export, from a session with network access to the domain, or from the client directly.

Reusable **conceptual** assets, per the brief:
- Tagline: "Growth Happens in Stages. Leadership Must Evolve With It."
- The Shed → Emerge → Expand framework.
- The cicada transformation metaphor.
- Existing service concepts, founder credibility (Shawna Cullinan, Julia Kaissling), articles, and client logos (pending permission review).

## 3. Technical debt and risks

There is no code debt — the risks are all project and migration risks:

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **No Wix content export yet.** Articles, images, bios, and current URLs are only on Wix. | Blocks migration, redirect map, and SEO preservation (brief requires preserving valuable URLs). | Export Wix content and capture a full URL inventory **before** any DNS/hosting change. Do this early — it also feeds seed content. |
| 2 | **Unknown current URL structure.** A 301 redirect map can't be written without it. | Broken inbound links, lost SEO equity at cutover. | Crawl the live site (sitemap.xml, Google Search Console) as part of the export task. |
| 3 | **CMS not chosen** (Sanity vs. Storyblok). | Blocks all content modeling, the admin experience (a core requirement), and most page work. | Decide before Phase 2. Sanity is the brief's default; adopt it unless Cicada has a reason for Storyblok. |
| 4 | **Scheduler not chosen** (Calendly vs. Cal.com). | Blocks `/book`, but the page shell and analytics can be built against an interface. | Build a provider-agnostic embed wrapper; decide before Phase 5 completes. |
| 5 | **Client logo / testimonial permissions unverified.** | Legal/relationship risk if logos ship without consent. | CMS `active` flag per logo; nothing goes live until reviewed. |
| 6 | **External assessment provider undefined.** The primary CTA points at an assessment that doesn't exist yet. | The #1 conversion pathway has no destination. | CMS-managed external URL so the destination can change without a deploy; launch can proceed with "Book a Discovery Call" promoted to primary if no assessment is live. |
| 7 | **Nontechnical editor requirement.** The customized admin studio is an acceptance criterion, not polish. | Underestimating this makes "done" unreachable. | Treat the admin dashboard, guided workflow, and usability test as their own phase with real budget. |
| 8 | **Email/domain configuration must be preserved** through the DNS cutover. | Business email outage. | Document current DNS records before any change; only move the web A/CNAME records. |
| 9 | **Environment network policy** blocks `cicadaagility.com` from this remote environment. | Migration/crawl tasks can't run here as-is. | Widen the environment's network policy or run the export locally. |

## 4. Clean rebuild or incremental refactor?

**Clean rebuild — unambiguously.** There is no code to refactor. The current site is on a closed platform (Wix), the brief specifies a new stack (Next.js 15 App Router, TypeScript, Tailwind, CMS, Vercel), and the repo is empty. The only "incremental" work is content migration: exporting Wix copy/articles/assets, rewriting outdated Agile-first copy, and building the 301 redirect map. Everything else is greenfield.

## 5. Proposed implementation plan (small, testable phases)

Each phase ends in a deployable, verifiable state.

**Phase 0 — Foundation (no design yet)**
Scaffold Next.js 15 + TypeScript + Tailwind; ESLint/Prettier; Vitest + Playwright wiring; CI (typecheck, lint, test, build); Vercel project with preview deploys.
_Test: CI green; preview URL serves a page; Lighthouse baseline recorded._

**Phase 1 — Design system & tokens**
Color tokens (deep ink, warm ivory, cicada green accent, amber/copper, stone/sage) validated for WCAG AA; typography (editorial display serif + UI sans, variable, self-hosted with licensing checked); spacing/layout primitives; base components (buttons, links with animated underline, cards, nav shell, footer); motion primitives with `prefers-reduced-motion` support baked in from the start.
_Test: component gallery page; automated contrast checks; keyboard/focus audit._

**Phase 2 — CMS & content models** *(blocked on CMS decision)*
Sanity (or Storyblok) project; schemas for Service, Assessment, Insight, Author/Founder, Client Logo, Testimonial, Homepage settings, Site settings — matching the brief's type definitions; draft preview; seed content in `content/seed/`.
_Test: schema validation; seed content renders in preview; nothing from the brief's "do not hard-code" list is hard-coded._

**Phase 3 — Homepage**
All ten homepage sections against CMS content: hero, recognition, Shed→Emerge→Expand (scroll-linked, reduced-motion fallback), How We Help cards, assessment feature, engagement path, client logo marquee (pause on hover/reduced motion), featured insight, founders, final CTA.
_Test: Playwright e2e for CTAs and nav; axe a11y pass; Lighthouse ≥ 90; motion disabled under reduced-motion._

**Phase 4 — How We Help & About**
`/how-we-help` overview + four service subpages (problems, work, outcomes, formats, related insight, "Discuss Your Needs" CTA); `/about` with story, principles, founder bios.
_Test: e2e per page; structured data (Organization, Person, Service) validates._

**Phase 5 — Assessments & Booking**
`/assessments` hub (featured + cards, external links in new tabs, UTM tagging, privacy language); `/book` with embedded scheduler behind a provider-agnostic wrapper, expectation copy, fallback link, event types; contact option below scheduler with spam protection.
_Test: e2e booking flow on mobile viewport; embed-blocked fallback; analytics events fire (`assessment_external_click`, `booking_*`)._

**Phase 6 — Insights**
`/insights` index and `/insights/[slug]` for all five content types; reading time, related articles, video embeds; Article/VideoObject schema; OG/LinkedIn social images; LinkedIn copy generation (Phase-1 manual workflow: generate → copy → mark posted), isolated behind a syndication interface.
_Test: e2e publish-to-render flow; social preview validation; sitemap includes articles._

**Phase 7 — Admin & editorial experience**
Branded admin dashboard (big plain-language actions, drafts/scheduled/published views); guided 5-step article workflow; templates; publish checklist blocking incomplete content; roles (Editor/Publisher/Administrator); guardrails (confirm destructive actions, archive over delete, revision history).
_Test: the brief's editorial acceptance criteria, run as a scripted usability test with a real nontechnical person — observed, not coached._

**Phase 8 — Migration & SEO**
Wix export (content, images, URL inventory); migrate articles preserving slugs where possible; 301 redirect map (Offerings → How We Help; Contact + Meet With Us → /book); rewrite Agile-first copy; sitemap.xml, robots.txt, canonicals, metadata from CMS; privacy/terms pages.
_Test: every legacy URL returns 200 or 301 to the right target (automated check against the URL inventory)._

**Phase 9 — Launch hardening & cutover**
Full analytics event verification; final a11y + performance audit on production build; DNS cutover runbook preserving email; rollback plan; content freeze checklist against "Initial Content Priorities" and "Definition of Done."
_Test: Definition of Done checklist signed off; post-cutover smoke test._

Phases 3–6 can partially overlap once Phase 2 lands; Phase 7 can start in parallel with Phase 4.

## 6. Genuinely blocking decisions

Only three things block the start of meaningful work:

1. **CMS: Sanity or Storyblok?** Blocks Phase 2 and everything downstream. Recommendation: **Sanity**, per the brief's default, unless Cicada already owns Storyblok.
2. **Wix account access / content export.** Blocks migration, redirect map, and real seed content. Needed early even though the code phases can start without it. (Also: widen this environment's network policy to allow `cicadaagility.com`, or run the crawl elsewhere.)
3. **Scheduler: Calendly or Cal.com?** Blocks completing `/book`. Recommendation: **Calendly** for speed at launch, behind an abstraction so Cal.com remains a later swap.

Everything else in the brief's Open Decisions list (first assessment provider, logo approvals, newsletter, logo refresh, case-study links, LinkedIn automation level) is **deferrable**: the CMS-managed design means each can be decided and flipped on without code changes, and the brief's own phasing (e.g., LinkedIn Phase 1 = manual) already assumes the conservative default.
