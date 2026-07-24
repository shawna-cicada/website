import { describe, expect, it } from "vitest";
import { getHomepageContent } from "@/lib/cms";

/**
 * Contract tests for the homepage content served by the CMS adapter.
 * These hold regardless of backing store (seed today, Sanity in Phase 2).
 */
describe("homepage content contract", () => {
  it("hero primary CTA is the Growth Stage Assessment", async () => {
    const content = await getHomepageContent();
    expect(content.hero.primaryCta.label).toBe(
      "Start the Growth Stage Assessment",
    );
    expect(content.hero.primaryCta.href).toBe("/assessments");
  });

  it("booking CTAs point at /book", async () => {
    const content = await getHomepageContent();
    expect(content.hero.secondaryCta.label).toBe("Book a Free Discovery Call");
    expect(content.hero.secondaryCta.href).toBe("/book");
    expect(content.finalCta.primaryCta.href).toBe("/book");
  });

  it("framework presents Emerge, Shed, Expand in order (D-019)", async () => {
    const content = await getHomepageContent();
    expect(content.framework.stages.map((stage) => stage.name)).toEqual([
      "Emerge",
      "Shed",
      "Expand",
    ]);
    for (const stage of content.framework.stages) {
      expect(stage.title.length).toBeGreaterThan(0);
      expect(stage.copy.length).toBeGreaterThan(0);
    }
  });

  it("presents four service areas with copy and destinations", async () => {
    const content = await getHomepageContent();
    expect(content.services.items).toHaveLength(4);
    for (const service of content.services.items) {
      expect(service.href.startsWith("/how-we-help")).toBe(true);
      expect(service.examples.length).toBeGreaterThan(0);
    }
  });

  it("every client logo record carries non-empty alt text", async () => {
    const content = await getHomepageContent();
    expect(content.clients.logos.length).toBeGreaterThanOrEqual(4);
    for (const logo of content.clients.logos) {
      expect(logo.alt.trim().length).toBeGreaterThan(0);
      expect(logo.src.length).toBeGreaterThan(0);
      expect(logo.width).toBeGreaterThan(0);
      expect(logo.height).toBeGreaterThan(0);
    }
  });

  it("exactly one assessment is featured", async () => {
    const content = await getHomepageContent();
    expect(
      content.assessments.items.filter((item) => item.featured),
    ).toHaveLength(1);
  });
});
