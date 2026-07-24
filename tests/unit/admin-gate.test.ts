import { afterEach, describe, expect, it, vi } from "vitest";
import {
  expectedToken,
  verifyPassword,
  verifyToken,
} from "@/lib/admin-gate";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("admin gate (D-025)", () => {
  it("commits only a SHA-256 fingerprint, never plaintext", () => {
    // 64 lowercase hex chars — a digest, not a password.
    expect(expectedToken()).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects wrong passwords and junk tokens", () => {
    expect(verifyPassword("wrong")).toBe(false);
    expect(verifyPassword("")).toBe(false);
    expect(verifyToken("junk")).toBe(false);
    expect(verifyToken(undefined)).toBe(false);
    expect(verifyToken(null)).toBe(false);
  });

  it("the expected token itself validates (what the cookie carries)", () => {
    expect(verifyToken(expectedToken())).toBe(true);
  });

  it("ADMIN_GATE_PASSWORD env rotates the password without code changes", () => {
    vi.stubEnv("ADMIN_GATE_PASSWORD", "rotated-password");
    expect(verifyPassword("rotated-password")).toBe(true);
    expect(verifyPassword("wrong")).toBe(false);
    // The default fingerprint no longer matches once rotated.
    vi.unstubAllEnvs();
    expect(verifyPassword("rotated-password")).toBe(false);
  });
});
