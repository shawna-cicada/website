/**
 * Provider-neutral social syndication (per WEBSITE_REDESIGN.md's
 * LinkedIn phases). Phase 1 is manual: the site generates ready-to-use
 * post copy; a human posts it. Automation providers (Zapier, Make,
 * serverless webhook, direct API) implement the same interface later —
 * see docs/LINKEDIN_WORKFLOW.md.
 */

export type SocialPostStatus = "not-ready" | "ready" | "posted";

export type SocialPostInput = {
  title: string;
  excerpt: string;
  slug: string;
  contentType: string;
  takeaway?: string;
};

export type SocialDraft = {
  /** Formatted post text, ready to copy or submit. */
  text: string;
  /** Canonical article URL included in the post. */
  canonicalUrl: string;
  provider: string;
};

export type SocialPublishResult =
  | {
      mode: "manual";
      status: "awaiting-manual-post";
      draft: SocialDraft;
      /** Plain-language instruction for the human step. */
      instructions: string;
    }
  | {
      mode: "automated";
      status: "submitted" | "scheduled" | "failed";
      externalId?: string;
      error?: string;
    };

export interface SocialPublisher {
  /** Provider id, e.g. "manual-linkedin". */
  name: string;
  /** Whether publish() performs any external network call. */
  automated: boolean;
  /** Build a formatted draft post from article fields. */
  createDraft(input: SocialPostInput): SocialDraft;
  /** Publish (or, in manual mode, hand back the human next step). */
  publish(input: SocialPostInput): Promise<SocialPublishResult>;
  /** Current status of a post for a given article slug. */
  getStatus(slug: string, stored?: SocialPostStatus): SocialPostStatus;
}
