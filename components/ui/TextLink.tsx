import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  /** arrow adds a directional cue for CTA-style links */
  arrow?: boolean;
  className?: string;
  target?: string;
  rel?: string;
};

/**
 * Editorial text link: moss on ivory (AA), chartreuse on ink,
 * with an animated underline that grows on hover and collapses
 * to a static underline under reduced motion (CSS-only).
 */
export function TextLink({
  href,
  children,
  arrow = false,
  className = "",
  target,
  rel,
}: TextLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={
        "group inline-flex items-center gap-1.5 font-medium text-moss [.on-ink_&]:text-chartreuse " +
        className
      }
    >
      <span
        className={
          "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat " +
          "transition-[background-size] duration-[var(--duration-base)] ease-[var(--ease-out-soft)] " +
          "group-hover:bg-[length:100%_1.5px] group-focus-visible:bg-[length:100%_1.5px] " +
          "motion-reduce:underline motion-reduce:underline-offset-4"
        }
      >
        {children}
      </span>
      {arrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          →
        </span>
      ) : null}
    </Link>
  );
}
