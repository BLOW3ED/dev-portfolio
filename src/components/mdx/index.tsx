import { isValidElement, type ComponentProps, type ReactElement } from "react";
import type { MDXComponents } from "mdx/types";
import { Link } from "@/components/link";
import { Todo } from "../todo";
import { CaseCTA } from "./case-cta";
import { Decision } from "./decision";
import { Figure } from "./figure";
import { Mermaid } from "./mermaid";
import { Metric, Metrics } from "./metrics";
import { Stack } from "./stack";
import { TLDR } from "./tldr";

type CodeElement = ReactElement<{ className?: string; children?: unknown }>;

/** ```mermaid fences become rendered diagrams; everything else stays a code block. */
function Pre({ children, ...props }: ComponentProps<"pre">) {
  if (isValidElement(children)) {
    const code = children as CodeElement;
    if (code.props.className === "language-mermaid") {
      return <Mermaid chart={String(code.props.children ?? "")} />;
    }
  }
  return <pre {...props}>{children}</pre>;
}

function Anchor({ href = "", children, ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  pre: Pre,
  a: Anchor,
  TLDR,
  Decision,
  Metrics,
  Metric,
  Stack,
  CTA: CaseCTA,
  Figure,
  Mermaid,
  Todo,
};
