import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "Insights" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="Insights" note="Articles and videos arrive in Phase 6 of the build plan." />;
}
