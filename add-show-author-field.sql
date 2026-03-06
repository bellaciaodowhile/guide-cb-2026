-- Agregar campo show_author a la tabla collaborative_questions
ALTER TABLE collaborative_questions 
ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT true;

-- Comentario para documentación
COMMENT ON COLUMN collaborative_questions.show_author IS 'Indica si el autor de la pregunta quiere que su nombre sea visible públicamente';
