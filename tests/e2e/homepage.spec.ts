import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("primary CTA leads to the assessment pathway", async ({ page }) => {
    await page.goto("/");
    const primary = page
      .getByRole("link", { name: "Start the Growth Stage Assessment" })
      .first();
    await expect(primary).toBeVisible();
    await expect(primary).toHaveAttribute("href", "/assessments");
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

  test("every client logo image has alt text", async ({ page }) => {
    await page.goto("/");
    const logos = page.locator(
      "section[aria-labelledby='clients-heading'] img:not([aria-hidden] img)",
    );
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
        name: /Growth Happens in Stages/,
      }),
    ).toBeVisible();
  });
});
