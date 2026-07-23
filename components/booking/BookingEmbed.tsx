"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookingFallback } from "@/components/booking/BookingFallback";
import { parseBookingMessage } from "@/lib/booking/messages";
import { track } from "@/lib/analytics";

type BookingEmbedProps = {
  provider: string;
  eventKey: string;
  eventLabel: string;
  embedUrl: string;
  fallbackUrl: string | null;
  contactEmail: string | null;
};

/** Seconds before an unloaded embed is treated as blocked/failed. */
const LOAD_TIMEOUT_MS = 15_000;

/**
 * Inline scheduling embed, provider-agnostic.
 * - Loading state until the iframe loads; error state (with accessible
 *   fallback) if it fails or times out — the rest of the page is never
 *   blocked (lazy iframe, fixed responsive height, no layout shift).
 * - Forwards the visitor's utm_* parameters and referrer when supported.
 * - Listens for provider postMessages and reports booking_start /
 *   booking_complete through the analytics adapter.
 */
export function BookingEmbed({
  provider,
  eventKey,
  eventLabel,
  embedUrl,
  fallbackUrl,
  contactEmail,
}: BookingEmbedProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const startTracked = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // React does not reliably delegate iframe error events; bind natively.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onError = () => setStatus("error");
    iframe.addEventListener("error", onError);
    return () => iframe.removeEventListener("error", onError);
  }, [status]);

  // Preserve campaign attribution: copy utm_* params and referrer from the
  // current visit onto the embed URL (Calendly stores these on the invitee).
  const src = useMemo(() => {
    try {
      const url = new URL(embedUrl);
      const current = new URLSearchParams(window.location.search);
      current.forEach((value, key) => {
        if (key.startsWith("utm_") && !url.searchParams.has(key)) {
          url.searchParams.set(key, value);
        }
      });
      if (!url.searchParams.has("utm_source")) {
        url.searchParams.set("utm_source", "cicadaagility.com");
      }
      if (document.referrer && !url.searchParams.has("referrer")) {
        url.searchParams.set("referrer", document.referrer);
      }
      return url.toString();
    } catch {
      return embedUrl;
    }
  }, [embedUrl]);

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const signal = parseBookingMessage(provider, event);
      if (!signal) return;
      if (signal === "booking_start" && startTracked.current) return;
      if (signal === "booking_start") startTracked.current = true;
      track(signal, { provider, event_type: eventKey });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [provider, eventKey]);

  if (status === "error") {
    return (
      <BookingFallback
        eventLabel={eventLabel}
        fallbackUrl={fallbackUrl}
        contactEmail={contactEmail}
        reason="error"
      />
    );
  }

  return (
    <div className="relative min-h-[40rem] w-full sm:min-h-[44rem]">
      {status === "loading" ? (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm bg-lilac"
        >
          <span
            aria-hidden="true"
            className="h-8 w-8 animate-spin rounded-full border-2 border-meadow-deep border-t-transparent motion-reduce:hidden"
          />
          <p className="text-sm text-slate">Loading the scheduler…</p>
        </div>
      ) : null}
      <iframe
        ref={iframeRef}
        title={`Schedule: ${eventLabel}`}
        src={src}
        loading="lazy"
        onLoad={() => setStatus("ready")}
        className="h-[40rem] w-full rounded-sm border-0 sm:h-[44rem]"
        allow="fullscreen"
      />
    </div>
  );
}
