# ⚡ SUPABASE - GUÍA RÁPIDA (5 MINUTOS)

## 1️⃣ CREAR PROYECTO EN SUPABASE
1. Ve a https://supabase.com
2. Sign up / Login
3. New Project
4. Nombre: `eventix`
5. Crea contraseña fuerte
6. Region: Elige la tuya
7. **Plan: FREE** ✅
8. Click Create → Espera 2-3 min

## 2️⃣ OBTENER CREDENCIALES
En tu proyecto Supabase:
1. Settings → API
2. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 3️⃣ EJECUTAR SCRIPT SQL
1. En Supabase: **SQL Editor → New Query**
2. Abre `SUPABASE_SETUP.sql` de tu proyecto
3. **Copia TODO** el contenido
4. Pega en SQL Editor
5. Click **Run** (play)
6. Espera a que termine ✅

## 4️⃣ CREAR .env
En la raíz del proyecto, crea `.env`:
```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=cambiar_en_produccion
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!
SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Reemplaza los valores de Supabase.

## 5️⃣ INSTALAR Y EJECUTAR
```bash
npm install
npm run dev
```

Abre: **http://localhost:3000**

---

## ✅ LISTO!

**Login Admin**:
- Email: `admin@example.com`
- Pass: `Admin12345!`

---

## 📚 MÁS DOCUMENTACIÓN

- [Guía Completa](./SUPABASE_SETUP_GUIDE.md) - Detalles y troubleshooting
- [Script SQL](./SUPABASE_SETUP.sql) - Estructura de BD
- `.env.example` - Variables necesarias

---

## ⚠️ IMPORTANTE

- **NUNCA** subes `.env` a GitHub
- Cambiar `JWT_SECRET` y `ADMIN_PASSWORD` en producción
- Nunca compartas tus credenciales de Supabase

---

Última actualización: Mayo 2026
