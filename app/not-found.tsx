import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";

/** Branded 404: honest, helpful, one clear way forward. */
export default function NotFound() {
  return (
    <Section aria-labelledby="nf-heading">
      <Container width="narrow" className="flex flex-col items-start gap-6">
        <Eyebrow>Page not found</Eyebrow>
        <Heading level={1} id="nf-heading">
          This page has been shed.
        </Heading>
        <Text size="lg" muted>
          The address may have changed when we rebuilt the site, or the link
          you followed is out of date. Everything important still exists.
          Here is where to find it:
        </Text>
        <ul className="flex flex-col gap-2">
          <li>
            <TextLink href="/how-we-help" arrow>
              How we help growing companies
            </TextLink>
          </li>
          <li>
            <TextLink href="/assessments" arrow>
              Start with an assessment
            </TextLink>
          </li>
          <li>
            <TextLink href="/insights" arrow>
              Articles and videos
            </TextLink>
          </li>
        </ul>
        <Button href="/" variant="accent">
          Back to the homepage
        </Button>
      </Container>
    </Section>
  );
}
