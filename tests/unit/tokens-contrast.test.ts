import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * WCAG AA contrast enforcement at the token level.
 * Parses the CSS variables from app/globals.css (the single source of truth)
 * and verifies every declared text-role pairing. Changing a hex value in
 * globals.css re-runs this audit automatically.
 */

const css = readFileSync(
  path.resolve(__dirname, "../../app/globals.css"),
  "utf8",
);

function token(name: string): string {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token ${name} not found in globals.css`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** [foreground, background, minimum ratio, role] */
const PAIRS: Array<[string, string, number, string]> = [
  // Normal text: 4.5:1
  ["--color-ink", "--color-paper", 4.5, "body text on page background"],
  ["--color-ink", "--color-lilac", 4.5, "body text on cards"],
  ["--color-paper", "--color-ink", 4.5, "inverted text on ink sections"],
  ["--color-paper", "--color-ink-soft", 4.5, "text on raised ink surfaces"],
  ["--color-meadow-deep", "--color-paper", 4.5, "links / accent text on paper"],
  ["--color-meadow-deep", "--color-lilac", 4.5, "links on cards"],
  ["--color-slate", "--color-paper", 4.5, "muted text on paper"],
  ["--color-slate", "--color-lilac", 4.5, "muted text on cards"],
  ["--color-ink", "--color-meadow", 4.5, "text on accent buttons/surfaces"],
  ["--color-ink", "--color-meadow-bright", 4.5, "text on hovered accent"],
  ["--color-meadow", "--color-ink", 4.5, "accent links on ink"],
  ["--color-melrose", "--color-ink", 4.5, "melrose eyebrows on ink"],
  ["--color-malibu", "--color-ink", 4.5, "malibu highlights on ink"],
  // Non-text UI (focus ring on backgrounds): 3:1
  ["--color-ink", "--color-paper", 3, "focus ring on paper"],
  ["--color-ink", "--color-lilac", 3, "focus ring on cards"],
  ["--color-ink", "--color-meadow", 3, "focus ring on accent surfaces"],
  ["--color-meadow", "--color-ink", 3, "focus ring inside ink sections"],
];

describe("design tokens meet WCAG AA", () => {
  it.each(PAIRS)("%s on %s ≥ %s:1 (%s)", (fg, bg, min) => {
    const ratio = contrast(token(fg), token(bg));
    expect(ratio).toBeGreaterThanOrEqual(min);
  });

  it("Mountain Meadow is documented as non-text on paper (fails AA, by design)", () => {
    // Guard: if meadow ever passes 4.5:1 on paper this note is stale;
    // until then it must never be used for small text on light backgrounds.
    const ratio = contrast(token("--color-meadow"), token("--color-paper"));
    expect(ratio).toBeLessThan(4.5);
  });
});
