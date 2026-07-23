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
    summary: "Name your stage — and what it's asking of you.",
    audience: "Founders and CEOs",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_GROWTH_STAGE",
    ctaLabel: "Start the assessment",
    featured: true,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Built by Cicada Agility, hosted on a secure survey platform. We receive your answers and contact details, and use them to prepare your results and follow up with you.",
    trackingCampaign: "growth-stage-assessment",
  },
  {
    title: "Founder Growth Assessment",
    slug: "founder-growth",
    summary: "Where your role must evolve next — and what to hand off.",
    audience: "Founders",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_FOUNDER_GROWTH",
    ctaLabel: "Start the assessment",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Your answers and contact details come to Cicada Agility — we use them to share your results and follow up.",
    trackingCampaign: "founder-growth-assessment",
  },
  {
    title: "Leadership Team Alignment Check",
    slug: "leadership-alignment",
    summary: "Aligned in principle — but in practice?",
    audience: "Executive teams",
    duration: "About 15 minutes",
    externalUrlEnv: "ASSESSMENT_URL_LEADERSHIP_ALIGNMENT",
    ctaLabel: "Start the check",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Your answers and contact details come to Cicada Agility — we use them to share your results and follow up.",
    trackingCampaign: "leadership-alignment-check",
  },
  {
    title: "AI Readiness Assessment",
    slug: "ai-readiness",
    summary: "How ready are your teams, really?",
    audience: "Leadership teams",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_AI_READINESS",
    ctaLabel: "Start the assessment",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Your answers and contact details come to Cicada Agility — we use them to share your results and follow up.",
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
