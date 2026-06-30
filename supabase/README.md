# supabase/ — migraciones + tipos

Migración de la tabla única `clinicas` (fuente de la verdad). Schema en
`migrations/00000000000000_init_clinicas.sql`.

## Estado

- [x] Migración SQL creada (enums, tabla, índices, dedup, RLS, trigger).
- [x] `database.types.ts` en `packages/db` (hecho a mano; **regenerar** con el CLI tras linkear).
- [ ] **Aplicar al proyecto** — requiere link/credenciales (ver abajo).

## Aplicar la migración

Necesitás el `PROJECT_REF` (dashboard Supabase → Project Settings) y el password de la DB.

```bash
# 1. login (abre browser, una vez)
npx supabase login

# 2. linkear el repo al proyecto existente
npx supabase link --project-ref <PROJECT_REF>

# 3. empujar la migración
npx supabase db push
```

Alternativa sin link, con connection string directa:

```bash
npx supabase db push --db-url "postgresql://postgres:<PASS>@db.<REF>.supabase.co:5432/postgres"
```

## Generar los tipos (tras aplicar)

```bash
npx supabase gen types typescript --linked > packages/db/src/database.types.ts
# o:  --project-id <PROJECT_REF>
```

> `service_role` SOLO en server/engine — nunca en el cliente.
