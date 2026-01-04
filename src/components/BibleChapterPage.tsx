import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LocalBibleService } from '../services/localBibleService';
import type { ApiResponse } from '../types/bible';
import ChapterDetail from './ChapterDetail';
import MobileNavigation from './MobileNavigation';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

const BibleChapterPage: React.FC = () => {
  const { chapterNumber } = useParams<{ chapterNumber: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chapter, setChapter] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chapterNumber) {
      loadChapter(parseInt(chapterNumber));
    }
  }, [chapterNumber]);

  const loadChapter = async (chapterNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const chapterData = await LocalBibleService.getChapter(chapterNum);
      setChapter(chapterData);
    } catch (err) {
      setError(`Error al cargar el capítulo ${chapterNum}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToBible = (chapterNum: number) => {
    navigate(`/bible/daniel/${chapterNum}`);
  };

  const handleNavigateToPR = (chapterNum: number) => {
    navigate(`/profetas-y-reyes/${chapterNum + 38}`); // Daniel 1 = PR 39, etc.
  };

  const handleBack = () => {
    // Primero verificar si hay un parámetro 'from' en la URL
    const fromCategory = searchParams.get('from');
    
    if (fromCategory && ['aventureros', 'conquistadores', 'guiasmayores'].includes(fromCategory)) {
      navigate(`/${fromCategory}`);
      return;
    }
    
    // Si no hay parámetro 'from', usar la lógica por defecto basada en el capítulo
    if (!chapter) return;
    
    const chapterNum = chapter.chapter;
    
    // Aventureros: capítulos 1, 2, 3, 6
    const aventurerosChapters = [1, 2, 3, 6];
    // Conquistadores: capítulos 1-6
    const conquistadoresChapters = [1, 2, 3, 4, 5, 6];
    
    if (aventurerosChapters.includes(chapterNum)) {
      navigate('/aventureros');
    } else if (conquistadoresChapters.includes(chapterNum)) {
      navigate('/conquistadores');
    } else {
      navigate('/guiasmayores');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <LoadingSpinner size="lg" text="Cargando capítulo..." />
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Error al cargar
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => chapterNumber && loadChapter(parseInt(chapterNumber))}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative chapter-page-container">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 min-[750px]:pb-8">
        <ChapterDetail
          chapter={chapter}
          onBack={handleBack}
          onNavigate={handleNavigateToBible}
          onGoToPR={handleNavigateToPR}
          loading={false}
        />
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation
        currentChapter={chapter.chapter}
        totalChapters={12}
        onBack={handleBack}
        getNavigationUrl={(chapterNum) => `/bible/daniel/${chapterNum}`}
        fromParam={searchParams.get('from') ? `?from=${searchParams.get('from')}` : ''}
        buttonColor="primary"
      />
    </div>
  );
};

export default BibleChapterPage;