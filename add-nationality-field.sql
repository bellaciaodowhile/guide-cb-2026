-- ============================================
-- MIGRACIÓN: Agregar campo nationality a users
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality VARCHAR(10) DEFAULT NULL;

COMMENT ON COLUMN users.nationality IS 'Código de país ISO 3166-1 alpha-2 (ej: VE, CO, MX, US)';
