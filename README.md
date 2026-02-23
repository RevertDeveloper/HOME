# Home Tanian

Landing page experiencial para `home.tanian.net` con catálogo de aplicaciones, estado en tiempo real e integración OIDC con Keycloak.

## Stack

- Frontend: Bun + React + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand + React Router
- Backend: FastAPI + Pydantic (serverless-ready en `/api`)
- Deploy: Vercel (`vercel.json` con rewrites a `/api/index.py`)

## Variables de Entorno

Usa `.env.example` como base:

- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`
- `VITE_API_BASE_URL`
- `BACKEND_ALLOWED_ORIGINS`

## Desarrollo local

Frontend (puerto `5200`):

```bash
bun install
bun run dev
```

Panel interactivo recomendado:

```bash
chmod +x run.sh
./run.sh
```

Incluye opciones para:
- levantar/parar/reconstruir Docker en producción
- levantar/parar Vite dev en puerto `5202`
- ver logs y estado de ambos entornos

Backend (puerto `5201`):

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn index:app --reload --port 5201
```

## Build

```bash
bun run build
```

## Endpoints API

- `GET /api/health`
- `GET /api/apps`
