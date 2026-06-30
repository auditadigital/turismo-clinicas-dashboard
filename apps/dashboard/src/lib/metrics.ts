import type { EstadoClinica, Clinica } from "@clinicas/types";

export interface Metrics {
  total: number;
  byEstado: Record<EstadoClinica, number>;
  clientes: number;
  /** Conversión: clientes / clínicas que avanzaron más allá de 'pendiente' (excluye descartadas). */
  pendienteToCliente: number;
}

const EMPTY: Record<EstadoClinica, number> = {
  "pendiente": 0, "contactado": 0, "reunion": 0,
  "piloto": 0, "cliente": 0, "descartado": 0,
};

// "Avanzadas" = clínicas que pasaron de 'pendiente' por el pipeline comercial.
// Excluye 'pendiente' (todavía sin trabajar) y 'descartado' (salida lateral),
// así el denominador refleja solo las que entraron al funnel de verdad.
const AVANZADAS: EstadoClinica[] = ["contactado", "reunion", "piloto", "cliente"];

export function computeMetrics(clinicas: Clinica[]): Metrics {
  const byEstado: Record<EstadoClinica, number> = { ...EMPTY };
  let clientes = 0;
  let avanzadas = 0;

  for (const c of clinicas) {
    byEstado[c.estado] = (byEstado[c.estado] ?? 0) + 1;
    if (c.estado === "cliente") clientes += 1;
    if (AVANZADAS.includes(c.estado)) avanzadas += 1;
  }

  return {
    total: clinicas.length,
    byEstado,
    clientes,
    pendienteToCliente: avanzadas === 0 ? 0 : clientes / avanzadas,
  };
}
