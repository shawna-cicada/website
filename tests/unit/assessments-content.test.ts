import { afterEach, describe, expect, it, vi } from "vitest";
import { getActiveAssessments, getAssessments } from "@/lib/cms";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("assessment records contract", () => {
  it("includes the four required assessments as active records", async () => {
    const active = await getActiveAssessments();
    const titles = active.map((assessment) => assessment.title);
    for (const required of [
      "Growth Stage Assessment",
      "Founder Growth Assessment",
      "Leadership Team Alignment Check",
      "AI Readiness Assessment",
    ]) {
      expect(titles).toContain(required);
    }
  });

  it("only the Growth Stage Assessment is featured", async () => {
    const all = await getAssessments();
    const featured = all.filter((assessment) => assessment.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].title).toBe("Growth Stage Assessment");
  });

  it("inactive records are excluded from the hub's data", async () => {
    const [all, active] = await Promise.all([
      getAssessments(),
      getActiveAssessments(),
    ]);
    expect(all.length).toBeGreaterThan(active.length);
    expect(
      active.some((assessment) => assessment.slug === "org-effectiveness-scan"),
    ).toBe(false);
  });

  it("no provider URLs are hardcoded — unset env resolves to null", async () => {
    const all = await getAssessments();
    for (const assessment of all) {
      // The test environment sets no assessment env vars.
      expect(assessment.externalUrl, assessment.slug).toBeNull();
    }
  });

  it("a configured env var resolves the URL with UTM parameters", async () => {
    vi.stubEnv(
      "ASSESSMENT_URL_GROWTH_STAGE",
      "https://assessments.example.com/growth-stage",
    );
    const active = await getActiveAssessments();
    const growth = active.find((assessment) => assessment.slug === "growth-stage");
    expect(growth?.externalUrl).toBeTruthy();
    const parsed = new URL(growth!.externalUrl!);
    expect(parsed.hostname).toBe("assessments.example.com");
    expect(parsed.searchParams.get("utm_source")).toBe("cicadaagility.com");
    expect(parsed.searchParams.get("utm_campaign")).toBe(
      "growth-stage-assessment",
    );
    // Others remain unconfigured and therefore disabled.
    const founder = active.find(
      (assessment) => assessment.slug === "founder-growth",
    );
    expect(founder?.externalUrl).toBeNull();
  });

  it("every active record carries a privacy note and CTA label", async () => {
    const active = await getActiveAssessments();
    for (const assessment of active) {
      expect(assessment.ctaLabel.length, assessment.slug).toBeGreaterThan(0);
      expect(assessment.privacyNote?.length ?? 0, assessment.slug).toBeGreaterThan(0);
      expect(assessment.opensInNewTab, assessment.slug).toBe(true);
    }
  });
});
