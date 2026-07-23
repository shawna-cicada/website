import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

/**
 * Placeholder homepage. The full ten-section homepage lands in Phase 3;
 * this page exists so the shell, tokens, and route tree are exercised.
 */
export default function HomePage() {
  return (
    <Section aria-labelledby="home-heading">
      <Container width="narrow" className="flex flex-col items-start gap-6">
        <Eyebrow>Leadership evolution for growing companies</Eyebrow>
        <Heading level={1} id="home-heading">
          Growth Happens in Stages. Leadership Must Evolve With It.
        </Heading>
        <Text size="lg" muted>
          The full site is under construction. The design system that will
          carry it is ready for review.
        </Text>
        <Button href="/design-system" variant="accent">
          View the design system
        </Button>
      </Container>
    </Section>
  );
}
