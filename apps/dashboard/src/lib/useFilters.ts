"use client";
import { useEffect, useRef, useState } from "react";
import type { EstadoClinica, TipoClinica } from "@clinicas/types";

export interface Filters {
  tipo: TipoClinica | "";
  zona: string;
  estado: EstadoClinica | "";
  query: string;
}

const KEY = "clinicas.dashboard.filters";
const DEFAULTS: Filters = { tipo: "", zona: "", estado: "", query: "" };

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFilters({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Filters>) });
    } catch {
      /* ignore corrupt prefs */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(filters));
    } catch {
      /* storage unavailable */
    }
  }, [filters]);

  return { filters, setFilters };
}
