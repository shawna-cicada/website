import { test, expect } from "@playwright/test";

test.describe("/admin", () => {
  test("shows a plain-language setup notice until Sanity is connected", async ({
    page,
  }) => {
    // CI/build env sets no NEXT_PUBLIC_SANITY_PROJECT_ID.
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", {
        name: /editorial dashboard is almost ready/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/Nothing is wrong with your account/i)).toBeVisible();
  });
});
