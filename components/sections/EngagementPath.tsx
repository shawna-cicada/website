import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Discover → Diagnose → Evolve as a numbered, rule-separated list, with
 * the engagement menu on a rounded ink card (per the approved design).
 */
export function EngagementPath({
  content,
}: {
  content: HomepageContent["engagement"];
}) {
  return (
    <Section tone="surface" aria-labelledby="engagement-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="engagement-heading" className="mt-2">
            {content.headline}
          </Heading>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <ol>
            {content.steps.map((step, index) => (
              <li key={step.title} className="border-t border-ink/10">
                <Reveal delay={index * 0.08}>
                  <div className="grid grid-cols-[4rem_1fr] items-start gap-6 py-10 sm:grid-cols-[6rem_1fr]">
                    <span
                      aria-hidden="true"
                      className="font-label text-5xl font-extralight leading-none text-meadow-deep"
                    >
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold leading-snug">
                        {step.title}
                      </h3>
                      <Text muted size="lg" className="mt-3">
                        {step.copy}
                      </Text>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal className="self-start">
            <aside
              aria-labelledby="engagements-list-heading"
              className="on-ink rounded-2xl bg-ink p-8 text-paper sm:p-10"
            >
              <h3
                id="engagements-list-heading"
                className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow"
              >
                Focused engagements
              </h3>
              {/* Compact pill cloud (founder review): scannable at a
                  glance, no bullet lines to read through. */}
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {content.engagements.map((engagement) => (
                  <li
                    key={engagement}
                    className="rounded-full border border-paper/20 bg-paper/10 px-3.5 py-1.5 text-sm text-paper/90"
                  >
                    {engagement}
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
