"use client";
import type { Clinica } from "@clinicas/types";
import { PIPELINE_COLUMNS, columnForEstado } from "@clinicas/types";
import { Card } from "@clinicas/ui";
import { computeMetrics } from "@/lib/metrics";

export function Metrics({ clinicas }: { clinicas: Clinica[] }) {
  const m = computeMetrics(clinicas);
  const perColumn = PIPELINE_COLUMNS.map((c) => ({
    label: c.label,
    count: clinicas.filter((p) => columnForEstado(p.estado).key === c.key).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <div className="text-xs text-ink-soft">Clientes</div>
        <div className="font-mono text-xl text-ink">{m.clientes}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">Conversión a cliente</div>
        <div className="font-mono text-xl text-ink">{(m.pendienteToCliente * 100).toFixed(0)}%</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">Total de clínicas</div>
        <div className="font-mono text-xl text-ink">{m.total}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">Por etapa</div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-xs text-ink-2">
          {perColumn.map((c) => <span key={c.label}>{c.label} {c.count}</span>)}
        </div>
      </Card>
    </div>
  );
}
