-- ============================================================================
-- FIX PARA BASES EXISTENTES DE EVENTIX
-- Ejecuta este script en Supabase > SQL Editor si ya tenias tablas creadas.
-- CREATE TABLE IF NOT EXISTS no agrega columnas nuevas a tablas existentes.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE usuarios_app
  ADD COLUMN IF NOT EXISTS foto TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_code TEXT,
  ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_usuarios_app_email ON usuarios_app(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_app_verification_code ON usuarios_app(verification_code);

ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

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

UPDATE admins
SET role = 'super_admin'
WHERE id = (SELECT id FROM admins ORDER BY creado_en ASC LIMIT 1)
  AND role = 'admin';

ALTER TABLE eventos
  ADD COLUMN IF NOT EXISTS hora TEXT NOT NULL DEFAULT '20:00',
  ADD COLUMN IF NOT EXISTS categoria TEXT NOT NULL DEFAULT 'concierto',
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'activo';

UPDATE eventos SET estado = 'activo' WHERE estado NOT IN ('activo', 'pausado', 'finalizado');
UPDATE eventos SET categoria = 'concierto' WHERE categoria NOT IN ('concierto', 'stand_up', 'actividad');

CREATE INDEX IF NOT EXISTS idx_eventos_categoria ON eventos(categoria);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado);

ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_estado_check;
ALTER TABLE eventos
  ADD CONSTRAINT eventos_estado_check CHECK (estado IN ('activo', 'pausado', 'finalizado'));

ALTER TABLE eventos DROP CONSTRAINT IF EXISTS eventos_categoria_check;
ALTER TABLE eventos
  ADD CONSTRAINT eventos_categoria_check CHECK (categoria IN ('concierto', 'stand_up', 'actividad'));

ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_role_check;
ALTER TABLE admins
  ADD CONSTRAINT admins_role_check CHECK (role IN ('super_admin', 'admin'));

ALTER TABLE tipos_boletas DROP CONSTRAINT IF EXISTS tipos_boletas_tipo_check;

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

ALTER TABLE compras
  ADD COLUMN IF NOT EXISTS metodo_pago TEXT NOT NULL DEFAULT 'tarjeta',
  ADD COLUMN IF NOT EXISTS estado_pago TEXT NOT NULL DEFAULT 'pagado',
  ADD COLUMN IF NOT EXISTS referencia_pago TEXT,
  ADD COLUMN IF NOT EXISTS pago_ultimos4 TEXT;

ALTER TABLE compras DROP CONSTRAINT IF EXISTS compras_estado_pago_check;
ALTER TABLE compras
  ADD CONSTRAINT compras_estado_pago_check CHECK (estado_pago IN ('pendiente', 'pagado', 'rechazado'));

UPDATE compras
SET
  metodo_pago = COALESCE(NULLIF(trim(metodo_pago), ''), 'tarjeta'),
  estado_pago = COALESCE(NULLIF(trim(estado_pago), ''), 'pagado')
WHERE metodo_pago IS NULL
   OR trim(metodo_pago) = ''
   OR estado_pago IS NULL
   OR trim(estado_pago) = '';

CREATE INDEX IF NOT EXISTS idx_compras_usuario ON compras(usuario_app_id);
CREATE INDEX IF NOT EXISTS idx_compras_tipo_boleta ON compras(tipo_boleta_id);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras(estado);
CREATE INDEX IF NOT EXISTS idx_compras_estado_pago ON compras(estado_pago);

CREATE TABLE IF NOT EXISTS boletos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  codigo_unico TEXT NOT NULL UNIQUE,
  tipo_boleta_id UUID NOT NULL REFERENCES tipos_boletas(id),
  evento_id UUID NOT NULL REFERENCES eventos(id),
  usuario_app_id UUID NOT NULL REFERENCES usuarios_app(id) ON DELETE CASCADE,
  fila TEXT NOT NULL DEFAULT 'A',
  asiento INTEGER,
  estado TEXT NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'usado', 'cancelado')),
  fecha_validacion TIMESTAMP WITH TIME ZONE,
  creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE boletos
  ADD COLUMN IF NOT EXISTS fila TEXT DEFAULT 'A',
  ADD COLUMN IF NOT EXISTS asiento INTEGER;

UPDATE boletos
SET fila = 'A'
WHERE fila IS NULL OR trim(fila) = '';

WITH max_asiento_por_evento AS (
  SELECT evento_id, COALESCE(MAX(asiento), 0) AS max_asiento
  FROM boletos
  WHERE asiento IS NOT NULL
  GROUP BY evento_id
),
boletos_sin_asiento AS (
  SELECT
    b.id,
    COALESCE(m.max_asiento, 0) + ROW_NUMBER() OVER (
      PARTITION BY b.evento_id
      ORDER BY b.creado_en ASC, b.id ASC
    ) AS asiento_calculado
  FROM boletos b
  LEFT JOIN max_asiento_por_evento m ON m.evento_id = b.evento_id
  WHERE b.asiento IS NULL
)
UPDATE boletos b
SET asiento = boletos_sin_asiento.asiento_calculado
FROM boletos_sin_asiento
WHERE b.id = boletos_sin_asiento.id;

ALTER TABLE boletos
  ALTER COLUMN fila SET NOT NULL,
  ALTER COLUMN fila SET DEFAULT 'A',
  ALTER COLUMN asiento SET NOT NULL;

ALTER TABLE boletos DROP CONSTRAINT IF EXISTS boletos_asiento_check;
ALTER TABLE boletos
  ADD CONSTRAINT boletos_asiento_check CHECK (asiento > 0);

CREATE INDEX IF NOT EXISTS idx_boletos_codigo ON boletos(codigo_unico);
CREATE INDEX IF NOT EXISTS idx_boletos_usuario ON boletos(usuario_app_id);
CREATE INDEX IF NOT EXISTS idx_boletos_evento ON boletos(evento_id);
CREATE INDEX IF NOT EXISTS idx_boletos_estado ON boletos(estado);
CREATE UNIQUE INDEX IF NOT EXISTS idx_boletos_asiento_unico
  ON boletos(evento_id, fila, asiento);

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
