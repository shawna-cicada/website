import { Studio } from "@/app/admin/[[...tool]]/Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

/**
 * The Cicada Agility editorial Studio, embedded at /admin.
 * The project coordinates are committed (D-020), so the Studio is
 * always configured; who can enter is controlled by Sanity sign-in
 * and roles (see docs/EDITOR_GUIDE.md), never by hiding this route.
 */
export default function AdminPage() {
  return <Studio />;
}
