/**
 * Editorial domain types — the shape of content moving through the
 * Draft → Needs Review → Scheduled → Published → Archived workflow.
 * Pure and framework-agnostic: the Sanity Studio consumes these, and so
 * do the unit tests. Field names match the `insight` schema.
 */

export type ContentType =
  | "article"
  | "video"
  | "podcast"
  | "guide"
  | "case-insight";

export type WorkflowStatus =
  | "draft"
  | "needs-review"
  | "scheduled"
  | "published"
  | "archived";

export type EditorialRole = "editor" | "publisher" | "administrator";

/** A minimal portable-text block (what our logic needs to inspect). */
export type Block = {
  _type: string;
  style?: string;
  children?: Array<{ _type: string; text?: string }>;
};

export type EditorialDoc = {
  contentType?: ContentType;
  title?: string;
  summary?: string;
  authorName?: string;
  category?: string;
  mainImage?: { assetRef?: string; alt?: string };
  body?: Block[];
  videoUrl?: string;
  slug?: string;
  status?: WorkflowStatus;
  scheduledAt?: string;
  publishedAt?: string;
  previewedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  linkedInPostText?: string;
  linkedInPostStatus?: "not-ready" | "ready" | "posted";
  linkedInPostUrl?: string;
};
