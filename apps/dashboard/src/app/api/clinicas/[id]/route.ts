import { revalidatePath } from "next/cache";
import { repo, zClinicaPatch } from "@/lib/repo";

export const dynamic = "force-dynamic";

// Editar campos del pipeline (estado, tipo, contacto, fechas, notas…).
// Protegido por el Basic auth del middleware (matcher cubre /api/clinicas/*).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = zClinicaPatch.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  }
  if (Object.keys(parsed.data).length === 0) {
    return Response.json({ error: "empty_patch" }, { status: 400 });
  }
  try {
    const updated = await repo.update(id, parsed.data);
    revalidatePath("/");
    return Response.json({ persisted: true, clinica: updated });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Clinica not found")) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    console.error("update clinica failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// Borrar una clínica. Protegido por el Basic auth del middleware.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await repo.remove(id);
    revalidatePath("/");
    return Response.json({ deleted: true });
  } catch (err) {
    console.error("delete clinica failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
