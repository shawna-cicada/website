import { describe, expect, it } from "vitest";
import {
  getAboutContent,
  getApprovedClients,
  getClientRecords,
  getFounders,
} from "@/lib/cms";
import { aboutJsonLd, jsonLdString } from "@/lib/seo/jsonld";

describe("about content contract", () => {
  it("carries the brief's hero and all eight sections' content", async () => {
    const content = await getAboutContent();
    expect(content.hero.headline).toBe("We help companies evolve as they grow.");
    expect(content.origin.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(content.beliefs.items.length).toBeGreaterThanOrEqual(3);
    expect(content.system.copy.length).toBeGreaterThan(0);
    expect(content.clientExperience.copy).toContain("written permission");
    expect(content.cta.primaryCta.href).toBe("/book");
  });

  it("uses the brief's six working principles verbatim", async () => {
    const content = await getAboutContent();
    expect(content.principles.items).toEqual([
      "Name the real problem, not just the visible symptom.",
      "Work with the system, not one isolated team.",
      "Create clarity before adding process.",
      "Design change with the people who must carry it.",
      "Use reflection to turn experience into evolution.",
      "Leave clients with greater internal capability, not dependence.",
    ]);
  });
});

describe("founder profiles contract", () => {
  it("both founders carry every required profile field", async () => {
    const founders = await getFounders();
    expect(founders.map((founder) => founder.name)).toEqual([
      "Shawna Cullinan",
      "Julia Kaissling",
    ]);
    for (const founder of founders) {
      expect(founder.role.length, founder.name).toBeGreaterThan(0);
      expect(founder.bio.length, founder.name).toBeGreaterThan(50);
      expect(founder.expertise.length, founder.name).toBeGreaterThanOrEqual(3);
      expect(founder.selectedExperience.length, founder.name).toBeGreaterThanOrEqual(2);
      expect(founder.speakingTopics.length, founder.name).toBeGreaterThanOrEqual(1);
      expect(founder.imageSrc, founder.name).toContain("placeholder");
      expect(founder.imageAlt, founder.name).toContain("pending");
    }
  });

  it("placeholder bios are flagged for editorial review", async () => {
    const founders = await getFounders();
    for (const founder of founders) {
      expect(founder.draftBio, founder.name).toBe(true);
    }
  });

  it("Person structured data is generated for both founders", async () => {
    const founders = await getFounders();
    const data = aboutJsonLd(founders);
    const people = data["@graph"].filter(
      (node: { "@type"?: string }) => node["@type"] === "Person",
    );
    expect(people).toHaveLength(2);
    const organization = data["@graph"].find(
      (node: { "@type"?: string }) => node["@type"] === "Organization",
    ) as { founder?: unknown[] };
    expect(organization.founder).toHaveLength(2);
    // Serializes safely for a script tag.
    expect(jsonLdString(data)).not.toContain("<");
  });
});

describe("client records contract", () => {
  it("no client renders without written permission", async () => {
    const approved = await getApprovedClients();
    // Seed records are unapproved placeholders — nothing may show yet.
    expect(approved).toEqual([]);
  });

  it("placeholder records never carry real-looking client names", async () => {
    const all = await getClientRecords();
    for (const client of all) {
      expect(client.name.toLowerCase(), client.name).toContain("placeholder");
      expect(client.approved, client.name).toBe(false);
      expect(client.alt.length, client.name).toBeGreaterThan(0);
    }
  });
});
