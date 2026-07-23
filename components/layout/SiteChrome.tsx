"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wraps the marketing header/footer and hides them on /admin: the
 * embedded Studio manages the full viewport itself, and stacking the
 * site header above it pushed the Studio's bottom action bar (Publish,
 * Schedule, …) below the fold.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
