# 🎟️ GUÍA COMPLETA DE SUPABASE - PROYECTO EVENTIX

## 📋 TABLA DE CONTENIDOS
1. [Crear Proyecto en Supabase](#crear-proyecto-en-supabase)
2. [Ejecutar Script SQL](#ejecutar-script-sql)
3. [Configurar Variables de Entorno](#configurar-variables-de-entorno)
4. [Verificar Conexión](#verificar-conexión)
5. [Estructura de Datos](#estructura-de-datos)
6. [Usuarios de Prueba](#usuarios-de-prueba)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 CREAR PROYECTO EN SUPABASE

### Paso 1: Crear una Cuenta
1. Visita [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Regístrate con tu email o GitHub

### Paso 2: Crear un Nuevo Proyecto
1. En el dashboard, haz clic en **"New Project"**
2. Completa la información:
   - **Name**: `eventix` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña fuerte (guárdala en lugar seguro)
   - **Region**: Selecciona la región más cercana a tu ubicación
   - **Pricing Plan**: Selecciona **Free** para desarrollo

3. Espera a que se cree el proyecto (2-3 minutos)

### Paso 3: Obtener las Credenciales
Una vez creado el proyecto:
1. Ve a **Settings → API**
2. Copia los siguientes valores:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

Guarda estos valores en un lugar seguro.

---

## 📝 EJECUTAR SCRIPT SQL

### Paso 1: Abrir SQL Editor
1. En el panel de Supabase, ve a **SQL Editor**
2. Haz clic en **"New Query"**

### Paso 2: Copiar y Ejecutar Script
1. Abre el archivo `SUPABASE_SETUP.sql` en la raíz del proyecto
2. Copia **TODO** el contenido
3. Pega en el editor SQL de Supabase
4. Haz clic en **"Run"** (botón play)

Espera a que se complete la ejecución. Deberías ver un mensaje de éxito.

**⚠️ IMPORTANTE**: El script crea:
- Tabla `admins` para administradores
- Tabla `eventos` para eventos
- Tabla `tipos_boletas` para tipos de tickets
- Tabla `usuarios_app` para usuarios de la app
- Tabla `compras` para compras
- Tabla `boletos` para tickets individuales
- Tabla `usuarios` para users en admin panel
- Tabla `ventas` para ventas del admin panel
- Vista `reportes_por_evento` para reportes

---

## 🔑 CONFIGURAR VARIABLES DE ENTORNO

### Paso 1: Crear Archivo .env
En la raíz del proyecto, crea un archivo llamado `.env`:

```bash
# Puerto
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_jwt_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=1h

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!

# Supabase
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 2: Reemplazar Valores
Reemplaza los valores con los obtenidos de Supabase:
- `SUPABASE_URL`: URL de tu proyecto
- `SUPABASE_ANON_KEY`: Anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key

### ⚠️ IMPORTANTE
- **NUNCA** subes el archivo `.env` a GitHub
- El archivo `.env` ya está en `.gitignore`
- Cada desarrollador debe tener su propio `.env`

---

## ✅ VERIFICAR CONEXIÓN

### Opción 1: Probar en Supabase Console
1. Ve a **SQL Editor** en Supabase
2. Ejecuta esta consulta:
```sql
SELECT * FROM eventos LIMIT 1;
```
Si no hay error, la BD está lista.

### Opción 2: Probar la Aplicación
```bash
npm run dev
```

Deberías ver:
```
[nodemon] starting `node src/server.js`
Database is ready with Supabase.
Server is running on http://localhost:3000
```

### Opción 3: Hacer una Petición HTTP
```bash
curl http://localhost:3000/api/eventos
```

Si ves una respuesta JSON (puede estar vacía), ¡todo está funcionando!

---

## 📊 ESTRUCTURA DE DATOS

### Tabla: `admins`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | TEXT | Email del admin |
| password_hash | TEXT | Hash de la contraseña |
| role | TEXT | Rol (admin) |
| creado_en | TIMESTAMP | Fecha de creación |
| actualizado_en | TIMESTAMP | Última actualización |

### Tabla: `eventos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | TEXT | Nombre del evento |
| fecha | TEXT | Fecha del evento |
| lugar | TEXT | Ubicación |
| descripcion | TEXT | Descripción |
| imagen | TEXT | URL de imagen |
| estado | TEXT | activo/finalizado |
| creado_en | TIMESTAMP | Fecha de creación |

### Tabla: `tipos_boletas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| evento_id | UUID | Referencia a evento |
| tipo | TEXT | General/VIP/Preferencial |
| precio | DECIMAL | Precio de la boleta |
| cantidad_disponible | INTEGER | Stock disponible |
| creado_en | TIMESTAMP | Fecha de creación |

### Tabla: `usuarios_app`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | TEXT | Nombre del usuario |
| email | TEXT | Email (único) |
| password_hash | TEXT | Hash de la contraseña |
| foto | TEXT | URL de foto |
| telefono | TEXT | Teléfono |
| creado_en | TIMESTAMP | Fecha de creación |

### Tabla: `compras`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| usuario_app_id | UUID | Referencia a usuario |
| tipo_boleta_id | UUID | Referencia a tipo de boleta |
| cantidad | INTEGER | Cantidad de boletas |
| total | DECIMAL | Total de la compra |
| estado | TEXT | pendiente/completada/cancelada |
| fecha_compra | TIMESTAMP | Fecha de compra |

### Tabla: `boletos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| compra_id | UUID | Referencia a compra |
| codigo_unico | TEXT | Código único del boleto |
| tipo_boleta_id | UUID | Referencia a tipo |
| evento_id | UUID | Referencia a evento |
| usuario_app_id | UUID | Propietario del boleto |
| estado | TEXT | disponible/usado/cancelado |
| fecha_validacion | TIMESTAMP | Fecha de validación |
| creado_en | TIMESTAMP | Fecha de creación |

---

## 👤 USUARIOS DE PRUEBA

### Admin
**Email**: `admin@example.com`  
**Contraseña**: `Admin12345!`

> El admin se crea automáticamente al iniciar el servidor si no existe.

### Crear Usuarios de Prueba (Manual)

Para crear usuarios de prueba, puedes usar Supabase Auth:

1. Ve a **Authentication → Users** en Supabase
2. Haz clic en **"Invite User"**
3. Ingresa email
4. Supabase enviará una invitación

O crea usuarios directamente en la tabla `usuarios_app`:

```sql
INSERT INTO usuarios_app (nombre, email, password_hash, telefono)
VALUES 
  ('Juan Pérez', 'juan@example.com', '$2b$12$...', '809-555-0001'),
  ('María García', 'maria@example.com', '$2b$12$...', '809-555-0002');
```

> Para generar un hash de contraseña, usa bcrypt desde Node.js

---

## 🔍 TROUBLESHOOTING

### Error: "Supabase credentials not configured"
**Solución**: Verifica que las variables de entorno están correctas en `.env`:
```bash
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Error: "PGRST116"
**Significa**: No se encontraron resultados (es un error normal para queries que devuelven un solo resultado).

### Error: "Error: Unauthorized"
**Solución**: Verifica que `SUPABASE_ANON_KEY` sea correcta.

### Error: "Relation does not exist"
**Solución**: Ejecuta el script SQL completo de nuevo en `SUPABASE_SETUP.sql`.

### La BD está muy lenta
**Solución**: 
- Usa índices (ya están creados en el script)
- Limita los resultados con `.limit()`
- Usa `.select('campo1, campo2')` en lugar de `*`

---

## 📚 COMANDOS ÚTILES

### Iniciar el servidor
```bash
npm run dev
```

### Instalar dependencias
```bash
npm install
```

### Ver logs
```bash
tail -f /var/log/app.log
```

### Conectar a BD desde CLI
```bash
psql -h db.ejemplo.supabase.co -U postgres
```

---

## 🔐 SEGURIDAD

### En Producción
1. Nunca uses contraseña temporal
2. Usa variables de entorno para todo
3. Habilita Row Level Security (RLS)
4. Usa Service Role Key solo en el servidor
5. Cambia las contraseñas por defecto

### Row Level Security (RLS)
Para habilitar RLS en Supabase:

1. Ve a **Authentication → Policies**
2. Selecciona tabla
3. Haz clic en **"Enable RLS"**
4. Crea políticas según necesites

Ejemplo de política:
```sql
CREATE POLICY "Users can view own purchases"
ON compras
FOR SELECT
USING (auth.uid() = usuario_app_id);
```

---

## 📞 SOPORTE

- **Documentación Supabase**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.io
- **GitHub Issues**: https://github.com/supabase/supabase/issues

---

**Fecha de actualización**: Mayo 2026  
**Versión**: 1.0.0
