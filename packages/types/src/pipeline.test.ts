import { describe, it, expect } from "vitest";
import {
  ESTADO_LABELS, PIPELINE_COLUMNS, columnForEstado, nextEstado,
} from "./pipeline.js";
import type { EstadoClinica } from "./index.js";

const ESTADOS: EstadoClinica[] = [
  "pendiente", "contactado", "reunion", "piloto", "cliente", "descartado",
];

describe("pipeline maps", () => {
  it("etiqueta cada estado", () => {
    for (const e of ESTADOS) expect(ESTADO_LABELS[e]).toBeTruthy();
  });

  it("tiene 6 columnas ordenadas con las labels de la spec", () => {
    expect(PIPELINE_COLUMNS.map(c => c.label)).toEqual(
      ["Pendiente", "Contactada", "Reunión", "Piloto", "Cliente", "Descartada"],
    );
  });

  it("mapea cada estado a exactamente una columna", () => {
    for (const e of ESTADOS) {
      const hits = PIPELINE_COLUMNS.filter(c => c.estados.includes(e));
      expect(hits).toHaveLength(1);
      expect(columnForEstado(e)).toBe(hits[0]);
    }
  });

  it("avanza pendiente → contactado → reunion → piloto → cliente", () => {
    expect(nextEstado("pendiente")).toBe("contactado");
    expect(nextEstado("contactado")).toBe("reunion");
    expect(nextEstado("reunion")).toBe("piloto");
    expect(nextEstado("piloto")).toBe("cliente");
    expect(nextEstado("cliente")).toBeNull();
    expect(nextEstado("descartado")).toBeNull();
  });
});
