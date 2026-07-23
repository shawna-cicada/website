/**
 * Preview and live links for editorial documents.
 * Draft previews use the site's preview route with a shared secret
 * (configured via env; the Studio never exposes the secret itself).
 */

const SITE_URL = "https://www.cicadaagility.com";

export function liveUrl(slug: string): string {
  return `${SITE_URL}/insights/${slug}`;
}

export function previewUrl(
  slug: string,
  options: { baseUrl?: string; mode?: "desktop" | "mobile" } = {},
): string {
  const base = options.baseUrl ?? SITE_URL;
  const url = new URL(`/insights/${slug}`, base);
  url.searchParams.set("preview", "true");
  if (options.mode === "mobile") url.searchParams.set("viewport", "mobile");
  return url.toString();
}
