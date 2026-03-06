import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { QuestionService } from '../services/questionService';
import { AuthService } from '../services/authService';

const NewQuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [formData, setFormData] = useState({
    chapter: 1,
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 0,
    verse_reference: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    show_author: true,
    time_limit: 20,
    points: 20
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await QuestionService.submitQuestion(currentUser.id, formData, currentUser.role);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/colaborador/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al enviar la pregunta');
      console.error('Error submitting question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'chapter' || name === 'correct_answer' || name === 'time_limit' || name === 'points' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Save className="h-6 w-6 text-amber-500 animate-pulse" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Bungee', cursive" }}>
                Enviando pregunta...
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Estamos guardando tu pregunta en el banco de preguntas
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/colaborador/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Bungee', cursive" }}>
            Nueva Pregunta
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Crea una pregunta basada en el libro de Daniel (Reina Valera 1995)
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">¡Pregunta enviada exitosamente! Será revisada por un moderador.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Chapter Selection */}
          <div>
            <label htmlFor="chapter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capítulo de Daniel
            </label>
            <select
              id="chapter"
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>Capítulo {num}</option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pregunta
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Escribe tu pregunta aquí..."
              required
              minLength={10}
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="option_a" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opción A
              </label>
              <input
                type="text"
                id="option_a"
                name="option_a"
                value={formData.option_a}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Primera opción"
                required
              />
            </div>

            <div>
              <label htmlFor="option_b" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opción B
              </label>
              <input
                type="text"
                id="option_b"
                name="option_b"
                value={formData.option_b}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Segunda opción"
                required
              />
            </div>

            <div>
              <label htmlFor="option_c" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opción C
              </label>
              <input
                type="text"
                id="option_c"
                name="option_c"
                value={formData.option_c}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Tercera opción"
                required
              />
            </div>

            <div>
              <label htmlFor="option_d" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Opción D
              </label>
              <input
                type="text"
                id="option_d"
                name="option_d"
                value={formData.option_d}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Cuarta opción"
                required
              />
            </div>
          </div>

          {/* Correct Answer */}
          <div>
            <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Respuesta Correcta
            </label>
            <select
              id="correct_answer"
              name="correct_answer"
              value={formData.correct_answer}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value={0}>Opción A</option>
              <option value={1}>Opción B</option>
              <option value={2}>Opción C</option>
              <option value={3}>Opción D</option>
            </select>
          </div>

          {/* Verse Reference */}
          <div>
            <label htmlFor="verse_reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Referencia Bíblica
            </label>
            <input
              type="text"
              id="verse_reference"
              name="verse_reference"
              value={formData.verse_reference}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ej: Daniel 1:8"
              required
            />
          </div>

          {/* Time Limit and Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiempo Límite (segundos)
              </label>
              <select
                id="time_limit"
                name="time_limit"
                value={formData.time_limit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value={20}>20 segundos</option>
                <option value={25}>25 segundos</option>
                <option value={30}>30 segundos</option>
                <option value={35}>35 segundos</option>
                <option value={40}>40 segundos</option>
                <option value={45}>45 segundos</option>
                <option value={50}>50 segundos</option>
              </select>
            </div>

            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Puntos
              </label>
              <select
                id="points"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value={20}>20 puntos</option>
                <option value={25}>25 puntos</option>
                <option value={30}>30 puntos</option>
                <option value={35}>35 puntos</option>
                <option value={40}>40 puntos</option>
                <option value={45}>45 puntos</option>
                <option value={50}>50 puntos</option>
                <option value={55}>55 puntos</option>
                <option value={60}>60 puntos</option>
              </select>
            </div>
          </div>

          {/* Show Author Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex-1">
              <label htmlFor="show_author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar mi nombre como autor
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Si está activado, tu nombre de usuario será visible en los resultados del quiz
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, show_author: !prev.show_author }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                formData.show_author ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.show_author ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/colaborador/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Bungee', cursive" }}
            >
              <Save className="h-5 w-5" />
              {loading ? 'Enviando...' : 'Enviar Pregunta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuestionForm;
