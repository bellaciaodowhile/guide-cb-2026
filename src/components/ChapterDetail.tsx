import { ArrowLeft, Book, Quote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ApiResponse } from '../types/bible';
import { CHAPTER_DETAILS } from '../utils/constants';
import { PRService } from '../services/prService';
import LoadingSpinner from './LoadingSpinner';
import ThemeSelector from './ThemeSelector';
import { useReadingTheme } from '../hooks/useReadingTheme';

interface ChapterDetailProps {
  chapter: ApiResponse;
  onBack: () => void;
  loading: boolean;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapter, onBack, loading }) => {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get('from') ? `?from=${searchParams.get('from')}` : '';
  const { theme } = useReadingTheme();
  
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-3 rounded-lg border hover:opacity-80 transition-all duration-300 group"
            style={{
              backgroundColor: theme.styles.cardBackground,
              borderColor: theme.styles.borderColor
            }}
            aria-label="Volver a capítulos"
          >
            <ArrowLeft 
              className="h-5 w-5 group-hover:opacity-80 transition-colors duration-300"
              style={{ color: theme.styles.textColor }}
            />
          </button>
          <div>
            <h1 
              className="text-3xl font-bold transition-colors duration-300"
              style={{ color: theme.styles.headingColor }}
            >
              Daniel {chapter.chapter}
            </h1>
            <p 
              className="text-lg opacity-70 transition-colors duration-300"
              style={{ color: theme.styles.textColor }}
            >
              {chapter.verses.length} versículos
            </p>
          </div>
        </div>
        
        {/* Selector de tema */}
        <ThemeSelector />
      </div>

      {/* Chapter Info Card */}
      <div 
        className="rounded-xl shadow-sm border p-6 mb-4 md:mb-6 animate-slide-up transition-colors duration-300"
        style={{
          backgroundColor: theme.styles.cardBackground,
          borderColor: theme.styles.borderColor
        }}
      >
        <div className="flex-col md:flex items-start space-x-1 md:space-x-4">
          <div className="hidden md:block p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 
              className="text-2xl font-bold mb-2 transition-colors duration-300"
              style={{ color: theme.styles.headingColor }}
            >
              {chapterDetail.title}
            </h2>
            {chapterDetail.subtitle && (
              <p className="text-primary-700 dark:text-primary-300 font-medium mb-3">
                {/* {chapterDetail.subtitle} */}
              </p>
            )}
            {chapterDetail.summary && (
              <p 
                className="leading-relaxed mb-4 transition-colors duration-300"
                style={{ color: theme.styles.textColor }}
              >
                {chapterDetail.summary}
              </p>
            )}
            
            {/* Secciones especiales para el capítulo 9 */}
            {chapter.chapter === 9 && 'sections' in chapterDetail && chapterDetail.sections && (
              <div className="mt-4 space-y-3">
                <h4 
                  className="text-sm font-semibold mb-2"
                  style={{ color: theme.styles.headingColor }}
                >
                  Secciones del capítulo:
                </h4>
                {chapterDetail.sections.map((section: { title: string; description: string; verses: string }, index: number) => (
                  <div 
                    key={index} 
                    className="rounded-lg p-3 border border-primary-200 dark:border-primary-700"
                    style={{ backgroundColor: theme.styles.cardBackground }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-0 md:flex-1">
                        <h5 
                          className="font-medium text-sm"
                          style={{ color: theme.styles.headingColor }}
                        >
                          {section.title}
                        </h5>
                        <p 
                          className="text-xs opacity-70 mt-1"
                          style={{ color: theme.styles.textColor }}
                        >
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
          <div 
            className="rounded-xl p-6 md:p-6 border mb-4 md:mb-6 transition-colors duration-300"
            style={{
              backgroundColor: theme.styles.verseBackground,
              borderColor: theme.styles.borderColor
            }}
          >
            <h4 
              className="text-lg font-semibold mb-2 flex items-center transition-colors duration-300"
              style={{ color: theme.styles.headingColor }}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Contenido Relacionado
            </h4>
            <p 
              className="mb-4 transition-colors duration-300"
              style={{ color: theme.styles.textColor }}
            >
              Lee el comentario inspirado sobre este capítulo en Profetas y Reyes
            </p>
            <Link
              to={`/profetas-y-reyes/${chapter.chapter + 38}${fromParam}`}
              className="w-full sm:w-auto px-2 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:opacity-90 transform hover:scale-105"
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
              <Book className="hidden md:block h-4 w-4" />
              <span>Leer: {prChapterTitle}</span>
            </Link>
          </div>
        )}

      {/* Verses */}
      <div 
        className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: theme.styles.cardBackground,
          borderColor: theme.styles.borderColor
        }}
      >
        <div 
          className="px-6 py-4 border-b transition-colors duration-300"
          style={{
            backgroundColor: theme.styles.verseBackground,
            borderColor: theme.styles.borderColor
          }}
        >
          <h3 
            className="text-lg font-semibold flex items-center transition-colors duration-300"
            style={{ color: theme.styles.headingColor }}
          >
            <Quote className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
            Versículos
          </h3>
        </div>
        
        <div className="p-0 md:p-6">
          <div>
            {chapter.verses.map((verse, index) => (
              <div
                key={verse.verse}
                className="flex space-x-2 md:space-x-4 p-3 md:p-4 rounded-lg transition-all duration-300 animate-slide-up hover:opacity-90"
                style={{ 
                  backgroundColor: theme.styles.verseBackground,
                  animationDelay: `${index * 50}ms`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseHoverBackground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseBackground;
                }}
              >
                <div className="flex-shrink-0">
                  <span 
                    className="font-bold transition-colors duration-300"
                    style={{ color: theme.styles.headingColor }}
                  >
                    {verse.verse}
                  </span>
                </div>
                <div className="flex-1">
                  <p 
                    className="leading-relaxed text-lg transition-colors duration-300"
                    style={{ color: theme.styles.textColor }}
                  >
                    {verse.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <div className="mt-8 space-y-4 hidden min-[750px]:block">
        {/* Navegación entre capítulos */}
        <div className="flex sm:flex-row items-center justify-between sm:space-y-0 sm:space-x-4">
          {/* Botón Anterior */}
          <div className="flex-1 w-full sm:w-auto">
            {hasPrevious ? (
              <Link
                to={`/bible/daniel/${chapter.chapter - 1}${fromParam}`}
                className="w-full px-2 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 hover:opacity-90"
                style={{
                  backgroundColor: theme.styles.verseBackground,
                  color: theme.styles.textColor,
                  borderColor: theme.styles.borderColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseHoverBackground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseBackground;
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Cap. {chapter.chapter - 1}</span>
              </Link>
            ) : (
              <div 
                className="w-full px-2 md:px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed opacity-50"
                style={{
                  backgroundColor: theme.styles.verseBackground,
                  color: theme.styles.textColor
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Primer cap.</span>
              </div>
            )}
          </div>

          {/* Botón Volver */}
          <button
            onClick={onBack}
            className="px-2 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:opacity-90"
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
            <span>Capítulos</span>
          </button>

          {/* Botón Siguiente */}
          <div className="flex-1 w-full sm:w-auto">
            {hasNext ? (
              <Link
                to={`/bible/daniel/${chapter.chapter + 1}${fromParam}`}
                className="w-full px-2 md:px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1 hover:opacity-90"
                style={{
                  backgroundColor: theme.styles.verseBackground,
                  color: theme.styles.textColor,
                  borderColor: theme.styles.borderColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseHoverBackground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.styles.verseBackground;
                }}
              >
                <span>Cap. {chapter.chapter + 1}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div 
                className="w-full px-2 md:px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-1 cursor-not-allowed opacity-50"
                style={{
                  backgroundColor: theme.styles.verseBackground,
                  color: theme.styles.textColor
                }}
              >
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