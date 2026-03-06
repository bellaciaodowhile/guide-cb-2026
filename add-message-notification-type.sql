-- ============================================
-- MIGRACIÓN: Agregar tipo 'message' a notificaciones
-- ============================================
-- Este script actualiza la tabla notifications para permitir
-- notificaciones de tipo 'message' enviadas por administradores

-- Eliminar el constraint existente
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Agregar el nuevo constraint con el tipo 'message' incluido
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('question_approved', 'question_rejected', 'new_question_pending', 'message'));

-- Actualizar el comentario de la columna
COMMENT ON COLUMN notifications.type IS 'Tipos: question_approved, question_rejected, new_question_pending, message';

-- Verificar que el cambio se aplicó correctamente
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'notifications_type_check';
