import { canonicalUrl } from "@/lib/editorial/seo";

/**
 * Suggested LinkedIn post copy (publishing workflow Phase 1: generated
 * copy, manual posting — see WEBSITE_REDESIGN.md). The editor can edit
 * the suggestion, copy it with one click, and mark it ready/posted.
 */
export function generateLinkedInPost(input: {
  title: string;
  summary: string;
  takeaway?: string;
  slug: string;
}): string {
  const lines = [
    input.title,
    "",
    input.summary.trim(),
  ];
  if (input.takeaway?.trim()) {
    lines.push("", `The short version: ${input.takeaway.trim()}`);
  }
  lines.push("", `Read the full piece: ${canonicalUrl(input.slug)}`);
  const post = lines.join("\n");
  // LinkedIn's hard limit is 3000 characters; stay well inside it.
  return post.length <= 2900 ? post : `${post.slice(0, 2897)}…`;
}
