-- ============================================
-- SCHEMA PARA SISTEMA DE NOTIFICACIONES
-- ============================================

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('question_approved', 'question_rejected', 'new_question_pending', 'message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  question_id UUID REFERENCES collaborative_questions(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (true);

-- Permitir inserción de notificaciones
CREATE POLICY "Anyone can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Los usuarios pueden actualizar sus propias notificaciones (marcar como leídas)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (true);

-- Los usuarios pueden eliminar sus propias notificaciones
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (true);

-- ============================================
-- FUNCIONES PARA CREAR NOTIFICACIONES AUTOMÁTICAMENTE
-- ============================================

-- Función para notificar al colaborador cuando su pregunta es aprobada
CREATE OR REPLACE FUNCTION notify_question_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear notificación si el estado cambió a 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO notifications (user_id, type, title, message, question_id)
    VALUES (
      NEW.user_id,
      'question_approved',
      '¡Pregunta Aprobada!',
      'Tu pregunta del capítulo ' || NEW.chapter || ' ha sido aprobada y ahora está disponible en el banco de preguntas.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para notificar al colaborador cuando su pregunta es rechazada
CREATE OR REPLACE FUNCTION notify_question_rejected()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear notificación si el estado cambió a 'rejected'
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    INSERT INTO notifications (user_id, type, title, message, question_id)
    VALUES (
      NEW.user_id,
      'question_rejected',
      'Pregunta Rechazada',
      'Tu pregunta del capítulo ' || NEW.chapter || ' fue rechazada. Motivo: ' || COALESCE(NEW.rejection_reason, 'No especificado'),
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para notificar a moderadores cuando hay una nueva pregunta pendiente
CREATE OR REPLACE FUNCTION notify_moderators_new_question()
RETURNS TRIGGER AS $$
DECLARE
  moderator_record RECORD;
BEGIN
  -- Notificar a todos los moderadores y superadmins
  FOR moderator_record IN 
    SELECT id FROM users WHERE role IN ('moderator', 'superadmin')
  LOOP
    INSERT INTO notifications (user_id, type, title, message, question_id)
    VALUES (
      moderator_record.id,
      'new_question_pending',
      'Nueva Pregunta Pendiente',
      'Hay una nueva pregunta del capítulo ' || NEW.chapter || ' esperando revisión.',
      NEW.id
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS PARA NOTIFICACIONES AUTOMÁTICAS
-- ============================================

-- Trigger para notificar cuando una pregunta es aprobada
CREATE TRIGGER trigger_notify_question_approved
  AFTER UPDATE ON collaborative_questions
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
  EXECUTE FUNCTION notify_question_approved();

-- Trigger para notificar cuando una pregunta es rechazada
CREATE TRIGGER trigger_notify_question_rejected
  AFTER UPDATE ON collaborative_questions
  FOR EACH ROW
  WHEN (NEW.status = 'rejected' AND OLD.status != 'rejected')
  EXECUTE FUNCTION notify_question_rejected();

-- Trigger para notificar a moderadores cuando se crea una nueva pregunta
CREATE TRIGGER trigger_notify_moderators_new_question
  AFTER INSERT ON collaborative_questions
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION notify_moderators_new_question();

-- Comentarios para documentación
COMMENT ON TABLE notifications IS 'Sistema de notificaciones para colaboradores y moderadores';
COMMENT ON COLUMN notifications.type IS 'Tipos: question_approved, question_rejected, new_question_pending, message';
COMMENT ON COLUMN notifications.is_read IS 'Indica si la notificación ha sido leída por el usuario';
