import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/open-sans";
import "@fontsource-variable/montserrat";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Cicada Agility — Growth Happens in Stages",
    template: "%s | Cicada Agility",
  },
  description:
    "Cicada Agility helps founders and leadership teams recognize what their company has outgrown, evolve how they lead and operate, and build the clarity, trust, and systems required for the next stage of growth.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {/* Without JavaScript, Framer Motion entrance states would leave
            content at its initial hidden style; force it visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
