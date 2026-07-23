import type { InsightKind } from "@/lib/cms/types";

/** Reader-facing labels for the insight content types. */
export const INSIGHT_KIND_LABELS: Record<InsightKind, string> = {
  article: "Article",
  video: "Video",
  podcast: "Conversation",
  guide: "Guide",
  "case-insight": "Case insight",
};

/** "July 23, 2026" — or null when the date is missing/unparseable. */
export function formatInsightDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
