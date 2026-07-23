"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SkipLink } from "@/components/layout/SkipLink";

const NAV_ITEMS = [
  { href: "/how-we-help", label: "How We Help" },
  { href: "/assessments", label: "Assessments" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
] as const;

/**
 * Site header shell: typographic wordmark, primary nav, persistent
 * "Book a Conversation" CTA. On small screens the nav collapses into
 * an accessible disclosure (button with aria-expanded/aria-controls).
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="border-b border-ink/10 bg-ivory">
      <SkipLink />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-gutter py-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          Cicada<span className="text-emergence"> Agility</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition-colors duration-[var(--duration-quick)] hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
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
