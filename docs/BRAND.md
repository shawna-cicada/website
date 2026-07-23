# Cicada Brand Reference

Extracted from the official brand assets supplied by Cicada Agility on
2026-07-23: `Cicada_Brand_Presentation.pdf` (126 pp) and
`Cicada_Logo_Designs.eps`. This file records what the source materials say and
how the website's design tokens map onto them. The tokens themselves live in
`app/globals.css`; WCAG AA pairings are enforced by
`tests/unit/tokens-contrast.test.ts`.

## Logo

- **Logotype:** "CICADA" — a customized version of the Raleway typeface, with
  the descriptor line "ORGANIZATIONAL AGILITY".
- **Primary form:** cicada line-art mark above the logotype.
- **Logo mark:** the geometric cicada line art; approved for standalone use
  (favicon, app icon, small sizes).
- Vector components: `components/brand/CicadaMark.tsx` and
  `components/brand/CicadaWordmark.tsx` (render in `currentColor`; the
  wordmark's descriptor line is optional via `withDescriptor`).
- Extracted source files: `public/logos/cicada-mark.svg`,
  `cicada-wordmark.svg`, `cicada-lockup.svg`. Favicon: `app/icon.svg`.
- Historic tagline in the deck: "We Help Your Organization Hum" / "Making
  Organizations Hum". The current site tagline ("Growth Happens in Stages.
  Leadership Must Evolve With It.") comes from the redesign brief and
  supersedes it in copy, not in the logo.

## Brand palette (from the deck)

| Name | Hex | Website token | Role on the site |
|---|---|---|---|
| Mountain Meadow | `#18b698` | `--color-meadow` | THE brand green. Accent surfaces, on-ink accents. Not small text on light backgrounds (2.5:1). |
| Rhino | `#2d3958` | `--color-ink-soft` | Raised surfaces on dark sections. |
| Big Stone | `#1e2a44` | `--color-ink` | Brand navy. Text, dark sections, primary buttons. |
| Melrose | `#cbb8ff` | `--color-melrose` | Soft violet. Decorative; accent text on ink (8.1:1). |
| Malibu | `#4ddffd` | `--color-malibu` | Light cyan. Rare decorative highlights; 9:1 on ink. |
| White Lilac | `#e6eaf5` | `--color-lilac` | Soft mineral surface for cards and wells. |
| Silver | `#c4c4c4` | `--color-silver` | Quiet rules/dividers, decorative only. |

### Derived tints (website additions, AA-validated)

| Name | Hex | Token | Why it exists |
|---|---|---|---|
| Paper | `#fafbfc` | `--color-paper` | Near-white page background (the deck uses plain white; slightly cooled to sit with White Lilac). |
| Meadow Deep | `#0d7263` | `--color-meadow-deep` | Text-safe Mountain Meadow for links/eyebrows on light backgrounds (5.6:1 on paper, 4.8:1 on lilac). |
| Meadow Bright | `#2fcbb0` | `--color-meadow-bright` | Hover state for accent surfaces (ink text stays 7:1). |
| Slate | `#4c5872` | `--color-slate` | Muted text, derived from Rhino (6.9:1 on paper). |

## Typography (from the deck)

- **Open Sans** Light / Regular / Bold, character tracking +10 → website body
  and UI text (`--font-sans`, Open Sans Variable, self-hosted via Fontsource).
- **Montserrat** Bold, character tracking +10 → website labels, eyebrows, and
  buttons (`--font-label`, Montserrat Variable).
- **Fraunces** (website addition, not in the deck): editorial display serif
  for major headings, per the redesign brief's direction. If Cicada prefers a
  strictly brand-faithful all-sans system, swapping `--font-display` to
  Montserrat is a one-line change in `globals.css`.

## Notes

- The heavy source files (12 MB PDF, 6 MB EPS) are intentionally **not**
  committed; only the extracted SVGs are. Keep the originals in brand storage.
- The deck's photography style (real workplace editorial shots) predates the
  redesign brief's art direction; the brief's guidance (no generic stock
  meetings) governs new imagery.
