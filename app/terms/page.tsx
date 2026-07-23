import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/ComingSoon";

export const metadata: Metadata = { title: "Terms" };

/** Stub route: keeps navigation working until its build phase lands. */
export default function Page() {
  return <ComingSoon title="Terms" note="Terms arrive before launch (Phase 8)." />;
}
