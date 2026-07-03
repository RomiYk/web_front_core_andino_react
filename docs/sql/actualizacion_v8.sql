-- =====================================================
-- ACTUALIZACIÓN INCREMENTAL - LOS ANDES v8
-- =====================================================
-- Este script SOLO agrega lo nuevo de la versión 8:
--   1. Roles 'gerencia' y 'riesgos'
--   2. Tabla movimientos_cuenta
-- No vuelve a crear nada que ya exista, así que es seguro
-- ejecutarlo aunque ya hayas corrido schema.sql antes.
-- =====================================================

-- 1. Agregar los roles nuevos al check constraint de roles_usuario
alter table roles_usuario drop constraint if exists roles_usuario_rol_check;
alter table roles_usuario add constraint roles_usuario_rol_check
  check (rol in ('cliente','asesor','admin','comite','gerencia','riesgos'));

-- 2. Crear la tabla de movimientos de cuenta (si no existe)
create table if not exists movimientos_cuenta (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tipo text not null check (tipo in ('desembolso_credito','deposito','retiro')),
  monto numeric(12,2) not null,
  saldo_resultante numeric(12,2) not null,
  referencia_id uuid,
  descripcion text,
  created_at timestamptz default now()
);

alter table movimientos_cuenta enable row level security;

-- La política solo se crea si no existe ya (evita el mismo error de antes)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'movimientos_cuenta' and policyname = 'usuario_ve_sus_movimientos'
  ) then
    create policy "usuario_ve_sus_movimientos" on movimientos_cuenta
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- =====================================================
-- LISTO. Verifica que la tabla se haya creado:
-- =====================================================
select table_name from information_schema.tables
where table_schema = 'public' and table_name = 'movimientos_cuenta';
