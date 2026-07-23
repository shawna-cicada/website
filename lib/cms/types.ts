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
    engagements: string[];
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
  };
};
