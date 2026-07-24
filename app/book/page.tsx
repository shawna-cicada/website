import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { BookingExperience } from "@/components/booking/BookingExperience";
import { PageViewTracker } from "@/components/sections/PageViewTracker";
import { getBookingConfig } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book a Conversation",
  description:
    "Choose the conversation that best fits where you are today — a free discovery call, an assessment debrief, or a coaching session with Cicada Agility.",
};

/** /book: provider-agnostic scheduling with an always-available fallback. */
export default function BookPage() {
  const config = getBookingConfig();

  return (
    <>
      <PageViewTracker event="booking_page_view" props={{ path: "/book" }} />

      <Section aria-labelledby="book-heading">
        <PageHero
          eyebrow="Book a conversation"
          headline="Let's talk about what your company has outgrown."
          copy="Choose the conversation that best fits where you are today. We will use the time to understand the change your organization is navigating and determine the most useful next step."
          headingId="book-heading"
        />
      </Section>

      <Section tone="paper" aria-label="Scheduling" className="pt-0">
        <Container>
          <BookingExperience config={config} />
        </Container>
      </Section>
    </>
  );
}
