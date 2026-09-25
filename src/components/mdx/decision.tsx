import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

/**
 * A key decision: what was chosen (title), why (children) and what it cost
 * (tradeoff). Numbered automatically with a CSS counter.
 */
export async function Decision({
  title,
  tradeoff,
  children,
}: {
  title: string;
  tradeoff?: string;
  children: ReactNode;
}) {
  const t = await getTranslations("case");
  return (
    <div className="decision rounded-xl border border-border p-5 md:p-6">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">
        <span className="decision-number text-accent" aria-hidden="true" />
        {t("decision")}
      </p>
      <h3 className="mt-2! text-lg font-semibold tracking-tight text-fg">{title}</h3>
      <div className="mt-3 text-[1rem] [&>*+*]:mt-3">{children}</div>
      {tradeoff ? (
        <p className="mt-4 border-t border-border pt-3 text-[0.95rem]">
          <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
            {t("tradeoff")} ·{" "}
          </span>
          {tradeoff}
        </p>
      ) : null}
    </div>
  );
}
