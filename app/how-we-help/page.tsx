import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { GrowthRings } from "@/components/brand/GrowthRings";
import {
  getEngagements,
  getHowWeHelpContent,
  getPracticeAreas,
} from "@/lib/cms";
import { jsonLdString, servicesListJsonLd } from "@/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHowWeHelpContent();
  return {
    title: "How We Help",
    description: content.copy,
  };
}

/**
 * How We Help overview: the four practices presented as one connected
 * system, followed by the configurable engagement records.
 */
export default async function HowWeHelpPage() {
  const [content, practices, engagements] = await Promise.all([
    getHowWeHelpContent(),
    getPracticeAreas(),
    getEngagements(),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(servicesListJsonLd(practices, engagements)),
        }}
      />

      <Section aria-labelledby="hwh-heading">
        <PageHero
          eyebrow={content.eyebrow}
          headline={content.headline}
          copy={content.copy}
          headingId="hwh-heading"
        />
      </Section>

      <Section tone="surface" aria-labelledby="hwh-system-heading">
        <Container className="flex flex-col gap-stack">
          {/* The connected-system narrative, told here in full — the
              About page continues it, but this page must stand alone. */}
          <div className="grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)]">
            <Reveal className="hidden justify-center lg:flex">
              <GrowthRings size={260} className="text-ink/25" />
            </Reveal>
            <Reveal>
              <Eyebrow>One connected system</Eyebrow>
              <Heading level={2} id="hwh-system-heading" visualLevel={3} className="mt-2 max-w-2xl">
                Growth friction shows up in one place — and starts in another.
              </Heading>
              <div className="mt-4 flex max-w-2xl flex-col gap-4">
                {content.systemNarrative.map((paragraph) => (
                  <Text muted key={paragraph.slice(0, 32)}>
                    {paragraph}
                  </Text>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {practices.map((practice, index) => (
              <Reveal key={practice.slug} delay={index * 0.07} className="h-full">
                <Card interactive tone="paper" className="h-full">
                  <div className="flex h-full flex-col gap-3">
                    <Heading level={3} visualLevel={4}>
                      {practice.name}
                    </Heading>
                    <p className="font-medium text-slate">{practice.headline}</p>
                    <Text muted>
                      {practice.summary}
                    </Text>
                    <div className="mt-auto pt-2">
                      <TextLink href={`/how-we-help/${practice.slug}`} arrow>
                        Explore this practice
                      </TextLink>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="hwh-engagements-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal className="max-w-3xl">
            <Eyebrow>Engagements</Eyebrow>
            <Heading level={2} id="hwh-engagements-heading" className="mt-2">
              {content.engagementsHeadline}
            </Heading>
            <Text muted className="mt-3">
              {content.engagementsCopy}
            </Text>
          </Reveal>
          {/* Eight engagements: 4-across on wide screens → two even rows. */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {engagements.map((engagement, index) => (
              <Reveal key={engagement.name} delay={index * 0.06} className="h-full">
                <Card
                  tone="surface"
                  accent={engagement.audience === "individual"}
                  padding="compact"
                  className="h-full"
                >
                  <div className="flex h-full flex-col gap-3">
                    {engagement.audience === "individual" ? (
                      <p>
                        <span className="inline-flex rounded-full bg-meadow/15 px-3 py-1 font-label text-xs font-semibold uppercase tracking-[0.08em] text-meadow-deep">
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
                    <p className="text-sm text-slate">
                      <span className="font-semibold">Best for:</span>{" "}
                      {engagement.bestFor}
                    </p>
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

      <Section tone="ink" aria-labelledby="hwh-cta-heading">
        <Container className="flex max-w-3xl flex-col items-start gap-6">
          <Reveal>
            <Heading level={2} id="hwh-cta-heading">
              Not sure where the friction starts?
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Text size="lg" className="text-paper/75">
              That is normal — it usually starts in more than one place. A
              short conversation is the fastest way to find out.
            </Text>
          </Reveal>
          <Reveal delay={0.2}>
            <CTAButton
              label={content.cta.label}
              href={content.cta.href}
              location="how-we-help-overview"
              variant="accent"
              size="lg"
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
