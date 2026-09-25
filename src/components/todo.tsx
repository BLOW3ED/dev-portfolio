import type { ReactNode } from "react";

/**
 * Visible placeholder for content Carlo still has to provide.
 * `npm run build` fails while any "[TODO" or <Todo> remains in /content,
 * /messages or /src/config (see scripts/check-todos.mjs).
 */
export function Todo({ children }: { children?: ReactNode }) {
  return (
    <mark className="todo" data-todo="">
      [TODO{children ? <>: {children}</> : null}]
    </mark>
  );
}

const TODO_PATTERN = /(\[TODO[^\]]*\])/g;

/** Renders a translated string, highlighting any "[TODO: …]" placeholder in it. */
export function withTodos(text: string): ReactNode {
  if (!text.includes("[TODO")) return text;
  return text.split(TODO_PATTERN).map((part, index) =>
    part.startsWith("[TODO") ? (
      <mark key={index} className="todo" data-todo="">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
