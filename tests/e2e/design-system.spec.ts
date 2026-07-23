import { test, expect } from "@playwright/test";

test.describe("/design-system", () => {
  test("renders every section", async ({ page }) => {
    await page.goto("/design-system");
    await expect(
      page.getByRole("heading", { level: 1, name: /design system/i }),
    ).toBeVisible();
    for (const section of [
      "Color",
      "Typography",
      "Spacing & layout",
      "Buttons & text links",
      "Cards",
      "Image treatment",
      "Illustration primitives",
      "Motion",
      "Focus & accessibility",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: section }),
      ).toBeVisible();
    }
  });

  test("keyboard: skip link is first and focus is visible", async ({ page }) => {
    await page.goto("/design-system");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Continue tabbing: focused elements must show a non-none outline.
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThan(0);
  });

  test("motion runs by default", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/design-system");
    const duration = await page
      .getByTestId("motion-rise")
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(duration)).toBeGreaterThan(0.1);
  });

  test("reduced motion collapses animation and transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/design-system");

    const animationDuration = await page
      .getByTestId("motion-rise")
      .evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(animationDuration)).toBeLessThanOrEqual(0.001);

    const transitionDuration = await page
      .getByRole("button", { name: "Primary" })
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(transitionDuration)).toBeLessThanOrEqual(0.001);
  });

  test("mobile: menu disclosure works end to end", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");
    await page.goto("/design-system");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.tap();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(
      page.getByRole("navigation", { name: "Main menu" }).getByRole("link", {
        name: "How We Help",
      }),
    ).toBeVisible();
  });
});
