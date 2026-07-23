import type { Template } from "sanity";
import { EDITORIAL_TEMPLATES } from "@/lib/editorial/templates";

/**
 * Initial-value templates: the visual "start from a template" choices in
 * the create flow. Each seeds the draft with the outline + writing
 * prompts from lib/editorial/templates — and the pre-publish checklist
 * refuses to publish while any ✎ prompt remains, so scaffolding can
 * never go live.
 */
export const cicadaTemplates: Template[] = EDITORIAL_TEMPLATES.map(
  (template) => ({
    id: `insight-${template.id}`,
    title: template.title,
    description: template.description,
    schemaType: "insight",
    value: {
      contentType: template.contentType,
      workflowStatus: "draft",
      body: template.outline.map((block, index) => ({
        ...block,
        _key: `${template.id}-${index}`,
        children: block.children?.map((child, childIndex) => ({
          ...child,
          _key: `${template.id}-${index}-${childIndex}`,
        })),
      })),
    },
  }),
);
