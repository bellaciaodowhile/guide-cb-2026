import { useState } from 'react';
import { Book, Users, Award, Crown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgHero from '../assets/hero.png';
import bgAventureros from '../assets/bg-aventureros.png';
import bgConquistadores from '../assets/bg-conquistadores.png';
import bgGuiasmayores from '../assets/bg-guiasmayores.png';
import '../assets/css/styles.css';

const HomePage: React.FC = () => {
  const [showColumns, setShowColumns] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleStartClick = () => {
    setShowColumns(true);
  };

  const handleColumnClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
      chapters: 'Daniel 1-3, 6 • PR 39, 41, 44',
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
      chapters: 'Daniel 1-6 • PR 39-44',
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
      chapters: 'Daniel 1-12 • PR 39-44',
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
                    
                    {/* Indicador de hover */}
                    <div className="column-chapters opacity-70 text-sm">
                      
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
    </div>
  );
};

export default HomePage;