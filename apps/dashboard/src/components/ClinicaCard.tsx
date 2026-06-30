"use client";
import type { TipoClinica, Clinica } from "@clinicas/types";
import { ESTADO_LABELS, nextEstado } from "@clinicas/types";
import { Badge } from "@clinicas/ui";
import { shortDate } from "@/lib/date";

const TIPO_LABELS: Record<TipoClinica, string> = {
  estetica: "Estética",
  dental: "Dental",
};

export function ClinicaCard({
  clinica, onOpen, onDragStart, onDelete, onAdvance,
}: {
  clinica: Clinica;
  onOpen: (c: Clinica) => void;
  onDragStart: (id: string) => void;
  onDelete: (c: Clinica) => void;
  onAdvance: (c: Clinica) => void;
}) {
  const next = nextEstado(clinica.estado);
  return (
    <article
      draggable
      role="button"
      tabIndex={0}
      onDragStart={() => onDragStart(clinica.id)}
      onClick={() => onOpen(clinica)}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(clinica); }}
      className="group relative cursor-pointer rounded-sm border border-line bg-surface p-3 hover:border-line-2"
    >
      <button
        type="button"
        aria-label="Eliminar"
        title="Eliminar"
        onClick={(e) => { e.stopPropagation(); onDelete(clinica); }}
        onKeyDown={(e) => e.stopPropagation()}
        className="absolute right-1 top-1 hidden rounded-sm px-1.5 text-ink-soft hover:text-urgent group-hover:block"
      >
        ✕
      </button>
      <div className="pr-5 font-display text-sm text-ink">{clinica.nombre}</div>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {clinica.tipo ? <Badge>{TIPO_LABELS[clinica.tipo]}</Badge> : null}
        {clinica.zona ? <Badge>{clinica.zona}</Badge> : null}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-xs text-ink-soft">
        {clinica.recibe_extranjeros ? <span>extranjeros: {clinica.recibe_extranjeros}</span> : <span />}
        {shortDate(clinica.updated_at) ? (
          <span title="Última modificación (KST)">{shortDate(clinica.updated_at)}</span>
        ) : null}
      </div>
      {next ? (
        <button
          type="button"
          title={`Mover a ${ESTADO_LABELS[next]}`}
          onClick={(e) => { e.stopPropagation(); onAdvance(clinica); }}
          onKeyDown={(e) => e.stopPropagation()}
          className="mt-2 w-full rounded-sm border border-line py-1 text-xs font-medium text-ink-soft hover:border-line-2 hover:text-ink"
        >
          → {ESTADO_LABELS[next]}
        </button>
      ) : null}
    </article>
  );
}
