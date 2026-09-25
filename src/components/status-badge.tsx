import { getTranslations } from "next-intl/server";
import type { WorkStatus } from "@/lib/work";

export async function StatusBadge({ status }: { status: WorkStatus }) {
  const t = await getTranslations("work.status");
  const live = status === "production";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted">
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${live ? "bg-accent" : "bg-warn"}`}
      />
      {t(status)}
    </span>
  );
}
