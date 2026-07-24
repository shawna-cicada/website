import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import {
  getEngagementsForPractice,
  getPracticeArea,
  getPracticeAreas,
} from "@/lib/cms";
import { breadcrumbJsonLd, jsonLdString, serviceJsonLd } from "@/lib/seo/jsonld";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const practices = await getPracticeAreas();
  return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const practice = await getPracticeArea(slug);
  if (!practice) return {};
  return {
    title: practice.name,
    description: practice.seoDescription,
    alternates: { canonical: `/how-we-help/${practice.slug}` },
  };
}

/** Meadow check mark for outcome lists on ink. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0 text-meadow"
    >
      <path d="M3 9.5 L7 13.5 L15 4.5" />
    </svg>
  );
}

/** Practice-area detail page, entirely adapter-driven. */
export default async function PracticePage({ params }: PageProps) {
  const { slug } = await params;
  const practice = await getPracticeArea(slug);
  if (!practice) notFound();

  const formats = await getEngagementsForPractice(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(serviceJsonLd(practice)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "How We Help", path: "/how-we-help" },
              { name: practice.name, path: `/how-we-help/${practice.slug}` },
            ]),
          ),
        }}
      />

      {/* Hero: business-problem headline (CSS entrances — LCP-safe) */}
      <Section aria-labelledby="practice-heading">
        <Container className="flex max-w-4xl flex-col gap-6">
          <nav aria-label="Breadcrumb" className="anim-rise text-sm">
            <Link
              href="/how-we-help"
              className="text-meadow-deep underline decoration-meadow-deep/40 underline-offset-4 hover:decoration-meadow-deep"
            >
              How We Help
            </Link>
            <span aria-hidden="true" className="mx-2 text-slate">
              /
            </span>
            <span className="text-slate">{practice.name}</span>
          </nav>
          <div className="anim-fade" style={{ animationDuration: "400ms" }}>
            <Heading level={1} visualLevel={2} id="practice-heading">
              {practice.name}
            </Heading>
          </div>
          <div className="anim-rise" style={{ animationDelay: "120ms" }}>
            <p className="max-w-2xl border-l-2 border-meadow pl-5 text-xl leading-snug text-ink/85">
              {practice.headline}
            </p>
          </div>
          <div className="anim-rise" style={{ animationDelay: "220ms" }}>
            <CTAButton
              label="Discuss Your Needs"
              href="/book"
              location={`practice-${practice.slug}-hero`}
              variant="accent"
            />
          </div>
        </Container>
      </Section>

      {/* Who it's for (audience chips) + problems (recognition voice) */}
      <Section tone="surface" aria-labelledby="who-for">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <Heading level={2} visualLevel={3} id="who-for">
                Who it&rsquo;s for
              </Heading>
              {/* Plain quiet lines (founder review: no pills). */}
              <ul className="mt-6 flex flex-col gap-4">
                {practice.whoFor.map((item) => (
                  <li key={item} className="font-medium text-ink/85">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <Heading level={2} visualLevel={3} id="problems">
                Problems we help solve
              </Heading>
              <ul className="mt-6 flex flex-col gap-5">
                {practice.problems.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-meadow-deep pl-5 text-ink/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* The work (thin brand numerals) + outcomes (checks on ink) */}
      <Section aria-labelledby="work-on">
        <Container className="flex flex-col gap-stack">
          <Reveal>
            <div>
              <Heading level={2} visualLevel={3} id="work-on">
                What we may work on
              </Heading>
              <ol className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
                {practice.workOn.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-t border-ink/10 pt-4"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-3xl font-extralight leading-none text-meadow-deep"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-ink/85">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal>
            <div className="on-ink rounded-md bg-ink p-8 sm:p-10" aria-labelledby="leave-with">
              <Heading level={2} visualLevel={3} id="leave-with" className="text-paper">
                What clients leave with
              </Heading>
              <ul className="mt-7 grid gap-x-12 gap-y-5 md:grid-cols-2">
                {practice.leaveWith.map((item) => (
                  <li key={item} className="flex gap-3 text-paper/85">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label text-xs font-bold uppercase tracking-[0.14em] text-slate">
                Supporting capabilities
              </span>
              {practice.supportingCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full bg-lilac px-3 py-1 text-xs font-medium text-ink/75"
                >
                  {capability}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Typical engagement formats */}
      <Section tone="surface" aria-labelledby="formats-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal className="max-w-3xl">
            <Eyebrow>Typical engagement formats</Eyebrow>
            <Heading level={2} visualLevel={3} id="formats-heading" className="mt-2">
              How this work usually takes shape
            </Heading>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {formats.map((engagement, index) => (
              <Reveal key={engagement.name} delay={index * 0.06} className="h-full">
                <Card
                  tone="paper"
                  accent={engagement.audience === "individual"}
                  className="h-full"
                >
                  <div className="flex h-full flex-col gap-3">
                    {engagement.audience === "individual" ? (
                      <p>
                        <span className="inline-flex rounded-full bg-meadow/15 px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.08em] text-ink">
                          One-on-one
                        </span>
                      </p>
                    ) : null}
                    <Heading level={3} visualLevel={4}>
                      {engagement.name}
                    </Heading>
                    <Text muted>
                      {engagement.summary}
                    </Text>
                    <p className="mt-auto pt-1 text-sm text-slate">
                      {engagement.format}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related insights (related practices removed per founder review) */}
      <Section aria-labelledby="related-heading">
        <Container className="max-w-3xl">
          <Reveal>
            <div>
              <Eyebrow>Related insights</Eyebrow>
              <Heading level={2} visualLevel={4} id="related-heading" className="mt-2">
                Reading for this kind of friction
              </Heading>
              <ul className="mt-5 flex flex-col gap-3">
                {practice.relatedInsights.map((insight) => (
                  <li key={insight.title}>
                    <TextLink href={insight.href} arrow>
                      {insight.title}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="ink" aria-labelledby="practice-cta-heading">
        <Container className="flex max-w-3xl flex-col items-start gap-6">
          <Reveal>
            <Heading level={2} id="practice-cta-heading">
              Let&rsquo;s talk it through.
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Text size="lg" className="text-paper/75">
              Tell us what your organization is running into. We will tell you
              honestly whether, and how, we can help.
            </Text>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap gap-4">
            <CTAButton
              label="Discuss Your Needs"
              href="/book"
              location={`practice-${practice.slug}-final`}
              variant="accent"
              size="lg"
            />
            <CTAButton
              label="Start with an assessment"
              href="/assessments"
              location={`practice-${practice.slug}-final`}
              variant="outline"
              size="lg"
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
