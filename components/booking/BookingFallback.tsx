import { Button } from "@/components/ui/Button";

type BookingFallbackProps = {
  eventLabel: string;
  fallbackUrl: string | null;
  contactEmail: string | null;
  /** Why the fallback is showing — adjusts the message honestly. */
  reason: "unconfigured" | "error";
};

/**
 * Accessible fallback when the scheduling embed is unavailable —
 * blocked, failed to load, or not yet configured. Always offers a
 * usable path: the direct scheduling link and/or a contact email.
 */
export function BookingFallback({
  eventLabel,
  fallbackUrl,
  contactEmail,
  reason,
}: BookingFallbackProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-4 rounded-sm border border-ink/10 bg-lilac p-6 sm:p-8"
    >
      <p className="font-semibold">
        {reason === "error"
          ? "The scheduler could not load here."
          : `Scheduling for “${eventLabel}” is being set up.`}
      </p>
      {fallbackUrl ? (
        <>
          <p className="text-sm text-slate">
            You can open the scheduling page directly instead:
          </p>
          <Button
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
          >
            Open the scheduling page
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        </>
      ) : null}
      {contactEmail ? (
        <p className="text-sm text-slate">
          Or email us and we will find a time together:{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-meadow-deep underline underline-offset-4"
          >
            {contactEmail}
          </a>
        </p>
      ) : null}
      {!fallbackUrl && !contactEmail ? (
        <p className="text-sm text-slate">
          Please check back shortly — scheduling will be available soon.
        </p>
      ) : null}
    </div>
  );
}
