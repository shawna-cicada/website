/**
 * Automatic search & sharing defaults. Editors can override in
 * “Advanced settings”, but never need to.
 */

const SITE_URL = "https://www.cicadaagility.com";
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

function truncateAtWord(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trimEnd()}…`;
}

export function seoDefaults(input: { title?: string; summary?: string }): {
  seoTitle: string;
  seoDescription: string;
} {
  return {
    seoTitle: truncateAtWord(input.title ?? "", TITLE_MAX),
    seoDescription: truncateAtWord(input.summary ?? "", DESCRIPTION_MAX),
  };
}

export function canonicalUrl(slug: string): string {
  return `${SITE_URL}/insights/${slug}`;
}
