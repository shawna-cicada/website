import { describe, expect, it } from "vitest";
import { withUtm } from "@/lib/analytics/utm";

describe("withUtm", () => {
  it("appends default source/medium and the campaign", () => {
    const url = withUtm("https://assessments.example.com/growth", {
      campaign: "growth-stage-assessment",
    });
    const parsed = new URL(url);
    expect(parsed.searchParams.get("utm_source")).toBe("cicadaagility.com");
    expect(parsed.searchParams.get("utm_medium")).toBe("website");
    expect(parsed.searchParams.get("utm_campaign")).toBe(
      "growth-stage-assessment",
    );
  });

  it("never overwrites UTM values already on the URL", () => {
    const url = withUtm(
      "https://example.com/a?utm_source=partner&utm_campaign=existing",
      { campaign: "ours" },
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get("utm_source")).toBe("partner");
    expect(parsed.searchParams.get("utm_campaign")).toBe("existing");
    expect(parsed.searchParams.get("utm_medium")).toBe("website");
  });

  it("preserves existing non-UTM query params and fragments", () => {
    const url = withUtm("https://example.com/a?id=42#section");
    const parsed = new URL(url);
    expect(parsed.searchParams.get("id")).toBe("42");
    expect(parsed.hash).toBe("#section");
  });

  it("omits utm_campaign when no campaign is given", () => {
    const parsed = new URL(withUtm("https://example.com/a"));
    expect(parsed.searchParams.has("utm_campaign")).toBe(false);
  });

  it("returns invalid URLs unchanged instead of throwing", () => {
    expect(withUtm("not a url")).toBe("not a url");
    expect(withUtm("")).toBe("");
  });
});
