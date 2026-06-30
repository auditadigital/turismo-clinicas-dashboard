import { getClinicas } from "@/lib/repo";
import { PipelineBoard } from "@/components/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const clinicas = await getClinicas();
  return <PipelineBoard initial={clinicas} />;
}
