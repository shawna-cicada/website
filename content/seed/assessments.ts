import type { Assessment, AssessmentsPageContent } from "@/lib/cms/types";

/**
 * Assessment seed records — served through the CMS adapter (lib/cms).
 * External provider URLs come ONLY from environment variables (see
 * .env.example); records with an unset URL render as gracefully disabled.
 * No filters on the hub until more than six records are active.
 */

/** The hub page's own copy (Studio-overridable per D-026). */
export const assessmentsPageContent: AssessmentsPageContent = {
  hero: {
    headline: "Find out what your company has outgrown.",
    copy: "Ten minutes to name your stage, the friction beneath it, and what needs to evolve next. Your answers stay with the assessment provider unless you choose to share them.",
  },
  gridHeadline: "More ways to locate the friction",
  aboutHeadline: "About our assessments",
  aboutCopy:
    "These assessments were built by Cicada Agility and are proprietary to our practice; they run on a secure external survey platform. When you complete one, your answers and contact details come to us. We use them to prepare your results, follow up with you about what they show, and stay in touch about work that may be relevant. Prefer to skip the form? Book a conversation instead.",
};
export const assessments: Assessment[] = [
  {
    title: "Growth Stage Assessment",
    slug: "growth-stage",
    summary: "Name your stage, and what it's asking of you.",
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
    summary: "Where your role must evolve next, and what to hand off.",
    audience: "Founders",
    duration: "About 10 minutes",
    externalUrlEnv: "ASSESSMENT_URL_FOUNDER_GROWTH",
    ctaLabel: "Start the assessment",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Your answers and contact details come to Cicada Agility. We use them to share your results and follow up.",
    trackingCampaign: "founder-growth-assessment",
  },
  {
    title: "Leadership Team Alignment Check",
    slug: "leadership-alignment",
    summary: "Aligned in principle, but in practice?",
    audience: "Executive teams",
    duration: "About 15 minutes",
    externalUrlEnv: "ASSESSMENT_URL_LEADERSHIP_ALIGNMENT",
    ctaLabel: "Start the check",
    featured: false,
    active: true,
    opensInNewTab: true,
    privacyNote:
      "Your answers and contact details come to Cicada Agility. We use them to share your results and follow up.",
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
      "Your answers and contact details come to Cicada Agility. We use them to share your results and follow up.",
    trackingCampaign: "ai-readiness-assessment",
  },
  {
    // Inactive example: proves the hub's active filtering; not rendered.
    title: "Organizational Effectiveness Scan",
    slug: "org-effectiveness-scan",
    summary:
      "A deeper organizational scan, in development. Not yet available.",
    externalUrlEnv: "ASSESSMENT_URL_ORG_EFFECTIVENESS",
    ctaLabel: "Start the scan",
    featured: false,
    active: false,
    opensInNewTab: true,
    trackingCampaign: "org-effectiveness-scan",
  },
];
