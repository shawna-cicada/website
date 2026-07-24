import { generateLinkedInPost } from "@/lib/editorial/linkedin";
import { canonicalUrl } from "@/lib/editorial/seo";
import type {
  SocialDraft,
  SocialPostInput,
  SocialPublisher,
  SocialPostStatus,
} from "@/lib/linkedin/types";

const TYPE_HOOK: Record<string, string> = {
  video: "New video:",
  podcast: "New conversation:",
  guide: "New guide:",
  "case-insight": "From our client work:",
};

/**
 * Phase 1 publisher: produces formatted post text with the canonical
 * URL and returns a manual-action status. It NEVER contacts LinkedIn —
 * no network calls of any kind (proven by tests).
 */
export const manualLinkedInPublisher: SocialPublisher = {
  name: "manual-linkedin",
  automated: false,

  createDraft(input: SocialPostInput): SocialDraft {
    const hook = TYPE_HOOK[input.contentType];
    const text = generateLinkedInPost({
      title: hook ? `${hook} ${input.title}` : input.title,
      summary: input.excerpt,
      takeaway: input.takeaway,
      slug: input.slug,
      kind: input.contentType,
    });
    return {
      text,
      canonicalUrl: canonicalUrl(input.slug),
      provider: this.name,
    };
  },

  async publish(input: SocialPostInput) {
    return {
      mode: "manual" as const,
      status: "awaiting-manual-post" as const,
      draft: this.createDraft(input),
      instructions:
        "Copy the post text, publish it on the Cicada Agility LinkedIn company page, then paste the LinkedIn post URL back here and mark it as posted.",
    };
  },

  getStatus(_slug: string, stored?: SocialPostStatus): SocialPostStatus {
    // Manual mode has no external source of truth — the CMS field is it.
    return stored ?? "not-ready";
  },
};
