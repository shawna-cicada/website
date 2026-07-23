import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";
import { CTAButton } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/motion/Reveal";
import { getInsight, getPublishedInsights } from "@/lib/cms";
import { INSIGHT_KIND_LABELS, formatInsightDate } from "@/lib/cms/format";
import { toVideoEmbedUrl } from "@/lib/cms/video";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  jsonLdString,
  videoObjectJsonLd,
} from "@/lib/seo/jsonld";

type PageProps = { params: Promise<{ slug: string }> };

// Newly published pieces appear without a redeploy.
export const revalidate = 300;

export async function generateStaticParams() {
  const insights = await getPublishedInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return {};
  return {
    title: insight.seoTitle || insight.title,
    description: insight.seoDescription || insight.summary,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.seoTitle || insight.title,
      description: insight.seoDescription || insight.summary,
      ...(insight.imageUrl
        ? {
            images: [
              {
                url: insight.imageUrl,
                ...(insight.imageWidth && insight.imageHeight
                  ? { width: insight.imageWidth, height: insight.imageHeight }
                  : {}),
                ...(insight.imageAlt ? { alt: insight.imageAlt } : {}),
              },
            ],
          }
        : {}),
    },
  };
}

/** Portable Text rendering mapped onto the site's editorial styles. */
const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-relaxed text-slate">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-6 font-display text-2xl font-bold text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 font-display text-xl font-bold text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-meadow pl-6 text-xl text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-6 text-lg text-slate">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 pl-6 text-lg text-slate">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-meadow-deep underline decoration-meadow-deep/40 underline-offset-4 hover:decoration-meadow-deep"
          {...(external ? { rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = typeof value?.url === "string" ? value.url : null;
      if (!url) return null;
      const alt = typeof value?.alt === "string" ? value.alt : "";
      return (
        // Inline body images have no dimension data in the projection;
        // a plain img with height:auto keeps the layout honest.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="h-auto w-full rounded-md" />
      );
    },
  },
};

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const isVideoKind = insight.kind === "video" || insight.kind === "podcast";
  const embedUrl = insight.videoUrl ? toVideoEmbedUrl(insight.videoUrl) : null;
  const meta = [
    insight.authorName,
    formatInsightDate(insight.publishedAt),
    insight.readingTime ? `${insight.readingTime} min read` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {insight.publishedAt ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(
              isVideoKind && insight.videoUrl
                ? videoObjectJsonLd({
                    title: insight.title,
                    description: insight.summary,
                    slug: insight.slug,
                    videoUrl: embedUrl ?? insight.videoUrl,
                    publishedAt: insight.publishedAt,
                    ...(insight.imageUrl
                      ? { thumbnailUrl: insight.imageUrl }
                      : {}),
                  })
                : articleJsonLd({
                    title: insight.title,
                    description: insight.summary,
                    slug: insight.slug,
                    authorName: insight.authorName ?? "Cicada Agility",
                    publishedAt: insight.publishedAt,
                    ...(insight.imageUrl ? { imageUrl: insight.imageUrl } : {}),
                  }),
            ),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Insights", path: "/insights" },
              { name: insight.title, path: `/insights/${insight.slug}` },
            ]),
          ),
        }}
      />

      <Section aria-labelledby="insight-heading">
        <Container width="narrow" className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="anim-rise text-sm">
            <Link
              href="/insights"
              className="text-meadow-deep underline decoration-meadow-deep/40 underline-offset-4 hover:decoration-meadow-deep"
            >
              Insights
            </Link>
            <span aria-hidden="true" className="mx-2 text-slate">
              /
            </span>
            <span className="text-slate">
              {INSIGHT_KIND_LABELS[insight.kind] ?? "Article"}
            </span>
          </nav>
          {insight.category ? (
            <div className="anim-rise">
              <Eyebrow>{insight.category}</Eyebrow>
            </div>
          ) : null}
          <div className="anim-fade" style={{ animationDuration: "400ms" }}>
            <Heading level={1} visualLevel={2} id="insight-heading">
              {insight.title}
            </Heading>
          </div>
          <div className="anim-rise" style={{ animationDelay: "120ms" }}>
            <Text size="lg" muted>
              {insight.summary}
            </Text>
            {meta ? <p className="mt-4 text-sm text-slate">{meta}</p> : null}
          </div>
        </Container>
      </Section>

      <Section aria-label="The piece" className="pt-0">
        <Container width="narrow" className="flex flex-col gap-6">
          {isVideoKind ? (
            embedUrl ? (
              <div className="aspect-video overflow-hidden rounded-md bg-ink">
                <iframe
                  src={embedUrl}
                  title={insight.title}
                  className="h-full w-full"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : insight.videoUrl ? (
              <TextLink href={insight.videoUrl} arrow>
                Watch the video
              </TextLink>
            ) : null
          ) : null}
          {insight.imageUrl && !isVideoKind ? (
            <Image
              src={insight.imageUrl}
              alt={insight.imageAlt ?? ""}
              width={insight.imageWidth ?? 1600}
              height={insight.imageHeight ?? 900}
              sizes="(min-width: 1024px) 768px, 100vw"
              className="h-auto w-full rounded-md"
              priority={false}
            />
          ) : null}
          {insight.body ? (
            <div className="flex flex-col gap-5">
              <PortableText value={insight.body} components={bodyComponents} />
            </div>
          ) : null}
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="insight-cta-heading">
        <Container className="flex max-w-3xl flex-col items-start gap-6">
          <Reveal>
            <Heading level={2} id="insight-cta-heading">
              Recognize your company in this?
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Text size="lg" className="text-paper/75">
              A short conversation is the fastest way to find out whether —
              and how — we can help.
            </Text>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap gap-4">
            <CTAButton
              label="Book a Conversation"
              href="/book"
              location={`insight-${insight.slug}`}
              variant="accent"
              size="lg"
            />
            <CTAButton
              label="More insights"
              href="/insights"
              location={`insight-${insight.slug}`}
              variant="outline"
              size="lg"
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
