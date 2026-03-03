import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, Award } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import bankDesktopImg from '../assets/bank-desktop.png';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si ya hay una sesión activa al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        // Si ya hay sesión activa, redirigir directamente al dashboard
        navigate('/colaborador/dashboard');
        onClose();
      }
    }
  }, [isOpen, navigate, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await AuthService.login(username, password);
        if (result.success && result.user) {
          AuthService.saveCurrentUser(result.user);
          navigate('/colaborador/dashboard');
          onClose();
        } else {
          setError(result.message);
        }
      } else {
        // Registro
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        const result = await AuthService.register(username, password, email);
        if (result.success && result.user) {
          AuthService.saveCurrentUser(result.user);
          navigate('/colaborador/dashboard');
          onClose();
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="collaboration-modal-overlay" onClick={onClose}>
      <div className="collaboration-modal-wrapper">
        {/* Imagen que sobresale hacia arriba */}
        <div className="collaboration-modal-image-container">
          <img src={bankDesktopImg} alt="Banco de Preguntas" className="collaboration-modal-image" />
        </div>

        <div className="collaboration-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Botón cerrar */}
          <button onClick={onClose} className="collaboration-modal-close">
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="collaboration-modal-header">
            <h2 className="collaboration-modal-title" style={{ fontFamily: "'Bungee', cursive" }}>
              Banco de Preguntas
            </h2>
            <p className="collaboration-modal-subtitle">
              Colabora con la comunidad creando preguntas bíblicas
            </p>
          </div>

        {/* Información del sistema */}
        <div className="collaboration-info-grid">
          <div className="collaboration-info-item">
            <Clock className="h-6 w-6 text-blue-500" />
            <div>
              <h4 className="font-bold text-sm">Sala de Espera</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Tus preguntas serán revisadas antes de publicarse
              </p>
            </div>
          </div>

          <div className="collaboration-info-item">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <h4 className="font-bold text-sm">Aprobación</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Los moderadores verifican cada pregunta
              </p>
            </div>
          </div>

          <div className="collaboration-info-item">
            <Award className="h-6 w-6 text-purple-500" />
            <div>
              <h4 className="font-bold text-sm">Gamificación</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                10 preguntas aprobadas = Colaborador Confiable
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de Login/Registro */}
        <div className="collaboration-form-container">
          <div className="collaboration-form-tabs">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`collaboration-tab ${isLogin ? 'active' : ''}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`collaboration-tab ${!isLogin ? 'active' : ''}`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="collaboration-form">
            {error && (
              <div className="collaboration-error">
                {error}
              </div>
            )}

            <div className="collaboration-input-group">
              <label htmlFor="username" className="collaboration-label">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="collaboration-input"
                placeholder="Tu nombre de usuario"
                required
                minLength={3}
              />
            </div>

            {!isLogin && (
              <div className="collaboration-input-group">
                <label htmlFor="email" className="collaboration-label">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="collaboration-input"
                  placeholder="tu@email.com"
                />
              </div>
            )}

            <div className="collaboration-input-group">
              <label htmlFor="password" className="collaboration-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="collaboration-input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="collaboration-submit-button"
              style={{ fontFamily: "'Bungee', cursive" }}
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>
        </div>

          {/* Footer con información adicional */}
          <div className="collaboration-modal-footer">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Al registrarte, aceptas colaborar con preguntas basadas en la Biblia Reina Valera 1995
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationModal;
