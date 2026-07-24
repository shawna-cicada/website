import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { getPublishedInsights } from "@/lib/cms";
import { INSIGHT_KIND_LABELS, formatInsightDate } from "@/lib/cms/format";

// Newly published pieces appear without a redeploy (matches
// INSIGHTS_REVALIDATE_SECONDS; Next requires a literal here).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Articles and Insights",
  description:
    "Articles, videos, and conversations from our work with founders and leadership teams: what each stage of growth demands, what companies outgrow, and how leadership evolves through it.",
  alternates: { canonical: "/insights" },
};

/**
 * Public insights index (Phase 6). Lists published CMS documents; when
 * none exist (or Sanity is unreachable) it renders an honest empty
 * state rather than sample content.
 */
export default async function InsightsPage() {
  const insights = await getPublishedInsights();

  return (
    <>
      <Section aria-labelledby="insights-heading">
        <PageHero
          eyebrow="From our work"
          headline="Articles and Insights"
          copy="Articles, videos, and conversations from our work with founders and leadership teams: what each stage of growth demands, what companies outgrow, and how leadership evolves through it."
          headingId="insights-heading"
        />
      </Section>

      {insights.length === 0 ? (
        <Section tone="surface" aria-labelledby="insights-empty-heading">
          <Container className="flex max-w-3xl flex-col items-start gap-6">
            <Heading level={2} visualLevel={3} id="insights-empty-heading">
              The first pieces are on their way.
            </Heading>
            <Text muted>
              We are moving our writing into its new home. Until it lands
              here, the fastest way to hear how we think is a conversation.
            </Text>
            <CTAButton
              label="Book a Conversation"
              href="/book"
              location="insights-empty"
              variant="accent"
            />
          </Container>
        </Section>
      ) : (
        <Section tone="surface" aria-label="Published insights">
          <Container>
            <ul className="grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight, index) => {
                const meta = [
                  INSIGHT_KIND_LABELS[insight.kind] ?? "Article",
                  formatInsightDate(insight.publishedAt),
                  insight.readingTime ? `${insight.readingTime} min read` : null,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={insight.slug}>
                    <Reveal delay={(index % 3) * 0.06} className="h-full">
                      <Card interactive tone="paper" className="h-full">
                        <article className="flex h-full flex-col gap-3">
                          {insight.imageUrl ? (
                            // Flush thumbnail: cancel the card padding so
                            // the image bleeds to the card edges.
                            <div className="relative -mx-6 -mt-6 mb-1 aspect-[16/9] overflow-hidden rounded-t-sm sm:-mx-8 sm:-mt-8">
                              <Image
                                src={insight.imageUrl}
                                alt={insight.imageAlt ?? ""}
                                fill
                                sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                                className="object-cover"
                              />
                            </div>
                          ) : null}
                          {insight.category ? (
                            <p>
                              <span className="inline-flex rounded-full bg-lilac px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.08em] text-ink">
                                {insight.category}
                              </span>
                            </p>
                          ) : null}
                          <Heading level={2} visualLevel={4}>
                            <Link
                              href={`/insights/${insight.slug}`}
                              className="hover:text-meadow-deep"
                            >
                              {insight.title}
                            </Link>
                          </Heading>
                          <Text muted>{insight.summary}</Text>
                          <p className="mt-auto pt-2 text-sm text-slate">
                            {meta}
                          </p>
                        </article>
                      </Card>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
