import { describe, expect, it } from "vitest";
import {
  adoptFounderPhotos,
  FOUNDER_PLACEHOLDER_IMAGE,
  mapClientLogoRow,
  mapFounderRow,
  mergeAboutContent,
  mergeAssessmentsPageContent,
  mergeHomepageContent,
  mergeHowWeHelpContent,
  mergePractice,
  syncServiceCards,
  type ClientLogoRow,
  type FounderRow,
} from "@/lib/cms/mappers";
import { homepageContent } from "@/content/seed/homepage";
import { howWeHelpContent, practiceAreas } from "@/content/seed/practices";
import { aboutContent } from "@/content/seed/about";
import { assessmentsPageContent } from "@/content/seed/assessments";

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

describe("mergeAboutContent (D-026)", () => {
  it("returns the seed untouched when no override document exists", () => {
    expect(mergeAboutContent(aboutContent, null)).toBe(aboutContent);
  });

  it("overrides headlines and copy, field by field", () => {
    const merged = mergeAboutContent(aboutContent, {
      heroHeadline: "A new About headline.",
      systemCopy: "New system copy.",
    });
    expect(merged.hero.headline).toBe("A new About headline.");
    expect(merged.hero.copy).toBe(aboutContent.hero.copy);
    expect(merged.system.copy).toBe("New system copy.");
    expect(merged.origin).toEqual(aboutContent.origin);
    // Button labels and links stay code-managed.
    expect(merged.cta.primaryCta).toBe(aboutContent.cta.primaryCta);
  });

  it("splits the origin story into paragraphs on blank lines", () => {
    const merged = mergeAboutContent(aboutContent, {
      originCopy: "First paragraph,\nstill first.\n\nSecond paragraph.\n\n\nThird.",
    });
    expect(merged.origin.paragraphs).toEqual([
      "First paragraph, still first.",
      "Second paragraph.",
      "Third.",
    ]);
  });

  it("splits beliefs and principles one per line, dropping blanks", () => {
    const merged = mergeAboutContent(aboutContent, {
      beliefsItems: "First belief.\n\nSecond belief.\n   ",
      principlesItems: "One.\nTwo.",
    });
    expect(merged.beliefs.items).toEqual(["First belief.", "Second belief."]);
    expect(merged.principles.items).toEqual(["One.", "Two."]);
  });

  it("blank fields fall back to the seed", () => {
    const merged = mergeAboutContent(aboutContent, {
      heroHeadline: "   ",
      originCopy: "\n\n  \n",
      beliefsItems: "",
    });
    expect(merged.hero.headline).toBe(aboutContent.hero.headline);
    expect(merged.origin.paragraphs).toBe(aboutContent.origin.paragraphs);
    expect(merged.beliefs.items).toBe(aboutContent.beliefs.items);
  });
});

describe("mergeHowWeHelpContent (D-026)", () => {
  it("returns the seed untouched when no override document exists", () => {
    expect(mergeHowWeHelpContent(howWeHelpContent, null)).toBe(howWeHelpContent);
  });

  it("overrides fields individually, splitting the narrative on blank lines", () => {
    const merged = mergeHowWeHelpContent(howWeHelpContent, {
      heroHeadline: "New overview headline.",
      systemCopy: "One paragraph.\n\nAnother paragraph.",
      closingCopy: "New closing copy.",
    });
    expect(merged.headline).toBe("New overview headline.");
    expect(merged.systemNarrative).toEqual([
      "One paragraph.",
      "Another paragraph.",
    ]);
    expect(merged.closing.copy).toBe("New closing copy.");
    // Untouched fields keep the committed copy.
    expect(merged.copy).toBe(howWeHelpContent.copy);
    expect(merged.systemHeadline).toBe(howWeHelpContent.systemHeadline);
    expect(merged.closing.headline).toBe(howWeHelpContent.closing.headline);
    expect(merged.cta).toBe(howWeHelpContent.cta);
  });

  it("blank fields fall back to the seed", () => {
    const merged = mergeHowWeHelpContent(howWeHelpContent, {
      heroHeadline: "  ",
      systemCopy: "\n\n",
    });
    expect(merged.headline).toBe(howWeHelpContent.headline);
    expect(merged.systemNarrative).toBe(howWeHelpContent.systemNarrative);
  });
});

describe("mergeAssessmentsPageContent (D-026)", () => {
  it("returns the seed untouched when no override document exists", () => {
    expect(mergeAssessmentsPageContent(assessmentsPageContent, null)).toBe(
      assessmentsPageContent,
    );
  });

  it("overrides fields individually; blanks fall back", () => {
    const merged = mergeAssessmentsPageContent(assessmentsPageContent, {
      heroHeadline: "New assessments headline.",
      aboutCopy: "Updated disclosure text.",
      gridHeadline: "   ",
    });
    expect(merged.hero.headline).toBe("New assessments headline.");
    expect(merged.hero.copy).toBe(assessmentsPageContent.hero.copy);
    expect(merged.aboutCopy).toBe("Updated disclosure text.");
    expect(merged.gridHeadline).toBe(assessmentsPageContent.gridHeadline);
    expect(merged.aboutHeadline).toBe(assessmentsPageContent.aboutHeadline);
  });
});

describe("syncServiceCards (D-026)", () => {
  it("cards adopt the linked practice's name and summary", () => {
    const edited = practiceAreas.map((practice) =>
      practice.slug === "ai-enablement"
        ? { ...practice, summary: "An edited AI summary." }
        : practice,
    );
    const items = syncServiceCards(homepageContent.services.items, edited);
    const aiCard = items.find(
      (item) => item.href === "/how-we-help/ai-enablement",
    );
    expect(aiCard?.copy).toBe("An edited AI summary.");
    // Example tags stay from the homepage seed.
    const seedAiCard = homepageContent.services.items.find(
      (item) => item.href === "/how-we-help/ai-enablement",
    );
    expect(aiCard?.examples).toBe(seedAiCard?.examples);
  });

  it("every homepage card links to a practice, so all stay in sync", () => {
    const items = syncServiceCards(homepageContent.services.items, practiceAreas);
    for (const item of items) {
      const practice = practiceAreas.find(
        (candidate) => item.href === `/how-we-help/${candidate.slug}`,
      );
      expect(practice).toBeDefined();
      expect(item.title).toBe(practice!.name);
      expect(item.copy).toBe(practice!.summary);
    }
  });

  it("cards without a matching practice pass through untouched", () => {
    const card = {
      title: "Something else",
      copy: "Not a practice.",
      examples: [],
      href: "/assessments",
    };
    expect(syncServiceCards([card], practiceAreas)[0]).toBe(card);
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
