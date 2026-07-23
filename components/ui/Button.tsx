import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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
};

export type ButtonProps = AsButton | AsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xs font-sans font-semibold " +
  "tracking-wide transition-colors duration-[var(--duration-quick)] " +
  "disabled:opacity-45 disabled:cursor-not-allowed select-none";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-ink-soft " +
    "[.on-ink_&]:bg-ivory [.on-ink_&]:text-ink [.on-ink_&]:hover:bg-ivory-soft",
  accent: "bg-chartreuse text-ink hover:bg-chartreuse-bright",
  outline:
    "border border-ink/40 text-ink hover:border-ink hover:bg-ink/5 " +
    "[.on-ink_&]:border-ivory/40 [.on-ink_&]:text-ivory [.on-ink_&]:hover:border-ivory [.on-ink_&]:hover:bg-ivory/10",
  ghost:
    "text-ink hover:bg-ink/5 [.on-ink_&]:text-ivory [.on-ink_&]:hover:bg-ivory/10",
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
    const { href, target, rel } = props as AsLink;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
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
