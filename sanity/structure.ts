import type { StructureResolver } from "sanity/structure";

/**
 * Branded desk structure: friendly groups and status-filtered lists —
 * never a raw dump of "document types". The dashboard tool (registered
 * first in sanity.config.ts) is the default landing experience.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Cicada Agility")
    .items([
      S.listItem()
        .title("✍️ Articles and Insights")
        .child(
          S.list()
            .title("Articles and Insights")
            .items([
              S.listItem()
                .title("All content")
                .child(S.documentTypeList("insight").title("All content")),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentList()
                    .title("Drafts")
                    .filter('_type == "insight" && workflowStatus == "draft"'),
                ),
              S.listItem()
                .title("Needs Review")
                .child(
                  S.documentList()
                    .title("Needs Review")
                    .filter('_type == "insight" && workflowStatus == "needs-review"'),
                ),
              S.listItem()
                .title("Scheduled")
                .child(
                  S.documentList()
                    .title("Scheduled")
                    .filter('_type == "insight" && workflowStatus == "scheduled"'),
                ),
              S.listItem()
                .title("Published")
                .child(
                  S.documentList()
                    .title("Published")
                    .filter('_type == "insight" && workflowStatus == "published"'),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  S.documentList()
                    .title("Archived")
                    .filter('_type == "insight" && workflowStatus == "archived"'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("🏠 Homepage Content")
        .child(
          S.document().schemaType("homepage").documentId("homepage").title("Homepage Content"),
        ),
      S.listItem()
        .title("🧭 Assessments")
        .child(S.documentTypeList("assessment").title("Assessments")),
      S.listItem()
        .title("🤝 Client Logos")
        .child(S.documentTypeList("clientLogo").title("Client Logos")),
      S.divider(),
      S.listItem()
        .title("👤 People (authors)")
        .child(S.documentTypeList("author").title("People")),
      S.listItem()
        .title("🏷️ Categories")
        .child(S.documentTypeList("category").title("Categories")),
    ]);
