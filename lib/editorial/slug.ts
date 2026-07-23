/**
 * Automatic slug behavior. Editors never see or type slugs — the page
 * address is generated from the title and de-duplicated automatically.
 */

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

export type SlugResult = {
  slug: string;
  /** True when the preferred slug was taken and a suffix was added. */
  wasDeduplicated: boolean;
  /** Plain-language note for the editor when deduplication happened. */
  warning?: string;
};

/**
 * Ensure a slug is unique among existing slugs; append -2, -3, … when
 * taken and explain what happened in editor language.
 */
export function ensureUniqueSlug(
  title: string,
  existingSlugs: string[],
): SlugResult {
  const base = slugify(title);
  const taken = new Set(existingSlugs);
  if (!taken.has(base)) {
    return { slug: base, wasDeduplicated: false };
  }
  let counter = 2;
  while (taken.has(`${base}-${counter}`)) counter += 1;
  const slug = `${base}-${counter}`;
  return {
    slug,
    wasDeduplicated: true,
    warning: `Another piece already uses the address “/insights/${base}”, so this one will be published at “/insights/${slug}”. If that seems wrong, consider a more specific title.`,
  };
}
