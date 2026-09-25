import { getTranslations } from "next-intl/server";
import { bookingLink } from "@/lib/links";
import { ArrowIcon, ButtonLink } from "../button-link";

export async function CaseCTA() {
  const t = await getTranslations("case.cta");
  const booking = bookingLink();
  return (
    <aside className="mt-16! rounded-2xl border border-accent/40 bg-bg-elev p-6 md:p-8">
      <p className="text-2xl font-semibold tracking-tight text-fg">{t("title")}</p>
      <p className="mt-2 max-w-xl text-fg-muted">{t("body")}</p>
      <div className="mt-6">
        <ButtonLink href={booking.href} external={booking.external}>
          {t("button")}
          <ArrowIcon direction={booking.external ? "up-right" : "right"} />
        </ButtonLink>
      </div>
    </aside>
  );
}
