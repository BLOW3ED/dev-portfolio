import { isTodo, site } from "@/config/site";

export type ResolvedLink = { href: string; external: boolean; pending: boolean };

/**
 * Where "Book a call" points. Until the Calendly/Cal.com link exists it falls
 * back to the contact section, which shows the pending placeholders.
 */
export function bookingLink(): ResolvedLink {
  if (isTodo(site.links.booking)) {
    return { href: "/#contact", external: false, pending: true };
  }
  return { href: site.links.booking, external: true, pending: false };
}

export function contactLinks() {
  const { email, linkedin, github } = site.links;
  return [
    {
      key: "email" as const,
      value: email,
      href: isTodo(email) ? null : `mailto:${email}`,
      display: email,
    },
    {
      key: "linkedin" as const,
      value: linkedin,
      href: isTodo(linkedin) ? null : linkedin,
      display: prettyUrl(linkedin),
    },
    {
      key: "github" as const,
      value: github,
      href: isTodo(github) ? null : github,
      display: prettyUrl(github),
    },
  ];
}

export function sameAsLinks(): string[] {
  return [site.links.linkedin, site.links.github].filter((link) => !isTodo(link));
}

function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
