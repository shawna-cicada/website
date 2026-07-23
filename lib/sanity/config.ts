/**
 * Sanity project coordinates (D-020). The project ID and dataset name
 * are public identifiers — they appear in every request the published
 * site makes — so the live Cicada Agility project is committed as the
 * default. The env vars remain as overrides for forks or a future
 * staging dataset. Access control lives in Sanity sign-in + roles,
 * never in the secrecy of these values.
 */
export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "66n8qkam";

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export const sanityApiVersion = "2026-07-01";
