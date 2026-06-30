"use client";
import { useEffect } from "react";
import type { TipoClinica, Clinica } from "@clinicas/types";
import { ESTADO_LABELS, nextEstado } from "@clinicas/types";
import { Badge, Button, Card, Pill } from "@clinicas/ui";
import { shortDate } from "@/lib/date";

const TIPO_LABELS: Record<TipoClinica, string> = {
  estetica: "Estética",
  dental: "Dental",
};

function safeHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function history(c: Clinica): { label: string; date: string }[] {
  const rows: { label: string; date?: string }[] = [
    { label: "Research", date: c.fecha_research },
    { label: "Contacto", date: c.fecha_contacto },
  ];
  return rows.filter((r): r is { label: string; date: string } => Boolean(r.date));
}

export function ClinicaDrawer({
  clinica, onClose, onDelete, onAdvance,
}: {
  clinica: Clinica | null;
  onClose: () => void;
  onDelete: (c: Clinica) => void;
  onAdvance: (c: Clinica) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!clinica) return null;
  const c = clinica;
  const hist = history(c);
  const next = nextEstado(c.estado);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-ink">{c.nombre}</h2>
            <div className="mt-1 flex flex-wrap gap-1">
              {c.tipo ? <Badge>{TIPO_LABELS[c.tipo]}</Badge> : null}
              {c.zona ? <Badge>{c.zona}</Badge> : null}
              <Pill tone="neutral">{ESTADO_LABELS[c.estado]}</Pill>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <section className="mt-4 space-y-1 text-sm text-ink-2">
          {c.direccion ? <div>📍 {c.direccion}</div> : null}
          {c.telefono ? <div>☎ {c.telefono}</div> : null}
          {c.email ? (
            <div>
              ✉ <a href={`mailto:${c.email}`} className="text-coral underline">{c.email}</a>
            </div>
          ) : null}
          {c.web ? (
            <div>
              🌐{" "}
              <a href={safeHref(c.web)} target="_blank" rel="noopener noreferrer" className="text-coral underline">
                {c.web}
              </a>
            </div>
          ) : null}
          {c.instagram ? (
            <div>
              IG{" "}
              <a
                href={`https://instagram.com/${c.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline"
              >
                {`@${c.instagram.replace(/^@/, "")}`}
              </a>
            </div>
          ) : null}
        </section>

        {next ? (
          <section className="mt-4">
            <Button variant="secondary" size="block" onClick={() => onAdvance(c)}>
              → Mover a {ESTADO_LABELS[next]}
            </Button>
          </section>
        ) : null}

        <section className="mt-4">
          <Card className="space-y-1 text-sm">
            <Row label="Idiomas de atención" value={c.idiomas_atencion} />
            <Row label="Recibe extranjeros" value={c.recibe_extranjeros} />
            <Row label="Contacto" value={c.contacto_nombre} />
            <Row label="Canal preferido" value={c.canal_preferido} />
          </Card>
        </section>

        {c.notas ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">Notas</h3>
            <Card className="text-sm text-ink-2 whitespace-pre-wrap">{c.notas}</Card>
          </section>
        ) : null}

        {hist.length ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">Historial</h3>
            <Card className="space-y-1">
              {hist.map((h) => (
                <div key={h.label} className="flex justify-between text-sm">
                  <span className="text-ink-2">{h.label}</span>
                  <span className="font-mono text-ink-soft">{shortDate(h.date) || h.date}</span>
                </div>
              ))}
            </Card>
          </section>
        ) : null}

        <section className="mt-6 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => onDelete(c)}
            className="rounded-sm border border-urgent px-3 py-1.5 text-sm font-medium text-urgent hover:bg-urgent-tint"
          >
            🗑 Eliminar
          </button>
        </section>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink-2 text-right">{value}</span>
    </div>
  );
}
