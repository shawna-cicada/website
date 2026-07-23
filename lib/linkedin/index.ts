import { manualLinkedInPublisher } from "@/lib/linkedin/manual";
import type { SocialPublisher } from "@/lib/linkedin/types";

/**
 * Publisher registry. Manual mode is the default and the only
 * implementation. Automation can NEVER activate implicitly: it requires
 * BOTH the env flag SOCIAL_PUBLISH_MODE=automated AND a registered,
 * approved provider — neither exists today, so the guard below always
 * returns the manual publisher. See docs/LINKEDIN_WORKFLOW.md.
 */

const PUBLISHERS: Record<string, SocialPublisher> = {
  "manual-linkedin": manualLinkedInPublisher,
};

export function getSocialPublisher(): SocialPublisher {
  const mode = process.env.SOCIAL_PUBLISH_MODE?.trim() || "manual";
  const provider = process.env.SOCIAL_PUBLISH_PROVIDER?.trim() || "manual-linkedin";

  if (mode !== "automated") {
    return manualLinkedInPublisher;
  }
  const candidate = PUBLISHERS[provider];
  // Automated mode with an unknown/unapproved provider falls back to
  // manual rather than failing or, worse, posting through the wrong thing.
  if (!candidate || !candidate.automated) {
    return manualLinkedInPublisher;
  }
  return candidate;
}
