import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "Organizational Effectiveness" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="Organizational Effectiveness" note="This service page arrives in Phase 4 of the build plan." />;
}
