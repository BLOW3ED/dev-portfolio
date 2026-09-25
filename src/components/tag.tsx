export function Tag({ children }: { children: string }) {
  return (
    <li className="rounded border border-border px-2 py-0.5 font-mono text-xs text-fg-muted">
      {children}
    </li>
  );
}

export function TagList({ tags, label }: { tags: string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}
