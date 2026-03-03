-- ============================================
-- CONFIGURACIÓN DE POLÍTICAS RLS (Row Level Security)
-- ============================================
-- Este script configura las políticas de seguridad para permitir
-- que los usuarios puedan insertar preguntas sin autenticación JWT
-- ============================================

-- Deshabilitar RLS temporalmente para configuración
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Anyone can create a user" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON collaborative_questions;
DROP POLICY IF EXISTS "Anyone can create questions" ON collaborative_questions;
DROP POLICY IF EXISTS "Moderators can update questions" ON collaborative_questions;
DROP POLICY IF EXISTS "Superadmins can delete questions" ON collaborative_questions;
DROP POLICY IF EXISTS "Anyone can update questions" ON collaborative_questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON collaborative_questions;
DROP POLICY IF EXISTS "Approval history is viewable by everyone" ON approval_history;
DROP POLICY IF EXISTS "Anyone can create approval history" ON approval_history;
DROP POLICY IF EXISTS "Notifications are viewable by everyone" ON notifications;
DROP POLICY IF EXISTS "Anyone can create notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can update notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can delete notifications" ON notifications;

-- Habilitar RLS en las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA TABLA USERS
-- ============================================

-- Permitir lectura pública de usuarios
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Permitir inserción de nuevos usuarios (registro)
CREATE POLICY "Anyone can create a user" ON users
  FOR INSERT WITH CHECK (true);

-- Permitir actualización de usuarios
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- ============================================
-- POLÍTICAS PARA TABLA COLLABORATIVE_QUESTIONS
-- ============================================

-- Permitir lectura de todas las preguntas
CREATE POLICY "Questions are viewable by everyone" ON collaborative_questions
  FOR SELECT USING (true);

-- Permitir inserción de preguntas (sin restricciones)
CREATE POLICY "Anyone can create questions" ON collaborative_questions
  FOR INSERT WITH CHECK (true);

-- Permitir actualización de preguntas
CREATE POLICY "Anyone can update questions" ON collaborative_questions
  FOR UPDATE USING (true);

-- Permitir eliminación de preguntas
CREATE POLICY "Anyone can delete questions" ON collaborative_questions
  FOR DELETE USING (true);

-- ============================================
-- POLÍTICAS PARA TABLA APPROVAL_HISTORY
-- ============================================

-- Permitir lectura de historial
CREATE POLICY "Approval history is viewable by everyone" ON approval_history
  FOR SELECT USING (true);

-- Permitir inserción de historial
CREATE POLICY "Anyone can create approval history" ON approval_history
  FOR INSERT WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA TABLA NOTIFICATIONS
-- ============================================

-- Permitir lectura de notificaciones
CREATE POLICY "Notifications are viewable by everyone" ON notifications
  FOR SELECT USING (true);

-- Permitir inserción de notificaciones
CREATE POLICY "Anyone can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Permitir actualización de notificaciones
CREATE POLICY "Anyone can update notifications" ON notifications
  FOR UPDATE USING (true);

-- Permitir eliminación de notificaciones
CREATE POLICY "Anyone can delete notifications" ON notifications
  FOR DELETE USING (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'collaborative_questions', 'approval_history', 'notifications')
ORDER BY tablename, policyname;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 
-- Estas políticas permiten acceso completo a las tablas sin autenticación JWT.
-- Esto es apropiado para una aplicación que maneja su propia autenticación
-- usando bcrypt y localStorage.
--
-- Si en el futuro quieres restringir el acceso, puedes modificar las políticas
-- para verificar roles específicos o usar auth.uid() de Supabase Auth.
--
-- ============================================
