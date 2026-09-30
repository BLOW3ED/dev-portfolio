# Carlo — portfolio

Personal portfolio built from [`docs/PORTFOLIO_SPEC.md`](docs/PORTFOLIO_SPEC.md). Live at **https://carlo.apicehq.com** — English at `/`, Spanish at `/es`.

**Stack:** Next.js 16 (App Router, standalone output) · TypeScript · Tailwind CSS 4 · MDX (`next-mdx-remote`) · next-intl · Mermaid · Docker + Traefik on a VPS · optional cookieless analytics (Umami or Plausible).

```bash
npm install
npm run dev          # http://localhost:3000
npm run todos        # list every placeholder still to fill in
npm run lint && npm run typecheck
npm run build        # blocked while placeholders remain — see below
./deploy.sh          # publish the last commit to the VPS — see docs/DEPLOY.md
```

## Where things live

| What | Where |
| --- | --- |
| Home and UI copy (EN / ES) | `messages/en.json`, `messages/es.json` |
| Case studies | `content/{en,es}/work/{slug}.mdx` — same slug in both languages |
| Name, booking link, email, LinkedIn, GitHub, photo | `src/config/site.ts` |
| Photo and other images | `public/images/` |
| Analytics settings | `.env` on the server → `src/config/analytics.ts` |
| Deploy (Docker, Traefik, script) | `Dockerfile`, `docker-compose.yml`, `deploy.sh`, [`docs/DEPLOY.md`](docs/DEPLOY.md) |
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
year: "2025–2026"
role: "UI/UX design, frontend…"        # optional
flow: ["Instagram DM", "Intent router", "Specialist agents", "Calendar · RAG"]  # card diagram when there's no cover
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

**Results rule:** exact numbers, not adjectives ("LCP 0.8 s on mobile", not "almost instant"). Say where each number comes from and when it was measured in `note`; if it's the client's estimate, say so. Never invent one: leave the placeholder.

**Accuracy rule:** every technical claim in a case study must match the project's real code, workflows or measurements — not a plan or an earlier draft. If something is planned, say "next version"; if it's in staging, say so. Hiring managers ask about these details.

## Placeholders (`[TODO]`)

Content that is **required but still pending** is marked as `"[TODO: Carlo — …]"` (JSON, frontmatter, `src/config/site.ts`) or `<Todo>…</Todo>` (MDX). It renders as a visible dashed yellow label so it's easy to spot while developing.

Content that is **optional and simply not there** is an empty string (`""`) and is left out of the page — e.g. no booking link means the "Book a call" buttons become "Email me"; no photo means the bio takes the full width.

`npm run build` runs `scripts/check-todos.mjs` first and **fails while any placeholder remains** in `content/`, `messages/` or `src/config/`, so a production image can't show them. To build a local preview anyway: `ALLOW_TODOS=1 npm run build`. The Docker image never sets it.

## Worth adding after launch

None of these block a deploy; each one makes the site sell better.

- [ ] Umami Website ID → `UMAMI_WEBSITE_ID` in the server's `.env` ([docs/DEPLOY.md](docs/DEPLOY.md#analítica-umami-opcional))
- [ ] HanamiBot telemetry — conversations resolved without a human and response time. The bot's telemetry tables collect them (its Postgres was unreachable on 2026-09-30); add `<Metric>`s with the date range in `note`. Bookings after 2026-08-21 live in Corebase, not Airtable
- [ ] HanamiBot screenshots or a short video (a real, anonymized conversation) → `<Figure>`
- [ ] AutoJob: time from posting to alert, and real monthly LLM cost once the AI layer ships
- [ ] Ápice: leads per division and contact-form conversion (Umami)
- [ ] Screenshots of Corebase → `cover` / `<Figure>`

## Deploy (VPS)

The site runs as a Docker container behind the VPS's existing Traefik, at `carlo.apicehq.com`. First time:

```bash
ssh root@76.13.106.210 'mkdir -p /var/www/portfolio'
scp .env.example root@76.13.106.210:/var/www/portfolio/.env
./deploy.sh
```

After that, `./deploy.sh` publishes the last commit (checks → upload → build on the server → health check → automatic rollback if unhealthy). Full guide, rollback, analytics, custom domains and troubleshooting: [docs/DEPLOY.md](docs/DEPLOY.md). CI (`.github/workflows/ci.yml`) builds and smoke-tests the Docker image on every push.

## Implementation notes

- **i18n:** `localePrefix: "as-needed"`. No Accept-Language redirect and no locale cookie: the URL decides the language, and the site sets no cookies. Locale-aware links are resolved on the server (`src/components/link.tsx`), so no i18n runtime ships to the browser.
- **SEO:** per-page metadata with `hreflang` alternates, generated Open Graph images (`next/og`) for the home and every case study, `sitemap.xml`, `robots.txt`, and a JSON-LD `Person` on the home page.
- **Theme:** dark by default; the light/dark choice is kept in `localStorage` and applied before first paint.
- **Accessibility:** skip link, visible focus rings, AA contrast in both themes (checked for every text/background token pair), `prefers-reduced-motion` respected.
- **Performance:** every page and OG image is statically generated. Fonts are Latin-subset Geist via `next/font`; Mermaid is loaded lazily only on case studies. Local Lighthouse 13 (mobile) on the production build: Performance 98–99, Accessibility 100, Best Practices 100.
- **Security:** Content-Security-Policy (script origins limited to this site plus the configured analytics host), `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy and HSTS (set by Traefik). The container runs as a non-root user on a read-only filesystem.
