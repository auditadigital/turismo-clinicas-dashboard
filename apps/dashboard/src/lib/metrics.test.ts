import { describe, it, expect } from "vitest";
import { computeMetrics } from "./metrics.js";
import type { Clinica } from "@clinicas/types";

function c(over: Partial<Clinica>): Clinica {
  return { id: over.id ?? "x", nombre: "n", estado: "pendiente", ...over } as Clinica;
}

describe("computeMetrics", () => {
  const data: Clinica[] = [
    c({ id: "a", estado: "pendiente" }),
    c({ id: "b", estado: "contactado" }),
    c({ id: "c", estado: "reunion" }),
    c({ id: "d", estado: "cliente" }),
    c({ id: "e", estado: "cliente" }),
    c({ id: "f", estado: "descartado" }),
  ];

  it("cuenta por estado", () => {
    const m = computeMetrics(data);
    expect(m.byEstado.cliente).toBe(2);
    expect(m.byEstado.pendiente).toBe(1);
    expect(m.byEstado.descartado).toBe(1);
  });

  it("total y clientes", () => {
    const m = computeMetrics(data);
    expect(m.total).toBe(6);
    expect(m.clientes).toBe(2);
  });

  it("conversión = clientes / avanzadas", () => {
    // avanzadas = {b,c,d,e} = 4 (pendiente y descartado excluidos), clientes = {d,e} = 2 => 0.5
    const m = computeMetrics(data);
    expect(m.pendienteToCliente).toBeCloseTo(0.5, 5);
  });

  it("conversión 0 cuando no hay avanzadas", () => {
    const m = computeMetrics([c({ id: "z", estado: "pendiente" })]);
    expect(m.pendienteToCliente).toBe(0);
  });
});
