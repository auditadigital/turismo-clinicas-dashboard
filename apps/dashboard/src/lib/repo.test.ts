import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de la capa de datos: el repo no toca Supabase en los tests.
const { getAll, get, update, create, remove } = vi.hoisted(() => ({
  getAll: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@clinicas/db", () => ({ createStore: () => ({ getAll, get, update, create, remove }) }));

import { repo, zClinicaPatch, zClinicaCreate } from "./repo.js";

beforeEach(() => {
  getAll.mockReset();
  get.mockReset();
  update.mockReset();
  create.mockReset();
  remove.mockReset();
});

describe("zClinicaPatch", () => {
  it("acepta un patch parcial", () => {
    const r = zClinicaPatch.safeParse({ estado: "contactado", notas: "agendar" });
    expect(r.success).toBe(true);
  });

  it("descarta claves desconocidas", () => {
    const r = zClinicaPatch.safeParse({ estado: "cliente", id: "hack", created_at: "x" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual({ estado: "cliente" });
  });

  it("rechaza un estado inválido", () => {
    expect(zClinicaPatch.safeParse({ estado: "bogus" }).success).toBe(false);
  });

  it("rechaza un tipo inválido", () => {
    expect(zClinicaPatch.safeParse({ tipo: "spa" }).success).toBe(false);
  });

  it("acepta un objeto vacío (el handler rechaza el patch vacío aparte)", () => {
    const r = zClinicaPatch.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) expect(Object.keys(r.data)).toHaveLength(0);
  });
});

describe("zClinicaCreate", () => {
  it("requiere nombre", () => {
    expect(zClinicaCreate.safeParse({ zona: "Gangnam" }).success).toBe(false);
    expect(zClinicaCreate.safeParse({ nombre: "  " }).success).toBe(false);
  });
  it("acepta nombre + opcionales y descarta extras", () => {
    const r = zClinicaCreate.safeParse({ nombre: "New", tipo: "dental", id: "hack", estado: "cliente" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual({ nombre: "New", tipo: "dental" });
  });
});

describe("repo.create", () => {
  it("delega en store.create y devuelve la clínica", async () => {
    create.mockResolvedValue({ id: "new", nombre: "New", tipo: "dental", estado: "pendiente" });
    const out = await repo.create({ nombre: "New", tipo: "dental" });
    expect(create).toHaveBeenCalledWith({ nombre: "New", tipo: "dental" });
    expect(out.estado).toBe("pendiente");
  });
});

describe("repo.remove", () => {
  it("delega en store.remove", async () => {
    remove.mockResolvedValue(undefined);
    await repo.remove("gangnam-skin");
    expect(remove).toHaveBeenCalledWith("gangnam-skin");
  });
});

describe("repo.list", () => {
  it("delega en store.getAll", async () => {
    getAll.mockResolvedValue([{ id: "a" }]);
    expect(await repo.list()).toEqual([{ id: "a" }]);
    expect(getAll).toHaveBeenCalledOnce();
  });
});

describe("repo.updateEstado", () => {
  it("actualiza el estado y devuelve la clínica fresca", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue({ id: "x", nombre: "N", estado: "contactado" });
    const out = await repo.updateEstado("x", "contactado");
    expect(update).toHaveBeenCalledWith("x", { estado: "contactado" });
    expect(out.estado).toBe("contactado");
  });

  it("tira not_found cuando la fila desapareció", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue(null);
    await expect(repo.updateEstado("ghost", "descartado")).rejects.toThrow("Clinica not found");
  });
});

describe("repo.update", () => {
  it("aplica un patch de campos arbitrario", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue({ id: "x", nombre: "N", estado: "reunion", telefono: "02-1" });
    const out = await repo.update("x", { telefono: "02-1", estado: "reunion" });
    expect(update).toHaveBeenCalledWith("x", { telefono: "02-1", estado: "reunion" });
    expect(out.telefono).toBe("02-1");
  });
});
