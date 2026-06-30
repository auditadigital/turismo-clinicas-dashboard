"use client";
import type { EstadoClinica, TipoClinica, Clinica } from "@clinicas/types";
import { ESTADO_LABELS } from "@clinicas/types";
import { Button } from "@clinicas/ui";
import type { Filters } from "@/lib/useFilters";

function uniq(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
}

const TIPO_LABELS: Record<TipoClinica, string> = {
  estetica: "Estética",
  dental: "Dental",
};

export function Toolbar({
  clinicas, filters, setFilters, onReload, reloading,
}: {
  clinicas: Clinica[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReload: () => void;
  reloading: boolean;
}) {
  const zonas = uniq(clinicas.map((c) => c.zona));
  const tipos: TipoClinica[] = ["estetica", "dental"];
  const estados = Object.keys(ESTADO_LABELS) as EstadoClinica[];

  const select = "rounded-sm border border-line-2 bg-surface px-2 py-1.5 text-sm text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className={`${select} min-w-48`}
        placeholder="Buscar (nombre / zona / IG)"
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />
      <select className={select} value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value as TipoClinica | "" })}>
        <option value="">Todos los rubros</option>
        {tipos.map((t) => <option key={t} value={t}>{TIPO_LABELS[t]}</option>)}
      </select>
      <select className={select} value={filters.zona}
              onChange={(e) => setFilters({ ...filters, zona: e.target.value })}>
        <option value="">Todas las zonas</option>
        {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
      </select>
      <select className={select} value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value as EstadoClinica | "" })}>
        <option value="">Todos los estados</option>
        {estados.map((s) => <option key={s} value={s}>{ESTADO_LABELS[s]}</option>)}
      </select>
      <Button variant="secondary" onClick={onReload} disabled={reloading}>
        {reloading ? "..." : "↻ Recargar"}
      </Button>
    </div>
  );
}
