import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

/** Three bullets: what it is, who it's for, the result. */
export async function TLDR({ children }: { children: ReactNode }) {
  const t = await getTranslations("case");
  return (
    <aside
      aria-label={t("tldr")}
      className="rounded-xl border border-border bg-bg-elev px-5 py-4 md:px-6 md:py-5"
    >
      <p className="font-mono text-eyebrow uppercase text-accent">{t("tldr")}</p>
      <div className="mt-2 text-fg [&_li+li]:mt-2 [&>ul]:mt-0">{children}</div>
    </aside>
  );
}
