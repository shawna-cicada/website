import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { WingLayers } from "@/components/brand/WingLayers";
import { formatInsightDate } from "@/lib/cms/format";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * The homepage insights section. With published articles available it
 * renders the latest three as compact cards (title, category, date,
 * link — no excerpt; founder request 2026-07-27). Until any article
 * exists it falls back to the single sample card, so the section is
 * never empty.
 */
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

        {content.items.length > 0 ? (
          <ul className="grid list-none gap-6 md:grid-cols-3">
            {content.items.map((item, index) => (
              <li key={item.href}>
                <Reveal delay={index * 0.06} className="h-full">
                  <Card interactive tone="paper" padding="compact" className="h-full">
                    <article className="flex h-full flex-col gap-3">
                      {item.category ? (
                        <p>
                          <span className="inline-flex rounded-full bg-lilac px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.08em] text-ink">
                            {item.category}
                          </span>
                        </p>
                      ) : null}
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        {/* Stretched link: the whole card is clickable. */}
                        <Link
                          href={item.href}
                          className="hover:text-meadow-deep after:absolute after:inset-0"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      {item.publishedAt ? (
                        <p className="mt-auto pt-1 text-sm text-slate">
                          {formatInsightDate(item.publishedAt)}
                        </p>
                      ) : null}
                    </article>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
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
        )}

        <Reveal>
          <TextLink href={content.cta.href} arrow className="text-lg">
            {content.cta.label}
          </TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
