import type {
  Engagement,
  HomepageContent,
  HowWeHelpContent,
  PracticeArea,
} from "@/lib/cms/types";
import { homepageContent } from "@/content/seed/homepage";
import {
  engagements,
  howWeHelpContent,
  practiceAreas,
} from "@/content/seed/practices";

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
