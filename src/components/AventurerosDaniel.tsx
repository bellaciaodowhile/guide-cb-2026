import { useState, useEffect } from 'react';
import { ChevronLeft, Book, AlertTriangle, MousePointer2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { LocalBibleService } from '../services/localBibleService';
import type { ChapterInfo } from '../types/bible';
import ChapterCard from './ChapterCard';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import ScrollToTop from './ScrollToTop';
import bgAventureros from '../assets/bg-aventureros.webp';
import bgConquistadores from '../assets/bg-conquistadores.webp';
import bgGuiasmayores from '../assets/bg-guiasmayores.webp';
import aventurerosImg from '../assets/aventureros.png';
import conquistadoresImg from '../assets/conquistadores.png';
import guiasmayoresImg from '../assets/guiasmayores.png';

const AventurerosDaniel: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Aventureros es el índice 0

  // Capítulos para Aventureros: 1, 2, 3, 6
  const aventurerosChapters = [1, 2, 3, 6];

  // Configuración del carousel de categorías
  const categories = [
    {
      id: 'aventureros',
      name: 'Aventureros',
      image: aventurerosImg,
      bgImage: bgAventureros,
      route: '/aventureros',
      description: 'Hasta los 9 años',
      subtitle: 'Capítulos seleccionados',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'conquistadores',
      name: 'Conquistadores',
      image: conquistadoresImg,
      bgImage: bgConquistadores,
      route: '/conquistadores',
      description: 'Hasta los 15 años',
      subtitle: 'Primera parte completa',
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'guiasmayores',
      name: 'Guías Mayores',
      image: guiasmayoresImg,
      bgImage: bgGuiasmayores,
      route: '/guiasmayores',
      description: '16 años en adelante',
      subtitle: 'Estudio completo',
      color: 'from-purple-500 to-purple-700'
    }
  ];

  const handleExploreClick = () => {
    navigate(categories[activeCardIndex].route);
  };

  const handleSplideMove = (_splide: any, newIndex: number) => {
    setActiveCardIndex(newIndex);
  };

  useEffect(() => {
    loadAventurerosChapters();
  }, []);

  const loadAventurerosChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const allChapters = await LocalBibleService.getAllDanielChapters();
      // Filtrar solo los capítulos de Aventureros
      const filteredChapters = allChapters.filter(ch => aventurerosChapters.includes(ch.chapter));
      setChapters(filteredChapters);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel para Aventureros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Background Hero Section */}
      <div 
        className="category-hero-bg relative h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgAventureros})`
        }}
      >
        {/* Gradiente que permite ver más imagen y se extiende detrás del header */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-40 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando capítulos para Aventureros..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                Error al cargar
              </h3>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={loadAventurerosChapters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Carousel de Categorías */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6">
              {/* Título del carousel */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Categorías de Estudio
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Navega entre las diferentes categorías
                </p>
              </div>

              {/* Carousel Container con Splide */}
              <div className="relative">
                <Splide
                  options={{
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                    gap: '1rem',
                    pagination: false,
                    arrows: true,
                    focus: 'center',
                    trimSpace: false,
                    autoplay: false,
                    breakpoints: {
                      768: {
                        perPage: 1,
                        gap: '0.5rem',
                      },
                    },
                  }}
                  onMove={handleSplideMove}
                  className="splide-carousel"
                >
                  {categories.map((category, index) => (
                    <SplideSlide key={category.id}>
                      <div
                        onClick={() => handleExploreClick()}
                        className={`relative cursor-pointer transition-all duration-300 mx-2 ${
                          index === activeCardIndex 
                            ? 'transform -translate-y-4 scale-105' 
                            : 'transform translate-y-0 scale-95 opacity-75 hover:opacity-90'
                        }`}
                      >
                        {/* Card */}
                        <div className={`relative w-full h-64 rounded-xl overflow-hidden shadow-lg ${
                          index === activeCardIndex ? 'shadow-2xl' : 'shadow-md'
                        }`}>
                          {/* Imagen de fondo */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                              backgroundImage: `url(${category.bgImage})`
                            }}
                          />
                          
                          {/* Overlay con gradiente */}
                          <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-amber`} />
                          
                          {/* Contenido de la card */}
                          <div className="relative z-10 h-full flex flex-col justify-end items-center p-4 text-white text-center">
                            {/* Información */}
                            <div className="mb-4 flex items-center">
                              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                              {index === activeCardIndex && (
                                <div className="flex flex-col items-center space-y-1 ml-2">
                                  <MousePointer2 className="h-4 w-4 text-white animate-click-bounce" />
                                </div>
                              )}
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              </div>

              {/* Indicadores del carousel - Removidos ya que Splide maneja la navegación */}

              {/* Botón Volver al Home */}
              <div className="text-center mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Volver al Inicio</span>
                </Link>
              </div>
            </div>
            {/* Stats */}
            <StatsCard chapters={chapters} />

            {/* Chapters Grid */}
            <div className="space-y-8">
              <div className="mb-8 px-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Capítulos Seleccionados para Aventureros
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Historias fundamentales de fe y fidelidad en el exilio
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapter}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChapterCard
                      chapter={chapter}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Contenido para Aventureros
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h5 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Capítulos Bíblicos</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Capítulo 1: Daniel y sus compañeros en Babilonia</li>
                    <li>• Capítulo 2: Daniel interpreta el sueño de Nabucodonosor</li>
                    <li>• Capítulo 3: El horno de fuego</li>
                    <li>• Capítulo 6: Daniel en el foso de los leones</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Profetas y Reyes</h5>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Cap. 39: En la corte de Babilonia</li>
                    <li>• Cap. 41: El horno de fuego</li>
                    <li>• Cap. 44: En el foso de los leones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default AventurerosDaniel;