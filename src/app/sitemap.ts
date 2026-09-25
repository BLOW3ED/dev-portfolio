import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getWorkSlugs } from "@/lib/work";

function absolute(locale: (typeof routing.locales)[number], href: string) {
  return new URL(getPathname({ locale, href }), site.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getWorkSlugs(routing.defaultLocale);
  const paths = ["/", ...slugs.map((slug) => `/work/${slug}`)];

  return paths.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absolute(locale, href),
      changeFrequency: "monthly" as const,
      priority: href === "/" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absolute(l, href)])),
      },
    })),
  );
}
