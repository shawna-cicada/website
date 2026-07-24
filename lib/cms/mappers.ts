import type {
  AboutContent,
  AssessmentsPageContent,
  ClientGroup,
  ClientRecord,
  FeaturedInsight,
  FounderProfile,
  FounderProfileFull,
  HomepageContent,
  HowWeHelpContent,
  PracticeArea,
  ServiceCard,
} from "@/lib/cms/types";

/**
 * Pure mapping/merge logic between Sanity site-content documents and
 * the adapter's types (D-021). Kept free of network imports so it can
 * be unit-tested exhaustively; lib/cms/site.ts does the fetching.
 */

export type ClientLogoRow = {
  name?: string | null;
  alt?: string | null;
  src?: string | null;
  width?: number | null;
  height?: number | null;
  group?: string | null;
  approved?: boolean | null;
};

/** Studio dropdown labels → adapter group keys. */
const GROUP_KEYS: Record<string, ClientGroup> = {
  Startup: "startup",
  "Growth company": "growth",
  Enterprise: "enterprise",
};

/** Logos render at this height in the wall/marquee; width follows. */
const LOGO_DISPLAY_HEIGHT = 48;

/**
 * A Studio-managed logo becomes a ClientRecord — or null when required
 * pieces (name, alt text, image, dimensions) are missing, so incomplete
 * documents can never break the public site. `approved` carries the
 * editor's written-permission checkbox; the display gate stays in
 * getApprovedClients, exactly as for seed records.
 */
export function mapClientLogoRow(row: ClientLogoRow): ClientRecord | null {
  if (!row.name || !row.alt || !row.src || !row.width || !row.height) {
    return null;
  }
  const group = row.group ? GROUP_KEYS[row.group] : undefined;
  return {
    name: row.name,
    alt: row.alt,
    // Ask the Sanity CDN for a right-sized, modern-format asset (2x for
    // crisp rendering) instead of shipping the original upload.
    src: `${row.src}?h=${LOGO_DISPLAY_HEIGHT * 2}&fit=max&auto=format`,
    width: Math.max(
      1,
      Math.round(row.width * (LOGO_DISPLAY_HEIGHT / row.height)),
    ),
    height: LOGO_DISPLAY_HEIGHT,
    ...(group ? { group } : {}),
    approved: row.approved === true,
  };
}

export type HomepageOverrides = {
  heroHeadline?: string | null;
  heroCopy?: string | null;
  featuredInsight?: {
    slug?: string | null;
    title?: string | null;
    summary?: string | null;
    category?: string | null;
    workflowStatus?: string | null;
  } | null;
  recognitionHeadline?: string | null;
  recognitionStatements?: string[] | null;
  servicesHeadline?: string | null;
  servicesCopy?: string | null;
  finalCtaHeadline?: string | null;
  finalCtaCopy?: string | null;
};

/** Non-blank trimmed string, else undefined (fall through to seed). */
function present(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Non-empty list of non-blank lines, else undefined. */
function presentList(value: string[] | null | undefined): string[] | undefined {
  const lines = (value ?? [])
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line));
  return lines.length > 0 ? lines : undefined;
}

/** A textarea where each line is a list item → non-empty list, else undefined. */
function presentLines(value: string | null | undefined): string[] | undefined {
  return presentList(value?.split("\n"));
}

/** A textarea where blank lines separate paragraphs → list, else undefined. */
function presentParagraphs(
  value: string | null | undefined,
): string[] | undefined {
  const paragraphs = (value ?? "")
    .split(/\n\s*\n/)
    // Line breaks inside one paragraph flow as a single block of text.
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paragraphs.length > 0 ? paragraphs : undefined;
}

/**
 * Layer the Studio's Homepage Content document over the seed content.
 * Blank/missing fields fall through to the seed, so a half-filled
 * document can only ever improve the page, never blank it. The featured
 * insight is honored only when the referenced piece is published.
 */
export function mergeHomepageContent(
  seed: HomepageContent,
  overrides: HomepageOverrides | null,
): HomepageContent {
  if (!overrides) return seed;

  const headline = overrides.heroHeadline?.trim();
  const copy = overrides.heroCopy?.trim();

  const ref = overrides.featuredInsight;
  const featured: FeaturedInsight | null =
    ref &&
    ref.workflowStatus === "published" &&
    ref.slug &&
    ref.title &&
    ref.summary
      ? {
          category: ref.category || seed.insight.featured.category,
          title: ref.title,
          excerpt: ref.summary,
          href: `/insights/${ref.slug}`,
        }
      : null;

  const statements = presentList(overrides.recognitionStatements);

  return {
    ...seed,
    hero: {
      ...seed.hero,
      ...(headline ? { headline } : {}),
      ...(copy ? { copy } : {}),
    },
    recognition: {
      ...seed.recognition,
      ...(present(overrides.recognitionHeadline)
        ? { headline: present(overrides.recognitionHeadline)! }
        : {}),
      ...(statements ? { statements } : {}),
    },
    services: {
      ...seed.services,
      ...(present(overrides.servicesHeadline)
        ? { headline: present(overrides.servicesHeadline)! }
        : {}),
      ...(present(overrides.servicesCopy)
        ? { copy: present(overrides.servicesCopy)! }
        : {}),
    },
    finalCta: {
      ...seed.finalCta,
      ...(present(overrides.finalCtaHeadline)
        ? { headline: present(overrides.finalCtaHeadline)! }
        : {}),
      ...(present(overrides.finalCtaCopy)
        ? { copy: present(overrides.finalCtaCopy)! }
        : {}),
    },
    insight: featured ? { ...seed.insight, featured } : seed.insight,
  };
}

/** Studio practice-page document, keyed to a seed practice by slug. */
export type PracticeOverrideRow = {
  key?: string | null;
  headline?: string | null;
  summary?: string | null;
  whoFor?: string[] | null;
  problems?: string[] | null;
  workOn?: string[] | null;
  leaveWith?: string[] | null;
  supportingCapabilities?: string[] | null;
};

/**
 * Field-by-field practice merge (D-026): blank fields keep the seed
 * copy. The practice NAME stays code-managed — navigation labels and
 * URLs depend on it.
 */
export function mergePractice(
  seed: PracticeArea,
  override: PracticeOverrideRow | undefined,
): PracticeArea {
  if (!override) return seed;
  const headline = present(override.headline);
  const summary = present(override.summary);
  const whoFor = presentList(override.whoFor);
  const problems = presentList(override.problems);
  const workOn = presentList(override.workOn);
  const leaveWith = presentList(override.leaveWith);
  const supportingCapabilities = presentList(override.supportingCapabilities);
  return {
    ...seed,
    ...(headline ? { headline } : {}),
    ...(summary ? { summary } : {}),
    ...(whoFor ? { whoFor } : {}),
    ...(problems ? { problems } : {}),
    ...(workOn ? { workOn } : {}),
    ...(leaveWith ? { leaveWith } : {}),
    ...(supportingCapabilities ? { supportingCapabilities } : {}),
  };
}

/** Studio founder document row. */
export type FounderRow = {
  name?: string | null;
  role?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  photoAlt?: string | null;
  expertise?: string[] | null;
  selectedExperience?: string[] | null;
  speakingTopics?: string[] | null;
  linkedInUrl?: string | null;
};

/** Portraits render at moderate size; ask the CDN for a right-sized asset. */
const FOUNDER_PHOTO_PARAMS = "?w=800&fit=max&auto=format";

/** Shown when a Studio profile has no photo uploaded yet. */
export const FOUNDER_PLACEHOLDER_IMAGE = "/founders/placeholder.svg";

/**
 * A Studio person becomes a full founder profile; rows without a name
 * are dropped. CMS-entered bios are editor-owned, so they are never
 * flagged as drafts.
 */
export function mapFounderRow(row: FounderRow): FounderProfileFull | null {
  const name = present(row.name);
  if (!name) return null;
  return {
    name,
    role: present(row.role) ?? "",
    bio: present(row.bio) ?? "",
    draftBio: false,
    expertise: presentList(row.expertise) ?? [],
    selectedExperience: presentList(row.selectedExperience) ?? [],
    ...(present(row.linkedInUrl) ? { linkedInUrl: present(row.linkedInUrl)! } : {}),
    speakingTopics: presentList(row.speakingTopics) ?? [],
    imageSrc: row.photoUrl
      ? `${row.photoUrl}${FOUNDER_PHOTO_PARAMS}`
      : FOUNDER_PLACEHOLDER_IMAGE,
    imageAlt: present(row.photoAlt) ?? `Portrait of ${name}`,
  };
}

/** Studio About Page document (singleton). */
export type AboutOverrides = {
  heroHeadline?: string | null;
  heroCopy?: string | null;
  originHeadline?: string | null;
  /** Paragraphs separated by blank lines. */
  originCopy?: string | null;
  beliefsHeadline?: string | null;
  /** One belief per line. */
  beliefsItems?: string | null;
  systemHeadline?: string | null;
  systemCopy?: string | null;
  principlesHeadline?: string | null;
  /** One principle per line. */
  principlesItems?: string | null;
  clientExperienceHeadline?: string | null;
  clientExperienceCopy?: string | null;
  ctaHeadline?: string | null;
  ctaCopy?: string | null;
};

/**
 * Layer the Studio's About Page document over the seed (D-026): blank
 * fields keep the committed copy; button labels and links stay
 * code-managed.
 */
export function mergeAboutContent(
  seed: AboutContent,
  overrides: AboutOverrides | null,
): AboutContent {
  if (!overrides) return seed;
  const originParagraphs = presentParagraphs(overrides.originCopy);
  const beliefs = presentLines(overrides.beliefsItems);
  const principles = presentLines(overrides.principlesItems);
  return {
    ...seed,
    hero: {
      ...seed.hero,
      ...(present(overrides.heroHeadline)
        ? { headline: present(overrides.heroHeadline)! }
        : {}),
      ...(present(overrides.heroCopy)
        ? { copy: present(overrides.heroCopy)! }
        : {}),
    },
    origin: {
      ...seed.origin,
      ...(present(overrides.originHeadline)
        ? { headline: present(overrides.originHeadline)! }
        : {}),
      ...(originParagraphs ? { paragraphs: originParagraphs } : {}),
    },
    beliefs: {
      ...seed.beliefs,
      ...(present(overrides.beliefsHeadline)
        ? { headline: present(overrides.beliefsHeadline)! }
        : {}),
      ...(beliefs ? { items: beliefs } : {}),
    },
    system: {
      ...seed.system,
      ...(present(overrides.systemHeadline)
        ? { headline: present(overrides.systemHeadline)! }
        : {}),
      ...(present(overrides.systemCopy)
        ? { copy: present(overrides.systemCopy)! }
        : {}),
    },
    principles: {
      ...seed.principles,
      ...(present(overrides.principlesHeadline)
        ? { headline: present(overrides.principlesHeadline)! }
        : {}),
      ...(principles ? { items: principles } : {}),
    },
    clientExperience: {
      ...seed.clientExperience,
      ...(present(overrides.clientExperienceHeadline)
        ? { headline: present(overrides.clientExperienceHeadline)! }
        : {}),
      ...(present(overrides.clientExperienceCopy)
        ? { copy: present(overrides.clientExperienceCopy)! }
        : {}),
    },
    cta: {
      ...seed.cta,
      ...(present(overrides.ctaHeadline)
        ? { headline: present(overrides.ctaHeadline)! }
        : {}),
      ...(present(overrides.ctaCopy)
        ? { copy: present(overrides.ctaCopy)! }
        : {}),
    },
  };
}

/** Studio How We Help overview document (singleton). */
export type HowWeHelpOverrides = {
  heroHeadline?: string | null;
  heroCopy?: string | null;
  systemHeadline?: string | null;
  /** Paragraphs separated by blank lines. */
  systemCopy?: string | null;
  engagementsHeadline?: string | null;
  engagementsCopy?: string | null;
  closingHeadline?: string | null;
  closingCopy?: string | null;
};

/** Layer the Studio's How We Help document over the seed (D-026). */
export function mergeHowWeHelpContent(
  seed: HowWeHelpContent,
  overrides: HowWeHelpOverrides | null,
): HowWeHelpContent {
  if (!overrides) return seed;
  const systemNarrative = presentParagraphs(overrides.systemCopy);
  return {
    ...seed,
    ...(present(overrides.heroHeadline)
      ? { headline: present(overrides.heroHeadline)! }
      : {}),
    ...(present(overrides.heroCopy)
      ? { copy: present(overrides.heroCopy)! }
      : {}),
    ...(present(overrides.systemHeadline)
      ? { systemHeadline: present(overrides.systemHeadline)! }
      : {}),
    ...(systemNarrative ? { systemNarrative } : {}),
    ...(present(overrides.engagementsHeadline)
      ? { engagementsHeadline: present(overrides.engagementsHeadline)! }
      : {}),
    ...(present(overrides.engagementsCopy)
      ? { engagementsCopy: present(overrides.engagementsCopy)! }
      : {}),
    closing: {
      ...seed.closing,
      ...(present(overrides.closingHeadline)
        ? { headline: present(overrides.closingHeadline)! }
        : {}),
      ...(present(overrides.closingCopy)
        ? { copy: present(overrides.closingCopy)! }
        : {}),
    },
  };
}

/** Studio Assessments Page document (singleton). */
export type AssessmentsPageOverrides = {
  heroHeadline?: string | null;
  heroCopy?: string | null;
  gridHeadline?: string | null;
  aboutHeadline?: string | null;
  aboutCopy?: string | null;
};

/** Layer the Studio's Assessments Page document over the seed (D-026). */
export function mergeAssessmentsPageContent(
  seed: AssessmentsPageContent,
  overrides: AssessmentsPageOverrides | null,
): AssessmentsPageContent {
  if (!overrides) return seed;
  return {
    ...seed,
    hero: {
      ...seed.hero,
      ...(present(overrides.heroHeadline)
        ? { headline: present(overrides.heroHeadline)! }
        : {}),
      ...(present(overrides.heroCopy)
        ? { copy: present(overrides.heroCopy)! }
        : {}),
    },
    ...(present(overrides.gridHeadline)
      ? { gridHeadline: present(overrides.gridHeadline)! }
      : {}),
    ...(present(overrides.aboutHeadline)
      ? { aboutHeadline: present(overrides.aboutHeadline)! }
      : {}),
    ...(present(overrides.aboutCopy)
      ? { aboutCopy: present(overrides.aboutCopy)! }
      : {}),
  };
}

/**
 * Keep the homepage practice cards in step with the (possibly
 * Studio-edited) practice pages: each card whose link points at a
 * practice adopts that practice's name and summary. Cards that don't
 * link to a practice pass through untouched.
 */
export function syncServiceCards(
  items: ServiceCard[],
  practices: PracticeArea[],
): ServiceCard[] {
  return items.map((item) => {
    const practice = practices.find(
      (candidate) => item.href === `/how-we-help/${candidate.slug}`,
    );
    if (!practice) return item;
    return { ...item, title: practice.name, copy: practice.summary };
  });
}

/**
 * Adopt uploaded Studio photos on the homepage founder cards, matching
 * profiles by name. The homepage's short bios stay code-managed; only a
 * real uploaded photo (never the placeholder fallback) replaces the
 * committed portrait.
 */
export function adoptFounderPhotos(
  people: FounderProfile[],
  cmsFounders: FounderProfileFull[],
): FounderProfile[] {
  if (cmsFounders.length === 0) return people;
  return people.map((person) => {
    const match = cmsFounders.find(
      (candidate) =>
        candidate.name.trim().toLowerCase() ===
        person.name.trim().toLowerCase(),
    );
    if (!match || match.imageSrc === FOUNDER_PLACEHOLDER_IMAGE) return person;
    return { ...person, imageSrc: match.imageSrc, imageAlt: match.imageAlt };
  });
}
