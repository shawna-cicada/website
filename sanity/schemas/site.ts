import { defineField, defineType } from "sanity";

/**
 * Site-content document types (D-026): editable page content beyond
 * articles. Everything here overrides committed seed content through
 * the D-021 merge model — blank fields fall back to the built-in copy,
 * so a half-filled document can never blank a page.
 */

/** Practice slugs are the merge keys — fixed set, matches lib/cms seed. */
const PRACTICE_KEYS = [
  { title: "Leadership & Executive Teams", value: "leadership-team-effectiveness" },
  { title: "Operating Model & Execution", value: "organizational-effectiveness" },
  { title: "AI & Ways of Working", value: "ai-enablement" },
  { title: "Founder Evolution", value: "founder-growth" },
];

function stringList(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    description,
    type: "array",
    of: [{ type: "string" }],
  });
}

export const practice = defineType({
  name: "practice",
  title: "Practice Pages",
  type: "document",
  description: "Edits the How We Help practice pages.",
  fields: [
    defineField({
      name: "key",
      title: "Which practice page is this?",
      type: "string",
      options: { list: PRACTICE_KEYS, layout: "radio" },
      // Set automatically when a page is opened from the Practice Pages
      // list — locked so a document can't be retargeted at another page.
      readOnly: true,
      validation: (rule) => rule.required().error("Choose the practice page."),
    }),
    defineField({
      name: "headline",
      title: "Problem statement",
      description:
        "The short line under the page title, e.g. “Strategy is clear at the top and blurry everywhere else.” Leave empty to keep the current one.",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Description",
      description:
        "The paragraph under the problem statement. Also appears on the How We Help overview card. Leave empty to keep the current one.",
      type: "text",
      rows: 3,
    }),
    stringList("whoFor", "Who it’s for", "One line per audience. Leave empty to keep the current list."),
    stringList("problems", "Problems we help solve", "One line per problem. Leave empty to keep the current list."),
    stringList("workOn", "What we may work on", "One line per work area (they display numbered). Leave empty to keep the current list."),
    stringList("leaveWith", "What clients leave with", "One line per outcome. Leave empty to keep the current list."),
    stringList("supportingCapabilities", "Supporting capabilities", "Short method tags shown at the bottom. Leave empty to keep the current ones."),
  ],
  preview: {
    select: { key: "key" },
    prepare({ key }) {
      const match = PRACTICE_KEYS.find((item) => item.value === key);
      return { title: match?.title ?? "Choose a practice page" };
    },
  },
});

export const founder = defineType({
  name: "founder",
  title: "Founders & Team",
  type: "document",
  description:
    "People shown on the About page. The first profile you create replaces the built-in placeholder profiles.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().error("Add the person’s name."),
    }),
    defineField({
      name: "role",
      title: "Role",
      description: "e.g. Co-founder",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Describe the photo in a few words",
          description: "Read aloud by screen readers, e.g. “Portrait of Shawna Cullinan”.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Biography",
      description: "The full bio shown on the About page.",
      type: "text",
      rows: 6,
    }),
    stringList("expertise", "Areas of expertise", "Short phrases, one per line."),
    stringList("selectedExperience", "Selected experience", "One line per item."),
    stringList("speakingTopics", "Speaking topics", "One line per topic."),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn profile link",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 10,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
