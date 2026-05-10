-- Esquema SQL para Supabase/PostgreSQL usado por Eventix.
-- Ejecutar en Supabase SQL Editor antes de usar el sistema en produccion.

create extension if not exists "pgcrypto";

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha date not null,
  hora time not null,
  lugar text not null,
  descripcion text not null,
  imagen text not null,
  categoria text not null check (categoria in ('concierto', 'stand_up', 'actividad')),
  estado text not null default 'activo' check (estado in ('activo', 'pausado', 'finalizado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists tipos_boletas (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  tipo text not null,
  precio numeric(10, 2) not null check (precio >= 0),
  cantidad_disponible integer not null check (cantidad_disponible >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null unique,
  telefono text,
  password_hash text,
  creado_en timestamptz not null default now()
);

create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  usuario text not null,
  usuario_id uuid references usuarios(id) on delete set null,
  tipo_boleta_id uuid not null references tipos_boletas(id) on delete cascade,
  cantidad integer not null check (cantidad > 0),
  total numeric(10, 2) not null check (total >= 0),
  fecha_compra timestamptz not null default now()
);

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid references ventas(id) on delete cascade,
  evento_id uuid not null references eventos(id) on delete cascade,
  tipo_boleta_id uuid not null references tipos_boletas(id) on delete cascade,
  usuario_id uuid references usuarios(id) on delete set null,
  codigo text not null unique,
  estado text not null default 'valido' check (estado in ('valido', 'usado', 'cancelado')),
  creado_en timestamptz not null default now()
);

create index if not exists idx_tipos_boletas_evento_id on tipos_boletas(evento_id);
create index if not exists idx_ventas_tipo_boleta_id on ventas(tipo_boleta_id);
create index if not exists idx_tickets_evento_id on tickets(evento_id);
