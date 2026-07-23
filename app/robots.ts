import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/design-system"],
      },
    ],
    sitemap: "https://www.cicadaagility.com/sitemap.xml",
  };
}
