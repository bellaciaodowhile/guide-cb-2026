import { useState, useEffect } from 'react';
import { Moon, Sun, Book, AlertTriangle } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { LocalBibleService } from './services/localBibleService';
import { PRService } from './services/prService';
import type { ChapterInfo, ApiResponse, PRChapter } from './types/bible';
import ChapterCard from './components/ChapterCard';
import ChapterDetail from './components/ChapterDetail';
import PRChapterDetail from './components/PRChapterDetail';
import LoadingSpinner from './components/LoadingSpinner';
import StatsCard from './components/StatsCard';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ApiResponse | null>(null);
  const [selectedPRChapter, setSelectedPRChapter] = useState<PRChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [loadingPRChapter, setLoadingPRChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chapters' | 'bible' | 'pr'>('chapters');

  useEffect(() => {
    loadDanielChapters();
  }, []);

  const loadDanielChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const chaptersData = await LocalBibleService.getAllDanielChapters();
      setChapters(chaptersData);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel desde los datos locales.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapterNumber: number) => {
    try {
      setLoadingChapter(true);
      setError(null);
      const chapterData = await LocalBibleService.getChapter(chapterNumber);
      setSelectedChapter(chapterData);
      setSelectedPRChapter(null); // Limpiar PR chapter
      setViewMode('bible');
    } catch (err) {
      setError(`Error al cargar el capítulo ${chapterNumber} desde los datos locales.`);
      console.error(err);
    } finally {
      setLoadingChapter(false);
    }
  };

  const handlePRChapterClick = async (chapterNumber: number) => {
    try {
      setLoadingPRChapter(true);
      setError(null);
      const prChapterData = await PRService.getPRChapter(chapterNumber);
      setSelectedPRChapter(prChapterData);
      setSelectedChapter(null); // Limpiar Bible chapter
      setViewMode('pr');
    } catch (err) {
      setError(`Error al cargar el capítulo de Profetas y Reyes para Daniel ${chapterNumber}.`);
      console.error(err);
    } finally {
      setLoadingPRChapter(false);
    }
  };

  const handleNavigateToBible = (chapterNumber: number) => {
    handleChapterClick(chapterNumber);
  };

  const handleNavigateToPR = (chapterNumber: number) => {
    handlePRChapterClick(chapterNumber);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setSelectedPRChapter(null);
    setViewMode('chapters');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Libro de Daniel
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reina Valera 1995
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando el libro de Daniel..." />
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
                onClick={loadDanielChapters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : selectedChapter && viewMode === 'bible' ? (
          <ChapterDetail
            chapter={selectedChapter}
            onBack={handleBackToChapters}
            onNavigate={handleNavigateToBible}
            onGoToPR={handleNavigateToPR}
            loading={loadingChapter}
          />
        ) : selectedPRChapter && viewMode === 'pr' ? (
          <PRChapterDetail
            chapter={selectedPRChapter}
            onBack={handleBackToChapters}
            onNavigate={handleNavigateToPR}
            onGoToBible={handleNavigateToBible}
            loading={loadingPRChapter}
          />
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Explora el Libro de Daniel
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Descubre las fascinantes historias de fe y las profundas visiones proféticas 
                del libro de Daniel. La primera parte (capítulos 1-6) narra historias de fidelidad 
                en el exilio, mientras que la segunda parte (capítulos 7-12) revela visiones 
                apocalípticas sobre el futuro de los reinos y el plan divino.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>📖 2 Partes</span>
                <span>•</span>
                <span>📝 {chapters.reduce((sum, ch) => sum + ch.verseCount, 0)} Versículos</span>
                <span>•</span>
                <span>🏛️ Narrativa (1-6)</span>
                <span>•</span>
                <span>🔮 Profecías (7-12)</span>
              </div>
            </div>

            {/* Stats */}
            <StatsCard chapters={chapters} />

            {/* Chapters Grid - Divided into Two Parts */}
            <div className="space-y-12">
              {/* Primera Parte: Narrativa */}
              <div className="book-section narrative">
                <div className="mb-8 px-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Primera Parte: Narrativa Histórica
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Capítulos 1-6 • Versículos 1:1-6:28
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Historias de fe y fidelidad de Daniel y sus compañeros en el exilio babilónico
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.filter(chapter => chapter.chapter >= 1 && chapter.chapter <= 6).map((chapter, index) => (
                    <div
                      key={chapter.chapter}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ChapterCard
                        chapter={chapter}
                        onClick={() => handleChapterClick(chapter.chapter)}
                        onPRClick={() => handlePRChapterClick(chapter.chapter)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Segunda Parte: Visiones Apocalípticas */}
              <div className="book-section visions">
                <div className="mb-8 px-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Segunda Parte: Visiones Apocalípticas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Capítulos 7-12 • Versículos 7:1-12:13
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Profecías y visiones sobre los reinos futuros y el plan divino para la historia
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.filter(chapter => chapter.chapter >= 7 && chapter.chapter <= 12).map((chapter, index) => (
                    <div
                      key={chapter.chapter}
                      className="animate-fade-in"
                      style={{ animationDelay: `${(index + 6) * 100}ms` }}
                    >
                      <ChapterCard
                        chapter={chapter}
                        onClick={() => handleChapterClick(chapter.chapter)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Acerca del Libro de Daniel
              </h4>
              <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                El libro de Daniel se divide en dos partes distintas: la primera parte (capítulos 1-6) 
                contiene narrativas históricas que muestran la fidelidad de Daniel y sus amigos en el 
                exilio babilónico, mientras que la segunda parte (capítulos 7-12) presenta visiones 
                apocalípticas sobre el futuro de los reinos mundiales y el plan de Dios para Su pueblo 
                hasta el tiempo del fin.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              By{' '}
              <a
                href="mailto:codezardi@gmail.com"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200 hover:underline"
              >
                Codezardi
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
