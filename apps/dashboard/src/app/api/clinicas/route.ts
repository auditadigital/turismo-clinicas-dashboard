import { revalidatePath } from "next/cache";
import { getClinicas, repo, zClinicaCreate } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clinicas = await getClinicas();
    return Response.json({ clinicas });
  } catch (err) {
    console.error("list clinicas failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}

// Alta manual de una clínica (estado 'pendiente'). Protegido por el Basic-auth del
// middleware, o por el Bearer INGEST_TOKEN (agente de research cloud).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = zClinicaCreate.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const clinica = await repo.create(parsed.data);
    revalidatePath("/");
    return Response.json({ clinica }, { status: 201 });
  } catch (err) {
    console.error("create clinica failed", err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
