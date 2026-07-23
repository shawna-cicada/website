import type { ClientRecord } from "@/lib/cms/types";

/**
 * Client records, served through the CMS adapter.
 * HARD RULE (per WEBSITE_REDESIGN.md): nothing renders on /clients until
 * approved: true, which represents written permission from the client.
 * No real client names are invented here — these are unapproved
 * placeholder records that exercise the layout and grouping logic and
 * keep /clients in its empty state (and out of navigation) until real,
 * approved records replace them in the CMS.
 */
export const clientRecords: ClientRecord[] = [
  {
    name: "Placeholder client A",
    alt: "Placeholder client logo A",
    src: "/clients/placeholder-1.svg",
    width: 150,
    height: 48,
    group: "startup",
    approved: false,
  },
  {
    name: "Placeholder client B",
    alt: "Placeholder client logo B",
    src: "/clients/placeholder-2.svg",
    width: 150,
    height: 48,
    group: "growth",
    approved: false,
  },
  {
    name: "Placeholder client C",
    alt: "Placeholder client logo C",
    src: "/clients/placeholder-3.svg",
    width: 150,
    height: 48,
    group: "enterprise",
    approved: false,
    caseInsightHref: "/insights",
  },
];
