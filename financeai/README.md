# FinanceAI — El Experto Alentador

Plataforma inteligente de gestión financiera personal: análisis predictivo, metas de ahorro gamificadas y seguimiento de gastos.

**Stack:** React 19 + TypeScript + Vite 6 + TailwindCSS v4, servidos con un servidor Express (`server.ts`). El backend (API REST en Java Spring Boot) vive en un repositorio aparte; ver [docs/API_BACKEND_ENDPOINTS.md](docs/API_BACKEND_ENDPOINTS.md) para su documentación.

## Requisitos previos

- Node.js
- El **backend Spring Boot corriendo en `http://localhost:8080`**. Sin él, el login, el análisis financiero y el historial no funcionan: Vite hace proxy de `/api/v1` hacia ese puerto (ver [vite.config.ts](vite.config.ts)).

## Correr en local

1. Instalar dependencias:
   `npm install`
2. Copiar `.env.example` a `.env.local` si necesitas sobreescribir alguna variable (actualmente no hay variables obligatorias para el frontend).
3. Levantar el backend Spring Boot en el puerto `8080` (repositorio del backend).
4. Correr la app:
   `npm run dev`
   Esto levanta el servidor Express + Vite en `http://localhost:3000`.

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (Express + Vite middleware) en `http://localhost:3000` |
| `npm run build` | Compila el frontend con Vite y empaqueta `server.ts` para producción |
| `npm run start` | Corre el build de producción (`dist/server.cjs`) |
| `npm run preview` | Sirve el build de producción de Vite localmente |
| `npm run lint` | Chequeo de tipos con `tsc --noEmit` (no hay ESLint/Prettier configurados) |
| `npm run clean` | Elimina `dist/` y el bundle del servidor |
