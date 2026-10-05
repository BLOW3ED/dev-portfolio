/**
 * Cookieless, privacy-friendly analytics — no consent banner needed.
 *
 * Nothing is loaded unless one of these is set at build time (pages are
 * prerendered, so the values are baked into the HTML):
 *
 *   Plausible (cloud or self-hosted)
 *     NEXT_PUBLIC_PLAUSIBLE_DOMAIN=carlogarza.dev
 *     NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js   (optional)
 *
 *   Umami (cloud or self-hosted)
 *     NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *     NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
 *
 * Kept free of Next/React imports because next.config.ts reads it to allow
 * the script's origin in the Content-Security-Policy.
 */

export type AnalyticsScript = {
  src: string;
  attributes: Record<string, string>;
};

const DEFAULT_PLAUSIBLE_SRC = "https://plausible.io/js/script.js";

export function analyticsScript(): AnalyticsScript | null {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (plausibleDomain) {
    return {
      src: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim() || DEFAULT_PLAUSIBLE_SRC,
      attributes: { "data-domain": plausibleDomain },
    };
  }

  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC?.trim();
  if (umamiId && umamiSrc) {
    return { src: umamiSrc, attributes: { "data-website-id": umamiId } };
  }

  return null;
}

/** Origins the analytics script loads from and reports to, for the CSP. */
export function analyticsOrigins(): string[] {
  const script = analyticsScript();
  if (!script) return [];
  try {
    return [new URL(script.src).origin];
  } catch {
    throw new Error(`Analytics script URL is not a valid absolute URL: "${script.src}"`);
  }
}
