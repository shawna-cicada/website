import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { getApprovedClients } from "@/lib/cms";
import type { ClientGroup, ClientRecord } from "@/lib/cms/types";

// Logos approved in /admin appear within 5 minutes — no redeploy (D-021).
export const revalidate = 300;

const GROUP_LABELS: Record<ClientGroup, string> = {
  startup: "Startups",
  growth: "Growth companies",
  enterprise: "Enterprises",
};

export async function generateMetadata(): Promise<Metadata> {
  const approved = await getApprovedClients();
  return {
    title: "Clients",
    description:
      "Organizations Cicada Agility has supported from startup to enterprise.",
    // Keep the page out of search until there are approved records.
    robots: approved.length === 0 ? { index: false } : undefined,
  };
}

function LogoCard({ client }: { client: ClientRecord }) {
  return (
    <figure className="flex flex-col items-center gap-3 rounded-sm border border-ink/10 bg-paper p-6">
      <Image
        src={client.src}
        alt={client.alt}
        width={client.width}
        height={client.height}
        unoptimized
        className="opacity-80 grayscale transition-[filter,opacity] duration-[var(--duration-base)] hover:opacity-100 hover:grayscale-0"
      />
      <figcaption className="text-center text-sm text-slate">
        {client.name}
        {client.caseInsightHref ? (
          <span className="mt-1 block">
            <TextLink href={client.caseInsightHref} arrow className="text-sm">
              Read the case insight
            </TextLink>
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * /clients — approved records only, optionally grouped by company stage.
 * With no approved records the page renders an honest placeholder, is
 * noindexed, and is linked from no navigation (nav gains a Clients link
 * only when approved records exist — it has none today).
 */
export default async function ClientsPage() {
  const approved = await getApprovedClients();
  const grouped = (Object.keys(GROUP_LABELS) as ClientGroup[])
    .map((group) => ({
      group,
      label: GROUP_LABELS[group],
      clients: approved.filter((client) => client.group === group),
    }))
    .filter((entry) => entry.clients.length > 0);
  const ungrouped = approved.filter((client) => !client.group);
  const useGroups = grouped.length > 1;

  return (
    <>
      <Section aria-labelledby="clients-heading">
        <Container className="flex max-w-4xl flex-col gap-6">
          <Reveal>
            <Eyebrow>Clients</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <Heading level={1} visualLevel={2} id="clients-heading">
              Experience supporting teams from startup to enterprise
            </Heading>
          </Reveal>
          <Reveal delay={0.2}>
            <Text size="lg" muted className="max-w-2xl">
              We show client names and logos only with written permission, and
              we never imply endorsement without it.
            </Text>
          </Reveal>
        </Container>
      </Section>

      {approved.length === 0 ? (
        <Section tone="surface" aria-labelledby="clients-empty-heading">
          <Container className="flex max-w-3xl flex-col items-start gap-6">
            <Reveal>
              <Heading level={2} visualLevel={3} id="clients-empty-heading">
                Client stories are on their way.
              </Heading>
              <Text muted size="lg" className="mt-3">
                We are gathering permissions from the organizations we have
                worked with. In the meantime, the best way to understand our
                work is to explore how we help — or to talk with us directly.
              </Text>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-wrap gap-4">
              <CTAButton
                label="Explore How We Help"
                href="/how-we-help"
                location="clients-empty"
                variant="accent"
              />
              <CTAButton
                label="Book a Conversation"
                href="/book"
                location="clients-empty"
                variant="outline"
              />
            </Reveal>
          </Container>
        </Section>
      ) : (
        <Section tone="surface" aria-label="Client logos">
          <Container className="flex flex-col gap-stack">
            {useGroups ? (
              grouped.map((entry) => (
                <div key={entry.group}>
                  <Reveal>
                    <Heading level={2} visualLevel={4}>
                      {entry.label}
                    </Heading>
                  </Reveal>
                  <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {entry.clients.map((client) => (
                      <Reveal key={client.name}>
                        <LogoCard client={client} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {[...grouped.flatMap((entry) => entry.clients), ...ungrouped].map(
                  (client) => (
                    <Reveal key={client.name}>
                      <LogoCard client={client} />
                    </Reveal>
                  ),
                )}
              </div>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}
