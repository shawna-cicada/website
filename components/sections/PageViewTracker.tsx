"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

/**
 * Fires a single analytics event when a page mounts
 * (e.g. assessment_view on /assessments, booking_page_view on /book).
 */
export function PageViewTracker({
  event,
  props,
}: {
  event: AnalyticsEvent;
  props?: AnalyticsProps;
}) {
  useEffect(() => {
    track(event, props);
    // Fire exactly once per mount; props are stable server-provided values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
