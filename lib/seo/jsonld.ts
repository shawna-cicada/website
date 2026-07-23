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

/** Serialize for a <script type="application/ld+json"> tag. */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
