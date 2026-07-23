import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Text";
import type { ClientLogo, HomepageContent } from "@/lib/cms/types";

function LogoImage({ logo }: { logo: ClientLogo }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      unoptimized
      className="opacity-70 grayscale transition-[filter,opacity] duration-[var(--duration-base)] hover:opacity-100 hover:grayscale-0"
    />
  );
}

/**
 * Client logo display, CMS-managed.
 * Small screens: a static responsive grid. md and up: a slow CSS-only
 * marquee that pauses on hover/focus and stops entirely under reduced
 * motion (global animation clamp). The duplicated strip is aria-hidden
 * so assistive technology reads each logo once.
 */
export function ClientLogos({
  content,
  demoNote,
}: {
  content: HomepageContent["clients"];
  /** Shown when placeholder logos render for layout preview only. */
  demoNote?: string;
}) {
  return (
    <section
      aria-labelledby="clients-heading"
      className="border-y border-ink/10 bg-paper py-14"
    >
      <Container className="flex flex-col gap-8">
        <div>
          <Heading
            level={2}
            visualLevel={4}
            id="clients-heading"
            className="text-slate"
          >
            {content.headline}
          </Heading>
          {demoNote ? (
            <p className="mt-2 text-xs italic text-slate">{demoNote}</p>
          ) : null}
        </div>

        {/* Small screens: static grid, no motion */}
        <ul className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:hidden">
          {content.logos.map((logo) => (
            <li key={logo.name} className="flex justify-center">
              <LogoImage logo={logo} />
            </li>
          ))}
        </ul>

        {/* md+: pausable marquee */}
        <div
          className="group hidden overflow-hidden md:block"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="marquee-track flex w-max items-center gap-20 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            <ul className="flex items-center gap-20">
              {content.logos.map((logo) => (
                <li key={logo.name} className="shrink-0">
                  <LogoImage logo={logo} />
                </li>
              ))}
            </ul>
            <ul className="flex items-center gap-20" aria-hidden="true">
              {content.logos.map((logo) => (
                <li key={`${logo.name}-dup`} className="shrink-0">
                  <LogoImage logo={logo} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
