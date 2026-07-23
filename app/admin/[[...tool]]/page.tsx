import { Studio } from "@/app/admin/[[...tool]]/Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

/**
 * The Cicada Agility editorial Studio, embedded at /admin.
 * Until a Sanity project is connected (NEXT_PUBLIC_SANITY_PROJECT_ID),
 * a plain-language setup notice renders instead of a broken studio.
 */
export default function AdminPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

  if (!configured) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>
            The editorial dashboard is almost ready
          </h1>
          <p style={{ lineHeight: 1.6 }}>
            The content workspace has not been connected yet. Whoever manages
            the website needs to create the Sanity project and set{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (see{" "}
            <code>.env.example</code>). Nothing is wrong with your account —
            once the workspace is connected, signing in here opens the Cicada
            Agility dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <Studio />;
}
