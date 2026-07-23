"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SkipLink } from "@/components/layout/SkipLink";
import { CicadaMark } from "@/components/brand/CicadaMark";
import { CicadaWordmark } from "@/components/brand/CicadaWordmark";

/**
 * The four practice pages, mirrored from content/seed/practices.ts
 * (stable slugs; the practices-content unit test guards the set).
 */
const PRACTICE_LINKS = [
  { href: "/how-we-help/leadership-team-effectiveness", label: "Leadership & Team Effectiveness" },
  { href: "/how-we-help/organizational-effectiveness", label: "Organizational Effectiveness" },
  { href: "/how-we-help/ai-enablement", label: "AI Enablement & Working Norms" },
  { href: "/how-we-help/founder-growth", label: "Founder Challenges: Seed to Scale" },
] as const;

/** Active assessments (content/seed/assessments.ts), anchored on the hub. */
const ASSESSMENT_LINKS = [
  { href: "/assessments#growth-stage", label: "Growth Stage Assessment" },
  { href: "/assessments#founder-growth", label: "Founder Growth Assessment" },
  { href: "/assessments#leadership-alignment", label: "Leadership Team Alignment Check" },
  { href: "/assessments#ai-readiness", label: "AI Readiness Assessment" },
] as const;

type NavChild = { href: string; label: string };

const NAV_ITEMS: ReadonlyArray<{
  href: string;
  label: string;
  overviewLabel?: string;
  children?: readonly NavChild[];
}> = [
  {
    href: "/how-we-help",
    label: "How We Help",
    overviewLabel: "All practices — overview",
    children: PRACTICE_LINKS,
  },
  {
    href: "/assessments",
    label: "Assessments",
    overviewLabel: "All assessments — overview",
    children: ASSESSMENT_LINKS,
  },
  { href: "/insights", label: "Articles and Insights" },
  { href: "/about", label: "About" },
];

/** Accessible disclosure dropdown for a top-level nav item. */
function NavDropdown({
  item,
}: {
  item: (typeof NAV_ITEMS)[number] & { children: readonly NavChild[] };
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-0.5">
        <Link
          href={item.href}
          className="text-sm font-medium text-ink/80 transition-colors duration-[var(--duration-quick)] hover:text-ink"
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink/60 hover:text-ink"
        >
          <span className="sr-only">
            {open ? "Hide" : "Show"} {item.label} pages
          </span>
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-[var(--duration-quick)] ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="M2.5 4.5 L6 8 L9.5 4.5" />
          </svg>
        </button>
      </div>
      <ul
        id={id}
        className={`${
          open ? "block" : "hidden"
        } absolute left-0 top-full z-50 mt-3 w-72 rounded-md border border-ink/10 bg-paper p-2 shadow-[0_16px_40px_-20px_rgba(30,42,68,0.4)]`}
      >
        <li>
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-ink hover:bg-lilac"
          >
            {item.overviewLabel ?? item.label}
          </Link>
        </li>
        {item.children.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-lilac hover:text-ink"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Site header shell: typographic wordmark, primary nav with disclosure
 * dropdowns for How We Help and Assessments, persistent "Book a
 * Conversation" CTA. The header stacks above page content (z-50) so
 * open dropdowns are never painted under later sections.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="anim-drop relative z-50 border-b border-ink/10 bg-paper">
      <SkipLink />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-gutter py-4">
        <Link href="/" className="flex items-center gap-3">
          <CicadaMark className="h-7 w-auto shrink-0 text-meadow" />
          <CicadaWordmark className="h-4 w-auto text-ink" title="Cicada Agility — Home" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.href}
                item={{ ...item, children: item.children }}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink/80 transition-colors duration-[var(--duration-quick)] hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
          <Button href="/book" size="sm">
            Book a Conversation
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xs md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M4 4 L18 18 M18 4 L4 18" />
            ) : (
              <path d="M3 6 h16 M3 11 h16 M3 16 h16" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id={menuId}
        aria-label="Main menu"
        className={`${open ? "block" : "hidden"} border-t border-ink/10 md:hidden`}
      >
        <ul className="flex flex-col px-gutter py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-base font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {item.children ? (
                <ul className="mb-1 flex flex-col border-l border-ink/10 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block py-2.5 text-sm font-medium text-slate"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
          <li className="py-3">
            <Button href="/book" className="w-full">
              Book a Conversation
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
