"use client";
import { useMemo, useRef, useState } from "react";
import type { EstadoClinica, Clinica } from "@clinicas/types";
import { PIPELINE_COLUMNS, columnForEstado, ESTADO_LABELS, nextEstado } from "@clinicas/types";
import { Metrics } from "./Metrics";
import { Toolbar } from "./Toolbar";
import { ClinicaCard } from "./ClinicaCard";
import { ClinicaDrawer } from "./ClinicaDrawer";
import { AddClinicaModal } from "./AddClinicaModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "@clinicas/ui";
import { useFilters } from "@/lib/useFilters";

export function PipelineBoard({ initial }: { initial: Clinica[] }) {
  const [clinicas, setClinicas] = useState<Clinica[]>(initial);
  const [selected, setSelected] = useState<Clinica | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Clinica | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { filters, setFilters } = useFilters();

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return clinicas.filter((c) => {
      if (filters.tipo && c.tipo !== filters.tipo) return false;
      if (filters.zona && c.zona !== filters.zona) return false;
      if (filters.estado && c.estado !== filters.estado) return false;
      if (q) {
        const hay = `${c.nombre} ${c.zona ?? ""} ${c.instagram ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [clinicas, filters]);

  async function reload() {
    setReloading(true);
    try {
      const res = await fetch("/api/clinicas", { cache: "no-store" });
      if (!res.ok) throw new Error(`reload failed: ${res.status}`);
      const data = (await res.json()) as { clinicas: Clinica[] };
      setClinicas(data.clinicas);
    } catch {
      showToast("Falló la recarga");
    } finally {
      setReloading(false);
    }
  }

  async function applyMove(id: string, estado: EstadoClinica) {
    let snapshot: Clinica[] = [];
    setClinicas((cur) => {
      snapshot = cur;
      return cur.map((c) => (c.id === id ? { ...c, estado } : c));
    });
    setSelected((cur) => (cur && cur.id === id ? { ...cur, estado } : cur));
    try {
      const res = await fetch(`/api/clinicas/${id}/estado`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.status === 503) {
        showToast("Aplicado (solo vista) — no persiste hasta configurar Supabase");
      } else if (!res.ok) {
        setClinicas(snapshot);
        showToast("Falló la actualización");
      }
    } catch {
      setClinicas(snapshot);
      showToast("Falló el cambio");
    }
  }

  function moveTo(estado: EstadoClinica) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    void applyMove(id, estado);
  }

  function advance(c: Clinica) {
    const next = nextEstado(c.estado);
    if (!next) return;
    void applyMove(c.id, next);
    showToast(`${c.nombre} → ${ESTADO_LABELS[next]}`);
  }

  async function doDelete() {
    const target = confirmDelete;
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/clinicas/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`${res.status}`);
      setClinicas((cur) => cur.filter((c) => c.id !== target.id));
      if (selected?.id === target.id) setSelected(null);
      setConfirmDelete(null);
      showToast(`${target.nombre} eliminada`);
    } catch {
      showToast("Falló la eliminación");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4 p-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Pipeline de clínicas</h1>
        <Button onClick={() => setAdding(true)}>+ Agregar clínica</Button>
      </header>

      <Metrics clinicas={clinicas} />
      <Toolbar
        clinicas={clinicas}
        filters={filters}
        setFilters={setFilters}
        onReload={reload}
        reloading={reloading}
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {PIPELINE_COLUMNS.map((col) => {
          const cards = filtered.filter((c) => columnForEstado(c.estado).key === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo(col.dropTarget)}
              className="flex w-64 shrink-0 flex-col gap-2 rounded bg-bg-2 p-2"
            >
              <div className="flex items-center justify-between px-1">
                <span className="font-display text-sm text-ink">{col.label}</span>
                <span className="font-mono text-xs text-ink-soft">{cards.length}</span>
              </div>
              {cards.map((c) => (
                <ClinicaCard key={c.id} clinica={c} onOpen={setSelected} onDragStart={setDragId} onDelete={setConfirmDelete} onAdvance={advance} />
              ))}
            </div>
          );
        })}
      </div>

      <ClinicaDrawer clinica={selected} onClose={() => setSelected(null)} onDelete={setConfirmDelete} onAdvance={advance} />

      {adding ? (
        <AddClinicaModal
          onClose={() => setAdding(false)}
          onCreated={(c) => {
            setClinicas((cur) => [c, ...cur]);
            showToast(`${c.nombre} agregada`);
          }}
        />
      ) : null}

      {confirmDelete ? (
        <ConfirmDialog
          title="Eliminar clínica"
          message={`¿Eliminar la clínica '${confirmDelete.nombre}'? No se puede deshacer.`}
          confirmLabel="Eliminar"
          busy={deleting}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-sm bg-ink px-4 py-2 text-sm text-white">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
