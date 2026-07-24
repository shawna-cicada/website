import type { EditorialRole } from "@/lib/editorial/types";

/**
 * Simple permission roles (per WEBSITE_REDESIGN.md). The matrix is the
 * single source of truth: the Studio hides or disables actions with it,
 * and Sanity project roles are mapped to these three (see
 * docs/EDITOR_GUIDE.md). Nobody gets full admin by default.
 */

export type EditorialAction =
  | "create-draft"
  | "edit-draft"
  | "upload-image"
  | "preview"
  | "prepare-linkedin"
  | "publish"
  | "schedule"
  | "unpublish"
  | "archive"
  | "restore-version"
  | "manage-users"
  | "manage-site-settings"
  | "manage-assessments"
  | "manage-client-logos"
  | "manage-navigation";

const EDITOR_ACTIONS: EditorialAction[] = [
  "create-draft",
  "edit-draft",
  "upload-image",
  "preview",
  "prepare-linkedin",
];

const PUBLISHER_ACTIONS: EditorialAction[] = [
  ...EDITOR_ACTIONS,
  "publish",
  "schedule",
  "unpublish",
  "archive",
  "restore-version",
];

const ADMINISTRATOR_ACTIONS: EditorialAction[] = [
  ...PUBLISHER_ACTIONS,
  "manage-users",
  "manage-site-settings",
  "manage-assessments",
  "manage-client-logos",
  "manage-navigation",
];

const MATRIX: Record<EditorialRole, ReadonlySet<EditorialAction>> = {
  editor: new Set(EDITOR_ACTIONS),
  publisher: new Set(PUBLISHER_ACTIONS),
  administrator: new Set(ADMINISTRATOR_ACTIONS),
};

export function can(role: EditorialRole, action: EditorialAction): boolean {
  return MATRIX[role].has(action);
}

/** Explain a denied action in plain language. */
export function explainDenied(role: EditorialRole, action: EditorialAction): string {
  if (can(role, action)) return "";
  if (role === "editor") {
    return "Your account can write and prepare content, but publishing is done by a Publisher or Administrator. Save your draft and let them know it is ready.";
  }
  return "This needs an Administrator account. Ask yours to make the change or to adjust your access.";
}
