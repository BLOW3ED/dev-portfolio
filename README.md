# Carlo — portfolio

Personal portfolio built from [`docs/PORTFOLIO_SPEC.md`](docs/PORTFOLIO_SPEC.md). English at `/`, Spanish at `/es`.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MDX (`next-mdx-remote`) · next-intl · Mermaid · Vercel Analytics.

```bash
npm install
npm run dev          # http://localhost:3000
npm run todos        # list every placeholder still to fill in
npm run lint && npm run typecheck
npm run build        # blocked while placeholders remain — see below
```

## Where things live

| What | Where |
| --- | --- |
| Home and UI copy (EN / ES) | `messages/en.json`, `messages/es.json` |
| Case studies | `content/{en,es}/work/{slug}.mdx` — same slug in both languages |
| Name, booking link, email, LinkedIn, GitHub, photo | `src/config/site.ts` |
| Design tokens (colors, type, spacing, dark/light) | `src/app/globals.css` |
| Case-study components | `src/components/mdx/` |
| Original spec | `docs/PORTFOLIO_SPEC.md` |

No copy is hard-coded in components: change text in `messages/` or `content/`.

## Writing a case study

Each MDX file follows the fixed template from the spec: TL;DR → Context → The problem → Architecture → Key decisions & trade-offs → The hard part → Results → Stack → CTA. `##` headings feed the "On this page" sidebar automatically.

Frontmatter:

```yaml
title: "Hanami Hair Studio"
summary: "One sentence. Shown on the home card, the case header and as the meta description."
tags: ["n8n", "Multi-agent"]           # 3–4, shown on the card
cover: ""                              # optional image in /public, e.g. /images/work/hanami.png
order: 1                               # position on the home page (1 = featured card)
status: "production"                   # or "in-development"
client: "Hanami Hair Studio"           # or "internal"
year: "2025"
role: "UI/UX design, frontend…"        # optional
flow: ["WhatsApp · Instagram", "Router", "Specialist agents", "RAG · Calendar"]  # card diagram when there's no cover
```

Components available inside MDX (no imports needed):

```mdx
<TLDR>

- **What:** …
- **For:** …
- **Result:** …

</TLDR>

<Decision title="What was decided" tradeoff="What it cost.">

Why it was decided.

</Decision>

<Metrics>
  <Metric label="LCP · mobile" value="0.8 s" note="PageSpeed Insights, field data" />
</Metrics>

<Stack>

- n8n
- Supabase

</Stack>

<Figure src="/images/work/hanami-chat.png" alt="…" width="1600" height="1000" caption="…" />

<CTA />
```

Architecture diagrams are plain ` ```mermaid ` fenced blocks. Add `accTitle:` (used as the caption and for screen readers) and `accDescr:` lines, and mark the source-of-truth node with `classDef truth stroke-width:1.5px` + `class NODE truth` — the site colors it with the accent in both themes. Diagrams render in the browser, only when they scroll into view.

**Results rule:** exact numbers, not adjectives ("LCP 0.8 s on mobile", not "almost instant"). If the number is the client's estimate, say so in `note`. Never invent one: leave the placeholder.

## Placeholders (`[TODO]`)

Anything Carlo still has to provide is marked as `"[TODO: Carlo — …]"` (JSON, frontmatter, `src/config/site.ts`) or `<Todo>…</Todo>` (MDX). They render as a visible dashed yellow label so they're easy to spot while developing.

`npm run build` runs `scripts/check-todos.mjs` first and **fails while any placeholder remains** in `content/`, `messages/` or `src/config/`, so a production deploy can't show them. To build anyway:

- `ALLOW_TODOS=1 npm run build` locally, or
- a Vercel **preview** deployment (`VERCEL_ENV=preview`) — allowed automatically. Production deployments are not.

## Before launch (spec §12)

Run `npm run todos` for the exact list. In short:

- [ ] Domain → set `NEXT_PUBLIC_SITE_URL` (e.g. `https://carlo….dev`) in Vercel
- [ ] Professional photo → `/public/images/…`, path in `src/config/site.ts`
- [ ] Final bio EN/ES → `about.bio` in `messages/*.json`
- [ ] Calendly/Cal.com, email, LinkedIn, GitHub, full name → `src/config/site.ts`
- [ ] Metrics for Hanami, AutoJob and Ápice (and Corebase if any) → `<Metric value="…">`
- [ ] HanamiBot screenshots / short video (real, anonymized conversation) → `<Figure>`
- [ ] Written permission from Hanami and Telas La Jalisciense to appear by name
- [ ] Technical details marked `<Todo>` in each case study, and `year` in each frontmatter

## Deploy (Vercel)

1. Import the repository in Vercel (framework: Next.js, default build command).
2. Environment variable: `NEXT_PUBLIC_SITE_URL` = the final domain, no trailing slash. Without it, canonical URLs fall back to the Vercel production URL.
3. Enable **Web Analytics** in the Vercel project (cookieless — no consent banner needed).
4. Add the domain under Project → Domains.

## Implementation notes

- **i18n:** `localePrefix: "as-needed"`. No Accept-Language redirect and no locale cookie: the URL decides the language, and the site sets no cookies. Locale-aware links are resolved on the server (`src/components/link.tsx`), so no i18n runtime ships to the browser.
- **SEO:** per-page metadata with `hreflang` alternates, generated Open Graph images (`next/og`) for the home and every case study, `sitemap.xml`, `robots.txt`, and a JSON-LD `Person` on the home page.
- **Theme:** dark by default; the light/dark choice is kept in `localStorage` and applied before first paint.
- **Accessibility:** skip link, visible focus rings, AA contrast in both themes (checked for every text/background token pair), `prefers-reduced-motion` respected.
- **Performance:** every page and OG image is statically generated. Fonts are Latin-subset Geist via `next/font`; Mermaid is loaded lazily only on case studies. Local Lighthouse (mobile) runs: Performance 95–99, Accessibility 100, SEO 100, Best Practices 96 (the one miss is the Vercel Analytics script, which only exists once deployed on Vercel).
