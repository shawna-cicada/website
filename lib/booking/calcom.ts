import type { BookingEventKey, BookingProvider } from "@/lib/booking/types";

/**
 * Cal.com implementation of BookingProvider (the documented Calendly
 * swap — see README.md). Event URLs come from environment variables
 * only: public event links like https://cal.com/<user>/<event>, never
 * private calendar data. Cal.com detects visitor time zones
 * automatically, same as Calendly.
 */

const EVENT_ENV: Record<BookingEventKey, string> = {
  "discovery-call": "CALCOM_EVENT_URL_DISCOVERY_CALL",
  "assessment-debrief": "CALCOM_EVENT_URL_ASSESSMENT_DEBRIEF",
  "existing-client": "CALCOM_EVENT_URL_EXISTING_CLIENT",
  "coaching-session": "CALCOM_EVENT_URL_COACHING_SESSION",
};

function baseUrl(eventKey: BookingEventKey): string | null {
  const raw = process.env[EVENT_ENV[eventKey]]?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Only ever embed Cal.com scheduling pages (matches the CSP).
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "cal.com" && !url.hostname.endsWith(".cal.com")) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export const calcomProvider: BookingProvider = {
  name: "calcom",

  getEmbedUrl(eventKey) {
    const raw = baseUrl(eventKey);
    if (!raw) return null;
    const url = new URL(raw);
    // Chrome-less inline embed; time zone is automatic.
    url.searchParams.set("embed", "true");
    url.searchParams.set("theme", "light");
    return url.toString();
  },

  getFallbackUrl(eventKey) {
    return baseUrl(eventKey);
  },
};
