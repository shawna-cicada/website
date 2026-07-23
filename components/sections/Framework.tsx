"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { GrowthRings } from "@/components/brand/GrowthRings";
import type { FrameworkStage, HomepageContent } from "@/lib/cms/types";

/**
 * Shed → Emerge → Expand.
 * Scroll-linked: as the visitor moves through the section, each stage
 * activates in turn — opacity and a growth-ring motif expanding from
 * constrained to open. Motion carries the metaphor; it never gates the
 * content (stages stay in the DOM and readable at every scroll position).
 * Reduced motion: a fully static three-column layout.
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
      className="bg-lilac py-section"
    >
      <Container className="flex flex-col gap-stack">
        <div className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={2} id="framework-heading" className="mt-2">
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

function StageCard({
  stage,
  index,
  ring,
}: {
  stage: FrameworkStage;
  index: number;
  /** Growth-ring motif; scroll variant passes an animated wrapper. */
  ring?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-sm bg-paper p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
          {String(index + 1).padStart(2, "0")} — {stage.name}
        </span>
        {ring ?? <GrowthRings size={44} className="text-ink/60" />}
      </div>
      <h3 className="font-display text-2xl font-medium leading-snug">
        {stage.title}
      </h3>
      <Text muted>{stage.copy}</Text>
    </div>
  );
}

function StaticStages({ stages }: { stages: FrameworkStage[] }) {
  return (
    <ol className="grid gap-6 lg:grid-cols-3">
      {stages.map((stage, index) => (
        <li key={stage.name}>
          <StageCard stage={stage} index={index} />
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
        className="mb-8 h-[3px] origin-left rounded-full bg-meadow"
        style={{ scaleX: scrollYProgress }}
      />
      <ol ref={ref} className="grid gap-6 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <ScrollStage
            key={stage.name}
            stage={stage}
            index={index}
            progress={scrollYProgress}
            count={stages.length}
          />
        ))}
      </ol>
    </div>
  );
}

function ScrollStage({
  stage,
  index,
  progress,
  count,
}: {
  stage: FrameworkStage;
  index: number;
  progress: MotionValue<number>;
  count: number;
}) {
  // Each stage activates across its slice of the scroll range.
  // Text stays fully opaque at every scroll position — motion may carry
  // the metaphor but must never reduce readability (WCAG contrast holds
  // in every state). Activation shows via translate + ring growth only.
  const start = index / (count + 1);
  const end = (index + 1) / count;
  const y = useTransform(progress, [start, end], [24, 0]);
  const ringScale = useTransform(progress, [start, end], [0.6, 1]);

  return (
    <motion.li style={{ y }} className="h-full">
      <StageCard
        stage={stage}
        index={index}
        ring={
          <motion.span style={{ scale: ringScale }} className="inline-flex">
            <GrowthRings size={44} className="text-ink/60" />
          </motion.span>
        }
      />
    </motion.li>
  );
}
