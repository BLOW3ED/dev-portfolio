/**
 * Lightweight, server-rendered schematic used on work cards. The full
 * architecture diagrams (Mermaid) live inside each case study.
 */
export function FlowDiagram({
  steps,
  label,
  horizontal = false,
}: {
  steps: string[];
  label: string;
  horizontal?: boolean;
}) {
  const direction = horizontal ? "flex-col lg:flex-row lg:items-center" : "flex-col";

  return (
    <div className="bg-schematic relative flex h-full min-h-56 flex-col justify-center gap-4 p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">{label}</p>
      <ol className={`flex ${direction}`} aria-label={`${label}: ${steps.join(" → ")}`}>
        {steps.map((step, index) => {
          const last = index === steps.length - 1;
          return (
            <li
              key={step}
              className={`flex ${horizontal ? "flex-col lg:flex-1 lg:flex-row lg:items-center" : "flex-col"}`}
            >
              <span
                className={`rounded-md border bg-bg px-3 py-2 text-center font-mono text-xs leading-snug ${
                  last ? "border-accent/50 text-accent" : "border-border-strong text-fg"
                } ${horizontal ? "lg:flex-1" : ""}`}
              >
                {step}
              </span>
              {last ? null : <Connector horizontal={horizontal} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Connector({ horizontal }: { horizontal: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative mx-auto block h-5 w-px bg-border-strong ${
        horizontal ? "lg:mx-0 lg:h-px lg:w-5" : ""
      }`}
    >
      <span
        className={`absolute -bottom-px left-1/2 size-1.5 -translate-x-1/2 rotate-45 border-r border-b border-border-strong ${
          horizontal
            ? "lg:top-1/2 lg:right-0 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2 lg:-rotate-45"
            : ""
        }`}
      />
    </span>
  );
}
