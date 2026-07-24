import type { HomepageContent } from "@/lib/cms/types";

/**
 * Homepage seed content — production copy from WEBSITE_REDESIGN.md.
 * Served through the CMS adapter (lib/cms); replaced by Sanity in Phase 2.
 * Client logos and founder portraits are PLACEHOLDERS pending approved
 * assets — do not ship placeholder logos to production.
 */
export const homepageContent: HomepageContent = {
  hero: {
    eyebrow: "Leadership evolution for growing companies",
    headline: "Growth happens in stages. Leadership must evolve with it.",
    copy: "We help founders and leadership teams evolve how the company leads and operates as it grows.",
    primaryCta: { label: "Start the Growth Stage Assessment", href: "/assessments" },
    secondaryCta: { label: "Book a Free Discovery Call", href: "/book" },
  },
  recognition: {
    headline: "Does any of this sound familiar?",
    statements: [
      "Decisions are taking longer.",
      "The founder is still carrying too much.",
      "Leaders are aligned in the meeting but not in execution.",
      "Teams are moving, but the business is not moving fast enough.",
      "Accountability becomes less clear as the organization grows.",
      "The systems that once created speed now create friction.",
    ],
    cta: { label: "See what stage you are in", href: "/assessments" },
  },
  framework: {
    eyebrow: "The Cicada Framework",
    headline: "Every stage of growth asks the company to evolve.",
    // Stage order confirmed by the founder (D-019): Emerge → Shed → Expand.
    stages: [
      {
        name: "Emerge",
        title: "Create alignment for the next stage.",
        copy: "Align leadership around what is changing and what it requires.",
      },
      {
        name: "Shed",
        title: "Recognize what no longer serves the company.",
        copy: "Name the habits, structures, and roles the company has outgrown.",
      },
      {
        name: "Expand",
        title: "Build the capacity for what comes next.",
        copy: "Strengthen the leadership and operating systems that make growth sustainable.",
      },
    ],
  },
  services: {
    eyebrow: "How we help",
    headline: "Four practices, one connected system.",
    copy: "Growth friction moves between leadership, the organization, and ways of working, so the four practices are built to work together. Each one is a different doorway into the same system.",
    items: [
      {
        title: "Leadership & Team Effectiveness",
        copy: "For the team at the top. Trust, decision rights, and accountability, so the group leading the company works as one team rather than a collection of strong individuals.",
        examples: [
          "Executive team alignment",
          "Leadership intensives",
          "Decision rights and accountability",
          "Executive and founder coaching",
        ],
        href: "/how-we-help/leadership-team-effectiveness",
      },
      {
        title: "Organizational Effectiveness",
        copy: "For the organization itself. The operating model, priorities, governance, and delivery systems your strategy moves through, matched to the stage you are actually in.",
        examples: [
          "Operating model design",
          "Product and delivery effectiveness",
          "Portfolio and prioritization",
          "Governance and decision-making",
        ],
        href: "/how-we-help/organizational-effectiveness",
      },
      {
        title: "AI Enablement & Working Norms",
        copy: "For how your teams work. Practical AI adoption with shared norms and workable guardrails, grounded in your teams' real work rather than demos.",
        examples: [
          "AI readiness and opportunity assessment",
          "Team working agreements",
          "Governance and guardrails",
          "Practical enablement workshops",
        ],
        href: "/how-we-help/ai-enablement",
      },
      {
        title: "Founder Challenges: Seed to Scale",
        copy: "For you, the founder. Your role has to evolve as the company scales: delegation that feels safe, a leadership team that is real, and decisions that no longer route through you.",
        examples: [
          "Founder transition and delegation",
          "Leadership team formation",
          "Co-founder alignment",
          "Scaling decision-making",
        ],
        href: "/how-we-help/founder-growth",
      },
    ],
    cta: { label: "Explore how we help", href: "/how-we-help" },
  },
  assessments: {
    eyebrow: "Assessments",
    headline: "Find out what your company has outgrown.",
    copy: "Ten minutes to name your stage, the friction beneath it, and what needs to evolve next.",
    items: [
      {
        title: "Growth Stage Assessment",
        summary: "Name your stage, and what it's asking of you.",
        audience: "Founders and CEOs",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Start the assessment",
        featured: true,
      },
      {
        title: "Founder Growth Assessment",
        summary: "Where your role must evolve next.",
        audience: "Founders",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
      {
        title: "Leadership Team Alignment Check",
        summary: "Aligned in principle, but in practice?",
        audience: "Executive teams",
        duration: "About 15 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
      {
        title: "AI Readiness Assessment",
        summary: "How ready are your teams, really?",
        audience: "Leadership teams",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
    ],
    cta: { label: "Explore all assessments", href: "/assessments" },
  },
  clients: {
    headline: "Experience supporting teams from startup to enterprise",
    // PLACEHOLDER records — replace with approved client logos (D-013).
    logos: [
      { name: "Placeholder client 1", alt: "Placeholder client logo 1", src: "/clients/placeholder-1.svg", width: 150, height: 48 },
      { name: "Placeholder client 2", alt: "Placeholder client logo 2", src: "/clients/placeholder-2.svg", width: 150, height: 48 },
      { name: "Placeholder client 3", alt: "Placeholder client logo 3", src: "/clients/placeholder-3.svg", width: 150, height: 48 },
      { name: "Placeholder client 4", alt: "Placeholder client logo 4", src: "/clients/placeholder-4.svg", width: 150, height: 48 },
      { name: "Placeholder client 5", alt: "Placeholder client logo 5", src: "/clients/placeholder-5.svg", width: 150, height: 48 },
      { name: "Placeholder client 6", alt: "Placeholder client logo 6", src: "/clients/placeholder-6.svg", width: 150, height: 48 },
    ],
  },
  insight: {
    eyebrow: "Featured insight",
    headline: "Articles and Insights",
    featured: {
      category: "Leadership",
      title: "The habits that built your company may be the ones holding it back",
      excerpt: "Every growth stage rewards different leadership behavior. The habits that created early momentum (speed, involvement, personal ownership of every decision) quietly become the constraint the organization is working around.",
      href: "/insights",
    },
    cta: { label: "Explore All Insights", href: "/insights" },
  },
  founders: {
    eyebrow: "Who we are",
    headline: "Two perspectives. One connected system.",
    copy: "Leadership, coaching, product, delivery, operations, organizational design: we work across the whole system, because growth is rarely limited by one team or one process.",
    people: [
      {
        name: "Shawna Cullinan",
        role: "Co-founder",
        bio: "Works with organizations on product development, delivery, operations, and the operating systems that let strategy move.",
        imageSrc: "/founders/placeholder-shawna.svg",
        imageAlt: "Placeholder portrait of Shawna Cullinan, final photography pending",
      },
      {
        name: "Julia Kaissling",
        role: "Co-founder",
        bio: "Works with founders and leadership teams on leadership evolution, coaching, and the human side of organizational change.",
        imageSrc: "/founders/placeholder-julia.svg",
        imageAlt: "Placeholder portrait of Julia Kaissling, final photography pending",
      },
    ],
    cta: { label: "Meet the Founders", href: "/about" },
  },
  finalCta: {
    headline: "What brought your company here may not take it forward.",
    copy: "Let's identify what your organization has outgrown and what must evolve next.",
    primaryCta: { label: "Book a Free Discovery Call", href: "/book" },
    secondaryCta: { label: "Start an Assessment", href: "/assessments" },
    bookingOptions: [
      {
        label: "Discovery Call",
        note: "30 minutes. A first conversation about where your company is.",
        free: true,
        ctaLabel: "Book a Discovery Call",
        href: "/book#discovery-call",
      },
      {
        label: "Assessment Debrief",
        note: "60 minutes. Walk through your assessment results together.",
        ctaLabel: "Book a Debrief",
        href: "/book#assessment-debrief",
      },
      {
        label: "Coaching Session",
        note: "For leaders we already coach. Book your next session.",
        ctaLabel: "Book Coaching",
        href: "/book#coaching-session",
      },
    ],
  },
};
