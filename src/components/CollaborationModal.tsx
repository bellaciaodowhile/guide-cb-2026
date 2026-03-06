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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      // Login
      const result = await AuthService.login(username, password);
      if (result.success && result.user) {
        AuthService.saveCurrentUser(result.user);
        // Mantener returnCategory en sessionStorage al navegar
        navigate('/colaborador/dashboard');
        onClose();
      } else {
        setError(result.message);
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

        {/* Formulario de Login */}
        <div className="collaboration-form-container">
          <div className="collaboration-form-tabs">
            <button className="collaboration-tab active">
              Iniciar Sesión
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
              {loading ? 'Procesando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

          {/* Footer con información adicional */}
          <div className="collaboration-modal-footer">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Inicia sesión para colaborar con preguntas basadas en la Biblia Reina Valera 1995
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationModal;
