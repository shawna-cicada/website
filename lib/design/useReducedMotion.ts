"use client";

import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns true when the visitor prefers reduced motion.
 * JS-driven motion (marquees, scroll-linked sequences) must branch on this;
 * CSS animation is already collapsed globally in globals.css.
 * Server snapshot is false: markup renders motion-capable, and the global
 * CSS clamp still protects reduced-motion users before hydration.
 */
export function useReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
