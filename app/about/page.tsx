import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { CicadaMark } from "@/components/brand/CicadaMark";
import { GrowthRings } from "@/components/brand/GrowthRings";
import { getAboutContent, getFounders } from "@/lib/cms";
import { aboutJsonLd, jsonLdString } from "@/lib/seo/jsonld";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();
  return {
    title: "About",
    description: content.hero.copy,
  };
}

/** /about — story, beliefs, approach, founders, principles, credibility. */
export default async function AboutPage() {
  const [content, founders] = await Promise.all([
    getAboutContent(),
    getFounders(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            aboutJsonLd(
              founders.map((founder) => ({
                name: founder.name,
                role: founder.role,
                bio: founder.bio,
                expertise: founder.expertise,
                linkedInUrl: founder.linkedInUrl,
              })),
            ),
          ),
        }}
      />

      {/* 1 — Hero */}
      <section
        aria-labelledby="about-heading"
        className="relative overflow-hidden bg-paper py-section"
      >
        <CicadaMark className="pointer-events-none absolute -right-20 top-4 hidden w-[34rem] text-meadow/10 lg:block" />
        <div className="relative">
          <PageHero
            eyebrow="About Cicada Agility"
            headline={content.hero.headline}
            copy={content.hero.copy}
            headingId="about-heading"
          />
        </div>
      </section>

      {/* 2 — Origin story & metaphor */}
      <Section tone="ink" aria-labelledby="origin-heading">
        <Container className="grid gap-12 lg:grid-cols-[1fr_auto]">
          <div className="flex max-w-2xl flex-col gap-5">
            <Reveal>
              <Heading level={2} id="origin-heading">
                {content.origin.headline}
              </Heading>
            </Reveal>
            {content.origin.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <Text size="lg" className="text-paper/80">
                  {paragraph}
                </Text>
              </Reveal>
            ))}
          </div>
          <Reveal className="hidden items-center lg:flex">
            <CicadaMark className="w-72 text-meadow" />
          </Reveal>
        </Container>
      </Section>

      {/* 3 — Beliefs */}
      <Section aria-labelledby="beliefs-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal>
            <Eyebrow>The belief behind the work</Eyebrow>
            <Heading level={2} id="beliefs-heading" className="mt-2">
              {content.beliefs.headline}
            </Heading>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {content.beliefs.items.map((belief, index) => (
              <Reveal key={belief} delay={index * 0.07}>
                <p className="border-l-2 border-meadow pl-5 text-lg text-slate">
                  {belief}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4 — Connected system */}
      <Section tone="surface" aria-labelledby="system-heading">
        <Container className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <Reveal className="hidden lg:block">
            <GrowthRings size={200} className="text-ink/50" />
          </Reveal>
          <Reveal>
            <Heading level={2} id="system-heading">
              {content.system.headline}
            </Heading>
            <Text muted size="lg" className="mt-4 max-w-2xl">
              {content.system.copy}
            </Text>
            <div className="mt-6">
              <TextLink href="/how-we-help" arrow>
                See how the practices connect
              </TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 5 — Founders */}
      <Section aria-labelledby="founders-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal className="max-w-3xl">
            <Eyebrow>Meet Shawna and Julia</Eyebrow>
            <Heading level={2} id="founders-heading" className="mt-2">
              Two perspectives. One connected system.
            </Heading>
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-2">
            {founders.map((founder, index) => (
              <Reveal key={founder.name} delay={index * 0.1} className="h-full">
                <Card tone="surface" className="h-full">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-start gap-5">
                      <ImageFrame
                        ratio="3/4"
                        treatment={index % 2 === 0 ? "wing" : "plain"}
                        className="w-32 shrink-0"
                      >
                        <Image
                          src={founder.imageSrc}
                          alt={founder.imageAlt}
                          width={320}
                          height={427}
                          unoptimized
                        />
                      </ImageFrame>
                      <div className="min-w-0">
                        <Heading level={3} visualLevel={4}>
                          {founder.name}
                        </Heading>
                        <p className="mt-1 font-label text-xs font-bold uppercase tracking-[0.14em] text-meadow-deep">
                          {founder.role}
                        </p>
                        {founder.linkedInUrl ? (
                          <TextLink
                            href={founder.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-sm"
                          >
                            LinkedIn
                          </TextLink>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <Text muted size="sm">
                        {founder.bio}
                      </Text>
                      {founder.draftBio ? (
                        <p className="mt-2 text-xs italic text-slate">
                          Draft bio — pending editorial review.
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="font-label text-xs font-bold uppercase tracking-[0.14em] text-meadow-deep">
                          Expertise
                        </h4>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate">
                          {founder.expertise.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-label text-xs font-bold uppercase tracking-[0.14em] text-meadow-deep">
                          Selected experience
                        </h4>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate">
                          {founder.selectedExperience.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {founder.speakingTopics.length > 0 ? (
                      <div>
                        <h4 className="font-label text-xs font-bold uppercase tracking-[0.14em] text-meadow-deep">
                          Speaking topics
                        </h4>
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-slate">
                          {founder.speakingTopics.map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6 — Working principles */}
      <Section tone="ink" aria-labelledby="principles-heading">
        <Container className="flex flex-col gap-stack">
          <Reveal>
            <Eyebrow>Working principles</Eyebrow>
            <Heading level={2} id="principles-heading" className="mt-2">
              {content.principles.headline}
            </Heading>
          </Reveal>
          <ol className="grid gap-x-12 gap-y-6 md:grid-cols-2">
            {content.principles.items.map((principle, index) => (
              <li key={principle}>
                <Reveal delay={index * 0.06} className="flex gap-4">
                  <span className="font-display text-2xl font-medium text-meadow">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg text-paper/85">{principle}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 7 — Client experience */}
      <Section aria-labelledby="client-exp-heading">
        <Container className="flex max-w-3xl flex-col gap-4">
          <Reveal>
            <Eyebrow>Client experience</Eyebrow>
            <Heading level={2} id="client-exp-heading" className="mt-2">
              {content.clientExperience.headline}
            </Heading>
            <Text muted size="lg" className="mt-4">
              {content.clientExperience.copy}
            </Text>
          </Reveal>
        </Container>
      </Section>

      {/* 8 — CTA */}
      <Section tone="surface" aria-labelledby="about-cta-heading">
        <Container className="flex max-w-3xl flex-col items-start gap-6">
          <Reveal>
            <Heading level={2} id="about-cta-heading">
              {content.cta.headline}
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Text muted size="lg">
              {content.cta.copy}
            </Text>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap gap-4">
            <CTAButton
              label={content.cta.primaryCta.label}
              href={content.cta.primaryCta.href}
              location="about-cta"
              variant="accent"
              size="lg"
            />
            <CTAButton
              label={content.cta.secondaryCta.label}
              href={content.cta.secondaryCta.href}
              location="about-cta"
              variant="outline"
              size="lg"
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
