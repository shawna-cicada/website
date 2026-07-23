import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** ink inverts the section onto the deep-ink surface */
  tone?: "paper" | "surface" | "ink";
  className?: string;
  "aria-labelledby"?: string;
};

const tones = {
  paper: "bg-paper text-ink",
  surface: "bg-lilac text-ink",
  ink: "on-ink bg-ink text-paper",
} as const;

/** Vertical page section with the brand's section rhythm baked in. */
export function Section({
  children,
  tone = "paper",
  className = "",
  ...rest
}: SectionProps) {
  return (
    <section className={`py-section ${tones[tone]} ${className}`} {...rest}>
      {children}
    </section>
  );
}
