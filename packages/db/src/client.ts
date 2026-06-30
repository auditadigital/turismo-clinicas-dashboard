// Cliente Supabase server-side (service_role). NUNCA importar en componentes client:
// `server-only` rompe el build si este módulo entra a un bundle de browser.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import WebSocketImpl from "ws";
import type { Database } from "./database.types.js";

// supabase-js construye un RealtimeClient que EXIGE un WebSocket al instanciarse.
// Node < 22 (p.ej. el runtime de Vercel) no trae WebSocket global → createClient
// lanza y rompe el render del Server Component. No usamos realtime, pero igual hay
// que proveer un transport: usamos el WebSocket nativo si existe, si no `ws`.
const wsTransport =
  (globalThis as { WebSocket?: unknown }).WebSocket ?? WebSocketImpl;

let _client: SupabaseClient<Database> | undefined;

export function getClient(): SupabaseClient<Database> {
  if (_client) return _client;
  // Normaliza la URL (acepta que peguen la REST URL con /rest/v1).
  const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (server env). " +
        "service_role va SOLO en el server/engine, nunca en el cliente.",
    );
  }
  _client = createClient<Database>(url, key, {
    auth: { persistSession: false },
    realtime: { transport: wsTransport as never },
  });
  return _client;
}
