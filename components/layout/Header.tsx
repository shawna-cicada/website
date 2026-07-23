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

const NAV_ITEMS = [
  { href: "/how-we-help", label: "How We Help", children: PRACTICE_LINKS },
  { href: "/assessments", label: "Assessments" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

/**
 * Site header shell: typographic wordmark, primary nav with a services
 * dropdown under How We Help, persistent "Book a Conversation" CTA.
 * Both the mobile menu and the dropdown are accessible disclosures
 * (aria-expanded/aria-controls, Escape and outside-click to close).
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();
  const servicesId = useId();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  return (
    <header className="anim-drop border-b border-ink/10 bg-paper">
      <SkipLink />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-gutter py-4">
        <Link href="/" className="flex items-center gap-3">
          <CicadaMark className="h-7 w-auto shrink-0 text-meadow" />
          <CicadaWordmark className="h-4 w-auto text-ink" title="Cicada Agility — Home" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) =>
            "children" in item ? (
              <div key={item.href} ref={servicesRef} className="relative">
                <div className="flex items-center gap-0.5">
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-ink/80 transition-colors duration-[var(--duration-quick)] hover:text-ink"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls={servicesId}
                    onClick={() => setServicesOpen((value) => !value)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink/60 hover:text-ink"
                  >
                    <span className="sr-only">
                      {servicesOpen ? "Hide" : "Show"} How We Help pages
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
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M2.5 4.5 L6 8 L9.5 4.5" />
                    </svg>
                  </button>
                </div>
                <ul
                  id={servicesId}
                  className={`${
                    servicesOpen ? "block" : "hidden"
                  } absolute left-0 top-full z-50 mt-3 w-72 rounded-md border border-ink/10 bg-paper p-2 shadow-[0_16px_40px_-20px_rgba(30,42,68,0.4)]`}
                >
                  <li>
                    <Link
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className="block rounded-sm px-3 py-2.5 text-sm font-semibold text-ink hover:bg-lilac"
                    >
                      All practices — overview
                    </Link>
                  </li>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setServicesOpen(false)}
                        className="block rounded-sm px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-lilac hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
              {"children" in item ? (
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
