import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${site.name} — AI engineer`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale);
  const [tHero, tMeta] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);

  return renderOgImage({
    eyebrow: site.name,
    title: tMeta("ogTagline"),
    description: tHero("headline"),
    footer: tHero("subline"),
  });
}
