import Link from "next/link";
import { GrowthRings } from "@/components/brand/GrowthRings";

const FOOTER_NAV = [
  { href: "/how-we-help", label: "How We Help" },
  { href: "/assessments", label: "Assessments" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book a Conversation" },
] as const;

const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** Site footer shell on the deep-ink surface. */
export function Footer() {
  return (
    <footer className="on-ink bg-ink text-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-gutter py-14 md:grid-cols-[1fr_auto]">
        <div className="max-w-md">
          <p className="font-display text-xl font-semibold tracking-tight">
            Cicada<span className="text-chartreuse"> Agility</span>
          </p>
          <p className="mt-3 text-sm text-ivory/70">
            Growth happens in stages. Leadership must evolve with it.
          </p>
          <GrowthRings className="mt-6 text-ivory/50" size={88} />
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ivory/80 transition-colors duration-[var(--duration-quick)] hover:text-ivory"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-ivory/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-gutter py-6 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cicada Agility. All rights reserved.</p>
          <ul className="flex gap-6">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
