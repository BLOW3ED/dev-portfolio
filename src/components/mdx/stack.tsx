import type { ReactNode } from "react";

/** Wraps a markdown list and renders it as technology chips. */
export function Stack({ children }: { children: ReactNode }) {
  return <div className="stack-list">{children}</div>;
}
