import { createClient } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/sanity/config";

/**
 * Read-only client for PUBLISHED content. No token: it can only see
 * what the dataset exposes publicly, so drafts and private documents
 * are unreachable by construction. CDN-cached; pages layer Next's
 * time-based revalidation on top.
 */
export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published",
});
