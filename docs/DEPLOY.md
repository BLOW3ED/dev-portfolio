# Deploy del portafolio

El sitio corre en el VPS de Hostinger (`srv1303035`, `76.13.106.210`) como un
contenedor de Next.js detrás del **Traefik** que ya sirve `apicehq.com` y
`stats.apicehq.com`. Dominio: **https://carlogarza.dev** (`www.carlogarza.dev` y el
dominio anterior, `carlo.apicehq.com`, redirigen ahí con 301).

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

- DNS en Hostinger: `A carlogarza.dev → 76.13.106.210` y `CNAME www.carlogarza.dev → carlogarza.dev`
  (zona de `carlogarza.dev`). Se conserva `A carlo.apicehq.com → 76.13.106.210`
  (zona de `apicehq.com`) para que el redirect del dominio anterior siga vivo.
- `docker-compose.yml` con las mismas labels de Traefik que `apicehq.com`
  (red `traefik-public`, entrypoint `websecure`, certresolver `letsencrypt`).

## Primer deploy

Necesitas la misma llave SSH con la que despliegas `apicehq.com`.

```bash
ssh root@76.13.106.210 'mkdir -p /var/www/portfolio'
scp .env.example root@76.13.106.210:/var/www/portfolio/.env
./deploy.sh
```

El `.env.example` ya trae `DOMAIN=carlogarza.dev`. El primer build tarda unos
minutos; Traefik pide el certificado en cuanto el contenedor queda sano (~1 min).

## Deploys siguientes

```bash
git commit -am "…"   # deploy.sh publica el último commit, no cambios sueltos
./deploy.sh
```

Qué hace, en orden — si cualquier paso falla, se detiene:

1. En local: lint, tipos, placeholders y un build de prueba.
2. Revisa la conexión SSH y que en el VPS existan `.env` (con `DOMAIN`) y la red `traefik-public`.
3. Sube el último commit con `rsync --delete` (conserva el `.env`).
4. Etiqueta la imagen actual como `portfolio-web:previous` y construye la nueva.
   Mientras tanto, el sitio actual sigue en línea.
5. Reemplaza el contenedor y espera su `HEALTHCHECK` (el sitio queda fuera
   unos segundos en el cambio). Si el nuevo no arranca o no queda sano,
   **restaura la versión anterior solo**.
6. Comprueba `https://carlogarza.dev/` y `/es`.

Otros modos:

```bash
./deploy.sh --check      # solo las verificaciones locales; no toca el VPS
./deploy.sh --rollback   # vuelve a la imagen anterior
```

## Verificar a mano

```bash
curl -sI https://carlogarza.dev/ | grep -iE '^(HTTP|strict-transport|content-security|x-frame)'
curl -sI https://carlo.apicehq.com/es | grep -iE '^(HTTP|location)'   # 301 → https://carlogarza.dev/es
ssh root@76.13.106.210 'cd /var/www/portfolio && docker compose ps && docker compose logs --tail 50 web'
```

Espera `HTTP/2 200`, `strict-transport-security`, `content-security-policy` y
`x-frame-options: DENY`. Para `www` y el dominio anterior, `301` con su `location`.

## Analítica (Umami, opcional)

Ya tienes Umami en `stats.apicehq.com`, sin cookies (no requiere banner):

1. En el panel de Umami: *Settings → Websites → Add website* → `carlogarza.dev`.
2. Copia el *Website ID* a `UMAMI_WEBSITE_ID` en `/var/www/portfolio/.env`.
3. `./deploy.sh` (hay que reconstruir). La CSP permite el origen del script sola.

## Agregar Calendly después

En `src/config/site.ts`, pon la URL en `links.booking`, commit y `./deploy.sh`.
Todos los botones pasan solos de "Email me" a "Book a call".

## www y el dominio anterior

`docker-compose.yml` define tres routers de Traefik sobre el mismo contenedor:

| Router | Host | Qué hace |
| --- | --- | --- |
| `portfolio` | `DOMAIN` (`carlogarza.dev`) | sirve el sitio, con HSTS |
| `portfolio-www` | `www.DOMAIN` | 301 a `https://DOMAIN` + la misma ruta |
| `portfolio-legacy` | `carlo.apicehq.com` | 301 a `https://DOMAIN` + la misma ruta |

Cada uno pide su propio certificado, así que si uno falla (p. ej. falta su DNS)
el dominio principal no se ve afectado.

Para retirar el dominio anterior, cuando ya no haya enlaces viejos circulando:
borra las cuatro labels `portfolio-legacy` del compose, haz deploy y luego
elimina el registro `carlo` de la zona de `apicehq.com`. En ese orden: si quitas
primero el DNS, Traefik reintentaría el certificado sin éxito.

## VPS sin Traefik

`deploy/compose.caddy.yml` agrega Caddy (HTTPS automático en 80/443):

```bash
docker network create traefik-public
docker compose -f docker-compose.yml -f deploy/compose.caddy.yml up -d --build
```

## Problemas comunes

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| `curl` da error de certificado | Traefik aún no obtiene el certificado, o el DNS no apunta al VPS | `dig +short carlogarza.dev` debe dar `76.13.106.210`; revisa `docker logs <traefik>` buscando `acme` |
| `404 page not found` (texto plano) | Traefik no ve el contenedor | `docker compose ps` (¿healthy?) y `docker network inspect traefik-public` (¿está `portfolio-web-1`?) |
| El build se detiene en `check-todos` | Quedó un `[TODO…` o `<Todo>` en el contenido | `npm run todos` en local lo lista |
| El build muere sin mensaje (`Killed`) | Falta de RAM en el VPS durante `next build` | Agrega swap (`fallocate -l 2G /swapfile …`) y reintenta |
| Bucle de redirecciones 307 fuera de Docker | Next enlazado a `127.0.0.1` reescribe hacia `localhost` | Corre con `HOSTNAME=0.0.0.0` (la imagen ya lo hace) |

## CI

`.github/workflows/ci.yml` corre en cada push: lint, tipos, placeholders,
build, y además **construye la imagen Docker, la arranca en solo lectura y
prueba las rutas**. No tiene acceso al VPS. Si CI está en rojo, no despliegues.
