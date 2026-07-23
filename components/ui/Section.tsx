import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** ink inverts the section onto the deep-ink surface */
  tone?: "ivory" | "surface" | "ink";
  className?: string;
  "aria-labelledby"?: string;
};

const tones = {
  ivory: "bg-ivory text-ink",
  surface: "bg-ivory-soft text-ink",
  ink: "on-ink bg-ink text-ivory",
} as const;

/** Vertical page section with the brand's section rhythm baked in. */
export function Section({
  children,
  tone = "ivory",
  className = "",
  ...rest
}: SectionProps) {
  return (
    <section className={`py-section ${tones[tone]} ${className}`} {...rest}>
      {children}
    </section>
  );
}
