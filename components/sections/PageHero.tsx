import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";

/**
 * Standard page hero with CSS-only entrances: the h1 (usually the LCP
 * element) paints immediately — no hydration dependency, no-JS safe,
 * stopped by the global reduced-motion clamp.
 */
export function PageHero({
  eyebrow,
  headline,
  copy,
  headingId,
  children,
}: {
  eyebrow: string;
  headline: string;
  copy?: string;
  headingId: string;
  children?: ReactNode;
}) {
  return (
    <Container className="flex max-w-4xl flex-col gap-6">
      <div className="anim-rise">
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div className="anim-fade" style={{ animationDuration: "400ms" }}>
        <Heading level={1} id={headingId}>
          {headline}
        </Heading>
      </div>
      {copy ? (
        <div className="anim-rise" style={{ animationDelay: "120ms" }}>
          <Text size="lg" muted className="max-w-2xl">
            {copy}
          </Text>
        </div>
      ) : null}
      {children ? (
        <div className="anim-rise" style={{ animationDelay: "220ms" }}>
          {children}
        </div>
      ) : null}
    </Container>
  );
}
