import type { Assessment } from "@/lib/cms/types";

/**
 * Assessment seed records — served through the CMS adapter (lib/cms).
 * External provider URLs come ONLY from environment variables (see
 * .env.example); records with an unset URL render as gracefully disabled.
 * No filters on the hub until more than six records are active.
 */
export const assessments: Assessment[] = [
  {
    title: "Growth Stage Assessment",
    slug: "growth-stage",
    summary:
      "Name the stage your company is in, the friction beneath the symptoms, and what leadership must evolve next.",
    audience: "Founders and CEOs",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_GROWTH_STAGE",
    ctaLabel: "Start the assessment",
    featured: true,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "This assessment runs on an external platform. Your answers are collected by that provider under its own privacy policy; Cicada Agility does not receive them unless you choose to share your results.",
    trackingCampaign: "growth-stage-assessment",
  },
  {
    title: "Founder Growth Assessment",
    slug: "founder-growth",
    summary:
      "See where your role must evolve as the company scales — and what to hand off next.",
    audience: "Founders",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_FOUNDER_GROWTH",
    ctaLabel: "Start the assessment",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "This assessment runs on an external platform under its own privacy policy.",
    trackingCampaign: "founder-growth-assessment",
  },
  {
    title: "Leadership Team Alignment Check",
    slug: "leadership-alignment",
    summary:
      "Find out whether your leadership team is aligned in practice, not just in principle.",
    audience: "Executive teams",
    duration: "About 15 minutes",
    externalUrlEnv: "ASSESSMENT_URL_LEADERSHIP_ALIGNMENT",
    ctaLabel: "Start the check",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "This assessment runs on an external platform under its own privacy policy.",
    trackingCampaign: "leadership-alignment-check",
  },
  {
    title: "AI Readiness Assessment",
    slug: "ai-readiness",
    summary:
      "Understand how ready your teams are to adopt AI consistently, responsibly, and to real effect.",
    audience: "Leadership teams",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_AI_READINESS",
    ctaLabel: "Start the assessment",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "This assessment runs on an external platform under its own privacy policy.",
    trackingCampaign: "ai-readiness-assessment",
  },
  {
    // Inactive example: proves the hub's active filtering; not rendered.
    title: "Organizational Effectiveness Scan",
    slug: "org-effectiveness-scan",
    summary:
      "A deeper organizational scan, in development — not yet available.",
    externalUrlEnv: "ASSESSMENT_URL_ORG_EFFECTIVENESS",
    ctaLabel: "Start the scan",
    featured: false,
    active: false,
    opensInNewTab: true,
    trackingCampaign: "org-effectiveness-scan",
  },
];
