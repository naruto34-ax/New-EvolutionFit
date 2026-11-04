-- Sistema de logros (#10) - ejecutar en Neon (SQL Editor) por quien administra la base de datos

CREATE TABLE IF NOT EXISTS logros (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(50)  UNIQUE NOT NULL,           -- identificador estable que usa el backend
  titulo      VARCHAR(100) NOT NULL,
  descripcion TEXT         NOT NULL,
  meta        INTEGER      NOT NULL CHECK (meta > 0),  -- cuánto hay que acumular para desbloquearlo
  puntos      INTEGER      NOT NULL CHECK (puntos >= 0),
  activo      BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuario_logros (
  usuario_id      INTEGER     NOT NULL,
  -- Descomentar y ajustar al nombre real de la tabla de usuarios:
  -- usuario_id   INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  logro_id        INTEGER     NOT NULL REFERENCES logros(id) ON DELETE CASCADE,
  progreso        INTEGER     NOT NULL DEFAULT 0 CHECK (progreso >= 0),
  desbloqueado_en TIMESTAMPTZ,
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (usuario_id, logro_id)
);

CREATE INDEX IF NOT EXISTS idx_usuario_logros_usuario ON usuario_logros (usuario_id);

INSERT INTO logros (codigo, titulo, descripcion, meta, puntos) VALUES
  ('primer_paso',    'Primer paso',    'Completa tu primera sesión.',          1, 20),
  ('constancia',     'Constancia',     'Entrena 4 semanas seguidas.',          4, 50),
  ('madrugador',     'Madrugador',     '10 sesiones antes de las 7 a. m.',    10, 40),
  ('mas_fuerte',     'Más fuerte',     'Sube 10 kg en tu sentadilla.',        10, 60),
  ('medidas_al_dia', 'Medidas al día', 'Registra 8 controles corporales.',     8, 30)
ON CONFLICT (codigo) DO NOTHING;
