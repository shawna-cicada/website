import { defineField, defineType } from "sanity";

/** Authors — protected from deletion while referenced (Sanity default). */
export const author = defineType({
  name: "author",
  title: "People",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().error("Add the person's name."),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Short biography",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn profile",
      type: "url",
    }),
  ],
});

export const category = defineType({
  name: "category",
  title: "Categories",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category name",
      type: "string",
      validation: (rule) => rule.required().error("Name the category."),
    }),
    defineField({
      name: "description",
      title: "What belongs here?",
      type: "text",
      rows: 2,
    }),
  ],
});

/** Assessments — mirrors the site's Assessment model (lib/cms/types). */
export const assessment = defineType({
  name: "assessment",
  title: "Assessments",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Assessment name",
      type: "string",
      validation: (rule) => rule.required().error("Name the assessment."),
    }),
    defineField({
      name: "summary",
      title: "What does it tell people?",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().error("Describe what the assessment reveals."),
    }),
    defineField({ name: "audience", title: "Who is it for?", type: "string" }),
    defineField({
      name: "duration",
      title: "How long does it take?",
      type: "string",
    }),
    defineField({
      name: "externalUrl",
      title: "Assessment link",
      description:
        "The full link to the external assessment. Leave empty until the provider link is ready — the website shows it as “available soon”.",
      type: "url",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button text",
      type: "string",
      initialValue: "Start the assessment",
    }),
    defineField({
      name: "featured",
      title: "Feature this assessment?",
      description: "Only one assessment should be featured at a time.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Show on the website?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy note",
      description: "Shown before people leave for the external platform.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", active: "active", featured: "featured" },
    prepare: ({ title, active, featured }) => ({
      title,
      subtitle: [featured ? "Featured" : null, active ? "Live" : "Hidden"]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});

/** Client logos — permission-gated before anything appears publicly. */
export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client Logos",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required().error("Add the client's name."),
    }),
    defineField({
      name: "logo",
      title: "Logo (light backgrounds)",
      type: "image",
      fields: [
        defineField({
          name: "alt",
          title: "Describe the logo in a few words",
          type: "string",
          validation: (rule) =>
            rule.required().error("e.g. “Acme Corp logo” — screen readers announce this."),
        }),
      ],
      validation: (rule) => rule.required().error("Upload the logo image."),
    }),
    defineField({
      name: "logoDark",
      title: "Logo (dark backgrounds)",
      description: "Optional version for dark sections.",
      type: "image",
    }),
    defineField({
      name: "permissionConfirmed",
      title: "Do we have written permission to show this logo?",
      description:
        "The logo will not appear on the website until this is checked.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Show on the website?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "group",
      title: "Company size group",
      type: "string",
      options: {
        list: ["Startup", "Growth company", "Enterprise"],
      },
    }),
  ],
});

/** Homepage settings — a single document, never a list. */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage Content",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Homepage headline",
      type: "string",
    }),
    defineField({
      name: "heroCopy",
      title: "Text under the headline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featuredInsight",
      title: "Which article is featured on the homepage?",
      type: "reference",
      to: [{ type: "insight" }],
    }),
    defineField({
      name: "featuredAssessment",
      title: "Which assessment is featured on the homepage?",
      type: "reference",
      to: [{ type: "assessment" }],
    }),
  ],
});

