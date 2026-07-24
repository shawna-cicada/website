import { cookies } from "next/headers";
import { Studio } from "@/app/admin/[[...tool]]/Studio";
import { ADMIN_GATE_COOKIE, verifyToken } from "@/lib/admin-gate";

export { metadata, viewport } from "next-sanity/studio";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The Cicada Agility editorial Studio, embedded at /admin.
 * A shared-password curtain (D-025) fronts it; the real access control
 * remains Sanity sign-in + roles behind the curtain (docs/EDITOR_GUIDE.md).
 * Project coordinates are committed (D-020), so no env setup is needed.
 */
export default async function AdminPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  if (verifyToken(cookieStore.get(ADMIN_GATE_COOKIE)?.value)) {
    return <Studio />;
  }

  const params = await searchParams;
  const wrongPassword = params["wrong-password"] !== undefined;

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <form
        method="post"
        action="/admin/gate"
        style={{ maxWidth: 400, width: "100%", display: "grid", gap: 12 }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: 700,
            color: "#0d7263",
          }}
        >
          Cicada Agility
        </p>
        <h1 style={{ margin: 0, fontSize: 24 }}>Team access</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "#4c5872" }}>
          Enter the team password to open the editorial dashboard. You&rsquo;ll
          sign in with your own account after this step.
        </p>
        {wrongPassword ? (
          <p style={{ margin: 0, color: "#8f4f24" }}>
            That password isn&rsquo;t right — try again.
          </p>
        ) : null}
        <label htmlFor="admin-gate-password" style={{ fontWeight: 600 }}>
          Team password
        </label>
        <input
          id="admin-gate-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          style={{
            padding: "10px 12px",
            fontSize: 16,
            border: "1px solid #c4c4c4",
            borderRadius: 4,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            fontSize: 15,
            fontWeight: 600,
            color: "#1e2a44",
            background: "#18b698",
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
