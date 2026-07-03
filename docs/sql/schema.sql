-- =====================================================
-- ESQUEMA DE BASE DE DATOS - LOS ANDES
-- Caja Rural de Ahorro y Crédito
-- =====================================================
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto Supabase → SQL Editor → New Query
-- 2. Pega TODO este archivo y dale "Run"
-- 3. Esto crea las 4 tablas que la aplicación necesita
-- =====================================================

-- 1. TABLA DE ROLES DE USUARIO
-- Por defecto todos son 'cliente'. Cambia el rol manualmente
-- en esta tabla si quieres que un usuario sea 'asesor', 'admin' o 'comite'.
create table if not exists roles_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  rol text not null default 'cliente' check (rol in ('cliente','asesor','admin','comite','gerencia','riesgos')),
  created_at timestamptz default now()
);

-- 2. TABLA DE SOLICITUDES DE PRÉSTAMO
create table if not exists solicitudes_prestamo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  monto numeric(12,2) not null,
  plazo_meses integer not null,
  tasa_anual numeric(5,2) not null,
  cuota_mensual numeric(12,2) not null,
  tipo_credito text default 'personal',
  estado text not null default 'pendiente'
    check (estado in (
      'pendiente','en_evaluacion','rechazado_automatico',
      'aprobado_scoring','en_comite','aprobado','rechazado','desembolsado'
    )),
  nivel_aprobacion text,
  ingreso_neto numeric(12,2),
  gasto_familiar numeric(12,2),
  rds numeric(6,2),
  score integer,
  motivo_abandono text,
  created_at timestamptz default now()
);

-- 3. TABLA DE CUENTAS DE AHORRO
create table if not exists cuentas_ahorro (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  saldo numeric(12,2) not null default 0,
  meta_ahorro numeric(12,2) default 0,
  tasa_interes numeric(5,2) default 4.5,
  fecha_apertura timestamptz default now()
);

-- 4. TABLA DE MORA DE CRÉDITOS
create table if not exists mora_creditos (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid references solicitudes_prestamo(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  dias_mora integer not null default 0,
  monto_deuda numeric(12,2) not null,
  banda text not null default 'preventiva'
    check (banda in ('preventiva','temprana','tardia','judicial','castigo')),
  estado_gestion text not null default 'pendiente',
  observaciones text,
  fecha_ultima_gestion timestamptz,
  created_at timestamptz default now()
);

-- 5. TABLA DE MOVIMIENTOS DE CUENTA
-- Registra cada movimiento (desembolso de crédito, depósito, retiro)
-- para que el cliente vea el historial en su Homebanking — cierra el
-- flujo Core -> Homebanking exigido por el Criterio 1 de la rúbrica.
create table if not exists movimientos_cuenta (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tipo text not null check (tipo in ('desembolso_credito','deposito','retiro')),
  monto numeric(12,2) not null,
  saldo_resultante numeric(12,2) not null,
  referencia_id uuid, -- ej: id de la solicitud de crédito que originó el movimiento
  descripcion text,
  created_at timestamptz default now()
);

alter table movimientos_cuenta enable row level security;

create policy "usuario_ve_sus_movimientos" on movimientos_cuenta
  for select using (auth.uid() = user_id);

-- =====================================================
-- SEGURIDAD: Row Level Security (RLS)
-- =====================================================
-- El backend usa SUPABASE_SERVICE_KEY (rol admin) para todas
-- las consultas, así que RLS no bloquea al servidor. Aun así,
-- activamos RLS por buenas prácticas y seguridad básica.

alter table roles_usuario        enable row level security;
alter table solicitudes_prestamo enable row level security;
alter table cuentas_ahorro       enable row level security;
alter table mora_creditos        enable row level security;

-- Políticas: el usuario autenticado puede ver/crear sus propios datos
create policy "usuario_ve_su_rol" on roles_usuario
  for select using (auth.uid() = user_id);

create policy "usuario_ve_sus_solicitudes" on solicitudes_prestamo
  for select using (auth.uid() = user_id);
create policy "usuario_crea_sus_solicitudes" on solicitudes_prestamo
  for insert with check (auth.uid() = user_id);

create policy "usuario_ve_su_cuenta" on cuentas_ahorro
  for select using (auth.uid() = user_id);

create policy "usuario_ve_su_mora" on mora_creditos
  for select using (auth.uid() = user_id);

-- =====================================================
-- TRIGGER: crear automáticamente rol 'cliente' y cuenta de
-- ahorro cuando un usuario nuevo se registra
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.roles_usuario (user_id, rol)
  values (new.id, 'cliente')
  on conflict (user_id) do nothing;

  insert into public.cuentas_ahorro (user_id, saldo, meta_ahorro, tasa_interes)
  values (new.id, 0, 0, 4.5)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- LISTO. Ahora cada vez que alguien se registre desde el
-- formulario de la web, automáticamente tendrá:
--  - Un rol 'cliente' en roles_usuario
--  - Una cuenta de ahorro en cuentas_ahorro con saldo S/ 0.00
-- =====================================================
