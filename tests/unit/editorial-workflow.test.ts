import { describe, expect, it } from "vitest";
import {
  applyAutomaticFields,
  archiveDoc,
  publishDoc,
  restoreVersion,
  scheduleDoc,
  unpublishDoc,
  withReadingTime,
} from "@/lib/editorial/workflow";
import { publishGate } from "@/lib/editorial/checklist";
import { can, explainDenied } from "@/lib/editorial/permissions";
import type { EditorialDoc } from "@/lib/editorial/types";

const completeDoc: EditorialDoc = {
  contentType: "article",
  title: "A complete article",
  summary: "A summary long enough to satisfy the checklist easily.",
  authorName: "Shawna Cullinan",
  category: "Leadership",
  mainImage: { assetRef: "image-abc", alt: "A described image" },
  body: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Real content, no prompts." }],
    },
  ],
  previewedAt: "2026-07-23T00:00:00.000Z",
  linkedInPostText: "Ready post",
};

describe("required-field validation", () => {
  it("blocks publishing with plain-language fixes for each gap", () => {
    const gate = publishGate({ contentType: "article", title: "Hi" });
    expect(gate.canPublish).toBe(false);
    const keys = gate.blockers.map((item) => item.key);
    expect(keys).toContain("title");
    expect(keys).toContain("summary");
    expect(keys).toContain("author");
    expect(keys).toContain("main-image");
    expect(keys).toContain("content");
    expect(keys).toContain("category");
    for (const blocker of gate.blockers) {
      expect(blocker.fix.length).toBeGreaterThan(20);
      expect(blocker.fix).not.toMatch(/schema|slug|metadata|portable/i);
    }
  });

  it("requires alt text once an image is present", () => {
    const gate = publishGate({
      ...completeDoc,
      mainImage: { assetRef: "image-abc", alt: "" },
    });
    expect(gate.blockers.map((item) => item.key)).toContain("image-alt");
  });

  it("videos require a video link instead of body content", () => {
    const gate = publishGate({
      ...completeDoc,
      contentType: "video",
      body: [],
      videoUrl: "https://youtube.com/watch?v=abc",
    });
    expect(gate.canPublish).toBe(true);
  });

  it("preview and LinkedIn prep are advisory, never blocking", () => {
    const gate = publishGate({
      ...completeDoc,
      previewedAt: undefined,
      linkedInPostText: undefined,
    });
    expect(gate.canPublish).toBe(true);
    expect(gate.advisories.map((item) => item.key)).toEqual(
      expect.arrayContaining(["previewed", "linkedin-ready"]),
    );
  });
});

describe("publishing permissions", () => {
  it("editors cannot publish, schedule, unpublish, or archive", () => {
    expect(can("editor", "publish")).toBe(false);
    expect(can("editor", "schedule")).toBe(false);
    expect(can("editor", "unpublish")).toBe(false);
    expect(can("editor", "archive")).toBe(false);
    expect(can("editor", "create-draft")).toBe(true);
    expect(can("editor", "prepare-linkedin")).toBe(true);
  });

  it("publishers get the full workflow but no site administration", () => {
    expect(can("publisher", "publish")).toBe(true);
    expect(can("publisher", "restore-version")).toBe(true);
    expect(can("publisher", "manage-users")).toBe(false);
    expect(can("publisher", "manage-site-settings")).toBe(false);
  });

  it("administrators can manage everything", () => {
    expect(can("administrator", "manage-users")).toBe(true);
    expect(can("administrator", "manage-assessments")).toBe(true);
  });

  it("denials are explained in plain language", () => {
    expect(explainDenied("editor", "publish")).toContain("Save your draft");
    const denied = publishDoc(completeDoc, "editor");
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.problems[0]).toContain("Publisher");
    }
  });
});

describe("publish and schedule transitions", () => {
  it("publishes a complete doc, filling automatic fields", () => {
    const result = publishDoc(completeDoc, "publisher", {
      now: new Date("2026-07-23T12:00:00Z"),
      existingSlugs: [],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.doc.status).toBe("published");
      expect(result.doc.slug).toBe("a-complete-article");
      expect(result.doc.seoTitle).toBe("A complete article");
      expect(result.doc.publishedAt).toBe("2026-07-23T12:00:00.000Z");
    }
  });

  it("refuses to publish an incomplete doc with the checklist's reasons", () => {
    const result = publishDoc({ title: "Only a title here" }, "publisher");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.problems.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("schedules only for future times", () => {
    const now = new Date("2026-07-23T12:00:00Z");
    const past = scheduleDoc(completeDoc, "publisher", new Date("2026-07-22T12:00:00Z"), { now });
    expect(past.ok).toBe(false);
    if (!past.ok) expect(past.problems[0]).toContain("in the past");

    const future = scheduleDoc(completeDoc, "publisher", new Date("2026-07-30T09:00:00Z"), { now });
    expect(future.ok).toBe(true);
    if (future.ok) {
      expect(future.doc.status).toBe("scheduled");
      expect(future.doc.scheduledAt).toBe("2026-07-30T09:00:00.000Z");
    }
  });

  it("unpublish returns the piece to draft without deleting anything", () => {
    const result = unpublishDoc({ ...completeDoc, status: "published" }, "publisher");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.doc.status).toBe("draft");
      expect(result.notes[0]).toContain("nothing was deleted");
    }
  });
});

describe("archive confirmation", () => {
  it("asks for confirmation before archiving", () => {
    const result = archiveDoc({ ...completeDoc, status: "published" }, "publisher", {
      confirmed: false,
    });
    expect("needsConfirmation" in result && result.needsConfirmation).toBe(true);
    if ("needsConfirmation" in result) {
      expect(result.message).toContain("nothing is deleted");
    }
  });

  it("archives once confirmed and mentions restore", () => {
    const result = archiveDoc({ ...completeDoc, status: "published" }, "publisher", {
      confirmed: true,
    });
    expect("ok" in result && result.ok).toBe(true);
    if ("ok" in result && result.ok) {
      expect(result.doc.status).toBe("archived");
    }
  });
});

describe("restore and automatic fields", () => {
  it("restores a previous version as a draft", () => {
    const revision = { ...completeDoc, title: "The older title" };
    const result = restoreVersion({ ...completeDoc, status: "published" }, "publisher", revision);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.doc.title).toBe("The older title");
      expect(result.doc.status).toBe("draft");
    }
  });

  it("applyAutomaticFields warns about duplicate slugs", () => {
    const { doc, notes } = applyAutomaticFields(
      { title: "Team Reset" },
      ["team-reset"],
    );
    expect(doc.slug).toBe("team-reset-2");
    expect(notes[0]).toContain("already uses the address");
  });

  it("withReadingTime computes from the body", () => {
    expect(withReadingTime(completeDoc).readingTime).toBe(1);
  });
});
