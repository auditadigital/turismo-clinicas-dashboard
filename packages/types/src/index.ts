// Tipos de dominio: CLÍNICAS de turismo médico en Corea (estética y dental).
// Las claves del tipo `Clinica` son EXACTAMENTE las columnas del CSV maestro / DB.

export type EstadoClinica =
  | "pendiente"
  | "contactado"
  | "reunion"
  | "piloto"
  | "cliente"
  | "descartado";

export type TipoClinica = "estetica" | "dental";

export interface Clinica {
  id: string;
  /** Nombre de la clínica (requerido). */
  nombre: string;
  /** Rubro: estética o dental. */
  tipo?: TipoClinica;
  /** Zona/barrio. Típicamente 'Gangnam' | 'Myeongdong' | 'Busan'. */
  zona?: string;
  direccion?: string;
  telefono?: string;
  web?: string;
  instagram?: string;
  email?: string;
  /** Idiomas de atención, ej 'ko/en'. */
  idiomas_atencion?: string;
  /** Si atiende extranjeros: 'si' | 'no' | 'desconocido'. */
  recibe_extranjeros?: string;
  /** Nombre de la persona de contacto. */
  contacto_nombre?: string;
  /** Canal preferido: 'kakao' | 'email' | 'tel'. */
  canal_preferido?: string;
  estado: EstadoClinica;
  notas?: string;
  fecha_contacto?: string;
  fecha_research?: string;
  /** Última modificación (ISO). La fija la DB; mapRow la expone, no es editable. */
  updated_at?: string;
}

export * from "./pipeline.js";
