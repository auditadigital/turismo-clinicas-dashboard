import "server-only";
import { z } from "zod";
import type { EstadoClinica, Clinica } from "@clinicas/types";
import { createStore, type NewClinica } from "@clinicas/db";

// Capa de datos del dashboard. La fuente de la verdad es la tabla `clinicas`
// en Supabase (acceso server-side con service_role vía @clinicas/db).
export interface ClinicaRepo {
  list(): Promise<Clinica[]>;
  get(id: string): Promise<Clinica | null>;
  create(input: NewClinica): Promise<Clinica>;
  updateEstado(id: string, estado: EstadoClinica): Promise<Clinica>;
  update(id: string, patch: ClinicaPatch): Promise<Clinica>;
  remove(id: string): Promise<void>;
}

const ESTADOS = [
  "pendiente", "contactado", "reunion", "piloto", "cliente", "descartado",
] as const;

const TIPOS = ["estetica", "dental"] as const;

// Campos editables del pipeline desde el dashboard. Claves desconocidas se descartan.
export const zClinicaPatch = z
  .object({
    estado: z.enum(ESTADOS),
    tipo: z.enum(TIPOS),
    zona: z.string(),
    direccion: z.string(),
    telefono: z.string(),
    web: z.string(),
    instagram: z.string(),
    email: z.string(),
    idiomas_atencion: z.string(),
    recibe_extranjeros: z.string(),
    contacto_nombre: z.string(),
    canal_preferido: z.string(),
    notas: z.string(),
    fecha_contacto: z.string(),
    fecha_research: z.string(),
  })
  .partial();

export type ClinicaPatch = z.infer<typeof zClinicaPatch>;

// Alta manual desde el dashboard: nombre requerido, resto opcional. El estado por
// default ('pendiente') lo pone el store. Claves desconocidas se descartan.
export const zClinicaCreate = z.object({
  nombre: z.string().trim().min(1),
  tipo: z.enum(TIPOS).optional(),
  zona: z.string().trim().optional(),
  direccion: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  web: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  email: z.string().trim().optional(),
  idiomas_atencion: z.string().trim().optional(),
  recibe_extranjeros: z.string().trim().optional(),
  contacto_nombre: z.string().trim().optional(),
  canal_preferido: z.string().trim().optional(),
  notas: z.string().trim().optional(),
  fecha_contacto: z.string().trim().optional(),
  fecha_research: z.string().trim().optional(),
});

export type ClinicaCreate = z.infer<typeof zClinicaCreate>;

class SupabaseClinicaRepo implements ClinicaRepo {
  list(): Promise<Clinica[]> {
    return createStore().getAll();
  }

  get(id: string): Promise<Clinica | null> {
    return createStore().get(id);
  }

  create(input: NewClinica): Promise<Clinica> {
    return createStore().create(input);
  }

  async updateEstado(id: string, estado: EstadoClinica): Promise<Clinica> {
    return this.update(id, { estado });
  }

  async update(id: string, patch: ClinicaPatch): Promise<Clinica> {
    const store = createStore();
    await store.update(id, patch);
    const updated = await store.get(id);
    // update() sobre un id inexistente afecta 0 filas sin error → lo detectamos acá.
    if (!updated) throw new Error(`Clinica not found: ${id}`);
    return updated;
  }

  remove(id: string): Promise<void> {
    return createStore().remove(id);
  }
}

export const repo: ClinicaRepo = new SupabaseClinicaRepo();

export function getClinicas(): Promise<Clinica[]> {
  return repo.list();
}
