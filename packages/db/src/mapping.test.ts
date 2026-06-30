import { describe, it, expect } from "vitest";
import { mapRow, toRow, slugify, deriveId } from "./mapping.js";
import type { Clinica } from "@clinicas/types";
import type { ClinicaRow } from "./row-types.js";

const fullClinica: Clinica = {
  id: "gangnam-skin-clinic",
  nombre: "Gangnam Skin Clinic",
  tipo: "estetica",
  zona: "Gangnam",
  direccion: "Teheran-ro 123, Gangnam-gu, Seoul",
  telefono: "02-555-1010",
  web: "https://gangnamskin.kr",
  instagram: "gangnam_skin",
  email: "contacto@gangnamskin.kr",
  idiomas_atencion: "ko/en",
  recibe_extranjeros: "si",
  contacto_nombre: "Dr. Kim",
  canal_preferido: "kakao",
  estado: "contactado",
  notas: "Interesados en pacientes de LatAm",
  fecha_contacto: "2026-06-05",
  fecha_research: "2026-06-01",
  updated_at: "2026-06-05T00:00:00Z",
};

describe("mapRow/toRow", () => {
  it("round-trips Clinica → row → Clinica", () => {
    // toRow produce un parcial; lo completamos con columnas solo-DB para simular una fila.
    const row = {
      ...toRow(fullClinica),
      created_at: "2026-06-05T00:00:00Z",
      updated_at: "2026-06-05T00:00:00Z",
    } as unknown as ClinicaRow;

    expect(mapRow(row)).toEqual(fullClinica);
  });

  it("toRow solo emite las claves definidas (apto para update parcial)", () => {
    const row = toRow({ estado: "cliente", notas: "cerrado" });
    expect(row).toEqual({ estado: "cliente", notas: "cerrado" });
  });

  it("mapRow omite los opcionales en null", () => {
    const row = {
      id: "x",
      nombre: "N",
      tipo: null,
      zona: null,
      direccion: null,
      telefono: null,
      web: null,
      instagram: null,
      email: null,
      idiomas_atencion: null,
      recibe_extranjeros: null,
      contacto_nombre: null,
      canal_preferido: null,
      estado: "pendiente",
      notas: null,
      fecha_contacto: null,
      fecha_research: null,
      created_at: "t",
      updated_at: "t",
    } as ClinicaRow;
    expect(mapRow(row)).toEqual({ id: "x", nombre: "N", estado: "pendiente", updated_at: "t" });
  });
});

describe("slugify / deriveId", () => {
  it("slugifica latino y conserva hangul", () => {
    expect(slugify("Gangnam Skin Clinic")).toBe("gangnam-skin-clinic");
    expect(slugify("성수동 클리닉")).toBe("성수동-클리닉");
  });

  it("deriva el id base cuando está libre", () => {
    expect(deriveId("Hongdae Dental", [])).toBe("hongdae-dental");
  });

  it("agrega sufijo numérico ante colisión", () => {
    expect(deriveId("Gangnam", ["gangnam"])).toBe("gangnam-2");
    expect(deriveId("Gangnam", ["gangnam", "gangnam-2", "gangnam-3"])).toBe("gangnam-4");
  });
});
