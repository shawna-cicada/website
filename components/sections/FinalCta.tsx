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
      <Container className="relative flex flex-col items-start gap-8">
        <Reveal>
          <Heading level={2} id="final-cta-heading" className="max-w-3xl">
            {content.headline}
          </Heading>
        </Reveal>
        <Reveal delay={0.1}>
          <Text size="lg" className="max-w-3xl text-paper/75">
            {content.copy}
          </Text>
        </Reveal>
        {/* One card per bookable conversation — each with its own CTA. */}
        <div className="grid w-full gap-5 md:grid-cols-3">
          {content.bookingOptions.map((option, index) => (
            <Reveal key={option.label} delay={0.1 + index * 0.08} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-md bg-ink-soft p-6">
                <p className="flex items-center gap-2.5 font-display text-lg font-bold text-paper">
                  {option.label}
                  {option.free ? (
                    <span className="rounded-full bg-meadow px-2.5 py-0.5 font-label text-xs font-bold uppercase tracking-[0.08em] text-ink">
                      Free
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-paper/70">{option.note}</p>
                <div className="mt-auto pt-2">
                  <CTAButton
                    label={option.ctaLabel}
                    href={option.href}
                    location="final-cta"
                    variant={option.free ? "accent" : "outline"}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
