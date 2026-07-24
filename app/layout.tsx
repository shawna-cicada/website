import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";

/**
 * Brand fonts, self-hosted from the Fontsource packages via next/font:
 * latin subsets only, preloaded, font-display swap — the display font no
 * longer delays the LCP repaint the way late-discovered CSS fonts do.
 * Montserrat (the brand deck's headline face) carries all display type;
 * Open Sans carries body text.
 */
const openSans = localFont({
  src: "../node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2",
  variable: "--font-open-sans",
  display: "swap",
});
const montserrat = localFont({
  src: "../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cicadaagility.com"),
  title: {
    default: "Cicada Agility | Growth Happens in Stages",
    template: "%s | Cicada Agility",
  },
  description:
    "Cicada Agility helps founders and leadership teams recognize what their company has outgrown, evolve how they lead and operate, and build the clarity, trust, and systems required for the next stage of growth.",
  alternates: { canonical: "./" },
  openGraph: {
    siteName: "Cicada Agility",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${montserrat.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {/* Without JavaScript, entrance animations must never hide content. */}
        <noscript>
          <style>{`.reveal-item{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
        <SiteChrome>
          <Header />
        </SiteChrome>
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteChrome>
          <Footer />
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
