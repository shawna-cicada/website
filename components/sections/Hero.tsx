import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { CicadaMark } from "@/components/brand/CicadaMark";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Homepage hero: slow reveal, one primary and one secondary action.
 * The oversized translucent mark supplies the emergence visual without
 * literal photography; it is decorative and clipped, never shifting layout.
 */
export function Hero({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-paper py-section"
    >
      <CicadaMark className="pointer-events-none absolute -right-24 -top-10 hidden w-[42rem] text-meadow/10 lg:block" />
      <Container className="relative flex max-w-4xl flex-col items-start gap-6">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading level={1} id="hero-heading">
            {content.headline}
          </Heading>
        </Reveal>
        <Reveal delay={0.2}>
          <Text size="lg" muted className="max-w-2xl">
            {content.copy}
          </Text>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-wrap gap-4">
          <CTAButton
            label={content.primaryCta.label}
            href={content.primaryCta.href}
            location="hero"
            variant="accent"
            size="lg"
          />
          <CTAButton
            label={content.secondaryCta.label}
            href={content.secondaryCta.href}
            location="hero"
            variant="outline"
            size="lg"
          />
        </Reveal>
      </Container>
    </section>
  );
}
