import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getWork, getWorkSlugs } from "@/lib/work";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `Case study by ${site.name}`;

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await getWorkSlugs(locale)).map((slug) => ({ locale, slug })),
    ),
  );
  return params.flat();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const entry = await getWork(locale, slug);
  if (!entry) notFound();

  const [tMeta, tStatus] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "work.status" }),
  ]);

  return renderOgImage({
    eyebrow: tMeta("caseStudy"),
    title: entry.meta.title,
    description: entry.meta.summary,
    footer: `${site.name} — ${tMeta("jobTitle")}`,
    status: { label: tStatus(entry.meta.status), live: entry.meta.status === "production" },
  });
}
