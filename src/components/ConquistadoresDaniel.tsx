import { useState, useEffect } from 'react';
import { ChevronLeft, Undo2, AlertTriangle, MousePointer2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LocalBibleService } from '../services/localBibleService';
import type { ChapterInfo } from '../types/bible';
import ChapterCard from './ChapterCard';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import ScrollToTop from './ScrollToTop';
import QuizCard from './QuizCard';
import bgConquistadores from '../assets/bg-conquistadores.webp';
import bgAventureros from '../assets/bg-aventureros.webp';
import bgGuiasmayores from '../assets/bg-guiasmayores.webp';
import aventurerosImg from '../assets/aventureros.png';
import conquistadoresImg from '../assets/conquistadores.png';
import guiasmayoresImg from '../assets/guiasmayores.png';
import maskAventureros from '../assets/mask-aventureros.png';
import maskGuiasmayores from '../assets/mask-guiasmayores.png';

const ConquistadoresDaniel: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Conquistadores es el índice 1
  const [isContentOpen, setIsContentOpen] = useState(false);

  // Capítulos para Conquistadores: 1-6 (toda la primera parte narrativa)
  const conquistadoresChapters = [1, 2, 3, 4, 5, 6];

  // Función para limpiar localStorage y navegar al home
  const handleGoHome = () => {
    try {
      localStorage.removeItem('daniel-bible-preference');
    } catch (error) {
      console.warn('No se pudo limpiar localStorage');
    }
    navigate('/');
  };

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

  const handleExploreClick = (route: string) => {
    navigate(route);
  };

  useEffect(() => {
    loadConquistadoresChapters();
  }, []);

  const loadConquistadoresChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const allChapters = await LocalBibleService.getAllDanielChapters();
      // Filtrar solo los capítulos de Conquistadores (1-6)
      const filteredChapters = allChapters.filter(ch => conquistadoresChapters.includes(ch.chapter));
      setChapters(filteredChapters);
    } catch (err) {
      setError('Error al cargar los capítulos de Daniel para Conquistadores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Background Hero Section para pantallas > 770px */}
      <div className="hidden min-[771px]:block">
        <div 
          className="category-hero-bg relative h-80 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${categories[activeCardIndex].bgImage})`
          }}
        >
          {/* Gradiente que permite ver más imagen y se extiende detrás del header */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
        </div>
      </div>
      
      <div className='block min-[771px]:hidden'>
        <div className="w-[190px] h-80 absolute top-[0] left-0 z-10 " style={{
            backgroundImage: `url(${maskAventureros})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
        <Link to="/aventureros" className="absolute h-80 w-[120px]">
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
            backgroundImage: `url(${bgConquistadores})`
          }}
        >
          {/* Gradiente que permite ver más imagen y se extiende detrás del header */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-white dark:to-gray-900"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" text="Cargando capítulos para Conquistadores..." />
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
                onClick={loadConquistadoresChapters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-8 mt-0 min-[771px]:mt-32">
            {/* Cards en flex-row - Solo pantallas > 770px */}
            <div className="hidden min-[771px]:block bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6">
              <div className="text-left mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Conquistadores
                  </h2>
                  <button onClick={handleGoHome} className="">
                    <Undo2 className='w-7 h-7 mt-1'></Undo2>
                  </button>
                </div>
                <p className="text-gray-600 text-md md:text-xl dark:text-gray-300 italic">
                  "La Bíblia es un mapa para volver a casa." - Jiménez
                </p>
              </div>
              
              <div className="flex flex-row gap-4 justify-center">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    onClick={() => handleExploreClick(category.route)}
                    onMouseEnter={() => setActiveCardIndex(index)}
                    className={`relative cursor-pointer transition-all duration-300 flex-1 max-w-sm ${
                      index === activeCardIndex 
                        ? 'transform -translate-y-2 scale-105' 
                        : 'transform translate-y-0 scale-100 opacity-90 hover:opacity-100 hover:-translate-y-1'
                    }`}
                  >
                    {/* Card */}
                    <div className={`relative w-full h-64 rounded-xl overflow-hidden shadow-lg ${
                      index === activeCardIndex ? 'shadow-2xl ring-2 ring-green-500' : 'shadow-md hover:shadow-lg'
                    }`}>
                      {/* Imagen de fondo */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${category.bgImage})`
                        }}
                      />
                      
                      {/* Overlay con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                      
                      {/* Contenido de la card */}
                      <div className="relative z-10 h-full flex flex-col justify-end items-center p-4 text-white text-center">
                        <div className="mb-4 flex items-center">
                          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                          {index === activeCardIndex && (
                            <div className="flex flex-col items-center space-y-1 ml-2">
                              <MousePointer2 className="h-4 w-4 text-white animate-bounce" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm opacity-90">{category.description}</p>
                        <p className="text-xs opacity-75 mt-1">{category.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel de Categorías mobile - Solo pantallas ≤ 770px */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-6 block min-[771px]:hidden" style={
             {background: 'linear-gradient(45deg, #0a113c, #083f6b)'}
            }>
              {/* Título del carousel */}
              <div className="text-left">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white/90">
                    Conquistadores
                  </h2>
                  <button
                    onClick={handleGoHome}
                    className=""
                  >
                    <Undo2 className='w-7 h-7 -mt-4 text-white'></Undo2>
                  </button>
                </div>
                <p className="text-gray-600 text-md md:text-xl text-white/50 italic">
                  "La Bíblia es un mapa para volver a casa." - Jiménez
                </p>
              </div>
            </div>

            {/* Stats */}
            <StatsCard chapters={chapters} />

            {/* Contenido Accordion */}
            <div className="bg-[#fff] dark:bg-gray-800 rounded-xl shadow-sm animate-fade-in border">
              {/* Accordion Header */}
              <button
                onClick={() => setIsContentOpen(!isContentOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 ease-in-out rounded-t-xl group"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  Detalles de la categoría
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`transition-transform duration-300 ease-in-out ${isContentOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </button>

              {/* Accordion Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isContentOpen ? 'max-h-[40rem] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'
              }`}>
                <div className={`px-6 pb-6 transition-all duration-500 delay-75 ${
                  isContentOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`}>
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Primera parte: Narrativa (1-6)</h5>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                          <li>• Capítulo 1: Daniel y sus compañeros en Babilonia</li>
                          <li>• Capítulo 2: Daniel interpreta el sueño de Nabucodonosor</li>
                          <li>• Capítulo 3: El horno de fuego</li>
                          <li>• Capítulo 4: La locura de Nabucodonosor</li>
                          <li>• Capítulo 5: La escritura en la pared</li>
                          <li>• Capítulo 6: Daniel en el foso de los leones</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Profetas y Reyes (39-44)</h5>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                          <li>• Cap. 39: En la corte de Babilonia</li>
                          <li>• Cap. 40: El sueño de Nabucodonosor</li>
                          <li>• Cap. 41: El horno de fuego</li>
                          <li>• Cap. 42: La verdadera grandeza</li>
                          <li>• Cap. 43: El vigía invisible</li>
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
                  Primera Parte: Narrativa Histórica
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Capítulos 1-6 • Versículos 1:1-6:28
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Historias completas de fe y fidelidad de Daniel y sus compañeros en el exilio babilónico
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, index) => {
                  // Insertar la card de quiz como el tercer elemento (índice 2)
                  if (index === 2) {
                    return (
                      <>
                        {/* Quiz Card como tercer elemento */}
                        <QuizCard
                          key="quiz-card"
                          animationDelay={`${index * 100}ms`}
                        />
                        
                        {/* Chapter Card actual */}
                        <div
                          key={chapter.chapter}
                          className="animate-fade-in"
                          style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                          <ChapterCard
                            chapter={chapter}
                          />
                        </div>
                      </>
                    );
                  }
                  
                  return (
                    <div
                      key={chapter.chapter}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index < 2 ? index * 100 : (index + 1) * 100}ms` }}
                    >
                      <ChapterCard
                        chapter={chapter}
                      />
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default ConquistadoresDaniel;