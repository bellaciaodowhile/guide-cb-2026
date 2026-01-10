import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReadingTheme } from '../hooks/useReadingTheme';

interface MobileNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onBack: () => void;
  getNavigationUrl: (chapter: number) => string;
  fromParam: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentChapter,
  totalChapters,
  onBack,
  getNavigationUrl,
  fromParam
}) => {
  const { theme } = useReadingTheme();
  const hasPrevious = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <>
      {/* Mobile Navigation - Fixed Bottom */}
      <div className="min-[750px]:hidden mobile-navigation-container">
        {/* Spacer for fixed navigation */}
        <div className="h-20"></div>
        
        {/* Fixed Bottom Navigation */}
        <div 
          className="backdrop-blur-md border-t px-4 py-3 shadow-lg mobile-navigation-container transition-colors duration-300"
          style={{
            backgroundColor: `${theme.styles.cardBackground}F5`, // F5 para 95% transparencia
            borderColor: theme.styles.borderColor
          }}
        >
          <div className="flex items-center justify-between space-x-3">
            {/* Botón Anterior */}
            <div className="flex-1">
              {hasPrevious ? (
                <Link
                  to={`${getNavigationUrl(currentChapter - 1)}${fromParam}`}
                  className="w-full px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 text-sm hover:opacity-90"
                  style={{
                    backgroundColor: theme.styles.verseBackground,
                    color: theme.styles.textColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.styles.verseHoverBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.styles.verseBackground;
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Cap. {currentChapter - 1}</span>
                </Link>
              ) : (
                <div 
                  className="w-full px-3 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed text-sm opacity-50"
                  style={{
                    backgroundColor: theme.styles.verseBackground,
                    color: theme.styles.textColor
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Primer</span>
                </div>
              )}
            </div>

            {/* Botón Volver */}
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 text-sm hover:opacity-90"
              style={{
                backgroundColor: theme.styles.buttonBackground,
                color: theme.styles.buttonText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.styles.buttonHoverBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.styles.buttonBackground;
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>

            {/* Botón Siguiente */}
            <div className="flex-1">
              {hasNext ? (
                <Link
                  to={`${getNavigationUrl(currentChapter + 1)}${fromParam}`}
                  className="w-full px-3 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 text-sm hover:opacity-90"
                  style={{
                    backgroundColor: theme.styles.verseBackground,
                    color: theme.styles.textColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.styles.verseHoverBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.styles.verseBackground;
                  }}
                >
                  <span>Cap. {currentChapter + 1}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <div 
                  className="w-full px-3 py-2 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed text-sm opacity-50"
                  style={{
                    backgroundColor: theme.styles.verseBackground,
                    color: theme.styles.textColor
                  }}
                >
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