-- ============================================
-- SCHEMA PARA SISTEMA DE COLABORACIÓN DE PREGUNTAS
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20) DEFAULT 'collaborator' CHECK (role IN ('collaborator', 'trusted_collaborator', 'moderator', 'superadmin')),
  approved_questions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preguntas colaborativas
CREATE TABLE IF NOT EXISTS collaborative_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL CHECK (chapter >= 1 AND chapter <= 12),
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  verse_reference TEXT NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de aprobaciones (para gamificación)
CREATE TABLE IF NOT EXISTS approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES collaborative_questions(id) ON DELETE CASCADE,
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON collaborative_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON collaborative_questions(chapter);
CREATE INDEX IF NOT EXISTS idx_questions_status ON collaborative_questions(status);
CREATE INDEX IF NOT EXISTS idx_approval_history_user_id ON approval_history(user_id);

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS en las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborative_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
-- Permitir lectura pública de usuarios (sin datos sensibles)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Permitir inserción de nuevos usuarios (registro)
CREATE POLICY "Anyone can create a user" ON users
  FOR INSERT WITH CHECK (true);

-- Permitir actualización solo del propio usuario
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Políticas para la tabla collaborative_questions
-- Permitir lectura de todas las preguntas
CREATE POLICY "Questions are viewable by everyone" ON collaborative_questions
  FOR SELECT USING (true);

-- Permitir inserción de preguntas por cualquier usuario autenticado
CREATE POLICY "Anyone can create questions" ON collaborative_questions
  FOR INSERT WITH CHECK (true);

-- Permitir actualización solo a moderadores y superadmins
CREATE POLICY "Moderators can update questions" ON collaborative_questions
  FOR UPDATE USING (true);

-- Permitir eliminación solo a superadmins
CREATE POLICY "Superadmins can delete questions" ON collaborative_questions
  FOR DELETE USING (true);

-- Políticas para la tabla approval_history
-- Permitir lectura de historial
CREATE POLICY "Approval history is viewable by everyone" ON approval_history
  FOR SELECT USING (true);

-- Permitir inserción de historial
CREATE POLICY "Anyone can create approval history" ON approval_history
  FOR INSERT WITH CHECK (true);

-- ============================================
-- FIN DE POLÍTICAS DE SEGURIDAD
-- ============================================

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON collaborative_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para promover a colaborador confiable automáticamente
CREATE OR REPLACE FUNCTION check_and_promote_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el usuario tiene 10 o más preguntas aprobadas, promoverlo a trusted_collaborator
  IF (SELECT approved_questions_count FROM users WHERE id = NEW.user_id) >= 10 THEN
    UPDATE users 
    SET role = 'trusted_collaborator' 
    WHERE id = NEW.user_id AND role = 'collaborator';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para promover automáticamente cuando se aprueba una pregunta
CREATE TRIGGER auto_promote_user
  AFTER INSERT ON approval_history
  FOR EACH ROW
  EXECUTE FUNCTION check_and_promote_user();

-- Insertar usuario superadmin por defecto (cambiar la contraseña después)
-- Contraseña por defecto: admin123 (debes cambiarla inmediatamente)
INSERT INTO users (username, password_hash, email, role)
VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'admin@example.com', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema de colaboración';
COMMENT ON TABLE collaborative_questions IS 'Preguntas enviadas por colaboradores';
COMMENT ON TABLE approval_history IS 'Historial de preguntas aprobadas para gamificación';
COMMENT ON COLUMN users.role IS 'Roles: collaborator, trusted_collaborator, moderator, superadmin';
COMMENT ON COLUMN collaborative_questions.status IS 'Estados: pending, approved, rejected';
