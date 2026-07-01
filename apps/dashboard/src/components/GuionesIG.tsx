"use client";
import { useState } from "react";
import type { Clinica, EstadoClinica } from "@clinicas/types";
import { buttonClass } from "@clinicas/ui";

type Idioma = "ko" | "en" | "es";

const IDIOMAS: { key: Idioma; label: string }[] = [
  { key: "ko", label: "🇰🇷 Coreano" },
  { key: "en", label: "🇬🇧 Inglés" },
  { key: "es", label: "🇪🇸 Español" },
];

// Marcador que se reemplaza por el nombre real de la clínica al copiar.
const NAME_TOKEN = /\[클리닉명\]|\[Clinic\]|\[Clínica\]/g;

type Guion = { id: string; titulo: string; texto: Record<Idioma, string> };

// Guiones tomados de 02_Plan_de_lanzamiento/Guiones_Instagram.md
const GUIONES: Guion[] = [
  {
    id: "dm1",
    titulo: "DM 1 · Primer contacto",
    texto: {
      ko: `안녕하세요! 😊 해외 환자(영어·스페인어권) 유치를 도와드리는 일을 하고 있어요.
혹시 [클리닉명]은 외국인 환자 문의도 받고 계신가요?
추가 인력 없이 영어·스페인어 상담과 예약을 자동화해드릴 수 있어서,
관심 있으시면 간단히 보여드리고 싶어요!`,
      en: `Hi! 😊 I help Korean clinics attract English- and Spanish-speaking patients.
Does [Clinic] get inquiries from foreign patients? I can automate consultations
and bookings in English and Spanish without adding staff. Happy to show you a
quick example if you're interested!`,
      es: `¡Hola! 😊 Ayudo a clínicas en Corea a captar pacientes de habla inglesa y española.
¿[Clínica] recibe consultas de pacientes extranjeros? Puedo automatizarles la atención y
las reservas en su idioma sin sumar personal. Si les interesa, les muestro un ejemplo rápido.`,
    },
  },
  {
    id: "dm2",
    titulo: "DM 2 · Seguimiento (día 3–4)",
    texto: {
      ko: `안녕하세요! 지난 메시지 보셨을까 해서 다시 인사드려요 😊
요즘 영어·스페인어권 의료관광이 빠르게 늘고 있는데, 준비된 병원은 아직 많지 않더라고요.
관심 있으시면 짧은 데모 보내드릴게요!`,
      en: `Hi again! 😊 Just following up — English- and Spanish-speaking medical tourism is
growing fast, but few clinics are set up for it yet. Happy to send a short demo
if you'd like to see how it works.`,
      es: `¡Hola de nuevo! 😊 Te reescribo por si no viste el mensaje anterior.
El turismo médico de habla inglesa y española está creciendo rápido, pero pocas
clínicas están preparadas. Si te interesa, te paso una demo corta.`,
    },
  },
  {
    id: "dm3",
    titulo: "DM 3 · Cierre suave (día 8–10)",
    texto: {
      ko: `마지막으로 한 번만 더 연락드려요 🙂
[클리닉명] 이름으로 간단한 데모 페이지를 준비해봤어요. 보여드려도 될까요?
부담 없이 보시고 결정하시면 됩니다!`,
      en: `Last note from me 🙂 I put together a quick demo page with [Clinic]'s name on it.
Can I show it to you? No commitment — just take a look and decide.`,
      es: `Te escribo una última vez 🙂 Preparé una pequeña página de demo con el nombre de [Clínica].
¿Te la puedo mostrar? La ves sin compromiso y decidís.`,
    },
  },
];

// DM sugerido según el estado del pipeline.
function guionSugerido(estado: EstadoClinica): string | null {
  if (estado === "pendiente") return "dm1";
  if (estado === "contactado") return "dm2";
  return null;
}

function personalizar(texto: string, nombre: string): string {
  return texto.replace(NAME_TOKEN, nombre);
}

export function GuionesIG({ clinica }: { clinica: Clinica }) {
  const [idioma, setIdioma] = useState<Idioma>("ko");
  const [copiado, setCopiado] = useState<string | null>(null);
  const sugerido = guionSugerido(clinica.estado);

  async function copiar(g: Guion) {
    const texto = personalizar(g.texto[idioma], clinica.nombre);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(g.id);
      window.setTimeout(() => setCopiado((c) => (c === g.id ? null : c)), 1600);
    } catch {
      // Fallback: sin permiso de clipboard, seleccionamos vía prompt no bloqueante.
      setCopiado(`err-${g.id}`);
      window.setTimeout(() => setCopiado(null), 2400);
    }
  }

  return (
    <section className="mt-4">
      <div className="mb-2">
        <h3 className="text-xs font-medium text-ink-soft">Guiones Instagram (DM)</h3>
      </div>

      <div className="mb-3 flex gap-1">
        {IDIOMAS.map((i) => (
          <button
            key={i.key}
            type="button"
            onClick={() => setIdioma(i.key)}
            className={`rounded-sm border px-2 py-1 text-xs ${
              idioma === i.key
                ? "border-coral bg-coral-tint text-coral"
                : "border-line text-ink-soft hover:text-ink-2"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {GUIONES.map((g) => {
          const esSugerido = g.id === sugerido;
          const err = copiado === `err-${g.id}`;
          const ok = copiado === g.id;
          return (
            <div
              key={g.id}
              className={`rounded-sm border p-3 ${
                esSugerido ? "border-coral bg-coral-tint" : "border-line bg-bg-2"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-ink-2">
                  {g.titulo}
                  {esSugerido ? <span className="ml-1 text-coral">· sugerido</span> : null}
                </span>
                <button
                  type="button"
                  onClick={() => copiar(g)}
                  className={buttonClass(ok ? "secondary" : "primary", "md", "shrink-0 text-xs")}
                >
                  {ok ? "Copiado ✓" : err ? "Error ✕" : "Copiar"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">
                {personalizar(g.texto[idioma], clinica.nombre)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
