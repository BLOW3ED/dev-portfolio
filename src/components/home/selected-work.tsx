import { getTranslations } from "next-intl/server";
import type { WorkMeta } from "@/lib/work";
import { Section } from "../section";
import { WorkCard } from "../work-card";

export async function SelectedWork({ work }: { work: WorkMeta[] }) {
  const t = await getTranslations("work");
  const [featured, ...rest] = work;

  return (
    <Section id="work" index="01" eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid grid-cols-1 gap-5">
        {featured ? <WorkCard work={featured} featured /> : null}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <WorkCard key={item.slug} work={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
