import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Importar imágenes de capítulos
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

interface QuizLevel {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

// Todos los niveles disponibles
const allQuizLevels: QuizLevel[] = [
  { id: 1, title: 'Nivel 1', subtitle: 'Daniel y sus compañeros', image: daniel1 },
  { id: 2, title: 'Nivel 2', subtitle: 'El sueño de Nabucodonosor', image: daniel2 },
  { id: 3, title: 'Nivel 3', subtitle: 'El horno de fuego', image: daniel3 },
  { id: 4, title: 'Nivel 4', subtitle: 'La locura del rey', image: daniel4 },
  { id: 5, title: 'Nivel 5', subtitle: 'La escritura en la pared', image: daniel5 },
  { id: 6, title: 'Nivel 6', subtitle: 'Daniel en el foso', image: daniel6 },
  { id: 7, title: 'Nivel 7', subtitle: 'Las cuatro bestias', image: daniel7 },
  { id: 8, title: 'Nivel 8', subtitle: 'El carnero y el macho cabrío', image: daniel8 },
  { id: 9, title: 'Nivel 9', subtitle: 'Las setenta semanas', image: daniel9 },
  { id: 10, title: 'Nivel 10', subtitle: 'Visión junto al río', image: daniel10 },
  { id: 11, title: 'Nivel 11', subtitle: 'Reyes del norte y sur', image: daniel11 },
  { id: 12, title: 'Nivel 12', subtitle: 'El tiempo del fin', image: daniel12 },
  { id: 13, title: 'Nivel Personalizado', subtitle: 'Crea tu propio desafío', image: '' } // Nivel personalizado
];

// Configuración de capítulos por categoría
const categoryChapters: Record<string, number[]> = {
  aventureros: [1, 2, 3, 6], // 4 capítulos
  conquistadores: [1, 2, 3, 4, 5, 6], // 6 capítulos
  guiasmayores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // 12 capítulos
};

const QuizLevelsPageCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  
  // Mostrar todos los niveles siempre
  const quizLevels = allQuizLevels;
  
  // Función para verificar si un capítulo pertenece a la categoría
  const isChapterInCategory = (chapterId: number): boolean => {
    if (!category) return true; // Si no hay categoría, permitir todos
    const allowedChapters = categoryChapters[category] || [];
    return allowedChapters.includes(chapterId);
  };
  
  const [active, setActive] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const scrollAccumulator = useRef(0);
  const scrollTimeout = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Estado para el modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [pendingLevelId, setPendingLevelId] = useState<number | null>(null);
  
  // Estado para el modal de personalización
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<number[]>(() => {
    // Cargar la selección guardada del localStorage al iniciar
    const saved = localStorage.getItem('customQuizChapters');
    return saved ? JSON.parse(saved) : [];
  });

  const scrollThreshold = 250; // Umbral más alto para evitar cambios accidentales

  const getZindex = (index: number, activeIndex: number) => {
    const length = quizLevels.length;
    return index === activeIndex ? length : length - Math.abs(activeIndex - index);
  };

  const animate = (newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(newProgress, 100));
    const newActive = Math.floor((clampedProgress / 100) * quizLevels.length);
    // Asegurarse de que no exceda el índice máximo
    setActive(Math.min(newActive, quizLevels.length - 1));
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    // Acumular el scroll
    scrollAccumulator.current += e.deltaY;
    
    // Limpiar el timeout anterior
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Si el scroll acumulado supera el umbral, cambiar de slide
    if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(active + direction, quizLevels.length - 1));
      
      if (nextIndex !== active) {
        const newProgress = (nextIndex / (quizLevels.length - 1)) * 100;
        animate(newProgress);
      }
      
      // Resetear el acumulador
      scrollAccumulator.current = 0;
    }
    
    // Resetear el acumulador después de un tiempo sin scroll
    scrollTimeout.current = window.setTimeout(() => {
      scrollAccumulator.current = 0;
    }, 200);
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (e.type === 'mousemove') {
      const mouseEvent = e as MouseEvent;
      setCursorPos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
    // No actualizar el progreso durante el movimiento
  };

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    setIsDown(true);
    const x = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).touches[0].clientX;
    setStartX(x);
  };

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if (!isDown) return;
    
    const x = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).changedTouches?.[0]?.clientX || startX;
    const distance = x - startX;
    const threshold = 50; // Umbral mínimo de movimiento para cambiar de slide
    
    if (Math.abs(distance) > threshold) {
      // Determinar dirección y cambiar solo una card
      if (distance > 0) {
        // Swipe derecha - ir a la anterior
        const prevIndex = Math.max(active - 1, 0);
        if (prevIndex !== active) {
          const newProgress = (prevIndex / (quizLevels.length - 1)) * 100;
          animate(newProgress);
        }
      } else {
        // Swipe izquierda - ir a la siguiente
        const nextIndex = Math.min(active + 1, quizLevels.length - 1);
        if (nextIndex !== active) {
          const newProgress = (nextIndex / (quizLevels.length - 1)) * 100;
          animate(newProgress);
        }
      }
    }
    
    setIsDown(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const wheelHandler = (e: WheelEvent) => handleWheel(e);
    const mouseDownHandler = (e: MouseEvent | TouchEvent) => handleMouseDown(e);
    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => handleMouseMove(e);
    const mouseUpHandler = (e: MouseEvent | TouchEvent) => handleMouseUp(e);
    
    carousel.addEventListener('wheel', wheelHandler, { passive: false });
    document.addEventListener('mousedown', mouseDownHandler as any);
    document.addEventListener('mousemove', mouseMoveHandler as any);
    document.addEventListener('mouseup', mouseUpHandler as any);
    document.addEventListener('touchstart', mouseDownHandler as any);
    document.addEventListener('touchmove', mouseMoveHandler as any, { passive: true });
    document.addEventListener('touchend', mouseUpHandler as any);

    return () => {
      carousel.removeEventListener('wheel', wheelHandler);
      document.removeEventListener('mousedown', mouseDownHandler as any);
      document.removeEventListener('mousemove', mouseMoveHandler as any);
      document.removeEventListener('mouseup', mouseUpHandler as any);
      document.removeEventListener('touchstart', mouseDownHandler as any);
      document.removeEventListener('touchmove', mouseMoveHandler as any);
      document.removeEventListener('touchend', mouseUpHandler as any);
      
      // Limpiar timeout al desmontar
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [active, isDown, startX]);

  const handleItemClick = (index: number) => {
    const newProgress = (index / (quizLevels.length - 1)) * 100;
    animate(newProgress);
  };
  
  const handleExploreClick = (levelId: number) => {
    if (!isChapterInCategory(levelId)) {
      // Mostrar modal de confirmación
      setPendingLevelId(levelId);
      setShowModal(true);
    } else {
      // Navegar directamente
      navigateToLevel(levelId);
    }
  };
  
  const navigateToLevel = (levelId: number) => {
    const route = category ? `/${category}/quiz/${levelId}` : `/quiz/${levelId}`;
    navigate(route);
  };
  
  const handleConfirmContinue = () => {
    if (pendingLevelId) {
      navigateToLevel(pendingLevelId);
    }
    setShowModal(false);
    setPendingLevelId(null);
  };
  
  const handleCancelContinue = () => {
    setShowModal(false);
    setPendingLevelId(null);
  };
  
  const handleOpenCustomModal = () => {
    setShowCustomModal(true);
    // Cargar la selección guardada al abrir el modal
    const saved = localStorage.getItem('customQuizChapters');
    if (saved) {
      setSelectedChapters(JSON.parse(saved));
    }
  };
  
  const handleCloseCustomModal = () => {
    setShowCustomModal(false);
    // No limpiar selectedChapters para mantener la selección
  };
  
  const handleToggleChapter = (chapterId: number) => {
    setSelectedChapters(prev => {
      const newSelection = prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId].sort((a, b) => a - b);
      
      // Guardar en localStorage
      localStorage.setItem('customQuizChapters', JSON.stringify(newSelection));
      
      return newSelection;
    });
  };
  
  const handleStartCustomQuiz = () => {
    if (selectedChapters.length === 0) {
      alert('Por favor selecciona al menos un capítulo');
      return;
    }
    // Navegar a la página de selección de secciones con los capítulos seleccionados
    const chaptersParam = selectedChapters.join(',');
    const route = category ? `/${category}/quiz/custom?chapters=${chaptersParam}` : `/quiz/custom?chapters=${chaptersParam}`;
    navigate(route);
    handleCloseCustomModal();
  };

  return (
    <div className="quiz-carousel-container">
      {/* Fondo con blur de la imagen activa */}
      <div 
        className="carousel-background"
        style={{
          backgroundImage: quizLevels[active].id === 13 ? `url(${daniel12})` : `url(${quizLevels[active].image})`
        }}
      />
      <div className="carousel-background-overlay" />

      <button
        onClick={() => {
          const route = category ? `/${category}` : '/';
          navigate(route);
        }}
        className="carousel-nav-button group/arrow relative fixed top-6 left-6 z-50"
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
        
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
          <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
        </div>
      </button>

      <div className="carousel" ref={carouselRef}>
        {quizLevels.map((level, index) => {
          const zIndex = getZindex(index, active);
          const activeValue = (index - active) / quizLevels.length;
          const opacity = zIndex / quizLevels.length * 3 - 2;
          const isActive = index === active;

          return (
            <div
              key={level.id}
              className={`carousel-item ${isActive ? 'carousel-item-active' : ''} ${level.id === 13 ? 'carousel-item-custom' : ''}`}
              style={{
                '--zIndex': zIndex,
                '--active': activeValue,
                '--opacity': opacity,
                '--items': quizLevels.length,
                '--card-index': index
              } as React.CSSProperties}
              onClick={() => handleItemClick(index)}
            >
              <div className="carousel-box">
                <div className={`title ${isActive ? 'title-active' : ''}`}>{level.subtitle}</div>
                <div className="num">{level.id === 13 ? '' : String(level.id).padStart(2, '0')}</div>
                {level.id === 13 ? (
                  // Nivel personalizado con capítulos seleccionados o signo de interrogación
                  <div className="custom-level-content">
                    {selectedChapters.length > 0 ? (
                      <div className="custom-level-chapters">
                        {selectedChapters.map((chapterId) => {
                          const chapterLevel = allQuizLevels.find(l => l.id === chapterId);
                          return (
                            <div key={chapterId} className="custom-mini-chapter">
                              <div 
                                className="custom-mini-chapter-image"
                                style={{ backgroundImage: `url(${chapterLevel?.image})` }}
                              />
                              <div className="custom-mini-chapter-number">{chapterId}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="custom-level-question">?</span>
                    )}
                  </div>
                ) : (
                  <img src={level.image} alt={level.subtitle} />
                )}
                
                {/* Botón Explorar - solo visible en slide activo */}
                {isActive && (
                  <div className="carousel-explore-button">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (level.id === 13) {
                          // Abrir modal de personalización
                          handleOpenCustomModal();
                        } else {
                          handleExploreClick(level.id);
                        }
                      }}
                      className="quiz-button group/btn relative w-full"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse-glow"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-2xl transform translate-y-2 group-hover/btn:translate-y-1 transition-transform duration-150"></div>
                      
                      <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl px-8 py-4 transform group-hover/btn:translate-y-1 transition-all duration-150 border-4 border-amber-900/70 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer-fast"></div>
                        <div className="relative flex items-center justify-center">
                          <span className="text-xl font-black text-amber-900 uppercase" style={{ fontFamily: "'Bungee', cursive" }}>
                            {level.id === 13 ? 'Personaliza tu nivel →' : 'Explorar →'}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cursor" style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}></div>
      <div className="cursor cursor2" style={{ transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)` }}></div>
      
      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancelContinue}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title" style={{ fontFamily: "'Bungee', cursive" }}>
              Capítulo fuera de tu categoría
            </h2>
            <p className="modal-message">
              Este capítulo no pertenece a tu categoría actual. ¿Estás seguro que deseas continuar?
            </p>
            <div className="modal-buttons">
              <button onClick={handleCancelContinue} className="modal-button modal-button-cancel">
                Cancelar
              </button>
              <button onClick={handleConfirmContinue} className="modal-button modal-button-confirm">
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de personalización */}
      {showCustomModal && (
        <div className="custom-modal-overlay" onClick={handleCloseCustomModal}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="custom-modal-title" style={{ fontFamily: "'Bungee', cursive" }}>
              Personaliza tu nivel
            </h2>
            <p className="custom-modal-subtitle">
              Selecciona los capítulos que deseas incluir en tu quiz personalizado
            </p>
            
            <div className="chapters-grid">
              {allQuizLevels.slice(0, 12).map((level) => {
                const isSelected = selectedChapters.includes(level.id);
                const selectedIndex = selectedChapters.indexOf(level.id);
                
                return (
                  <div
                    key={level.id}
                    className={`chapter-mini-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleChapter(level.id)}
                    style={isSelected ? {
                      '--stack-index': selectedIndex,
                      '--stack-total': selectedChapters.length
                    } as React.CSSProperties : {}}
                  >
                    <div className="chapter-number">{level.id}</div>
                    <div 
                      className="chapter-image"
                      style={{ backgroundImage: `url(${level.image})` }}
                    ></div>
                    {isSelected && (
                      <div className="chapter-check"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="custom-modal-footer">
              <p className="selected-count">
                {selectedChapters.length} capítulo{selectedChapters.length !== 1 ? 's' : ''} seleccionado{selectedChapters.length !== 1 ? 's' : ''}
              </p>
              <div className="custom-modal-buttons">
                <button onClick={handleCloseCustomModal} className="custom-modal-button custom-modal-button-cancel">
                  Cancelar
                </button>
                <button onClick={handleStartCustomQuiz} className="custom-modal-button custom-modal-button-start">
                  Comenzar Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizLevelsPageCarousel;
