import { createHash, timingSafeEqual } from "crypto";

/**
 * A simple shared-password curtain in front of /admin (D-025).
 *
 * This is deliberately a CURTAIN, not the security boundary: content
 * security comes from Sanity sign-in + roles behind it. The gate keeps
 * casual visitors from even reaching the Studio login.
 *
 * The plaintext password is NEVER committed — only its SHA-256
 * fingerprint. Set ADMIN_GATE_PASSWORD in the deployment environment to
 * rotate the password without a code change (the env value is hashed at
 * runtime and takes precedence).
 *
 * Kept dependency-free (node crypto only) so tests can import it
 * directly.
 */

export const ADMIN_GATE_COOKIE = "cicada-admin-gate";

/** SHA-256 of the founder-chosen gate password. */
const DEFAULT_HASH =
  "6479057ba8925f27ac6867d88c06c1ab0257ac1e9a3122f82492d8b9baf6d584";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/** The hash a valid gate cookie must carry. */
export function expectedToken(): string {
  const override = process.env.ADMIN_GATE_PASSWORD?.trim();
  return override ? sha256(override) : DEFAULT_HASH;
}

export function verifyPassword(password: string): boolean {
  return safeEqual(sha256(password), expectedToken());
}

export function verifyToken(token: string | undefined | null): boolean {
  return typeof token === "string" && safeEqual(token, expectedToken());
}
