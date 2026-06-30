"use client";
import { useState } from "react";
import type { Clinica } from "@clinicas/types";
import { Button } from "@clinicas/ui";

type FieldType = "text" | "tipo" | "date";

const FIELDS: { key: string; label: string; required?: boolean; placeholder?: string; type?: FieldType }[] = [
  { key: "nombre", label: "Nombre de la clínica", required: true, placeholder: "Gangnam OO Clinic" },
  { key: "tipo", label: "Rubro", type: "tipo" },
  { key: "zona", label: "Zona", placeholder: "Gangnam / Myeongdong / Busan" },
  { key: "direccion", label: "Dirección", placeholder: "Teheran-ro 123, Gangnam-gu" },
  { key: "telefono", label: "Teléfono", placeholder: "02-555-1010" },
  { key: "web", label: "Web", placeholder: "https://..." },
  { key: "instagram", label: "Instagram", placeholder: "handle (sin @)" },
  { key: "email", label: "Email", placeholder: "contacto@clinica.kr" },
  { key: "idiomas_atencion", label: "Idiomas de atención", placeholder: "ko/en" },
  { key: "recibe_extranjeros", label: "Recibe extranjeros", placeholder: "si / no / desconocido" },
  { key: "contacto_nombre", label: "Persona de contacto", placeholder: "nombre" },
  { key: "canal_preferido", label: "Canal preferido", placeholder: "kakao / email / tel" },
  { key: "fecha_research", label: "Fecha de research", type: "date" },
  { key: "notas", label: "Notas", placeholder: "observaciones" },
];

export function AddClinicaModal({
  onClose, onCreated,
}: {
  onClose: () => void;
  onCreated: (c: Clinica) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setValues((cur) => ({ ...cur, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!values["nombre"]?.trim()) {
      setError("Ingresá el nombre de la clínica.");
      return;
    }
    // payload: solo claves no vacías
    const payload: Record<string, string> = {};
    for (const { key } of FIELDS) {
      const v = values[key]?.trim();
      if (v) payload[key] = v;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/clinicas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const { clinica } = (await res.json()) as { clinica: Clinica };
      onCreated(clinica);
      onClose();
    } catch {
      setError("No se pudo guardar. Probá de nuevo.");
      setSubmitting(false);
    }
  }

  const input = "w-full rounded-sm border border-line-2 bg-surface px-2 py-1.5 text-sm text-ink";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="mt-12 w-full max-w-md space-y-3 rounded-lg border border-line bg-bg p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Agregar clínica</h2>
          <Button variant="ghost" type="button" onClick={onClose}>✕</Button>
        </div>

        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-medium text-ink-2">
              {f.label}{f.required ? <span className="text-coral"> *</span> : null}
            </span>
            {f.type === "tipo" ? (
              <select
                className={input}
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              >
                <option value="">—</option>
                <option value="estetica">Estética</option>
                <option value="dental">Dental</option>
              </select>
            ) : (
              <input
                className={input}
                type={f.type === "date" ? "date" : "text"}
                value={values[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </label>
        ))}

        {error ? <p className="text-xs text-urgent">{error}</p> : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "..." : "Agregar"}</Button>
        </div>
      </form>
    </div>
  );
}
