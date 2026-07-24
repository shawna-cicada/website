import { describe, expect, it } from "vitest";
import {
  adoptFounderPhotos,
  FOUNDER_PLACEHOLDER_IMAGE,
  mapClientLogoRow,
  mapFounderRow,
  mergeHomepageContent,
  mergePractice,
  type ClientLogoRow,
  type FounderRow,
} from "@/lib/cms/mappers";
import { homepageContent } from "@/content/seed/homepage";
import { practiceAreas } from "@/content/seed/practices";

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

  it("overrides the recognition, services, and closing sections (D-026)", () => {
    const merged = mergeHomepageContent(homepageContent, {
      recognitionHeadline: "Recognize this?",
      recognitionStatements: ["First line.", "  ", "Second line."],
      servicesHeadline: "New services headline.",
      servicesCopy: "New services copy.",
      finalCtaHeadline: "New closing headline.",
      finalCtaCopy: "New closing copy.",
    });
    expect(merged.recognition.headline).toBe("Recognize this?");
    // Blank lines are dropped, not rendered.
    expect(merged.recognition.statements).toEqual(["First line.", "Second line."]);
    expect(merged.recognition.cta).toBe(homepageContent.recognition.cta);
    expect(merged.services.headline).toBe("New services headline.");
    expect(merged.services.copy).toBe("New services copy.");
    expect(merged.services.items).toBe(homepageContent.services.items);
    expect(merged.finalCta.headline).toBe("New closing headline.");
    expect(merged.finalCta.copy).toBe("New closing copy.");
    expect(merged.finalCta.bookingOptions).toBe(
      homepageContent.finalCta.bookingOptions,
    );
  });

  it("keeps seed statements when the Studio list is empty or all blank", () => {
    const empty = mergeHomepageContent(homepageContent, {
      recognitionStatements: [],
    });
    expect(empty.recognition.statements).toBe(
      homepageContent.recognition.statements,
    );
    const blanks = mergeHomepageContent(homepageContent, {
      recognitionStatements: ["  ", ""],
      servicesHeadline: "   ",
    });
    expect(blanks.recognition.statements).toBe(
      homepageContent.recognition.statements,
    );
    expect(blanks.services.headline).toBe(homepageContent.services.headline);
  });
});

describe("mergePractice (D-026)", () => {
  const seed = practiceAreas[0];

  it("returns the seed untouched when no override exists", () => {
    expect(mergePractice(seed, undefined)).toBe(seed);
  });

  it("overrides text and list fields, field by field", () => {
    const merged = mergePractice(seed, {
      key: seed.slug,
      headline: "A sharper problem statement.",
      workOn: ["First area", "Second area"],
    });
    expect(merged.headline).toBe("A sharper problem statement.");
    expect(merged.workOn).toEqual(["First area", "Second area"]);
    // Untouched fields keep the committed copy.
    expect(merged.summary).toBe(seed.summary);
    expect(merged.whoFor).toBe(seed.whoFor);
    expect(merged.leaveWith).toBe(seed.leaveWith);
  });

  it("blank fields and blank lines fall back to the seed", () => {
    const merged = mergePractice(seed, {
      key: seed.slug,
      headline: "   ",
      problems: ["", "  "],
    });
    expect(merged.headline).toBe(seed.headline);
    expect(merged.problems).toBe(seed.problems);
  });

  it("never changes the practice name or slug (nav and URLs depend on them)", () => {
    const merged = mergePractice(seed, {
      key: seed.slug,
      headline: "New headline.",
    });
    expect(merged.name).toBe(seed.name);
    expect(merged.slug).toBe(seed.slug);
  });
});

describe("mapFounderRow (D-026)", () => {
  const completeFounder: FounderRow = {
    name: "Shawna Cullinan",
    role: "Co-founder",
    bio: "Works across the whole system.",
    photoUrl: "https://cdn.sanity.io/images/x/production/shawna.jpg",
    photoAlt: "Shawna smiling",
    expertise: ["Operating model design"],
    selectedExperience: ["Scale plans for growth companies"],
    speakingTopics: ["Ways of working"],
    linkedInUrl: "https://www.linkedin.com/in/example",
  };

  it("maps a complete Studio profile", () => {
    const profile = mapFounderRow(completeFounder);
    expect(profile).not.toBeNull();
    expect(profile?.name).toBe("Shawna Cullinan");
    expect(profile?.role).toBe("Co-founder");
    expect(profile?.bio).toBe("Works across the whole system.");
    expect(profile?.expertise).toEqual(["Operating model design"]);
    expect(profile?.linkedInUrl).toBe("https://www.linkedin.com/in/example");
    expect(profile?.imageAlt).toBe("Shawna smiling");
    // CMS bios are editor-owned — never flagged as drafts.
    expect(profile?.draftBio).toBe(false);
  });

  it("asks the CDN for a right-sized portrait", () => {
    const profile = mapFounderRow(completeFounder);
    expect(profile?.imageSrc).toContain("shawna.jpg?");
    expect(profile?.imageSrc).toContain("w=800");
    expect(profile?.imageSrc).toContain("auto=format");
  });

  it("drops profiles without a name", () => {
    expect(mapFounderRow({ ...completeFounder, name: null })).toBeNull();
    expect(mapFounderRow({ ...completeFounder, name: "   " })).toBeNull();
  });

  it("fills sensible defaults for missing optional fields", () => {
    const profile = mapFounderRow({ name: "Julia Kaissling" });
    expect(profile?.role).toBe("");
    expect(profile?.expertise).toEqual([]);
    expect(profile?.linkedInUrl).toBeUndefined();
    expect(profile?.imageSrc).toBe(FOUNDER_PLACEHOLDER_IMAGE);
    expect(profile?.imageAlt).toBe("Portrait of Julia Kaissling");
  });
});

describe("adoptFounderPhotos (D-026)", () => {
  const person = homepageContent.founders.people[0];

  it("adopts an uploaded photo onto the matching homepage card", () => {
    const cms = mapFounderRow({
      name: ` ${person.name.toUpperCase()} `,
      photoUrl: "https://cdn.sanity.io/images/x/production/new.jpg",
      photoAlt: "New portrait",
    })!;
    const people = adoptFounderPhotos(homepageContent.founders.people, [cms]);
    expect(people[0].imageSrc).toContain("new.jpg");
    expect(people[0].imageAlt).toBe("New portrait");
    // Homepage short bios stay code-managed.
    expect(people[0].bio).toBe(person.bio);
    expect(people[1]).toBe(homepageContent.founders.people[1]);
  });

  it("never adopts the placeholder over a committed portrait", () => {
    const cms = mapFounderRow({ name: person.name })!;
    const people = adoptFounderPhotos(homepageContent.founders.people, [cms]);
    expect(people[0].imageSrc).toBe(person.imageSrc);
  });

  it("returns the cards untouched when no CMS founders exist", () => {
    expect(adoptFounderPhotos(homepageContent.founders.people, [])).toBe(
      homepageContent.founders.people,
    );
  });
});
