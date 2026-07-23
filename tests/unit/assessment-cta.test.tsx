import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssessmentCta } from "@/components/sections/AssessmentCta";
import { track } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

const base = {
  slug: "growth-stage",
  title: "Growth Stage Assessment",
  ctaLabel: "Start the assessment",
  opensInNewTab: true,
  trackingCampaign: "growth-stage-assessment",
  location: "assessments-featured",
};

describe("AssessmentCta", () => {
  beforeEach(() => vi.mocked(track).mockClear());

  it("renders a disabled control with an honest note when no URL is configured", () => {
    render(<AssessmentCta {...base} externalUrl={null} />);
    const button = screen.getByRole("button", { name: "Start the assessment" });
    expect(button).toBeDisabled();
    expect(
      screen.getByText(/being prepared — available soon/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("opens configured assessments in a new tab with safe rel", () => {
    render(
      <AssessmentCta
        {...base}
        externalUrl="https://assessments.example.com/growth?utm_source=cicadaagility.com"
      />,
    );
    const link = screen.getByRole("link", { name: /start the assessment/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("href")).toContain("assessments.example.com");
    expect(
      screen.getByText(/opens in a new tab on an external assessment platform/i),
    ).toBeInTheDocument();
  });

  it("reports assessment_external_click with destination and campaign", async () => {
    const user = userEvent.setup();
    render(
      <AssessmentCta
        {...base}
        externalUrl="https://assessments.example.com/growth"
      />,
    );
    const link = screen.getByRole("link", { name: /start the assessment/i });
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);
    expect(track).toHaveBeenCalledWith("assessment_external_click", {
      assessment: "growth-stage",
      destination: "https://assessments.example.com/growth",
      campaign: "growth-stage-assessment",
      location: "assessments-featured",
    });
  });
});
