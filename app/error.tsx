"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportClientError } from "@/lib/monitoring/report";

/**
 * Branded error boundary: apologizes plainly, offers retry, and reports
 * the error through the monitoring hook.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error);
  }, [error]);

  return (
    <section className="bg-paper py-section">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-gutter">
        <p className="font-label text-sm font-bold uppercase tracking-[0.14em] text-meadow-deep">
          Something went wrong
        </p>
        <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight">
          That was us, not you.
        </h1>
        <p className="text-lg text-slate">
          An unexpected error interrupted the page. It has been reported.
          Trying again usually works.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center rounded-xs bg-ink px-6 font-label font-semibold text-paper transition-colors duration-[var(--duration-quick)] hover:bg-ink-soft"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xs border border-ink/40 px-6 font-label font-semibold text-ink transition-colors duration-[var(--duration-quick)] hover:border-ink hover:bg-ink/5"
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
