import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "How We Help" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="How We Help" note="Service overview arrives in Phase 4 of the build plan." />;
}
