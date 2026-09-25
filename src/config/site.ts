/**
 * Site-wide settings that are not translatable copy.
 *
 * Any value that still reads "[TODO: …]" is content Carlo has to provide.
 * Placeholders stay visible in development and `npm run build` refuses to
 * produce a production build while any remain (see scripts/check-todos.mjs).
 */

export const TODO_PREFIX = "[TODO";

export function isTodo(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith(TODO_PREFIX);
}

export const site = {
  /** Short name used in the header, titles and OG images. */
  name: "Carlo",
  // [TODO: Carlo — full name for SEO metadata and the JSON-LD Person block]
  fullName: "[TODO: Carlo — full name]",

  /**
   * Canonical origin. Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is
   * connected (suggestion from the spec: carlo[lastname].dev).
   */
  url: resolveSiteUrl(),

  links: {
    // [TODO: Carlo — Calendly or Cal.com booking link]
    booking: "[TODO: Carlo — Calendly/Cal.com URL]",
    // [TODO: Carlo — public contact email]
    email: "[TODO: Carlo — contact email]",
    // [TODO: Carlo — LinkedIn profile URL]
    linkedin: "[TODO: Carlo — LinkedIn URL]",
    // [TODO: Carlo — GitHub profile URL]
    github: "[TODO: Carlo — GitHub URL]",
  },

  // [TODO: Carlo — professional photo, e.g. "/images/carlo.jpg" in /public]
  photo: "[TODO: Carlo — photo]",

  timezone: "GMT-6",
  company: { name: "Ápice HQ", url: "https://apicehq.com" },
} as const;

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
