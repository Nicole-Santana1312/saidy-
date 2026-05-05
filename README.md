# Eventix - Sistema de autenticacion de administrador

Backend con Node.js y Express que incluye login con email y contrasena, bcrypt, JWT, validacion, manejo de errores y rutas protegidas solo para administrador.

## Instalacion

```bash
npm install
```

## Variables de entorno

Copia `.env.example` como `.env` y ajusta los valores:

```bash
PORT=3000
JWT_SECRET=coloca_aqui_un_secreto_largo_y_seguro
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!
```

## Ejecutar

```bash
npm run dev
```

Luego abre:

```text
http://localhost:3000/login
```

Credenciales por defecto:

```text
Email: admin@example.com
Contrasena: Admin12345!
```

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
- Limite de intentos de inicio de sesion por IP.
- Limite de tamano para formularios y JSON.
- Manejo centralizado de errores con respuestas seguras.

## Reportes

El modulo de reportes usa consultas SQL agrupadas para mostrar ingresos por evento, cantidad de boletas vendidas y total de ventas. Incluye una grafica simple con JavaScript.

```text
http://localhost:3000/admin/reportes
```
