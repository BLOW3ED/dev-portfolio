import { getTranslations } from "next-intl/server";
import { Link } from "@/components/link";
import { ArrowIcon } from "../button-link";
import { Section } from "../section";

type Step = { title: string; description: string; highlight?: boolean };

export async function Process() {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <Section id="process" index="03" eyebrow={t("eyebrow")} title={t("title")}>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`flex flex-col gap-3 rounded-xl border p-6 ${
              step.highlight ? "border-accent/50 bg-bg-elev" : "border-border"
            }`}
          >
            <span
              aria-hidden="true"
              className={`font-mono text-sm ${step.highlight ? "text-accent" : "text-fg-subtle"}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-semibold tracking-tight text-fg">{step.title}</h3>
            <p className="text-sm text-fg-muted">{step.description}</p>
            {step.highlight ? (
              <Link
                href={t("highlightHref")}
                className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-fg hover:text-accent"
              >
                {t("highlightNote")}
                <ArrowIcon />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
