import { track as vercelTrack } from "@vercel/analytics";

/**
 * Analytics adapter (D-007): all conversion events flow through this
 * wrapper so the provider can change without touching components.
 * Event names follow the taxonomy in WEBSITE_REDESIGN.md.
 */
export type AnalyticsEvent =
  | "cta_click"
  | "assessment_view"
  | "assessment_start"
  | "assessment_external_click"
  | "booking_page_view"
  | "booking_start"
  | "booking_complete"
  | "service_view"
  | "insight_view"
  | "video_play"
  | "linkedin_click"
  | "contact_submit";

export type AnalyticsProps = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
}
