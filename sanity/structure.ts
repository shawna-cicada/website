import type { StructureResolver } from "sanity/structure";
import { practiceAreas } from "@/content/seed/practices";

/**
 * Branded desk structure: friendly groups and status-filtered lists —
 * never a raw dump of "document types". The dashboard tool (registered
 * first in sanity.config.ts) is the default landing experience.
 *
 * Every top-level item carries an explicit .id() so the dashboard can
 * deep-link straight to it (`/structure/<id>`); without explicit ids
 * Sanity derives them internally and links land on "not found".
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Cicada Agility")
    .items([
      S.listItem()
        .id("insights")
        .title("✍️ Articles and Insights")
        .child(
          S.list()
            .title("Articles and Insights")
            .items([
              S.listItem()
                .id("all")
                .title("All content")
                .child(S.documentTypeList("insight").title("All content")),
              S.listItem()
                .id("drafts")
                .title("Drafts")
                .child(
                  S.documentList()
                    .title("Drafts")
                    .filter('_type == "insight" && workflowStatus == "draft"'),
                ),
              S.listItem()
                .id("needs-review")
                .title("Needs Review")
                .child(
                  S.documentList()
                    .title("Needs Review")
                    .filter('_type == "insight" && workflowStatus == "needs-review"'),
                ),
              S.listItem()
                .id("scheduled")
                .title("Scheduled")
                .child(
                  S.documentList()
                    .title("Scheduled")
                    .filter('_type == "insight" && workflowStatus == "scheduled"'),
                ),
              S.listItem()
                .id("published")
                .title("Published")
                .child(
                  S.documentList()
                    .title("Published")
                    .filter('_type == "insight" && workflowStatus == "published"'),
                ),
              S.listItem()
                .id("archived")
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
        .id("homepage")
        .title("🏠 Homepage Content")
        .child(
          S.document().schemaType("homepage").documentId("homepage").title("Homepage Content"),
        ),
      S.listItem()
        .id("practices")
        .title("📄 Practice Pages")
        .child(
          // One fixed document per How We Help page — always listed,
          // opening pre-filled with the current live copy (via the
          // matching template) so editing never starts from scratch.
          S.list()
            .title("Practice Pages")
            .items(
              practiceAreas.map((practice) =>
                S.listItem()
                  .id(practice.slug)
                  .title(practice.name)
                  .child(
                    S.document()
                      .schemaType("practice")
                      .documentId(`practice-${practice.slug}`)
                      .initialValueTemplate(`practice-${practice.slug}`)
                      .title(practice.name),
                  ),
              ),
            ),
        ),
      S.listItem()
        .id("founders")
        .title("🌱 Founders & Team")
        .child(S.documentTypeList("founder").title("Founders & Team")),
      S.listItem()
        .id("assessments")
        .title("🧭 Assessments")
        .child(S.documentTypeList("assessment").title("Assessments")),
      S.listItem()
        .id("clientLogos")
        .title("🤝 Client Logos")
        .child(S.documentTypeList("clientLogo").title("Client Logos")),
      S.divider(),
      S.listItem()
        .id("authors")
        .title("👤 People (authors)")
        .child(S.documentTypeList("author").title("People")),
      S.listItem()
        .id("categories")
        .title("🏷️ Categories")
        .child(S.documentTypeList("category").title("Categories")),
    ]);
