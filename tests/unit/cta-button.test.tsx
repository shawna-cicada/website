import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CTAButton } from "@/components/ui/CTAButton";
import { track } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({
  track: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("CTAButton analytics", () => {
  beforeEach(() => {
    vi.mocked(track).mockClear();
  });

  it("renders a real link to the destination", () => {
    render(
      <CTAButton
        label="Start the Growth Stage Assessment"
        href="/assessments"
        location="hero"
      />,
    );
    const link = screen.getByRole("link", {
      name: "Start the Growth Stage Assessment",
    });
    expect(link).toHaveAttribute("href", "/assessments");
  });

  it("reports cta_click with label, location, destination, and path", async () => {
    const user = userEvent.setup();
    render(
      <CTAButton label="Book a Discovery Call" href="/book" location="final-cta" />,
    );
    const link = screen.getByRole("link", { name: "Book a Discovery Call" });
    // jsdom cannot navigate; prevent the default to test the handler only.
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);
    expect(track).toHaveBeenCalledWith("cta_click", {
      label: "Book a Discovery Call",
      location: "final-cta",
      destination: "/book",
      path: "/",
    });
  });
});
