/**
 * Content types for CMS-managed content.
 * Phase 2 will back these with Sanity; until then the adapter serves
 * typed seed content from content/seed/. Components must consume these
 * types through lib/cms — never import seed data directly.
 */

export type CTA = {
  label: string;
  href: string;
};

export type ClientLogo = {
  name: string;
  /** Required alt text; enforced by tests. */
  alt: string;
  src: string;
  width: number;
  height: number;
};

export type FrameworkStage = {
  name: string;
  title: string;
  copy: string;
};

export type ServiceCard = {
  title: string;
  copy: string;
  examples: string[];
  href: string;
};

export type AssessmentCard = {
  title: string;
  summary: string;
  audience?: string;
  duration?: string;
  href: string;
  ctaLabel: string;
  featured: boolean;
};

export type EngagementStep = {
  step: string;
  title: string;
  copy: string;
};

export type FounderProfile = {
  name: string;
  role: string;
  bio: string;
  /** Placeholder path until final photography is supplied. */
  imageSrc: string;
  imageAlt: string;
};

export type FeaturedInsight = {
  category: string;
  title: string;
  excerpt: string;
  href: string;
};

export type AssessmentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** CMS-managed assessment record (per WEBSITE_REDESIGN.md's model). */
export type Assessment = {
  title: string;
  slug: string;
  summary: string;
  audience?: string;
  duration?: string;
  /**
   * Env-var name that supplies the external provider URL. Provider links
   * are NEVER hardcoded — unset means the assessment renders disabled.
   */
  externalUrlEnv: string;
  ctaLabel: string;
  image?: AssessmentImage;
  featured: boolean;
  active: boolean;
  opensInNewTab: boolean;
  privacyNote?: string;
  /** utm_campaign value appended to the external URL. */
  trackingCampaign?: string;
};

/** Assessment with its external URL resolved from the environment. */
export type ResolvedAssessment = Assessment & {
  /** Fully-resolved provider URL with UTM params, or null when unconfigured. */
  externalUrl: string | null;
};

export type RelatedInsight = {
  title: string;
  href: string;
};

/** Mirrors the contentType options in sanity/schemas/insight.ts. */
export type InsightKind =
  | "article"
  | "video"
  | "podcast"
  | "guide"
  | "case-insight";

/** Card-level projection of a published insight (index page, sitemap). */
export type InsightSummary = {
  slug: string;
  title: string;
  summary: string;
  kind: InsightKind;
  category: string | null;
  authorName: string | null;
  /** ISO datetime set by the publish action; null only for legacy docs. */
  publishedAt: string | null;
  readingTime: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
};

/**
 * Portable Text block as stored by the insight schema. Typed loosely on
 * purpose: rendering goes through @portabletext/react, which handles
 * unknown shapes gracefully; inline images are pre-resolved to URLs in
 * the GROQ projection.
 */
export type InsightBodyImage = {
  _type: "image";
  _key: string;
  url: string | null;
  alt: string | null;
};

export type InsightBodyBlock = { _type: string; _key: string } & Record<
  string,
  unknown
>;

/** Full projection for /insights/[slug]. */
export type Insight = InsightSummary & {
  body: Array<InsightBodyBlock | InsightBodyImage> | null;
  videoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PracticeArea = {
  slug: string;
  /** Short name used in navigation, cards, and cross-links. */
  name: string;
  /** Business-problem headline that leads the detail page. */
  headline: string;
  /** One-paragraph summary for cards and metadata. */
  summary: string;
  whoFor: string[];
  problems: string[];
  workOn: string[];
  leaveWith: string[];
  /** Names of engagement records that typically apply (must match Engagement.name). */
  formats: string[];
  /**
   * Methods that support the work without leading the positioning
   * (Agile, Lean, product operations, portfolio management, facilitation).
   */
  supportingCapabilities: string[];
  /** Slugs of practices this one most often combines with. */
  relatedPractices: string[];
  relatedInsights: RelatedInsight[];
  seoDescription: string;
};

export type Engagement = {
  name: string;
  summary: string;
  bestFor: string;
  format: string;
  /** Practice slugs this engagement serves. */
  practices: string[];
  /**
   * Who the engagement centers on. "individual" engagements (coaching)
   * get a quiet visual accent to stand apart from the team/org work.
   */
  audience?: "individual" | "team";
};

/** Full founder profile for /about (superset of the homepage card). */
export type FounderProfileFull = {
  name: string;
  role: string;
  /** Short bio. Draft copy is flagged with draftBio until approved. */
  bio: string;
  /** True while the bio is placeholder copy pending editorial review. */
  draftBio: boolean;
  expertise: string[];
  selectedExperience: string[];
  linkedInUrl?: string;
  speakingTopics: string[];
  imageSrc: string;
  imageAlt: string;
};

export type ClientGroup = "startup" | "growth" | "enterprise";

/** CMS-managed client record. Nothing renders publicly until approved. */
export type ClientRecord = {
  name: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  group?: ClientGroup;
  /** Written permission confirmed — gates all public display. */
  approved: boolean;
  /** Optional link to a published case insight. */
  caseInsightHref?: string;
};

export type AboutContent = {
  hero: { headline: string; copy: string };
  origin: { headline: string; paragraphs: string[] };
  beliefs: { headline: string; items: string[] };
  system: { headline: string; copy: string };
  principles: { headline: string; items: string[] };
  clientExperience: { headline: string; copy: string };
  cta: { headline: string; copy: string; primaryCta: CTA; secondaryCta: CTA };
};

export type HowWeHelpContent = {
  eyebrow: string;
  headline: string;
  copy: string;
  /** The connected-system narrative, told in full on the overview. */
  systemNarrative: string[];
  engagementsHeadline: string;
  engagementsCopy: string;
  cta: CTA;
};

export type HomepageContent = {
  hero: {
    eyebrow: string;
    headline: string;
    copy: string;
    primaryCta: CTA;
    secondaryCta: CTA;
  };
  recognition: {
    headline: string;
    statements: string[];
    cta: CTA;
  };
  framework: {
    eyebrow: string;
    headline: string;
    stages: FrameworkStage[];
  };
  services: {
    eyebrow: string;
    headline: string;
    items: ServiceCard[];
    cta: CTA;
  };
  assessments: {
    eyebrow: string;
    headline: string;
    copy: string;
    items: AssessmentCard[];
    cta: CTA;
  };
  engagement: {
    eyebrow: string;
    headline: string;
    steps: EngagementStep[];
    /** The engagement menu, chunked into small labeled groups. */
    engagementGroups: Array<{ label: string; items: string[] }>;
  };
  clients: {
    headline: string;
    logos: ClientLogo[];
  };
  insight: {
    eyebrow: string;
    headline: string;
    featured: FeaturedInsight;
    cta: CTA;
  };
  founders: {
    eyebrow: string;
    headline: string;
    copy: string;
    people: FounderProfile[];
    cta: CTA;
  };
  finalCta: {
    headline: string;
    copy: string;
    primaryCta: CTA;
    secondaryCta: CTA;
    /** One card per bookable conversation type; free flags get a badge. */
    bookingOptions: Array<{
      label: string;
      note: string;
      free?: boolean;
      ctaLabel: string;
      href: string;
    }>;
  };
};
