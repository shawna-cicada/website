import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { insight } from "@/sanity/schemas/insight";
import {
  assessment,
  author,
  category,
  clientLogo,
  homepage,
} from "@/sanity/schemas/supporting";
import { structure } from "@/sanity/structure";
import { cicadaTemplates } from "@/sanity/templates";
import { WorkflowBadge } from "@/sanity/badges";
import {
  ArchiveAction,
  CopyLinkedInPostAction,
  PreviewDraftAction,
  PublishWithChecklist,
  ScheduleAction,
  UnpublishToDraft,
  ViewLiveAction,
} from "@/sanity/actions";
import { CicadaDashboard } from "@/sanity/dashboard/CicadaDashboard";

/**
 * The Cicada Agility Studio.
 * - The branded dashboard tool is first → the default landing view.
 * - Content structure is grouped in plain language, never a raw type list.
 * - Insight documents get the guided actions (checklist-gated publish,
 *   schedule, archive-with-confirm, LinkedIn copy) and branded badges.
 *
 * Roles: assign people the built-in Sanity roles — Editor ↔ our Editor,
 * Editor+publish ↔ Publisher, Administrator ↔ Administrator. The action
 * gating mirrors lib/editorial/permissions.ts; see docs/EDITOR_GUIDE.md.
 */
export default defineConfig({
  name: "cicada-agility",
  title: "Cicada Agility",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/admin",
  plugins: [structureTool({ structure })],
  tools: (prev) => [
    {
      name: "dashboard",
      title: "Dashboard",
      component: CicadaDashboard,
    },
    ...prev,
  ],
  schema: {
    types: [insight, author, category, assessment, clientLogo, homepage],
    templates: (prev) => [
      ...cicadaTemplates,
      ...prev.filter((template) => template.schemaType !== "insight"),
    ],
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== "insight") return prev;
      const kept = prev.filter(
        (action) =>
          action.action !== "publish" &&
          action.action !== "unpublish" &&
          action.action !== "delete",
      );
      return [
        PublishWithChecklist,
        ScheduleAction,
        PreviewDraftAction,
        CopyLinkedInPostAction,
        ViewLiveAction,
        UnpublishToDraft,
        ArchiveAction,
        // Restore Previous Version: Sanity's native revision history
        // (clock icon) — referenced from the editor guide.
        ...kept,
      ];
    },
    badges: (prev, context) =>
      context.schemaType === "insight" ? [WorkflowBadge, ...prev] : prev,
  },
});
