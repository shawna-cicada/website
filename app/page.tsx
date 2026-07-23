import { getHomepageContent } from "@/lib/cms";
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
 */
export default async function HomePage() {
  const content = await getHomepageContent();

  return (
    <>
      <Hero content={content.hero} />
      <Recognition content={content.recognition} />
      <Framework content={content.framework} />
      <HowWeHelp content={content.services} />
      <AssessmentFeature content={content.assessments} />
      <EngagementPath content={content.engagement} />
      <ClientLogos content={content.clients} />
      <FeaturedInsightSection content={content.insight} />
      <Founders content={content.founders} />
      <FinalCta content={content.finalCta} />
    </>
  );
}
