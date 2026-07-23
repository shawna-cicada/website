import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { WingLayers } from "@/components/brand/WingLayers";
import type { HomepageContent } from "@/lib/cms/types";

/** One insight, large editorial treatment. */
export function FeaturedInsightSection({
  content,
}: {
  content: HomepageContent["insight"];
}) {
  const insight = content.featured;

  return (
    <Section tone="surface" aria-labelledby="insight-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="insight-heading" className="mt-2">
            {content.headline}
          </Heading>
        </Reveal>

        <Reveal>
          <article className="grid items-center gap-10 rounded-sm bg-paper p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
                {insight.category}
              </p>
              <h3 className="font-display text-3xl font-medium leading-[1.15]">
                <Link
                  href={insight.href}
                  className="transition-colors duration-[var(--duration-quick)] hover:text-meadow-deep"
                >
                  {insight.title}
                </Link>
              </h3>
              <Text muted size="lg">
                {insight.excerpt}
              </Text>
              <TextLink href={insight.href} arrow className="mt-2">
                Read the insight
              </TextLink>
            </div>
            <WingLayers
              className="hidden justify-self-end text-ink/70 lg:block"
              width={260}
            />
          </article>
        </Reveal>

        <Reveal>
          <TextLink href={content.cta.href} arrow className="text-lg">
            {content.cta.label}
          </TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
