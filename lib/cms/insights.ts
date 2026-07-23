import { sanityClient } from "@/lib/sanity/client";
import type { Insight, InsightSummary } from "@/lib/cms/types";

/**
 * Published-insight reads (Phase 6). Every function degrades to an
 * empty result when Sanity is unreachable or the dataset is empty, so
 * the site always builds and /insights renders its honest empty state
 * instead of crashing. Only documents an editor moved to
 * workflowStatus == "published" are ever returned — drafts, scheduled,
 * and archived pieces stay invisible.
 */

const PUBLISHED_FILTER = `_type == "insight" && workflowStatus == "published" && defined(slug.current)`;

const SUMMARY_PROJECTION = `{
  "slug": slug.current,
  title,
  summary,
  "kind": contentType,
  "category": category->title,
  "authorName": author->name,
  publishedAt,
  readingTime,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "imageWidth": mainImage.asset->metadata.dimensions.width,
  "imageHeight": mainImage.asset->metadata.dimensions.height
}`;

/** Inline body images are resolved to plain URLs here, not client-side. */
const DETAIL_PROJECTION = `{
  "slug": slug.current,
  title,
  summary,
  "kind": contentType,
  "category": category->title,
  "authorName": author->name,
  publishedAt,
  readingTime,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "imageWidth": mainImage.asset->metadata.dimensions.width,
  "imageHeight": mainImage.asset->metadata.dimensions.height,
  body[]{
    ...,
    _type == "image" => { _type, _key, "url": asset->url, "alt": alt }
  },
  videoUrl,
  seoTitle,
  seoDescription
}`;

/** How long a published page may serve before re-checking Sanity. */
export const INSIGHTS_REVALIDATE_SECONDS = 300;

const fetchOptions = {
  next: { revalidate: INSIGHTS_REVALIDATE_SECONDS },
};

export async function getPublishedInsights(): Promise<InsightSummary[]> {
  try {
    const rows = await sanityClient.fetch<InsightSummary[]>(
      `*[${PUBLISHED_FILTER}] | order(coalesce(publishedAt, _updatedAt) desc) ${SUMMARY_PROJECTION}`,
      {},
      fetchOptions,
    );
    return rows ?? [];
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — /insights renders its empty state.",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getInsight(slug: string): Promise<Insight | null> {
  try {
    const row = await sanityClient.fetch<Insight | null>(
      `*[${PUBLISHED_FILTER} && slug.current == $slug][0] ${DETAIL_PROJECTION}`,
      { slug },
      fetchOptions,
    );
    return row ?? null;
  } catch (error) {
    console.error(
      `[cms] Sanity unreachable — /insights/${slug} renders not-found.`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
