import type { Block } from "@/lib/editorial/types";

/** Extract plain text from portable-text blocks. */
export function blocksToText(blocks: Block[] | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .filter((block) => block._type === "block")
    .map((block) =>
      (block.children ?? [])
        .map((child) => child.text ?? "")
        .join(""),
    )
    .join("\n");
}

/** Reading time in whole minutes (200 wpm, minimum 1 for non-empty). */
export function readingTimeMinutes(blocks: Block[] | undefined): number {
  const text = blocksToText(blocks).trim();
  if (!text) return 0;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
