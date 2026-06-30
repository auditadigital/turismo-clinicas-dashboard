"use client";
import { Button } from "@clinicas/ui";

export function ConfirmDialog({
  title, message, confirmLabel = "Confirmar", cancelLabel = "Cancelar", busy, onConfirm, onCancel,
}: {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm space-y-3 rounded-lg border border-line bg-bg p-6 shadow-2xl"
      >
        <h2 className="font-display text-lg text-ink">{title}</h2>
        {message ? <p className="text-sm text-ink-2">{message}</p> : null}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-sm bg-urgent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
