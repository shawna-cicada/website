import type { Metadata } from "next";
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
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
