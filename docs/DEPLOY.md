# Deploy del portafolio

El sitio corre en el VPS de Hostinger (`srv1303035`, `76.13.106.210`) como un
contenedor de Next.js detrás del **Traefik** que ya sirve `apicehq.com` y
`stats.apicehq.com`. Dominio: **https://carlo.apicehq.com**.

```
visitante ──HTTPS──▶ Traefik (80/443, Let's Encrypt) ──▶ portfolio-web:3000 (Next.js standalone)
                      red traefik-public                    /var/www/portfolio en el VPS
```

- La imagen se construye **en el VPS** a partir del último commit (`git archive`).
- Todas las páginas se prerenderizan en el build: el dominio y la analítica se
  "hornean" en el HTML, por eso cambiar el `.env` exige reconstruir.
- El build **falla** si queda cualquier placeholder `[TODO…` / `<Todo>` en el
  contenido (`scripts/check-todos.mjs`), así que producción no puede mostrarlos.
- El contenedor corre como usuario sin privilegios, con sistema de archivos de
  solo lectura y un `HEALTHCHECK`.

## Lo que ya está hecho

- Registro DNS `A carlo.apicehq.com → 76.13.106.210` (zona de `apicehq.com` en Hostinger).
- `docker-compose.yml` con las mismas labels de Traefik que `apicehq.com`
  (red `traefik-public`, entrypoint `websecure`, certresolver `letsencrypt`).

## Primer deploy

Necesitas la misma llave SSH con la que despliegas `apicehq.com`.

```bash
ssh root@76.13.106.210 'mkdir -p /var/www/portfolio'
scp .env.example root@76.13.106.210:/var/www/portfolio/.env
./deploy.sh
```

El `.env.example` ya trae `DOMAIN=carlo.apicehq.com`. El primer build tarda unos
minutos; Traefik pide el certificado en cuanto el contenedor queda sano (~1 min).

## Deploys siguientes

```bash
git commit -am "…"   # deploy.sh publica el último commit, no cambios sueltos
./deploy.sh
```

Qué hace, en orden — si cualquier paso falla, se detiene:

1. En local: lint, tipos, placeholders y un build de prueba.
2. Revisa que en el VPS existan `.env` (con `DOMAIN`) y la red `traefik-public`.
3. Sube el último commit con `rsync --delete` (conserva el `.env`).
4. Etiqueta la imagen actual como `portfolio-web:previous` y construye la nueva.
   Mientras tanto, el sitio actual sigue en línea.
5. Levanta el contenedor nuevo y espera su `HEALTHCHECK`. Si no queda sano,
   **restaura la versión anterior solo**.
6. Comprueba `https://carlo.apicehq.com/` y `/es`.

Otros modos:

```bash
./deploy.sh --check      # solo las verificaciones locales; no toca el VPS
./deploy.sh --rollback   # vuelve a la imagen anterior
```

## Verificar a mano

```bash
curl -sI https://carlo.apicehq.com/ | grep -iE '^(HTTP|strict-transport|content-security|x-frame)'
ssh root@76.13.106.210 'cd /var/www/portfolio && docker compose ps && docker compose logs --tail 50 web'
```

Espera `HTTP/2 200`, `strict-transport-security`, `content-security-policy` y
`x-frame-options: DENY`.

## Analítica (Umami, opcional)

Ya tienes Umami en `stats.apicehq.com`, sin cookies (no requiere banner):

1. En el panel de Umami: *Settings → Websites → Add website* → `carlo.apicehq.com`.
2. Copia el *Website ID* a `UMAMI_WEBSITE_ID` en `/var/www/portfolio/.env`.
3. `./deploy.sh` (hay que reconstruir). La CSP permite el origen del script sola.

## Agregar Calendly después

En `src/config/site.ts`, pon la URL en `links.booking`, commit y `./deploy.sh`.
Todos los botones pasan solos de "Email me" a "Book a call".

## Dominio raíz y www

Si algún día el portafolio se muda a un dominio propio (p. ej. `carlodavila.dev`):

1. Registro `A` del dominio (y de `www`, si lo quieres) → `76.13.106.210`.
2. `DOMAIN=` nuevo en el `.env` del VPS.
3. Para redirigir `www` → raíz, agrega estas labels al servicio `web` en
   `docker-compose.yml` (en un router aparte, para que si `www` falla no afecte
   al certificado del dominio principal):

   ```yaml
   - "traefik.http.routers.portfolio-www.rule=Host(`www.${DOMAIN}`)"
   - "traefik.http.routers.portfolio-www.entrypoints=websecure"
   - "traefik.http.routers.portfolio-www.tls.certresolver=letsencrypt"
   - "traefik.http.routers.portfolio-www.middlewares=portfolio-www-redirect"
   - "traefik.http.middlewares.portfolio-www-redirect.redirectregex.regex=^https://www\\.(.+)"
   - "traefik.http.middlewares.portfolio-www-redirect.redirectregex.replacement=https://$${1}"
   - "traefik.http.middlewares.portfolio-www-redirect.redirectregex.permanent=true"
   ```

4. `./deploy.sh`.

## VPS sin Traefik

`deploy/compose.caddy.yml` agrega Caddy (HTTPS automático en 80/443):

```bash
docker network create traefik-public
docker compose -f docker-compose.yml -f deploy/compose.caddy.yml up -d --build
```

## Problemas comunes

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| `curl` da error de certificado | Traefik aún no obtiene el certificado, o el DNS no apunta al VPS | `dig +short carlo.apicehq.com` debe dar `76.13.106.210`; revisa `docker logs <traefik>` buscando `acme` |
| `404 page not found` (texto plano) | Traefik no ve el contenedor | `docker compose ps` (¿healthy?) y `docker network inspect traefik-public` (¿está `portfolio-web-1`?) |
| El build se detiene en `check-todos` | Quedó un `[TODO…` o `<Todo>` en el contenido | `npm run todos` en local lo lista |
| El build muere sin mensaje (`Killed`) | Falta de RAM en el VPS durante `next build` | Agrega swap (`fallocate -l 2G /swapfile …`) y reintenta |
| Bucle de redirecciones 307 fuera de Docker | Next enlazado a `127.0.0.1` reescribe hacia `localhost` | Corre con `HOSTNAME=0.0.0.0` (la imagen ya lo hace) |

## CI

`.github/workflows/ci.yml` corre en cada push: lint, tipos, placeholders,
build, y además **construye la imagen Docker, la arranca en solo lectura y
prueba las rutas**. No tiene acceso al VPS. Si CI está en rojo, no despliegues.
