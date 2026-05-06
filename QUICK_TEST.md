# Guía Rápida de Prueba del Sistema

## Paso 1: Iniciar el Servidor

```bash
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Paso 2: Acceder a la Página de Inicio

Abre en tu navegador: `http://localhost:3000/home`

Deberías ver la pantalla de inicio de Eventix con dos opciones:
- "Comprar Boletas" (portal de usuario)
- "Panel Administrativo" (panel admin)

## Paso 3: Prueba como Administrador

### Acceso Admin
1. Haz clic en "Panel Administrativo"
2. Inicia sesión con:
   - Email: `admin@example.com`
   - Contraseña: (la que configuraste en .env o default: admin123)

### Crear un Evento
1. En el menú lateral, haz clic en "Eventos"
2. Completa el formulario:
   - Nombre: "Concierto de Rock 2026"
   - Fecha: 2026-05-15
   - Lugar: "Centro de Convenciones"
   - Descripción: "Un evento inolvidable de música rock"
   - Imagen: https://via.placeholder.com/400x300?text=Rock+Concert
3. Haz clic en "Guardar evento"

### Crear Tipos de Boletas
1. En el menú lateral, haz clic en "Boletas"
2. Selecciona el evento que acabas de crear
3. Crea tres tipos:
   - General: RD$ 500, cantidad 100
   - VIP: RD$ 1,000, cantidad 30
   - Preferencial: RD$ 750, cantidad 50

### Ver Ventas
1. Haz clic en "Ventas" en el menú
2. Verás todas las ventas registradas (inicialmente vacío)

### Panel de Check-in
1. Haz clic en "Check-in" en el menú
2. Aquí podrás validar boletos ingresando el código único

## Paso 4: Prueba como Usuario

### Registro
1. Vuelve a `/home`
2. Haz clic en "Comprar Boletas"
3. Haz clic en "¿No tienes cuenta? Regístrate aquí"
4. Completa el formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@example.com"
   - Contraseña: "password123"
   - Teléfono: "809-555-1234"
5. Haz clic en "Crear Cuenta"

### Login Usuario
1. Inicia sesión con:
   - Email: "juan@example.com"
   - Contraseña: "password123"

### Ver Eventos y Comprar Boletas
1. Se abrirá el dashboard del usuario
2. Haz clic en "Eventos" en el menú
3. Deberías ver el evento que creaste como admin
4. Haz clic en "Comprar Boletas"
5. Aparecerá un modal para seleccionar:
   - Tipo de boleta (General, VIP, etc)
   - Cantidad de boletas
6. Verifica el precio total
7. Haz clic en "Comprar"

### Ver Mis Boletos
1. Haz clic en "Mis Boletos" en el menú
2. Deberías ver los boletos que compraste
3. Cada boleto tiene un código único
4. El estado debe ser "disponible"

### Ver Historial de Compras
1. Haz clic en "Mis Compras"
2. Verás el detalle de tu compra:
   - Evento
   - Tipo de boleta
   - Cantidad
   - Total pagado
   - Fecha de compra

### Editar Perfil
1. Haz clic en "Editar Perfil"
2. Modifica tus datos
3. Haz clic en "Guardar Cambios"

## Paso 5: Probar Check-in

### Como Admin
1. Vuelve al panel de admin (`/admin/check-in`)
2. Copia el código único de uno de los boletos del usuario
3. Pégalo en el campo "Código del Boleto o QR"
4. Haz clic en "Validar"
5. El sistema debe mostrar:
   - Estado: "USADO"
   - Información del usuario
   - Información del evento
   - Timestamp de validación

### Como Usuario
1. Vuelve a `/user/boletos`
2. El boleto que fue validado debe mostrar estado "usado"
3. El estado ya no podrá ser vuelto a validar

## Paso 6: Verificar Reportes

1. En el panel de admin, haz clic en "Reportes"
2. Deberías ver:
   - Total de ingresos: RD$ (suma de lo que compraste)
   - Total de boletas vendidas: (cantidad que compraste)
   - Tabla de ingresos por evento

## Pruebas Adicionales

### Prueba de Validadores
1. Intenta crear un evento sin completar los campos obligatorios
2. Intenta registrarte con un email inválido
3. Intenta iniciar sesión con credenciales incorrectas

### Prueba de Seguridad
1. Intenta acceder a `/admin/eventos` sin estar logueado como admin
2. Intenta acceder a `/user/dashboard` sin estar logueado como usuario
3. Intenta modificar el token en las cookies (deberías ser deslogueado)

## Datos de Prueba Incluidos

La base de datos viene con 3 usuarios de demo:
- Laura Méndez (laura@example.com)
- Carlos Pérez (carlos@example.com)
- Ana Rodríguez (ana@example.com)

## Solución de Problemas

### Puerto 3000 en uso
```bash
npm run dev -- --port 3001
```

### Base de datos corrompida
```bash
rm -rf data/boletas.sqlite
npm run dev
```

### Tokens expirados
- Limpia las cookies del navegador (F12 > Application > Cookies)
- Vuelve a iniciar sesión

## Endpoints para Probar con Postman/Curl

### Login Admin
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Crear Evento
```bash
curl -X POST http://localhost:3000/api/eventos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{
    "nombre":"Mi Evento",
    "fecha":"2026-06-01",
    "lugar":"Mi Lugar",
    "descripcion":"Descripción del evento",
    "imagen":"https://via.placeholder.com/400"
  }'
```

### Ver Eventos Públicos
```bash
curl http://localhost:3000/api/eventos-publicos
```

## Validación Completada

- ✅ Autenticación admin y usuario
- ✅ CRUD de eventos
- ✅ CRUD de tipos de boletas
- ✅ Compra de boletas
- ✅ Generación de códigos únicos
- ✅ Validación de boletos
- ✅ Reportes
- ✅ Gestión de usuarios
- ✅ Seguridad y validadores
