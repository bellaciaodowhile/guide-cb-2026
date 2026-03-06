-- =====================================================
-- ACTUALIZACIÓN COMPLETA DEL ESQUEMA DE BASE DE DATOS
-- =====================================================
-- Este archivo contiene todas las actualizaciones necesarias
-- para el sistema de colaboración y quiz

-- 1. Agregar campo show_author a collaborative_questions
ALTER TABLE collaborative_questions
ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT true;

COMMENT ON COLUMN collaborative_questions.show_author IS 'Indica si se debe mostrar el nombre del autor en los resultados del quiz';

-- 2. Agregar campos de tiempo y puntos a collaborative_questions
ALTER TABLE collaborative_questions
ADD COLUMN IF NOT EXISTS time_limit INTEGER DEFAULT 20 CHECK (time_limit IN (20, 25, 30, 35, 40, 45, 50)),
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 20 CHECK (points IN (20, 25, 30, 35, 40, 45, 50, 55, 60));

COMMENT ON COLUMN collaborative_questions.time_limit IS 'Tiempo límite en segundos para responder la pregunta (20-50 seg, múltiplos de 5)';
COMMENT ON COLUMN collaborative_questions.points IS 'Puntos que vale la pregunta (20-60 pts, múltiplos de 5)';

-- 3. Agregar campo beta_mode a la tabla users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS beta_mode BOOLEAN DEFAULT false;

COMMENT ON COLUMN users.beta_mode IS 'Indica si el colaborador tiene acceso a funciones beta';

-- 4. Actualizar preguntas existentes con valores por defecto
UPDATE collaborative_questions
SET show_author = true
WHERE show_author IS NULL;

UPDATE collaborative_questions
SET time_limit = 20
WHERE time_limit IS NULL;

UPDATE collaborative_questions
SET points = 20
WHERE points IS NULL;

UPDATE users
SET beta_mode = false
WHERE beta_mode IS NULL;

-- 5. Verificar que las columnas se crearon correctamente
DO $$
BEGIN
    -- Verificar show_author
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collaborative_questions' 
        AND column_name = 'show_author'
    ) THEN
        RAISE EXCEPTION 'Error: La columna show_author no se creó correctamente';
    END IF;

    -- Verificar time_limit
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collaborative_questions' 
        AND column_name = 'time_limit'
    ) THEN
        RAISE EXCEPTION 'Error: La columna time_limit no se creó correctamente';
    END IF;

    -- Verificar points
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'collaborative_questions' 
        AND column_name = 'points'
    ) THEN
        RAISE EXCEPTION 'Error: La columna points no se creó correctamente';
    END IF;

    -- Verificar beta_mode
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'beta_mode'
    ) THEN
        RAISE EXCEPTION 'Error: La columna beta_mode no se creó correctamente';
    END IF;

    RAISE NOTICE 'Todas las columnas se crearon correctamente';
END $$;

-- 6. Mostrar resumen de cambios
SELECT 
    'collaborative_questions' as tabla,
    COUNT(*) as total_preguntas,
    COUNT(CASE WHEN show_author = true THEN 1 END) as con_autor_visible,
    AVG(time_limit) as tiempo_promedio,
    AVG(points) as puntos_promedio
FROM collaborative_questions
UNION ALL
SELECT 
    'users' as tabla,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN beta_mode = true THEN 1 END) as usuarios_beta,
    NULL as tiempo_promedio,
    NULL as puntos_promedio
FROM users;
