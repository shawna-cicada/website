"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Text";
import type { FrameworkStage, HomepageContent } from "@/lib/cms/types";

/**
 * Shed → Emerge → Expand, on the deep-ink surface: rule-led columns
 * with thin Mountain Meadow numerals (per the approved design).
 * Scroll-linked: a progress rule grows and each column settles into
 * place as the visitor moves through the section. Text is always full
 * contrast — motion carries the metaphor but never gates readability.
 * Reduced motion: fully static columns.
 */
export function Framework({
  content,
}: {
  content: HomepageContent["framework"];
}) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="framework-heading"
      className="on-ink bg-ink py-section text-paper"
    >
      <Container className="flex flex-col gap-stack">
        <div className="max-w-3xl">
          <p className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow">
            {content.eyebrow}
          </p>
          <Heading level={2} visualLevel={3} id="framework-heading" className="mt-3">
            {content.headline}
          </Heading>
        </div>
        {reduced ? (
          <StaticStages stages={content.stages} />
        ) : (
          <ScrollLinkedStages stages={content.stages} />
        )}
      </Container>
    </section>
  );
}

function StageColumn({
  stage,
  index,
}: {
  stage: FrameworkStage;
  index: number;
}) {
  return (
    <div className="flex h-full flex-col gap-4 border-l border-paper/15 pl-8">
      <span
        aria-hidden="true"
        className="font-label text-6xl font-extralight leading-none text-meadow"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-label text-sm font-semibold uppercase tracking-[0.2em] text-paper/70">
        {stage.name}
      </span>
      <h3 className="font-display text-2xl font-bold leading-snug">
        {stage.title}
      </h3>
      <Text muted>{stage.copy}</Text>
    </div>
  );
}

function StaticStages({ stages }: { stages: FrameworkStage[] }) {
  return (
    <ol className="grid gap-10 lg:grid-cols-3">
      {stages.map((stage, index) => (
        <li key={stage.name} className="h-full">
          <StageColumn stage={stage} index={index} />
        </li>
      ))}
    </ol>
  );
}

function ScrollLinkedStages({ stages }: { stages: FrameworkStage[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });

  return (
    <div>
      {/* Progress rule: constrained line growing to full width */}
      <motion.div
        aria-hidden
        className="mb-10 h-[2px] origin-left rounded-full bg-meadow/80"
        style={{ scaleX: scrollYProgress }}
      />
      {/* Columns are static so the three numerals share one top line
          (founder review); the growing rule carries the motion. */}
      <ol ref={ref} className="grid gap-10 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <li key={stage.name} className="h-full">
            <StageColumn stage={stage} index={index} />
          </li>
        ))}
      </ol>
    </div>
  );
}

