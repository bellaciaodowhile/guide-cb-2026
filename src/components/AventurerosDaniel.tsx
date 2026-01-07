import { useState, useEffect } from 'react';
import { ChevronLeft, Undo2, Book, AlertTriangle, MousePointer2, ChevronDown } from 'lucide-react';
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
import maskConquistadores from '../assets/mask-conquistadores.png';
import maskGuiasmayores from '../assets/mask-guiasmayores.png';

const AventurerosDaniel: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Aventureros es el índice 0
  const [isContentOpen, setIsContentOpen] = useState(false);

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
      <div className="w-[190px] h-80 absolute top-[0] left-0 z-10 " style={{
          backgroundImage: `url(${maskConquistadores})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
      <Link to="/conquistadores" className="absolute h-80 w-[120px]">
        <ChevronLeft className='absolute top-[100px] text-white w-10 h-10 left-2'></ChevronLeft>
      </Link>
      </div>
      <div className="w-[190px] h-80 absolute top-[0] right-0 z-10" style={{
          backgroundImage: `url(${maskGuiasmayores})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'rotateY(180deg)'
        }}>
       <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
       <Link to="/guiasmayores" className="absolute h-80 w-[120px]">
        <ChevronLeft className='absolute top-[100px] text-white w-10 h-10 left-2'></ChevronLeft>
       </Link>
      </div>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
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
              <div className="text-left">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Aventureros
                  </h2>
                  <Link
                    to="/"
                    className=""
                  >
                    <Undo2 className='w-7 h-7  mt-1'></Undo2>
                  </Link>
                </div>
                <p className="text-gray-600 text-md md:text-xl dark:text-gray-300 italic">
                  "La Bíblia es un mapa para volver a casa." - Jiménez
                </p>
              </div>

              {/* Carousel Container con Splide */}
              <div className="relative hidden">
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
            </div>
            {/* Stats */}
            <StatsCard chapters={chapters} />

            {/* Contenido Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
              {/* Accordion Header */}
              <button
                onClick={() => setIsContentOpen(!isContentOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out rounded-t-xl group"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Book className={`h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${isContentOpen ? 'rotate-12 scale-110' : 'group-hover:scale-105'}`} />
                  Contenido para Aventureros
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`transition-transform duration-300 ease-in-out ${isContentOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </button>

              {/* Accordion Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isContentOpen ? 'h-full opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'
              }`}>
                <div className={`px-6 pb-6 transition-all duration-300 delay-100 ${
                  isContentOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`}>
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
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
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="space-y-4 md:space-y-8">
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
          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default AventurerosDaniel;