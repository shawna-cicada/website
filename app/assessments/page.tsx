import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { AssessmentCta } from "@/components/sections/AssessmentCta";
import { PageViewTracker } from "@/components/sections/PageViewTracker";
import { getActiveAssessments, getAssessmentsPageContent } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  // The search-result description is Studio-editable (D-026).
  const content = await getAssessmentsPageContent();
  return {
    title: "Assessments",
    description: content.seoDescription,
    alternates: { canonical: "/assessments" },
  };
}

/**
 * Assessment hub: featured assessment leads, remaining active records in
 * a card grid. External links are clearly indicated and unconfigured
 * records render disabled. Deliberately no filters — add them only when
 * more than six records are active (per WEBSITE_REDESIGN.md).
 */
export default async function AssessmentsPage() {
  const [active, content] = await Promise.all([
    getActiveAssessments(),
    getAssessmentsPageContent(),
  ]);
  const featured = active.find((assessment) => assessment.featured);
  const rest = active.filter((assessment) => !assessment.featured);

  return (
    <>
      <PageViewTracker event="assessment_view" props={{ path: "/assessments" }} />

      <Section spacing="compact" aria-labelledby="assessments-heading">
        <PageHero
          eyebrow="Assessments"
          headline={content.hero.headline}
          copy={content.hero.copy}
          headingId="assessments-heading"
        />
      </Section>

      {featured ? (
        <Section tone="surface" spacing="compact" aria-labelledby="featured-assessment-heading">
          {/* Anchor target for the header's Assessments dropdown. */}
          <Container className="scroll-mt-24" id={featured.slug}>
            <Reveal>
              <Card tone="ink" className="p-8 sm:p-12">
                <div className="flex max-w-2xl flex-col gap-4">
                  <Eyebrow>Featured assessment</Eyebrow>
                  <Heading level={2} id="featured-assessment-heading">
                    {featured.title}
                  </Heading>
                  <Text size="lg" className="text-paper/75">
                    {featured.summary}
                  </Text>
                  <p className="text-sm text-paper/60">
                    {[featured.audience, featured.duration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mt-2">
                    <AssessmentCta
                      slug={featured.slug}
                      title={featured.title}
                      ctaLabel={featured.ctaLabel}
                      externalUrl={featured.externalUrl}
                      opensInNewTab={featured.opensInNewTab}
                      trackingCampaign={featured.trackingCampaign}
                      location="assessments-featured"
                    />
                  </div>
                  {featured.privacyNote ? (
                    <p className="text-xs text-paper/55">{featured.privacyNote}</p>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section spacing="compact" aria-labelledby="all-assessments-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal>
            <Heading level={2} visualLevel={3} id="all-assessments-heading">
              {content.gridHeadline}
            </Heading>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((assessment, index) => (
              <Reveal key={assessment.slug} delay={index * 0.06} className="h-full">
                {/* Anchor target for the header's Assessments dropdown. */}
                <div id={assessment.slug} className="h-full scroll-mt-24">
                <Card tone="surface" className="h-full">
                  <div className="flex h-full flex-col gap-3">
                    <Heading level={3} visualLevel={4}>
                      {assessment.title}
                    </Heading>
                    <Text muted>
                      {assessment.summary}
                    </Text>
                    <p className="text-sm text-slate">
                      {[assessment.audience, assessment.duration]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="mt-auto pt-2">
                      <AssessmentCta
                        slug={assessment.slug}
                        title={assessment.title}
                        ctaLabel={assessment.ctaLabel}
                        externalUrl={assessment.externalUrl}
                        opensInNewTab={assessment.opensInNewTab}
                        trackingCampaign={assessment.trackingCampaign}
                        location="assessments-grid"
                        variant="outline"
                      />
                    </div>
                  </div>
                </Card>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="rounded-sm border border-ink/10 bg-paper p-6">
              <h2 className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
                {content.aboutHeadline}
              </h2>
              <p className="mt-3 max-w-3xl text-sm text-slate">
                {content.aboutCopy}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
