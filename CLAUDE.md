@AGENTS.md

# Project rules

- Source of truth for scope and content: `docs/PORTFOLIO_SPEC.md`. README explains structure and conventions.
- **Never invent metrics, clients, testimonials or results.** Missing data stays a visible placeholder: `"[TODO: Carlo — …]"` in JSON/frontmatter/config, `<Todo>…</Todo>` in MDX.
- All copy lives in `messages/{en,es}.json` or `content/{en,es}/work/*.mdx` — never hard-coded in components. Every change to copy is made in both languages.
- Case-study slugs are identical across locales; each MDX follows the fixed template order in the spec (§7).
- Use `Link` from `@/components/link` (server, locale-aware) — not next-intl's client `Link`, to keep i18n code out of the browser bundle.
- Before committing: `npm run lint`, `npm run typecheck`, and `ALLOW_TODOS=1 npm run build`.
