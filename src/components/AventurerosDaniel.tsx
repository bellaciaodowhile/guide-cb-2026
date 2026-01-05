import { useState, useEffect } from 'react';
import { ChevronLeft, Book, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LocalBibleService } from '../services/localBibleService';
import type { ChapterInfo } from '../types/bible';
import ChapterCard from './ChapterCard';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import ScrollToTop from './ScrollToTop';
import bgAventureros from '../assets/bg-aventureros.webp';

const AventurerosDaniel: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Capítulos para Aventureros: 1, 2, 3, 6
  const aventurerosChapters = [1, 2, 3, 6];

  useEffect(() => {
    loadAventurerosChapters();
  }, []);

  const loadAventurerosChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const allChapters = await LocalBibleService.getAllDanielChapters();
      // Filtrar solo los capítulos de Aventureros
      const filteredChapters = allChapters.filter(ch => aventurerosChapters.includes(ch.chapter));
      setChapters(filteredChapters);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel para Aventureros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCategory = () => {
    // Limpiar preferencias guardadas
    localStorage.removeItem('daniel-bible-preference');
    // Redirigir al home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background Hero Section */}
      <div 
        className="category-hero-bg relative h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgAventureros})`
        }}
      >
        {/* Gradiente que permite ver más imagen y se extiende detrás del header */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-40 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando capítulos para Aventureros..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Error al cargar
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={loadAventurerosChapters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
              <div className="flex flex-col md:flex-row items-start md:items-center space-x-1 md:space-x-4">
                <Link
                  to="/"
                  className="p-3 md:p-4 rounded-lg transition-colors duration-200 group absolute md:relative top-0 -left-1"
                  aria-label="Volver al inicio"
                >
                  <ChevronLeft className="h-4 md:h-5 w-4 md:w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
                </Link>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    Aventureros - Daniel
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Capítulos seleccionados para el nivel Aventureros
                  </p>
                </div>
              </div>
              
              {/* Botón Cambiar Categoría */}
              <button
                onClick={handleChangeCategory}
                className="change-category-btn flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                title="Cambiar categoría"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Cambiar categoría</span>
              </button>
            </div>
            {/* Stats */}
            <StatsCard chapters={chapters} />

            {/* Chapters Grid */}
            <div className="space-y-8">
              <div className="mb-8 px-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Capítulos Seleccionados para Aventureros
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Historias fundamentales de fe y fidelidad en el exilio
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapter}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChapterCard
                      chapter={chapter}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Contenido para Aventureros
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Capítulos Bíblicos</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Capítulo 1: Daniel y sus compañeros en Babilonia</li>
                    <li>• Capítulo 2: Daniel interpreta el sueño de Nabucodonosor</li>
                    <li>• Capítulo 3: El horno de fuego</li>
                    <li>• Capítulo 6: Daniel en el foso de los leones</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Profetas y Reyes</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Cap. 39: En la corte de Babilonia</li>
                    <li>• Cap. 41: El horno de fuego</li>
                    <li>• Cap. 44: En el foso de los leones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default AventurerosDaniel;