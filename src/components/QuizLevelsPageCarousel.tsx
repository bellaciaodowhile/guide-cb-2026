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
  { id: 12, title: 'Nivel 12', subtitle: 'El tiempo del fin', image: daniel12 }
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
  
  const [progress, setProgress] = useState(0);
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

  const speedDrag = -0.3;
  const scrollThreshold = 250; // Umbral más alto para evitar cambios accidentales

  const getZindex = (index: number, activeIndex: number) => {
    const length = quizLevels.length;
    return index === activeIndex ? length : length - Math.abs(activeIndex - index);
  };

  const animate = (newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(newProgress, 100));
    setProgress(clampedProgress);
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

    if (!isDown) return;

    const x = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).touches[0].clientX;
    const mouseProgress = (x - startX) * speedDrag;
    animate(progress + mouseProgress);
    setStartX(x);
  };

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    setIsDown(true);
    const x = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).touches[0].clientX;
    setStartX(x);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const wheelHandler = (e: WheelEvent) => handleWheel(e);
    carousel.addEventListener('wheel', wheelHandler, { passive: false });
    document.addEventListener('mousedown', handleMouseDown as any);
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown as any);
    document.addEventListener('touchmove', handleMouseMove as any);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      carousel.removeEventListener('wheel', wheelHandler);
      document.removeEventListener('mousedown', handleMouseDown as any);
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleMouseDown as any);
      document.removeEventListener('touchmove', handleMouseMove as any);
      document.removeEventListener('touchend', handleMouseUp);
      
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

  return (
    <div className="quiz-carousel-container">
      {/* Fondo con blur de la imagen activa */}
      <div 
        className="carousel-background"
        style={{
          backgroundImage: `url(${quizLevels[active].image})`
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
              className={`carousel-item ${isActive ? 'carousel-item-active' : ''}`}
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
                <div className="num">{String(level.id).padStart(2, '0')}</div>
                <img src={level.image} alt={level.subtitle} />
                
                {/* Botón Explorar - solo visible en slide activo */}
                {isActive && (
                  <div className="carousel-explore-button">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExploreClick(level.id);
                      }}
                      className="quiz-button group/btn relative w-full"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse-glow"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-2xl transform translate-y-2 group-hover/btn:translate-y-1 transition-transform duration-150"></div>
                      
                      <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl px-8 py-4 transform group-hover/btn:translate-y-1 transition-all duration-150 border-4 border-amber-900/70 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer-fast"></div>
                        <div className="relative flex items-center justify-center">
                          <span className="text-xl font-black text-amber-900 uppercase" style={{ fontFamily: "'Bungee', cursive" }}>Explorar →</span>
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
    </div>
  );
};

export default QuizLevelsPageCarousel;
