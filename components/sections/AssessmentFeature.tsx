import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Assessment feature (per the approved design): the featured assessment
 * on a rounded ink card; the rest as a quiet rule-separated list.
 */
export function AssessmentFeature({
  content,
}: {
  content: HomepageContent["assessments"];
}) {
  const featured = content.items.find((item) => item.featured);
  const rest = content.items.filter((item) => !item.featured);

  return (
    <Section aria-labelledby="assessments-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="assessments-heading" className="mt-2">
            {content.headline}
          </Heading>
          <Text muted size="lg" className="mt-4">
            {content.copy}
          </Text>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {featured ? (
            <Reveal className="h-full">
              <div className="on-ink flex h-full flex-col gap-5 rounded-2xl bg-ink p-8 text-paper sm:p-12">
                <p className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow">
                  Featured
                </p>
                <h3 className="mt-6 font-display text-3xl font-bold leading-[1.15]">
                  {featured.title}
                </h3>
                <Text size="lg" className="text-paper/75">
                  {featured.summary}
                </Text>
                <p className="text-sm text-paper/60">
                  {[featured.audience, featured.duration]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div className="mt-auto pt-2">
                  <CTAButton
                    label={`${featured.ctaLabel} →`}
                    href={featured.href}
                    location="assessment-feature"
                    variant="accent"
                  />
                </div>
              </div>
            </Reveal>
          ) : null}

          <ul className="flex flex-col self-center">
            {rest.map((assessment, index) => (
              <li key={assessment.title} className="border-t border-ink/15 py-7 last:pb-0">
                <Reveal delay={index * 0.07}>
                  <h3 className="font-display text-2xl font-semibold leading-snug">
                    <Link
                      href={assessment.href}
                      className="transition-colors duration-[var(--duration-quick)] hover:text-meadow-deep"
                    >
                      {assessment.title}
                    </Link>
                  </h3>
                  <Text muted size="lg" className="mt-2">
                    {assessment.summary}
                  </Text>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
