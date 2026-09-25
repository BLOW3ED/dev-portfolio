import type { ReactNode } from "react";
import { isTodo } from "@/config/site";
import { withTodos } from "../todo";

export function Metrics({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
      {children}
    </dl>
  );
}

/**
 * One result. Use the exact number ("LCP 0.8 s on mobile"), never an
 * adjective; if a value is the client's estimate, say so in `note`.
 * Leave value="[TODO: …]" until the real number exists.
 */
export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  const pending = isTodo(value);
  return (
    <div className="flex flex-col gap-1.5 bg-bg p-4 md:p-5">
      <dt className="font-mono text-xs text-fg-subtle">{label}</dt>
      <dd
        className={
          pending
            ? "text-sm"
            : "text-2xl font-semibold tracking-tight text-fg tabular-nums"
        }
      >
        {withTodos(value)}
      </dd>
      {note ? <dd className="text-sm text-fg-muted">{note}</dd> : null}
    </div>
  );
}
