import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Cicada Agility | Growth Happens in Stages. Leadership Must Evolve With It.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social sharing card: brand navy, meadow accent, the tagline. */
export default function OpenGraphImage() {
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
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#18b698",
            }}
          />
          <div
            style={{
              color: "#e6eaf5",
              fontSize: 30,
              letterSpacing: 10,
              display: "flex",
            }}
          >
            CICADA
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#fafbfc",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.15,
              maxWidth: 980,
              display: "flex",
            }}
          >
            Growth Happens in Stages. Leadership Must Evolve With It.
          </div>
          <div style={{ color: "#18b698", fontSize: 28, display: "flex" }}>
            cicadaagility.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
