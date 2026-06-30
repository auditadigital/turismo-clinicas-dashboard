# turismo-clinicas-dashboard

Monorepo Turborepo para el pipeline comercial de **clínicas** de turismo médico
en Corea (estética y dental).

- `apps/dashboard` — Next.js 15 (App Router). Pipeline kanban + alta/edición.
- `packages/types` — tipos de dominio (`Clinica`, `EstadoClinica`, `TipoClinica`).
- `packages/db` — capa de datos sobre Supabase (server-side, service_role).
- `packages/ui` — componentes y tokens de diseño compartidos.
- `supabase/` — migración + config (tabla `clinicas`).

## Scripts

```bash
npm install
npm run typecheck
npm run test
npm run build      # requiere SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en build time
npm run dev
```

## Auth

- UI: Basic-auth (`DASHBOARD_USER` / `DASHBOARD_PASS`), realm "Clinicas Dashboard".
- Ingest: `Authorization: Bearer <INGEST_TOKEN>` acotado a la colección `/api/clinicas`
  (para el agente de research cloud). Ver `apps/dashboard/.env.local.example`.
