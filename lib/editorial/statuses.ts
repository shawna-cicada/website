import type { WorkflowStatus } from "@/lib/editorial/types";

/**
 * Branded status badges. Colors come from the Cicada palette
 * (docs/BRAND.md) so the Studio reads as Cicada, not generic CMS.
 */

export type StatusBadge = {
  status: WorkflowStatus;
  label: string;
  /** Badge background (brand token value). */
  color: string;
  /** Badge text color, AA against the background. */
  textColor: string;
};

export const STATUS_BADGES: Record<WorkflowStatus, StatusBadge> = {
  draft: {
    status: "draft",
    label: "Draft",
    color: "#e6eaf5", // White Lilac
    textColor: "#1e2a44",
  },
  "needs-review": {
    status: "needs-review",
    label: "Needs Review",
    color: "#cbb8ff", // Melrose
    textColor: "#1e2a44",
  },
  scheduled: {
    status: "scheduled",
    label: "Scheduled",
    color: "#4ddffd", // Malibu
    textColor: "#1e2a44",
  },
  published: {
    status: "published",
    label: "Published",
    color: "#18b698", // Mountain Meadow
    textColor: "#1e2a44",
  },
  archived: {
    status: "archived",
    label: "Archived",
    color: "#c4c4c4", // Silver
    textColor: "#1e2a44",
  },
};

export function badgeFor(status: WorkflowStatus | undefined): StatusBadge {
  return STATUS_BADGES[status ?? "draft"];
}
