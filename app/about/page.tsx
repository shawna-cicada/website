import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "About" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="About" note="The full story arrives in Phase 4 of the build plan." />;
}
