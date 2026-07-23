import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "Founder Challenges: Seed to Scale" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="Founder Challenges: Seed to Scale" note="This service page arrives in Phase 4 of the build plan." />;
}
