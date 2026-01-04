import { useState, useEffect } from 'react';
import { ArrowLeft, Book, AlertTriangle, Users } from 'lucide-react';
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

const AventurerosDaniel: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ApiResponse | null>(null);
  const [selectedPRChapter, setSelectedPRChapter] = useState<PRChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [loadingPRChapter, setLoadingPRChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chapters' | 'bible' | 'pr'>('chapters');

  // Capítulos para Aventureros: 1, 2, 3, 6
  const aventurerosChapters = [1, 2, 3, 6];
  // PR Capítulos correspondientes: 39 (cap 1), 41 (cap 3), 44 (cap 6)
  const aventurerosPRMapping: { [key: number]: number } = {
    1: 39, // Daniel 1 -> PR 39
    3: 41, // Daniel 3 -> PR 41  
    6: 44  // Daniel 6 -> PR 44
  };

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
                  <Users className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
                  Aventureros - Daniel
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Capítulos seleccionados para el nivel Aventureros
                </p>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Aventureros: Historias de Fe
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Descubre las emocionantes historias de Daniel y sus amigos en Babilonia. 
                Aprende sobre la fidelidad, el valor y la confianza en Dios a través de 
                estas narrativas inspiradoras.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span>📖 4 Capítulos</span>
                <span>•</span>
                <span>📝 {chapters.reduce((sum, ch) => sum + ch.verseCount, 0)} Versículos</span>
                <span>•</span>
                <span>📚 3 Capítulos PR</span>
              </div>
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
                      onClick={() => handleChapterClick(chapter.chapter)}
                      onPRClick={aventurerosPRMapping[chapter.chapter] ? () => handlePRChapterClick(chapter.chapter) : undefined}
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