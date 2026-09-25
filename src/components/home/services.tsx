import { getTranslations } from "next-intl/server";
import { Section } from "../section";

type Service = { title: string; channels: string; description: string };

export async function Services() {
  const t = await getTranslations("services");
  const items = t.raw("items") as Service[];

  return (
    <Section id="services" index="02" eyebrow={t("eyebrow")} title={t("title")}>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {items.map((service) => (
          <li key={service.title} className="flex flex-col gap-4 bg-bg p-6 md:p-7">
            <p className="font-mono text-xs text-accent">{service.channels}</p>
            <h3 className="text-lg font-semibold tracking-tight text-fg">{service.title}</h3>
            <p className="text-fg-muted">{service.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
