import { Hash, BookOpen, BarChart3, TrendingUp } from 'lucide-react';
import type { ChapterInfo } from '../types/bible';

interface StatsCardProps {
  chapters: ChapterInfo[];
}

const StatsCard: React.FC<StatsCardProps> = ({ chapters }) => {
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
      label: 'Total Capítulos',
      value: chapters.length,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Hash,
      label: 'Versículos Total',
      value: totalVerses,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: BarChart3,
      label: 'Narrativa (1-6)',
      value: `${narrativeVerses}v`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: TrendingUp,
      label: 'Visiones (7-12)',
      value: `${visionsVerses}v`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
        Estadísticas del Libro de Daniel
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Capítulo más largo:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Capítulo {longestChapter.chapter} ({longestChapter.verseCount} versículos)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Capítulo más corto:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Capítulo {shortestChapter.chapter} ({shortestChapter.verseCount} versículos)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Promedio por capítulo:</span>
            <span className="font-medium text-gray-900 dark:text-white">{averageVerses} versículos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Versión:</span>
            <span className="font-medium text-gray-900 dark:text-white">Reina Valera 1995</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;