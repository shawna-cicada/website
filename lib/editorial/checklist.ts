import type { EditorialDoc } from "@/lib/editorial/types";
import { hasUnresolvedPrompts } from "@/lib/editorial/templates";

/**
 * The pre-publish checklist, in plain language. Critical items block
 * publishing; advisory items only inform. Every failing item explains
 * how to fix it — never jargon, never a bare "validation error".
 */

export type ChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  /** Critical items block Publish/Schedule. */
  critical: boolean;
  /** Shown when not ok: how to fix it, in editor language. */
  fix: string;
};

export function prePublishChecklist(doc: EditorialDoc): ChecklistItem[] {
  const isVideo = doc.contentType === "video" || doc.contentType === "podcast";
  const hasBody = (doc.body ?? []).some(
    (block) =>
      block._type === "block" &&
      (block.children ?? []).some((child) => (child.text ?? "").trim() !== ""),
  );

  const items: ChecklistItem[] = [
    {
      key: "title",
      label: "The title is complete",
      ok: (doc.title ?? "").trim().length >= 5,
      critical: true,
      fix: "Add a title of at least a few words — it becomes the headline and the page address.",
    },
    {
      key: "summary",
      label: "The short summary is written",
      ok: (doc.summary ?? "").trim().length >= 20,
      critical: true,
      fix: "Write one or two sentences saying what a reader will get. It appears in previews and search results.",
    },
    {
      key: "author",
      label: "An author is selected",
      ok: (doc.authorName ?? "").trim().length > 0,
      critical: true,
      fix: "Choose who wrote this in the “Who wrote this?” field.",
    },
    {
      key: "main-image",
      label: "A main image is added",
      ok: Boolean(doc.mainImage?.assetRef),
      critical: true,
      fix: "Add the image that should appear at the top of the page and when the piece is shared.",
    },
    {
      key: "image-alt",
      label: "The image has a short description (for screen readers)",
      ok: !doc.mainImage?.assetRef || (doc.mainImage.alt ?? "").trim().length > 0,
      critical: true,
      fix: "Describe the image in a few words so people using screen readers know what it shows.",
    },
    {
      key: "content",
      label: isVideo ? "The video link is added" : "The article has content",
      ok: isVideo ? Boolean(doc.videoUrl?.trim()) : hasBody,
      critical: true,
      fix: isVideo
        ? "Paste the link to the video (YouTube or Vimeo) in the video field."
        : "The body of the article is still empty — write or paste your content.",
    },
    {
      key: "category",
      label: "A category is selected",
      ok: (doc.category ?? "").trim().length > 0,
      critical: true,
      fix: "Pick the category that fits best — it powers related-content suggestions.",
    },
    {
      key: "prompts-resolved",
      label: "All writing prompts from the template are replaced",
      ok: !hasUnresolvedPrompts(doc.body),
      critical: true,
      fix: "Some lines still contain template writing prompts (they start with “✎”). Replace or delete them before publishing.",
    },
    {
      key: "previewed",
      label: "The piece has been previewed",
      ok: Boolean(doc.previewedAt),
      critical: false,
      fix: "Use Preview to see the piece as readers will — it takes a few seconds and catches most surprises.",
    },
    {
      key: "linkedin-ready",
      label: "LinkedIn post copy is prepared",
      ok: (doc.linkedInPostText ?? "").trim().length > 0,
      critical: false,
      fix: "Generate the suggested LinkedIn post in the Promotion step so it is ready to share after publishing.",
    },
  ];

  return items;
}

export type PublishGate = {
  canPublish: boolean;
  /** Critical failures, each with its fix text. */
  blockers: ChecklistItem[];
  /** Advisory (non-blocking) reminders. */
  advisories: ChecklistItem[];
};

export function publishGate(doc: EditorialDoc): PublishGate {
  const items = prePublishChecklist(doc);
  const blockers = items.filter((item) => item.critical && !item.ok);
  const advisories = items.filter((item) => !item.critical && !item.ok);
  return { canPublish: blockers.length === 0, blockers, advisories };
}
