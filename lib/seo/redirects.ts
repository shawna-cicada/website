/**
 * Wix → new-site redirect map (docs/MIGRATION_MAP.md), data-driven so
 * the verified Wix URL inventory can drop in without code changes.
 * Sources marked (verify) in the migration map still need confirmation
 * against the live site's sitemap before DNS cutover.
 */

export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const WIX_REDIRECTS: RedirectRule[] = [
  // Section renames
  { source: "/offerings", destination: "/how-we-help", permanent: true },
  { source: "/offerings/:path*", destination: "/how-we-help", permanent: true },
  // Contact + Meet With Us consolidate into /book
  { source: "/contact", destination: "/book", permanent: true },
  { source: "/meet-with-us", destination: "/book", permanent: true },
  { source: "/meetwithus", destination: "/book", permanent: true },
  // Articles → Insights (index + per-article, slugs preserved)
  { source: "/articles", destination: "/insights", permanent: true },
  { source: "/articles/:slug", destination: "/insights/:slug", permanent: true },
  // Wix blog conventions
  { source: "/blog", destination: "/insights", permanent: true },
  { source: "/post/:slug", destination: "/insights/:slug", permanent: true },
  { source: "/blog/categories/:path*", destination: "/insights", permanent: true },
  { source: "/blog/tags/:path*", destination: "/insights", permanent: true },
];
