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
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
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
      const result = await QuestionService.submitQuestion(currentUser.id, formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          const returnCategory = sessionStorage.getItem('returnCategory');
          if (returnCategory) {
            navigate(returnCategory);
          } else {
            navigate('/colaborador/dashboard');
          }
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
      [name]: name === 'chapter' || name === 'correct_answer' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              const returnCategory = sessionStorage.getItem('returnCategory');
              if (returnCategory) {
                navigate(returnCategory);
              } else {
                navigate('/colaborador/dashboard');
              }
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
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

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dificultad
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                const returnCategory = sessionStorage.getItem('returnCategory');
                if (returnCategory) {
                  navigate(returnCategory);
                } else {
                  navigate('/colaborador/dashboard');
                }
              }}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
