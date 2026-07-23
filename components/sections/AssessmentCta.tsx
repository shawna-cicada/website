"use client";

import { Button, type ButtonVariant } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type AssessmentCtaProps = {
  slug: string;
  title: string;
  ctaLabel: string;
  externalUrl: string | null;
  opensInNewTab: boolean;
  trackingCampaign?: string;
  location: string;
  variant?: ButtonVariant;
};

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10 L10 4 M5 4 h5 v5" />
    </svg>
  );
}

/**
 * Assessment call-to-action.
 * - Configured: a real external link (new tab, noopener) that reports
 *   assessment_external_click and clearly indicates it leaves the site.
 * - Unconfigured (env var unset): a disabled control with an honest
 *   "available soon" note — never a dead link.
 */
export function AssessmentCta({
  slug,
  title,
  ctaLabel,
  externalUrl,
  opensInNewTab,
  trackingCampaign,
  location,
  variant = "accent",
}: AssessmentCtaProps) {
  if (!externalUrl) {
    return (
      <div className="flex flex-col gap-2">
        <Button variant={variant} disabled aria-describedby={`${slug}-soon`}>
          {ctaLabel}
        </Button>
        <p id={`${slug}-soon`} className="text-xs text-slate [.on-ink_&]:text-paper/60">
          This assessment is being prepared — available soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        href={externalUrl}
        target={opensInNewTab ? "_blank" : undefined}
        rel={opensInNewTab ? "noopener noreferrer" : undefined}
        onClick={() =>
          track("assessment_external_click", {
            assessment: slug,
            destination: externalUrl,
            campaign: trackingCampaign ?? null,
            location,
          })
        }
      >
        {ctaLabel}
        <ExternalIcon />
        {opensInNewTab ? (
          <span className="sr-only">
            (opens {title} in a new tab on an external platform)
          </span>
        ) : null}
      </Button>
      <p className="text-xs text-slate [.on-ink_&]:text-paper/60">
        Opens in a new tab on an external assessment platform.
      </p>
    </div>
  );
}
