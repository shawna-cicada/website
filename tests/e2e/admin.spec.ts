import { test, expect } from "@playwright/test";
import { ADMIN_GATE_COOKIE, expectedToken } from "../../lib/admin-gate";

test.describe("/admin", () => {
  test("shows the team-password curtain, not the Studio, to strangers", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Team access" })).toBeVisible();
    await expect(page.getByLabel("Team password")).toBeVisible();
    // The Studio must not ship to ungated visitors.
    expect(await page.content()).not.toContain("data-sanity-core");
    // The marketing chrome stays out of /admin.
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
  });

  test("wrong password bounces back with a plain-language error", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.getByLabel("Team password").fill("not-the-password");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/isn.t right. Try again/i)).toBeVisible();
    expect(await page.content()).not.toContain("data-sanity-core");
  });

  test("a valid gate cookie opens the Studio shell", async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([
      {
        name: ADMIN_GATE_COOKIE,
        value: expectedToken(),
        url: `${baseURL}/admin`,
      },
    ]);
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Team access" })).toHaveCount(0);
    // Sanity's core bridge script only ships when the Studio mounts.
    expect(await page.content()).toContain("data-sanity-core");
  });
});
