// Mapeo fila DB ↔ tipo de dominio (packages/types). Puro, sin acceso a red.
//
// Las claves del dominio `Clinica` son IGUALES a las columnas de la tabla `clinicas`,
// así que el mapeo es casi una identidad: solo omitimos los `null` de columnas
// opcionales (mapRow) y emitimos únicamente las claves definidas (toRow, apto para
// update parcial). La fila tiene columnas que el tipo no expone (created_at): mapRow
// las ignora; toRow no las escribe. updated_at sí se expone (solo lectura).

import type { Clinica } from "@clinicas/types";
import type { ClinicaRow, ClinicaUpdate } from "./row-types.js";

/** Fila DB → Clinica. Los `null` de columnas opcionales se omiten. */
export function mapRow(row: ClinicaRow): Clinica {
  const c: Clinica = {
    id: row.id,
    nombre: row.nombre,
    estado: row.estado,
  };
  if (row.tipo != null) c.tipo = row.tipo;
  if (row.zona != null) c.zona = row.zona;
  if (row.direccion != null) c.direccion = row.direccion;
  if (row.telefono != null) c.telefono = row.telefono;
  if (row.web != null) c.web = row.web;
  if (row.instagram != null) c.instagram = row.instagram;
  if (row.email != null) c.email = row.email;
  if (row.idiomas_atencion != null) c.idiomas_atencion = row.idiomas_atencion;
  if (row.recibe_extranjeros != null) c.recibe_extranjeros = row.recibe_extranjeros;
  if (row.contacto_nombre != null) c.contacto_nombre = row.contacto_nombre;
  if (row.canal_preferido != null) c.canal_preferido = row.canal_preferido;
  if (row.notas != null) c.notas = row.notas;
  if (row.fecha_contacto != null) c.fecha_contacto = row.fecha_contacto;
  if (row.fecha_research != null) c.fecha_research = row.fecha_research;
  if (row.updated_at != null) c.updated_at = row.updated_at;
  return c;
}

/** Clinica (parcial) → fila DB. Solo emite claves definidas (apto para update). */
export function toRow(c: Partial<Clinica>): ClinicaUpdate {
  const r: ClinicaUpdate = {};
  if (c.id !== undefined) r.id = c.id;
  if (c.nombre !== undefined) r.nombre = c.nombre;
  if (c.tipo !== undefined) r.tipo = c.tipo;
  if (c.zona !== undefined) r.zona = c.zona;
  if (c.direccion !== undefined) r.direccion = c.direccion;
  if (c.telefono !== undefined) r.telefono = c.telefono;
  if (c.web !== undefined) r.web = c.web;
  if (c.instagram !== undefined) r.instagram = c.instagram;
  if (c.email !== undefined) r.email = c.email;
  if (c.idiomas_atencion !== undefined) r.idiomas_atencion = c.idiomas_atencion;
  if (c.recibe_extranjeros !== undefined) r.recibe_extranjeros = c.recibe_extranjeros;
  if (c.contacto_nombre !== undefined) r.contacto_nombre = c.contacto_nombre;
  if (c.canal_preferido !== undefined) r.canal_preferido = c.canal_preferido;
  if (c.estado !== undefined) r.estado = c.estado;
  if (c.notas !== undefined) r.notas = c.notas;
  if (c.fecha_contacto !== undefined) r.fecha_contacto = c.fecha_contacto;
  if (c.fecha_research !== undefined) r.fecha_research = c.fecha_research;
  return r;
}

/** slug a partir del nombre. Conserva letras Unicode (Hangul incluido). */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deriva un id único desde el nombre; si choca con `existing`, agrega sufijo -2, -3… */
export function deriveId(name: string, existing: readonly string[]): string {
  const base = slugify(name) || "clinica";
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
