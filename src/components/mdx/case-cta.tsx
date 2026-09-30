import { getTranslations } from "next-intl/server";
import { primaryCta } from "@/lib/links";
import { ArrowIcon, ButtonLink } from "../button-link";

export async function CaseCTA() {
  const [t, tCta] = await Promise.all([getTranslations("case.cta"), getTranslations("cta")]);
  const cta = primaryCta();
  return (
    <aside className="mt-16! rounded-2xl border border-accent/40 bg-bg-elev p-6 md:p-8">
      <p className="text-2xl font-semibold tracking-tight text-fg">{t("title")}</p>
      <p className="mt-2 max-w-xl text-fg-muted">{t("body")}</p>
      <div className="mt-6">
        <ButtonLink href={cta.href} external={cta.external}>
          {cta.kind === "email" ? tCta("emailMe") : t("button")}
          <ArrowIcon direction={cta.external ? "up-right" : "right"} />
        </ButtonLink>
      </div>
    </aside>
  );
}
