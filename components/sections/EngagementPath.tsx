import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/** Discover → Diagnose → Evolve, with the engagement menu beneath. */
export function EngagementPath({
  content,
}: {
  content: HomepageContent["engagement"];
}) {
  return (
    <Section aria-labelledby="engagement-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="engagement-heading" className="mt-2">
            {content.headline}
          </Heading>
        </Reveal>

        <ol className="grid gap-6 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <li key={step.title} className="h-full">
              <Reveal delay={index * 0.1} className="h-full">
                <div className="flex h-full flex-col gap-3 border-t-2 border-meadow pt-5">
                  <span className="font-display text-3xl font-medium text-meadow-deep">
                    {step.step}
                  </span>
                  <Heading level={3} visualLevel={4}>
                    {step.title}
                  </Heading>
                  <Text muted>{step.copy}</Text>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="rounded-sm bg-lilac p-6 sm:p-8">
            <h3 className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
              Focused engagements include
            </h3>
            <ul className="mt-4 grid gap-x-10 gap-y-2 text-slate sm:grid-cols-2 lg:grid-cols-3">
              {content.engagements.map((engagement) => (
                <li key={engagement} className="flex gap-2">
                  <span aria-hidden="true" className="text-meadow-deep">
                    —
                  </span>
                  {engagement}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
