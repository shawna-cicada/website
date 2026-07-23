import type { DocumentBadgeComponent } from "sanity";
import { badgeFor } from "@/lib/editorial/statuses";
import type { WorkflowStatus } from "@/lib/editorial/types";

/** Branded workflow badge shown on every Articles & Videos document. */
export const WorkflowBadge: DocumentBadgeComponent = (props) => {
  const doc = (props.draft ?? props.published) as
    | { workflowStatus?: WorkflowStatus }
    | null;
  const badge = badgeFor(doc?.workflowStatus);
  return {
    label: badge.label,
    color:
      badge.status === "published"
        ? "success"
        : badge.status === "scheduled"
          ? "primary"
          : badge.status === "archived"
            ? undefined
            : "warning",
    title: `Workflow status: ${badge.label}`,
  };
};
