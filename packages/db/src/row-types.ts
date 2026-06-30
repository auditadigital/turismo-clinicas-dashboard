// Alias de conveniencia derivados de los tipos generados (database.types.ts).
// Viven aparte para que `npm run gen:types` (que sobrescribe database.types.ts)
// no los borre.
import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database.types.js";

export type ClinicaRow = Tables<"clinicas">;
export type ClinicaInsert = TablesInsert<"clinicas">;
export type ClinicaUpdate = TablesUpdate<"clinicas">;
export type EstadoClinica = Enums<"estado_clinica">;
