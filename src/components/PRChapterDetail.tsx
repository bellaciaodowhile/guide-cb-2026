import { ArrowLeft, Book, Quote, FileText, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PRChapter } from '../types/bible';
import LoadingSpinner from './LoadingSpinner';

interface PRChapterDetailProps {
  chapter: PRChapter | null;
  onBack: () => void;
  onNavigate: (chapterNumber: number) => void;
  onGoToBible: (chapterNumber: number) => void;
  loading: boolean;
}

const PRChapterDetail: React.FC<PRChapterDetailProps> = ({ chapter, onBack, onNavigate, onGoToBible, loading }) => {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') ? `?from=${searchParams.get('from')}` : '';
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Cargando capítulo de Profetas y Reyes..." />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Capítulo no encontrado
          </h3>
          <p className="text-red-600 dark:text-red-300">
            No se pudo cargar el capítulo de Profetas y Reyes.
          </p>
        </div>
      </div>
    );
  }

  const hasPrevious = chapter.danielChapter > 1;
  const hasNext = chapter.danielChapter < 6; // Solo hay PR para capítulos 1-6

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver a los capítulos</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-0 md:mb-4 animate-slide-up">
          <div className="flex items-start space-x-1 md:space-x-4">
            <div className="hidden md:block p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Book className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {chapter.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Profetas y Reyes - Elena G. White
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* Botón para ir al capítulo bíblico */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Contenido Bíblico Relacionado
          </h4>
          <p className="text-blue-600 dark:text-blue-300 mb-4">
            Lee el capítulo bíblico correspondiente en el libro de Daniel
          </p>
          <Link
            to={`/bible/daniel/${chapter.danielChapter}${fromParam}`}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Book className="h-4 w-4" />
            <span>Leer Daniel {chapter.danielChapter}</span>
          </Link>
        </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Quote className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Contenido del Capítulo
          </h3>
        </div>
        
        <div className="p-0 md:p-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {chapter.paragraphs.map((paragraph, index) => (
              <div
                key={paragraph.id}
                className={`p-4 rounded-lg transition-colors duration-200 animate-slide-up ${
                  paragraph.hasQuote
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700/30'
                }`}
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                {paragraph.hasQuote && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Quote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Contiene cita bíblica
                    </span>
                  </div>
                )}
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-justify">
                  {paragraph.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 space-y-4">
        {/* Navigation - Desktop */}
        <div className="hidden min-[750px]:block">
          {/* Navegación entre capítulos */}
          <div className="flex sm:flex-row items-center justify-between sm:space-y-0 sm:space-x-4">
            {/* Botón Anterior */}
            <div className="flex-1 w-full sm:w-auto">
              {hasPrevious ? (
                <Link
                  to={`/profetas-y-reyes/${chapter.danielChapter + 37}${fromParam}`}
                  className="w-full px-2 md:px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Cap. {chapter.danielChapter - 1}</span>
                </Link>
              ) : (
                <div className="w-full px-2 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Primer cap.</span>
                </div>
              )}
            </div>

            {/* Botón Volver */}
            <button
              onClick={onBack}
              className="px-2 md:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>

            {/* Botón Siguiente */}
            <div className="flex-1 w-full sm:w-auto">
              {hasNext ? (
                <Link
                  to={`/profetas-y-reyes/${chapter.danielChapter + 39}${fromParam}`}
                  className="w-full px-2 md:px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <span>Cap. {chapter.danielChapter + 1}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="w-full px-2 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed">
                  <span>Último cap.</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional - Solo en desktop */}
        <div className="hidden min-[750px]:block bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Acerca de "Profetas y Reyes"
          </h4>
          <p className="text-purple-600 dark:text-purple-300 max-w-3xl mx-auto">
            Este libro de Elena G. White presenta la historia del pueblo de Dios desde los días 
            de Salomón hasta la restauración después del cautiverio babilónico. Los capítulos 
            relacionados con Daniel muestran cómo Dios obró a través de sus siervos fieles 
            durante el exilio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PRChapterDetail;