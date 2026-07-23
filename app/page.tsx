import {
  getActiveAssessments,
  getApprovedClients,
  getHomepageContent,
} from "@/lib/cms";
import { Hero } from "@/components/sections/Hero";
import { Recognition } from "@/components/sections/Recognition";
import { Framework } from "@/components/sections/Framework";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { AssessmentFeature } from "@/components/sections/AssessmentFeature";
import { EngagementPath } from "@/components/sections/EngagementPath";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { FeaturedInsightSection } from "@/components/sections/FeaturedInsight";
import { Founders } from "@/components/sections/Founders";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Homepage — the ten sections from WEBSITE_REDESIGN.md, composed from
 * CMS-adapter content (currently seed-backed; Sanity in Phase 2).
 *
 * Two honesty gates (docs/FINAL_UX_AUDIT.md):
 * - While no assessment provider URL is configured, the hero leads with
 *   the booking CTA so the primary action never dead-ends; the moment
 *   the env var lands, the assessment resumes the lead automatically.
 * - The client logo wall renders only approved records (written
 *   permission) — placeholder records never reach visitors.
 */
export default async function HomePage() {
  const [content, activeAssessments, approvedClients] = await Promise.all([
    getHomepageContent(),
    getActiveAssessments(),
    getApprovedClients(),
  ]);

  const assessmentLive = Boolean(
    activeAssessments.find((assessment) => assessment.featured)?.externalUrl,
  );
  const hero = assessmentLive
    ? content.hero
    : {
        ...content.hero,
        primaryCta: content.hero.secondaryCta, // Book a Discovery Call
        secondaryCta: { label: "Explore our assessments", href: "/assessments" },
      };

  return (
    <>
      <Hero content={hero} />
      <Recognition content={content.recognition} />
      <Framework content={content.framework} />
      <HowWeHelp content={content.services} />
      {/* Path first, then the concrete entry point (the assessment). */}
      <EngagementPath content={content.engagement} />
      <AssessmentFeature content={content.assessments} />
      {approvedClients.length > 0 ? (
        <ClientLogos
          content={{
            headline: content.clients.headline,
            logos: approvedClients.map((client) => ({
              name: client.name,
              alt: client.alt,
              src: client.src,
              width: client.width,
              height: client.height,
            })),
          }}
        />
      ) : null}
      <FeaturedInsightSection content={content.insight} />
      <Founders content={content.founders} />
      <FinalCta content={content.finalCta} />
    </>
  );
}
