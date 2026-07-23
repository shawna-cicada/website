import { defineField, defineType } from "sanity";
import { slugify } from "@/lib/editorial/slug";

/**
 * The single content type behind Articles, Videos, Conversations,
 * Guides, and Case insights. Editors choose the kind visually via
 * templates — they never see "schema types". Labels are plain questions;
 * technical fields live in the collapsed "Advanced settings" section
 * and are filled automatically on publish.
 */
export const insight = defineType({
  name: "insight",
  title: "Articles & Videos",
  type: "document",
  groups: [
    { name: "essentials", title: "The basics", default: true },
    { name: "promotion", title: "Promotion" },
    { name: "advanced", title: "Advanced settings" },
  ],
  fields: [
    defineField({
      name: "contentType",
      title: "What kind of piece is this?",
      type: "string",
      group: "essentials",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Video", value: "video" },
          { title: "Conversation or podcast", value: "podcast" },
          { title: "Guide", value: "guide" },
          { title: "Case insight", value: "case-insight" },
        ],
        layout: "radio",
      },
      initialValue: "article",
      validation: (rule) =>
        rule.required().error("Choose what kind of piece this is."),
    }),
    defineField({
      name: "title",
      title: "What is the title?",
      description:
        "The headline readers see. The page address is created from it automatically.",
      type: "string",
      group: "essentials",
      validation: (rule) =>
        rule
          .required()
          .min(5)
          .error("Add a title of at least a few words — it becomes the headline."),
    }),
    defineField({
      name: "summary",
      title: "How would you summarize this?",
      description:
        "One or two sentences saying what a reader will get. Appears in previews, search results, and social shares.",
      type: "text",
      rows: 3,
      group: "essentials",
      validation: (rule) =>
        rule
          .required()
          .min(20)
          .error("Write one or two sentences — this is what people see before they click."),
    }),
    defineField({
      name: "author",
      title: "Who wrote this?",
      type: "reference",
      to: [{ type: "author" }],
      group: "essentials",
      validation: (rule) => rule.required().error("Choose the author."),
    }),
    defineField({
      name: "mainImage",
      title: "What image should appear at the top?",
      type: "image",
      options: { hotspot: true },
      group: "essentials",
      fields: [
        defineField({
          name: "alt",
          title: "Describe the image in a few words",
          description:
            "For people using screen readers — say what the image shows.",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .error("Describe the image in a few words so screen readers can announce it."),
        }),
      ],
      validation: (rule) =>
        rule.required().error("Add the image that appears at the top and in shares."),
    }),
    defineField({
      name: "body",
      title: "The piece itself",
      description:
        "Write here like a document: headings, lists, quotes, links, and images. Lines starting with ✎ are template prompts — replace them with your words.",
      type: "array",
      group: "essentials",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Small heading", value: "h3" },
            { title: "Pull quote", value: "blockquote" },
          ],
        },
        { type: "image", options: { hotspot: true } },
      ],
      hidden: ({ document }) =>
        document?.contentType === "video" || document?.contentType === "podcast",
    }),
    defineField({
      name: "videoUrl",
      title: "Where is the video?",
      description: "Paste a YouTube or Vimeo link.",
      type: "url",
      group: "essentials",
      hidden: ({ document }) =>
        document?.contentType !== "video" && document?.contentType !== "podcast",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https"] })
          .error("Paste a full video link starting with https://"),
    }),
    defineField({
      name: "category",
      title: "Which category fits best?",
      description: "Powers related-content suggestions on the website.",
      type: "reference",
      to: [{ type: "category" }],
      group: "essentials",
      validation: (rule) => rule.required().error("Pick the closest category."),
    }),

    /* ---- Promotion ---- */
    defineField({
      name: "linkedInPostText",
      title: "Suggested LinkedIn post",
      description:
        "Generated for you from the title and summary (use “Copy LinkedIn Post” in the actions menu). Edit it freely — this is what you paste into LinkedIn.",
      type: "text",
      rows: 8,
      group: "promotion",
    }),
    defineField({
      name: "linkedInPostStatus",
      title: "LinkedIn post status",
      type: "string",
      group: "promotion",
      options: {
        list: [
          { title: "Not ready", value: "not-ready" },
          { title: "Ready to post", value: "ready" },
          { title: "Posted", value: "posted" },
        ],
        layout: "radio",
      },
      initialValue: "not-ready",
    }),
    defineField({
      name: "linkedInPostUrl",
      title: "Link to the LinkedIn post",
      description: "After posting on LinkedIn, paste the post's URL here.",
      type: "url",
      group: "promotion",
    }),

    /* ---- Advanced settings (auto-managed; editors can ignore) ---- */
    defineField({
      name: "slug",
      title: "Page address",
      description:
        "Created automatically from the title. Only change it if you have a specific reason.",
      type: "slug",
      group: "advanced",
      options: { source: "title", maxLength: 96, slugify },
    }),
    defineField({
      name: "seoTitle",
      title: "Search result title",
      description: "Filled in automatically from the title if left empty.",
      type: "string",
      group: "advanced",
    }),
    defineField({
      name: "seoDescription",
      title: "Search result description",
      description: "Filled in automatically from the summary if left empty.",
      type: "text",
      rows: 2,
      group: "advanced",
    }),
    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      description: "Calculated automatically.",
      type: "number",
      group: "advanced",
      readOnly: true,
    }),
    defineField({
      name: "workflowStatus",
      title: "Workflow status",
      type: "string",
      group: "advanced",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Needs Review", value: "needs-review" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "scheduledAt",
      title: "Scheduled publish time",
      type: "datetime",
      group: "advanced",
      hidden: ({ document }) => document?.workflowStatus !== "scheduled",
    }),
    defineField({
      name: "publishedAt",
      title: "First published",
      type: "datetime",
      group: "advanced",
      readOnly: true,
    }),
    defineField({
      name: "previewedAt",
      title: "Last previewed",
      type: "datetime",
      group: "advanced",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "workflowStatus",
      media: "mainImage",
    },
  },
});
