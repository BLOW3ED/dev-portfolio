import type { ComponentProps } from "react";
import NextLink from "next/link";
import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** "/work/hanami#results" → "/es/work/hanami#results" for the current locale. */
export function localizeHref(locale: Locale, href: string) {
  const [path, hash] = href.split("#");
  const localized = getPathname({ locale, href: path || "/" });
  return hash ? `${localized}#${hash}` : localized;
}

/**
 * Locale-aware link resolved on the server, so no i18n code ships to the
 * browser. Takes a locale-less href such as "/work/hanami" or "/#contact".
 */
export async function Link({
  href,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = (await getLocale()) as Locale;
  return <NextLink href={localizeHref(locale, href)} {...props} />;
}
