// Formateo de fechas SIEMPRE en hora de Corea (KST), sin importar dónde corra
// (browser del operador, SSR en Vercel = UTC). Fija timeZone para que la fecha
// que ve el operador en Seúl sea la real y no salte de día por el offset.
const TZ = "Asia/Seoul";

/** ISO → fecha corta KST (ej. "Jun 26"). Vacío si no hay fecha o es inválida. */
export function shortDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
}

/** ISO → fecha + hora KST (ej. "Jun 26, 08:29"). Vacío si inválida. */
export function shortDateTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ,
  });
}
