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
});
