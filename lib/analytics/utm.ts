/**
 * Safely append UTM parameters to an external URL.
 * - Existing UTM values in the URL are preserved, never overwritten.
 * - Invalid URLs are returned unchanged (never throw in a render path).
 */
export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
};

const DEFAULTS = {
  source: "cicadaagility.com",
  medium: "website",
} as const;

export function withUtm(url: string, params: UtmParams = {}): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  const values: Record<string, string | undefined> = {
    utm_source: params.source ?? DEFAULTS.source,
    utm_medium: params.medium ?? DEFAULTS.medium,
    utm_campaign: params.campaign,
  };

  for (const [key, value] of Object.entries(values)) {
    if (value && !parsed.searchParams.has(key)) {
      parsed.searchParams.set(key, value);
    }
  }

  return parsed.toString();
}
