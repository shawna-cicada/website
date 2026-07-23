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
  ["--color-ink", "--color-ivory", 4.5, "body text on page background"],
  ["--color-ink", "--color-ivory-soft", 4.5, "body text on cards"],
  ["--color-ivory", "--color-ink", 4.5, "inverted text on ink sections"],
  ["--color-ivory", "--color-ink-soft", 4.5, "text on raised ink surfaces"],
  ["--color-moss", "--color-ivory", 4.5, "links / accent text on ivory"],
  ["--color-moss", "--color-ivory-soft", 4.5, "links on cards"],
  ["--color-copper", "--color-ivory", 4.5, "eyebrow / emergence text on ivory"],
  ["--color-stone", "--color-ivory", 4.5, "muted text on ivory"],
  ["--color-stone", "--color-ivory-soft", 4.5, "muted text on cards"],
  ["--color-ink", "--color-chartreuse", 4.5, "text on accent buttons/surfaces"],
  ["--color-ink", "--color-chartreuse-bright", 4.5, "text on hovered accent"],
  ["--color-chartreuse", "--color-ink", 4.5, "accent links on ink"],
  ["--color-sage", "--color-ink", 4.5, "sage eyebrows on ink"],
  // Non-text UI (focus ring on backgrounds): 3:1
  ["--color-moss", "--color-ivory", 3, "focus ring on ivory"],
  ["--color-moss", "--color-ivory-soft", 3, "focus ring on cards"],
];

describe("design tokens meet WCAG AA", () => {
  it.each(PAIRS)("%s on %s ≥ %s:1 (%s)", (fg, bg, min) => {
    const ratio = contrast(token(fg), token(bg));
    expect(ratio).toBeGreaterThanOrEqual(min);
  });

  it("chartreuse is documented as non-text on ivory (fails AA, by design)", () => {
    // Guard: if chartreuse ever passes 4.5:1 on ivory this note is stale;
    // until then it must never be used for small text on light backgrounds.
    const ratio = contrast(token("--color-chartreuse"), token("--color-ivory"));
    expect(ratio).toBeLessThan(4.5);
  });
});
