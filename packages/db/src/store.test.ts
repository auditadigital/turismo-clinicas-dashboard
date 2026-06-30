import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseStore } from "./store.js";
import type { Database } from "./database.types.js";

// Fake mínimo del query builder de supabase-js: cada método encadenable
// devuelve el mismo builder; `then` resuelve con lo que devuelva `resolver(ctx)`.
type Ctx = {
  table: string;
  op: "select" | "insert" | "update" | "delete";
  payload?: unknown;
  filters: Array<[string, string, string]>;
  single: boolean;
};

function fakeClient(resolver: (ctx: Ctx) => { data?: unknown; error: unknown }) {
  const seen: Ctx[] = [];
  const client = {
    from(table: string) {
      const ctx: Ctx = { table, op: "select", payload: undefined, filters: [], single: false };
      seen.push(ctx);
      const b: Record<string, unknown> = {
        select: () => b,
        order: () => b,
        insert: (p: unknown) => ((ctx.op = "insert"), (ctx.payload = p), b),
        update: (p: unknown) => ((ctx.op = "update"), (ctx.payload = p), b),
        delete: () => ((ctx.op = "delete"), b),
        like: (c: string, v: string) => (ctx.filters.push(["like", c, v]), b),
        eq: (c: string, v: string) => (ctx.filters.push(["eq", c, v]), b),
        single: () => ((ctx.single = true), b),
        maybeSingle: () => ((ctx.single = true), b),
        then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) =>
          Promise.resolve(resolver(ctx)).then(res, rej),
      };
      return b;
    },
  };
  return { client: client as unknown as SupabaseClient<Database>, seen };
}

describe("SupabaseStore.create", () => {
  it("crea con id derivado del nombre y estado 'pendiente'", async () => {
    const { client, seen } = fakeClient((ctx) => {
      if (ctx.op === "select") return { data: [], error: null }; // sin colisiones
      return { data: { ...(ctx.payload as object), created_at: "t", updated_at: "t" }, error: null };
    });
    const store = new SupabaseStore(client);

    const out = await store.create({ nombre: "New Clinic", tipo: "dental", zona: "Busan", instagram: "newclinic" });

    const insert = (seen.find((c) => c.op === "insert")!.payload) as Record<string, unknown>;
    expect(insert.id).toBe("new-clinic");
    expect(insert.nombre).toBe("New Clinic");
    expect(insert.estado).toBe("pendiente");
    expect(insert.tipo).toBe("dental");
    expect(insert.instagram).toBe("newclinic");
    expect(out.nombre).toBe("New Clinic");
    expect(out.estado).toBe("pendiente");
  });

  it("agrega sufijo cuando el id ya existe", async () => {
    const { client, seen } = fakeClient((ctx) => {
      if (ctx.op === "select") return { data: [{ id: "gangnam-skin" }], error: null };
      return { data: { ...(ctx.payload as object), created_at: "t", updated_at: "t" }, error: null };
    });
    const store = new SupabaseStore(client);
    const out = await store.create({ nombre: "Gangnam Skin" });
    expect(out.id).toBe("gangnam-skin-2");
    const insertCtx = seen.find((c) => c.op === "insert")!;
    expect((insertCtx.payload as { id: string }).id).toBe("gangnam-skin-2");
  });
});

describe("SupabaseStore.update", () => {
  it("aplica el patch mapeado y filtra por id", async () => {
    const { client, seen } = fakeClient(() => ({ error: null }));
    const store = new SupabaseStore(client);

    await store.update("gangnam-skin", { estado: "reunion", notas: "agendar" });

    const ctx = seen.find((c) => c.op === "update")!;
    const { updated_at, ...rest } = ctx.payload as Record<string, unknown>;
    expect(rest).toEqual({ estado: "reunion", notas: "agendar" });
    expect(typeof updated_at).toBe("string"); // sellado en cada update
    expect(ctx.filters).toContainEqual(["eq", "id", "gangnam-skin"]);
  });

  it("propaga el error de Supabase", async () => {
    const { client } = fakeClient(() => ({ error: { message: "boom" } }));
    const store = new SupabaseStore(client);
    await expect(store.update("x", { estado: "descartado" })).rejects.toThrow("boom");
  });
});

describe("SupabaseStore.remove", () => {
  it("borra filtrando por id", async () => {
    const { client, seen } = fakeClient(() => ({ error: null }));
    const store = new SupabaseStore(client);
    await store.remove("gangnam-skin");
    const ctx = seen.find((c) => c.op === "delete")!;
    expect(ctx.filters).toContainEqual(["eq", "id", "gangnam-skin"]);
  });

  it("propaga el error de Supabase", async () => {
    const { client } = fakeClient(() => ({ error: { message: "nope" } }));
    const store = new SupabaseStore(client);
    await expect(store.remove("x")).rejects.toThrow("nope");
  });
});
