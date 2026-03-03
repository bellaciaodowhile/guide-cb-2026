import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { QuestionService } from '../services/questionService';
import { LogOut, Plus, Clock, CheckCircle, XCircle, Award, TrendingUp, Sparkles, Home, ChevronDown, Edit } from 'lucide-react';
import type { User, CollaborativeQuestion } from '../types/collaboration';

const CollaboratorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<CollaborativeQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<CollaborativeQuestion[]>([]);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<number | 'all'>('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [userStatsByChapter, setUserStatsByChapter] = useState<Record<number, number>>({});
  const [globalStatsByChapter, setGlobalStatsByChapter] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [isChapterStatsOpen, setIsChapterStatsOpen] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadData(currentUser.id);
  }, [navigate]);

  const loadData = async (userId: string) => {
    setLoading(true);
    const [userQuestions, userStats, userChapterStats, globalChapterStats] = await Promise.all([
      QuestionService.getUserQuestions(userId),
      QuestionService.getUserStats(userId),
      QuestionService.getUserStatsByChapter(userId),
      QuestionService.getGlobalStatsByChapter()
    ]);
    setQuestions(userQuestions);
    setFilteredQuestions(userQuestions);
    setStats(userStats);
    setUserStatsByChapter(userChapterStats);
    setGlobalStatsByChapter(globalChapterStats);
    setLoading(false);
  };

  // Filtrar preguntas cuando cambia el capítulo seleccionado
  useEffect(() => {
    if (selectedChapterFilter === 'all') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.chapter === selectedChapterFilter));
    }
  }, [selectedChapterFilter, questions]);

  const handleLogout = () => {
    AuthService.logout();
    // Obtener la categoría de retorno guardada
    const returnCategory = sessionStorage.getItem('returnCategory');
    // Limpiar el sessionStorage
    sessionStorage.removeItem('returnCategory');
    // Navegar a la categoría o al home si no hay categoría guardada
    navigate(returnCategory || '/');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      collaborator: 'Colaborador',
      trusted_collaborator: 'Colaborador Confiable',
      moderator: 'Moderador',
      superadmin: 'Super Admin'
    };
    return labels[role] || role;
  };

  const getRoleGradient = (role: string) => {
    const gradients: Record<string, string> = {
      collaborator: 'from-blue-500 to-cyan-500',
      trusted_collaborator: 'from-purple-500 to-pink-500',
      moderator: 'from-green-500 to-emerald-500',
      superadmin: 'from-red-500 to-orange-500'
    };
    return gradients[role] || 'from-gray-500 to-gray-600';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      pending: { icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-500', label: 'En Espera' },
      approved: { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500', label: 'Aprobada' },
      rejected: { icon: <XCircle className="h-4 w-4" />, color: 'bg-red-500', label: 'Rechazada' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  };

  if (!user) return null;

  const progressPercentage = Math.min((stats.approved / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header con gradiente */}
      <div className={`bg-gradient-to-r ${getRoleGradient(user.role)} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Bungee', cursive" }}>
                  {user.username}
                </h1>
                <p className="text-white/90 mt-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {getRoleLabel(user.role)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const returnCategory = sessionStorage.getItem('returnCategory');
                  navigate(returnCategory || '/');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Inicio</span>
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
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card: Panel de Moderación (solo para moderadores y superadmins) */}
          {(user.role === 'moderator' || user.role === 'superadmin') && (
            <div className="lg:col-span-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                 onClick={() => navigate('/colaborador/moderacion')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Bungee', cursive" }}>
                    Panel de Moderación
                  </h3>
                  <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-white/90 mb-4">
                  Revisa y aprueba preguntas pendientes
                </p>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>Gestiona el banco de preguntas</span>
                </div>
              </div>
            </div>
          )}

          {/* Card: Nueva Pregunta - Destacada */}
          <div className={`${(user.role === 'moderator' || user.role === 'superadmin') ? 'lg:col-span-2' : 'md:col-span-2 lg:col-span-4'} bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform`}
               onClick={() => navigate('/colaborador/nueva-pregunta')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Bungee', cursive" }}>
                  Crear Pregunta
                </h3>
                <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
              <p className="text-white/90 mb-4">
                Contribuye al banco de preguntas bíblicas
              </p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Sparkles className="h-4 w-4" />
                <span>Cada pregunta aprobada suma puntos</span>
              </div>
            </div>
          </div>

          {/* Card: Total */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Enviadas</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>

          {/* Card: Aprobadas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Aprobadas</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
          </div>

          {/* Card: En Espera */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">En Espera</p>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </div>

          {/* Card: Rechazadas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Rechazadas</p>
            <p className="text-4xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
          </div>

          {/* Card: Progreso - Solo para colaboradores */}
          {user.role === 'collaborator' && (
            <div className="md:col-span-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg">Progreso</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Colaborador Confiable</span>
                  <span className="font-bold">{stats.approved}/10</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-white/80">
                {10 - stats.approved > 0
                  ? `¡${10 - stats.approved} más para el siguiente nivel!`
                  : '¡Nivel alcanzado! 🎉'}
              </p>
            </div>
          )}
        </div>

        {/* Distribución por Capítulos - Accordion */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden">
          {/* Accordion Header */}
          <button
            onClick={() => setIsChapterStatsOpen(!isChapterStatsOpen)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Distribución por Capítulos
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ve qué capítulos necesitan más preguntas
                </p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ease-in-out ${isChapterStatsOpen ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          </button>

          {/* Accordion Content */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isChapterStatsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className={`px-6 pb-6 transition-all duration-500 delay-75 ${
              isChapterStatsOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
            }`}>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(chapter => {
                    const userCount = userStatsByChapter[chapter] || 0;
                    const globalCount = globalStatsByChapter[chapter] || 0;
                    const maxGlobal = Math.max(...Object.values(globalStatsByChapter), 1);
                    const percentage = (globalCount / maxGlobal) * 100;
                    
                    return (
                      <div
                        key={chapter}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Cap. {chapter}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {globalCount} total
                          </span>
                        </div>
                        
                        {/* Barra de progreso global */}
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        {/* Contador del usuario */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Tus preguntas:
                          </span>
                          <span className={`text-lg font-bold ${
                            userCount > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {userCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>💡 Consejo:</strong> Intenta crear preguntas para capítulos con menos contenido. 
                    Esto ayuda a mantener un banco de preguntas equilibrado para todos los usuarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Preguntas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mis Preguntas
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredQuestions.length} {filteredQuestions.length === 1 ? 'pregunta' : 'preguntas'}
                {selectedChapterFilter !== 'all' && ` / ${questions.length} total`}
              </span>
            </div>

            {/* Filtro por Capítulo */}
            <div className="flex items-center gap-3">
              {selectedChapterFilter !== 'all' && (
                <button
                  onClick={() => setSelectedChapterFilter('all')}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium whitespace-nowrap"
                >
                  Limpiar filtro
                </button>
              )}
              <select
                value={selectedChapterFilter}
                onChange={(e) => setSelectedChapterFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
              >
                <option value="all">Todos los capítulos</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                  const count = questions.filter(q => q.chapter === num).length;
                  return count > 0 ? (
                    <option key={num} value={num}>
                      Capítulo {num} ({count})
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              {questions.length === 0 ? (
                <>
                  <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    Aún no has enviado ninguna pregunta
                  </p>
                  <button
                    onClick={() => navigate('/colaborador/nueva-pregunta')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all shadow-lg"
                    style={{ fontFamily: "'Bungee', cursive" }}
                  >
                    Crear tu primera pregunta
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    No tienes preguntas para el capítulo {selectedChapterFilter}
                  </p>
                  <button
                    onClick={() => setSelectedChapterFilter('all')}
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    Ver todas tus preguntas
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => {
                const statusBadge = getStatusBadge(question.status);
                return (
                  <div
                    key={question.id}
                    className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-lg">
                            Cap. {question.chapter}
                          </span>
                          <span className={`flex items-center gap-1 px-3 py-1 ${statusBadge.color} text-white text-sm rounded-lg font-medium`}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                            {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                          {question.question}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          📖 {question.verse_reference}
                        </p>
                      </div>
                      
                      {/* Botón de editar (solo para moderadores y superadmin) */}
                      {(user.role === 'superadmin' || user.role === 'moderator') && (
                        <button
                          onClick={() => navigate(`/colaborador/editar-pregunta/${question.id}`, { state: { from: 'dashboard' } })}
                          className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors group"
                          title="Editar pregunta"
                        >
                          <Edit className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </button>
                      )}
                    </div>

                    {question.status === 'rejected' && question.rejection_reason && (
                      <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>Motivo:</strong> {question.rejection_reason}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                      Enviada el {new Date(question.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
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

export default CollaboratorDashboard;
