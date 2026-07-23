import type {
  Engagement,
  HowWeHelpContent,
  PracticeArea,
} from "@/lib/cms/types";

/**
 * Practice-area and engagement seed content — served through the CMS
 * adapter (lib/cms); replaced by Sanity in Phase 2 without page rewrites.
 *
 * Positioning rule (from WEBSITE_REDESIGN.md): business growth and
 * organizational evolution lead; Agile, Lean, product operations,
 * portfolio management, and facilitation appear only inside
 * supportingCapabilities.
 */

export const howWeHelpContent: HowWeHelpContent = {
  eyebrow: "How we help",
  headline: "The challenge is rarely just leadership, process, or culture.",
  copy: "As companies grow, these systems affect one another. Cicada Agility works across leadership, operations, product, people, and ways of working to solve the underlying conditions that create friction.",
  systemNarrative: [
    "Companies don't outgrow everything at once. Strategy stays clear at the top while delivery stalls. The leadership team holds together while the structure underneath it strains. Friction shows up in one place — and starts in another.",
    "That is why we work as one connected system across leadership, operations, product, people, and ways of working. Each practice below is a different doorway into the same work: helping the company evolve how it leads and operates for the stage it is entering — not the one it just left. Most engagements draw on more than one.",
  ],
  engagementsHeadline: "Focused engagements",
  engagementsCopy:
    "Every engagement is designed around the company's current stage and need — these are the shapes the work most often takes.",
  cta: { label: "Discuss Your Needs", href: "/book" },
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: "leadership-team-effectiveness",
    name: "Leadership & Team Effectiveness",
    headline: "Your leadership team is working harder — and agreeing less.",
    summary:
      "Build trust, clarity, and shared accountability at the top. We work with executive teams on how they decide, disagree, and commit — so the team leading the company works as well as the people in it.",
    whoFor: [
      "CEOs and their executive teams",
      "Leadership teams that are new, newly combined, or newly stretched",
      "Founder-led companies formalizing an executive team for the first time",
    ],
    problems: [
      "Leaders agree in the meeting but act from different assumptions afterward",
      "Decisions escalate upward because ownership is unclear",
      "Accountability blurs as the organization adds layers",
      "Trust is strained by growth, restructuring, or missed commitments",
      "Executive meetings are crowded, long, and still not decisive",
    ],
    workOn: [
      "Executive team alignment on direction and priorities",
      "Decision rights and accountability",
      "The top team's operating cadence and meeting architecture",
      "Leadership intensives and team effectiveness work",
      "Executive and founder coaching",
      "Off-sites and structured working sessions",
    ],
    leaveWith: [
      "Decision rights the whole team actually uses",
      "A shared, sequenced set of priorities",
      "Working agreements for how the team disagrees and commits",
      "An operating cadence that produces decisions, not just updates",
      "A stronger foundation of trust to lead the next stage from",
    ],
    formats: ["Leadership Intensive", "Team Reset", "Growth Stage Diagnostic", "Ongoing Leadership and Organizational Advisory"],
    supportingCapabilities: [
      "Team diagnostics",
      "Executive coaching",
      "Facilitation",
    ],
    relatedPractices: ["founder-growth", "organizational-effectiveness"],
    relatedInsights: [
      {
        title: "The habits that built your company may be the ones holding it back",
        href: "/insights",
      },
    ],
    seoDescription:
      "Build trust, clarity, and shared accountability as your leadership team evolves. Executive alignment, decision rights, leadership intensives, and coaching from Cicada Agility.",
  },
  {
    slug: "organizational-effectiveness",
    name: "Organizational Effectiveness",
    headline: "Strategy is clear at the top — and blurry everywhere else.",
    summary:
      "Build the operating system your strategy moves through. Structure, priorities, governance, and delivery — matched to the stage the company is actually in, not the one it just left.",
    whoFor: [
      "Executive and operations leaders in growing companies",
      "Product and delivery organizations that have outgrown their structure",
      "Companies where headcount grew faster than the operating model",
    ],
    problems: [
      "Teams are busy, but the outcomes that matter are not moving",
      "Priorities compete because there is no shared mechanism for choosing",
      "Governance is either missing or so heavy it slows everything down",
      "Delivery is unpredictable and no one can say exactly why",
      "The organization design still reflects a company two stages smaller",
    ],
    workOn: [
      "Operating model design",
      "Portfolio, prioritization, and resource allocation",
      "Governance and decision-making structures",
      "Product and delivery effectiveness",
      "Organizational design and ways of working",
      "How strategy is translated, communicated, and reviewed",
    ],
    leaveWith: [
      "An operating model matched to the company's current stage",
      "A prioritization mechanism leaders trust and use",
      "Governance that speeds decisions instead of collecting them",
      "A grounded read on delivery health and what to fix first",
      "An organization design the strategy can actually move through",
    ],
    formats: [
      "Operating Model and Product Effectiveness Assessment",
      "Scale Plan and Operational Roadmap",
      "Growth Stage Diagnostic",
      "Ongoing Leadership and Organizational Advisory",
    ],
    supportingCapabilities: [
      "Lean and Agile ways of working",
      "Product operations and PMO evolution",
      "Portfolio management",
    ],
    relatedPractices: ["leadership-team-effectiveness", "ai-enablement"],
    relatedInsights: [
      {
        title: "The habits that built your company may be the ones holding it back",
        href: "/insights",
      },
    ],
    seoDescription:
      "Operating model design, prioritization, governance, and delivery effectiveness for growing companies. Cicada Agility builds the systems strategy moves through.",
  },
  {
    slug: "ai-enablement",
    name: "AI Enablement & Working Norms",
    headline: "AI adoption is happening — inconsistently, and without shared norms.",
    summary:
      "Turn scattered AI experimentation into a shared organizational capability. Practical norms, workable guardrails, and hands-on enablement — grounded in your teams' real work, not demos.",
    whoFor: [
      "Leadership teams deciding what AI should mean for their organization",
      "Operations and people leaders responsible for how work changes",
      "Companies with pockets of AI experimentation and no shared approach",
    ],
    problems: [
      "Individual experimentation is everywhere; organizational learning is nowhere",
      "Nobody is sure what is allowed, safe, or expected",
      "Adoption is deepening the gap between early adopters and everyone else",
      "Leaders disagree — quietly — about where AI actually helps",
      "Policy exists on paper but not in the daily flow of work",
    ],
    workOn: [
      "AI readiness and opportunity assessment",
      "Team working agreements for AI-assisted work",
      "Governance and guardrails people can actually follow",
      "Role and workflow redesign where AI changes the work",
      "Leadership alignment on where AI creates value",
      "Practical enablement workshops with real work, not demos",
    ],
    leaveWith: [
      "Shared norms for how teams use AI day to day",
      "Guardrails that manage risk without stalling adoption",
      "A prioritized map of where AI helps this business",
      "Teams that have practiced on their own real work",
      "A leadership team aligned on pace and investment",
    ],
    formats: ["Growth Stage Diagnostic", "Ongoing Leadership and Organizational Advisory"],
    supportingCapabilities: [
      "Enablement workshop design",
      "Facilitation",
      "Change management",
    ],
    relatedPractices: ["organizational-effectiveness", "leadership-team-effectiveness"],
    relatedInsights: [
      {
        title: "The habits that built your company may be the ones holding it back",
        href: "/insights",
      },
    ],
    seoDescription:
      "Adopt AI practically, responsibly, and consistently. Readiness assessment, working norms, guardrails, and enablement workshops from Cicada Agility.",
  },
  {
    slug: "founder-growth",
    name: "Founder Challenges: Seed to Scale",
    headline: "The company scaled. The founder's role has to change with it.",
    summary:
      "Evolve the founder's role as the company scales. Delegation with the systems to make it safe, a leadership team that exists in practice, and decision-making that no longer routes through one person.",
    whoFor: [
      "Founders and co-founders of growing companies",
      "Founder-CEOs building their first real leadership team",
      "Boards and investors supporting a founder through a stage change",
    ],
    problems: [
      "The founder is still the center of too many decisions",
      "Delegation feels risky because the systems to support it are missing",
      "Co-founders are drifting on direction, roles, or pace",
      "The leadership team exists on paper but not in practice",
      "Heroic execution keeps saving the company — and capping it",
    ],
    workOn: [
      "Founder transition and delegation",
      "Leadership team formation",
      "Co-founder alignment",
      "Scaling decision-making beyond the founder",
      "Moving from heroic execution to organizational capacity",
      "Preparing the company for its next stage",
    ],
    leaveWith: [
      "A delegation map with the systems to make it safe",
      "A leadership team designed for the next stage, not the last one",
      "Decision-making that no longer routes through one person",
      "A personal operating model for the founder's evolving role",
      "Clarity on what the next stage requires — before it arrives",
    ],
    formats: ["Growth Stage Diagnostic", "Leadership Intensive", "Ongoing Leadership and Organizational Advisory"],
    supportingCapabilities: ["Founder and executive coaching", "Facilitation"],
    relatedPractices: ["leadership-team-effectiveness", "organizational-effectiveness"],
    relatedInsights: [
      {
        title: "The habits that built your company may be the ones holding it back",
        href: "/insights",
      },
    ],
    seoDescription:
      "Founder transition, delegation, co-founder alignment, and leadership team formation. Cicada Agility helps founders evolve their role as the business grows.",
  },
];

export const engagements: Engagement[] = [
  {
    name: "Growth Stage Diagnostic",
    summary:
      "Name the stage the company is in, the friction beneath the symptoms, and the capabilities that must evolve next.",
    bestFor: "Founders and leadership teams who want a grounded starting point",
    format: "2–4 weeks · interviews, diagnostics, and a working session",
    practices: [
      "leadership-team-effectiveness",
      "organizational-effectiveness",
      "ai-enablement",
      "founder-growth",
    ],
  },
  {
    name: "Leadership Intensive",
    summary:
      "A focused alignment sprint for the top team: direction, decision rights, and the working agreements to hold them.",
    bestFor: "Executive teams that need alignment to become real, fast",
    format: "2–3 days together plus structured follow-through",
    practices: ["leadership-team-effectiveness", "founder-growth"],
  },
  {
    name: "Team Reset",
    summary:
      "Rebuild the trust, clarity, and cadence of a team that matters too much to leave stuck.",
    bestFor: "Critical teams where friction has become the operating system",
    format: "4–6 weeks · diagnostic, facilitated sessions, new agreements",
    practices: ["leadership-team-effectiveness"],
  },
  {
    name: "Executive & Leadership Coaching",
    summary:
      "One-on-one coaching for founders, executives, and rising leaders — grounded in 360° feedback and focused on the behaviors that shape the culture around them.",
    bestFor:
      "Individual leaders growing into a bigger role, a stage change, or hard feedback",
    format: "3–6 month arcs · recurring 1:1 sessions · 360° feedback with debrief",
    practices: ["leadership-team-effectiveness", "founder-growth"],
    audience: "individual",
  },
  {
    name: "Operating Model and Product Effectiveness Assessment",
    summary:
      "A clear-eyed read on how work actually moves through the organization — and where it stalls.",
    bestFor: "Companies whose delivery has stopped keeping pace with ambition",
    format: "3–6 weeks · assessment with a prioritized findings review",
    practices: ["organizational-effectiveness"],
  },
  {
    name: "Scale Plan and Operational Roadmap",
    summary:
      "A sequenced plan for evolving structure, systems, and ways of working ahead of the next stage of growth.",
    bestFor: "Leadership teams preparing to scale deliberately, not reactively",
    format: "4–8 weeks · co-designed roadmap with owners and sequencing",
    practices: ["organizational-effectiveness", "founder-growth"],
  },
  {
    name: "Ongoing Leadership and Organizational Advisory",
    summary:
      "A retained partnership through the messy middle of organizational evolution — leadership, systems, and change that sticks.",
    bestFor: "Companies in active transition that want continuity, not projects",
    format: "Monthly or quarterly rhythm, shaped to the company",
    practices: [
      "leadership-team-effectiveness",
      "organizational-effectiveness",
      "ai-enablement",
      "founder-growth",
    ],
  },
];
