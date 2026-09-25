"use client";

import { useEffect, useId, useRef, useState } from "react";

type Mermaid = (typeof import("mermaid"))["default"];

let mermaidPromise: Promise<Mermaid> | null = null;
// Mermaid keeps global state while rendering; run one render at a time.
let queue: Promise<unknown> = Promise.resolve();

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((mod) => mod.default);
  return mermaidPromise;
}

function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Maps the site's design tokens onto Mermaid's "base" theme. */
function themeVariables() {
  const bg = token("--bg");
  const elev = token("--bg-elev");
  const sunken = token("--bg-sunken");
  const fg = token("--fg");
  const muted = token("--fg-muted");
  const border = token("--border-strong");
  return {
    darkMode: document.documentElement.dataset.theme !== "light",
    background: bg,
    fontFamily: getComputedStyle(document.body).fontFamily,
    fontSize: "14px",
    primaryColor: elev,
    primaryTextColor: fg,
    primaryBorderColor: border,
    secondaryColor: sunken,
    secondaryTextColor: fg,
    secondaryBorderColor: border,
    tertiaryColor: sunken,
    tertiaryTextColor: fg,
    tertiaryBorderColor: border,
    mainBkg: elev,
    nodeBorder: border,
    nodeTextColor: fg,
    lineColor: muted,
    textColor: fg,
    titleColor: fg,
    clusterBkg: bg,
    clusterBorder: border,
    edgeLabelBackground: bg,
  };
}

async function renderChart(id: string, chart: string) {
  const mermaid = await loadMermaid();
  const run = queue.then(async () => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: themeVariables(),
      flowchart: { curve: "basis", padding: 12, htmlLabels: true },
    });
    try {
      return await mermaid.render(id, chart);
    } finally {
      // On a syntax error Mermaid leaves its scratch node in <body>.
      document.getElementById(`d${id}`)?.remove();
    }
  });
  queue = run.catch(() => undefined);
  const { svg } = await run;
  return svg;
}

export function MermaidClient({
  chart,
  caption,
  loadingLabel,
  errorLabel,
}: {
  chart: string;
  caption?: string;
  loadingLabel: string;
  errorLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const baseId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let cancelled = false;
    let renders = 0;

    const render = () => {
      renders += 1;
      renderChart(`${baseId}-${renders}`, chart)
        .then((result) => {
          if (!cancelled) setSvg(result);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    // Only load Mermaid when the diagram is about to scroll into view.
    const visibility = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visibility.disconnect();
          render();
        }
      },
      { rootMargin: "400px 0px" },
    );
    visibility.observe(element);

    // Re-render with the new palette when the theme changes.
    const themeWatcher = new MutationObserver(() => {
      if (renders > 0) render();
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelled = true;
      visibility.disconnect();
      themeWatcher.disconnect();
    };
  }, [baseId, chart]);

  return (
    <figure className="mermaid-figure">
      <div
        ref={containerRef}
        className="bg-schematic overflow-x-auto rounded-xl border border-border p-4 md:p-6"
      >
        {failed ? (
          <div className="text-sm text-fg-muted">
            <p>{errorLabel}</p>
            <pre className="mt-3">{chart}</pre>
          </div>
        ) : svg ? (
          <div
            className="mx-auto flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="grid min-h-64 place-items-center font-mono text-xs text-fg-subtle">
            <span>{loadingLabel}</span>
            <noscript>
              <pre className="text-left">{chart}</pre>
            </noscript>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 font-mono text-xs text-fg-subtle">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
