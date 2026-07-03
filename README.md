# 🏦 Portal Web - Los Andes (Caja Rural de Ahorro y Crédito)

Portal de banca por internet para **Caja Rural de Ahorro y Crédito Los Andes S.A.**
Stack: Node.js + Express (backend) · React + Vite (frontend) · Supabase (auth + base de datos)

---

## ⚠️ PASO OBLIGATORIO: Crear las tablas en Supabase

**Si no haces este paso, el login/registro fallarán o el dashboard se quedará en blanco.**

1. Ve a [https://app.supabase.com](https://app.supabase.com) → tu proyecto → **SQL Editor** → **New query**
2. Abre el archivo `docs/sql/schema.sql` de este proyecto, copia TODO su contenido y pégalo ahí
3. Dale **Run**

Esto crea 4 tablas (`roles_usuario`, `solicitudes_prestamo`, `cuentas_ahorro`, `mora_creditos`) y un **trigger automático**: cada vez que alguien se registra en la web, se le crea su rol de cliente y su cuenta de ahorro en S/ 0.00 automáticamente. Sin esto, un usuario nuevo no podrá ver su dashboard correctamente.

---

## ⚙️ Configuración de credenciales

1. En tu proyecto Supabase → **Settings → API**, copia:
   - `Project URL` → `SUPABASE_URL`
   - `anon / public key` → `SUPABASE_KEY`
   - `service_role key` → `SUPABASE_SERVICE_KEY`
2. Pega esos valores en el archivo `.env` (raíz del proyecto)

### Sobre la confirmación de email
Por defecto, Supabase pide que el usuario **confirme su correo** antes de poder iniciar sesión. Para un proyecto de pruebas/curso, puedes desactivarlo así:

- Supabase → **Authentication → Providers → Email** → desactiva **"Confirm email"**

Con esto desactivado, el registro deja al usuario con sesión iniciada automáticamente. Si lo dejas activado, tendrá que confirmar su correo (le llega un email) antes de poder loguearse.

---

## 🚀 Iniciar el proyecto

### Backend (puerto 3000)
```bash
npm install
node app.js
```

### Frontend (puerto 5173)
```bash
cd frontend
npm install
npm run dev
```

Abre: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Cómo probar el login

1. **Opción A — Registrarte desde la web:** clic en "Banca por Internet" → pestaña "Registrarme" → completa el formulario. Si la confirmación de email está desactivada, entrarás directo al dashboard.
2. **Opción B — Crear usuario manual en Supabase:** Authentication → Users → "Add user" → marca **"Auto Confirm User"** → luego inicia sesión desde la web con ese email/contraseña.

---

## 🔐 Roles y permisos (RBAC) — para la rúbrica del Criterio 3

El sistema controla el acceso por rol: `cliente`, `asesor`, `comite`, `riesgos`, `gerencia`, `admin`. Por defecto, todo usuario nuevo es `cliente`.

**Para demostrar el RBAC en tu sustentación:**

1. Crea usuarios de prueba en Supabase → Authentication → Users → "Add user" (marca "Auto Confirm User"):
   - `asesor@losandes.com`
   - `comite@losandes.com`
   - `riesgos@losandes.com`
   - `gerencia@losandes.com`
2. Ve al SQL Editor → ejecuta `docs/sql/asignar_roles.sql` (ajusta los emails si usaste otros) para asignarles su rol correspondiente
3. Inicia sesión con cada uno y observa cómo cambia lo que puede hacer:
   - **Cliente**: no puede entrar a `/core` ni `/mora` (ve "Acceso restringido")
   - **Asesor**: entra al Core, puede evaluar (RDS/Score) pero el botón "Aprobar" aparece bloqueado 🔒
   - **Comité/Gerencia**: puede aprobar/rechazar y desembolsar
   - **Riesgos**: en `/mora` ve los botones exclusivos "⚖️ Judicial" y "🚫 Castigar" (solo si el crédito cumple los días mínimos: 121+ para judicial, 180+ para castigo)

Más detalle en `docs/HISTORIAS_USUARIO_Y_RF.md` (Historias de Usuario, Requisitos Funcionales y matriz de roles completa).

---

## 📊 Documentación UML

En `docs/uml/` están los 4 diagramas actualizados para Los Andes (fuente `.puml` + imágenes `.png` en `docs/uml/imagenes/`):
- `01_casos_de_uso` — actores (Cliente, Asesor, Comité, Riesgos, Gerencia) y sus casos de uso
- `02_secuencia_credito` — flujo completo: solicitud → evaluación → aprobación → desembolso
- `03_componentes` — arquitectura en capas (routes → middleware → controllers → services → Supabase)
- `04_modelo_datos` — entidad-relación de las 5 tablas del sistema

---



| Problema | Causa probable | Solución |
|---|---|---|
| "Email o contraseña incorrectos" al loguearte con un usuario que sí existe | El usuario no confirmó su correo | Ve a Supabase → Authentication → Users → edita el usuario → "Confirm email" manualmente, o desactiva la confirmación de email en Providers |
| El dashboard se queda cargando o en blanco tras loguear | Las tablas SQL no fueron creadas | Ejecuta `docs/sql/schema.sql` en el SQL Editor de Supabase |
| Error "fetch failed" / pantalla en blanco | El backend no está corriendo | Verifica que `node app.js` esté corriendo en el puerto 3000 sin errores en consola |
| Error de CORS en la consola del navegador | El backend no está accesible en `localhost:3000` | Revisa que no haya otro proceso usando el puerto 3000 |

---

## 📁 Estructura
```
/
├── app.js                          # Servidor Express
├── .env                            # Variables de entorno (Supabase)
├── docs/
│   ├── sql/schema.sql               # ⚠️ Ejecutar primero en Supabase
│   ├── sql/asignar_roles.sql        # Asignar roles a usuarios de prueba (RBAC)
│   ├── HISTORIAS_USUARIO_Y_RF.md    # HU, RF y matriz de roles (Criterio 5)
│   └── uml/                         # Diagramas UML (Criterio 5)
├── src/
│   ├── config/supabase.js          # Cliente Supabase
│   ├── controllers/                # Lógica HTTP
│   ├── services/                   # Lógica de negocio
│   ├── repositories/                # Acceso a Supabase
│   ├── middleware/                  # Verificación de token + RBAC (soloRol)
│   └── routes/                      # Rutas API con restricciones por rol
└── frontend/
    └── src/
        ├── components/              # Navbar, Hero, LoginModal, ProductsSection
        └── pages/                   # Home, Dashboard, Mora, Calculadora, Core, AccesoDenegado
```
