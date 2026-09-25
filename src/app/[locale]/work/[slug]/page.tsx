import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArrowIcon } from "@/components/button-link";
import { Container } from "@/components/container";
import { StatusBadge } from "@/components/status-badge";
import { TagList } from "@/components/tag";
import { withTodos } from "@/components/todo";
import { Link } from "@/components/link";
import { getPathname } from "@/i18n/navigation";
import { alternatesFor, resolveLocale } from "@/lib/i18n";
import { renderMdx } from "@/lib/mdx";
import { getAllWork, getWork, getWorkSlugs } from "@/lib/work";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const slugs = await getWorkSlugs(resolveLocale(params.locale));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const entry = await getWork(locale, slug);
  if (!entry) notFound();

  const path = `/work/${slug}`;
  return {
    title: entry.meta.title,
    description: entry.meta.summary,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "article",
      title: entry.meta.title,
      description: entry.meta.summary,
      url: getPathname({ locale, href: path }),
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  setRequestLocale(locale);

  const entry = await getWork(locale, slug);
  if (!entry) notFound();

  const [{ content, headings }, allWork, t, tWork] = await Promise.all([
    renderMdx(entry.body),
    getAllWork(locale),
    getTranslations("case"),
    getTranslations("work"),
  ]);

  const { meta } = entry;
  const position = allWork.findIndex((work) => work.slug === slug);
  const next = allWork[(position + 1) % allWork.length];
  const client = meta.client === "internal" ? tWork("internal") : meta.client;

  const facts = [
    { label: tWork("client"), value: client },
    { label: tWork("year"), value: meta.year },
    ...(meta.role ? [{ label: tWork("role"), value: meta.role }] : []),
  ];

  return (
    <article className="pb-24">
      <header className="border-b border-border pt-10 pb-12 md:pt-16 md:pb-16">
        <Container>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted hover:text-fg"
          >
            <ArrowIcon direction="left" />
            {t("back")}
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusBadge status={meta.status} />
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-fg text-balance md:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-fg-muted md:text-xl">{meta.summary}</p>

          <dl className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-[auto_auto_1fr]">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-fg">{withTodos(fact.value)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <TagList tags={meta.tags} label={t("stack")} />
          </div>
        </Container>
      </header>

      {meta.cover ? (
        <Container className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border">
            <Image
              src={meta.cover}
              alt=""
              fill
              priority
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      ) : null}

      <Container className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16">
          <div className="prose max-w-prose min-w-0">{content}</div>

          {headings.length > 0 ? (
            <aside className="hidden lg:block">
              <nav aria-label={t("onThisPage")} className="sticky top-24">
                <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  {t("onThisPage")}
                </p>
                <ol className="mt-4 space-y-2.5 border-l border-border text-sm">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-fg-muted transition-colors hover:border-fg hover:text-fg"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>

        {next && next.slug !== slug ? (
          <nav aria-label={t("nextCase")} className="mt-20 border-t border-border pt-8">
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                {t("nextCase")}
              </span>
              <span className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-fg transition-colors group-hover:text-accent md:text-3xl">
                {next.title}
                <ArrowIcon />
              </span>
            </Link>
          </nav>
        ) : null}
      </Container>
    </article>
  );
}
