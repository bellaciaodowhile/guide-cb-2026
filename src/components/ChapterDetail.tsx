import { ArrowLeft, Book, Hash, Quote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { ApiResponse } from '../types/bible';
import { CHAPTER_DETAILS } from '../utils/constants';
import { PRService } from '../services/prService';
import LoadingSpinner from './LoadingSpinner';

interface ChapterDetailProps {
  chapter: ApiResponse;
  onBack: () => void;
  onNavigate: (chapterNumber: number) => void;
  onGoToPR: (chapterNumber: number) => void;
  loading: boolean;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapter, onBack, onNavigate, onGoToPR, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner text="Cargando capítulo..." />
      </div>
    );
  }

  const chapterDetail = CHAPTER_DETAILS[chapter.chapter as keyof typeof CHAPTER_DETAILS];
  const hasPrevious = chapter.chapter > 1;
  const hasNext = chapter.chapter < 12;
  const hasPRChapter = chapter.chapter <= 6; // Solo los primeros 6 capítulos tienen PR
  const prChapterTitle = hasPRChapter ? PRService.getPRChapterTitle(chapter.chapter) : null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
          aria-label="Volver a capítulos"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Daniel {chapter.chapter}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {chapter.verses.length} versículos
          </p>
        </div>
      </div>

      {/* Chapter Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4 md:mb-6 animate-slide-up">
        <div className="flex-col md:flex items-start space-x-1 md:space-x-4">
          <div className="hidden md:block p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {chapterDetail.title}
            </h2>
            {chapterDetail.subtitle && (
              <p className="text-primary-700 dark:text-primary-300 font-medium mb-3">
                {/* {chapterDetail.subtitle} */}
              </p>
            )}
            {chapterDetail.summary && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {chapterDetail.summary}
              </p>
            )}
            
            {/* Secciones especiales para el capítulo 9 */}
            {chapter.chapter === 9 && 'sections' in chapterDetail && chapterDetail.sections && (
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Secciones del capítulo:
                </h4>
                {chapterDetail.sections.map((section: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-primary-200 dark:border-primary-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-0 md:flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                          {section.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                      <span className="text-xs font-mono bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                        vs. {section.verses}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Botón para ir a Profetas y Reyes (solo para capítulos 1-6) */}
        {hasPRChapter && prChapterTitle && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 md:p-6 border border-purple-200 dark:border-purple-800 mb-4 md:mb-6">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Contenido Relacionado
            </h4>
            <p className="text-purple-600 dark:text-purple-300 mb-4">
              Lee el comentario inspirado sobre este capítulo en Profetas y Reyes
            </p>
            <button
              onClick={() => onGoToPR(chapter.chapter)}
              className="w-full sm:w-auto px-2 md:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Book className="hidden md:block h-4 w-4" />
              <span>Leer: {prChapterTitle}</span>
            </button>
          </div>
        )}

      {/* Verses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Quote className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            Versículos
          </h3>
        </div>
        
        <div className="p-0 md:p-6">
          <div>
            {chapter.verses.map((verse, index) => (
              <div
                key={verse.verse}
                className="flex space-x-2 md:space-x-4 p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  <span className="font-bold">
                    {verse.verse}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg">
                    {verse.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 space-y-4">
        {/* Navegación entre capítulos */}
        <div className="flex sm:flex-row items-center justify-between sm:space-y-0 sm:space-x-4">
          {/* Botón Anterior */}
          <div className="flex-1 w-full sm:w-auto">
            {hasPrevious ? (
              <button
                onClick={() => onNavigate(chapter.chapter - 1)}
                className="w-full px-2 md:px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Cap. {chapter.chapter - 1}</span>
              </button>
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
            className="px-2 md:px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Capítulos</span>
          </button>

          {/* Botón Siguiente */}
          <div className="flex-1 w-full sm:w-auto">
            {hasNext ? (
              <button
                onClick={() => onNavigate(chapter.chapter + 1)}
                className="w-full px-2 md:px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <span>Cap. {chapter.chapter + 1}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="w-full px-2 md:px-6 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed">
                <span>Último cap.</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;