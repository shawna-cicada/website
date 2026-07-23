import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/how-we-help",
  "/how-we-help/leadership-team-effectiveness",
  "/assessments",
  "/insights",
  "/book",
  "/about",
];

test.describe("launch: redirects", () => {
  const cases: Array<[string, string]> = [
    ["/offerings", "/how-we-help"],
    ["/contact", "/book"],
    ["/meet-with-us", "/book"],
    ["/articles", "/insights"],
    ["/articles/some-old-article", "/insights/some-old-article"],
    ["/post/some-old-article", "/insights/some-old-article"],
    ["/blog", "/insights"],
  ];
  for (const [source, destination] of cases) {
    test(`${source} permanently redirects to ${destination}`, async ({
      request,
    }) => {
      const response = await request.get(source, { maxRedirects: 0 });
      expect([301, 308]).toContain(response.status());
      expect(response.headers()["location"]).toContain(destination);
    });
  }
});

test.describe("launch: SEO plumbing", () => {
  test("sitemap.xml lists key routes and omits admin/design-system", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const path of ["/how-we-help", "/assessments", "/book", "/about"]) {
      expect(xml).toContain(`https://www.cicadaagility.com${path}`);
    }
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/design-system");
    expect(xml).not.toContain("/clients"); // empty state → excluded
  });

  test("robots.txt allows the site and blocks admin", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Disallow: /admin");
    expect(text).toContain("Sitemap: https://www.cicadaagility.com/sitemap.xml");
  });

  test("canonical URL and OG image are emitted", async ({ page }) => {
    await page.goto("/how-we-help/founder-growth");
    await expect(
      page.locator('link[rel="canonical"]'),
    ).toHaveAttribute("href", /how-we-help\/founder-growth/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
  });
});

test.describe("launch: security headers", () => {
  test("responses carry CSP and hardening headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("calendly.com");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age");
  });
});

test.describe("launch: error pages", () => {
  test("404 renders the branded not-found page", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "This page has been shed." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to the homepage" }),
    ).toBeVisible();
  });
});

test.describe("launch: accessibility audit", () => {
  for (const path of PAGES) {
    test(`axe: ${path} has no serious/critical violations`, async ({ page }) => {
      // Audit the settled (reduced-motion) rendering: entrance animations
      // otherwise put text in transient low-opacity states mid-scan.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      const serious = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );
      expect(
        serious,
        serious
          .map((violation) => `${violation.id}: ${violation.help}`)
          .join("\n"),
      ).toEqual([]);
    });
  }

  test("heading hierarchy: exactly one h1 per page", async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator("h1"), path).toHaveCount(1);
    }
  });
});

test.describe("launch: 320px layout", () => {
  test.use({ viewport: { width: 320, height: 720 } });
  for (const path of PAGES) {
    test(`no horizontal scroll at 320px: ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("launch: zoom", () => {
  test("200% zoom equivalent (640px) keeps the homepage usable", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 640, height: 512 },
    });
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await context.close();
  });
});
