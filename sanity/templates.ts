import type { Template } from "sanity";
import { EDITORIAL_TEMPLATES } from "@/lib/editorial/templates";
import { practiceAreas } from "@/content/seed/practices";
import { founders } from "@/content/seed/about";

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
