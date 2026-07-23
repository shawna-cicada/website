import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { BookingExperience } from "@/components/booking/BookingExperience";
import { track } from "@/lib/analytics";
import type { BookingConfig } from "@/lib/booking/types";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

const embedProps = {
  provider: "calendly",
  eventKey: "discovery-call",
  eventLabel: "Discovery Call",
  embedUrl: "https://calendly.com/cicada/discovery?embed_type=Inline",
  fallbackUrl: "https://calendly.com/cicada/discovery",
  contactEmail: "hello@example.com",
};

describe("BookingEmbed", () => {
  beforeEach(() => vi.mocked(track).mockClear());

  it("configured: renders the iframe with attribution parameters", () => {
    render(<BookingEmbed {...embedProps} />);
    const iframe = screen.getByTitle("Schedule: Discovery Call");
    const src = iframe.getAttribute("src")!;
    expect(src).toContain("calendly.com");
    expect(src).toContain("utm_source=cicadaagility.com");
  });

  it("shows a loading state until the embed loads", () => {
    render(<BookingEmbed {...embedProps} />);
    expect(screen.getByText(/loading the scheduler/i)).toBeInTheDocument();
    fireEvent.load(screen.getByTitle("Schedule: Discovery Call"));
    expect(screen.queryByText(/loading the scheduler/i)).not.toBeInTheDocument();
  });

  it("error state: falls back accessibly when the iframe fails", () => {
    render(<BookingEmbed {...embedProps} />);
    fireEvent.error(screen.getByTitle("Schedule: Discovery Call"));
    expect(
      screen.getByText(/could not load here/i),
    ).toBeInTheDocument();
    const fallbackLink = screen.getByRole("link", {
      name: /open the scheduling page/i,
    });
    expect(fallbackLink).toHaveAttribute(
      "href",
      "https://calendly.com/cicada/discovery",
    );
    expect(screen.getByText("hello@example.com")).toBeInTheDocument();
  });

  it("error state: times out when the embed never loads", () => {
    vi.useFakeTimers();
    try {
      render(<BookingEmbed {...embedProps} />);
      act(() => {
        vi.advanceTimersByTime(16_000);
      });
      expect(screen.getByText(/could not load here/i)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("reports booking_start and booking_complete from provider messages", () => {
    render(<BookingEmbed {...embedProps} />);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://calendly.com",
          data: { event: "calendly.date_and_time_selected" },
        }),
      );
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://calendly.com",
          data: { event: "calendly.event_scheduled" },
        }),
      );
    });
    expect(track).toHaveBeenCalledWith("booking_start", {
      provider: "calendly",
      event_type: "discovery-call",
    });
    expect(track).toHaveBeenCalledWith("booking_complete", {
      provider: "calendly",
      event_type: "discovery-call",
    });
  });

  it("ignores messages from untrusted origins", () => {
    render(<BookingEmbed {...embedProps} />);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: "https://evil.example.com",
          data: { event: "calendly.event_scheduled" },
        }),
      );
    });
    expect(track).not.toHaveBeenCalled();
  });
});

describe("BookingExperience", () => {
  it("unconfigured: renders the fallback with the contact email", () => {
    const config: BookingConfig = {
      provider: "calendly",
      contactEmail: "hello@example.com",
      events: [
        {
          key: "discovery-call",
          label: "Discovery Call",
          description: "A first conversation.",
          embedUrl: null,
          fallbackUrl: null,
        },
      ],
    };
    render(<BookingExperience config={config} />);
    expect(screen.getByText(/is being set up/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "hello@example.com" }),
    ).toHaveAttribute("href", "mailto:hello@example.com");
    expect(screen.queryByTitle(/schedule:/i)).not.toBeInTheDocument();
  });
});
