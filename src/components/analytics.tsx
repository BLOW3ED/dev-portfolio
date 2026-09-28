import Script from "next/script";
import { analyticsScript } from "@/config/analytics";

/** Loads the configured analytics script (see src/config/analytics.ts), if any. */
export function Analytics() {
  const script = analyticsScript();
  if (!script) return null;
  return <Script src={script.src} strategy="afterInteractive" {...script.attributes} />;
}
