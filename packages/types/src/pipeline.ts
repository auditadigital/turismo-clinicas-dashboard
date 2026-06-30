import type { EstadoClinica } from "./index.js";

export const ESTADO_LABELS: Record<EstadoClinica, string> = {
  "pendiente": "Pendiente",
  "contactado": "Contactada",
  "reunion": "Reunión",
  "piloto": "Piloto",
  "cliente": "Cliente",
  "descartado": "Descartada",
};

export interface PipelineColumn {
  key: string;
  label: string;
  estados: EstadoClinica[];
  dropTarget: EstadoClinica;
}

// Pipeline comercial: pendiente → contactado → reunión → piloto → cliente.
// `descartado` es una salida lateral (no avanza).
export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: "pendiente",  label: "Pendiente",  estados: ["pendiente"],  dropTarget: "pendiente" },
  { key: "contactado", label: "Contactada", estados: ["contactado"], dropTarget: "contactado" },
  { key: "reunion",    label: "Reunión",    estados: ["reunion"],    dropTarget: "reunion" },
  { key: "piloto",     label: "Piloto",     estados: ["piloto"],     dropTarget: "piloto" },
  { key: "cliente",    label: "Cliente",    estados: ["cliente"],    dropTarget: "cliente" },
  { key: "descartado", label: "Descartada", estados: ["descartado"], dropTarget: "descartado" },
];

export function columnForEstado(estado: EstadoClinica): PipelineColumn {
  const col = PIPELINE_COLUMNS.find(c => c.estados.includes(estado));
  if (!col) throw new Error(`No pipeline column for estado: ${estado}`);
  return col;
}

// Flujo hacia adelante del pipeline (excluye "descartado", salida lateral).
// El botón "avanzar" mueve al siguiente estado del flujo.
const FORWARD_FLOW: EstadoClinica[] = [
  "pendiente", "contactado", "reunion", "piloto", "cliente",
];

/** Siguiente estado al avanzar, o null si ya está al final (cliente) o es descartado. */
export function nextEstado(estado: EstadoClinica): EstadoClinica | null {
  if (estado === "descartado") return null;
  const target = columnForEstado(estado).dropTarget;
  const i = FORWARD_FLOW.indexOf(target);
  if (i === -1 || i >= FORWARD_FLOW.length - 1) return null;
  return FORWARD_FLOW[i + 1] ?? null;
}
