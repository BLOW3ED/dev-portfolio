/**
 * Site-wide settings that are not translatable copy.
 *
 * Two kinds of "missing":
 *   ""          optional and not provided → the element is simply left out
 *   "[TODO: …]" required and still pending → visible in development, and  (check-todos: ignore)
 *               `npm run build` refuses to run (see scripts/check-todos.mjs)
 */

export const TODO_PREFIX = "[TODO"; // check-todos: ignore

/** A placeholder that still has to be filled in. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !!value && value.trim().startsWith(TODO_PREFIX);
}

/** Not usable yet: empty, or still a placeholder. */
export function isTodo(value: string | undefined | null): boolean {
  return !value?.trim() || isPlaceholder(value);
}

export const site = {
  /** Short name used in the header, titles and OG images. */
  name: "Carlo",
  /** Full name for SEO metadata and the JSON-LD Person block. Optional. */
  fullName: "",

  /**
   * Canonical origin, from NEXT_PUBLIC_SITE_URL. The Docker build sets it to
   * https://$DOMAIN (see docker-compose.yml).
   */
  url: resolveSiteUrl(),

  links: {
    /** Calendly or Cal.com. Optional: without it, "Book a call" becomes "Email me". */
    booking: "https://calendly.com/carlogarzamx",
    /** Public contact email. Required. */
    email: "carlogarzamx@gmail.com",
    /** Optional. */
    linkedin: "https://www.linkedin.com/in/carlo-davila-b42368293/",
    /** Optional. */
    github: "https://github.com/BLOW3ED",
  },

  /** Professional photo in /public, e.g. "/images/carlo.jpg". Optional. */
  photo: "/images/carlo.jpg",

  timezone: "GMT-6",
  company: { name: "Ápice HQ", url: "https://apicehq.com" },
} as const;

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "http://localhost:3000";
}
