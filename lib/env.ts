/**
 * Production environment validation. Never crashes the build — reports
 * what is missing so the launch checklist can act on it. Called from
 * instrumentation.ts at server startup.
 */

export type EnvCheck = {
  name: string;
  /** Missing critical vars fail the launch checklist. */
  critical: boolean;
  /** What breaks (in plain language) when unset. */
  consequence: string;
};

export const ENV_CHECKS: EnvCheck[] = [
  {
    name: "CALENDLY_EVENT_URL_DISCOVERY_CALL",
    critical: true,
    consequence: "The primary booking pathway on /book shows its fallback instead of the scheduler.",
  },
  {
    name: "BOOKING_CONTACT_EMAIL",
    critical: true,
    consequence: "The booking fallback has no contact email to offer.",
  },
  {
    name: "ASSESSMENT_URL_GROWTH_STAGE",
    critical: false,
    consequence: "The featured Growth Stage Assessment renders as 'available soon'.",
  },
  {
    name: "CALENDLY_EVENT_URL_ASSESSMENT_DEBRIEF",
    critical: false,
    consequence: "The Assessment Debrief event type falls back to email.",
  },
  {
    name: "CALENDLY_EVENT_URL_EXISTING_CLIENT",
    critical: false,
    consequence: "The Existing Client event type falls back to email.",
  },
  // NEXT_PUBLIC_SANITY_PROJECT_ID is no longer checked here: the live
  // project's public coordinates are committed defaults (D-020,
  // lib/sanity/config.ts); the env var remains as an optional override.
  {
    name: "ERROR_MONITORING_WEBHOOK",
    critical: false,
    consequence: "Server errors log to the console only.",
  },
];

export type EnvReport = {
  ok: boolean;
  missingCritical: EnvCheck[];
  missingOptional: EnvCheck[];
};

export function validateEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): EnvReport {
  const missing = ENV_CHECKS.filter((check) => !env[check.name]?.trim());
  return {
    ok: missing.every((check) => !check.critical),
    missingCritical: missing.filter((check) => check.critical),
    missingOptional: missing.filter((check) => !check.critical),
  };
}

/** Human-readable startup report. */
export function formatEnvReport(report: EnvReport): string {
  if (report.missingCritical.length === 0 && report.missingOptional.length === 0) {
    return "Environment: all configured.";
  }
  const lines: string[] = [];
  for (const check of report.missingCritical) {
    lines.push(`[env][CRITICAL] ${check.name} is not set — ${check.consequence}`);
  }
  for (const check of report.missingOptional) {
    lines.push(`[env] ${check.name} is not set — ${check.consequence}`);
  }
  return lines.join("\n");
}
