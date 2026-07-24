/**
 * Booking provider abstraction (D-006): page components never touch a
 * concrete provider. Calendly is the first implementation; Cal.com can
 * replace it by implementing BookingProvider (see lib/booking/README.md).
 */

export type BookingEventKey =
  | "discovery-call"
  | "assessment-debrief"
  | "coaching-session";

export type BookingEventType = {
  key: BookingEventKey;
  label: string;
  description: string;
};

/** A normalized booking funnel signal parsed from provider messages. */
export type BookingSignal = "booking_start" | "booking_complete";

export interface BookingProvider {
  /** Provider id, e.g. "calendly". */
  name: string;
  /**
   * Embed URL for an event type, built from environment configuration.
   * Returns null when the event type is not configured — the UI must
   * render an accessible fallback, never a broken embed.
   * Only public scheduling URLs are ever used; no private calendar data.
   */
  getEmbedUrl(eventKey: BookingEventKey): string | null;
  /** Direct link for the accessible fallback (usually the same URL). */
  getFallbackUrl(eventKey: BookingEventKey): string | null;
}

export type ResolvedBookingEvent = BookingEventType & {
  embedUrl: string | null;
  fallbackUrl: string | null;
};

export type BookingConfig = {
  provider: string;
  events: ResolvedBookingEvent[];
  /** Contact-email fallback shown when scheduling is unavailable. */
  contactEmail: string | null;
};
