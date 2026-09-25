import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

/** Narrows a route param to a supported locale, or renders the 404 page. */
export function resolveLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}

/** Canonical URL plus hreflang alternates for a path (e.g. "/work/hanami"). */
export function alternatesFor(locale: Locale, href: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href })]),
  );
  return {
    canonical: getPathname({ locale, href }),
    languages: {
      ...languages,
      "x-default": getPathname({ locale: routing.defaultLocale, href }),
    },
  };
}

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_MX",
};
