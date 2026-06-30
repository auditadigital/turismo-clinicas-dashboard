import type { SupabaseClient } from "@supabase/supabase-js";
import type { Clinica } from "@clinicas/types";
import type { Database } from "./database.types.js";
import { getClient } from "./client.js";
import { deriveId, mapRow, slugify, toRow } from "./mapping.js";

/** Datos para crear una clínica a mano (dashboard). `nombre` requerido; resto opcional. */
export type NewClinica = { nombre: string } & Partial<Omit<Clinica, "nombre" | "id">>;

/** Capa de datos abstracta (ver docs/data-plane.md). La UI depende de esto, no de Supabase. */
export interface ClinicaStore {
  getAll(): Promise<Clinica[]>;
  get(id: string): Promise<Clinica | null>;
  create(input: NewClinica): Promise<Clinica>; // alta manual, estado 'pendiente'
  update(id: string, patch: Partial<Clinica>): Promise<void>;
  remove(id: string): Promise<void>;
}

type Db = SupabaseClient<Database>;

const TABLE = "clinicas";

export class SupabaseStore implements ClinicaStore {
  constructor(private readonly db: Db) {}

  async getAll(): Promise<Clinica[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  }

  async get(id: string): Promise<Clinica | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data) : null;
  }

  // Deriva un id único desde el nombre (slug + sufijo si choca).
  private async nextId(nombre: string): Promise<string> {
    const base = slugify(nombre) || "clinica";
    const { data, error } = await this.db.from(TABLE).select("id").like("id", `${base}%`);
    if (error) throw new Error(error.message);
    return deriveId(nombre, (data ?? []).map((r) => r.id));
  }

  async create(input: NewClinica): Promise<Clinica> {
    const id = await this.nextId(input.nombre);
    const row = {
      ...toRow(input),
      id,
      nombre: input.nombre,
      estado: input.estado ?? ("pendiente" as const),
    };
    const { data, error } = await this.db.from(TABLE).insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async update(id: string, patch: Partial<Clinica>): Promise<void> {
    const row = { ...toRow(patch), updated_at: new Date().toISOString() };
    const { error } = await this.db.from(TABLE).update(row).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.db.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

let _store: ClinicaStore | undefined;

/** Singleton server-side. Construye el cliente (service_role) la primera vez. */
export function createStore(): ClinicaStore {
  if (!_store) _store = new SupabaseStore(getClient());
  return _store;
}
