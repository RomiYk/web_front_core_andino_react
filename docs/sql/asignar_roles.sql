-- =====================================================
-- ASIGNAR ROLES A USUARIOS DE PRUEBA - LOS ANDES
-- =====================================================
-- Para demostrar el Criterio 3 de la rúbrica (RBAC + JWT)
-- necesitas usuarios con roles DISTINTOS a 'cliente'.
--
-- PASO 1: Crea los usuarios primero en
--   Supabase → Authentication → Users → "Add user"
--   (marca "Auto Confirm User" en cada uno)
--
-- Sugerencia de usuarios de prueba:
--   asesor@losandes.com    (rol: asesor)
--   comite@losandes.com    (rol: comite)
--   riesgos@losandes.com   (rol: riesgos)
--   gerencia@losandes.com  (rol: gerencia)
--   cliente@losandes.com   (rol: cliente — ya es el default, no requiere cambio)
--
-- PASO 2: Una vez creados, ejecuta este script para asignarles
-- su rol. Reemplaza el email de cada UPDATE por el que usaste.
-- =====================================================

-- Asesor: puede evaluar créditos (RDS/score) y gestionar mora (R2)
update roles_usuario
set rol = 'asesor'
where user_id = (select id from auth.users where email = 'asesor@losandes.com');

-- Comité: puede aprobar/rechazar créditos que llegan a comité
update roles_usuario
set rol = 'comite'
where user_id = (select id from auth.users where email = 'comite@losandes.com');

-- Riesgos: puede derivar a judicial y castigar cuentas en mora (R3)
update roles_usuario
set rol = 'riesgos'
where user_id = (select id from auth.users where email = 'riesgos@losandes.com');

-- Gerencia: puede ver todo el Panel Core y aprobar créditos de alto monto
update roles_usuario
set rol = 'gerencia'
where user_id = (select id from auth.users where email = 'gerencia@losandes.com');

-- =====================================================
-- VERIFICAR: ver todos los roles asignados
-- =====================================================
select u.email, r.rol
from roles_usuario r
join auth.users u on u.id = r.user_id
order by r.rol;
