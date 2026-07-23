# Launch Checklist

The gate between "the build is done" and "cicadaagility.com points at
it." Work top to bottom; nothing in "Cutover" happens until every
"Before cutover" item is checked.

## Before cutover — content & services

- [x] Sanity project created (`66n8qkam`, committed per D-020 — no env
      var needed).
- [x] **Phase 6 (/insights) built and wired to the CMS** — public index +
      article pages render published documents; empty state until content
      exists.
- [ ] Sanity CORS origins include the deployed site URL(s) so /admin can
      sign in (manage.sanity.io → API → CORS origins).
- [ ] Article migration from Wix into Sanity (preserves existing article
      URLs; see Wix export item below).
- [ ] Wix content export complete: articles, images, full URL inventory
      (sitemap.xml + Search Console). Replace the *(verify)* sources in
      docs/MIGRATION_MAP.md and extend `lib/seo/redirects.ts` if the
      inventory shows more URLs.
- [ ] Existing articles migrated with slugs preserved.
- [ ] Calendly account: three event types created; env URLs set.
- [ ] At least one live assessment URL set (or accept the "available
      soon" state and make Book a Discovery Call the hero primary CTA —
      one-line change in `content/seed/homepage.ts` / CMS).
- [ ] Founder bios approved (clear `draftBio`), final photography in.
- [ ] Client logo permissions gathered; approved records entered.
      (Until then the homepage marquee shows SAMPLE logos with a visible
      "layout preview" caption — real approved records replace them and
      remove the caption automatically. Do not launch with samples.)
- [ ] Privacy policy and terms written (replace the /privacy and /terms
      stubs — legal review). MUST cover assessment data: assessments are
      proprietary to Cicada and respondents' answers + contact details
      are collected for results delivery, follow-up, and the CRM (the
      /assessments page discloses this; the policy has to back it).
- [ ] Editor usability test passed (docs/ADMIN_USABILITY_TEST.md).
- [ ] `BOOKING_CONTACT_EMAIL` set; email address live.

## Before cutover — technical

- [ ] All env vars set in Vercel per docs/ENVIRONMENT_VARIABLES.md;
      deployment logs show no `[env][CRITICAL]` warnings.
- [ ] Full suite green in CI: lint, typecheck, unit, Playwright.
- [ ] Lighthouse on the production URL (not localhost): Performance ≥ 90,
      Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Redirect spot-check on the production URL: /offerings, /contact,
      /meet-with-us, /articles/<real-slug>.
- [ ] Booking embed verified on desktop + mobile against real Calendly.
- [ ] `ERROR_MONITORING_WEBHOOK` set and a test error confirmed received.
- [ ] Search Console property added for the new site; sitemap submitted
      at cutover.

## Cutover (see docs/ROLLBACK_PLAN.md before starting)

1. Export the current DNS zone; save it with the launch ticket.
2. Lower web-record TTLs to 300s; wait for old TTL to expire.
3. Freeze Wix content (no edits after the export).
4. Add `cicadaagility.com` + `www` as Vercel domains; set the DNS
   records Vercel specifies (A/ALIAS + CNAME). **Touch no MX records.**
5. Verify HTTPS on both hosts; verify redirects, booking, assessments.
6. Submit sitemap.xml in Search Console; request recrawl of key pages.
7. Monitor error webhook + Vercel analytics for 48h.
8. Keep Wix published (unlinked) for 30 days as the rollback target.

## Documented exceptions (not hidden, not blockers)

- **CSP includes 'unsafe-inline'/'unsafe-eval'** for Next.js bootstrap,
  styled-components (Studio), and the Sanity Studio bundle. Post-launch
  hardening: nonce-based CSP via middleware; tracked, not launch-gating.
- **Scheduled publishing** sets status/time in the CMS but needs the
  small publish-time trigger (Sanity scheduled publishing or a cron)
  when Phase 2 wires live content.
- **Contact form** is deferred: /book offers scheduling + mailto
  fallback. When a form is added, apply honeypot + rate limiting +
  Resend (stack decision D-010) before exposing it.
- **Analytics consent banner intentionally absent**: Vercel Analytics is
  cookieless and stores no personal identifiers, so consent is not
  required for it. Revisit if any cookie-setting tool is ever added.
- **Insights pages are live but empty** until articles are migrated or
  written; the index shows an honest empty state, never sample content.
- **Lighthouse perf 84–90 measured in the dev container** (simulated
  throttling against localhost, no CDN). Verify ≥90 on the real Vercel
  URL — edge caching and HTTP/2 push typically add several points.
