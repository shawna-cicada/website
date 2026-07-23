import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("hero never dead-ends: booking leads while no assessment is live", async ({
    page,
  }) => {
    // No assessment env vars in CI → the hero must lead with booking and
    // offer the assessment hub as secondary (never a disabled dead end).
    await page.goto("/");
    const hero = page.locator("section", {
      has: page.getByRole("heading", { level: 1 }),
    });
    await expect(
      hero.getByRole("link", { name: "Book a Discovery Call" }),
    ).toHaveAttribute("href", "/book");
    await expect(
      hero.getByRole("link", { name: "Explore our assessments" }),
    ).toHaveAttribute("href", "/assessments");
  });

  test("booking CTAs lead to /book", async ({ page, isMobile }) => {
    await page.goto("/");
    const bookingCtas = page.getByRole("link", { name: "Book a Discovery Call" });
    const count = await bookingCtas.count();
    expect(count).toBeGreaterThanOrEqual(2); // hero + final CTA
    for (let i = 0; i < count; i++) {
      await expect(bookingCtas.nth(i)).toHaveAttribute("href", "/book");
    }
    // The persistent header CTA also books a conversation. On mobile it
    // lives in the disclosure menu (covered by the mobile nav test).
    if (!isMobile) {
      await expect(
        page
          .getByRole("navigation", { name: "Main" })
          .getByRole("link", { name: "Book a Conversation" }),
      ).toHaveAttribute("href", "/book");
    }
  });

  test("mobile navigation opens and links work", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).tap();
    const menu = page.getByRole("navigation", { name: "Main menu" });
    await expect(menu.getByRole("link", { name: "How We Help" })).toBeVisible();
    await expect(
      menu.getByRole("link", { name: "Book a Conversation" }),
    ).toHaveAttribute("href", "/book");
    // Practice pages are listed directly under How We Help.
    await expect(
      menu.getByRole("link", { name: "Organizational Effectiveness" }),
    ).toHaveAttribute("href", "/how-we-help/organizational-effectiveness");
  });

  test("desktop nav: How We Help dropdown lists the practice pages", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop project only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /show how we help pages/i });
    await toggle.click();
    for (const name of [
      "Leadership & Team Effectiveness",
      "Organizational Effectiveness",
      "AI Enablement & Working Norms",
      "Founder Challenges: Seed to Scale",
    ]) {
      await expect(page.getByRole("link", { name })).toBeVisible();
    }
    // Escape closes the disclosure.
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("link", { name: "Leadership & Team Effectiveness" }),
    ).toBeHidden();
  });

  test("framework presents all three stages", async ({ page }) => {
    await page.goto("/");
    for (const stage of ["Shed", "Emerge", "Expand"]) {
      await expect(page.getByText(stage, { exact: true })).toBeVisible();
    }
    await expect(
      page.getByRole("heading", {
        name: "Recognize what no longer serves the company.",
      }),
    ).toBeVisible();
  });

  test("reduced motion: framework is static and marquee stopped", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Framework renders the static layout at full opacity.
    // (toHaveCSS retries, riding out the hydration swap to the static tree.)
    const shed = page.getByText("Shed", { exact: true });
    await expect(shed).toBeVisible();
    const listItem = page.locator("li", { has: shed }).first();
    await expect(listItem).toHaveCSS("opacity", "1");

    // Marquee animation is clamped to effectively zero duration.
    const marquee = page.locator(".marquee-track");
    if ((await marquee.count()) > 0) {
      const duration = await marquee.evaluate(
        (el) => getComputedStyle(el).animationDuration,
      );
      expect(parseFloat(duration)).toBeLessThanOrEqual(0.001);
    }
  });

  test("logo marquee renders with visible sample labeling until approved", async ({
    page,
  }) => {
    // Demo mode (founder request): placeholder logos may show pre-launch,
    // but ONLY with the explicit sample caption — and every image must
    // carry alt text.
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='clients-heading']");
    await expect(section).toHaveCount(1);
    await expect(
      section.getByText(/sample logos shown for layout preview/i),
    ).toBeVisible();
    const logos = section.locator("img");
    const count = await logos.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      const alt = await logos.nth(i).getAttribute("alt");
      expect(alt?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  test("one h1, sections labelled", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Growth happens in stages/i,
      }),
    ).toBeVisible();
  });
});
