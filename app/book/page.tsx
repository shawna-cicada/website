import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import { BookingExperience } from "@/components/booking/BookingExperience";
import { PageViewTracker } from "@/components/sections/PageViewTracker";
import { getBookingConfig } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a Conversation",
  description:
    "Choose the conversation that best fits where you are today — a discovery call, an assessment debrief, or an existing client session with Cicada Agility.",
};

/** /book: provider-agnostic scheduling with an always-available fallback. */
export default function BookPage() {
  const config = getBookingConfig();

  return (
    <>
      <PageViewTracker event="booking_page_view" props={{ path: "/book" }} />

      <Section aria-labelledby="book-heading">
        <Container className="flex max-w-4xl flex-col gap-6">
          <Reveal>
            <Eyebrow>Book a conversation</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <Heading level={1} id="book-heading">
              Let&rsquo;s talk about what your company has outgrown.
            </Heading>
          </Reveal>
          <Reveal delay={0.2}>
            <Text size="lg" muted className="max-w-2xl">
              Choose the conversation that best fits where you are today. We
              will use the time to understand the change your organization is
              navigating and determine the most useful next step.
            </Text>
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper" aria-label="Scheduling" className="pt-0">
        <Container>
          <BookingExperience config={config} />
        </Container>
      </Section>
    </>
  );
}
