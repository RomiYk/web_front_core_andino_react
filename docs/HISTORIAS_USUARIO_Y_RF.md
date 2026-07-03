# Historias de Usuario y Requisitos Funcionales — Los Andes

Caja Rural de Ahorro y Crédito Los Andes — Portal Homebanking + Core Bancario

---

## 1. Historias de Usuario

### HU-01 — Registro de cliente
**Como** persona interesada en los servicios de Los Andes
**Quiero** crear una cuenta con mi correo y contraseña
**Para** acceder a la banca por internet

**Criterios de aceptación:**
- El sistema valida que el correo no esté registrado previamente
- La contraseña debe tener mínimo 6 caracteres
- Al registrarse, se crea automáticamente un rol `cliente` y una cuenta de ahorro en S/ 0.00 (trigger SQL)

---

### HU-02 — Inicio de sesión
**Como** usuario registrado
**Quiero** iniciar sesión con mi correo y contraseña
**Para** acceder a mi información financiera de forma segura

**Criterios de aceptación:**
- Las credenciales se validan contra Supabase Auth
- Se entrega un token JWT válido para las siguientes peticiones
- Mensajes de error claros si las credenciales son incorrectas

---

### HU-03 — Consultar cuenta de ahorros
**Como** cliente autenticado
**Quiero** ver el saldo de mi cuenta de ahorros
**Para** conocer mi situación financiera actual

**Criterios de aceptación:**
- Solo puedo ver MI PROPIA cuenta, no la de otros usuarios (RBAC)
- El backend rechaza con 403 si intento consultar el `userId` de otra persona

---

### HU-04 — Solicitar un crédito
**Como** cliente autenticado
**Quiero** solicitar un crédito indicando monto, plazo y tipo
**Para** financiar mis necesidades personales o de negocio

**Criterios de aceptación:**
- El sistema calcula automáticamente la cuota mensual (sistema de cuota fija)
- Se determina el nivel de aprobación según el monto (asesor / comité / jefe regional)
- La solicitud queda en estado `pendiente`

---

### HU-05 — Simular crédito antes de solicitar
**Como** cliente o visitante
**Quiero** usar la calculadora de 30 casos
**Para** estimar mi cuota antes de comprometerme con una solicitud real

**Criterios de aceptación:**
- Permite ingresar monto, plazo y TEA libremente
- Muestra cronograma de pagos completo (cuota, capital, interés, saldo)
- No requiere haber iniciado sesión

---

### HU-06 — Evaluar una solicitud (Asesor)
**Como** asesor de créditos
**Quiero** registrar el ingreso neto y gasto familiar del solicitante
**Para** calcular su RDS (ratio deuda/ingreso) y score de forma automática

**Criterios de aceptación:**
- RDS = cuota_mensual / (ingreso_neto − gasto_familiar) × 100
- Si RDS > 40% o la cuota excede el 40% del ingreso disponible → `rechazado_automatico`
- Si score ≥ 60 → `aprobado_scoring`; si no → `en_comite`
- Solo los roles `asesor` y `admin` pueden ejecutar esta acción (403 para los demás)

---

### HU-07 — Aprobar o rechazar un crédito en comité (Comité/Gerencia)
**Como** miembro del comité o gerencia
**Quiero** aprobar o rechazar una solicitud que llegó a comité
**Para** dar la decisión final antes del desembolso

**Criterios de aceptación:**
- Solo los roles `comite`, `gerencia` o `admin` pueden marcar una solicitud como `aprobado`
- Un `asesor` recibe 403 si intenta aprobar (solo puede rechazar)
- El rechazo puede incluir un motivo

---

### HU-08 — Desembolsar un crédito aprobado
**Como** personal autorizado (comité/gerencia/admin)
**Quiero** marcar un crédito aprobado como desembolsado
**Para** que el cliente vea el cambio reflejado en su Homebanking

**Criterios de aceptación:**
- Solo se puede desembolsar una solicitud en estado `aprobado`
- El estado final es `desembolsado`, visible en el Dashboard del cliente
- El monto se acredita automáticamente al **saldo** de la cuenta de ahorro del cliente
- Se registra un **movimiento** (`movimientos_cuenta`) visible en el Homebanking del cliente, cerrando el ciclo Core → Homebanking exigido por el Criterio 1
- Protegido contra doble-acreditación: si se intenta desembolsar dos veces, el saldo no se duplica

---

### HU-09 — Consultar bandeja de mora por bandas (R1)
**Como** personal de cobranza/riesgos/gerencia
**Quiero** ver los créditos en mora agrupados por banda (preventiva, temprana, tardía, judicial, castigo)
**Para** priorizar la gestión de cobranza

**Criterios de aceptación:**
- KPIs por banda con conteo de créditos
- Filtro interactivo por banda
- Un `cliente` no puede acceder a este módulo (pantalla de Acceso Restringido)

---

### HU-10 — Registrar gestión de cobranza (R2)
**Como** asesor o personal de riesgos
**Quiero** registrar una observación de gestión sobre un crédito en mora
**Para** dejar trazabilidad del seguimiento realizado

**Criterios de aceptación:**
- Cambia el `estado_gestion` a `gestionado`
- Guarda fecha de la última gestión y observaciones

---

### HU-11 — Derivar a cobranza judicial (R3)
**Como** personal de riesgos o administrador
**Quiero** derivar un crédito con más de 120 días de mora a judicial
**Para** iniciar el proceso de cobranza legal

**Criterios de aceptación:**
- El sistema valida que `dias_mora >= 121`; si no, rechaza la operación con mensaje claro
- Solo los roles `riesgos` y `admin` pueden ejecutar esta acción (403 para asesor/comité/cliente)
- Requiere confirmación explícita en el frontend antes de ejecutar

---

### HU-12 — Castigar una cuenta (R3)
**Como** personal de riesgos o administrador
**Quiero** castigar una cuenta con más de 180 días de mora
**Para** darla de baja contablemente como pérdida

**Criterios de aceptación:**
- El sistema valida que `dias_mora > 180`; si no, rechaza la operación
- Solo los roles `riesgos` y `admin` pueden ejecutar esta acción
- Acción irreversible, requiere confirmación explícita

---

## 2. Requisitos Funcionales (RF)

| ID | Requisito | Módulo |
|---|---|---|
| RF-01 | El sistema debe permitir registro e inicio de sesión con Supabase Auth (JWT) | Auth |
| RF-02 | El sistema debe asignar automáticamente rol `cliente` y cuenta de ahorro al registrarse | Auth / Ahorro |
| RF-03 | El sistema debe calcular la cuota mensual con sistema de cuota fija (amortización francesa) | Crédito |
| RF-04 | El sistema debe calcular el RDS y Score a partir de ingreso neto y gasto familiar | Crédito |
| RF-05 | El sistema debe enrutar la aprobación según el monto solicitado (asesor / comité / jefe regional) | Crédito |
| RF-06 | El sistema debe restringir la aprobación final a roles `comite`, `gerencia` o `admin` | RBAC |
| RF-07 | El sistema debe restringir la evaluación de RDS/Score a roles `asesor` o `admin` | RBAC |
| RF-08 | El sistema debe impedir que un cliente consulte cuentas o solicitudes de otro usuario (403) | RBAC |
| RF-09 | El sistema debe clasificar créditos en mora por banda según días de atraso | Mora (R1) |
| RF-10 | El sistema debe permitir registrar observaciones de gestión de cobranza | Mora (R2) |
| RF-11 | El sistema debe validar el umbral de 121 días antes de derivar a judicial | Mora (R3) |
| RF-12 | El sistema debe validar el umbral de 180 días antes de castigar una cuenta | Mora (R3) |
| RF-13 | El sistema debe restringir judicial/castigo a roles `riesgos` o `admin` | RBAC |
| RF-14 | El sistema debe ofrecer una calculadora de crédito accesible sin necesidad de login | Calculadora |
| RF-15 | El frontend debe bloquear visualmente el acceso a módulos restringidos según el rol del usuario | RBAC (UX) |

---

## 3. Matriz de Roles y Permisos (RBAC)

| Acción | Cliente | Asesor | Comité | Riesgos | Gerencia | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Ver su propia cuenta/solicitudes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Solicitar crédito (propio) | ✅ | ✅ | — | — | — | ✅ |
| Ver todas las solicitudes (Panel Core) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Evaluar RDS / Score | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Aprobar / Rechazar crédito | ❌ | ❌* | ✅ | ❌ | ✅ | ✅ |
| Desembolsar | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Consultar bandeja de mora (R1) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Registrar gestión de cobranza (R2) | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Derivar a judicial (R3) | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Castigar cuenta (R3) | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

\* El asesor puede *rechazar* una solicitud pero no *aprobarla* — la aprobación final requiere comité, gerencia o admin.

---

## 4. Cómo verificar el RBAC en la demo

1. Crea usuarios con roles distintos siguiendo `docs/sql/asignar_roles.sql`
2. Inicia sesión con `cliente@losandes.com` → intenta entrar a `/core` o `/mora` → debe mostrar "Acceso restringido"
3. Inicia sesión con `asesor@losandes.com` → entra a `/core`, puede evaluar pero el botón "Aprobar" aparece bloqueado (🔒)
4. Inicia sesión con `comite@losandes.com` → puede aprobar/rechazar, pero no ve botones de Judicial/Castigo en `/mora`
5. Inicia sesión con `riesgos@losandes.com` → en `/mora` sí ve los botones "⚖️ Judicial" y "🚫 Castigar" (solo si el crédito cumple los días mínimos)

---

## 5. Cómo demostrar el flujo end-to-end completo (Criterio 1)

Esta es la secuencia que demuestra que Core y Homebanking están realmente integrados:

1. **Cliente** inicia sesión → Dashboard → "+ Nueva Solicitud" → pide un crédito de S/ 5,000
2. **Asesor** inicia sesión → Panel Core → pestaña "Bandeja de Solicitudes" → "Evaluar" → ingresa ingreso/gasto → el sistema calcula RDS y Score automáticamente
3. **Comité** inicia sesión → ve la solicitud en "Propuesta y Comité" → "✓ Aprobar"
4. **Comité/Gerencia** → pestaña "Aprobación y Desembolso" → "💰 Desembolsar"
5. **Cliente** vuelve a su Dashboard → el saldo de su Cuenta de Ahorros aumentó en S/ 5,000 → la sección "Movimientos de Cuenta" muestra el desembolso con fecha y saldo resultante

Este recorrido (5 pasos, 3 roles distintos, mismo dato cruzando todo el sistema) es la evidencia que pide la rúbrica para el nivel "Excelente" del Criterio 1.

---

## 6. Datos de demostración (Criterio 5)

Para que el profesor vea datos reales al revisar el Panel Core y la Bandeja de Mora (no pantallas vacías), ejecuta `docs/sql/datos_semilla.sql`:

- Genera 15 solicitudes con **2 tipos de producto** (`personal` TEA 40.92%, `empresarial` TEA 43.92%)
- Calibra la cartera en mora a **~13%** de los créditos desembolsados (proporción real de una entidad microfinanciera), distribuidos en distintas bandas
- Antes de ejecutarlo, reemplaza `'TU_EMAIL_AQUI'` por el correo de un usuario que ya exista en tu Supabase
- Al final del script, una consulta de verificación muestra el ratio de mora resultante
