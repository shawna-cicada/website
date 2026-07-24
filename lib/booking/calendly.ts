import type { BookingEventKey, BookingProvider } from "@/lib/booking/types";

/**
 * Calendly implementation of BookingProvider.
 * Event URLs come from environment variables only (see .env.example) —
 * public scheduling links, never private calendar data. Calendly detects
 * the visitor's time zone automatically in the embed.
 */

const EVENT_ENV: Record<BookingEventKey, string> = {
  "discovery-call": "CALENDLY_EVENT_URL_DISCOVERY_CALL",
  "assessment-debrief": "CALENDLY_EVENT_URL_ASSESSMENT_DEBRIEF",
  "coaching-session": "CALENDLY_EVENT_URL_COACHING_SESSION",
};

function baseUrl(eventKey: BookingEventKey): string | null {
  const raw = process.env[EVENT_ENV[eventKey]]?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Only ever embed Calendly scheduling pages.
    if (!url.hostname.endsWith("calendly.com")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const calendlyProvider: BookingProvider = {
  name: "calendly",

  getEmbedUrl(eventKey) {
    const raw = baseUrl(eventKey);
    if (!raw) return null;
    const url = new URL(raw);
    // Inline-embed options; visitor time zone is automatic.
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_gdpr_banner", "1");
    return url.toString();
  },

  getFallbackUrl(eventKey) {
    return baseUrl(eventKey);
  },
};
