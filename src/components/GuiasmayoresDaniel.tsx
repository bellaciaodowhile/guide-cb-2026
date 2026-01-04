import { useState, useEffect } from 'react';
import { ArrowLeft, Book, AlertTriangle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LocalBibleService } from '../services/localBibleService';
import { PRService } from '../services/prService';
import type { ChapterInfo, ApiResponse, PRChapter } from '../types/bible';
import ChapterCard from './ChapterCard';
import ChapterDetail from './ChapterDetail';
import PRChapterDetail from './PRChapterDetail';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import ScrollToTop from './ScrollToTop';

const GuiasmayoresDaniel: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ApiResponse | null>(null);
  const [selectedPRChapter, setSelectedPRChapter] = useState<PRChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [loadingPRChapter, setLoadingPRChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chapters' | 'bible' | 'pr'>('chapters');

  useEffect(() => {
    loadGuiasmayoresChapters();
  }, []);

  const loadGuiasmayoresChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      // Para Guías Mayores: todos los capítulos (1-12)
      const allChapters = await LocalBibleService.getAllDanielChapters();
      setChapters(allChapters);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel para Guías Mayores.');
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
      setSelectedPRChapter(null);
      setViewMode('bible');
    } catch (err) {
      setError(`Error al cargar el capítulo ${chapterNumber}.`);
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
      setSelectedChapter(null);
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando capítulos para Guías Mayores..." />
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
                onClick={loadGuiasmayoresChapters}
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
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/"
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Crown className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400" />
                  Guías Mayores - Daniel
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Estudio completo: Narrativa histórica y visiones proféticas
                </p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Guías Mayores: Estudio Completo
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explora el libro completo de Daniel: desde las historias de fidelidad en el exilio 
                hasta las profundas visiones apocalípticas sobre el futuro de los reinos y el plan 
                divino para la historia.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>📖 12 Capítulos</span>
                <span>•</span>
                <span>📝 {chapters.reduce((sum, ch) => sum + ch.verseCount, 0)} Versículos</span>
                <span>•</span>
                <span>📚 6 Capítulos PR</span>
                <span>•</span>
                <span>🔮 Profecías</span>
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

            {/* Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Contenido para Guías Mayores
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Narrativa (1-6)</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Daniel y sus compañeros</li>
                    <li>• Sueño de Nabucodonosor</li>
                    <li>• El horno de fuego</li>
                    <li>• La locura del rey</li>
                    <li>• La escritura en la pared</li>
                    <li>• El foso de los leones</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Visiones (7-12)</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Las cuatro bestias</li>
                    <li>• El carnero y el macho cabrío</li>
                    <li>• Las setenta semanas</li>
                    <li>• Visión junto al río</li>
                    <li>• Reyes del norte y sur</li>
                    <li>• El tiempo del fin</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-600 dark:text-purple-400 mb-2">Profetas y Reyes</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• En la corte de Babilonia</li>
                    <li>• El sueño de Nabucodonosor</li>
                    <li>• El horno de fuego</li>
                    <li>• La verdadera grandeza</li>
                    <li>• El vigía invisible</li>
                    <li>• En el foso de los leones</li>
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

export default GuiasmayoresDaniel;