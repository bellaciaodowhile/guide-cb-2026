import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Moon, Sun, Book } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import HomePage from './components/HomePage';
import AventurerosDaniel from './components/AventurerosDaniel';
import ConquistadoresDaniel from './components/ConquistadoresDaniel';
import GuiasmayoresDaniel from './components/GuiasmayoresDaniel';
import BibleChapterPage from './components/BibleChapterPage';
import PRChapterPage from './components/PRChapterPage';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Book className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Libro de Daniel
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reina Valera 1995 • Explorador Interactivo
                  </p>
                </div>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
                aria-label="Cambiar tema"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/aventureros" element={<AventurerosDaniel />} />
          <Route path="/conquistadores" element={<ConquistadoresDaniel />} />
          <Route path="/guiasmayores" element={<GuiasmayoresDaniel />} />
          <Route path="/bible/daniel/:chapterNumber" element={<BibleChapterPage />} />
          <Route path="/profetas-y-reyes/:chapterNumber" element={<PRChapterPage />} />
        </Routes>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;