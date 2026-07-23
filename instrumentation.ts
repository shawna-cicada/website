import { formatEnvReport, validateEnvironment } from "@/lib/env";
import { reportServerError } from "@/lib/monitoring/report";

/** Runs once at server startup: validate environment, report gaps. */
export async function register() {
  const report = validateEnvironment();
  const formatted = formatEnvReport(report);
  if (formatted !== "Environment: all configured.") {
    console.warn(formatted);
  }
}

/** Next.js server error hook → monitoring. */
export async function onRequestError(
  error: unknown,
  request: { url: string },
) {
  await reportServerError(error, { url: request.url });
}
