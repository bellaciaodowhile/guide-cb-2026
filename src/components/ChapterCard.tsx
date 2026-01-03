import { BookOpen, Hash, ArrowRight, Book } from 'lucide-react';
import type { ChapterInfo } from '../types/bible';
import { PRService } from '../services/prService';

interface ChapterCardProps {
  chapter: ChapterInfo;
  onClick: () => void;
  onPRClick?: () => void; // Nueva prop para Profetas y Reyes
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick, onPRClick }) => {
  // Solo mostrar botón de PR para los primeros 6 capítulos (narrativa)
  const showPRButton = chapter.chapter <= 6 && onPRClick;
  
  // Obtener el título del capítulo de Profetas y Reyes
  const prChapterTitle = showPRButton ? PRService.getPRChapterTitle(chapter.chapter) : null;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors duration-300">
            <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
            {chapter.chapter}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
          {chapter.title}
        </h3>
        
        {chapter.subtitle && (
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            {chapter.subtitle}
          </p>
        )}
        
        {chapter.summary && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {chapter.summary}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Hash className="h-4 w-4" />
            <span>{chapter.verseCount} versículos</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Botón principal para leer el capítulo bíblico */}
          <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200 group/btn"
          >
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Leer capítulo bíblico
            </span>
            <ArrowRight className="h-4 w-4 text-primary-600 dark:text-primary-400 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>

          {/* Botón para Profetas y Reyes (solo para capítulos 1-6) */}
          {showPRButton && prChapterTitle && (
            <button
              onClick={onPRClick}
              className="w-full p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200 group/btn text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Book className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-green-900 dark:text-green-600">
                      Profetas y Reyes:
                    </span>
                  </div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 line-clamp-2 leading-tight">
                    {prChapterTitle}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400 transform group-hover/btn:translate-x-1 transition-transform duration-200 flex-shrink-0 ml-2 mt-1" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;