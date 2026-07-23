import { test, expect } from "@playwright/test";

// The CI/build environment sets no provider env vars, so both pages must
// render their honest unconfigured states — that is what we assert here.

test.describe("/assessments", () => {
  test("hub renders featured hero and all active cards", async ({ page }) => {
    await page.goto("/assessments");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Start by understanding what your company has outgrown.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Growth Stage Assessment" }),
    ).toBeVisible();
    for (const title of [
      "Founder Growth Assessment",
      "Leadership Team Alignment Check",
      "AI Readiness Assessment",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    // Inactive record never renders.
    await expect(
      page.getByText("Organizational Effectiveness Scan"),
    ).toHaveCount(0);
  });

  test("unconfigured assessments render disabled, not as dead links", async ({
    page,
  }) => {
    await page.goto("/assessments");
    const disabled = page.getByRole("button", { name: "Start the assessment" });
    expect(await disabled.count()).toBeGreaterThanOrEqual(1);
    await expect(disabled.first()).toBeDisabled();
    await expect(
      page.getByText(/being prepared — available soon/i).first(),
    ).toBeVisible();
  });

  test("third-party privacy language is present", async ({ page }) => {
    await page.goto("/assessments");
    await expect(
      page.getByRole("heading", { name: /about third-party assessments/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/does not collect your answers or any personal data/i),
    ).toBeVisible();
  });
});

test.describe("/book", () => {
  test("renders headline, copy, and the three conversation types", async ({
    page,
  }) => {
    await page.goto("/book");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /talk about what your company has outgrown/i,
      }),
    ).toBeVisible();
    for (const label of [
      "Discovery Call",
      "Assessment Debrief",
      "Existing Client Session",
    ]) {
      await expect(
        page.getByRole("button", { name: new RegExp(label) }),
      ).toBeVisible();
    }
  });

  test("unconfigured scheduling shows the accessible fallback", async ({
    page,
  }) => {
    await page.goto("/book");
    await expect(page.getByText(/is being set up/i)).toBeVisible();
    // No iframe when unconfigured; page content still fully rendered.
    await expect(page.locator("iframe")).toHaveCount(0);
  });

  test("event selector switches without losing page content", async ({
    page,
  }) => {
    await page.goto("/book");
    const debrief = page.getByRole("button", { name: /Assessment Debrief/ });
    await debrief.click();
    await expect(debrief).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByText(/Scheduling for “Assessment Debrief” is being set up/i),
    ).toBeVisible();
  });

  test("privacy and time zone copy are present", async ({ page }) => {
    await page.goto("/book");
    await expect(
      page.getByText(/shown automatically in your local time zone/i),
    ).toBeVisible();
    await expect(
      page.getByText(/handled under its privacy policy/i),
    ).toBeVisible();
  });
});
