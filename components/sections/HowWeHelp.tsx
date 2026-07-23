import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Four practices as numbered entries (per the approved design):
 * meadow index, title, rule, one explicit line, and a Learn more pill.
 */
export function HowWeHelp({
  content,
}: {
  content: HomepageContent["services"];
}) {
  return (
    <Section aria-labelledby="services-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="services-heading" className="mt-2">
            {content.headline}
          </Heading>
          <div className="mt-5">
            <TextLink href={content.cta.href} arrow className="text-lg">
              {content.cta.label}
            </TextLink>
          </div>
        </Reveal>

        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {content.items.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.07} className="h-full">
              <div className="flex h-full flex-col gap-5">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="pt-1 font-label text-sm font-semibold tracking-[0.1em] text-meadow-deep"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Heading level={3} visualLevel={3}>
                    {service.title}
                  </Heading>
                </div>
                <hr className="border-ink/10" />
                <Text muted size="lg">
                  {service.copy}
                </Text>
                <div className="mt-auto">
                  <Button href={service.href} variant="outline" size="sm">
                    Learn more
                    <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
