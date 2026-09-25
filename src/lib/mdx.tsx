import "server-only";

import type { Element, Root, Text } from "hast";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { mdxComponents } from "@/components/mdx";

export type Heading = { id: string; text: string };

function textContent(node: Element | Text): string {
  if (node.type === "text") return node.value;
  return node.children
    .map((child) => (child.type === "text" || child.type === "element" ? textContent(child) : ""))
    .join("");
}

/** Collects the h2 headings (after rehype-slug gave them ids) for the table of contents. */
function rehypeCollectHeadings({ headings }: { headings: Heading[] }) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" && typeof node.properties?.id === "string") {
        headings.push({ id: node.properties.id, text: textContent(node) });
      }
    });
  };
}

export async function renderMdx(source: string) {
  const headings: Heading[] = [];
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeSlug, [rehypeCollectHeadings, { headings }]],
      },
    },
  });
  return { content, headings };
}
