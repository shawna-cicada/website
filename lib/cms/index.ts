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

/**
 * Content adapter (D-004): all page content flows through this interface.
 * Currently fixture-backed from content/seed/; Phase 2 swaps the
 * implementation for Sanity without touching components.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  return homepageContent;
}

export async function getHowWeHelpContent(): Promise<HowWeHelpContent> {
  return howWeHelpContent;
}

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  return practiceAreas;
}

export async function getPracticeArea(
  slug: string,
): Promise<PracticeArea | undefined> {
  return practiceAreas.find((practice) => practice.slug === slug);
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
  const { aboutContent } = await import("@/content/seed/about");
  return aboutContent;
}

export async function getFounders() {
  const { founders } = await import("@/content/seed/about");
  return founders;
}

export async function getClientRecords() {
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
