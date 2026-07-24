import { test, expect } from "@playwright/test";

test.describe("/about", () => {
  test("renders all eight sections in order", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "We help companies evolve as they grow.",
      }),
    ).toBeVisible();
    for (const heading of [
      "Why a cicada?",
      "What we believe",
      "We work across the whole system",
      "Two perspectives. One connected system.",
      "How we work",
      "Experience from startup to enterprise",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
  });

  test("founder profiles show the full record with draft-bio marking", async ({
    page,
  }) => {
    await page.goto("/about");
    for (const name of ["Shawna Cullinan", "Julia Kaissling"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    expect(await page.getByText("Expertise", { exact: true }).count()).toBe(2);
    expect(
      await page.getByText("Selected experience", { exact: true }).count(),
    ).toBe(2);
    expect(
      await page.getByText(/Draft bio: pending editorial review/i).count(),
    ).toBe(2);
  });

  test("Person and Organization structured data are present", async ({ page }) => {
    await page.goto("/about");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(jsonLd!);
    const types = data["@graph"].map((node: { "@type": string }) => node["@type"]);
    expect(types).toContain("Organization");
    expect(types.filter((type: string) => type === "Person")).toHaveLength(2);
  });
});

test.describe("/clients", () => {
  test("shows the honest empty state while no records are approved", async ({
    page,
  }) => {
    await page.goto("/clients");
    await expect(
      page.getByRole("heading", {
        name: "Experience supporting teams from startup to enterprise",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /client stories are on their way/i }),
    ).toBeVisible();
    // No placeholder logos leak onto the public page.
    await expect(page.locator("figure")).toHaveCount(0);
    // Noindexed while empty.
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]'),
    ).toHaveCount(1);
  });

  test("is not linked from site navigation while empty", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator('a[href="/clients"]').count()).toBe(0);
  });
});
