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

/** Serialize for a <script type="application/ld+json"> tag. */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
