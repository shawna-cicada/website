import { test, expect } from "@playwright/test";

// The CI/build environment sets no provider env vars, so both pages must
// render their honest unconfigured states — that is what we assert here.

test.describe("/assessments", () => {
  test("hub renders featured hero and all active cards", async ({ page }) => {
    await page.goto("/assessments");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Find out what your company has outgrown.",
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

  test("honest data-use language is present (proprietary assessments, D-022)", async ({
    page,
  }) => {
    await page.goto("/assessments");
    await expect(
      page.getByRole("heading", { name: /about our assessments/i }),
    ).toBeVisible();
    // The disclosure must say plainly that responses and contact details
    // come to Cicada and are used for follow-up.
    await expect(
      page.getByText(/your answers and contact details come to us/i),
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
      "Coaching Session",
    ]) {
      await expect(
        page.getByRole("button", { name: new RegExp(label) }),
      ).toBeVisible();
    }
    // The discovery option is visibly marked free, and each option
    // carries an explicit action affordance.
    await expect(
      page.getByRole("button", { name: /Discovery Call.*Free/s }),
    ).toBeVisible();
    await expect(page.getByText("Book this →").first()).toBeVisible();
  });

  test("scheduling embeds load from the committed Cal.com links (D-024)", async ({
    page,
  }) => {
    await page.goto("/book");
    // The discovery embed iframe points at the live public event page.
    await expect(
      page.locator('iframe[src*="cal.com/cicadaagility/30min"]'),
    ).toBeAttached();
  });

  test("event selector switches embeds without losing page content", async ({
    page,
  }) => {
    await page.goto("/book");
    const debrief = page.getByRole("button", { name: /Assessment Debrief/ });
    await debrief.click();
    await expect(debrief).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('iframe[src*="cal.com/cicadaagility/60min"]'),
    ).toBeAttached();
  });

  test("deep links pre-select the conversation type", async ({ page }) => {
    await page.goto("/book#coaching-session");
    await expect(
      page.getByRole("button", { name: /Coaching Session/ }),
    ).toHaveAttribute("aria-pressed", "true");
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
