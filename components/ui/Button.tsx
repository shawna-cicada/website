import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = AsButton | AsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xs font-label font-semibold " +
  "tracking-wide transition-colors duration-[var(--duration-quick)] " +
  "disabled:opacity-45 disabled:cursor-not-allowed select-none";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-soft " +
    "[.on-ink_&]:bg-paper [.on-ink_&]:text-ink [.on-ink_&]:hover:bg-lilac",
  accent: "bg-meadow text-ink hover:bg-meadow-bright",
  outline:
    "border border-ink/40 text-ink hover:border-ink hover:bg-ink/5 " +
    "[.on-ink_&]:border-paper/40 [.on-ink_&]:text-paper [.on-ink_&]:hover:border-paper [.on-ink_&]:hover:bg-paper/10",
  ghost:
    "text-ink hover:bg-ink/5 [.on-ink_&]:text-paper [.on-ink_&]:hover:bg-paper/10",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 text-sm",
  md: "min-h-11 px-6 text-base", /* 44px touch target */
  lg: "min-h-12 px-8 text-lg",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...rest
  } = props;
  const classes = `${base} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;

  if ("href" in props && typeof props.href === "string") {
    const { href, target, rel, onClick } = props as AsLink;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {children}
    </button>
  );
}
