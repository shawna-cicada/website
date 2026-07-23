import { describe, expect, it } from "vitest";
import { ensureUniqueSlug, slugify } from "@/lib/editorial/slug";
import { readingTimeMinutes } from "@/lib/editorial/text";
import { canonicalUrl, seoDefaults } from "@/lib/editorial/seo";
import { liveUrl, previewUrl } from "@/lib/editorial/preview";
import { badgeFor, STATUS_BADGES } from "@/lib/editorial/statuses";
import type { Block } from "@/lib/editorial/types";

function paragraph(text: string): Block {
  return { _type: "block", children: [{ _type: "span", text }] };
}

describe("automatic slug behavior", () => {
  it("generates clean slugs from titles", () => {
    expect(slugify("Growth Happens in Stages!")).toBe("growth-happens-in-stages");
    expect(slugify("  The Founder's Rôle — Séed to Scale  ")).toBe(
      "the-founders-role-seed-to-scale",
    );
  });

  it("keeps unique slugs untouched", () => {
    const result = ensureUniqueSlug("A Fresh Title", ["other-slug"]);
    expect(result).toEqual({ slug: "a-fresh-title", wasDeduplicated: false });
  });

  it("de-duplicates taken slugs and warns in plain language", () => {
    const result = ensureUniqueSlug("Team Reset", ["team-reset", "team-reset-2"]);
    expect(result.slug).toBe("team-reset-3");
    expect(result.wasDeduplicated).toBe(true);
    expect(result.warning).toContain("already uses the address");
    expect(result.warning).toContain("/insights/team-reset-3");
  });
});

describe("reading time", () => {
  it("computes whole minutes at 200wpm with a 1-minute floor", () => {
    expect(readingTimeMinutes(undefined)).toBe(0);
    expect(readingTimeMinutes([paragraph("short piece")])).toBe(1);
    const fourHundredWords = paragraph(Array(400).fill("word").join(" "));
    expect(readingTimeMinutes([fourHundredWords])).toBe(2);
  });
});

describe("search & sharing defaults", () => {
  it("derives defaults from title and summary within limits", () => {
    const { seoTitle, seoDescription } = seoDefaults({
      title: "A Title",
      summary: "A short summary of the piece.",
    });
    expect(seoTitle).toBe("A Title");
    expect(seoDescription).toBe("A short summary of the piece.");
  });

  it("truncates long values at word boundaries with an ellipsis", () => {
    const long = "word ".repeat(60);
    const { seoTitle, seoDescription } = seoDefaults({
      title: long,
      summary: long,
    });
    expect(seoTitle.length).toBeLessThanOrEqual(61);
    expect(seoTitle.endsWith("…")).toBe(true);
    expect(seoDescription.length).toBeLessThanOrEqual(156);
  });

  it("builds canonical URLs on the production domain", () => {
    expect(canonicalUrl("my-piece")).toBe(
      "https://www.cicadaagility.com/insights/my-piece",
    );
  });
});

describe("preview links", () => {
  it("live URL points at the public article", () => {
    expect(liveUrl("my-piece")).toBe(
      "https://www.cicadaagility.com/insights/my-piece",
    );
  });

  it("preview URL carries the preview flag and optional mobile viewport", () => {
    const desktop = new URL(previewUrl("my-piece"));
    expect(desktop.searchParams.get("preview")).toBe("true");
    const mobile = new URL(previewUrl("my-piece", { mode: "mobile" }));
    expect(mobile.searchParams.get("viewport")).toBe("mobile");
  });
});

describe("status badges", () => {
  it("covers every workflow status with brand colors", () => {
    for (const status of [
      "draft",
      "needs-review",
      "scheduled",
      "published",
      "archived",
    ] as const) {
      expect(STATUS_BADGES[status].label.length).toBeGreaterThan(0);
      expect(STATUS_BADGES[status].color).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(badgeFor(undefined).label).toBe("Draft");
    expect(badgeFor("published").label).toBe("Published");
  });
});
