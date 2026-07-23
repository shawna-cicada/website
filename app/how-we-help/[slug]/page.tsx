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

function ListBlock({
  id,
  eyebrow,
  title,
  items,
  columns = 1,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <div aria-labelledby={id}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading level={2} visualLevel={3} id={id} className={eyebrow ? "mt-2" : ""}>
        {title}
      </Heading>
      <ul
        className={`mt-6 grid gap-x-10 gap-y-3 ${
          columns === 2 ? "md:grid-cols-2" : ""
        }`}
      >
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-slate">
            <span aria-hidden="true" className="mt-[2px] text-meadow-deep">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Practice-area detail page, entirely adapter-driven. */
export default async function PracticePage({ params }: PageProps) {
  const { slug } = await params;
  const practice = await getPracticeArea(slug);
  if (!practice) notFound();

  const [allPractices, formats] = await Promise.all([
    getPracticeAreas(),
    getEngagementsForPractice(slug),
  ]);
  const related = practice.relatedPractices
    .map((relatedSlug) =>
      allPractices.find((candidate) => candidate.slug === relatedSlug),
    )
    .filter((candidate) => candidate !== undefined);

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
          <div className="anim-rise">
            <Eyebrow>{practice.name}</Eyebrow>
          </div>
          <div className="anim-fade" style={{ animationDuration: "400ms" }}>
            <Heading level={1} visualLevel={2} id="practice-heading">
              {practice.headline}
            </Heading>
          </div>
          <div className="anim-rise" style={{ animationDelay: "120ms" }}>
            <Text size="lg" muted className="max-w-2xl">
              {practice.summary}
            </Text>
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

      {/* Who it's for */}
      <Section tone="surface" aria-labelledby="who-for">
        <Container className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <ListBlock
              id="who-for"
              eyebrow="Who it's for"
              title="Where this work usually starts"
              items={practice.whoFor}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ListBlock
              id="problems"
              eyebrow="Problems we help solve"
              title="What it looks like from the inside"
              items={practice.problems}
            />
          </Reveal>
        </Container>
      </Section>

      {/* What we may work on / leave with */}
      <Section aria-labelledby="work-on">
        <Container className="flex flex-col gap-stack">
          <Reveal>
            <ListBlock
              id="work-on"
              eyebrow="What we may work on"
              title="The work, shaped to your stage"
              items={practice.workOn}
              columns={2}
            />
          </Reveal>
          <Reveal>
            <div className="rounded-sm bg-lilac p-6 sm:p-8">
              <ListBlock
                id="leave-with"
                eyebrow="What clients leave with"
                title="What is different afterward"
                items={practice.leaveWith}
                columns={2}
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="text-sm text-slate">
              <span className="font-semibold">Supporting capabilities:</span>{" "}
              {practice.supportingCapabilities.join(" · ")}
            </p>
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
                <Card tone="paper" className="h-full">
                  <div className="flex h-full flex-col gap-3">
                    <Heading level={3} visualLevel={4}>
                      {engagement.name}
                    </Heading>
                    <Text muted size="sm">
                      {engagement.summary}
                    </Text>
                    <p className="mt-auto pt-1 text-xs text-slate">
                      {engagement.format}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related insights + related practices */}
      <Section aria-labelledby="related-heading">
        <Container className="grid gap-12 lg:grid-cols-2">
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
          <Reveal delay={0.1}>
            <div>
              <Eyebrow>Related practices</Eyebrow>
              <Heading level={2} visualLevel={4} className="mt-2">
                This work often pairs with
              </Heading>
              <ul className="mt-5 flex flex-col gap-4">
                {related.map((relatedPractice) => (
                  <li key={relatedPractice.slug}>
                    <TextLink
                      href={`/how-we-help/${relatedPractice.slug}`}
                      arrow
                    >
                      {relatedPractice.name}
                    </TextLink>
                    <p className="mt-1 text-sm text-slate">
                      {relatedPractice.summary}
                    </p>
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
              honestly whether — and how — we can help.
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
