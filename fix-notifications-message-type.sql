-- ============================================
-- FIX: Permitir notificaciones de tipo 'message'
-- ============================================
-- Este script actualiza la tabla notifications para permitir
-- que los administradores envíen mensajes a los colaboradores

-- PASO 1: Verificar el constraint actual
DO $$ 
BEGIN
    RAISE NOTICE 'Verificando constraint actual...';
END $$;

SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'notifications'::regclass
  AND conname LIKE '%type%';

-- PASO 2: Eliminar el constraint existente si existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conrelid = 'notifications'::regclass 
        AND conname = 'notifications_type_check'
    ) THEN
        ALTER TABLE notifications DROP CONSTRAINT notifications_type_check;
        RAISE NOTICE 'Constraint eliminado exitosamente';
    ELSE
        RAISE NOTICE 'No se encontró el constraint notifications_type_check';
    END IF;
END $$;

-- PASO 3: Agregar el nuevo constraint con 'message' incluido
ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
    'question_approved', 
    'question_rejected', 
    'new_question_pending', 
    'approved',
    'rejected',
    'message'
));

-- PASO 4: Actualizar el comentario de la columna
COMMENT ON COLUMN notifications.type IS 'Tipos permitidos: question_approved, question_rejected, new_question_pending, approved, rejected, message';

-- PASO 5: Verificar que el cambio se aplicó correctamente
DO $$ 
BEGIN
    RAISE NOTICE 'Verificando nuevo constraint...';
END $$;

SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'notifications'::regclass
  AND conname = 'notifications_type_check';

-- PASO 6: Probar insertando una notificación de prueba (opcional)
-- Descomenta las siguientes líneas si quieres probar
/*
DO $$ 
DECLARE
    test_user_id UUID;
BEGIN
    -- Obtener el ID de un usuario para prueba
    SELECT id INTO test_user_id FROM users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Insertar notificación de prueba
        INSERT INTO notifications (user_id, type, title, message, is_read)
        VALUES (
            test_user_id,
            'message',
            'Prueba de mensaje',
            'Este es un mensaje de prueba del sistema',
            false
        );
        
        RAISE NOTICE 'Notificación de prueba creada exitosamente';
        
        -- Eliminar la notificación de prueba
        DELETE FROM notifications 
        WHERE user_id = test_user_id 
        AND type = 'message' 
        AND title = 'Prueba de mensaje';
        
        RAISE NOTICE 'Notificación de prueba eliminada';
    END IF;
END $$;
*/

-- Mensaje final
DO $$ 
BEGIN
    RAISE NOTICE '✅ Script ejecutado exitosamente. Ahora puedes enviar mensajes a los colaboradores.';
END $$;
