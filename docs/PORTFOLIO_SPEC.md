# Portafolio personal de Carlo — SPEC para Claude Code

> Documento fuente para construir el portafolio. Claude Code: lee todo antes de escribir código. Todo lo marcado `[TODO: Carlo]` es contenido que Carlo debe proveer; **no inventes métricas, clientes, testimonios ni resultados**. Si falta un dato, deja el placeholder visible en desarrollo y un comentario en el código.

---

## 1. Objetivo

- **Meta principal:** conseguir clientes freelance remotos (internacionales primero), con proyectos de agentes de IA, automatización y full-stack.
- **Meta secundaria:** servir como portafolio para aplicaciones de empleo (AI Engineer / Full-stack AI).
- **Conversión principal:** agendar una llamada (Calendly o Cal.com).
- **Conversión secundaria:** email / LinkedIn / GitHub.

El sitio vende a **Carlo como ingeniero**, no a Ápice como agencia. Ápice aparece como contexto de experiencia (co-founder, proyectos reales con clientes reales), no como la marca principal.

## 2. Audiencia

1. **Founders / dueños de negocio / agencias en EE.UU., LatAm y Europa** que necesitan un agente o automatización en producción. Leen rápido, quieren ver: ¿ya lo hizo antes?, ¿funciona en producción?, ¿cuánto tarda?
2. **Hiring managers técnicos** que quieren ver criterio de arquitectura, trade-offs y cómo depura problemas reales.

Ambos se sirven con el mismo formato: casos de estudio con **arquitectura + decisiones + problema difícil + resultado**.

## 3. Idiomas

- **Inglés** es el idioma por defecto (`/`).
- **Español** en `/es`.
- Selector de idioma visible en el header.
- Todo el copy vive en archivos de contenido (MDX o JSON por locale), nunca hardcodeado en componentes.

## 4. Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (sitio ligero; no usar Material UI aquí)
- **MDX** para los casos de estudio (`/content/{locale}/work/*.mdx`)
- **next-intl** para i18n
- **Mermaid** (render en build o cliente) para diagramas de arquitectura dentro de los MDX
- **Deploy:** ~~Vercel~~ → VPS propio (Docker + Traefik) en `carlogarza.dev` (antes `carlo.apicehq.com`) — ver `docs/DEPLOY.md`
- **Analytics:** Umami propio o Plausible (sin cookies → sin banner)
- Sin CMS por ahora. Carlo edita los MDX directo.

## 5. Mapa del sitio

```
/                    Home
/work/hanami         Caso de estudio: Hanami Hair Studio (HanamiBot + hanamihairstudio.com)
/work/corebase       Caso de estudio: Corebase
/work/autojob        Caso de estudio: AutoJob
/work/apice          Caso de estudio: apicehq.com
/about               Sobre mí (opcional en v1; puede vivir como sección del Home)
/es/...              Espejo en español
```

## 6. Home — secciones

1. **Hero**
   - Nombre + posicionamiento en una línea. Borrador:
     - EN: "I build AI agents and automation systems that run in production for real businesses."
     - ES: "Construyo agentes de IA y sistemas de automatización que corren en producción para negocios reales."
   - Sub-línea: "AI engineer · Co-founder of Ápice HQ · Based in Mexico, working remote (GMT-6)".
   - CTA primario: **Book a call**. CTA secundario: **See my work** (scroll a casos).
2. **Selected work** — 4 tarjetas en este orden: **Hanami, AutoJob, Corebase, Ápice HQ**. Los proyectos de IA van primero para que el lector clasifique a Carlo como AI engineer antes de ver el trabajo web. Cada tarjeta lleva título, una línea de impacto, 3–4 tags de stack e imagen/diagrama. Hanami va como tarjeta destacada (más grande).
3. **More projects** — tarjetas pequeñas (ver §8).
4. **What I build** — 3 bloques de servicio, en lenguaje de cliente, no de ingeniero:
   - Conversational agents (WhatsApp / Instagram / web) connected to your real systems
   - Workflow automation & integrations (n8n, APIs, Supabase)
   - Full-stack web apps & SaaS (Next.js, Supabase, multi-tenant)
5. **How I work** — 3–4 pasos cortos (discovery → prototipo → producción con QA/monitoring → mantenimiento). Diferenciador a subrayar: **construyo QA y monitoreo desde el día uno** (ver caso Hanami).
6. **About (corto)** — foto, 3–4 líneas: estudiante de Ingeniería en IA (UPIIZ-IPN), co-founder de Ápice HQ, lo que le interesa. `[TODO: Carlo — foto y bio final]`
7. **CTA final + contacto** — Book a call, email, LinkedIn, GitHub.

## 7. Casos de estudio (plantilla fija)

Cada MDX sigue esta estructura, en este orden:

1. **TL;DR** (3 bullets: qué es, para quién, resultado)
2. **Context** — el cliente/problema
3. **The problem** — qué dolía y por qué no bastaba una solución genérica
4. **Architecture** — diagrama Mermaid + explicación breve de cada pieza
5. **Key decisions & trade-offs** — 3–5 decisiones con el "por qué" (esto es lo que buscan los hiring managers)
6. **The hard part** — un problema difícil real y cómo se resolvió
7. **Results** — métricas. `[TODO: Carlo]` si no hay números aún; nunca inventar
8. **Stack** — lista de tecnologías
9. **CTA** — "Need something like this? Book a call"

Metadatos en frontmatter: `title`, `summary`, `tags`, `cover`, `order`, `status` (`production` | `in-development`), `client` (o `internal`), `year`.

### 7.1 Hanami Hair Studio — caso estrella

**Enfoque:** no dos proyectos separados, sino **un sistema digital completo para un salón**: sitio web (hanamihairstudio.com) + agente de reservas (HanamiBot). Es más fuerte como historia única.

- **Context:** salón de belleza, cliente real de Ápice.
- **Problem:** `[TODO: Carlo — volumen de mensajes, tiempo de respuesta antes, citas perdidas, carga de la recepción]`
- **Architecture (HanamiBot):** sistema multi-agente en n8n para WhatsApp e Instagram; RAG con Supabase/pgvector y embeddings de Gemini; integración con agenda. Diagrama: canales → router/orquestador → agentes especializados → RAG / agenda → respuesta.
- **El sitio (hanamihairstudio.com):**
  - One-page site en HTML semántico, CSS utility-first y JavaScript vanilla, sin framework. Decisión deliberada: cero JS innecesario para cargar rápido en móvil, que es donde llegan los clientes desde Instagram.
  - **Información de reserva al frente:** precios, duración de sesiones, requisitos para coloración y política de depósito visibles antes de contactar. Objetivo: que el cliente llegue al DM o al bot ya pre-calificado, sin preguntas repetidas.
  - **Galería antes/después:** carrusel ligero con imágenes en WebP/AVIF. Prueba social sin sacrificar velocidad.
  - **SEO local:** optimización on-page para el Centro Histórico de Zacatecas; datos estructurados Schema.org (`HairSalon` / `LocalBusiness`) con geolocalización y horarios.
  - Tono visual editorial, alineado con la filosofía del salón (estilismo natural e inclusivo).
- **Cómo se conectan sitio y bot:** el sitio resuelve las dudas estáticas (precios, políticas) y el bot resuelve lo dinámico (disponibilidad, agendar). Contarlo así en el caso: un sistema, no dos piezas. `[TODO: Carlo — confirmar si el sitio enlaza/abre el bot directamente y cómo]`
- **The hard part:** el bug de **horarios de cita inventados** (el agente alucinaba slots disponibles). Cómo se detectó, la causa raíz, y cómo se resolvió forzando que la disponibilidad venga siempre de una tool contra la agenda real. `[TODO: Carlo — detalles exactos de la corrección]`
- **QA system:** Error Watchdog, Logger y QA Digest como workflows separados. Resaltarlo: es la prueba de que Carlo pone agentes **en producción**, no demos.
- **Results:** `[TODO: Carlo — citas agendadas por el bot/mes, % de conversaciones resueltas sin humano, tiempo de respuesta, uptime]`
  - Sitio: `[TODO: Carlo — PageSpeed Insights móvil (Performance y LCP reales), posición en Google/Maps para búsquedas locales, estimado del salón de cuántas preguntas repetidas dejaron de llegar]`
  - Copy: usar el número exacto, no adjetivos. "LCP 0.8s en móvil" en lugar de "carga casi instantánea"; si un dato es estimado por el cliente, decirlo ("según el estudio, ~X% menos...").
- **Rol:** diseño UI/UX, desarrollo frontend, SEO local, arquitectura e implementación del bot.
- **Permiso del cliente:** `[TODO: Carlo — confirmar que Hanami acepta aparecer con nombre y capturas]`

### 7.2 Corebase

**Enfoque:** caso de **arquitectura** de una plataforma SaaS multi-tenant en desarrollo. `status: in-development`. Mostrarlo como criterio de ingeniería, no como producto terminado.

- **Context:** plataforma modular multi-tenant (TypeScript, Next.js, Supabase), pensada como la capa para convertir agentes verticales (empezando por salones, con Hanami como prueba) en un SaaS escalable.
- **Key decisions:**
  - Consolidación: Corebase como tronco, un proyecto anterior (Synaptic) congelado como donador de código.
  - Arquitectura "page-first" estilo Notion.
  - Aislamiento multi-tenant `[TODO: Carlo — RLS de Supabase, esquema de workspaces]`
  - Móvil (React Native/Expo en monorepo) diferido hasta tener ingresos: decisión de negocio explícita.
- **The hard part:** remediación de permisos: 42 llamadas dispersas a `isOwner` / `isWorkspaceOwner` centralizadas en una sola capa de autorización. Explicar el riesgo que tenía y el diseño final.
- **Nombre:** "Corebase" es nombre de trabajo. `[TODO: Carlo — decidir si se publica con este nombre]`
- **Screenshots:** `[TODO: Carlo]`

### 7.3 AutoJob

**Enfoque:** herramienta interna que detecta oportunidades freelance remotas temprano, las califica con IA y redacta borradores de propuesta. Buen gancho: *"This is the system I use to find work."*

- **Architecture:**
  - n8n **solo** como capa de ingesta: trae fuentes y escribe payloads crudos en Supabase. Nunca toca lógica de negocio.
  - Toda la lógica vive en **funciones SQL de Postgres**, para poder migrar después a un core en TypeScript + Inngest sin reescribir reglas.
  - Deduplicación con `canonical_hash` como **columna generada en Postgres**, lo que elimina una clase entera de bugs de cálculo en n8n.
  - Scoring con Claude Haiku, borradores con Claude Sonnet; Batch API y prompt caching para bajar costos.
  - Notificaciones por Telegram con control de rate limit.
- **Key decisions:** Temporal Cloud descartado por costo; frontera estricta entre n8n y la lógica; todo dentro de free tiers al volumen actual.
- **The hard part:** manejo de NULLs, por ejemplo en el hash canónico (`coalesce` explícito por campo en vez de `concat_ws`, para evitar colisiones posicionales) y en `posted_at`, que es crítico para la detección temprana.
- **Results:** `[TODO: Carlo — oportunidades procesadas/semana, % filtradas, costo mensual real de LLM, tiempo desde publicación hasta alerta]`

### 7.4 Ápice HQ — apicehq.com

**Enfoque:** caso de **diseño y estrategia web B2B**, más corto que los tres anteriores. Demuestra criterio de producto y diseño, no solo código.

- **Context:** Ápice combina dos negocios distintos bajo una marca: producción audiovisual (Ápice Studio) e infraestructura digital, automatización e IA (Ápice Infra). Carlo es co-founder y lidera Infra.
- **The problem:** comunicar dos líneas de negocio sin confundir al prospecto. Quien busca un video no debe perderse entre servicios de automatización, y viceversa.
- **Solution:**
  - Estructura modular: una landing por división, cada una con su propio embudo, unidas por una narrativa de marca común.
  - Dirección visual: tipografía editorial, alto contraste, transiciones sobrias. Sistema de diseño propio.
  - Accesibilidad: skip-to-content, jerarquía de contraste AA, HTML semántico.
  - Performance: carga diferida de video e imágenes pesadas (el sitio tiene mucho material audiovisual).
- **Key decision:** separar embudos por división para que cada lead llegue ya clasificado (producción vs. software), lo que simplifica la venta.
- **Stack:** Next.js, Material UI, design system propio. `[TODO: Carlo — confirmar stack actual y hosting/CDN]`
- **Results:** `[TODO: Carlo — PageSpeed móvil, % de leads por división, cualquier dato de conversión del formulario/contacto]`
- **Rol:** arquitectura web, diseño UI/UX, estrategia de conversión.
- **Tono del copy:** evitar frases de marketing vacías ("élite", "premium", "menos ruido, más criterio"). Describir qué se hizo y por qué.

## 8. More projects (tarjetas pequeñas)

- **Telas La Jalisciense**: catálogo digital de telas (Next.js/Supabase, esquema tela → variante → fotos, pipeline de imágenes). `[TODO: Carlo — link o capturas, permiso del cliente]`
- **Lead prospecting pipeline**: scraping de Google Maps con Apify + n8n para prospección B2B local.

Cada tarjeta: título, 1 línea, tags, link externo si existe.

## 9. Dirección visual

- Tono: técnico, sobrio, confiable. **Dark mode por defecto** con modo claro disponible.
- Tipografía: una sans limpia para texto y una **mono** para acentos (tags, labels, datos técnicos).
- Los **diagramas de arquitectura son el visual protagonista**, más que mockups genéricos.
- Nada de ilustraciones 3D de stock, gradientes arcoíris ni "AI sparkles".
- Accesibilidad: contraste AA, navegación por teclado, `prefers-reduced-motion` respetado.
- Mobile-first: la mayoría de clientes lo abrirá desde un link en el celular.

## 10. SEO y rendimiento

- Metadata por página y por locale; `hreflang` entre `/` y `/es`.
- Open Graph image generada por página (`next/og`), con título del caso.
- `sitemap.xml` y `robots.txt`.
- JSON-LD `Person` en el Home.
- Objetivo Lighthouse ≥ 95 en Performance, Accessibility y SEO.
- Imágenes con `next/image`, fuentes con `next/font`.

## 11. Fases para Claude Code

1. **Scaffold:** Next.js + TS + Tailwind + next-intl + MDX; layout, header con selector de idioma, footer, tokens de diseño (colores, tipografía, espaciado) en un solo lugar.
2. **Home** con todas las secciones y contenido placeholder desde archivos de contenido.
3. **Sistema de casos de estudio:** plantilla MDX, componentes (TL;DR, DecisionCard, Mermaid, Metrics, CTA), ruta dinámica `/work/[slug]`.
4. **Contenido EN** de los 3 casos con los borradores de este spec.
5. **Traducción ES.**
6. **SEO, OG images, analytics.**
7. **QA:** Lighthouse, revisión móvil, links rotos, que no haya `[TODO]` visibles en producción (build falla si los hay en `NODE_ENV=production`).
8. **Deploy al VPS** + dominio (`./deploy.sh`, ver `docs/DEPLOY.md`).

## 12. Lo que Carlo tiene que juntar antes de lanzar

- [ ] Dominio (sugerencia: `carlo[apellido].dev` o similar) `[TODO]`
- [ ] Foto profesional
- [ ] Bio final EN/ES
- [ ] Link de Calendly/Cal.com, email, LinkedIn, GitHub
- [ ] **Métricas** de Hanami, AutoJob y (si aplica) Corebase. Esto es lo que más vende
- [ ] Capturas/video corto de HanamiBot en acción (conversación real anonimizada)
- [ ] Permiso por escrito de Hanami y Telas La Jalisciense para aparecer con nombre
- [ ] Detalles técnicos marcados como `[TODO]` en §7

## 13. Después del lanzamiento (fuera de v1)

- Agregar el agente **Figma → WordPress en LangGraph** como 4º caso de estudio cuando exista. Cubre Python/LangGraph, que piden los roles de AI Engineer.
- Testimonios de clientes.
- Blog corto con write-ups técnicos (por ejemplo, el bug de slots alucinados como post independiente).
