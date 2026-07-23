import { describe, expect, it } from "vitest";
import {
  getEngagements,
  getEngagementsForPractice,
  getPracticeAreas,
} from "@/lib/cms";

/** Contract tests for practice-area and engagement content. */
describe("practice areas content contract", () => {
  it("serves the four practices at the expected slugs", async () => {
    const practices = await getPracticeAreas();
    expect(practices.map((practice) => practice.slug)).toEqual([
      "leadership-team-effectiveness",
      "organizational-effectiveness",
      "ai-enablement",
      "founder-growth",
    ]);
  });

  it("every practice has all required detail-page blocks", async () => {
    const practices = await getPracticeAreas();
    for (const practice of practices) {
      expect(practice.headline.length, practice.slug).toBeGreaterThan(0);
      expect(practice.whoFor.length, practice.slug).toBeGreaterThan(0);
      expect(practice.problems.length, practice.slug).toBeGreaterThanOrEqual(3);
      expect(practice.workOn.length, practice.slug).toBeGreaterThanOrEqual(3);
      expect(practice.leaveWith.length, practice.slug).toBeGreaterThanOrEqual(3);
      expect(practice.formats.length, practice.slug).toBeGreaterThan(0);
      expect(practice.relatedInsights.length, practice.slug).toBeGreaterThan(0);
      expect(practice.seoDescription.length, practice.slug).toBeGreaterThan(0);
    }
  });

  it("Agile terminology never leads the positioning", async () => {
    const practices = await getPracticeAreas();
    const leadWords = /\b(agile|lean|scrum|kanban|sprint)\b/i;
    for (const practice of practices) {
      // Headlines, summaries, and problem statements must stay in
      // business language; methods live in supportingCapabilities only.
      expect(practice.headline, practice.slug).not.toMatch(leadWords);
      expect(practice.summary, practice.slug).not.toMatch(leadWords);
      expect(practice.name, practice.slug).not.toMatch(leadWords);
      for (const problem of practice.problems) {
        expect(problem, practice.slug).not.toMatch(leadWords);
      }
    }
  });

  it("cross-links reference practices that exist", async () => {
    const practices = await getPracticeAreas();
    const slugs = new Set(practices.map((practice) => practice.slug));
    for (const practice of practices) {
      expect(practice.relatedPractices.length, practice.slug).toBeGreaterThan(0);
      for (const related of practice.relatedPractices) {
        expect(slugs.has(related), `${practice.slug} → ${related}`).toBe(true);
        expect(related).not.toBe(practice.slug);
      }
    }
  });
});

describe("engagement records contract", () => {
  it("includes the seven required engagements", async () => {
    const engagements = await getEngagements();
    const names = engagements.map((engagement) => engagement.name);
    for (const required of [
      "Growth Stage Diagnostic",
      "Leadership Intensive",
      "Team Reset",
      "Executive & Leadership Coaching",
      "Operating Model and Product Effectiveness Assessment",
      "Scale Plan and Operational Roadmap",
      "Ongoing Leadership and Organizational Advisory",
    ]) {
      expect(names).toContain(required);
    }
    expect(engagements.length).toBeGreaterThanOrEqual(7);
  });

  it("every engagement maps to at least one real practice", async () => {
    const [engagements, practices] = await Promise.all([
      getEngagements(),
      getPracticeAreas(),
    ]);
    const slugs = new Set(practices.map((practice) => practice.slug));
    for (const engagement of engagements) {
      expect(engagement.practices.length, engagement.name).toBeGreaterThan(0);
      for (const slug of engagement.practices) {
        expect(slugs.has(slug), `${engagement.name} → ${slug}`).toBe(true);
      }
    }
  });

  it("practice format lists resolve to engagement records", async () => {
    const [engagements, practices] = await Promise.all([
      getEngagements(),
      getPracticeAreas(),
    ]);
    const names = new Set(engagements.map((engagement) => engagement.name));
    for (const practice of practices) {
      for (const format of practice.formats) {
        expect(names.has(format), `${practice.slug} → ${format}`).toBe(true);
      }
    }
  });

  it("every practice has at least one typical engagement", async () => {
    const practices = await getPracticeAreas();
    for (const practice of practices) {
      const formats = await getEngagementsForPractice(practice.slug);
      expect(formats.length, practice.slug).toBeGreaterThan(0);
    }
  });
});
