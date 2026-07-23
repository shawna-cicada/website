import type { MetadataRoute } from "next";
import { getApprovedClients, getPracticeAreas } from "@/lib/cms";

const SITE_URL = "https://www.cicadaagility.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [practices, approvedClients] = await Promise.all([
    getPracticeAreas(),
    getApprovedClients(),
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/how-we-help`, lastModified: now, priority: 0.9 },
    ...practices.map((practice) => ({
      url: `${SITE_URL}/how-we-help/${practice.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/assessments`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/insights`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/book`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/privacy`, lastModified: now, priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, priority: 0.2 },
  ];

  // /clients joins the sitemap only once approved records exist.
  if (approvedClients.length > 0) {
    entries.push({ url: `${SITE_URL}/clients`, lastModified: now, priority: 0.6 });
  }

  return entries;
}
