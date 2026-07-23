import type { AboutContent, FounderProfileFull } from "@/lib/cms/types";

/**
 * About-page seed content, served through the CMS adapter.
 * Founder bios are PLACEHOLDER copy drafted from the redesign brief's
 * description of the founders — flagged draftBio: true and visibly
 * marked on the page until Shawna and Julia approve final wording.
 */

export const aboutContent: AboutContent = {
  hero: {
    headline: "We help companies evolve as they grow.",
    copy: "Cicada Agility works with founders and leadership teams to recognize what their company has outgrown, evolve how they lead and operate, and build the clarity, trust, and systems the next stage requires.",
  },
  origin: {
    headline: "Why a cicada?",
    paragraphs: [
      "Cicadas do not grow in one smooth, continuous line. They live in stages — long seasons of steady growth underground, then an emergence into daylight, the shedding of the shell that carried them there, and wings expanding into a capacity they did not have before.",
      "Companies grow the same way. Each stage asks something new to emerge, something to be shed, and greater capacity to expand. The habits, structures, and ways of working that built the last stage are often the very things limiting the next one.",
      "That is the work we do: helping leadership teams notice which stage they are in, let go of what no longer serves them, and build what the next stage asks of them.",
    ],
  },
  beliefs: {
    headline: "What we believe",
    items: [
      "Your company is not broken. It may simply have outgrown the leadership habits, operating structures, and ways of working that brought it here.",
      "Growth problems are rarely confined to one team, one process, or one leader — they live in the connections between them.",
      "Lasting change is built with the people who must carry it, not delivered to them.",
      "The goal of outside help is internal capability, not dependence.",
    ],
  },
  system: {
    headline: "We work across the whole system",
    copy: "Leadership, operations, product, people, and ways of working affect one another as a company grows. We deliberately work across all of them — because solving one part of the system in isolation usually moves the friction rather than removing it.",
  },
  principles: {
    headline: "How we work",
    items: [
      "Name the real problem, not just the visible symptom.",
      "Work with the system, not one isolated team.",
      "Create clarity before adding process.",
      "Design change with the people who must carry it.",
      "Use reflection to turn experience into evolution.",
      "Leave clients with greater internal capability, not dependence.",
    ],
  },
  clientExperience: {
    headline: "Experience from startup to enterprise",
    copy: "We have supported founders, leadership teams, and organizations across stages — from seed-stage companies forming their first leadership team to enterprises evolving how strategy moves through thousands of people. Client logos and stories appear here only with written permission.",
  },
  cta: {
    headline: "Let's find out what your company is ready to become.",
    copy: "Start with an assessment, or talk with us directly about the change your organization is navigating.",
    primaryCta: { label: "Book a Discovery Call", href: "/book" },
    secondaryCta: { label: "Start with an assessment", href: "/assessments" },
  },
};

export const founders: FounderProfileFull[] = [
  {
    name: "Shawna Cullinan",
    role: "Co-founder",
    // PLACEHOLDER bio — drafted from the brief; awaiting editorial review.
    bio: "Shawna works with organizations on the systems growth runs on: product development, delivery, operations, operating model design, and ways of working. Her work helps strategy actually move through an organization — connecting what leadership intends with what teams experience day to day.",
    draftBio: true,
    expertise: [
      "Operating model and organizational design",
      "Product development and delivery effectiveness",
      "Portfolio, prioritization, and governance",
      "Transformation and ways of working",
    ],
    selectedExperience: [
      "Operating model and product effectiveness assessments",
      "Scale plans and operational roadmaps for growth companies",
      "Guiding delivery organizations through stage transitions",
    ],
    linkedInUrl: undefined, // To be supplied before launch.
    speakingTopics: [
      "Building operating systems that let strategy move",
      "Practical AI working norms for real teams",
    ],
    imageSrc: "/founders/placeholder-shawna.svg",
    imageAlt: "Placeholder portrait of Shawna Cullinan — final photography pending",
  },
  {
    name: "Julia Kaissling",
    role: "Co-founder",
    // PLACEHOLDER bio — drafted from the brief; awaiting editorial review.
    bio: "Julia works with founders and leadership teams on the human side of growth: leadership evolution, executive coaching, team effectiveness, and the trust and accountability that make scale possible. Her work centers on helping leaders evolve their own role as deliberately as they evolve their organization.",
    draftBio: true,
    expertise: [
      "Leadership and executive coaching",
      "Team effectiveness and alignment",
      "Founder transition and delegation",
      "Organizational culture through change",
    ],
    selectedExperience: [
      "Coaching founders and executives from seed stage through scale",
      "Leadership team formation and reset engagements",
      "Facilitating executive off-sites and working sessions",
    ],
    linkedInUrl: undefined, // To be supplied before launch.
    speakingTopics: [
      "Growth happens in stages — leadership must evolve with it",
      "From founder-led to leadership-team-led",
    ],
    imageSrc: "/founders/placeholder-julia.svg",
    imageAlt: "Placeholder portrait of Julia Kaissling — final photography pending",
  },
];
