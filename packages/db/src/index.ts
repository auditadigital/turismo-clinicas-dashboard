// @clinicas/db — capa de datos sobre Supabase (server-side, service_role).
// La UI consume `ClinicaStore` / `createStore()`, nunca Supabase directo.
export { createStore, SupabaseStore } from "./store.js";
export type { ClinicaStore, NewClinica } from "./store.js";
export { mapRow, toRow, slugify, deriveId } from "./mapping.js";
export { getClient } from "./client.js";
export type { Database, Json } from "./database.types.js";
export type {
  ClinicaRow,
  ClinicaInsert,
  ClinicaUpdate,
  EstadoClinica,
} from "./row-types.js";
