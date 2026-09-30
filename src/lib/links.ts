import { isPlaceholder, isTodo, site } from "@/config/site";

export type PrimaryCta = {
  href: string;
  external: boolean;
  /** What the button does, which decides its label. */
  kind: "booking" | "email" | "contact";
};

/**
 * Where the main call to action points: the booking link if there is one,
 * otherwise an email, otherwise the contact section.
 */
export function primaryCta(): PrimaryCta {
  if (!isTodo(site.links.booking)) {
    return { href: site.links.booking, external: true, kind: "booking" };
  }
  if (!isTodo(site.links.email)) {
    return { href: `mailto:${site.links.email}`, external: false, kind: "email" };
  }
  return { href: "/#contact", external: false, kind: "contact" };
}

/**
 * Contact rows to show. A link that isn't configured ("") is left out; one
 * that still reads "[TODO…" stays visible so it's easy to spot in development
 * (production builds refuse to run while any remain).
 */
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
  ].filter((link) => link.href || isPlaceholder(link.value));
}

export function sameAsLinks(): string[] {
  return [site.links.linkedin, site.links.github].filter((link) => !isTodo(link));
}

function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
