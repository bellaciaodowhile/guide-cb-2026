import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onBack: () => void;
  getNavigationUrl: (chapter: number) => string;
  fromParam: string;
  buttonColor?: 'primary' | 'purple';
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentChapter,
  totalChapters,
  onBack,
  getNavigationUrl,
  fromParam,
  buttonColor = 'primary'
}) => {
  const hasPrevious = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;
  
  const buttonColorClasses = buttonColor === 'purple' 
    ? 'bg-purple-600 hover:bg-purple-700' 
    : 'bg-primary-600 hover:bg-primary-700';

  return (
    <>
      {/* Mobile Navigation - Fixed Bottom */}
      <div className="min-[750px]:hidden mobile-navigation-container">
        {/* Spacer for fixed navigation */}
        <div className="h-20"></div>
        
        {/* Fixed Bottom Navigation */}
        <div 
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg mobile-navigation-container"
        >
          <div className="flex items-center justify-between space-x-3">
            {/* Botón Anterior */}
            <div className="flex-1">
              {hasPrevious ? (
                <Link
                  to={`${getNavigationUrl(currentChapter - 1)}${fromParam}`}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Cap. {currentChapter - 1}</span>
                </Link>
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed text-sm">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Primer</span>
                </div>
              )}
            </div>

            {/* Botón Volver */}
            <button
              onClick={onBack}
              className={`px-4 py-2 ${buttonColorClasses} text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-1 text-sm`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>

            {/* Botón Siguiente */}
            <div className="flex-1">
              {hasNext ? (
                <Link
                  to={`${getNavigationUrl(currentChapter + 1)}${fromParam}`}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                >
                  <span>Cap. {currentChapter + 1}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed text-sm">
                  <span>Último</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;