import type { BookingSignal } from "@/lib/booking/types";

/**
 * Normalize provider postMessage events into booking funnel signals.
 * Client-safe (no env access). Unknown providers/messages return null.
 */
export function parseBookingMessage(
  provider: string,
  event: { origin: string; data: unknown },
): BookingSignal | null {
  if (provider === "calendly") {
    // Calendly inline embeds emit {event: "calendly.*"} messages.
    if (!/https:\/\/([a-z0-9-]+\.)?calendly\.com$/.test(event.origin)) {
      return null;
    }
    const name =
      typeof event.data === "object" && event.data !== null
        ? (event.data as { event?: unknown }).event
        : undefined;
    if (name === "calendly.date_and_time_selected") return "booking_start";
    if (name === "calendly.event_scheduled") return "booking_complete";
    return null;
  }
  if (provider === "calcom") {
    if (!/^https:\/\/([a-z0-9-]+\.)?cal\.com$/.test(event.origin)) {
      return null;
    }
    // Cal.com embeds post messages whose action name field has varied
    // across versions (method/type/event) — read defensively. Cal.com
    // exposes no reliable "slot selected" signal, so only completion is
    // tracked for this provider.
    const record =
      typeof event.data === "object" && event.data !== null
        ? (event.data as Record<string, unknown>)
        : {};
    const action = [record.method, record.type, record.event, record.action].find(
      (value): value is string => typeof value === "string",
    );
    if (action && action.toLowerCase().includes("bookingsuccessful")) {
      return "booking_complete";
    }
    return null;
  }
  return null;
}
