import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/components/link";
import type { WorkMeta } from "@/lib/work";
import { ArrowIcon } from "./button-link";
import { FlowDiagram } from "./flow-diagram";
import { StatusBadge } from "./status-badge";
import { TagList } from "./tag";
import { withTodos } from "./todo";

export async function WorkCard({
  work,
  featured = false,
}: {
  work: WorkMeta;
  featured?: boolean;
}) {
  const t = await getTranslations("work");
  const client = work.client === "internal" ? t("internal") : work.client;

  const visual = work.cover ? (
    <div className="relative aspect-[16/10] h-full min-h-56">
      <Image
        src={work.cover}
        alt=""
        fill
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover"
      />
    </div>
  ) : (
    <FlowDiagram steps={work.flow} label={t("diagramLabel")} horizontal={featured} />
  );

  return (
    <article
      className={`group relative flex overflow-hidden rounded-xl border border-border bg-bg-elev transition-colors hover:border-border-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent ${
        featured ? "flex-col lg:grid lg:grid-cols-2" : "flex-col"
      }`}
    >
      <div
        className={`border-border ${
          featured ? "border-b lg:order-2 lg:border-b-0 lg:border-l" : "border-b"
        }`}
      >
        {visual}
      </div>

      <div className={`flex flex-1 flex-col gap-4 p-5 ${featured ? "md:p-8" : "md:p-6"}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <StatusBadge status={work.status} />
          <p className="font-mono text-xs text-fg-subtle">
            {client} · {withTodos(work.year)}
          </p>
        </div>

        <h3
          className={`font-semibold tracking-tight text-fg ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}
        >
          <Link
            href={`/work/${work.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {work.title}
          </Link>
        </h3>

        <p className={`text-fg-muted ${featured ? "md:text-lg" : ""}`}>{work.summary}</p>

        <div className="mt-auto flex flex-col gap-5 pt-2">
          <TagList tags={work.tags} />
          <span className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors group-hover:text-accent">
            {t("readCase")}
            <ArrowIcon />
          </span>
        </div>
      </div>
    </article>
  );
}
