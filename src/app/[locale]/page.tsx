import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { MoreProjects } from "@/components/home/more-projects";
import { Process } from "@/components/home/process";
import { SelectedWork } from "@/components/home/selected-work";
import { Services } from "@/components/home/services";
import { JsonLd } from "@/components/json-ld";
import { isTodo, site } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor, resolveLocale } from "@/lib/i18n";
import { sameAsLinks } from "@/lib/links";
import { getAllWork } from "@/lib/work";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: getPathname({ locale, href: "/" }),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const [work, tMeta] = await Promise.all([
    getAllWork(locale),
    getTranslations("meta"),
  ]);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: isTodo(site.fullName) ? site.name : site.fullName,
    url: new URL(getPathname({ locale, href: "/" }), site.url).toString(),
    jobTitle: tMeta("jobTitle"),
    description: tMeta("description"),
    worksFor: { "@type": "Organization", name: site.company.name, url: site.company.url },
    affiliation: { "@type": "CollegeOrUniversity", name: "UPIIZ-IPN" },
    address: { "@type": "PostalAddress", addressCountry: "MX" },
    knowsAbout: ["AI agents", "Workflow automation", "n8n", "Supabase", "Next.js", "RAG"],
    ...(sameAsLinks().length ? { sameAs: sameAsLinks() } : {}),
  };

  return (
    <>
      <JsonLd data={person} />
      <Hero />
      <SelectedWork work={work} />
      <MoreProjects />
      <Services />
      <Process />
      <About />
      <Contact />
    </>
  );
}
