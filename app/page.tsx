import { getApprovedClients, getHomepageContent } from "@/lib/cms";
import { Hero } from "@/components/sections/Hero";
import { Recognition } from "@/components/sections/Recognition";
import { Framework } from "@/components/sections/Framework";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { FeaturedInsightSection } from "@/components/sections/FeaturedInsight";
import { Founders } from "@/components/sections/Founders";
import { FinalCta } from "@/components/sections/FinalCta";

// Editor changes in /admin (hero copy, logos, featured insight) reach
// the live page within 5 minutes — no redeploy (D-021).
export const revalidate = 300;

/**
 * Homepage — the ten sections from WEBSITE_REDESIGN.md, composed from
 * CMS-adapter content (seed content overridden by Studio documents).
 *
 * Honesty gate (docs/FINAL_UX_AUDIT.md): the client logo wall renders
 * only approved records (written permission) — placeholder records
 * never reach visitors.
 *
 * The assessments section is parked until the assessments launch
 * (founder request, 2026-07-25); the seed content remains for the
 * relaunch.
 */
export default async function HomePage() {
  const [content, approvedClients] = await Promise.all([
    getHomepageContent(),
    getApprovedClients(),
  ]);

  return (
    <>
      <Hero content={content.hero} />
      <Recognition content={content.recognition} />
      <Framework content={content.framework} />
      <HowWeHelp content={content.services} />
      <ClientLogos
        content={{
          headline: content.clients.headline,
          logos:
            approvedClients.length > 0
              ? approvedClients.map((client) => ({
                  name: client.name,
                  alt: client.alt,
                  src: client.src,
                  width: client.width,
                  height: client.height,
                }))
              : content.clients.logos,
        }}
        // Placeholder logos may render pre-launch for layout preview only,
        // always visibly labeled as samples (founder request, 2026-07-23).
        demoNote={
          approvedClients.length === 0
            ? "Sample logos shown for layout preview. Real client logos appear here with written permission."
            : undefined
        }
      />
      <FeaturedInsightSection content={content.insight} />
      <Founders content={content.founders} />
      <FinalCta content={content.finalCta} />
    </>
  );
}
