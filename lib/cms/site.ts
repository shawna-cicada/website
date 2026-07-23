import { sanityClient } from "@/lib/sanity/client";
import {
  mapClientLogoRow,
  type ClientLogoRow,
  type HomepageOverrides,
} from "@/lib/cms/mappers";
import type { ClientRecord } from "@/lib/cms/types";

/**
 * Sanity-backed site content (D-021): editor-managed documents override
 * the committed seed content; every fetch degrades to "no override" when
 * Sanity is unreachable, so the site always renders complete pages.
 */

const fetchOptions = { next: { revalidate: 300 } };

/** Studio-managed client logos, mapped and validated. Empty on failure. */
export async function getSanityClientRecords(): Promise<ClientRecord[]> {
  try {
    const rows = await sanityClient.fetch<ClientLogoRow[]>(
      `*[_type == "clientLogo" && active == true] | order(lower(name) asc) {
        name,
        "alt": logo.alt,
        "src": logo.asset->url,
        "width": logo.asset->metadata.dimensions.width,
        "height": logo.asset->metadata.dimensions.height,
        group,
        "approved": permissionConfirmed == true
      }`,
      {},
      fetchOptions,
    );
    return (rows ?? [])
      .map(mapClientLogoRow)
      .filter((record): record is ClientRecord => record !== null);
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — client logos fall back to seed records.",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

/** The Homepage Content singleton, or null when absent/unreachable. */
export async function getHomepageOverrides(): Promise<HomepageOverrides | null> {
  try {
    const row = await sanityClient.fetch<HomepageOverrides | null>(
      `*[_type == "homepage"][0]{
        heroHeadline,
        heroCopy,
        featuredInsight->{
          "slug": slug.current,
          title,
          summary,
          "category": category->title,
          workflowStatus
        }
      }`,
      {},
      fetchOptions,
    );
    return row ?? null;
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — homepage renders seed content.",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
