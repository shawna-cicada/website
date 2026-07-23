import { test, expect } from "@playwright/test";

test.describe("/admin", () => {
  test("serves the embedded Studio shell (D-020: always configured)", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    expect(response?.status()).toBe(200);

    // The pre-D-020 "connect Sanity first" notice must be gone for good.
    await expect(
      page.getByRole("heading", {
        name: /editorial dashboard is almost ready/i,
      }),
    ).toHaveCount(0);

    // The Studio itself is client-rendered and needs network access to
    // Sanity (unavailable in this environment), so assert the shell:
    // Sanity's core bridge script only ships when the Studio mounts.
    const html = await page.content();
    expect(html).toContain("data-sanity-core");
  });

  test("renders without the marketing header/footer, so the Studio's action bar fits on screen", async ({
    page,
  }) => {
    await page.goto("/admin");
    // The site nav stacking above the full-viewport Studio pushed the
    // Publish bar below the fold — the chrome must never render here.
    await expect(
      page.getByRole("link", { name: /how we help/i }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("contentinfo"),
    ).toHaveCount(0);
  });
});
