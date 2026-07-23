import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Recognition section: the problem statements a visitor should see
 * themselves in, staggered into view one by one.
 */
export function Recognition({
  content,
}: {
  content: HomepageContent["recognition"];
}) {
  return (
    <Section tone="ink" aria-labelledby="recognition-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal>
          <Heading level={2} id="recognition-heading" className="max-w-3xl">
            {content.headline}
          </Heading>
        </Reveal>
        <ul className="grid gap-x-12 gap-y-6 md:grid-cols-2">
          {content.statements.map((statement, index) => (
            <li key={statement}>
              <Reveal delay={index * 0.08}>
                <p className="border-l-2 border-meadow pl-5 text-lg text-paper/85">
                  {statement}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal>
          <TextLink href={content.cta.href} arrow className="text-lg">
            {content.cta.label}
          </TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
