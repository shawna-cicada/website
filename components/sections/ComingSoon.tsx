import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

/**
 * Temporary stub for routes whose build phase has not landed yet.
 * Keeps every navigation and CTA destination real (no 404s) while the
 * site is built out phase by phase.
 */
export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <Section aria-labelledby="page-heading">
      <Container width="narrow" className="flex flex-col items-start gap-6">
        <Eyebrow>Under construction</Eyebrow>
        <Heading level={1} id="page-heading">
          {title}
        </Heading>
        <Text size="lg" muted>
          {note}
        </Text>
        <Button href="/" variant="outline">
          Back to the homepage
        </Button>
      </Container>
    </Section>
  );
}
