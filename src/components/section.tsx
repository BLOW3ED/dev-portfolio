import type { ReactNode } from "react";
import { Container } from "./container";

export function Eyebrow({
  index,
  children,
  as: Tag = "p",
  id,
}: {
  index?: string;
  children: ReactNode;
  as?: "p" | "h2";
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className="flex items-center gap-3 font-mono text-eyebrow uppercase text-fg-subtle"
    >
      {index ? <span className="text-accent">{index}</span> : null}
      <span>{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </Tag>
  );
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  const labelId = `${id}-label`;
  return (
    <section id={id} aria-labelledby={labelId} className="py-16 md:py-section">
      <Container>
        <Eyebrow as="h2" id={labelId} index={index}>
          {eyebrow}
        </Eyebrow>
        {title ? (
          <p className="mt-6 max-w-3xl text-2xl font-semibold tracking-tight text-fg text-balance md:text-3xl">
            {title}
          </p>
        ) : null}
        <div className="mt-10 md:mt-12">{children}</div>
      </Container>
    </section>
  );
}
