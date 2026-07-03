-- =====================================================
-- DATOS SEMILLA - LOS ANDES (para la demo/sustentación)
-- =====================================================
-- Calibrado según el Criterio 5 de la rúbrica:
--   "datos calibrados a proporciones reales (mora ~13%, 2 productos)"
--
-- Este script genera SOLICITUDES y MORA de ejemplo asociadas a
-- TU PROPIO usuario, para que el profesor vea datos reales al
-- entrar al Panel Core y a la Bandeja de Mora.
--
-- PASO 1: Reemplaza 'TU_EMAIL_AQUI' por el correo de un usuario
-- que ya exista en tu Supabase (puede ser tu cuenta cliente).
--
-- PASO 2: Ejecuta este script completo en el SQL Editor.
-- =====================================================

do $$
declare
  v_user_id uuid;
  v_solicitud_id uuid;
  i integer;
  v_monto numeric;
  v_plazo integer;
  v_tipo text;
  v_tasa numeric;
  v_cuota numeric;
  v_estado text;
  v_dias_mora integer;
  v_banda text;
begin
  -- Cambia este email por uno que ya exista en tu proyecto Supabase
  select id into v_user_id from auth.users where email = 'TU_EMAIL_AQUI' limit 1;

  if v_user_id is null then
    raise notice 'No se encontró el usuario. Cambia TU_EMAIL_AQUI por un email real antes de ejecutar.';
    return;
  end if;

  -- Generar 15 solicitudes de ejemplo: 2 tipos de producto (personal/empresarial)
  for i in 1..15 loop
    v_tipo := case when i % 2 = 0 then 'empresarial' else 'personal' end;
    v_tasa := case when v_tipo = 'empresarial' then 43.92 else 40.92 end;
    v_monto := (1000 + (i * 1500))::numeric;
    v_plazo := (array[6,12,18,24,36])[1 + (i % 5)];
    v_cuota := round((v_monto * (power(1 + v_tasa/100, 1.0/12) - 1)) /
               (1 - power(1 + (power(1 + v_tasa/100, 1.0/12) - 1), -v_plazo)), 2);

    -- Distribución de estados: la mayoría desembolsados, algunos en proceso
    v_estado := case
      when i <= 10 then 'desembolsado'
      when i <= 12 then 'en_comite'
      when i = 13 then 'pendiente'
      else 'rechazado'
    end;

    insert into solicitudes_prestamo
      (user_id, monto, plazo_meses, tasa_anual, cuota_mensual, tipo_credito, estado, nivel_aprobacion, rds, score)
    values
      (v_user_id, v_monto, v_plazo, v_tasa, v_cuota, v_tipo, v_estado,
       case when v_monto <= 10000 then 'asesor' when v_monto <= 50000 then 'comite' else 'jefe_regional' end,
       round((20 + random() * 30)::numeric, 2),
       round((50 + random() * 40)::numeric))
    returning id into v_solicitud_id;

    -- De las 10 desembolsadas, calibramos ~13% de la cartera en mora (≈2 créditos de 15)
    if v_estado = 'desembolsado' and i in (3, 9) then
      v_dias_mora := case when i = 3 then 45 else 135 end; -- una temprana, una judicial
      v_banda := case
        when v_dias_mora <= 30 then 'preventiva'
        when v_dias_mora <= 60 then 'temprana'
        when v_dias_mora <= 120 then 'tardia'
        when v_dias_mora <= 180 then 'judicial'
        else 'castigo'
      end;

      insert into mora_creditos
        (solicitud_id, user_id, dias_mora, monto_deuda, banda, estado_gestion)
      values
        (v_solicitud_id, v_user_id, v_dias_mora, round(v_cuota * 2, 2), v_banda, 'pendiente');
    end if;
  end loop;

  raise notice 'Datos semilla insertados correctamente para el usuario %', v_user_id;
end $$;

-- =====================================================
-- VERIFICAR LA PROPORCIÓN DE MORA RESULTANTE
-- =====================================================
select
  count(*) filter (where estado = 'desembolsado') as total_desembolsados,
  (select count(*) from mora_creditos) as total_en_mora,
  round(
    (select count(*) from mora_creditos)::numeric /
    nullif(count(*) filter (where estado = 'desembolsado'), 0) * 100,
    1
  ) as ratio_mora_porcentaje,
  count(*) filter (where tipo_credito = 'personal') as productos_personal,
  count(*) filter (where tipo_credito = 'empresarial') as productos_empresarial
from solicitudes_prestamo;
