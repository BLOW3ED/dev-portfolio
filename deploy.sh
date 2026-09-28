#!/usr/bin/env bash
#
# Deploy del portafolio al VPS de Hostinger.
#
#   ./deploy.sh              verifica, sube el último commit y levanta el contenedor
#   ./deploy.sh --check      sólo verifica en local (lint, tipos, placeholders, build)
#   ./deploy.sh --rollback   vuelve a la imagen anterior en el VPS
#
# Requiere tu llave SSH autorizada en el servidor y, la primera vez, el .env
# en el VPS (el script te dice cómo si falta). Guía completa: docs/DEPLOY.md.
#
# Sube el último COMMIT (git archive), no tu working tree: lo que se publica es
# exactamente lo que está en git. La imagen se construye en el VPS; mientras
# tanto el contenedor viejo sigue sirviendo, y si el nuevo no queda sano se
# restaura el anterior.

set -euo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-76.13.106.210}"     # VPS 1303035 (srv1303035.hstgr.cloud)
REMOTE_DIR="${REMOTE_DIR:-/var/www/portfolio}"
IMAGE="portfolio-web"

cd "$(dirname "$0")"

MODE="deploy"
case "${1:-}" in
  "") ;;
  --check) MODE="check" ;;
  --rollback) MODE="rollback" ;;
  *) echo "Uso: ./deploy.sh [--check | --rollback]" >&2; exit 2 ;;
esac

remote() { ssh -o StrictHostKeyChecking=accept-new "$VPS_USER@$VPS_HOST" "$@"; }

# Espera a que el contenedor web reporte healthy (HEALTHCHECK del Dockerfile).
wait_healthy() {
  remote "cd '$REMOTE_DIR' && for i in \$(seq 1 30); do
    s=\$(docker inspect -f '{{.State.Health.Status}}' \$(docker compose ps -q web) 2>/dev/null || echo missing)
    [ \"\$s\" = healthy ] && exit 0
    sleep 2
  done; exit 1"
}

rollback() {
  if ! remote "docker image inspect $IMAGE:previous >/dev/null 2>&1"; then
    echo "✗ No hay imagen anterior a la cual volver (¿primer deploy?)." >&2
    echo "  Revisa: ssh $VPS_USER@$VPS_HOST 'cd $REMOTE_DIR && docker compose logs --tail 100 web'" >&2
    exit 1
  fi
  echo "→ Restaurando la imagen anterior..."
  remote "cd '$REMOTE_DIR' \
    && docker tag $IMAGE:previous $IMAGE:latest \
    && docker compose up -d --no-build --force-recreate web"
  if wait_healthy; then
    echo "✓ Rollback listo: el VPS sirve la versión anterior."
  else
    echo "✗ La versión anterior tampoco quedó sana. Revisa: ssh $VPS_USER@$VPS_HOST 'cd $REMOTE_DIR && docker compose logs --tail 100 web'" >&2
    exit 1
  fi
}

if [ "$MODE" = "rollback" ]; then
  rollback
  exit 0
fi

# ---------------------------------------------------------------------------
# Verificación local. Corre ANTES de tocar el servidor: si algo falla, el VPS
# queda intacto.
# ---------------------------------------------------------------------------

if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Hay cambios sin commitear. El deploy publica el último commit," >&2
  echo "  así que esos cambios no saldrían. Commitea o descártalos primero." >&2
  [ "$MODE" = "check" ] || exit 1
fi

echo "→ Lint, tipos y placeholders..."
npm run lint
npm run typecheck
node scripts/check-todos.mjs

echo "→ Build de prueba..."
NEXT_PUBLIC_SITE_URL="https://example.com" npm run build >/dev/null
echo "✓ Verificación local OK"

if [ "$MODE" = "check" ]; then
  echo "→ --check: no se tocó el VPS."
  exit 0
fi

# ---------------------------------------------------------------------------
# Servidor.
# ---------------------------------------------------------------------------

echo "→ Revisando el VPS..."
if ! remote "test -f '$REMOTE_DIR/.env'"; then
  cat >&2 <<EOF
✗ Falta $REMOTE_DIR/.env en el VPS. La primera vez:

  ssh $VPS_USER@$VPS_HOST 'mkdir -p $REMOTE_DIR'
  scp .env.example $VPS_USER@$VPS_HOST:$REMOTE_DIR/.env
  ssh $VPS_USER@$VPS_HOST 'nano $REMOTE_DIR/.env'   # revisa DOMAIN y, si quieres, UMAMI_WEBSITE_ID

y vuelve a correr ./deploy.sh
EOF
  exit 1
fi

DOMAIN="$(remote "grep -E '^DOMAIN=' '$REMOTE_DIR/.env' | tail -1 | cut -d= -f2- | tr -d '\"[:space:]'")"
if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "example.com" ]; then
  echo "✗ DOMAIN no está configurado en $REMOTE_DIR/.env" >&2
  exit 1
fi
remote "docker network inspect traefik-public >/dev/null" || {
  echo "✗ No existe la red traefik-public en el VPS (¿Traefik corriendo?)." >&2
  exit 1
}

COMMIT="$(git rev-parse --short HEAD)"
echo "→ Subiendo $COMMIT a $VPS_USER@$VPS_HOST:$REMOTE_DIR ..."
EXPORT_DIR="$(mktemp -d)"
trap 'rm -rf "$EXPORT_DIR"' EXIT
git archive HEAD | tar -x -C "$EXPORT_DIR"
rsync -az --delete --exclude ".env" \
  -e "ssh -o StrictHostKeyChecking=accept-new" \
  "$EXPORT_DIR/" "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

echo "→ Construyendo la imagen en el VPS (el sitio actual sigue en línea)..."
remote "cd '$REMOTE_DIR' \
  && if docker image inspect $IMAGE:latest >/dev/null 2>&1; then docker tag $IMAGE:latest $IMAGE:previous; fi \
  && docker compose build web \
  && docker compose up -d web"

echo "→ Esperando a que el contenedor quede sano..."
if ! wait_healthy; then
  echo "✗ El contenedor nuevo no quedó sano." >&2
  remote "cd '$REMOTE_DIR' && docker compose logs --tail 50 web" >&2 || true
  rollback
  exit 1
fi

remote "docker image prune -f >/dev/null" || true

echo "→ Comprobando https://$DOMAIN ..."
if curl -fsS -o /dev/null --max-time 20 "https://$DOMAIN/" \
  && curl -fsS -o /dev/null --max-time 20 "https://$DOMAIN/es"; then
  echo "✓ $COMMIT desplegado en https://$DOMAIN"
else
  echo "⚠ El contenedor está sano, pero https://$DOMAIN no respondió todavía." >&2
  echo "  En el primer deploy suele ser el DNS o el certificado (tarda ~1 min)." >&2
  echo "  Revisa: dig +short $DOMAIN  (debe dar $VPS_HOST)" >&2
fi
