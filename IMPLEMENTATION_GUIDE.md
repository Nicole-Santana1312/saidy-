# Eventix - Sistema de Venta de Boletas de Eventos

## Descripción General

Eventix es un sistema completo de venta de boletas para eventos, diseñado con una arquitectura separada entre:
- **Panel Administrativo**: Gestión de eventos, tipos de boletas, ventas y validación de boletos
- **Portal de Usuario**: Visualización de eventos, compra de boletas y gestión de entradas

## Requisitos Previos

- Node.js 14+ 
- npm o yarn
- SQLite3 (incluido en el proyecto)

## Instalación

```bash
# Clonar el repositorio
git clone [URL del repositorio]
cd saidy

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Iniciar servidor en producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
saidy/
├── src/
│   ├── app.js                 # Configuración principal de Express
│   ├── server.js              # Punto de entrada del servidor
│   ├── config/
│   │   ├── adminStore.js      # Gestión de admin
│   │   ├── database.js        # Inicialización de BD SQLite
│   │   └── env.js             # Configuración de variables
│   ├── controllers/           # Lógica de negocio
│   ├── models/                # Acceso a base de datos
│   ├── routes/                # Definición de rutas
│   ├── middlewares/           # Middlewares de Express
│   ├── validators/            # Validación de datos
│   └── utils/                 # Utilidades (JWT, etc)
├── public/                    # Assets y JavaScript del cliente
├── data/                      # Base de datos SQLite (creada al iniciar)
└── package.json

```

## Funcionalidades Principales

### 🔐 Autenticación

#### Admin
- Email: admin@example.com
- Contraseña: (definida en variables de entorno)
- Login: `/login`

#### Usuario Normal
- Registro: `/user/register`
- Login: `/user/login`
- Logout: Botón en interfaz

### 📊 Panel Administrativo (`/admin/dashboard`)

El administrador puede:

#### Gestión de Eventos
- **Crear** eventos (nombre, fecha, lugar, descripción, imagen)
- **Editar** información del evento
- **Eliminar** eventos
- **Ver** lista de eventos

Ruta: `/admin/eventos`

#### Gestión de Boletas
- **Crear** tipos de boletas (General, VIP, Preferencial)
- **Definir** precio y cantidad disponible
- **Editar** tipos de boletas
- **Eliminar** tipos de boletas

Ruta: `/admin/boletas`

#### Gestión de Ventas
- **Ver** todas las ventas realizadas
- **Filtrar** ventas por evento
- **Consultar** detalles de cada compra (usuario, cantidad, tipo, total)

Ruta: `/admin/ventas`

#### Gestión de Usuarios
- **Ver** usuarios registrados
- **Buscar** usuarios
- **Eliminar** usuarios (opcional)

Ruta: `/admin/usuarios`

#### Validación de Boletos (Check-in)
- **Escanear** código de boleto
- **Marcar** como utilizado
- **Validar** estado del boleto
- **Evitar** reutilización de boletos

Ruta: `/admin/check-in`

#### Reportes
- **Ver** ingresos por evento
- **Consultar** cantidad de boletas vendidas
- **Generar** reportes del sistema
- **Gráficas** de ingresos

Ruta: `/admin/reportes`

### 👥 Portal de Usuario

#### Autenticación
- Registro con email, nombre, contraseña y teléfono (opcional)
- Login con email y contraseña
- Logout seguro

#### Perfil de Usuario (`/user/perfil`)
- Ver información personal
- Editar nombre, email, teléfono

#### Visualización de Eventos (`/user/eventos`)
- Ver catálogo de eventos disponibles
- Consultar:
  - Nombre del evento
  - Fecha y lugar
  - Descripción
  - Imagen
  - Tipos y precios de boletas disponibles

#### Compra de Boletas
- Seleccionar evento
- Elegir tipo de boleta (General, VIP, Preferencial)
- Seleccionar cantidad
- Visualizar precio total
- Confirmar compra

#### Gestión de Compras (`/user/dashboard`)
- Ver historial de compras
- Consultar detalles de cada compra:
  - Evento
  - Tipo de boleta
  - Cantidad
  - Precio total
  - Fecha de compra
  - Estado

#### Visualización de Boletos (`/user/boletos`)
- Ver boletas adquiridas
- Visualizar código único de boleto
- Ver estado (disponible, usado, cancelado)
- Descargar/mostrar boleto digital
- Ver información del evento

### 🔗 API REST

#### Endpoints Protegidos para Admin

**Eventos**
- `GET /api/eventos` - Listar eventos
- `GET /api/eventos/:id` - Obtener evento
- `POST /api/eventos` - Crear evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

**Tipos de Boletas**
- `GET /api/eventos/:eventoId/boletas` - Listar boletas de evento
- `GET /api/boletas/:id` - Obtener boleta
- `POST /api/boletas` - Crear boleta
- `PUT /api/boletas/:id` - Actualizar boleta
- `DELETE /api/boletas/:id` - Eliminar boleta

**Ventas**
- `GET /api/ventas` - Listar ventas (con filtro por evento)
- `POST /api/ventas` - Registrar venta

**Usuarios**
- `GET /api/usuarios` - Listar usuarios (con búsqueda)
- `GET /api/usuarios/:id` - Obtener usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

**Reportes**
- `GET /api/reportes` - Obtener reportes (ingresos, boletas vendidas, etc)

#### Endpoints Públicos

**Eventos Públicos**
- `GET /api/eventos-publicos` - Listar todos los eventos (sin autenticación)
- `GET /api/eventos-publicos/:eventoId/tipos-boletas` - Obtener tipos de boletas de un evento

#### Endpoints Protegidos para Usuario

**Perfil**
- `GET /api/user/perfil` - Obtener datos de usuario
- `PUT /api/user/perfil` - Actualizar perfil

**Compras**
- `GET /api/user/compras` - Obtener historial de compras
- `POST /api/user/compras` - Realizar compra

**Boletos**
- `GET /api/user/boletos` - Obtener boletos del usuario
- `GET /api/boletos/:codigo_unico` - Obtener información de boleto

**Check-in**
- `POST /api/check-in` - Validar boleto por código

## Tecnologías Utilizadas

- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite3
- **Autenticación**: JWT + Cookies
- **Seguridad**: bcrypt para contraseñas, Helmet para headers HTTP
- **Validación**: express-validator
- **Frontend**: HTML + CSS + JavaScript vanilla
- **Logging**: Morgan

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=tu_contraseña_segura
```

## Estructura de Base de Datos

### Tablas Principales

**eventos**
- id, nombre, fecha, lugar, descripcion, imagen, estado, creado_en, actualizado_en

**tipos_boletas**
- id, evento_id, tipo (General/VIP/Preferencial), precio, cantidad_disponible, creado_en, actualizado_en

**usuarios_app**
- id, nombre, email, password_hash, foto, telefono, creado_en, actualizado_en

**compras**
- id, usuario_app_id, tipo_boleta_id, cantidad, total, fecha_compra, estado

**boletos**
- id, compra_id, codigo_unico, tipo_boleta_id, evento_id, usuario_app_id, estado, fecha_validacion, creado_en

**ventas** (legada para estadísticas)
- id, usuario, tipo_boleta_id, cantidad, total, fecha_compra

**usuarios** (legada para consultas)
- id, nombre, email, telefono, creado_en

## Flujos Principales

### Flujo de Usuario Final

1. Acceder a `/home`
2. Hacer clic en "Comprar Boletas"
3. Si es nuevo usuario:
   - Acceder a `/user/register`
   - Llenar formulario
   - Confirmar cuenta
4. Login en `/user/login`
5. Navegar a `/user/eventos`
6. Seleccionar evento y tipo de boleta
7. Confirmar compra
8. Ver boletos en `/user/boletos`

### Flujo de Administrador

1. Acceder a `/login`
2. Ingresar credenciales de admin
3. Acceder a `/admin/dashboard`
4. Crear eventos y tipos de boletas
5. Ver ventas y reportes
6. Para validar boletos:
   - Acceder a `/admin/check-in`
   - Escanear/ingresar código del boleto
   - Sistema marca como validado

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Validación en servidor de todos los datos
- ✅ HTTPS recomendado en producción (Helmet configurado)
- ✅ Cookies httpOnly para tokens
- ✅ Protección contra CSRF
- ✅ Límite de intentos de login
- ✅ Escape de HTML en salidas
- ✅ Validación de datos con express-validator

## Próximas Mejoras Sugeridas

- [ ] QR real para boletos (usar librería qrcode.js)
- [ ] Email de confirmación de compra
- [ ] Notificaciones push
- [ ] Sistema de reembolsos
- [ ] Descuento de cantidad disponible al comprar
- [ ] Carrito de compra
- [ ] Múltiples métodos de pago
- [ ] Dashboard mejorado con gráficas avanzadas
- [ ] Soporte multidioma
- [ ] Mobile app nativa

## Autor

Sistema desarrollado para [Nombre del cliente/Proyecto]

## Licencia

ISC

## Contacto

Para soporte o preguntas, contactar a: [email de soporte]
