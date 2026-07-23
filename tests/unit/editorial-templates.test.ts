import { describe, expect, it } from "vitest";
import {
  draftFromTemplate,
  EDITORIAL_TEMPLATES,
  hasUnresolvedPrompts,
  PROMPT_MARKER,
} from "@/lib/editorial/templates";
import { publishGate } from "@/lib/editorial/checklist";
import type { EditorialDoc } from "@/lib/editorial/types";

describe("editorial templates", () => {
  it("provides the five required templates", () => {
    expect(EDITORIAL_TEMPLATES.map((template) => template.title)).toEqual([
      "Leadership Insight",
      "Founder Lesson",
      "Practical Guide",
      "Video Post",
      "Client or Case Insight",
    ]);
  });

  it("every template has an outline with headings and writing prompts", () => {
    for (const template of EDITORIAL_TEMPLATES) {
      const headings = template.outline.filter((block) => block.style === "h2");
      expect(headings.length, template.id).toBeGreaterThanOrEqual(4);
      expect(hasUnresolvedPrompts(template.outline), template.id).toBe(true);
    }
  });

  it("template selection creates a draft of the right content type", () => {
    const draft = draftFromTemplate("video-post");
    expect(draft?.status).toBe("draft");
    expect(draft?.contentType).toBe("video");
    expect(draft?.body.length).toBeGreaterThan(0);
    expect(draftFromTemplate("nope")).toBeUndefined();
  });

  it("drafts are deep copies — editing one never mutates the template", () => {
    const draft = draftFromTemplate("leadership-insight")!;
    draft.body[0].children![0].text = "edited";
    const fresh = draftFromTemplate("leadership-insight")!;
    expect(fresh.body[0].children![0].text).not.toBe("edited");
  });

  it("template scaffolding can never publish: prompts block the gate", () => {
    const draft = draftFromTemplate("practical-guide")!;
    const doc: EditorialDoc = {
      contentType: draft.contentType,
      body: draft.body,
      title: "A complete title",
      summary: "A perfectly reasonable summary of the piece.",
      authorName: "Shawna",
      category: "Leadership",
      mainImage: { assetRef: "image-123", alt: "Described" },
    };
    const gate = publishGate(doc);
    expect(gate.canPublish).toBe(false);
    expect(
      gate.blockers.some((item) => item.key === "prompts-resolved"),
    ).toBe(true);
  });

  it("prompts are detected only via the marker", () => {
    expect(
      hasUnresolvedPrompts([
        { _type: "block", children: [{ _type: "span", text: "Real content." }] },
      ]),
    ).toBe(false);
    expect(
      hasUnresolvedPrompts([
        {
          _type: "block",
          children: [{ _type: "span", text: `${PROMPT_MARKER}Fill this in` }],
        },
      ]),
    ).toBe(true);
  });
});
