# ✅ CHECKLIST - CONFIGURACIÓN SUPABASE (PASO A PASO)

Sigue estos pasos **exactamente en orden**.

---

## 📋 CHECKLIST INICIAL (VERIFICAR QUE TENGAS)

- [ ] Node.js v18+ instalado
- [ ] npm instalado
- [ ] Navegador web
- [ ] Email para Supabase

---

## 🔧 PARTE 1: SUPABASE (5 MINUTOS)

### ✓ Paso 1: Crear Cuenta en Supabase
- [ ] Ir a https://supabase.com
- [ ] Hacer clic en "Sign Up"
- [ ] Registrarse con email o GitHub
- [ ] Confirmar email (si es necesario)

### ✓ Paso 2: Crear Proyecto
- [ ] En dashboard, clic "New Project"
- [ ] **Name**: eventix
- [ ] **Database Password**: (Crear contraseña fuerte, anotar en lugar seguro)
- [ ] **Region**: Seleccionar tu región
- [ ] **Pricing**: Seleccionar **FREE**
- [ ] Clic "Create New Project"
- [ ] **ESPERAR 2-3 MINUTOS** hasta que diga "Your project is ready"

### ✓ Paso 3: Obtener Credenciales
- [ ] En tu proyecto Supabase, ir a **Settings** (abajo a la izquierda)
- [ ] Clic **API**
- [ ] **Copiar** "Project URL" → Guardar en notepad/documento temporal
- [ ] **Copiar** "anon public key" → Guardar
- [ ] **Copiar** "service_role key" → Guardar (es sensible, cuidado)
- [ ] **Verificar** que las 3 están copiadas

### ✓ Paso 4: Ejecutar Script SQL
- [ ] En tu proyecto Supabase, ir a **SQL Editor** (menú izquierdo)
- [ ] Clic **"New Query"**
- [ ] En tu computadora, abrir `SUPABASE_SETUP.sql` (en la raíz del proyecto)
- [ ] **Seleccionar TODO** el contenido (Ctrl+A)
- [ ] **Copiar** (Ctrl+C)
- [ ] En SQL Editor, **Pegar** (Ctrl+V)
- [ ] Clic **"Run"** (botón play, arriba a la derecha)
- [ ] **ESPERAR** a que termine (dice "Success")
- [ ] Si hay error, copiar el mensaje y buscar en SUPABASE_SETUP_GUIDE.md

---

## 🔑 PARTE 2: CONFIGURACIÓN LOCAL (3 MINUTOS)

### ✓ Paso 5: Crear Archivo .env
- [ ] Abrir tu proyecto en editor (VS Code, etc)
- [ ] En la **RAÍZ** del proyecto (al lado de package.json)
- [ ] Crear nuevo archivo
- [ ] Nombrar: `.env` (importante el punto al inicio)
- [ ] Copiar este contenido exacto:

```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=cambiar_en_produccion_por_secreto_fuerte
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!
SUPABASE_URL=AQUI_VA_PROJECT_URL
SUPABASE_ANON_KEY=AQUI_VA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=AQUI_VA_SERVICE_ROLE_KEY
```

### ✓ Paso 6: Reemplazar Valores de Supabase
- [ ] En línea `SUPABASE_URL=`, reemplazar `AQUI_VA_PROJECT_URL` con lo que copiaste
  - Debería verse así: `SUPABASE_URL=https://tuproyecto.supabase.co`
- [ ] En línea `SUPABASE_ANON_KEY=`, reemplazar `AQUI_VA_ANON_KEY`
  - Debería empezar con: `eyJhbGc...` (largo)
- [ ] En línea `SUPABASE_SERVICE_ROLE_KEY=`, reemplazar `AQUI_VA_SERVICE_ROLE_KEY`
  - Debería empezar con: `eyJhbGc...` (aún más largo)
- [ ] **GUARDAR** el archivo (.env)

### ✓ Paso 7: Verificar .env
- [ ] Abirir el archivo `.env` que creaste
- [ ] Verificar que:
  - Tiene 9 líneas
  - No tiene comentarios
  - No tiene espacios en blanco al inicio
  - Los 3 valores de Supabase no están vacíos

---

## 💻 PARTE 3: INSTALAR Y EJECUTAR (2 MINUTOS)

### ✓ Paso 8: Instalar Dependencias
- [ ] Abrir terminal/cmd en la raíz del proyecto
- [ ] Ejecutar: `npm install`
- [ ] **ESPERAR** a que termine (dice "added XX packages")

### ✓ Paso 9: Iniciar Servidor
- [ ] En la terminal, ejecutar: `npm run dev`
- [ ] **VERIFICAR** que dice:
  - `Database is ready with Supabase.`
  - `Server is running on http://localhost:3000`
- [ ] Si hay error, ver **TROUBLESHOOTING** abajo

### ✓ Paso 10: Acceder al Sistema
- [ ] Abrir navegador
- [ ] Ir a: `http://localhost:3000`
- [ ] Deberías ver el formulario de login

---

## 🔐 PARTE 4: VERIFICAR QUE FUNCIONA (2 MINUTOS)

### ✓ Paso 11: Login Admin
- [ ] Email: `admin@example.com`
- [ ] Contraseña: `Admin12345!`
- [ ] Clic "Sign In"
- [ ] Deberías ver el **Dashboard** (gráficos, tablas, etc)

### ✓ Paso 12: Crear Evento de Prueba
- [ ] Clic en **Eventos** (menú izquierdo)
- [ ] Clic **"Crear Evento"**
- [ ] Rellena:
  - Nombre: "Concierto de Prueba"
  - Fecha: (selecciona una)
  - Lugar: "Santo Domingo"
  - Descripción: "Evento de prueba"
  - Imagen: (deja en blanco)
- [ ] Clic **"Guardar"**
- [ ] Deberías ver el evento en la lista

### ✓ Paso 13: Crear Tipo de Boleta
- [ ] Clic en **Boletas** (menú)
- [ ] Selecciona el evento que creaste
- [ ] Clic **"Crear Tipo"**
- [ ] Rellena:
  - Tipo: "General"
  - Precio: 500
  - Stock: 100
- [ ] Clic **"Guardar"**

### ✓ Paso 14: Ver Reportes
- [ ] Clic en **Reportes**
- [ ] Deberías ver datos (aún vacíos o con lo que creaste)
- [ ] ✅ **¡Todo funciona!**

---

## ❌ TROUBLESHOOTING

Si algo falla, busca tu error aquí:

### Error: "Supabase credentials not configured"
**Línea a revisar**: `src/config/database.js` debe encontrar `.env`

**Soluciones**:
1. [ ] ¿Creaste el archivo `.env` en la RAÍZ? (al lado de package.json)
2. [ ] ¿Guardaste el archivo `.env`?
3. [ ] ¿Rellenaste `SUPABASE_URL` y `SUPABASE_ANON_KEY`?
4. [ ] Reinicia el servidor: Ctrl+C y `npm run dev` de nuevo

### Error: "Relation "eventos" does not exist" (PGRST116)
**Significa**: Las tablas SQL no existen en Supabase

**Soluciones**:
1. [ ] ¿Ejecutaste el script `SUPABASE_SETUP.sql` en Supabase?
2. [ ] ¿Dice "Success" cuando lo ejecutaste?
3. [ ] Ve a SQL Editor → New Query → ejecuta: `SELECT * FROM eventos;`
4. [ ] Si da error, vuelve a ejecutar el script completo

### Error: "Cannot find module '@supabase/supabase-js'"
**Significa**: No instalaste dependencias

**Soluciones**:
1. [ ] Ejecuta: `npm install`
2. [ ] Espera a que termine
3. [ ] Reinicia servidor: `npm run dev`

### Error: "Unauthorized" o "Invalid credentials"
**Significa**: Las credenciales de Supabase son incorrectas

**Soluciones**:
1. [ ] Ve a Supabase → Settings → API
2. [ ] Copia de nuevo las credenciales (completas, sin espacios)
3. [ ] Reemplaza en `.env`
4. [ ] Reinicia: `npm run dev`

### Servidor inicia pero no puedo hacer login
**Significa**: El admin aún se está creando

**Soluciones**:
1. [ ] Espera 10 segundos
2. [ ] Recarga la página
3. [ ] Intenta de nuevo con: admin@example.com / Admin12345!
4. [ ] Si sigue fallando, revisa que las credenciales en .env sean correctas

### "Port 3000 already in use"
**Significa**: Hay otro proceso usando puerto 3000

**Soluciones**:
1. [ ] En terminal: `lsof -i :3000` (Mac/Linux)
2. [ ] O: `netstat -ano | findstr :3000` (Windows)
3. [ ] Mata el proceso o usa otro puerto:
   - Edita `.env`: `PORT=3001`
   - Reinicia: `npm run dev`

---

## 🎯 ¿YA COMPLETASTE TODO?

Si **SÍ**:
- [ ] El servidor está corriendo
- [ ] Puedo acceder a http://localhost:3000
- [ ] Hago login con admin@example.com
- [ ] Veo el dashboard
- [ ] Puedo crear eventos
- [ ] **✅ ¡ÉXITO!**

Si **NO**:
- [ ] Busca tu error arriba en **TROUBLESHOOTING**
- [ ] O lee: `SUPABASE_SETUP_GUIDE.md`
- [ ] O copia el error exacto y búscalo en Google

---

## 🚀 AHORA QUÉ?

Tu sistema está **100% funcional**. Puedes:

1. **Explorar**
   - [ ] Crear más eventos
   - [ ] Ver reportes
   - [ ] Gestionar usuarios

2. **Personalizar** (opcional)
   - [ ] Cambiar colores en `public/styles.css`
   - [ ] Cambiar contraseña admin en `.env`
   - [ ] Agregar tu logo

3. **Desplegar** (cuando estés listo)
   - [ ] Hosting: Vercel, Railway, Render
   - [ ] Base de datos: Ya está en Supabase (nube)
   - [ ] Dominio: Compra uno y configura

---

## 📞 REFERENCIAS RÁPIDAS

| Documento | Cuándo Usar |
|-----------|-------------|
| INSTRUCCIONES_FINALES.md | Visión general |
| QUICK_SUPABASE_SETUP.md | Setup rápido (5 min) |
| SUPABASE_SETUP_GUIDE.md | Guía detallada |
| SUPABASE_SETUP.sql | Script para Supabase |
| MIGRATION_SUMMARY.md | Qué cambió del código |
| Este archivo | Pasos numerados |

---

## ✨ RESUMEN FINAL

**Has completado**:
- ✅ Instalación de Supabase
- ✅ Configuración de Base de Datos
- ✅ Conexión del servidor
- ✅ Creación de admin
- ✅ Setup completo del sistema

**Tu sistema está listo para**:
- ✅ Gestionar eventos
- ✅ Vender boletas
- ✅ Validar tickets
- ✅ Generar reportes
- ✅ Crecer a producción

---

**Hecho con ❤️ para Eventix**  
**Última actualización**: Mayo 6, 2026  
**Estado**: ✅ Completamente funcional
