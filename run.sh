#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"
DEV_PID_FILE="$RUN_DIR/dev-vite.pid"
DEV_LOG_FILE="$RUN_DIR/dev-vite.log"
DEV_PORT="5202"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

mkdir -p "$RUN_DIR"

print_header() {
  clear
  echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}${CYAN}  Home Tanian Control Center${NC}"
  echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo
}

info() {
  echo -e "${CYAN}ℹ${NC} $1"
}

ok() {
  echo -e "${GREEN}✔${NC} $1"
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

err() {
  echo -e "${RED}✖${NC} $1"
}

pause() {
  echo
  read -r -p "Pulsa Enter para continuar..." _
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Comando requerido no encontrado: $cmd"
    exit 1
  fi
}

dev_port_pid() {
  # Devuelve el PID del proceso escuchando en DEV_PORT, o vacío si no hay ninguno
  lsof -ti:"$DEV_PORT" 2>/dev/null | head -1
}

dev_pid_is_running() {
  local pid
  pid="$(dev_port_pid)"
  [[ -n "$pid" ]]
}

show_status() {
  print_header
  info "Estado de producción (Docker):"
  (cd "$ROOT_DIR" && docker compose ps) || true
  echo
  info "Estado de desarrollo (Vite):"
  if dev_pid_is_running; then
    ok "Vite dev activo en puerto $DEV_PORT (PID $(dev_port_pid))"
    info "Log: $DEV_LOG_FILE"
  else
    warn "Vite dev detenido"
  fi
  pause
}

prod_up() {
  print_header
  info "Levantando producción con build..."
  (cd "$ROOT_DIR" && docker compose up -d --build)
  ok "Producción levantada en puerto 5200"
  pause
}

prod_down() {
  print_header
  info "Deteniendo producción..."
  (cd "$ROOT_DIR" && docker compose down)
  ok "Producción detenida"
  pause
}

prod_rebuild() {
  print_header
  info "Reconstruyendo imágenes y relanzando servicios..."
  (cd "$ROOT_DIR" && docker compose build --no-cache && docker compose up -d)
  ok "Reconstrucción completada"
  pause
}

prod_logs() {
  print_header
  info "Mostrando logs de producción (Ctrl+C para salir)..."
  (cd "$ROOT_DIR" && docker compose logs -f --tail=120)
}

dev_up() {
  print_header
  require_command bun

  if dev_pid_is_running; then
    warn "Vite dev ya está activo en puerto $DEV_PORT (PID $(dev_port_pid))"
    pause
    return
  fi

  info "Levantando Vite dev en puerto $DEV_PORT..."
  (
    cd "$ROOT_DIR"
    nohup bun run dev -- --port "$DEV_PORT" --strictPort >"$DEV_LOG_FILE" 2>&1 &
  )

  # Esperar hasta 5 s a que el puerto esté en escucha
  local waited=0
  while [[ $waited -lt 5 ]]; do
    sleep 1
    waited=$((waited + 1))
    if dev_pid_is_running; then
      ok "Vite dev activo en http://localhost:$DEV_PORT (PID $(dev_port_pid))"
      info "Logs: tail -f $DEV_LOG_FILE"
      pause
      return
    fi
  done

  err "No se pudo iniciar Vite dev. Revisa $DEV_LOG_FILE"
  pause
}

dev_down() {
  print_header
  local pid
  pid="$(dev_port_pid)"

  if [[ -z "$pid" ]]; then
    warn "Vite dev no está activo (puerto $DEV_PORT libre)"
    pause
    return
  fi

  info "Deteniendo Vite dev (PID $pid, puerto $DEV_PORT)..."
  kill "$pid" >/dev/null 2>&1 || true

  local i=0
  while [[ $i -lt 10 ]]; do
    sleep 0.3
    i=$((i + 1))
    if ! kill -0 "$pid" >/dev/null 2>&1; then
      break
    fi
  done

  if kill -0 "$pid" >/dev/null 2>&1; then
    warn "Forzando cierre (kill -9 PID $pid)..."
    kill -9 "$pid" >/dev/null 2>&1 || true
  fi

  ok "Vite dev detenido"
  pause
}

dev_logs() {
  print_header
  if [[ ! -f "$DEV_LOG_FILE" ]]; then
    warn "Aún no hay logs de desarrollo"
    pause
    return
  fi

  info "Mostrando logs de Vite dev (Ctrl+C para salir)..."
  tail -f "$DEV_LOG_FILE"
}

stop_all() {
  dev_down || true
  print_header
  info "Deteniendo producción..."
  (cd "$ROOT_DIR" && docker compose down)
  ok "Todo detenido"
  pause
}

main_menu() {
  require_command docker

  while true; do
    print_header
    echo -e "${BOLD}Producción (Docker)${NC}"
    echo "  1) Levantar producción"
    echo "  2) Parar producción"
    echo "  3) Reconstruir producción"
    echo "  4) Ver logs producción"
    echo
    echo -e "${BOLD}Desarrollo (Vite)${NC}"
    echo "  5) Levantar dev (puerto $DEV_PORT)"
    echo "  6) Parar dev"
    echo "  7) Ver logs dev"
    echo
    echo -e "${BOLD}Utilidades${NC}"
    echo "  8) Ver estado"
    echo "  9) Parar todo"
    echo "  0) Salir"
    echo
    read -r -p "Selecciona una opción: " choice

    case "$choice" in
      1) prod_up ;;
      2) prod_down ;;
      3) prod_rebuild ;;
      4) prod_logs ;;
      5) dev_up ;;
      6) dev_down ;;
      7) dev_logs ;;
      8) show_status ;;
      9) stop_all ;;
      0)
        ok "Saliendo del panel."
        exit 0
        ;;
      *)
        warn "Opción inválida"
        pause
        ;;
    esac
  done
}

main_menu
