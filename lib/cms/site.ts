import { sanityClient } from "@/lib/sanity/client";
import {
  mapClientLogoRow,
  mapFounderRow,
  type AboutOverrides,
  type AssessmentsPageOverrides,
  type ClientLogoRow,
  type FounderRow,
  type HomepageOverrides,
  type HowWeHelpOverrides,
  type PracticeOverrideRow,
} from "@/lib/cms/mappers";
import type { ClientRecord, FounderProfileFull } from "@/lib/cms/types";

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
        },
        recognitionHeadline,
        recognitionStatements,
        servicesHeadline,
        servicesCopy,
        finalCtaHeadline,
        finalCtaCopy
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

/** The About Page singleton, or null when absent/unreachable. */
export async function getAboutOverrides(): Promise<AboutOverrides | null> {
  try {
    const row = await sanityClient.fetch<AboutOverrides | null>(
      `*[_type == "aboutPage"][0]{
        heroHeadline,
        heroCopy,
        originHeadline,
        originCopy,
        beliefsHeadline,
        beliefsItems,
        systemHeadline,
        systemCopy,
        principlesHeadline,
        principlesItems,
        clientExperienceHeadline,
        clientExperienceCopy,
        ctaHeadline,
        ctaCopy
      }`,
      {},
      fetchOptions,
    );
    return row ?? null;
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — About page renders seed content.",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/** The How We Help overview singleton, or null when absent/unreachable. */
export async function getHowWeHelpOverrides(): Promise<HowWeHelpOverrides | null> {
  try {
    const row = await sanityClient.fetch<HowWeHelpOverrides | null>(
      `*[_type == "howWeHelpPage"][0]{
        heroHeadline,
        heroCopy,
        systemHeadline,
        systemCopy,
        engagementsHeadline,
        engagementsCopy,
        closingHeadline,
        closingCopy
      }`,
      {},
      fetchOptions,
    );
    return row ?? null;
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — How We Help renders seed content.",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/** The Assessments Page singleton, or null when absent/unreachable. */
export async function getAssessmentsPageOverrides(): Promise<AssessmentsPageOverrides | null> {
  try {
    const row = await sanityClient.fetch<AssessmentsPageOverrides | null>(
      `*[_type == "assessmentsPage"][0]{
        heroHeadline,
        heroCopy,
        gridHeadline,
        aboutHeadline,
        aboutCopy
      }`,
      {},
      fetchOptions,
    );
    return row ?? null;
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — Assessments page renders seed content.",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Studio practice-page documents keyed by practice slug. When editors
 * create two documents for the same practice, the newest edit wins
 * (documents are fetched oldest-first and later rows overwrite earlier
 * keys). Empty on failure.
 */
export async function getPracticeOverrides(): Promise<
  Record<string, PracticeOverrideRow>
> {
  try {
    const rows = await sanityClient.fetch<PracticeOverrideRow[]>(
      `*[_type == "practice" && defined(key)] | order(_updatedAt asc) {
        key,
        headline,
        summary,
        whoFor,
        problems,
        workOn,
        leaveWith,
        supportingCapabilities
      }`,
      {},
      fetchOptions,
    );
    const byKey: Record<string, PracticeOverrideRow> = {};
    for (const row of rows ?? []) {
      if (row.key) byKey[row.key] = row;
    }
    return byKey;
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — practice pages render seed content.",
      error instanceof Error ? error.message : error,
    );
    return {};
  }
}

/** Studio-managed founder profiles, in display order. Empty on failure. */
export async function getSanityFounders(): Promise<FounderProfileFull[]> {
  try {
    const rows = await sanityClient.fetch<FounderRow[]>(
      `*[_type == "founder"] | order(order asc, lower(name) asc) {
        name,
        role,
        bio,
        "photoUrl": photo.asset->url,
        "photoAlt": photo.alt,
        expertise,
        selectedExperience,
        speakingTopics,
        linkedInUrl
      }`,
      {},
      fetchOptions,
    );
    return (rows ?? [])
      .map(mapFounderRow)
      .filter((profile): profile is FounderProfileFull => profile !== null);
  } catch (error) {
    console.error(
      "[cms] Sanity unreachable — founder profiles fall back to seed.",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
