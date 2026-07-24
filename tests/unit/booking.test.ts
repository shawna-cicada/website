import { afterEach, describe, expect, it, vi } from "vitest";
import { calcomProvider } from "@/lib/booking/calcom";
import { calendlyProvider } from "@/lib/booking/calendly";
import { parseBookingMessage } from "@/lib/booking/messages";
import { getBookingConfig, BOOKING_EVENT_TYPES } from "@/lib/booking";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("calcom provider", () => {
  it("serves the committed live event links when env is unset (D-024)", () => {
    expect(calcomProvider.getFallbackUrl("discovery-call")).toBe(
      "https://cal.com/cicadaagility/30min",
    );
    expect(calcomProvider.getFallbackUrl("assessment-debrief")).toBe(
      "https://cal.com/cicadaagility/60min",
    );
    expect(calcomProvider.getFallbackUrl("coaching-session")).toBe(
      "https://cal.com/cicadaagility/coaching-session",
    );
  });

  it("builds an inline embed URL; env vars override the defaults", () => {
    vi.stubEnv(
      "CALCOM_EVENT_URL_DISCOVERY_CALL",
      "https://cal.com/cicada/discovery",
    );
    const url = calcomProvider.getEmbedUrl("discovery-call");
    expect(url).toBeTruthy();
    const parsed = new URL(url!);
    expect(parsed.hostname).toBe("cal.com");
    expect(parsed.pathname).toBe("/cicada/discovery");
    expect(parsed.searchParams.get("embed")).toBe("true");
    // The fallback link is the clean page, no embed params.
    expect(calcomProvider.getFallbackUrl("discovery-call")).toBe(
      "https://cal.com/cicada/discovery",
    );
  });

  it("rejects non-Cal.com and lookalike hostnames (no arbitrary embeds)", () => {
    for (const bad of [
      "https://evil.example.com/calendar",
      "https://cal.com.evil.com/x",
      "http://cal.com/insecure",
      "not a url",
    ]) {
      vi.stubEnv("CALCOM_EVENT_URL_DISCOVERY_CALL", bad);
      expect(calcomProvider.getEmbedUrl("discovery-call")).toBeNull();
      vi.unstubAllEnvs();
    }
  });

  it("is selected by BOOKING_PROVIDER=calcom", () => {
    vi.stubEnv("BOOKING_PROVIDER", "calcom");
    vi.stubEnv(
      "CALCOM_EVENT_URL_COACHING_SESSION",
      "https://cal.com/cicada/coaching",
    );
    const config = getBookingConfig();
    expect(config.provider).toBe("calcom");
    const coaching = config.events.find(
      (event) => event.key === "coaching-session",
    );
    expect(coaching?.embedUrl).toContain("cal.com/cicada/coaching");
  });

  it("normalizes Cal.com completion messages, origin-validated", () => {
    const complete = {
      origin: "https://app.cal.com",
      data: { originator: "CAL", method: "bookingSuccessful" },
    };
    expect(parseBookingMessage("calcom", complete)).toBe("booking_complete");
    expect(
      parseBookingMessage("calcom", {
        origin: "https://cal.com",
        data: { type: "CAL:bookingSuccessful" },
      }),
    ).toBe("booking_complete");
    // Wrong origin, junk data, unrelated actions → no signal.
    expect(
      parseBookingMessage("calcom", {
        origin: "https://evil.com",
        data: { method: "bookingSuccessful" },
      }),
    ).toBeNull();
    expect(
      parseBookingMessage("calcom", {
        origin: "https://app.cal.com",
        data: { method: "linkReady" },
      }),
    ).toBeNull();
    expect(
      parseBookingMessage("calcom", { origin: "https://app.cal.com", data: 7 }),
    ).toBeNull();
  });
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
  it("exposes the three offered event types (Existing Client removed)", () => {
    expect(BOOKING_EVENT_TYPES.map((event) => event.label)).toEqual([
      "Discovery Call",
      "Assessment Debrief",
      "Coaching Session",
    ]);
  });

  it("resolves per-event configuration independently", () => {
    vi.stubEnv("BOOKING_PROVIDER", "calendly");
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
