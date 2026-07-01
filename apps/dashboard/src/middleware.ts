import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-safe constant-time string compare (avoids early-exit timing leaks).
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i]! ^ bb[i]!;
  return diff === 0;
}

export function middleware(req: NextRequest) {
  // Ingest + mantenimiento acotado: el agente de research (cloud) crea/lista/edita/
  // borra clínicas con un Bearer token. Aplica a toda la rama /api/clinicas
  // (colección y /[id], incluye estado/patch/delete) para que la routine pueda
  // auto-limpiar leads que no cumplen las reglas (sin Instagram, web en inglés).
  const ingest = process.env.INGEST_TOKEN;
  if (ingest && req.nextUrl.pathname.startsWith("/api/clinicas")) {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ") && safeEqual(auth.slice(7), ingest)) {
      return NextResponse.next();
    }
  }

  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASS;

  if (!user || !pass) {
    // Fail CLOSED in production; allow through in dev/preview for convenience.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Auth not configured", { status: 503 });
    }
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(":");
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    const okUser = safeEqual(u, user);
    const okPass = safeEqual(p, pass);
    if (okUser && okPass) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Clinicas Dashboard"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};
