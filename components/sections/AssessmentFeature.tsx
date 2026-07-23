import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Assessment feature: the featured assessment leads on an ink card;
 * the remaining CMS-managed assessment cards support it.
 */
export function AssessmentFeature({
  content,
}: {
  content: HomepageContent["assessments"];
}) {
  const featured = content.items.find((item) => item.featured);
  const rest = content.items.filter((item) => !item.featured);

  return (
    <Section tone="surface" aria-labelledby="assessments-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="assessments-heading" className="mt-2">
            {content.headline}
          </Heading>
          <Text muted className="mt-4">
            {content.copy}
          </Text>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {featured ? (
            <Reveal className="h-full">
              <Card tone="ink" interactive className="h-full">
                <div className="flex h-full flex-col gap-4">
                  <Eyebrow>Featured</Eyebrow>
                  <Heading level={3} visualLevel={3}>
                    {featured.title}
                  </Heading>
                  <Text className="text-paper/75">{featured.summary}</Text>
                  <p className="text-sm text-paper/60">
                    {[featured.audience, featured.duration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mt-auto pt-2">
                    <CTAButton
                      label={featured.ctaLabel}
                      href={featured.href}
                      location="assessment-feature"
                      variant="accent"
                    />
                  </div>
                </div>
              </Card>
            </Reveal>
          ) : null}

          <div className="flex flex-col gap-6">
            {rest.map((assessment, index) => (
              <Reveal key={assessment.title} delay={index * 0.07}>
                <Card tone="paper" interactive>
                  <div className="flex flex-col gap-2">
                    <Heading level={3} visualLevel={4}>
                      {assessment.title}
                    </Heading>
                    <Text size="sm" muted>
                      {assessment.summary}
                    </Text>
                    <TextLink href={assessment.href} arrow className="mt-1 text-sm">
                      {assessment.ctaLabel}
                    </TextLink>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
