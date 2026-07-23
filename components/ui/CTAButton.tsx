"use client";

import { usePathname } from "next/navigation";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type CTAButtonProps = {
  label: string;
  href: string;
  /** Where on the page the CTA lives, e.g. "hero", "final-cta" */
  location: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Conversion CTA: a Button that reports cta_click through the analytics
 * adapter with the label, location, destination, and page path the brief's
 * event taxonomy requires. Rendered as a real link — navigation works
 * without JavaScript; tracking is progressive enhancement.
 */
export function CTAButton({
  label,
  href,
  location,
  variant = "primary",
  size = "md",
  className,
}: CTAButtonProps) {
  const pathname = usePathname();

  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() =>
        track("cta_click", {
          label,
          location,
          destination: href,
          path: pathname,
        })
      }
    >
      {label}
    </Button>
  );
}
