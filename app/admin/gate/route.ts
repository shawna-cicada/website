import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_GATE_COOKIE,
  expectedToken,
  verifyPassword,
} from "@/lib/admin-gate";

/**
 * Relative Location keeps the browser on whatever host it used
 * (localhost vs 127.0.0.1 vs the real domain behind a proxy) — building
 * an absolute URL from request.url normalizes the host and can bounce
 * the browser across origins, losing the query param and cookie.
 */
function seeOther(path: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

/** Gate submission for /admin (D-025). Sets the curtain cookie. */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = form.get("password");

  if (typeof password === "string" && verifyPassword(password)) {
    const response = seeOther("/admin");
    response.cookies.set(ADMIN_GATE_COOKIE, expectedToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: 60 * 60 * 24 * 30, // stay open for a month per browser
    });
    return response;
  }

  return seeOther("/admin?wrong-password=1");
}
