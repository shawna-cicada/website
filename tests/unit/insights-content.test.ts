import { describe, expect, it } from "vitest";
import { toVideoEmbedUrl } from "@/lib/cms/video";
import { INSIGHT_KIND_LABELS, formatInsightDate } from "@/lib/cms/format";
import type { InsightKind } from "@/lib/cms/types";

describe("toVideoEmbedUrl", () => {
  it("converts YouTube watch links to privacy-enhanced embeds", () => {
    expect(toVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(toVideoEmbedUrl("https://youtube.com/watch?v=dQw4w9WgXcQ&t=42")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("converts youtu.be, shorts, live, and existing embed links", () => {
    expect(toVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(toVideoEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(toVideoEmbedUrl("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(
      toVideoEmbedUrl("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"),
    ).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("converts Vimeo links to player embeds", () => {
    expect(toVideoEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789",
    );
    expect(toVideoEmbedUrl("https://player.vimeo.com/video/123456789")).toBe(
      "https://player.vimeo.com/video/123456789",
    );
  });

  it("refuses everything else — only CSP-allowed providers may embed", () => {
    // Unknown hosts, plain http, lookalike domains, junk input.
    expect(toVideoEmbedUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(toVideoEmbedUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(toVideoEmbedUrl("https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(toVideoEmbedUrl("https://vimeo.com/not-a-video")).toBeNull();
    expect(toVideoEmbedUrl("https://www.youtube.com/watch")).toBeNull();
    expect(toVideoEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(toVideoEmbedUrl("not a url")).toBeNull();
  });

  it("rejects malformed YouTube ids so embeds cannot smuggle paths", () => {
    expect(toVideoEmbedUrl("https://youtu.be/../evil")).toBeNull();
    expect(toVideoEmbedUrl("https://www.youtube.com/watch?v=a")).toBeNull();
  });
});

describe("insight display helpers", () => {
  it("labels every schema content type", () => {
    const kinds: InsightKind[] = [
      "article",
      "video",
      "podcast",
      "guide",
      "case-insight",
    ];
    for (const kind of kinds) {
      expect(INSIGHT_KIND_LABELS[kind]).toBeTruthy();
    }
  });

  it("formats ISO dates and tolerates missing/garbage values", () => {
    expect(formatInsightDate("2026-07-23T12:00:00Z")).toBe("July 23, 2026");
    expect(formatInsightDate(null)).toBeNull();
    expect(formatInsightDate("not-a-date")).toBeNull();
  });
});

describe("sanity coordinates (D-020)", () => {
  it("falls back to the committed public project when env is unset", async () => {
    // The module reads env at import time; in the test environment the
    // override vars are unset, so the committed defaults must apply.
    const { sanityProjectId, sanityDataset } = await import(
      "@/lib/sanity/config"
    );
    expect(sanityProjectId).toBe(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "66n8qkam",
    );
    expect(sanityDataset).toBe(
      process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
    );
  });
});
