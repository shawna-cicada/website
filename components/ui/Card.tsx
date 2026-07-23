import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** lift adds the subtle hover elevation used for interactive cards */
  interactive?: boolean;
  /** accent keeps the meadow top rule always on (quiet differentiation) */
  accent?: boolean;
  /** compact tightens padding for dense grids (e.g. 4-across) */
  padding?: "default" | "compact";
  tone?: "surface" | "paper" | "ink";
  className?: string;
};

const cardPaddings = {
  default: "p-6 sm:p-8",
  compact: "p-5 sm:p-6",
} as const;

const cardTones = {
  surface: "bg-lilac text-ink",
  paper: "bg-paper text-ink border border-ink/10",
  ink: "bg-ink text-paper on-ink",
} as const;

/**
 * Editorial card: restrained radius, no drop-shadow chrome.
 * Interactive cards lift slightly and sharpen their top rule on hover;
 * the transition collapses under reduced motion via the global clamp.
 */
export function Card({
  children,
  interactive = false,
  accent = false,
  padding = "default",
  tone = "surface",
  className = "",
}: CardProps) {
  return (
    <div
      className={
        `relative rounded-sm ${cardPaddings[padding]} ${cardTones[tone]} ` +
        "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-sm " +
        (accent ? "before:bg-meadow " : "before:bg-meadow/0 ") +
        (interactive
          ? "transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)] " +
            "hover:-translate-y-1 hover:shadow-[0_12px_32px_-16px_rgba(30,42,68,0.35)] hover:before:bg-meadow " +
            "before:transition-colors before:duration-[var(--duration-base)] "
          : "") +
        className
      }
    >
      {children}
    </div>
  );
}
