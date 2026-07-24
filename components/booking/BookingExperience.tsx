"use client";

import { useEffect, useId, useState } from "react";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { BookingFallback } from "@/components/booking/BookingFallback";
import type { BookingConfig, BookingEventKey } from "@/lib/booking/types";

/**
 * Event-type chooser + embed. Accessible tab-like buttons (aria-pressed)
 * select one of the configured conversation types; the embed below swaps
 * without moving the rest of the page. Deep links (/book#coaching-session)
 * pre-select the matching conversation type.
 */
export function BookingExperience({ config }: { config: BookingConfig }) {
  const [selectedKey, setSelectedKey] = useState(config.events[0]?.key);
  const headingId = useId();
  const selected = config.events.find((event) => event.key === selectedKey);

  useEffect(() => {
    const applyHash = () => {
      const fromHash = window.location.hash.slice(1);
      if (config.events.some((event) => event.key === fromHash)) {
        setSelectedKey(fromHash as BookingEventKey);
      }
    };
    // Initial read runs a frame after hydration (no cascading render);
    // the subscription keeps in-page hash navigation working.
    const frame = requestAnimationFrame(applyHash);
    window.addEventListener("hashchange", applyHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", applyHash);
    };
  }, [config.events]);

  return (
    <div className="flex flex-col gap-8" aria-labelledby={headingId}>
      <div>
        <h2 id={headingId} className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
          Choose a conversation type
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3" role="group" aria-labelledby={headingId}>
          {config.events.map((event) => {
            const active = event.key === selectedKey;
            return (
              <button
                key={event.key}
                id={event.key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedKey(event.key)}
                className={`flex min-h-11 flex-col gap-1 rounded-sm border p-4 text-left transition-colors duration-[var(--duration-quick)] ${
                  active
                    ? "border-meadow-deep bg-lilac"
                    : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <span className="font-semibold">{event.label}</span>
                <span className="text-xs text-slate">{event.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        selected.embedUrl ? (
          <BookingEmbed
            key={selected.key}
            provider={config.provider}
            eventKey={selected.key}
            eventLabel={selected.label}
            embedUrl={selected.embedUrl}
            fallbackUrl={selected.fallbackUrl}
            contactEmail={config.contactEmail}
          />
        ) : (
          <BookingFallback
            eventLabel={selected.label}
            fallbackUrl={selected.fallbackUrl}
            contactEmail={config.contactEmail}
            reason="unconfigured"
          />
        )
      ) : null}

      <p className="text-xs text-slate">
        Times are shown automatically in your local time zone. Scheduling is
        provided by an external service; the details you enter there are
        handled under its privacy policy, and we only receive what you submit
        when booking. We use your booking information solely to prepare for
        and hold the conversation.
      </p>
    </div>
  );
}
