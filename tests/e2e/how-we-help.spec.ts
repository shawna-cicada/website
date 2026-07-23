import { test, expect } from "@playwright/test";

test.describe("/how-we-help", () => {
  test("overview leads with the system idea and links all practices", async ({
    page,
  }) => {
    await page.goto("/how-we-help");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "The challenge is rarely just leadership, process, or culture.",
      }),
    ).toBeVisible();

    for (const slug of [
      "leadership-team-effectiveness",
      "organizational-effectiveness",
      "ai-enablement",
      "founder-growth",
    ]) {
      // Scoped to main: the header's nav dropdown also holds these
      // links, hidden until opened.
      await expect(
        page.locator(`main a[href="/how-we-help/${slug}"]`).first(),
      ).toBeVisible();
    }
  });

  test("overview lists the six engagements", async ({ page }) => {
    await page.goto("/how-we-help");
    for (const engagement of [
      "Growth Stage Diagnostic",
      "Leadership Intensive",
      "Team Reset",
      "Operating Model and Product Effectiveness Assessment",
      "Scale Plan and Operational Roadmap",
      "Ongoing Leadership and Organizational Advisory",
    ]) {
      await expect(
        page.getByRole("heading", { name: engagement }).first(),
      ).toBeVisible();
    }
  });

  test("detail page shows every required block and the booking CTA", async ({
    page,
  }) => {
    await page.goto("/how-we-help/leadership-team-effectiveness");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Your leadership team is working harder — and agreeing less.",
      }),
    ).toBeVisible();

    for (const block of [
      "Who it's for",
      "Problems we help solve",
      "What we may work on",
      "What clients leave with",
      "Typical engagement formats",
      "Related insights",
      "Related practices",
    ]) {
      await expect(page.getByText(block, { exact: true })).toBeVisible();
    }

    const ctas = page.getByRole("link", { name: "Discuss Your Needs" });
    const count = await ctas.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      await expect(ctas.nth(i)).toHaveAttribute("href", "/book");
    }
  });

  test("cross-links navigate between related practices", async ({ page }) => {
    await page.goto("/how-we-help/founder-growth");
    await page
      .getByRole("link", { name: "Leadership & Team Effectiveness" })
      .first()
      .click();
    await expect(page).toHaveURL(/leadership-team-effectiveness/);
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText("working harder");
  });

  test("Service structured data is present and valid", async ({ page }) => {
    await page.goto("/how-we-help/organizational-effectiveness");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(jsonLd).toBeTruthy();
    const data = JSON.parse(jsonLd!);
    expect(data["@type"]).toBe("Service");
    expect(data.name).toBe("Organizational Effectiveness");
    expect(data.provider.name).toBe("Cicada Agility");
    expect(data.url).toContain("/how-we-help/organizational-effectiveness");
  });

  test("unknown practice slug returns 404", async ({ page }) => {
    const response = await page.goto("/how-we-help/not-a-practice");
    expect(response?.status()).toBe(404);
  });
});
