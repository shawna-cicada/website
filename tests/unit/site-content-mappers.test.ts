import { describe, expect, it } from "vitest";
import {
  mapClientLogoRow,
  mergeHomepageContent,
  type ClientLogoRow,
} from "@/lib/cms/mappers";
import { homepageContent } from "@/content/seed/homepage";

const completeRow: ClientLogoRow = {
  name: "Acme Corp",
  alt: "Acme Corp logo",
  src: "https://cdn.sanity.io/images/x/production/logo.png",
  width: 600,
  height: 200,
  group: "Growth company",
  approved: true,
};

describe("mapClientLogoRow (D-021)", () => {
  it("maps a complete Studio document to a ClientRecord", () => {
    const record = mapClientLogoRow(completeRow);
    expect(record).not.toBeNull();
    expect(record?.name).toBe("Acme Corp");
    expect(record?.alt).toBe("Acme Corp logo");
    expect(record?.group).toBe("growth");
    expect(record?.approved).toBe(true);
  });

  it("normalizes dimensions to the display height, preserving ratio", () => {
    const record = mapClientLogoRow(completeRow);
    expect(record?.height).toBe(48);
    expect(record?.width).toBe(144); // 600 * (48/200)
    // The CDN is asked for a right-sized asset, not the raw upload.
    expect(record?.src).toContain("h=96");
    expect(record?.src).toContain("fit=max");
  });

  it("rejects incomplete documents instead of breaking the site", () => {
    expect(mapClientLogoRow({ ...completeRow, name: null })).toBeNull();
    expect(mapClientLogoRow({ ...completeRow, alt: null })).toBeNull();
    expect(mapClientLogoRow({ ...completeRow, src: null })).toBeNull();
    expect(mapClientLogoRow({ ...completeRow, width: null })).toBeNull();
    expect(mapClientLogoRow({ ...completeRow, height: 0 })).toBeNull();
  });

  it("only written permission makes a record approved", () => {
    expect(mapClientLogoRow({ ...completeRow, approved: false })?.approved).toBe(
      false,
    );
    expect(mapClientLogoRow({ ...completeRow, approved: null })?.approved).toBe(
      false,
    );
  });

  it("drops unknown group labels rather than inventing one", () => {
    const record = mapClientLogoRow({ ...completeRow, group: "Mystery" });
    expect(record?.group).toBeUndefined();
  });
});

describe("mergeHomepageContent (D-021)", () => {
  it("returns the seed untouched when no override document exists", () => {
    expect(mergeHomepageContent(homepageContent, null)).toBe(homepageContent);
  });

  it("overrides hero headline and copy, field by field", () => {
    const merged = mergeHomepageContent(homepageContent, {
      heroHeadline: "A new headline.",
    });
    expect(merged.hero.headline).toBe("A new headline.");
    expect(merged.hero.copy).toBe(homepageContent.hero.copy);
    // Everything else passes through unchanged.
    expect(merged.framework).toBe(homepageContent.framework);
  });

  it("ignores blank strings so an emptied field falls back to seed", () => {
    const merged = mergeHomepageContent(homepageContent, {
      heroHeadline: "   ",
      heroCopy: "",
    });
    expect(merged.hero.headline).toBe(homepageContent.hero.headline);
    expect(merged.hero.copy).toBe(homepageContent.hero.copy);
  });

  it("features a referenced insight only when it is published", () => {
    const published = mergeHomepageContent(homepageContent, {
      featuredInsight: {
        slug: "my-piece",
        title: "My piece",
        summary: "What it covers.",
        category: "Leadership",
        workflowStatus: "published",
      },
    });
    expect(published.insight.featured).toEqual({
      category: "Leadership",
      title: "My piece",
      excerpt: "What it covers.",
      href: "/insights/my-piece",
    });

    const draft = mergeHomepageContent(homepageContent, {
      featuredInsight: {
        slug: "my-piece",
        title: "My piece",
        summary: "What it covers.",
        workflowStatus: "draft",
      },
    });
    expect(draft.insight.featured).toBe(homepageContent.insight.featured);
  });

  it("never mutates the seed content object", () => {
    const headlineBefore = homepageContent.hero.headline;
    mergeHomepageContent(homepageContent, { heroHeadline: "Changed" });
    expect(homepageContent.hero.headline).toBe(headlineBefore);
  });
});
