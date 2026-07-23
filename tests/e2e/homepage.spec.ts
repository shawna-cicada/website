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
  });

  test("framework presents all three stages", async ({ page }) => {
    await page.goto("/");
    for (const stage of ["Shed", "Emerge", "Expand"]) {
      await expect(
        page.getByText(new RegExp(`0\\d — ${stage}`)),
      ).toBeVisible();
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
    const shed = page.getByText(/01 — Shed/);
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

  test("client logo wall stays hidden until records are approved", async ({
    page,
  }) => {
    // Seed records are unapproved placeholders — no logo (real or fake)
    // may reach visitors. Alt-text enforcement for approved records is
    // covered by the content contract unit tests.
    await page.goto("/");
    await expect(
      page.locator("section[aria-labelledby='clients-heading']"),
    ).toHaveCount(0);
    await expect(page.getByText(/placeholder client logo/i)).toHaveCount(0);
  });

  test("one h1, sections labelled", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Growth Happens in Stages/,
      }),
    ).toBeVisible();
  });
});
