import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReducedMotion } from "@/lib/design/useReducedMotion";

type Listener = (event: { matches: boolean }) => void;

function mockMatchMedia(initial: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches: initial,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, listener: Listener) => listeners.push(listener),
    removeEventListener: (_: string, listener: Listener) => {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return {
    fire(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((listener) => listener({ matches }));
    },
  };
}

describe("useReducedMotion", () => {
  it("reflects an initial reduce preference", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("defaults to false when no preference is set", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("tracks preference changes live", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => media.fire(true));
    expect(result.current).toBe(true);
    act(() => media.fire(false));
    expect(result.current).toBe(false);
  });
});

describe("global reduced-motion clamp", () => {
  it("globals.css collapses animation and transitions under reduce", async () => {
    const { readFileSync } = await import("node:fs");
    const path = await import("node:path");
    const css = readFileSync(
      path.resolve(__dirname, "../../app/globals.css"),
      "utf8",
    );
    const clamp = css.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*{([\s\S]*?)}\s*$/m,
    );
    expect(clamp).toBeTruthy();
    expect(css).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(css).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
  });
});
