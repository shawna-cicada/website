/**
 * Error-monitoring hook, provider-neutral. Server errors flow through
 * instrumentation.ts → reportServerError; client errors through
 * app/error.tsx → reportClientError. With ERROR_MONITORING_WEBHOOK set,
 * reports POST there (Slack webhook, or a Sentry tunnel later); without
 * it, they log. Failures to report never throw.
 */

type ErrorReport = {
  source: "server" | "client";
  message: string;
  digest?: string;
  stack?: string;
  url?: string;
  timestamp: string;
};

async function deliver(report: ErrorReport): Promise<void> {
  const webhook = process.env.ERROR_MONITORING_WEBHOOK?.trim();
  if (!webhook) {
    console.error(`[monitoring][${report.source}]`, report.message, report.digest ?? "");
    return;
  }
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
  } catch {
    console.error("[monitoring] failed to deliver report:", report.message);
  }
}

export function reportServerError(
  error: unknown,
  context: { url?: string } = {},
): Promise<void> {
  const err = error instanceof Error ? error : new Error(String(error));
  return deliver({
    source: "server",
    message: err.message,
    stack: err.stack?.slice(0, 2000),
    url: context.url,
    timestamp: new Date().toISOString(),
  });
}

export function reportClientError(error: Error & { digest?: string }): void {
  // Client-side: fire-and-forget to the same hook via the console;
  // the server hook owns webhook delivery (no secrets in the browser).
  console.error("[monitoring][client]", error.digest ?? "", error.message);
}
