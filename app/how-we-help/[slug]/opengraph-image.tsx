import { ImageResponse } from "next/og";
import { getPracticeArea, getPracticeAreas } from "@/lib/cms";

export const alt = "Cicada Agility practice area";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const practices = await getPracticeAreas();
  return practices.map((practice) => ({ slug: practice.slug }));
}

/** Per-practice social card: the business-problem headline on brand navy. */
export default async function PracticeOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const practice = await getPracticeArea(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1e2a44",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#18b698",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {practice?.name ?? "How We Help"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#fafbfc",
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.15,
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {practice?.headline ?? "The challenge is rarely just leadership, process, or culture."}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: "#18b698",
              }}
            />
            <div style={{ color: "#e6eaf5", fontSize: 26, display: "flex" }}>
              Cicada Agility · cicadaagility.com
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
