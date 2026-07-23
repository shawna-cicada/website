import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { manualLinkedInPublisher } from "@/lib/linkedin/manual";
import { getSocialPublisher } from "@/lib/linkedin";
import { generateLinkedInPost } from "@/lib/editorial/linkedin";

describe("generateLinkedInPost link origin", () => {
  const base = {
    title: "A title",
    summary: "A summary of the piece.",
    slug: "a-title",
  };

  it("defaults to the canonical production domain", () => {
    expect(generateLinkedInPost(base)).toContain(
      "https://www.cicadaagility.com/insights/a-title",
    );
  });

  it("uses the Studio's origin when provided, so links work pre-cutover", () => {
    const post = generateLinkedInPost({
      ...base,
      baseUrl: "https://website-new-two-gamma.vercel.app/",
    });
    expect(post).toContain(
      "https://website-new-two-gamma.vercel.app/insights/a-title",
    );
    expect(post).not.toContain("vercel.app//insights");
  });
});

const input = {
  title: "The habits that built your company",
  excerpt: "Every growth stage rewards different leadership behavior.",
  slug: "habits-that-built-your-company",
  contentType: "article",
};

describe("ManualLinkedInPublisher", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;
  let xhrSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn(() => {
      throw new Error("Network call attempted in manual mode!");
    });
    xhrSpy = vi.fn(() => {
      throw new Error("XHR attempted in manual mode!");
    });
    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("XMLHttpRequest", xhrSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("createDraft formats the post with the canonical URL", () => {
    const draft = manualLinkedInPublisher.createDraft(input);
    expect(draft.text).toContain(input.title);
    expect(draft.text).toContain(input.excerpt);
    expect(draft.text).toContain(
      "https://www.cicadaagility.com/insights/habits-that-built-your-company",
    );
    expect(draft.canonicalUrl).toBe(
      "https://www.cicadaagility.com/insights/habits-that-built-your-company",
    );
    expect(draft.text.length).toBeLessThanOrEqual(2900);
  });

  it("adds a content-type hook for non-article types", () => {
    const video = manualLinkedInPublisher.createDraft({
      ...input,
      contentType: "video",
    });
    expect(video.text.startsWith("New video:")).toBe(true);
  });

  it("publish returns a manual-action status with human instructions", async () => {
    const result = await manualLinkedInPublisher.publish(input);
    expect(result.mode).toBe("manual");
    if (result.mode === "manual") {
      expect(result.status).toBe("awaiting-manual-post");
      expect(result.instructions).toContain("Copy the post text");
      expect(result.draft.text).toContain(input.title);
    }
  });

  it("NEVER makes a network call in manual mode", async () => {
    manualLinkedInPublisher.createDraft(input);
    await manualLinkedInPublisher.publish(input);
    manualLinkedInPublisher.getStatus(input.slug, "ready");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
  });

  it("getStatus reflects the stored CMS value (no external source)", () => {
    expect(manualLinkedInPublisher.getStatus("slug")).toBe("not-ready");
    expect(manualLinkedInPublisher.getStatus("slug", "posted")).toBe("posted");
  });
});

describe("publisher registry safety interlock", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to the manual publisher", () => {
    expect(getSocialPublisher().name).toBe("manual-linkedin");
    expect(getSocialPublisher().automated).toBe(false);
  });

  it("stays manual even if automated mode is flagged without an approved provider", () => {
    vi.stubEnv("SOCIAL_PUBLISH_MODE", "automated");
    vi.stubEnv("SOCIAL_PUBLISH_PROVIDER", "linkedin-api");
    expect(getSocialPublisher().name).toBe("manual-linkedin");
  });

  it("stays manual when the flagged provider is the manual one", () => {
    vi.stubEnv("SOCIAL_PUBLISH_MODE", "automated");
    vi.stubEnv("SOCIAL_PUBLISH_PROVIDER", "manual-linkedin");
    expect(getSocialPublisher().automated).toBe(false);
  });
});
