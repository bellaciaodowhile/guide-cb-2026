import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Zap, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import daniel6Image from '../assets/capitulos/Daniel 6.webp';
import daniel1 from '../assets/capitulos/Daniel 1.webp';
import daniel2 from '../assets/capitulos/Daniel 2.webp';
import daniel3 from '../assets/capitulos/Daniel 3.webp';
import daniel4 from '../assets/capitulos/Daniel 4.webp';
import daniel5 from '../assets/capitulos/Daniel 5.webp';
import daniel6 from '../assets/capitulos/Daniel 6.webp';
import daniel7 from '../assets/capitulos/Daniel 7.webp';
import daniel8 from '../assets/capitulos/Daniel 8.webp';
import daniel9 from '../assets/capitulos/Daniel 9.webp';
import daniel10 from '../assets/capitulos/Daniel 10.webp';
import daniel11 from '../assets/capitulos/Daniel 11.webp';
import daniel12 from '../assets/capitulos/Daniel 12.webp';
import { QuestionService } from '../services/questionService';

interface QuizCardProps {
  animationDelay?: string;
  category?: string;
}

const chapterImages = [
  daniel1, daniel2, daniel3, daniel4, daniel5, daniel6,
  daniel7, daniel8, daniel9, daniel10, daniel11, daniel12
];

const chapterTitles = [
  'Daniel y sus compañeros',
  'El sueño de Nabucodonosor',
  'El horno de fuego',
  'La locura del rey',
  'La escritura en la pared',
  'Daniel en el foso',
  'Las cuatro bestias',
  'El carnero y el macho cabrío',
  'Las setenta semanas',
  'Visión junto al río',
  'Reyes del norte y sur',
  'El tiempo del fin'
];

const QuizCard: React.FC<QuizCardProps> = ({ animationDelay = '0ms', category }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [sectionsCount, setSectionsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLevel !== null) {
      loadSections(selectedLevel);
    }
  }, [selectedLevel]);

  const loadSections = async (levelId: number) => {
    setLoading(true);
    const questions = await QuestionService.getApprovedQuestionsByChapter(levelId);
    const sections = Math.ceil(questions.length / 20);
    setSectionsCount(sections);
    setLoading(false);
  };

  const handleExploreClick = () => {
    setIsExpanded(true);
  };

  const handleBack = () => {
    setIsExpanded(false);
    setSelectedLevel(null);
  };

  const handleLevelClick = (levelId: number) => {
    setSelectedLevel(levelId);
  };

  const handleSectionClick = (sectionNumber: number) => {
    if (selectedLevel) {
      const route = category ? `/${category}/quiz/${selectedLevel}/${sectionNumber}` : `/quiz/${selectedLevel}/${sectionNumber}`;
      navigate(route);
    }
  };

  const handleCustomClick = () => {
    navigate(category ? `/${category}/quiz/custom` : '/quiz/custom');
  };

  if (isExpanded) {
    return (
      <div className="quiz-levels-expanded">
        {/* Fondo con imagen blureada */}
        <div 
          className="card-selector-background"
          style={{ backgroundImage: `url(${daniel6Image})` }}
        ></div>
        <div className="card-selector-overlay"></div>

        {/* Botón de volver */}
        <button
          onClick={handleBack}
          className="carousel-nav-button group/arrow fixed top-6 left-6 z-50"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
          
          <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
            <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
          </div>
        </button>

        {/* Contenedor de niveles */}
        <div className="levels-container">
          <h1 className="levels-title" style={{ fontFamily: "'Bungee', cursive" }}>
            Selecciona un Nivel
          </h1>

          {/* Grid de niveles */}
          <div className="levels-grid">
            {chapterImages.map((image, index) => (
              <div
                key={index}
                className="level-card"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="level-card-inner">
                  <img src={image} alt={`Nivel ${index + 1}`} className="level-card-image" />
                  <div className="level-card-overlay">
                    <div className="level-card-number" style={{ fontFamily: "'Bungee', cursive" }}>
                      {index + 1}
                    </div>
                    <div className="level-card-title">
                      {chapterTitles[index]}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLevelClick(index + 1);
                      }}
                      className="level-explore-btn"
                      style={{ fontFamily: "'Bungee', cursive" }}
                    >
                      Explorar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Nivel personalizado */}
            <div
              className="level-card level-card-custom"
              onClick={handleCustomClick}
              style={{ animationDelay: `${12 * 50}ms` }}
            >
              <div className="level-card-inner">
                <div className="level-card-custom-bg">
                  <Sparkles className="h-16 w-16 text-amber-400 animate-pulse" />
                </div>
                <div className="level-card-overlay">
                  <div className="level-card-number" style={{ fontFamily: "'Bungee', cursive" }}>
                    ?
                  </div>
                  <div className="level-card-title">
                    Nivel Personalizado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de secciones desde abajo */}
        {selectedLevel !== null && (
          <div className="sections-modal-overlay" onClick={handleBack}>
            <div className="sections-modal" onClick={(e) => e.stopPropagation()}>
              {/* Header del modal */}
              <div className="sections-modal-header">
                <div>
                  <h2 className="sections-modal-title" style={{ fontFamily: "'Bungee', cursive" }}>
                    Capítulo {selectedLevel}
                  </h2>
                  <p className="sections-modal-subtitle">
                    {chapterTitles[selectedLevel - 1]}
                  </p>
                </div>
                <button onClick={handleBack} className="sections-modal-close">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Contenido del modal */}
              {loading ? (
                <div className="sections-loading">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando secciones...</p>
                </div>
              ) : sectionsCount === 0 ? (
                <div className="sections-empty">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Sin preguntas disponibles
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Este capítulo aún no tiene preguntas aprobadas.
                  </p>
                </div>
              ) : (
                <div className="sections-grid">
                  {Array.from({ length: sectionsCount }, (_, i) => i + 1).map((sectionNum) => (
                    <button
                      key={sectionNum}
                      onClick={() => handleSectionClick(sectionNum)}
                      className="section-card"
                      style={{ animationDelay: `${sectionNum * 50}ms` }}
                    >
                      <div className="section-card-inner">
                        <div className="section-number" style={{ fontFamily: "'Bungee', cursive" }}>
                          {sectionNum}
                        </div>
                        <div className="section-label">Sección</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay }}
    >
      <div 
        className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group h-full"
      >
        <div 
          className="h-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${daniel6Image})`
          }}
        >
          {/* Overlay con gradiente más oscuro para mejor contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

          {/* Contenido central */}
          <div className="relative z-10 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col items-center justify-center px-4 sm:px-6 space-y-4 sm:space-y-6">

            {/* Botón 3D estilo dorado */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <button 
                onClick={handleExploreClick}
                className="quiz-button group/btn relative animate-bounce-subtle"
              >
                {/* Resplandor animado de fondo - tonos dorados */}
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse-glow"></div>
                
                {/* Capa de sombra 3D (profundidad) */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-xl sm:rounded-2xl transform translate-y-2 group-hover/btn:translate-y-1 transition-transform duration-150"></div>
                
                {/* Capa principal del botón - gradiente dorado */}
                <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-xl sm:rounded-2xl px-6 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 transform group-hover/btn:translate-y-1 transition-all duration-150 border-3 sm:border-4 border-amber-900/70 shadow-2xl overflow-hidden">
                  {/* Textura de roca */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiIC8+PC9zdmc+')] opacity-40 rounded-xl sm:rounded-2xl"></div>
                  
                  {/* Efecto de brillo animado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer-fast"></div>
                  
                  {/* Estrellas decorativas animadas - tonos dorados */}
                  <Sparkles className="absolute top-1 left-2 sm:top-2 sm:left-3 h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 animate-spin-slow" />
                  <Sparkles className="absolute top-1 right-2 sm:top-2 sm:right-3 h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 animate-spin-slow" style={{ animationDelay: '0.5s' }} />
                  <Zap className="absolute bottom-1 left-2 sm:bottom-2 sm:left-3 h-3 w-3 sm:h-4 sm:w-4 text-amber-300 animate-pulse" />
                  <Zap className="absolute bottom-1 right-2 sm:bottom-2 sm:right-3 h-3 w-3 sm:h-4 sm:w-4 text-amber-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  
                  {/* Contenido del botón */}
                  <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-white/40 rounded-full border-2 border-white/50 animate-pulse">
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white fill-white" />
                    </div>
                    <span className="text-md sm:text-2xl md:text-3xl font-black text-white tracking-wider uppercase" style={{ fontFamily: "'Bungee', cursive" }}>
                      Explorar Niveles
                    </span>
                  </div>
                  
                  {/* Brillo superior */}
                  <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
                  
                  {/* Efecto de presión al hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 rounded-xl sm:rounded-2xl"></div>
                </div>
                
                {/* Partículas brillantes flotantes - tonos dorados */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-ping shadow-lg shadow-amber-400/50"></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-ping shadow-lg shadow-yellow-400/50" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-3 sm:-left-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 -right-3 sm:-right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                
                {/* Rayos de luz */}
                <div className="absolute top-0 left-1/4 w-0.5 sm:w-1 h-full bg-gradient-to-b from-amber-300/40 to-transparent transform -skew-x-12 animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-0.5 sm:w-1 h-full bg-gradient-to-b from-yellow-300/40 to-transparent transform skew-x-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </button>

            </div>
          </div>
          
          {/* Efecto de brillo al hover en toda la card */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;