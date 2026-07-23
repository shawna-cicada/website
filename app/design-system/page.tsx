import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Card } from "@/components/ui/Card";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { GrowthRings } from "@/components/brand/GrowthRings";
import { WingLayers } from "@/components/brand/WingLayers";
import { CicadaMark } from "@/components/brand/CicadaMark";
import { CicadaWordmark } from "@/components/brand/CicadaWordmark";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false },
};

const COLORS = [
  { name: "Big Stone (Ink)", token: "--color-ink", className: "bg-ink", role: "Brand navy. Authority: text, dark sections, primary buttons." },
  { name: "Rhino (Ink Soft)", token: "--color-ink-soft", className: "bg-ink-soft", role: "Raised surfaces on ink." },
  { name: "Paper", token: "--color-paper", className: "bg-paper border border-ink/10", role: "Near-white page background." },
  { name: "White Lilac", token: "--color-lilac", className: "bg-lilac border border-ink/10", role: "Brand soft mineral. Cards and wells." },
  { name: "Mountain Meadow", token: "--color-meadow", className: "bg-meadow", role: "THE brand green. Surfaces and on-ink emphasis — never small text on paper." },
  { name: "Meadow Bright", token: "--color-meadow-bright", className: "bg-meadow-bright", role: "Hover state of accent surfaces." },
  { name: "Meadow Deep", token: "--color-meadow-deep", className: "bg-meadow-deep", role: "Derived text-safe green: links, eyebrows, focus ring. AA." },
  { name: "Slate", token: "--color-slate", className: "bg-slate", role: "Derived from Rhino: muted text. AA." },
  { name: "Melrose", token: "--color-melrose", className: "bg-melrose", role: "Brand violet. Decorative; accent text on ink." },
  { name: "Malibu", token: "--color-malibu", className: "bg-malibu", role: "Brand cyan. Rare decorative highlights." },
  { name: "Silver", token: "--color-silver", className: "bg-silver", role: "Quiet rules and dividers. Decorative only." },
] as const;

const TYPE_SCALE = [
  { label: "text-5xl / display", className: "font-display text-5xl font-medium leading-[1.05] tracking-tight", sample: "Growth happens in stages" },
  { label: "text-4xl / h2", className: "font-display text-4xl font-medium leading-[1.1] tracking-tight", sample: "Leadership must evolve" },
  { label: "text-3xl / h3", className: "font-display text-3xl font-medium leading-[1.15]", sample: "Emerge. Shed. Expand." },
  { label: "text-2xl / h4", className: "font-display text-2xl font-medium leading-snug", sample: "The next stage of growth" },
  { label: "text-lg / lead", className: "text-lg", sample: "Your company is not broken. It may have simply outgrown the ways of working that brought it here." },
  { label: "text-base / body", className: "text-base", sample: "Cicada Agility helps founders and leadership teams recognize what their company has outgrown." },
  { label: "text-sm / small", className: "text-sm", sample: "Supporting detail, captions, and metadata." },
] as const;

const SPACING = [
  { name: "space-gutter", varName: "--space-gutter", purpose: "Page edge padding" },
  { name: "space-stack", varName: "--space-stack", purpose: "Between blocks in a section" },
  { name: "space-section", varName: "--space-section", purpose: "Between page sections" },
] as const;

const MOTION_TOKENS = [
  { name: "duration-quick", value: "150ms", use: "Color/opacity feedback: hovers, focus" },
  { name: "duration-base", value: "300ms", use: "Card lift, underline growth, small movement" },
  { name: "duration-slow", value: "600ms", use: "Fades, larger settles" },
  { name: "duration-reveal", value: "900ms", use: "Section entrances, hero reveal" },
  { name: "ease-out-soft", value: "cubic-bezier(0.33, 1, 0.68, 1)", use: "Default easing" },
  { name: "ease-emergence", value: "cubic-bezier(0.22, 1, 0.36, 1)", use: "Entrances — quick start, long settle" },
] as const;

function Swatch({ name, token, className, role }: (typeof COLORS)[number]) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-20 rounded-sm ${className}`} />
      <p className="text-sm font-semibold">{name}</p>
      <p className="font-mono text-xs text-slate">{token}</p>
      <p className="text-xs text-slate">{role}</p>
    </div>
  );
}

function PlaceholderImage({ label }: { label: string }) {
  return (
    <svg
      role="img"
      aria-label={`Placeholder: ${label}`}
      viewBox="0 0 400 300"
      className="h-full w-full bg-melrose/40"
    >
      <circle cx="200" cy="150" r="70" fill="var(--color-melrose)" />
      <circle cx="200" cy="150" r="46" fill="var(--color-paper)" fillOpacity="0.5" />
    </svg>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      {/* ---------------------------------------------------- intro */}
      <Section aria-labelledby="ds-title">
        <Container className="flex flex-col gap-4">
          <Eyebrow>Internal — not linked from the site</Eyebrow>
          <Heading level={1} id="ds-title">
            Cicada Agility Design System
          </Heading>
          <Text size="lg" muted className="max-w-2xl">
            Every token, component, and state on one page, built on the
            official Cicada brand: Mountain Meadow green, Big Stone navy,
            White Lilac, and the geometric cicada mark — and no motion that
            ignores your reduced-motion preference.
          </Text>
        </Container>
      </Section>

      {/* ---------------------------------------------------- color */}
      <Section tone="surface" aria-labelledby="ds-color">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Tokens</Eyebrow>
            <Heading level={2} id="ds-color">Color</Heading>
            <Text muted className="mt-2 max-w-2xl">
              CSS variables in <code>globals.css</code> are the single source of
              truth. Text-role pairings are enforced for WCAG AA by an automated
              test — changing a hex re-runs the audit.
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {COLORS.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-sm bg-paper p-5 border border-ink/10">
              <p className="font-semibold text-ink">Ink on paper</p>
              <p className="text-sm text-slate">Body copy — 13.8:1</p>
            </div>
            <div className="on-ink rounded-sm bg-ink p-5">
              <p className="font-semibold text-paper">Paper on ink</p>
              <p className="text-sm text-paper/70">Inverted sections</p>
            </div>
            <div className="rounded-sm bg-meadow p-5">
              <p className="font-semibold text-ink">Ink on meadow</p>
              <p className="text-sm text-ink/80">Accent surfaces</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- type */}
      <Section aria-labelledby="ds-type">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Tokens</Eyebrow>
            <Heading level={2} id="ds-type">Typography</Heading>
            <Text muted className="mt-2 max-w-2xl">
              Montserrat (variable, brand) carries headings, labels, eyebrows,
              and buttons; Open Sans (variable, brand) carries body text —
              the pairing from the Cicada brand guidelines. Display sizes are
              fluid — resize the window to see the clamp.
            </Text>
          </div>
          <div className="flex flex-col gap-8">
            {TYPE_SCALE.map((step) => (
              <div key={step.label} className="border-b border-ink/10 pb-6">
                <p className="mb-2 font-mono text-xs text-slate">{step.label}</p>
                <p className={step.className}>{step.sample}</p>
              </div>
            ))}
            <div>
              <p className="mb-2 font-mono text-xs text-slate">eyebrow</p>
              <Eyebrow>Leadership evolution for growing companies</Eyebrow>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- spacing */}
      <Section tone="surface" aria-labelledby="ds-space">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Tokens</Eyebrow>
            <Heading level={2} id="ds-space">Spacing &amp; layout</Heading>
            <Text muted className="mt-2 max-w-2xl">
              Three fluid rhythm tokens govern page structure; the 4px utility
              scale handles everything inside components. Containers come in
              narrow (prose), default, and wide.
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            {SPACING.map((space) => (
              <div key={space.name} className="flex flex-col gap-1">
                <p className="font-mono text-xs text-slate">
                  {space.name} — {space.purpose}
                </p>
                <div
                  className="h-4 rounded-xs bg-meadow-deep/70"
                  style={{ width: `var(${space.varName})` }}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {(["narrow", "default", "wide"] as const).map((width) => (
              <Container key={width} width={width} className="!px-0">
                <div className="rounded-xs border border-dashed border-meadow-deep/60 px-4 py-2 font-mono text-xs text-meadow-deep">
                  Container width=&quot;{width}&quot;
                </div>
              </Container>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- buttons */}
      <Section aria-labelledby="ds-buttons">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Components</Eyebrow>
            <Heading level={2} id="ds-buttons">Buttons &amp; text links</Heading>
            <Text muted className="mt-2 max-w-2xl">
              One primary action per page. Tab through to see the focus ring —
              it only appears for keyboard input.
            </Text>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium — 44px target</Button>
              <Button size="lg">Large</Button>
              <Button href="/design-system#ds-buttons" variant="outline">
                Rendered as a link
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <TextLink href="/design-system#ds-buttons">Text link</TextLink>
              <TextLink href="/design-system#ds-buttons" arrow>
                Directional text link
              </TextLink>
            </div>
          </div>

          <div className="on-ink flex flex-col gap-6 rounded-sm bg-ink p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-melrose">
              On ink
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <TextLink href="/design-system#ds-buttons">Text link on ink</TextLink>
              <TextLink href="/design-system#ds-buttons" arrow>
                Directional on ink
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- cards */}
      <Section tone="surface" aria-labelledby="ds-cards">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Components</Eyebrow>
            <Heading level={2} id="ds-cards">Cards</Heading>
            <Text muted className="mt-2 max-w-2xl">
              Restrained radius, no shadow chrome at rest. Interactive cards
              lift slightly and reveal a meadow top rule on hover.
            </Text>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card tone="paper">
              <Heading level={3} visualLevel={4}>Static card</Heading>
              <Text muted className="mt-2">
                For quiet content groupings on the soft surface.
              </Text>
            </Card>
            <Card tone="surface" interactive className="bg-paper">
              <Heading level={3} visualLevel={4}>Interactive card</Heading>
              <Text muted className="mt-2">
                Hover or focus a link inside to see the lift and top rule.
              </Text>
              <div className="mt-4">
                <TextLink href="/design-system#ds-cards" arrow>
                  Explore
                </TextLink>
              </div>
            </Card>
            <Card tone="ink" interactive>
              <Heading level={3} visualLevel={4}>Ink card</Heading>
              <Text className="mt-2 text-paper/70">
                Inverted card for featured content and dark sections.
              </Text>
              <div className="mt-4">
                <TextLink href="/design-system#ds-cards" arrow>
                  Explore
                </TextLink>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- images */}
      <Section aria-labelledby="ds-images">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Components</Eyebrow>
            <Heading level={2} id="ds-images">Image treatment</Heading>
            <Text muted className="mt-2 max-w-2xl">
              Editorial crops with restrained radius. The wing treatment layers
              a translucent Melrose panel behind the image — layering without
              literal insect imagery. (Placeholder art shown; no stock photos.)
            </Text>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <figure className="flex flex-col gap-3">
              <ImageFrame ratio="4/3">
                <PlaceholderImage label="plain treatment" />
              </ImageFrame>
              <figcaption className="text-sm text-slate">Plain — 4/3</figcaption>
            </figure>
            <figure className="flex flex-col gap-3">
              <ImageFrame ratio="4/3" treatment="wing">
                <PlaceholderImage label="wing treatment" />
              </ImageFrame>
              <figcaption className="text-sm text-slate">
                Wing layer — 4/3
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- brand svg */}
      <Section tone="ink" aria-labelledby="ds-brand">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Brand</Eyebrow>
            <Heading level={2} id="ds-brand">Logo &amp; brand marks</Heading>
            <Text className="mt-2 max-w-2xl text-paper/70">
              The official cicada mark and CICADA logotype (customized
              Raleway), extracted from the brand EPS as vector components that
              render in any token color. The mark is approved standalone at
              small sizes — favicon, app icon. Sources live in{" "}
              <code>public/logos/</code>.
            </Text>
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <figure className="flex flex-col gap-4">
              <CicadaMark className="h-28 w-auto text-meadow" />
              <figcaption className="text-sm text-paper/60">
                Logo mark — Mountain Meadow on ink
              </figcaption>
            </figure>
            <figure className="flex flex-col gap-4">
              <CicadaMark className="h-28 w-auto text-paper" />
              <figcaption className="text-sm text-paper/60">
                Logo mark — paper on ink
              </figcaption>
            </figure>
            <figure className="flex flex-col gap-4">
              <CicadaWordmark className="h-10 w-auto text-paper" title="Cicada wordmark" />
              <figcaption className="text-sm text-paper/60">
                Logotype — wordmark only (header scale)
              </figcaption>
            </figure>
            <figure className="flex flex-col gap-4">
              <CicadaWordmark
                withDescriptor
                className="h-16 w-auto text-paper"
                title="Cicada wordmark with descriptor"
              />
              <figcaption className="text-sm text-paper/60">
                Logotype with descriptor line
              </figcaption>
            </figure>
          </div>
          <div>
            <Text className="mb-6 max-w-2xl text-paper/70">
              Supporting decorative primitives — growth rings and wing layers —
              stay abstract and aria-hidden. Use them sparingly.
            </Text>
            <div className="flex flex-wrap items-end gap-16">
              <GrowthRings className="text-paper" size={120} />
              <WingLayers className="text-paper" width={220} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- motion */}
      <Section aria-labelledby="ds-motion">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Tokens</Eyebrow>
            <Heading level={2} id="ds-motion">Motion</Heading>
            <Text muted className="mt-2 max-w-2xl">
              Four durations, two easings. Every animation collapses under{" "}
              <code>prefers-reduced-motion</code> via a global clamp;
              JS-driven motion additionally branches on{" "}
              <code>useReducedMotion()</code>.
            </Text>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/20">
                  <th scope="col" className="py-2 pr-6 font-semibold">Token</th>
                  <th scope="col" className="py-2 pr-6 font-semibold">Value</th>
                  <th scope="col" className="py-2 font-semibold">Use</th>
                </tr>
              </thead>
              <tbody>
                {MOTION_TOKENS.map((token) => (
                  <tr key={token.name} className="border-b border-ink/10">
                    <td className="py-2 pr-6 font-mono text-xs">{token.name}</td>
                    <td className="py-2 pr-6 font-mono text-xs text-slate">
                      {token.value}
                    </td>
                    <td className="py-2 text-slate">{token.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="anim-rise rounded-sm bg-lilac p-6" data-testid="motion-rise">
              <p className="font-semibold">Rise-in entrance</p>
              <p className="text-sm text-slate">
                anim-rise — duration-reveal, ease-emergence
              </p>
            </div>
            <div className="anim-fade rounded-sm bg-lilac p-6" data-testid="motion-fade">
              <p className="font-semibold">Fade entrance</p>
              <p className="text-sm text-slate">
                anim-fade — duration-slow, ease-out-soft
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- a11y */}
      <Section tone="surface" aria-labelledby="ds-a11y">
        <Container className="flex flex-col gap-stack">
          <div>
            <Eyebrow>Foundations</Eyebrow>
            <Heading level={2} id="ds-a11y">Focus &amp; accessibility</Heading>
          </div>
          <ul className="flex max-w-2xl list-disc flex-col gap-2 pl-5 text-slate">
            <li>
              Global <code>:focus-visible</code> ring: 2px meadow-deep outline, 3px
              offset — visible on paper, surface, and ink.
            </li>
            <li>A skip link is the first focusable element on every page.</li>
            <li>Medium and large buttons meet the 44px touch target.</li>
            <li>
              Decorative SVG and layers are <code>aria-hidden</code>; images
              carry alt text.
            </li>
            <li>One h1 per page; sections are labelled landmarks.</li>
          </ul>
        </Container>
      </Section>
    </>
  );
}
