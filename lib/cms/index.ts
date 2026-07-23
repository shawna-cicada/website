import type { HomepageContent } from "@/lib/cms/types";
import { homepageContent } from "@/content/seed/homepage";

/**
 * Content adapter (D-004): all page content flows through this interface.
 * Currently fixture-backed from content/seed/; Phase 2 swaps the
 * implementation for Sanity without touching components.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  return homepageContent;
}
