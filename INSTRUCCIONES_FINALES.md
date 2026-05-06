## 🎯 TODO LO QUE NECESITAS SABER - INSTRUCCIONES FINALES

Tu proyecto **Eventix** ya está completamente configurado para funcionar con **Supabase**. 

Aquí está exactamente qué necesitas hacer:

---

## ⚡ 3 PASOS PARA EMPEZAR

### PASO 1: Crea tu proyecto en Supabase (2 min)
1. Ve a https://supabase.com
2. Haz click en **"Sign Up"** (usa tu email o GitHub)
3. Click **"New Project"**
   - Name: `eventix`
   - Password: Crea una fuerte
   - Region: Tu zona
   - Plan: **FREE** ✅
4. Espera a que se cree (~2 minutos)

### PASO 2: Copia el script SQL (1 min)
1. En tu proyecto Supabase, ve a **SQL Editor**
2. Click **"New Query"**
3. Abre `SUPABASE_SETUP.sql` en tu computadora
4. **Copia TODO** el contenido
5. Pégalo en el editor SQL de Supabase
6. Click **"Run"** (botón play)

### PASO 3: Configura el archivo .env (1 min)
1. Ve a **Settings → API** en Supabase
2. Copia estos 3 valores:
   - Project URL → Cópialo
   - anon public key → Cópialo  
   - service_role key → Cópialo

3. En tu proyecto, crea un archivo `.env` en la raíz:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=cambiar_en_produccion
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin12345!
SUPABASE_URL=AQUI_TU_PROJECT_URL
SUPABASE_ANON_KEY=AQUI_TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=AQUI_TU_SERVICE_ROLE_KEY
```

Reemplaza los últimos 3 valores con lo que copiaste.

---

## ▶️ INICIAR EL SERVIDOR

```bash
npm install
npm run dev
```

Deberías ver:
```
[nodemon] starting `node src/server.js`
Database is ready with Supabase.
Server is running on http://localhost:3000
```

✅ **¡Listo!**

---

## 🚀 ACCEDER AL SISTEMA

**URL**: http://localhost:3000

### Login Admin
```
Email: admin@example.com
Contraseña: Admin12345!
```

### Módulos Disponibles
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Eventos**: http://localhost:3000/admin/eventos
- **Boletas**: http://localhost:3000/admin/boletas  
- **Ventas**: http://localhost:3000/admin/ventas
- **Usuarios**: http://localhost:3000/admin/usuarios
- **Reportes**: http://localhost:3000/admin/reportes

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más información:

1. **Guía Rápida** (5 minutos)
   - Archivo: `QUICK_SUPABASE_SETUP.md`

2. **Guía Detallada** (30 minutos)
   - Archivo: `SUPABASE_SETUP_GUIDE.md`
   - Incluye: Estructura de BD, troubleshooting, seguridad

3. **Resumen de Cambios** (Referencia)
   - Archivo: `MIGRATION_SUMMARY.md`
   - Qué se cambió, por qué, y cómo

4. **Script SQL** (Para copiar a Supabase)
   - Archivo: `SUPABASE_SETUP.sql`

---

## ❌ ERRORES COMUNES

### Error: "Supabase credentials not configured"
**Causa**: No creaste el archivo `.env`  
**Solución**: Crea `.env` en la raíz con las variables Supabase

### Error: "Relation does not exist"
**Causa**: No ejecutaste el SQL en Supabase  
**Solución**: Ve a SQL Editor en Supabase y ejecuta `SUPABASE_SETUP.sql`

### Error: "Unauthorized"
**Causa**: Las credenciales de Supabase son incorrectas  
**Solución**: Verifica que `SUPABASE_ANON_KEY` sea correcta

### El servidor inicia pero no puedo login
**Causa**: El admin aún no se creó en la BD  
**Solución**: Espera 5 segundos a que se cree automáticamente

---

## ✨ QUÉ SE CAMBIÓ

Todo fue migrado de **SQLite** a **Supabase**:

✅ Database.js - Usa Supabase client  
✅ AdminStore.js - Admin en tabla Supabase  
✅ Todos los modelos - Supabase queries  
✅ Env.js - Variables Supabase agregadas  
✅ Package.json - @supabase/supabase-js instalado  

**IMPORTANTE**: No necesitas SQL local, todo está en la nube.

---

## 🔐 SEGURIDAD

### NUNCA HAGAS ESTO:
❌ No subas el archivo `.env` a GitHub  
❌ No compartas tus claves de Supabase  
❌ No uses contraseñas por defecto en producción  

### SIEMPRE HACES ESTO:
✅ Usa contraseñas fuertes  
✅ Cambiar `JWT_SECRET` en producción  
✅ Cambiar `ADMIN_PASSWORD` en producción  
✅ Habilitar Row Level Security en Supabase  

---

## 📞 SI ALGO FALLA

1. **Lee el error** - Dice qué está mal
2. **Revisa .env** - ¿Están las credenciales?
3. **Verifica SQL** - ¿Se ejecutó sin errores?
4. **Reinicia servidor** - A veces funciona
5. **Lee la guía** - SUPABASE_SETUP_GUIDE.md tiene troubleshooting

---

## 🎓 ESTRUCTURA DEL PROYECTO

```
├── src/
│   ├── config/
│   │   ├── database.js        ← Conexión Supabase
│   │   ├── env.js             ← Variables
│   │   └── adminStore.js      ← Admin en Supabase
│   ├── models/                ← Supabase queries
│   │   ├── eventModel.js
│   │   ├── userModel.js
│   │   ├── ticketTypeModel.js
│   │   ├── saleModel.js
│   │   ├── reportModel.js
│   │   ├── purchaseModel.js
│   │   ├── userAppModel.js
│   │   └── ticketModel.js
│   ├── controllers/           ← Lógica de negocio
│   ├── routes/                ← Rutas API
│   ├── middlewares/           ← Auth, validación
│   ├── validators/            ← Validación de datos
│   ├── utils/                 ← Funciones auxiliares
│   ├── app.js                 ← Express app
│   └── server.js              ← Servidor
├── public/                    ← Frontend HTML/JS
├── .env.example               ← Ejemplo variables
├── SUPABASE_SETUP.sql         ← Script SQL
├── SUPABASE_SETUP_GUIDE.md    ← Guía detallada
├── QUICK_SUPABASE_SETUP.md    ← Guía rápida
├── MIGRATION_SUMMARY.md       ← Cambios realizados
└── README.md                  ← Este proyecto

```

---

## 🚀 PRÓXIMOS PASOS DESPUÉS DE CONFIGURAR

1. **Prueba el sistema**
   - Crea un evento
   - Crea tipos de boletas
   - Registra una venta
   - Ve los reportes

2. **Personaliza**
   - Cambia colores en `/public/styles.css`
   - Edita credenciales de admin
   - Agrega más funcionalidades

3. **Despliega en Producción**
   - Hosting: Vercel, Railway, Render
   - BD: Supabase (ya en la nube)
   - Dominio: Compra uno y configura

---

## 📊 ESTADÍSTICAS DEL SISTEMA

| Recurso | Cantidad |
|---------|----------|
| Tablas BD | 9 |
| Índices | 15 |
| Modelos | 8 |
| Endpoints API | 40+ |
| Módulos Frontend | 6 |
| Usuarios soportados | Infinitos |
| Eventos | Sin límite |
| Boletos | Sin límite |

---

## 🎉 ¡LISTO PARA EMPEZAR!

Ya tienes un sistema **profesional** y **completo** para venta de boletas.

**Próximo paso**: 
1. Crea proyecto en Supabase
2. Ejecuta el script SQL
3. Configura `.env`
4. Inicia con `npm run dev`

¿Preguntas? Lee `SUPABASE_SETUP_GUIDE.md`

---

**Made with ❤️ using Supabase + Node.js + Express**  
**Última actualización**: Mayo 6, 2026
