import type { Block, ContentType } from "@/lib/editorial/types";

/**
 * Reusable starting templates. Each provides a content outline with
 * writing prompts — marked with the ✎ glyph — that MUST be replaced
 * before publishing (enforced by the pre-publish checklist), so template
 * scaffolding can never reach the live site.
 */

export const PROMPT_MARKER = "✎ ";

function heading(text: string): Block {
  return {
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text }],
  };
}

function prompt(text: string): Block {
  return {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text: `${PROMPT_MARKER}${text}` }],
  };
}

export type EditorialTemplate = {
  id: string;
  title: string;
  contentType: ContentType;
  description: string;
  outline: Block[];
};

export const EDITORIAL_TEMPLATES: EditorialTemplate[] = [
  {
    id: "leadership-insight",
    title: "Leadership Insight",
    contentType: "article",
    description:
      "A pattern you keep seeing in leadership teams, and what to do about it.",
    outline: [
      heading("The situation"),
      prompt("Describe the situation a leadership team finds itself in. Keep it concrete: what does Monday morning look like?"),
      heading("What leaders often assume"),
      prompt("What is the common (reasonable but wrong) explanation leaders reach for?"),
      heading("What is actually happening"),
      prompt("Name the underlying dynamic. What has the company outgrown?"),
      heading("What to try"),
      prompt("Offer two or three practical moves a team could make this quarter."),
      heading("Closing reflection"),
      prompt("End with a question the reader can take to their own team."),
    ],
  },
  {
    id: "founder-lesson",
    title: "Founder Lesson",
    contentType: "article",
    description: "A growth-stage challenge founders face, and what must evolve.",
    outline: [
      heading("The growth-stage challenge"),
      prompt("Describe the moment a founder hits this challenge. What are the symptoms?"),
      heading("Why the old approach stops working"),
      prompt("What served the company well before, and why does it now hold things back?"),
      heading("What must evolve"),
      prompt("What does the founder, or the company around them, need to do differently?"),
      heading("Questions for founders"),
      prompt("List three or four honest questions a founder can ask themselves this week."),
    ],
  },
  {
    id: "practical-guide",
    title: "Practical Guide",
    contentType: "guide",
    description: "A step-by-step guide to one specific improvement.",
    outline: [
      heading("The problem"),
      prompt("What specific, recognizable problem does this guide solve?"),
      heading("What good looks like"),
      prompt("Describe the end state so readers know what they are aiming for."),
      heading("Steps to take"),
      prompt("Lay out the steps in order. Keep each one small enough to actually do."),
      heading("Common mistakes"),
      prompt("What goes wrong when teams try this? How can readers avoid it?"),
      heading("Next step"),
      prompt("Offer one clear next action: a download, an assessment, or a conversation."),
    ],
  },
  {
    id: "video-post",
    title: "Video Post",
    contentType: "video",
    description: "A video or recorded conversation with context and takeaways.",
    outline: [
      heading("Introduction"),
      prompt("In two or three sentences: what is this video about and why does it matter now?"),
      heading("Key takeaways"),
      prompt("List the three most useful points a busy viewer should not miss."),
      heading("Summary"),
      prompt("Summarize the discussion for people who prefer reading, or paste a cleaned-up transcript."),
      heading("Related resource"),
      prompt("Point to a related article, assessment, or conversation."),
    ],
  },
  {
    id: "case-insight",
    title: "Client or Case Insight",
    contentType: "case-insight",
    description:
      "A real situation (anonymized as needed) and what other leaders can learn.",
    outline: [
      heading("Context"),
      prompt("Set the scene: company stage, situation, and what was at stake. Anonymize as agreed with the client."),
      heading("Challenge"),
      prompt("What was actually in the way? Name the friction beneath the symptoms."),
      heading("Approach"),
      prompt("What did we do together, and why that order?"),
      heading("What changed"),
      prompt("Describe the observable difference afterward: behaviors, decisions, outcomes."),
      heading("Lessons for other leaders"),
      prompt("What should a reader in a similar position take away?"),
    ],
  },
];

export function getTemplate(id: string): EditorialTemplate | undefined {
  return EDITORIAL_TEMPLATES.find((template) => template.id === id);
}

/** Create a fresh draft document from a template. */
export function draftFromTemplate(id: string): {
  contentType: ContentType;
  body: Block[];
  status: "draft";
} | undefined {
  const template = getTemplate(id);
  if (!template) return undefined;
  return {
    contentType: template.contentType,
    // Deep copy so edits never mutate the template definition.
    body: template.outline.map((block) => ({
      ...block,
      children: block.children?.map((child) => ({ ...child })),
    })),
    status: "draft",
  };
}

/** True while any template writing prompt remains in the body. */
export function hasUnresolvedPrompts(body: Block[] | undefined): boolean {
  return (body ?? []).some((block) =>
    (block.children ?? []).some((child) =>
      (child.text ?? "").includes(PROMPT_MARKER),
    ),
  );
}
