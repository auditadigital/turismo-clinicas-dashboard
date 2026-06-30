export type Semaforo = "good" | "warn" | "urgent";

export function scoreColor(n: number): Semaforo {
  if (n >= 75) return "good";
  if (n >= 50) return "warn";
  return "urgent";
}
