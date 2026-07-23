"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  className?: string;
};

/**
 * Entrance reveal: rises and fades in when scrolled into view.
 * Deliberately framework-free (CSS animation + IntersectionObserver)
 * after Framer's reduced-motion hook proved unreliable in some
 * environments. Failure-proof by construction:
 * - The CSS in globals.css runs a guard animation that forces the
 *   content visible ~2.5s after paint even if JS/IO never runs.
 * - A <noscript> override in the root layout shows it instantly
 *   without JavaScript.
 * - The global reduced-motion clamp collapses both animations, so
 *   reduced-motion users see content immediately, unanimated.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.classList.add("reveal-in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-item ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
