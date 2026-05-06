-- ============================================================================
-- SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this entire script into Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ADMINS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- ============================================================================
-- ADMIN PRINCIPAL INICIAL
-- Cambia el correo y la contrasena antes de ejecutar esto en produccion.
-- Este usuario queda como super_admin y puede crear otros administradores.
-- ============================================================================
INSERT INTO admins (email, password_hash, role)
VALUES (
  'admin@example.com',
  crypt('Admin12345!', gen_salt('bf')),
  'super_admin'
)
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin',
    actualizado_en = now();

-- ============================================================================
-- EVENTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  fecha TEXT NOT NULL,
  hora TEXT NOT NULL DEFAULT '20:00',
  lugar TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen TEXT,
  categoria TEXT NOT NULL DEFAULT 'concierto' CHECK (categoria IN ('concierto', 'stand_up', 'actividad')),
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'finalizado')),
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado);

-- ============================================================================
-- TIPOS_BOLETAS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tipos_boletas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  cantidad_disponible INTEGER NOT NULL CHECK (cantidad_disponible >= 0),
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tipos_boletas_evento ON tipos_boletas(evento_id);

-- ============================================================================
-- USUARIOS TABLE (For admin panel)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- ============================================================================
-- USUARIOS_APP TABLE (For app users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios_app (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  foto TEXT,
  telefono TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_code TEXT,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_app_email ON usuarios_app(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_app_verification_code ON usuarios_app(verification_code);

-- ============================================================================
-- VENTAS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ventas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario TEXT NOT NULL,
  tipo_boleta_id UUID NOT NULL REFERENCES tipos_boletas(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
  fecha_compra TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ventas_tipo_boleta ON ventas(tipo_boleta_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_compra);

-- ============================================================================
-- COMPRAS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS compras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_app_id UUID NOT NULL REFERENCES usuarios_app(id) ON DELETE CASCADE,
  tipo_boleta_id UUID NOT NULL REFERENCES tipos_boletas(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
  metodo_pago TEXT NOT NULL DEFAULT 'tarjeta',
  estado_pago TEXT NOT NULL DEFAULT 'pagado' CHECK (estado_pago IN ('pendiente', 'pagado', 'rechazado')),
  referencia_pago TEXT,
  pago_ultimos4 TEXT,
  estado TEXT NOT NULL DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  fecha_compra TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_app_id);
CREATE INDEX IF NOT EXISTS idx_compras_tipo_boleta ON compras(tipo_boleta_id);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras(estado);
CREATE INDEX IF NOT EXISTS idx_compras_estado_pago ON compras(estado_pago);

-- ============================================================================
-- BOLETOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS boletos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  codigo_unico TEXT NOT NULL UNIQUE,
  tipo_boleta_id UUID NOT NULL REFERENCES tipos_boletas(id),
  evento_id UUID NOT NULL REFERENCES eventos(id),
  usuario_app_id UUID NOT NULL REFERENCES usuarios_app(id) ON DELETE CASCADE,
  fila TEXT NOT NULL DEFAULT 'A',
  asiento INTEGER NOT NULL CHECK (asiento > 0),
  estado TEXT NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'usado', 'cancelado')),
  fecha_validacion TIMESTAMP WITH TIME ZONE,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boletos_codigo ON boletos(codigo_unico);
CREATE INDEX IF NOT EXISTS idx_boletos_usuario ON boletos(usuario_app_id);
CREATE INDEX IF NOT EXISTS idx_boletos_evento ON boletos(evento_id);
CREATE INDEX IF NOT EXISTS idx_boletos_estado ON boletos(estado);
CREATE UNIQUE INDEX IF NOT EXISTS idx_boletos_asiento_unico
  ON boletos(evento_id, fila, asiento);

-- ============================================================================
-- REPORTES VIEW - For admin dashboard
-- ============================================================================
CREATE OR REPLACE VIEW reportes_por_evento AS
SELECT 
  e.id AS evento_id,
  e.nombre AS evento_nombre,
  e.fecha AS evento_fecha,
  e.lugar AS evento_lugar,
  COALESCE(SUM(c.total), 0) AS ingresos,
  COALESCE(SUM(c.cantidad), 0) AS boletas_vendidas,
  COUNT(c.id) AS total_ventas
FROM eventos e
LEFT JOIN tipos_boletas tb ON tb.evento_id = e.id
LEFT JOIN compras c ON c.tipo_boleta_id = tb.id AND c.estado = 'completada' AND c.estado_pago = 'pagado'
GROUP BY e.id, e.nombre, e.fecha, e.lugar
ORDER BY ingresos DESC, boletas_vendidas DESC, e.fecha ASC;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (Optional - commented out by default)
-- Uncomment and configure as needed for your security requirements
-- ============================================================================

-- ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tipos_boletas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios_app ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- Uncomment to insert sample data
-- ============================================================================

-- INSERT INTO usuarios (nombre, email, telefono)
-- VALUES 
--   ('Laura Mendez', 'laura@example.com', '809-555-0101'),
--   ('Carlos Perez', 'carlos@example.com', '809-555-0102'),
--   ('Ana Rodriguez', 'ana@example.com', '809-555-0103');

-- ============================================================================
-- END OF SUPABASE SETUP SCRIPT
-- ============================================================================
