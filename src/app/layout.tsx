import type { ReactNode } from "react";

// The real root layout (with <html>) is app/[locale]/layout.tsx. This file
// only exists because app/not-found.tsx needs a layout at the root.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
