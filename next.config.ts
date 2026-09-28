import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { analyticsOrigins } from "./src/config/analytics";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";
const isHttps = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

/**
 * Every page is prerendered, so there are no per-request nonces: inline
 * scripts (theme bootstrap, RSC payload) need 'unsafe-inline'. Everything
 * else is locked to this origin, plus the analytics host when one is set.
 */
const analytics = analyticsOrigins().join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${analytics ? ` ${analytics}` : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${analytics ? ` ${analytics}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Self-contained server (.next/standalone/server.js) for the Docker image.
  output: "standalone",
  poweredByHeader: false,
  // next-mdx-remote ships ESM that Turbopack needs to transpile.
  transpilePackages: ["next-mdx-remote"],
  // Case studies are read from /content at build time; keep them next to the
  // server too, in case a route ever renders on demand.
  outputFileTracingIncludes: {
    "/*": ["content/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
