import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repo";
import type { EstadoClinica } from "@clinicas/types";

export const dynamic = "force-dynamic";

const VALID: EstadoClinica[] = [
  "pendiente", "contactado", "reunion", "piloto", "cliente", "descartado",
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { estado?: string };
  if (!body.estado || !VALID.includes(body.estado as EstadoClinica)) {
    return Response.json({ error: "invalid estado" }, { status: 400 });
  }
  try {
    const updated = await repo.updateEstado(id, body.estado as EstadoClinica);
    revalidatePath("/");
    return Response.json({ persisted: true, clinica: updated });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Clinica not found")) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    console.error("updateEstado failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
