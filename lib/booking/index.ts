import { calendlyProvider } from "@/lib/booking/calendly";
import type {
  BookingConfig,
  BookingEventType,
  BookingProvider,
} from "@/lib/booking/types";

/** The three configured conversation types (per WEBSITE_REDESIGN.md). */
export const BOOKING_EVENT_TYPES: BookingEventType[] = [
  {
    key: "discovery-call",
    label: "Discovery Call",
    description:
      "A first conversation about where your company is and what it may have outgrown.",
  },
  {
    key: "assessment-debrief",
    label: "Assessment Debrief",
    description:
      "Walk through your assessment results and what they suggest about the next stage.",
  },
  {
    key: "existing-client",
    label: "Existing Client Session",
    description: "Working time for teams we are already partnering with.",
  },
];

const PROVIDERS: Record<string, BookingProvider> = {
  calendly: calendlyProvider,
};

function activeProvider(): BookingProvider {
  const name = process.env.BOOKING_PROVIDER?.trim() || "calendly";
  return PROVIDERS[name] ?? calendlyProvider;
}

/** Resolve the full booking configuration for the /book page. */
export function getBookingConfig(): BookingConfig {
  const provider = activeProvider();
  return {
    provider: provider.name,
    events: BOOKING_EVENT_TYPES.map((event) => ({
      ...event,
      embedUrl: provider.getEmbedUrl(event.key),
      fallbackUrl: provider.getFallbackUrl(event.key),
    })),
    contactEmail: process.env.BOOKING_CONTACT_EMAIL?.trim() || null,
  };
}
