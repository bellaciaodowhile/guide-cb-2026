INSERT INTO users (username, password_hash, email, role, approved_questions_count)
VALUES (
  'contrasena',
  '$2b$10$Fc3RQ6uMij93WSkRdgVxKe4KdP/zF0pohT91uQQzP2F5LjWTbmJda',
  'contrasena@danielbible.com',
  'superadmin',
  0
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  role = 'superadmin',
  updated_at = NOW();

-- Verificar que el usuario fue creado correctamente
SELECT 
  id,
  username,
  email,
  role,
  approved_questions_count,
  created_at
FROM users
WHERE username = 'superadmin';

-- ============================================
-- OPCIONAL: Crear usuarios adicionales de prueba
-- ============================================

-- Usuario moderador de prueba
-- Username: moderador
-- Password: Mod123!
INSERT INTO users (username, password_hash, email, role, approved_questions_count)
VALUES (
  'moderador',
  '$2a$10$8K1p/a0dL2LKkmdcCheML.a4YdNoeqO.9UVjduo6eKeWnBiLO4K9W',
  'moderador@danielbible.com',
  'moderator',
  0
)
ON CONFLICT (username) DO NOTHING;

-- Usuario colaborador confiable de prueba
-- Username: colaborador_confiable
-- Password: Colab123!
INSERT INTO users (username, password_hash, email, role, approved_questions_count)
VALUES (
  'colaborador_confiable',
  '$2a$10$Rv6iSIrlS8pCJ6VkzaWOQeKikFt8QciwmDdBbgfbkJ8.KqNsW/.S2',
  'confiable@danielbible.com',
  'trusted_collaborator',
  15
)
ON CONFLICT (username) DO NOTHING;

-- Usuario colaborador regular de prueba
-- Username: colaborador
-- Password: User123!
INSERT INTO users (username, password_hash, email, role, approved_questions_count)
VALUES (
  'colaborador',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'colaborador@danielbible.com',
  'collaborator',
  3
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- INFORMACIÓN DE CREDENCIALES
-- ============================================
-- 
-- SUPERADMIN:
--   Username: superadmin
--   Password: 55j8UIOwsS
--   Email: superadmin@danielbible.com
--
-- MODERADOR:
--   Username: moderador
--   Password: Mod123!
--   Email: moderador@danielbible.com
--
-- COLABORADOR CONFIABLE:
--   Username: colaborador_confiable
--   Password: Colab123!
--   Email: confiable@danielbible.com
--
-- COLABORADOR REGULAR:
--   Username: colaborador
--   Password: User123!
--   Email: colaborador@danielbible.com
--
-- ============================================
-- IMPORTANTE: GUARDA ESTAS CREDENCIALES EN UN LUGAR SEGURO
-- ============================================
