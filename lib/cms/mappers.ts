import type {
  ClientGroup,
  ClientRecord,
  FeaturedInsight,
  HomepageContent,
} from "@/lib/cms/types";

/**
 * Pure mapping/merge logic between Sanity site-content documents and
 * the adapter's types (D-021). Kept free of network imports so it can
 * be unit-tested exhaustively; lib/cms/site.ts does the fetching.
 */

export type ClientLogoRow = {
  name?: string | null;
  alt?: string | null;
  src?: string | null;
  width?: number | null;
  height?: number | null;
  group?: string | null;
  approved?: boolean | null;
};

/** Studio dropdown labels → adapter group keys. */
const GROUP_KEYS: Record<string, ClientGroup> = {
  Startup: "startup",
  "Growth company": "growth",
  Enterprise: "enterprise",
};

/** Logos render at this height in the wall/marquee; width follows. */
const LOGO_DISPLAY_HEIGHT = 48;

/**
 * A Studio-managed logo becomes a ClientRecord — or null when required
 * pieces (name, alt text, image, dimensions) are missing, so incomplete
 * documents can never break the public site. `approved` carries the
 * editor's written-permission checkbox; the display gate stays in
 * getApprovedClients, exactly as for seed records.
 */
export function mapClientLogoRow(row: ClientLogoRow): ClientRecord | null {
  if (!row.name || !row.alt || !row.src || !row.width || !row.height) {
    return null;
  }
  const group = row.group ? GROUP_KEYS[row.group] : undefined;
  return {
    name: row.name,
    alt: row.alt,
    // Ask the Sanity CDN for a right-sized, modern-format asset (2x for
    // crisp rendering) instead of shipping the original upload.
    src: `${row.src}?h=${LOGO_DISPLAY_HEIGHT * 2}&fit=max&auto=format`,
    width: Math.max(
      1,
      Math.round(row.width * (LOGO_DISPLAY_HEIGHT / row.height)),
    ),
    height: LOGO_DISPLAY_HEIGHT,
    ...(group ? { group } : {}),
    approved: row.approved === true,
  };
}

export type HomepageOverrides = {
  heroHeadline?: string | null;
  heroCopy?: string | null;
  featuredInsight?: {
    slug?: string | null;
    title?: string | null;
    summary?: string | null;
    category?: string | null;
    workflowStatus?: string | null;
  } | null;
};

/**
 * Layer the Studio's Homepage Content document over the seed content.
 * Blank/missing fields fall through to the seed, so a half-filled
 * document can only ever improve the page, never blank it. The featured
 * insight is honored only when the referenced piece is published.
 */
export function mergeHomepageContent(
  seed: HomepageContent,
  overrides: HomepageOverrides | null,
): HomepageContent {
  if (!overrides) return seed;

  const headline = overrides.heroHeadline?.trim();
  const copy = overrides.heroCopy?.trim();

  const ref = overrides.featuredInsight;
  const featured: FeaturedInsight | null =
    ref &&
    ref.workflowStatus === "published" &&
    ref.slug &&
    ref.title &&
    ref.summary
      ? {
          category: ref.category || seed.insight.featured.category,
          title: ref.title,
          excerpt: ref.summary,
          href: `/insights/${ref.slug}`,
        }
      : null;

  return {
    ...seed,
    hero: {
      ...seed.hero,
      ...(headline ? { headline } : {}),
      ...(copy ? { copy } : {}),
    },
    insight: featured ? { ...seed.insight, featured } : seed.insight,
  };
}
