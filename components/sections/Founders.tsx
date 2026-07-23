import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Founder section. Portraits are PLACEHOLDER SVGs (labeled in the seed
 * content and alt text) until final editorial photography is supplied —
 * the brief calls for one confident photo of Shawna and Julia together.
 */
export function Founders({
  content,
}: {
  content: HomepageContent["founders"];
}) {
  return (
    <Section aria-labelledby="founders-heading">
      <Container className="flex flex-col gap-stack">
        <Reveal className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="founders-heading" className="mt-2">
            {content.headline}
          </Heading>
          <Text muted className="mt-4">
            {content.copy}
          </Text>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2">
          {content.people.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.1}>
              <figure className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <ImageFrame
                  ratio="3/4"
                  treatment={index % 2 === 0 ? "wing" : "plain"}
                  className="w-40 shrink-0"
                >
                  <Image
                    src={person.imageSrc}
                    alt={person.imageAlt}
                    width={320}
                    height={427}
                    unoptimized
                  />
                </ImageFrame>
                <figcaption className="flex flex-col gap-1">
                  <Heading level={3} visualLevel={4}>
                    {person.name}
                  </Heading>
                  <p className="font-label text-xs font-bold uppercase tracking-[0.14em] text-meadow-deep">
                    {person.role}
                  </p>
                  <Text muted size="sm" className="mt-2">
                    {person.bio}
                  </Text>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <CTAButton
            label={content.cta.label}
            href={content.cta.href}
            location="founders"
            variant="outline"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
