-- Migración inicial: tabla única `clinicas` (fuente de la verdad).
-- Clínicas de turismo médico en Corea (estética y dental). Tipos en packages/types.
-- Acceso server-side con service_role; RLS activado SIN políticas públicas.

-- Estado comercial de la clínica (pipeline: pendiente → cliente).
create type estado_clinica as enum (
  'pendiente',
  'contactado',
  'reunion',
  'piloto',
  'cliente',
  'descartado'
);

-- Rubro de la clínica.
create type tipo_clinica as enum (
  'estetica',
  'dental'
);

create table clinicas (
  id                 text primary key,                  -- slug derivado del nombre
  nombre             text not null,
  tipo               tipo_clinica,
  zona               text,                              -- Gangnam | Myeongdong | Busan ...
  direccion          text,
  telefono           text,
  web                text,
  instagram          text,
  email              text,
  idiomas_atencion   text,                              -- ej 'ko/en'
  recibe_extranjeros text,                              -- 'si' | 'no' | 'desconocido'
  contacto_nombre    text,
  canal_preferido    text,                              -- 'kakao' | 'email' | 'tel'
  estado             estado_clinica not null default 'pendiente',
  notas              text,
  fecha_contacto     date,
  fecha_research     date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index clinicas_estado_idx  on clinicas(estado);
create index clinicas_tipo_idx    on clinicas(tipo);
create index clinicas_created_idx on clinicas(created_at desc);

-- dedup: la misma clínica (nombre + zona) no se carga dos veces.
create unique index clinicas_nombre_zona_uniq
  on clinicas (lower(nombre), coalesce(lower(zona), ''));

-- trigger updated_at
create function set_updated_at() returns trigger language plpgsql as $$
  begin new.updated_at = now(); return new; end $$;

create trigger clinicas_updated before update on clinicas
  for each row execute function set_updated_at();

-- RLS: activado, SIN políticas públicas → solo service_role (server) accede
alter table clinicas enable row level security;
