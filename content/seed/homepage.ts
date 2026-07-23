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
    headline: "Growth Happens in Stages. Leadership Must Evolve With It.",
    copy: "Cicada Agility helps founders and leadership teams recognize what their company has outgrown, align around what comes next, and build the leadership and operating systems needed to grow with confidence.",
    primaryCta: { label: "Start the Growth Stage Assessment", href: "/assessments" },
    secondaryCta: { label: "Book a Discovery Call", href: "/book" },
  },
  recognition: {
    headline: "Your company may have outgrown the way it works.",
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
    headline: "Every stage of growth asks for a different company.",
    stages: [
      {
        name: "Shed",
        title: "Recognize what no longer serves the company.",
        copy: "The leadership habits, structures, roles, or ways of working that helped build the organization may now be limiting it.",
      },
      {
        name: "Emerge",
        title: "Create alignment for the next stage.",
        copy: "Clarify what is changing, how leadership must evolve, and what the organization now requires from its people and systems.",
      },
      {
        name: "Expand",
        title: "Build the capacity for what comes next.",
        copy: "Strengthen leadership, decision-making, operating rhythms, accountability, and ways of working so growth becomes sustainable.",
      },
    ],
  },
  services: {
    eyebrow: "How we help",
    headline: "Built around business needs, not consulting language.",
    items: [
      {
        title: "Leadership & Team Effectiveness",
        copy: "Build trust, clarity, and shared accountability as the leadership team evolves.",
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
        copy: "Build operating systems that help strategy move through the organization.",
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
        copy: "Help teams adopt AI practically, responsibly, and consistently.",
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
        copy: "Help founders evolve their role as the business grows.",
        examples: [
          "Founder transition and delegation",
          "Leadership team formation",
          "Co-founder alignment",
          "Scaling decision-making",
        ],
        href: "/how-we-help/founder-growth",
      },
    ],
    cta: { label: "Explore How We Help", href: "/how-we-help" },
  },
  assessments: {
    eyebrow: "Assessments",
    headline: "Start by understanding what your company has outgrown.",
    copy: "Our assessments help founders and leadership teams name the stage they are in, identify the friction beneath the symptoms, and focus on the capability that needs to evolve next.",
    items: [
      {
        title: "Growth Stage Assessment",
        summary: "Name the stage your company is in and what it is asking of leadership.",
        audience: "Founders and CEOs",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Start the assessment",
        featured: true,
      },
      {
        title: "Founder Growth Assessment",
        summary: "See where your role must evolve as the company scales.",
        audience: "Founders",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
      {
        title: "Leadership Team Alignment Check",
        summary: "Find out whether your team is aligned in practice, not just in principle.",
        audience: "Executive teams",
        duration: "About 15 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
      {
        title: "AI Readiness Assessment",
        summary: "Understand how ready your teams are to adopt AI consistently and responsibly.",
        audience: "Leadership teams",
        duration: "About 10 minutes",
        href: "/assessments",
        ctaLabel: "Learn more",
        featured: false,
      },
    ],
    cta: { label: "Explore all assessments", href: "/assessments" },
  },
  engagement: {
    eyebrow: "How an engagement works",
    headline: "A clear path from friction to capacity.",
    steps: [
      {
        step: "1",
        title: "Discover",
        copy: "Start with an assessment or a short conversation.",
      },
      {
        step: "2",
        title: "Diagnose",
        copy: "Identify the stage, friction, and capabilities that need to evolve.",
      },
      {
        step: "3",
        title: "Evolve",
        copy: "Choose a focused engagement designed around the company's current needs.",
      },
    ],
    engagements: [
      "Growth Stage Diagnostic",
      "Leadership Intensive",
      "Team Reset",
      "Operating Model or Product Effectiveness Assessment",
      "Scale Plan and Operational Roadmap",
      "Ongoing Leadership or Organizational Advisory",
    ],
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
    headline: "Ideas for companies in motion",
    featured: {
      category: "Leadership",
      title: "The habits that built your company may be the ones holding it back",
      excerpt: "Every growth stage rewards different leadership behavior. The habits that created early momentum — speed, involvement, personal ownership of every decision — quietly become the constraint the organization is working around.",
      href: "/insights",
    },
    cta: { label: "Explore All Insights", href: "/insights" },
  },
  founders: {
    eyebrow: "Who we are",
    headline: "Two perspectives. One connected system.",
    copy: "Cicada Agility brings together deep experience in leadership, coaching, product development, delivery, operations, organizational design, and transformation. Shawna and Julia work across the full system because company growth is rarely limited by only one team or one process.",
    people: [
      {
        name: "Shawna Cullinan",
        role: "Co-founder",
        bio: "Works with founders and leadership teams on leadership evolution, coaching, and the human side of organizational change.",
        imageSrc: "/founders/placeholder-shawna.svg",
        imageAlt: "Placeholder portrait of Shawna Cullinan — final photography pending",
      },
      {
        name: "Julia Kaissling",
        role: "Co-founder",
        bio: "Works with organizations on product development, delivery, operations, and the operating systems that let strategy move.",
        imageSrc: "/founders/placeholder-julia.svg",
        imageAlt: "Placeholder portrait of Julia Kaissling — final photography pending",
      },
    ],
    cta: { label: "Meet the Founders", href: "/about" },
  },
  finalCta: {
    headline: "What brought your company here may not take it forward.",
    copy: "Let's identify what your organization has outgrown and what must evolve next.",
    primaryCta: { label: "Book a Discovery Call", href: "/book" },
    secondaryCta: { label: "Start an Assessment", href: "/assessments" },
  },
};
