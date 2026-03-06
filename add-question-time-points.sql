-- Agregar campos de tiempo y puntos a las preguntas
ALTER TABLE collaborative_questions
ADD COLUMN IF NOT EXISTS time_limit INTEGER DEFAULT 20 CHECK (time_limit IN (20, 25, 30, 35, 40, 45, 50)),
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 20 CHECK (points IN (20, 25, 30, 35, 40, 45, 50, 55, 60));

-- Agregar campo beta_mode a la tabla users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS beta_mode BOOLEAN DEFAULT false;

-- Comentarios para documentación
COMMENT ON COLUMN collaborative_questions.time_limit IS 'Tiempo límite en segundos para responder la pregunta (20-50 seg, múltiplos de 5)';
COMMENT ON COLUMN collaborative_questions.points IS 'Puntos que vale la pregunta (20-60 pts, múltiplos de 5)';
COMMENT ON COLUMN users.beta_mode IS 'Indica si el colaborador tiene acceso a funciones beta';
