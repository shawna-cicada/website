import type { Template } from "sanity";
import { EDITORIAL_TEMPLATES } from "@/lib/editorial/templates";
import { howWeHelpContent, practiceAreas } from "@/content/seed/practices";
import { aboutContent, founders } from "@/content/seed/about";
import { homepageContent } from "@/content/seed/homepage";
import { assessmentsPageContent } from "@/content/seed/assessments";

/**
 * Initial-value templates: the visual "start from a template" choices in
 * the create flow. Each seeds the draft with the outline + writing
 * prompts from lib/editorial/templates — and the pre-publish checklist
 * refuses to publish while any ✎ prompt remains, so scaffolding can
 * never go live.
 */
export const cicadaTemplates: Template[] = EDITORIAL_TEMPLATES.map(
  (template) => ({
    id: `insight-${template.id}`,
    title: template.title,
    description: template.description,
    schemaType: "insight",
    value: {
      contentType: template.contentType,
      workflowStatus: "draft",
      body: template.outline.map((block, index) => ({
        ...block,
        _key: `${template.id}-${index}`,
        children: block.children?.map((child, childIndex) => ({
          ...child,
          _key: `${template.id}-${index}-${childIndex}`,
        })),
      })),
    },
  }),
);

/**
 * Practice-page templates: one per How We Help page, pre-filled with the
 * committed live copy so editors modify what's on the site instead of
 * starting from a blank form. The desk structure opens each page's
 * fixed document through its matching template.
 */
export const practicePageTemplates: Template[] = practiceAreas.map(
  (practice) => ({
    id: `practice-${practice.slug}`,
    title: practice.name,
    description: "Pre-filled with the current live page content.",
    schemaType: "practice",
    value: {
      key: practice.slug,
      headline: practice.headline,
      summary: practice.summary,
      whoFor: [...practice.whoFor],
      problems: [...practice.problems],
      workOn: [...practice.workOn],
      leaveWith: [...practice.leaveWith],
      supportingCapabilities: [...practice.supportingCapabilities],
    },
  }),
);

/**
 * Homepage template: pre-fills a fresh Homepage Content document with
 * the committed live copy. (An already-created document keeps its own
 * values — its blank fields still mean "keep the current wording".)
 */
export const homepageTemplate: Template = {
  id: "homepage-content",
  title: "Homepage Content",
  description: "Pre-filled with the current live homepage content.",
  schemaType: "homepage",
  value: {
    heroHeadline: homepageContent.hero.headline,
    heroCopy: homepageContent.hero.copy,
    recognitionHeadline: homepageContent.recognition.headline,
    recognitionStatements: [...homepageContent.recognition.statements],
    servicesHeadline: homepageContent.services.headline,
    servicesCopy: homepageContent.services.copy,
    finalCtaHeadline: homepageContent.finalCta.headline,
    finalCtaCopy: homepageContent.finalCta.copy,
  },
};

/** How We Help overview template: pre-filled with the committed copy. */
export const howWeHelpPageTemplate: Template = {
  id: "how-we-help-page",
  title: "How We Help (overview)",
  description: "Pre-filled with the current live page content.",
  schemaType: "howWeHelpPage",
  value: {
    heroHeadline: howWeHelpContent.headline,
    heroCopy: howWeHelpContent.copy,
    systemHeadline: howWeHelpContent.systemHeadline,
    systemCopy: howWeHelpContent.systemNarrative.join("\n\n"),
    engagementsHeadline: howWeHelpContent.engagementsHeadline,
    engagementsCopy: howWeHelpContent.engagementsCopy,
    closingHeadline: howWeHelpContent.closing.headline,
    closingCopy: howWeHelpContent.closing.copy,
  },
};

/** Assessments hub page template: pre-filled with the committed copy. */
export const assessmentsPageTemplate: Template = {
  id: "assessments-page",
  title: "Assessments Page",
  description: "Pre-filled with the current live page content.",
  schemaType: "assessmentsPage",
  value: {
    heroHeadline: assessmentsPageContent.hero.headline,
    heroCopy: assessmentsPageContent.hero.copy,
    gridHeadline: assessmentsPageContent.gridHeadline,
    aboutHeadline: assessmentsPageContent.aboutHeadline,
    aboutCopy: assessmentsPageContent.aboutCopy,
  },
};

/** About Page template: pre-filled with the committed live copy. */
export const aboutPageTemplate: Template = {
  id: "about-page",
  title: "About Page",
  description: "Pre-filled with the current live About page content.",
  schemaType: "aboutPage",
  value: {
    heroHeadline: aboutContent.hero.headline,
    heroCopy: aboutContent.hero.copy,
    originHeadline: aboutContent.origin.headline,
    originCopy: aboutContent.origin.paragraphs.join("\n\n"),
    beliefsHeadline: aboutContent.beliefs.headline,
    beliefsItems: aboutContent.beliefs.items.join("\n"),
    systemHeadline: aboutContent.system.headline,
    systemCopy: aboutContent.system.copy,
    principlesHeadline: aboutContent.principles.headline,
    principlesItems: aboutContent.principles.items.join("\n"),
    clientExperienceHeadline: aboutContent.clientExperience.headline,
    clientExperienceCopy: aboutContent.clientExperience.copy,
    ctaHeadline: aboutContent.cta.headline,
    ctaCopy: aboutContent.cta.copy,
  },
};

/**
 * Founder starter templates: create a profile pre-filled with the
 * current About-page content (photo still needs uploading), so nobody
 * retypes a bio from scratch.
 */
export const founderStarterTemplates: Template[] = founders.map(
  (profile, index) => ({
    id: `founder-${profile.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    title: `Start from ${profile.name}'s current profile`,
    description: "Pre-filled with the current About page content.",
    schemaType: "founder",
    value: {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      expertise: [...profile.expertise],
      selectedExperience: [...profile.selectedExperience],
      speakingTopics: [...profile.speakingTopics],
      order: (index + 1) * 10,
    },
  }),
);
