import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading, Text } from "@/components/ui/Text";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { CicadaMark } from "@/components/brand/CicadaMark";
import type { HomepageContent } from "@/lib/cms/types";

/** Closing conversion moment on the ink surface. */
export function FinalCta({
  content,
}: {
  content: HomepageContent["finalCta"];
}) {
  return (
    <Section tone="ink" aria-labelledby="final-cta-heading" className="relative overflow-hidden">
      <CicadaMark className="pointer-events-none absolute -left-24 top-1/2 w-[36rem] -translate-y-1/2 text-meadow/10" />
      <Container className="relative flex max-w-3xl flex-col items-start gap-6">
        <Reveal>
          <Heading level={2} id="final-cta-heading">
            {content.headline}
          </Heading>
        </Reveal>
        <Reveal delay={0.1}>
          <Text size="lg" className="text-paper/75">
            {content.copy}
          </Text>
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap gap-4">
          <CTAButton
            label={content.primaryCta.label}
            href={content.primaryCta.href}
            location="final-cta"
            variant="accent"
            size="lg"
          />
          <CTAButton
            label={content.secondaryCta.label}
            href={content.secondaryCta.href}
            location="final-cta"
            variant="outline"
            size="lg"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
