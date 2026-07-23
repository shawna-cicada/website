import type { ElementType, ReactNode } from "react";

/* --- Eyebrow ------------------------------------------------ */

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={
        "font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep [.on-ink_&]:text-melrose " +
        className
      }
    >
      {children}
    </p>
  );
}

/* --- Heading ------------------------------------------------ */

type HeadingLevel = 1 | 2 | 3 | 4;

const headingStyles: Record<HeadingLevel, string> = {
  1: "font-display text-5xl font-medium leading-[1.05] tracking-tight",
  2: "font-display text-4xl font-medium leading-[1.1] tracking-tight",
  3: "font-display text-3xl font-medium leading-[1.15]",
  4: "font-display text-2xl font-medium leading-snug",
};

export function Heading({
  level,
  visualLevel,
  children,
  id,
  className = "",
}: {
  /** Semantic heading level — one h1 per page. */
  level: HeadingLevel;
  /** Optional visual override so semantics and size can differ. */
  visualLevel?: HeadingLevel;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const Tag = `h${level}` as ElementType;
  return (
    <Tag id={id} className={`${headingStyles[visualLevel ?? level]} ${className}`}>
      {children}
    </Tag>
  );
}

/* --- Body text ---------------------------------------------- */

export function Text({
  children,
  size = "base",
  muted = false,
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "base" | "lg";
  muted?: boolean;
  className?: string;
}) {
  const sizes = { sm: "text-sm", base: "text-base", lg: "text-lg" } as const;
  return (
    <p
      className={`${sizes[size]} ${
        muted ? "text-slate [.on-ink_&]:text-paper/70" : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}
