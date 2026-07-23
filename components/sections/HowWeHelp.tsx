import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/** Four service cards tied to business needs, each linking to its page. */
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
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {content.items.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.07} className="h-full">
              <Card interactive tone="surface" className="h-full">
                <div className="flex h-full flex-col gap-4">
                  <Heading level={3} visualLevel={4}>
                    {service.title}
                  </Heading>
                  <Text muted>{service.copy}</Text>
                  <ul className="mt-1 flex flex-col gap-1.5 text-sm text-slate">
                    {service.examples.map((example) => (
                      <li key={example} className="flex gap-2">
                        <span aria-hidden="true" className="text-meadow-deep">
                          —
                        </span>
                        {example}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <TextLink href={service.href} arrow>
                      Learn more
                    </TextLink>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <CTAButton
            label={content.cta.label}
            href={content.cta.href}
            location="how-we-help"
            variant="outline"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
