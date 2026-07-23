import type { Engagement, PracticeArea } from "@/lib/cms/types";

const SITE_URL = "https://www.cicadaagility.com";

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Cicada Agility",
  url: SITE_URL,
  slogan: "Growth Happens in Stages. Leadership Must Evolve With It.",
};

/** Service schema for a practice-area detail page. */
export function serviceJsonLd(practice: PracticeArea) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/how-we-help/${practice.slug}#service`,
    name: practice.name,
    description: practice.summary,
    url: `${SITE_URL}/how-we-help/${practice.slug}`,
    serviceType: practice.name,
    provider: organizationJsonLd,
  };
}

/** ItemList of services for the How We Help overview. */
export function servicesListJsonLd(
  practices: PracticeArea[],
  engagementRecords: Engagement[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "How Cicada Agility helps",
    itemListElement: practices.map((practice, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: serviceJsonLd(practice),
    })),
    numberOfItems: practices.length + engagementRecords.length,
  };
}

/** Person schema for a founder profile. */
export function personJsonLd(person: {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  linkedInUrl?: string;
}) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/about#${person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: person.name,
    jobTitle: person.role,
    description: person.bio,
    knowsAbout: person.expertise,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(person.linkedInUrl ? { sameAs: [person.linkedInUrl] } : {}),
  };
}

/** Organization + founders graph for the About page. */
export function aboutJsonLd(
  people: Array<Parameters<typeof personJsonLd>[0]>,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationJsonLd,
        founder: people.map((person) => ({
          "@id": personJsonLd(person)["@id"],
        })),
      },
      ...people.map(personJsonLd),
    ],
  };
}

/** BreadcrumbList for nested pages. */
export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/**
 * Article schema for insight pages (consumed in Phase 6 when
 * /insights/[slug] renders CMS content; tested now).
 */
export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/insights/${article.slug}`,
    mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
    author: { "@type": "Person", name: article.authorName },
    publisher: organizationJsonLd,
    datePublished: article.publishedAt,
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    ...(article.imageUrl ? { image: [article.imageUrl] } : {}),
  };
}

/** VideoObject schema for video insights (Phase 6; tested now). */
export function videoObjectJsonLd(video: {
  title: string;
  description: string;
  slug: string;
  videoUrl: string;
  publishedAt: string;
  thumbnailUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    url: `${SITE_URL}/insights/${video.slug}`,
    embedUrl: video.videoUrl,
    uploadDate: video.publishedAt,
    ...(video.thumbnailUrl ? { thumbnailUrl: [video.thumbnailUrl] } : {}),
  };
}

/** Serialize for a <script type="application/ld+json"> tag. */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
