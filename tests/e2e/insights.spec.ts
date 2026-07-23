import { test, expect } from "@playwright/test";

/**
 * The public insights pages (Phase 6). The test environment cannot
 * reach Sanity, which deliberately exercises the degraded path: the
 * index must render its honest empty state and unknown slugs must 404.
 */
test.describe("/insights", () => {
  test("renders the hero and an honest empty state when no content is reachable", async ({
    page,
  }) => {
    await page.goto("/insights");
    await expect(
      page.getByRole("heading", { name: /ideas for companies in motion/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /first pieces are on their way/i }),
    ).toBeVisible();
    // The empty state offers a real next step, not a dead end.
    await expect(
      page
        .getByRole("region", { name: /first pieces are on their way/i })
        .getByRole("link", { name: /book a conversation/i }),
    ).toBeVisible();
  });

  test("unknown article slugs return the branded 404", async ({ page }) => {
    const response = await page.goto("/insights/this-article-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /this page has been shed/i }),
    ).toBeVisible();
  });
});
