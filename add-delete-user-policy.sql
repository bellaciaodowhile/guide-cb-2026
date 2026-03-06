-- ============================================
-- AGREGAR POLÍTICA DE ELIMINACIÓN DE USUARIOS
-- ============================================
-- Este script agrega la política faltante para permitir
-- la eliminación de usuarios en la tabla users
-- ============================================

-- Eliminar la política si ya existe
DROP POLICY IF EXISTS "Anyone can delete users" ON users;

-- Crear la política de eliminación
CREATE POLICY "Anyone can delete users" ON users
  FOR DELETE USING (true);

-- Verificar que la política se creó correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'users'
  AND policyname = 'Anyone can delete users';

-- ============================================
-- INSTRUCCIONES
-- ============================================
-- 
-- 1. Ve a tu proyecto de Supabase
-- 2. Abre el SQL Editor
-- 3. Copia y pega este script completo
-- 4. Ejecuta el script
-- 5. Verifica que la política se creó correctamente
--
-- Después de ejecutar este script, podrás eliminar usuarios
-- desde el AdminCollaboratorManager
--
-- ============================================
