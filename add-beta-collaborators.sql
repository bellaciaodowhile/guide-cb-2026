-- Agregar campo beta a la tabla de usuarios
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_beta BOOLEAN DEFAULT false;

-- Agregar comentario para documentar el campo
COMMENT ON COLUMN users.is_beta IS 'Indica si el colaborador está en modo beta';

-- Actualizar usuarios existentes (por defecto no son beta)
UPDATE users
SET is_beta = false
WHERE is_beta IS NULL;
