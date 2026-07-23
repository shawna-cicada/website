import { describe, expect, it } from "vitest";
import { WIX_REDIRECTS } from "@/lib/seo/redirects";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  videoObjectJsonLd,
} from "@/lib/seo/jsonld";
import { formatEnvReport, validateEnvironment } from "@/lib/env";

describe("Wix redirect map", () => {
  it("covers every known Wix section", () => {
    const sources = WIX_REDIRECTS.map((rule) => rule.source);
    for (const required of [
      "/offerings",
      "/contact",
      "/meet-with-us",
      "/articles",
      "/articles/:slug",
      "/blog",
      "/post/:slug",
    ]) {
      expect(sources).toContain(required);
    }
  });

  it("every redirect is permanent and targets a real section", () => {
    const validTargets = ["/how-we-help", "/book", "/insights", "/insights/:slug"];
    for (const rule of WIX_REDIRECTS) {
      expect(rule.permanent, rule.source).toBe(true);
      expect(validTargets, rule.source).toContain(rule.destination);
    }
  });

  it("article redirects preserve slugs", () => {
    const articleRule = WIX_REDIRECTS.find((rule) => rule.source === "/articles/:slug");
    expect(articleRule?.destination).toBe("/insights/:slug");
    const postRule = WIX_REDIRECTS.find((rule) => rule.source === "/post/:slug");
    expect(postRule?.destination).toBe("/insights/:slug");
  });
});

describe("structured data helpers", () => {
  it("breadcrumbs carry ordered positions and absolute URLs", () => {
    const data = breadcrumbJsonLd([
      { name: "How We Help", path: "/how-we-help" },
      { name: "Founder Growth", path: "/how-we-help/founder-growth" },
    ]);
    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement[1].position).toBe(2);
    expect(data.itemListElement[1].item).toBe(
      "https://www.cicadaagility.com/how-we-help/founder-growth",
    );
  });

  it("Article schema includes author, publisher, and canonical URL", () => {
    const data = articleJsonLd({
      title: "A piece",
      description: "About things",
      slug: "a-piece",
      authorName: "Shawna Cullinan",
      publishedAt: "2026-07-23T00:00:00Z",
    });
    expect(data["@type"]).toBe("Article");
    expect(data.author.name).toBe("Shawna Cullinan");
    expect(data.publisher.name).toBe("Cicada Agility");
    expect(data.url).toContain("/insights/a-piece");
  });

  it("VideoObject schema includes the embed URL and upload date", () => {
    const data = videoObjectJsonLd({
      title: "A video",
      description: "About things",
      slug: "a-video",
      videoUrl: "https://www.youtube.com/watch?v=abc",
      publishedAt: "2026-07-23T00:00:00Z",
    });
    expect(data["@type"]).toBe("VideoObject");
    expect(data.embedUrl).toContain("youtube.com");
    expect(data.uploadDate).toBe("2026-07-23T00:00:00Z");
  });
});

describe("production environment validation", () => {
  it("fails when critical variables are missing", () => {
    const report = validateEnvironment({} as NodeJS.ProcessEnv);
    expect(report.ok).toBe(false);
    expect(
      report.missingCritical.map((check) => check.name),
    ).toContain("CALENDLY_EVENT_URL_DISCOVERY_CALL");
    expect(formatEnvReport(report)).toContain("[env][CRITICAL]");
  });

  it("passes when critical variables are present", () => {
    const report = validateEnvironment({
      CALENDLY_EVENT_URL_DISCOVERY_CALL: "https://calendly.com/x/y",
      BOOKING_CONTACT_EMAIL: "hello@example.com",
    } as unknown as NodeJS.ProcessEnv);
    expect(report.ok).toBe(true);
    expect(report.missingOptional.length).toBeGreaterThan(0);
    expect(formatEnvReport(report)).not.toContain("CRITICAL");
  });

  it("every check explains its consequence in plain language", () => {
    const report = validateEnvironment({} as NodeJS.ProcessEnv);
    for (const check of [...report.missingCritical, ...report.missingOptional]) {
      expect(check.consequence.length, check.name).toBeGreaterThan(20);
    }
  });
});
