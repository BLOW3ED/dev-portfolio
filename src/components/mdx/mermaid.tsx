import { getTranslations } from "next-intl/server";
import { MermaidClient } from "./mermaid-client";

/**
 * Architecture diagram. In MDX, write a ```mermaid fenced block; the caption
 * comes from the diagram's own `accTitle:` line (also used for screen readers).
 */
export async function Mermaid({ chart }: { chart: string }) {
  const t = await getTranslations("case");
  const source = chart.trim();
  const caption = source.match(/^\s*accTitle:\s*(.+)$/m)?.[1]?.trim();

  return (
    <MermaidClient
      chart={source}
      caption={caption}
      loadingLabel={t("diagramLoading")}
      errorLabel={t("diagramError")}
    />
  );
}
