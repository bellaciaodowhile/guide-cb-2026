import { useState, useEffect } from 'react';
import { ChevronLeft, Book, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LocalBibleService } from '../services/localBibleService';
import type { ChapterInfo } from '../types/bible';
import ChapterCard from './ChapterCard';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import ScrollToTop from './ScrollToTop';
import bgConquistadores from '../assets/bg-conquistadores.webp';

const ConquistadoresDaniel: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Capítulos para Conquistadores: 1-6 (toda la primera parte narrativa)
  const conquistadoresChapters = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    loadConquistadoresChapters();
  }, []);

  const loadConquistadoresChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const allChapters = await LocalBibleService.getAllDanielChapters();
      // Filtrar solo los capítulos de Conquistadores (1-6)
      const filteredChapters = allChapters.filter(ch => conquistadoresChapters.includes(ch.chapter));
      setChapters(filteredChapters);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel para Conquistadores.');
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
          backgroundImage: `url(${bgConquistadores})`
        }}
      >
        {/* Gradiente que permite ver más imagen y se extiende detrás del header */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-40 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando capítulos para Conquistadores..." />
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
                onClick={loadConquistadoresChapters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 relative">
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
                    Conquistadores - Daniel
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Primera parte completa: Narrativa histórica
                  </p>
                </div>
              </div>
              
              {/* Botón Cambiar Categoría */}
              <button
                onClick={handleChangeCategory}
                className="change-category-btn flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
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
                  Primera Parte: Narrativa Histórica
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Capítulos 1-6 • Versículos 1:1-6:28
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Historias completas de fe y fidelidad de Daniel y sus compañeros en el exilio babilónico
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Book className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Contenido para Conquistadores
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Capítulos Bíblicos (1-6)</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Capítulo 1: Daniel y sus compañeros en Babilonia</li>
                    <li>• Capítulo 2: Daniel interpreta el sueño de Nabucodonosor</li>
                    <li>• Capítulo 3: El horno de fuego</li>
                    <li>• Capítulo 4: La locura de Nabucodonosor</li>
                    <li>• Capítulo 5: La escritura en la pared</li>
                    <li>• Capítulo 6: Daniel en el foso de los leones</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Profetas y Reyes (39-44)</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Cap. 39: En la corte de Babilonia</li>
                    <li>• Cap. 40: El sueño de Nabucodonosor</li>
                    <li>• Cap. 41: El horno de fuego</li>
                    <li>• Cap. 42: La verdadera grandeza</li>
                    <li>• Cap. 43: El vigía invisible</li>
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

export default ConquistadoresDaniel;