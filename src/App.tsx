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
import QuizLevelsPageCarousel from './components/QuizLevelsPageCarousel';
import QuizBookSelector from './components/QuizBookSelector';
import QuizCustomSelector from './components/QuizCustomSelector';
import QuizGame from './components/QuizGame';
import CollaboratorDashboard from './components/CollaboratorDashboard';
import NewQuestionForm from './components/NewQuestionForm';
import EditQuestionForm from './components/EditQuestionForm';
import ModeratorPanel from './components/ModeratorPanel';
import AdminCollaboratorManager from './components/AdminCollaboratorManager';
import ProtectedRoute from './components/ProtectedRoute';
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
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          
          {/* Category Pages */}
          <Route path="/aventureros" element={<AventurerosDaniel />} />
          <Route path="/conquistadores" element={<ConquistadoresDaniel />} />
          <Route path="/guiasmayores" element={<GuiasmayoresDaniel />} />
          
          {/* Bible Reading */}
          <Route path="/bible/daniel/:chapterNumber" element={<BibleChapterPage />} />
          <Route path="/profetas-y-reyes/:chapterNumber" element={<PRChapterPage />} />
          
          {/* Collaboration System */}
          <Route path="/colaborador/dashboard" element={
            <ProtectedRoute>
              <CollaboratorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/colaborador/admin/colaboradores" element={
            <ProtectedRoute requiredRole={['moderator', 'superadmin']}>
              <AdminCollaboratorManager />
            </ProtectedRoute>
          } />
          <Route path="/colaborador/nueva-pregunta" element={
            <ProtectedRoute>
              <NewQuestionForm />
            </ProtectedRoute>
          } />
          <Route path="/colaborador/editar-pregunta/:id" element={
            <ProtectedRoute requiredRole={['moderator', 'superadmin']}>
              <EditQuestionForm />
            </ProtectedRoute>
          } />
          <Route path="/colaborador/moderacion" element={
            <ProtectedRoute requiredRole={['moderator', 'superadmin']}>
              <ModeratorPanel />
            </ProtectedRoute>
          } />
          
          {/* Quiz System */}
          <Route path="/quiz" element={<QuizLevelsPageCarousel />} />
          <Route path="/:category/quiz" element={<QuizLevelsPageCarousel />} />
          <Route path="/:category/quiz/custom" element={<QuizCustomSelector />} />
          <Route path="/quiz/custom" element={<QuizCustomSelector />} />
          <Route path="/:category/quiz/:level/:section" element={<QuizGame />} />
          <Route path="/quiz/:level/:section" element={<QuizGame />} />
        </Routes>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;