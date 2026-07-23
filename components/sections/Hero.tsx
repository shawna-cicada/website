import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { CicadaMark } from "@/components/brand/CicadaMark";
import type { HomepageContent } from "@/lib/cms/types";

/**
 * Homepage hero: slow reveal, one primary and one secondary action.
 * Entrances are CSS-only (anim-fade/anim-rise) so the headline — the
 * page's LCP element — paints immediately without waiting for
 * hydration, works without JavaScript, and stops under reduced motion
 * via the global clamp. The oversized translucent mark supplies the
 * emergence visual without literal photography; decorative and clipped.
 */
export function Hero({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-paper py-section"
    >
      <CicadaMark className="pointer-events-none absolute -right-24 -top-10 hidden w-[42rem] text-meadow/10 lg:block" />
      <Container className="relative flex max-w-4xl flex-col items-start gap-6">
        <div className="anim-rise">
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </div>
        <div className="anim-fade" style={{ animationDuration: "400ms" }}>
          <Heading level={1} id="hero-heading">
            {content.headline}
          </Heading>
        </div>
        <div className="anim-rise" style={{ animationDelay: "120ms" }}>
          <Text size="lg" muted className="max-w-2xl">
            {content.copy}
          </Text>
        </div>
        <div
          className="anim-rise flex flex-wrap gap-4"
          style={{ animationDelay: "220ms" }}
        >
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
        </div>
      </Container>
    </section>
  );
}
