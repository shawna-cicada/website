import type { NextConfig } from "next";
import { WIX_REDIRECTS } from "./lib/seo/redirects";

/**
 * Content Security Policy — the launch baseline.
 * Allows exactly the third parties the site uses: Calendly (booking
 * embed), YouTube/Vimeo (video embeds, Phase 6), Sanity (Studio + CDN),
 * and Vercel Analytics. 'unsafe-inline' remains for Next's inline
 * bootstrap and styled-components (Studio); moving to nonces is a
 * documented post-launch hardening step (docs/LAUNCH_CHECKLIST.md).
 */
const CSP = [
  "default-src 'self'",
  // core.sanity-cdn.com serves the Studio's bridge script (Sanity v6);
  // lh3.googleusercontent.com serves editor avatars inside /admin.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com https://va.vercel-scripts.com https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.calendly.com https://i.ytimg.com https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.calendly.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://calendly.com https://*.calendly.com https://cal.com https://*.cal.com https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.calendly.com",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Sanity-hosted content images (Phase 2+); SVG placeholders render
    // unoptimized locally.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    return WIX_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
