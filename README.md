# Eventix - Sistema Completo de Gestión de Eventos y Boletas

🎟️ Sistema backend con Node.js y Express para venta de boletas, eventos, y gestión administrativa. Con autenticación segura, panel de admin y app de usuarios.

## 🚀 INICIO RÁPIDO

### 1️⃣ Clonar e Instalar
```bash
git clone [tu-repo]
cd saidy-
npm install
```

### 2️⃣ Configurar Supabase (IMPORTANTE)
⚠️ **ANTES DE INICIAR, NECESITAS SUPABASE**

[Ver guía completa en SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)

Resumen rápido:
1. Crea cuenta en https://supabase.com
2. Crea nuevo proyecto
3. Copia el script `SUPABASE_SETUP.sql` en SQL Editor de Supabase
4. Obtén las credenciales de Settings → API

### 3️⃣ Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` y reemplaza:
```ini
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4️⃣ Ejecutar Servidor
```bash
npm run dev
```

Abre: http://localhost:3000

---

## 🎯 MÓDULOS DEL SISTEMA

### 👨‍💼 PANEL DE ADMINISTRADOR

**Acceso**: http://localhost:3000/login
**Email**: admin@example.com
**Contraseña**: Admin123456!

## Rutas principales

- `GET /login`: formulario de inicio de sesion.
- `POST /auth/login`: valida credenciales, crea JWT y redirige a `/admin/dashboard`.
- `POST /auth/logout`: elimina la cookie de sesion.
- `GET /admin/dashboard`: ruta protegida por middleware de administrador.
- `GET /admin/eventos`: formulario frontend para crear, editar y eliminar eventos.
- `GET /api/eventos`: lista eventos guardados en SQLite.
- `POST /api/eventos`: crea un evento.
- `GET /api/eventos/:id`: obtiene un evento por id.
- `PUT /api/eventos/:id`: actualiza un evento.
- `DELETE /api/eventos/:id`: elimina un evento.
- `GET /admin/boletas`: formulario frontend para gestionar tipos de boletas.
- `GET /api/eventos/:eventoId/boletas`: lista tipos de boletas de un evento.
- `POST /api/boletas`: crea un tipo de boleta.
- `GET /api/boletas/:id`: obtiene un tipo de boleta.
- `PUT /api/boletas/:id`: actualiza un tipo de boleta.
- `DELETE /api/boletas/:id`: elimina un tipo de boleta.
- `GET /admin/ventas`: frontend basico para visualizar ventas en tabla.
- `GET /api/ventas`: lista ventas con detalles de usuario, evento, tipo y cantidad.
- `GET /api/ventas?evento_id=1`: filtra ventas por evento.
- `POST /api/ventas`: registra una venta de prueba.
- `GET /admin/usuarios`: interfaz simple para usuarios registrados.
- `GET /api/usuarios`: lista usuarios registrados.
- `GET /api/usuarios?q=ana`: busca usuarios por nombre o email.
- `GET /api/usuarios/:id`: muestra detalles de un usuario.
- `DELETE /api/usuarios/:id`: elimina un usuario.
- `GET /admin/reportes`: interfaz de reportes para administrador.
- `GET /api/reportes`: ingresos por evento y boletas vendidas.

## CRUD de eventos

Campos requeridos:

```text
nombre, fecha, lugar, descripcion, imagen
```

La base de datos SQL se crea automaticamente en `data/boletas.sqlite` al iniciar el servidor. Para administrar eventos, inicia sesion y abre:

```text
http://localhost:3000/admin/eventos
```

## Tipos de boletas

Tipos permitidos:

```text
General, VIP, Preferencial
```

Cada tipo de boleta se relaciona con un evento, tiene precio y cantidad disponible. Para administrarlos, inicia sesion y abre:

```text
http://localhost:3000/admin/boletas
```

## Ventas

Las ventas se guardan en la tabla SQL `ventas` y se relacionan con `tipos_boletas`. La lista de ventas usa consultas SQL con joins para mostrar usuario, evento, tipo de boleta, cantidad y total.

```text
http://localhost:3000/admin/ventas
```

## Usuarios

El modulo de usuarios usa la tabla SQL `usuarios` y permite listar, buscar por nombre o email, ver detalles y eliminar registros.

```text
http://localhost:3000/admin/usuarios
```

## Seguridad

El sistema incluye:

- Middleware `requireAdmin` para proteger rutas administrativas con JWT.
- Validacion de formularios y APIs con `express-validator`.
- Contrasenas de administrador encriptadas con `bcrypt`.
- Cookies `HttpOnly` y `SameSite=Strict` para la sesion.
- Limite de intentos de inicio de sesion por IP usando `express-rate-limit`.
- Limite de tamano para formularios y JSON.
- Manejo centralizado de errores con respuestas seguras.

## Entrega profesional

El proyecto incluye estructura por responsabilidades:

```text
src/controllers
src/routes
src/middlewares
src/services
src/models
src/validators
```

Tambien incluye:

- `.env.example` y `.env` local para variables seguras.
- `database/schema.sql` con relaciones SQL y claves foraneas.
- Subida real de imagenes con `multer` en `public/uploads/events`.
- Coleccion Postman en `postman/Eventix.postman_collection.json`.
- Pruebas Playwright en `tests/e2e`.
- Script Lighthouse para generar `reports/lighthouse/login.html`.
- Reportes con Chart.js servido localmente desde `node_modules`.

Comandos utiles:

```bash
npm.cmd run dev
npm.cmd test
npm.cmd run test:e2e
npm.cmd run lighthouse
```

## Reportes

El modulo de reportes usa consultas SQL agrupadas para mostrar ingresos por evento, cantidad de boletas vendidas y total de ventas. Incluye una grafica simple con JavaScript.

```text
http://localhost:3000/admin/reportes
```
