# Final Content & UX Audit

Conducted 2026-07-23 as a skeptical founder/CEO visiting for the first
time, across every production page at desktop and mobile widths.
Verdicts first, then issues by severity. Items marked **[implemented]**
were fixed in the same change as this audit.

## The fourteen questions

| Question | Verdict |
|---|---|
| Who Cicada helps, within 5 seconds? | **Yes.** Eyebrow ("Leadership evolution for growing companies") + headline land it before the fold. |
| What business problems it solves? | **Yes.** The ink recognition section is concrete symptoms, not services. |
| Shed → Emerge → Expand clear? | **Yes** — numbered stages, plain subtitles, progress rule. The metaphor is explained fully on /about; the homepage stays practical. |
| One obvious next step? | **Now yes.** Was the site's worst flaw — see Critical 1. |
| Too much consulting jargon? | **Mostly no.** Copy is symptom-first ("Leaders agree in the meeting but act from different assumptions afterward"). Watch-list: "operating rhythms", "decision rights", "capability" — currently earning their keep. Agile vocabulary is confined to supporting-capability lines and enforced by test. |
| Current, premium, distinctive? | **Yes with caveats.** Editorial serif + real brand mark + restrained palette reads premium; founder placeholder portraits (grey SVG silhouettes) are the weakest visual — flagged, gated on photography. |
| Four services one connected story? | **Yes.** "One connected system" framing, shared growth-ring motif, "Connects with:" lines, cross-links on every detail page. |
| Assessments useful entry, not sales trap? | **Yes.** Time estimates, audience, explicit "your answers are handled by the provider; we don't receive them unless you share" — and unconfigured assessments say so instead of harvesting clicks. |
| Booking easy and trustworthy? | **Structure yes** — three named conversation types, time-zone note, privacy copy, fallback path. Real trust depends on the live Calendly connection (launch-gated). |
| Founders credible and human? | **Half.** Bios are concrete about complementary domains; but placeholder portraits + "Draft bio" markers honestly signal unfinished. Gated on business content (photos, approved bios, LinkedIn URLs). |
| Client logos used responsibly? | **Now yes** — see Critical 2. |
| Every page a conversion purpose? | **Yes.** Home→assess/book; practices→Discuss Your Needs; assessments→start/book; about→book; 404→re-route. /insights is a stub (known Phase 6 gap, launch-gated). |
| Mobile equally strong? | **Yes.** 320px verified by test, disclosure nav, 44px targets, static logo grid on small screens. |
| Animation supporting the story? | **Yes after fixes.** Framework stages no longer dim text (contrast held in every scroll state); heroes paint instantly via CSS; everything stops under reduced motion. |

## Critical issues

1. **Primary CTA dead-ended.** "Start the Growth Stage Assessment" led to
   a disabled "available soon" button while no provider URL is
   configured — the #1 conversion path ended in a dead end.
   **[implemented]** The homepage now checks whether the featured
   assessment is live: if not, the hero leads with "Book a Discovery
   Call" and offers "Explore our assessments" as secondary. The moment
   `ASSESSMENT_URL_GROWTH_STAGE` is set, the assessment resumes the
   lead automatically. (`app/page.tsx`; e2e-tested both framings.)

2. **Placeholder client logos shown publicly.** Six fake grey logos on
   the homepage read as fabricated credibility to a skeptical visitor —
   worse than no logos. **[implemented]** The homepage logo wall now
   renders only approved client records (written permission), exactly
   like /clients; with none approved, the section does not exist.
   (`app/page.tsx`; e2e asserts no placeholder ever renders.)

## Important improvements

3. **Framework stages started at 35% opacity** until scrolled — washed
   out for anyone who doesn't scroll "correctly," and a genuine WCAG
   contrast failure caught by axe. **[implemented]** Stages animate
   position and ring growth only; text is always full-contrast.
4. **Hero (LCP) waited for JavaScript.** All page h1s were inside
   hydration-gated reveals: slow perceived load, blank hero on slow
   networks. **[implemented]** All heroes now use CSS-only entrances
   (LCP ~4.8s → ~3.5s in the throttled container; better on CDN).
5. **Featured insight links to a stub.** The homepage's editorial
   feature points at the /insights "under construction" page. *Not
   implementable without business content* — requires Phase 6 + three
   migrated/new articles (launch-gated in LAUNCH_CHECKLIST.md). The
   stub page is at least honest about what it is.
6. **Founder photography.** The single confident photo of Shawna and
   Julia together (per the brief) will do more for credibility than any
   copy change. *Gated on supplied photography.*

## Optional enhancements (post-launch)

7. A short "What working with us looks like" strip on /book (reduce
   pre-call anxiety; needs founder-approved copy).
8. Case-insight teasers on practice pages once client permissions exist.
9. Subtle scroll-progress indicator on long practice pages.
10. A tightened 60-character meta description pass once real analytics
    show which pages earn search impressions.
11. Replace remaining stub pages (/privacy, /terms) — legal copy,
    launch-gated.

## Exact changes made with this audit

- `app/page.tsx` → hero CTA gating + approved-only logo wall (above).
- `components/sections/Framework.tsx` → opacity animation removed.
- `components/sections/Hero.tsx`, `components/sections/PageHero.tsx`,
  all page heroes → CSS entrances.
- `tests/e2e/homepage.spec.ts` → asserts the no-dead-end hero and the
  hidden logo wall.
