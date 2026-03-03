import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { QuestionService } from '../services/questionService';
import { LogOut, Home, CheckCircle, XCircle, Clock, AlertTriangle, Eye, EyeOff, Edit } from 'lucide-react';
import type { User, CollaborativeQuestion } from '../types/collaboration';

const ModeratorPanel: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pendingQuestions, setpendingQuestions] = useState<CollaborativeQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<CollaborativeQuestion[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    // Verificar que sea moderador o superadmin
    if (currentUser.role !== 'moderator' && currentUser.role !== 'superadmin') {
      navigate('/colaborador/dashboard');
      return;
    }

    setUser(currentUser);
    loadPendingQuestions();
  }, [navigate]);

  const loadPendingQuestions = async () => {
    setLoading(true);
    const questions = await QuestionService.getPendingQuestions();
    setpendingQuestions(questions);
    setFilteredQuestions(questions);
    setLoading(false);
  };

  // Filtrar preguntas cuando cambia el capítulo seleccionado
  useEffect(() => {
    if (selectedChapter === 'all') {
      setFilteredQuestions(pendingQuestions);
    } else {
      setFilteredQuestions(pendingQuestions.filter(q => q.chapter === selectedChapter));
    }
  }, [selectedChapter, pendingQuestions]);

  const handleApprove = async (questionId: string) => {
    if (!user) return;
    
    setProcessingId(questionId);
    const result = await QuestionService.approveQuestion(questionId, user.id);
    
    if (result.success) {
      // Recargar preguntas pendientes
      await loadPendingQuestions();
    } else {
      alert(result.message);
    }
    setProcessingId(null);
  };

  const handleReject = async (questionId: string) => {
    if (!user || !rejectionReason.trim()) {
      alert('Por favor, proporciona un motivo para el rechazo');
      return;
    }
    
    setProcessingId(questionId);
    const result = await QuestionService.rejectQuestion(questionId, user.id, rejectionReason);
    
    if (result.success) {
      setRejectionReason('');
      setRejectingId(null);
      await loadPendingQuestions();
    } else {
      alert(result.message);
    }
    setProcessingId(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    const returnCategory = sessionStorage.getItem('returnCategory');
    sessionStorage.removeItem('returnCategory');
    navigate(returnCategory || '/');
  };

  const toggleQuestionExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Bungee', cursive" }}>
                  Panel de Moderación
                </h1>
                <p className="text-white/90 mt-1">
                  {user.role === 'superadmin' ? 'Super Administrador' : 'Moderador'} • {user.username}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/colaborador/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Stats y Filtro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Preguntas Pendientes</p>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                  {filteredQuestions.length}
                  {selectedChapter !== 'all' && (
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                      / {pendingQuestions.length}
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Filtro por Capítulo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <label htmlFor="chapter-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Filtrar por Capítulo
            </label>
            <select
              id="chapter-filter"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-medium"
            >
              <option value="all">Todos los capítulos ({pendingQuestions.length})</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                const count = pendingQuestions.filter(q => q.chapter === num).length;
                return (
                  <option key={num} value={num}>
                    Capítulo {num} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Lista de Preguntas Pendientes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Preguntas por Revisar
            </h3>
            {selectedChapter !== 'all' && (
              <button
                onClick={() => setSelectedChapter('all')}
                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              {pendingQuestions.length === 0 ? (
                <>
                  <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    ¡Excelente! No hay preguntas pendientes de revisión
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No hay preguntas pendientes para el capítulo {selectedChapter}
                  </p>
                  <button
                    onClick={() => setSelectedChapter('all')}
                    className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    Ver todas las preguntas
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => {
                const isExpanded = expandedQuestions.has(question.id);
                const isRejecting = rejectingId === question.id;
                const isProcessing = processingId === question.id;
                const options = [question.option_a, question.option_b, question.option_c, question.option_d];

                return (
                  <div
                    key={question.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-amber-300 dark:hover:border-amber-600 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-lg">
                            Capítulo {question.chapter}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                          </span>
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pendiente
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {question.question}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          📖 {question.verse_reference}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleQuestionExpanded(question.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {isExpanded ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Opciones (expandible) */}
                    {isExpanded && (
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Opciones:</p>
                        <div className="space-y-2">
                          {options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${
                                index === question.correct_answer
                                  ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <span className="font-bold mr-2">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option}
                              {index === question.correct_answer && (
                                <span className="ml-2 text-green-600 dark:text-green-400 text-sm font-bold">
                                  ✓ Correcta
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      Enviada el {new Date(question.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Formulario de Rechazo */}
                    {isRejecting && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                        <label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                          Motivo del rechazo:
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows={3}
                          placeholder="Explica por qué se rechaza esta pregunta..."
                        />
                      </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex gap-3">
                      {!isRejecting ? (
                        <>
                          <button
                            onClick={() => handleApprove(question.id)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="h-5 w-5" />
                            {isProcessing ? 'Procesando...' : 'Aprobar'}
                          </button>
                          <button
                            onClick={() => setRejectingId(question.id)}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-5 w-5" />
                            Rechazar
                          </button>
                          {user.role === 'superadmin' && (
                            <button
                              onClick={() => navigate(`/colaborador/editar-pregunta/${question.id}`, { state: { from: 'moderation' } })}
                              disabled={isProcessing}
                              className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Editar pregunta"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleReject(question.id)}
                            disabled={isProcessing || !rejectionReason.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-5 w-5" />
                            {isProcessing ? 'Procesando...' : 'Confirmar Rechazo'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;
