import { useState, useEffect } from 'react';
import { Users, Award, Crown, Play, MousePointer2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import imgHero from '../assets/hero.png';
import bgAventureros from '../assets/bg-aventureros.webp';
import bgConquistadores from '../assets/bg-conquistadores.webp';
import bgGuiasmayores from '../assets/bg-guiasmayores.webp';
import '../assets/css/styles.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showColumns, setShowColumns] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleStartClick = () => {
    setShowColumns(true);
  };

  // Verificar localStorage al cargar el componente
  useEffect(() => {
    const savedPreference = localStorage.getItem('daniel-bible-preference');
    if (savedPreference) {
      const { dontShow, selectedRoute } = JSON.parse(savedPreference);
      if (dontShow && selectedRoute) {
        // Redirigir automáticamente a la ruta guardada
        navigate(selectedRoute);
        return;
      }
    }
  }, [navigate]);

  // Mostrar modal después de que aparezcan las columnas
  useEffect(() => {
    if (showColumns) {
      const savedPreference = localStorage.getItem('daniel-bible-preference');
      if (savedPreference) {
        const { dontShow } = JSON.parse(savedPreference);
        if (dontShow) {
          return; // No mostrar modal si el usuario eligió no verlo
        }
      }
      
      // Delay para que aparezcan las columnas primero
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500); // Espera a que terminen las animaciones de las columnas
      
      return () => clearTimeout(timer);
    }
  }, [showColumns]);

  const handleColumnClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowModal(false); // Cerrar modal al seleccionar categoría
    
    // Si el usuario marcó "No volver a mostrar", guardar en localStorage
    if (dontShowAgain) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        localStorage.setItem('daniel-bible-preference', JSON.stringify({
          dontShow: true,
          selectedRoute: category.route,
          categoryId: categoryId
        }));
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    
    // Si el usuario marcó "No volver a mostrar", guardar en localStorage
    if (dontShowAgain) {
      localStorage.setItem('daniel-bible-preference', JSON.stringify({
        dontShow: true,
        selectedRoute: null,
        categoryId: null
      }));
    }
  };

  const categories = [
    {
      id: 'aventureros',
      title: 'Aventureros',
      description: 'Descubre las emocionantes historias de Daniel y sus amigos en Babilonia. Aprende sobre la fidelidad, el valor y la confianza en Dios a través de estas narrativas inspiradoras.',
      fullDescription: 'Los Aventureros explorarán las historias fundamentales de fe y fidelidad en el exilio. Este nivel incluye los capítulos más emocionantes y accesibles del libro de Daniel, perfectos para jóvenes que comienzan su aventura espiritual.',
      route: '/aventureros',
      color: 'from-white to-blue-100',
      hoverColor: 'hover:to-blue-200',
      iconColor: 'text-white',
      iconBg: 'bg-blue-600',
      borderColor: 'border-blue-200',
      textColor: 'text-gray-800',
      icon: Users,
      chapters: 'Daniel 1-3, 6 • PR 39, 41, 44 (Hasta los 9 años)',
      gradient: 'from-blue-500 to-blue-700',
      backgroundImage: bgAventureros
    },
    {
      id: 'conquistadores',
      title: 'Conquistadores',
      description: 'Estudia la primera parte completa del libro de Daniel (capítulos 1-6). Descubre todas las historias de fidelidad, milagros y la providencia divina durante el exilio babilónico.',
      fullDescription: 'Los Conquistadores profundizarán en toda la narrativa histórica de Daniel. Este nivel completo incluye todas las historias de fe, desde la corte de Babilonia hasta el foso de los leones, con su correspondiente comentario en Profetas y Reyes.',
      route: '/conquistadores',
      color: 'from-white to-green-100',
      hoverColor: 'hover:to-green-200',
      iconColor: 'text-white',
      iconBg: 'bg-green-600',
      borderColor: 'border-green-200',
      textColor: 'text-gray-800',
      icon: Award,
      chapters: 'Daniel 1-6 • PR 39-44 (Hasta los 15 años)',
      gradient: 'from-green-500 to-green-700',
      backgroundImage: bgConquistadores
    },
    {
      id: 'guiasmayores',
      title: 'Guías Mayores',
      description: 'Explora el libro completo de Daniel: desde las historias de fidelidad en el exilio hasta las profundas visiones apocalípticas sobre el futuro de los reinos y el plan divino para la historia.',
      fullDescription: 'Los Guías Mayores experimentarán el estudio más completo y profundo del libro de Daniel. Incluye tanto la narrativa histórica como las complejas visiones proféticas, proporcionando una comprensión integral de este libro profético.',
      route: '/guiasmayores',
      color: 'from-white to-purple-100',
      hoverColor: 'hover:to-purple-200',
      iconColor: 'text-white',
      iconBg: 'bg-purple-600',
      borderColor: 'border-purple-200',
      textColor: 'text-gray-800',
      icon: Crown,
      chapters: 'Daniel 1-12 • PR 39-44 (16 años en adelante)',
      gradient: 'from-purple-500 to-purple-700',
      backgroundImage: bgGuiasmayores
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Contenido principal */}
      <div className="relative z-10 mx-auto h-full">
        {/* Hero Section - Solo se muestra si no se han mostrado las columnas */}
        {!showColumns && (
          <div className="text-center py-12">
            <img src={imgHero} alt="Daniel Bible Study" className="m-auto mb-8" />
            
            <button
              onClick={handleStartClick}
              className="game-button group relative inline-flex items-center justify-center space-x-3 px-12 py-6 text-2xl font-bold text-white rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-3xl"
            >
              {/* Fondo del botón con gradiente verde */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Borde brillante verde */}
              <div className="absolute inset-0 rounded-2xl border-4 border-green-300/40 group-hover:border-green-200/60 transition-all duration-300"></div>
              
              {/* Efecto de brillo verde */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-green-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
              
              {/* Contenido del botón */}
              <div className="relative z-10 flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                  <Play className="h-8 w-8" />
                </div>
                <span className="tracking-wide">COMENZAR AVENTURA</span>
              </div>
              
              {/* Partículas decorativas verdes */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </button>
          </div>
        )}

        {/* Three Expandable Columns */}
        {showColumns && (
          <div className="h-screen flex items-center">
            <div className="columns-container h-screen w-full mx-auto">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() => handleColumnClick(category.id)}
                  className={`
                    expandable-column column-entrance
                    ${selectedCategory === category.id ? 'expanded' : ''}
                    ${selectedCategory && selectedCategory !== category.id ? 'collapsed' : ''}
                  `}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    background: `linear-gradient(135deg, ${category.gradient.replace('from-', '').replace(' to-', ', ')})`
                  }}
                >
                  {/* Imagen de fondo */}
                  {category.backgroundImage && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${category.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                  
                  <div className="column-shine-effect absolute inset-0"></div>
                  
                  {/* Contenido normal/hover */}
                  <div className={`
                    column-content text-white
                    ${selectedCategory && selectedCategory !== category.id ? 'collapsed-content' : ''}
                  `}>
                    
                    {/* Título */}
                    <h3 className="column-title text-2xl md:text-3xl font-bold mb-4">
                      {category.title}
                    </h3>
                    
                    {/* Indicador de click animado */}
                    <div className="column-chapters opacity-70 text-sm flex flex-col items-center space-y-2">
                      <MousePointer2 className="h-6 w-6 text-white animate-click-bounce" />
                      <span className="text-xs font-medium">Haz clic para explorar</span>
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  <div className="column-expanded-content absolute inset-0 p-8 text-white">
                    <div className="h-full flex flex-col justify-end">
                      {/* Descripción corta */}
                      <p className="column-description text-white/90 mb-4 leading-relaxed text-xl text-center font-bold">
                        {category.chapters}
                      </p>
                      {/* Botones de acción */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to={category.route}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          <category.icon className="h-5 w-5" />
                          <span>Comenzar estudio</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(null);
                          }}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white/80 hover:text-white transition-all duration-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de instrucción */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay - sin onClick para prevenir cierre */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-8 mx-4 max-w-md w-full animate-modal-appear">
            {/* Content */}
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ¡Elige tu categoría!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Selecciona la categoría que corresponde edad para comenzar tu aventura con el libro de Daniel.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium text-blue-700 dark:text-blue-300">Aventureros, {'<'}=9 años</span>
                  <span>Capítulos 1-3, 6</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium text-green-700 dark:text-green-300">Conquistadores, {'<'}=15 años</span>
                  <span>Capítulos 1-6</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium text-purple-700 dark:text-purple-300">Guías Mayores, {'>'}=16 años </span>
                  <span>Capítulos 1-12</span>
                </div>
              </div>
              
              {/* Checkbox "No volver a mostrar" */}
              <div className="mt-6 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label 
                  htmlFor="dontShowAgain" 
                  className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                >
                  No volver a mostrar este mensaje
                </label>
              </div>
              
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 w-full"
              >
                {dontShowAgain ? 'Guardar preferencia' : 'Entendido'}
              </button>
              
              {dontShowAgain && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                  💡 Tip: Si seleccionas una categoría, serás redirigido automáticamente la próxima vez
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;