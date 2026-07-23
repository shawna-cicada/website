import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** ink inverts the section onto the deep-ink surface */
  tone?: "paper" | "surface" | "ink";
  /** compact halves the vertical rhythm for denser pages */
  spacing?: "default" | "compact";
  className?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const tones = {
  paper: "bg-paper text-ink",
  surface: "bg-lilac text-ink",
  ink: "on-ink bg-ink text-paper",
} as const;

const spacings = {
  default: "py-section",
  compact: "py-10 sm:py-14",
} as const;

/** Vertical page section with the brand's section rhythm baked in. */
export function Section({
  children,
  tone = "paper",
  spacing = "default",
  className = "",
  ...rest
}: SectionProps) {
  return (
    <section
      className={`${spacings[spacing]} ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}
