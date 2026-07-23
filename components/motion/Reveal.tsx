"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  className?: string;
};

/**
 * Entrance reveal: rises and fades in when scrolled into view.
 * - Reduced motion: renders a static element, no animation at all.
 * - No JavaScript: a <noscript> override in the root layout forces
 *   [data-reveal] elements visible, so content never stays hidden.
 * - Runs once; animating only transform/opacity avoids layout shift.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
