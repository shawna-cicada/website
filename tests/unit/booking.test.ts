import { afterEach, describe, expect, it, vi } from "vitest";
import { calendlyProvider } from "@/lib/booking/calendly";
import { parseBookingMessage } from "@/lib/booking/messages";
import { getBookingConfig, BOOKING_EVENT_TYPES } from "@/lib/booking";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("calendly provider", () => {
  it("returns null for unconfigured event types", () => {
    expect(calendlyProvider.getEmbedUrl("discovery-call")).toBeNull();
    expect(calendlyProvider.getFallbackUrl("discovery-call")).toBeNull();
  });

  it("builds an inline embed URL from the env var", () => {
    vi.stubEnv(
      "CALENDLY_EVENT_URL_DISCOVERY_CALL",
      "https://calendly.com/cicada/discovery",
    );
    const url = calendlyProvider.getEmbedUrl("discovery-call");
    expect(url).toBeTruthy();
    const parsed = new URL(url!);
    expect(parsed.hostname).toBe("calendly.com");
    expect(parsed.searchParams.get("embed_type")).toBe("Inline");
  });

  it("rejects non-Calendly hostnames (no arbitrary embeds)", () => {
    vi.stubEnv(
      "CALENDLY_EVENT_URL_DISCOVERY_CALL",
      "https://evil.example.com/calendar",
    );
    expect(calendlyProvider.getEmbedUrl("discovery-call")).toBeNull();
  });

  it("rejects invalid URLs", () => {
    vi.stubEnv("CALENDLY_EVENT_URL_DISCOVERY_CALL", "not a url");
    expect(calendlyProvider.getEmbedUrl("discovery-call")).toBeNull();
  });
});

describe("booking config", () => {
  it("exposes the three required event types", () => {
    expect(BOOKING_EVENT_TYPES.map((event) => event.label)).toEqual([
      "Discovery Call",
      "Assessment Debrief",
      "Existing Client Session",
    ]);
  });

  it("resolves per-event configuration independently", () => {
    vi.stubEnv(
      "CALENDLY_EVENT_URL_ASSESSMENT_DEBRIEF",
      "https://calendly.com/cicada/debrief",
    );
    vi.stubEnv("BOOKING_CONTACT_EMAIL", "hello@example.com");
    const config = getBookingConfig();
    expect(config.provider).toBe("calendly");
    const debrief = config.events.find(
      (event) => event.key === "assessment-debrief",
    );
    const discovery = config.events.find(
      (event) => event.key === "discovery-call",
    );
    expect(debrief?.embedUrl).toContain("calendly.com");
    expect(discovery?.embedUrl).toBeNull();
    expect(config.contactEmail).toBe("hello@example.com");
  });
});

describe("parseBookingMessage", () => {
  const origin = "https://calendly.com";

  it("maps Calendly signals to normalized booking events", () => {
    expect(
      parseBookingMessage("calendly", {
        origin,
        data: { event: "calendly.date_and_time_selected" },
      }),
    ).toBe("booking_start");
    expect(
      parseBookingMessage("calendly", {
        origin,
        data: { event: "calendly.event_scheduled" },
      }),
    ).toBe("booking_complete");
  });

  it("ignores messages from other origins", () => {
    expect(
      parseBookingMessage("calendly", {
        origin: "https://evil.example.com",
        data: { event: "calendly.event_scheduled" },
      }),
    ).toBeNull();
    expect(
      parseBookingMessage("calendly", {
        origin: "https://notcalendly.com",
        data: { event: "calendly.event_scheduled" },
      }),
    ).toBeNull();
  });

  it("ignores unknown events and providers", () => {
    expect(
      parseBookingMessage("calendly", { origin, data: { event: "calendly.profile_page_viewed" } }),
    ).toBeNull();
    expect(
      parseBookingMessage("unknown", { origin, data: { event: "calendly.event_scheduled" } }),
    ).toBeNull();
  });
});
