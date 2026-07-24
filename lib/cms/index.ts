import type {
  Assessment,
  Engagement,
  HomepageContent,
  HowWeHelpContent,
  PracticeArea,
  ResolvedAssessment,
} from "@/lib/cms/types";
import { homepageContent } from "@/content/seed/homepage";
import {
  engagements,
  howWeHelpContent,
  practiceAreas,
} from "@/content/seed/practices";
import { assessments } from "@/content/seed/assessments";
import { withUtm } from "@/lib/analytics/utm";

export {
  getInsight,
  getPublishedInsights,
  INSIGHTS_REVALIDATE_SECONDS,
} from "@/lib/cms/insights";
import {
  getAboutOverrides,
  getHomepageOverrides,
  getPracticeOverrides,
  getSanityClientRecords,
  getSanityFounders,
} from "@/lib/cms/site";
import {
  adoptFounderPhotos,
  mergeAboutContent,
  mergeHomepageContent,
  mergePractice,
  syncServiceCards,
} from "@/lib/cms/mappers";

/**
 * Content adapter (D-004): all page content flows through this interface.
 * Currently fixture-backed from content/seed/; Phase 2 swaps the
 * implementation for Sanity without touching components.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  // Studio's "Homepage Content" document overrides the seed (D-021);
  // blank fields and CMS outages fall through to the committed copy.
  const [overrides, cmsFounders, practices] = await Promise.all([
    getHomepageOverrides(),
    getSanityFounders(),
    getPracticeAreas(),
  ]);
  const merged = mergeHomepageContent(homepageContent, overrides);
  return {
    ...merged,
    services: {
      ...merged.services,
      // Practice cards mirror the (possibly Studio-edited) practice
      // pages, so a summary edited once shows up in both places.
      items: syncServiceCards(merged.services.items, practices),
    },
    founders: {
      ...merged.founders,
      people: adoptFounderPhotos(merged.founders.people, cmsFounders),
    },
  };
}

export async function getHowWeHelpContent(): Promise<HowWeHelpContent> {
  return howWeHelpContent;
}

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  // Studio "Practice Pages" documents override seed copy field by field
  // (D-026); names and slugs stay code-managed for navigation and URLs.
  const overrides = await getPracticeOverrides();
  return practiceAreas.map((practice) =>
    mergePractice(practice, overrides[practice.slug]),
  );
}

export async function getPracticeArea(
  slug: string,
): Promise<PracticeArea | undefined> {
  const seed = practiceAreas.find((practice) => practice.slug === slug);
  if (!seed) return undefined;
  const overrides = await getPracticeOverrides();
  return mergePractice(seed, overrides[slug]);
}

export async function getEngagements(): Promise<Engagement[]> {
  return engagements;
}

/** Engagements that serve a given practice, in seed order. */
export async function getEngagementsForPractice(
  slug: string,
): Promise<Engagement[]> {
  return engagements.filter((engagement) =>
    engagement.practices.includes(slug),
  );
}

export async function getAboutContent() {
  // Studio's "About Page" document overrides the seed (D-026); blank
  // fields and CMS outages fall through to the committed copy.
  const { aboutContent } = await import("@/content/seed/about");
  return mergeAboutContent(aboutContent, await getAboutOverrides());
}

export async function getFounders() {
  // The first Studio-created founder profile replaces the committed
  // placeholder profiles wholesale (same model as client logos); until
  // then — or if Sanity is unreachable — the seed profiles render.
  const cmsFounders = await getSanityFounders();
  if (cmsFounders.length > 0) return cmsFounders;
  const { founders } = await import("@/content/seed/about");
  return founders;
}

export async function getClientRecords() {
  // Studio-managed logos take over the moment the first one exists
  // (D-021); until then — or if Sanity is unreachable — the committed
  // seed records (unapproved placeholders) keep the demo wall working.
  const cmsRecords = await getSanityClientRecords();
  if (cmsRecords.length > 0) return cmsRecords;
  const { clientRecords } = await import("@/content/seed/clients");
  return clientRecords;
}

/** Approved clients only — the ONLY records /clients may render. */
export async function getApprovedClients() {
  return (await getClientRecords()).filter((client) => client.approved);
}

/**
 * Resolve an assessment's external URL from its environment variable and
 * append UTM parameters. Unset env → null → the UI renders a graceful
 * disabled state. Provider links are never hardcoded.
 */
function resolveAssessment(assessment: Assessment): ResolvedAssessment {
  const raw = process.env[assessment.externalUrlEnv]?.trim();
  const externalUrl = raw
    ? withUtm(raw, { campaign: assessment.trackingCampaign })
    : null;
  return { ...assessment, externalUrl };
}

export async function getAssessments(): Promise<ResolvedAssessment[]> {
  return assessments.map(resolveAssessment);
}

/** Active assessments only — what the hub renders. */
export async function getActiveAssessments(): Promise<ResolvedAssessment[]> {
  return (await getAssessments()).filter((assessment) => assessment.active);
}
