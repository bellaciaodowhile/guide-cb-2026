import { Hash, BookOpen, ShieldQuestionIcon, TrendingUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ChapterInfo } from '../types/bible';

interface StatsCardProps {
  chapters: ChapterInfo[];
}

const StatsCard: React.FC<StatsCardProps> = ({ chapters }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verseCount, 0);
  const averageVerses = chapters.length > 0 ? Math.round(totalVerses / chapters.length) : 0;
  const longestChapter = chapters.reduce((max, chapter) => 
    chapter.verseCount > max.verseCount ? chapter : max, chapters[0] || { verseCount: 0, chapter: 0 });
  const shortestChapter = chapters.reduce((min, chapter) => 
    chapter.verseCount < min.verseCount ? chapter : min, chapters[0] || { verseCount: 0, chapter: 0 });

  // Estadísticas por partes
  const narrativePart = chapters.filter(ch => ch.chapter >= 1 && ch.chapter <= 6);
  const visionsPart = chapters.filter(ch => ch.chapter >= 7 && ch.chapter <= 12);
  const narrativeVerses = narrativePart.reduce((sum, ch) => sum + ch.verseCount, 0);
  const visionsVerses = visionsPart.reduce((sum, ch) => sum + ch.verseCount, 0);

  const stats = [
    {
      icon: BookOpen,
      label: 'Capítulos a estudiar',
      value: chapters.length,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: ShieldQuestionIcon,
      label: 'Primera parte: Narrativa (1-6)',
      value: `${narrativeVerses} vers.`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: TrendingUp,
      label: 'Segunda parte: Visiones (7-12)',
      value: `${visionsVerses} vers.`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Hash,
      label: 'Versículos total',
      value: totalVerses,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out rounded-t-xl group"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          Datos curiosos
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'
      }`}>
        <div className={`px-6 pb-6 transition-all duration-300 delay-100 ${
          isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
              <div className={`flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}>
                <span className="text-gray-600 dark:text-gray-400">Versión:</span>
                <span className="font-medium text-gray-900 dark:text-white">Reina Valera 1995</span>
              </div>
              {stats.map((stat) => (
                <div 
                  key={stat.label}
                  className={`flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 hover:scale-102 ${
                    isOpen ? 'animate-fade-in-up' : ''
                  }`}
                >
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
              <div className={`flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}>
                <span className="text-gray-600 dark:text-gray-400">Capítulo más largo:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Capítulo {longestChapter.chapter} ({longestChapter.verseCount} vers.)
                </span>
              </div>
              <div className={`flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}>
                <span className="text-gray-600 dark:text-gray-400">Capítulo más corto:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Capítulo {shortestChapter.chapter} ({shortestChapter.verseCount} vers.)
                </span>
              </div>
              <div className={`flex justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}>
                <span className="text-gray-600 dark:text-gray-400">Promedio por capítulo:</span>
                <span className="font-medium text-gray-900 dark:text-white">{averageVerses} vers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;