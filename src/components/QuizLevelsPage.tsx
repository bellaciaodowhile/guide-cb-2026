import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  questions: number;
  locked: boolean;
}

const quizLevels: QuizLevel[] = [
  { id: 1, title: 'Nivel 1', subtitle: 'Daniel y sus compañeros', image: daniel1, difficulty: 'Fácil', questions: 10, locked: false },
  { id: 2, title: 'Nivel 2', subtitle: 'El sueño de Nabucodonosor', image: daniel2, difficulty: 'Fácil', questions: 12, locked: false },
  { id: 3, title: 'Nivel 3', subtitle: 'El horno de fuego', image: daniel3, difficulty: 'Medio', questions: 15, locked: false },
  { id: 4, title: 'Nivel 4', subtitle: 'La locura del rey', image: daniel4, difficulty: 'Medio', questions: 12, locked: false },
  { id: 5, title: 'Nivel 5', subtitle: 'La escritura en la pared', image: daniel5, difficulty: 'Medio', questions: 14, locked: false },
  { id: 6, title: 'Nivel 6', subtitle: 'Daniel en el foso', image: daniel6, difficulty: 'Difícil', questions: 16, locked: false },
  { id: 7, title: 'Nivel 7', subtitle: 'Las cuatro bestias', image: daniel7, difficulty: 'Difícil', questions: 18, locked: false },
  { id: 8, title: 'Nivel 8', subtitle: 'El carnero y el macho cabrío', image: daniel8, difficulty: 'Difícil', questions: 16, locked: false },
  { id: 9, title: 'Nivel 9', subtitle: 'Las setenta semanas', image: daniel9, difficulty: 'Difícil', questions: 14, locked: false },
  { id: 10, title: 'Nivel 10', subtitle: 'Visión junto al río', image: daniel10, difficulty: 'Difícil', questions: 12, locked: false },
  { id: 11, title: 'Nivel 11', subtitle: 'Reyes del norte y sur', image: daniel11, difficulty: 'Difícil', questions: 20, locked: false },
  { id: 12, title: 'Nivel 12', subtitle: 'El tiempo del fin', image: daniel12, difficulty: 'Difícil', questions: 15, locked: false }
];

const QuizLevelsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const currentLevel = quizLevels[currentIndex];

  useEffect(() => {
    setTimeout(() => setHasAnimated(true), 100);
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % quizLevels.length);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + quizLevels.length) % quizLevels.length);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  const handleStartQuiz = () => {
    if (!currentLevel.locked) {
      console.log(`Iniciar quiz nivel ${currentLevel.id}`);
    }
  };

  const getVisibleCards = () => {
    const prevIndex = (currentIndex - 1 + quizLevels.length) % quizLevels.length;
    const nextIndex = (currentIndex + 1) % quizLevels.length;
    return { prev: quizLevels[prevIndex], current: currentLevel, next: quizLevels[nextIndex] };
  };

  const cards = getVisibleCards();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      <div 
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${currentLevel.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-110 group"
      >
        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 pt-24 pb-8">
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 text-center">
          <p className="text-xs md:text-sm text-gray-300 mb-1 uppercase tracking-widest">Selecciona tu nivel</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'Bungee', cursive" }}>
            {currentLevel.subtitle.toUpperCase()}
          </h1>
        </div>

        <div className="w-full max-w-7xl relative mt-20">
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
            {/* Card Izquierda */}
            <div 
              className={`absolute left-0 md:left-10 w-72 md:w-96 transition-all duration-500 ${
                hasAnimated ? 'card-deal-left' : 'opacity-0 -translate-x-full rotate-[-20deg]'
              }`}
              style={{ 
                animationDelay: '0ms',
                transform: isTransitioning ? 'scale(0.75) translateX(-20%) rotate(-5deg)' : 'scale(0.75) translateX(0) rotate(-5deg)'
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-md opacity-60 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
                <div className="h-80 md:h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${cards.prev.image})` }}>
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg md:text-xl font-black text-white" style={{ fontFamily: "'Bungee', cursive" }}>{cards.prev.title}</h3>
                </div>
              </div>
            </div>

            {/* Card Central */}
            <div 
              className={`relative w-80 md:w-[450px] z-20 transition-all duration-500 ${
                hasAnimated ? 'card-deal-center' : 'opacity-0 scale-50'
              } ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative group animate-float">
                {/* Borde dorado brillante más grueso */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-3xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 rounded-3xl"></div>
                
                <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/5 backdrop-blur-xl transform hover:scale-105 transition-transform duration-300">
                  <div className="h-[400px] md:h-[500px] bg-cover bg-center relative" style={{ backgroundImage: `url(${cards.current.image})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t to-black/30" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 pb-6 md:pb-8">
                      <div className="text-center">
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" style={{ fontFamily: "'Bungee', cursive" }}>{cards.current.title}</h2>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Card Derecha */}
            <div 
              className={`absolute right-0 md:right-10 w-72 md:w-96 transition-all duration-500 ${
                hasAnimated ? 'card-deal-right' : 'opacity-0 translate-x-full rotate-[20deg]'
              }`}
              style={{ 
                animationDelay: '400ms',
                transform: isTransitioning ? 'scale(0.75) translateX(20%) rotate(5deg)' : 'scale(0.75) translateX(0) rotate(5deg)'
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-md opacity-60 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
                <div className="h-80 md:h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${cards.next.image})` }}>
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg md:text-xl font-black text-white" style={{ fontFamily: "'Bungee', cursive" }}>{cards.next.title}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Comenzar Nivel - Fijo arriba de las flechas */}
          <div className="hidden fixed bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
            <button
              onClick={handleStartQuiz}
              className="w-full quiz-button group/btn relative animate-bounce-subtle"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-2xl transform translate-y-2 group-hover/btn:translate-y-1 transition-transform duration-150"></div>
              
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl px-6 py-3 md:py-4 transform group-hover/btn:translate-y-1 transition-all duration-150 border-4 border-amber-900/70 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer-fast"></div>
                <div className="relative flex items-center justify-center">
                  <span className="text-base md:text-lg font-black text-amber-900 uppercase" style={{ fontFamily: "'Bungee', cursive" }}>Comenzar Nivel →</span>
                </div>
              </div>
            </button>
          </div>

          {/* Flechas de navegación fijas abajo */}
          <div className="fixed bottom-0 left-0 right-0 z-30 flex md:justify-center md:gap-8 md:pb-8">
            <button
              onClick={handlePrev}
              disabled={isTransitioning}
              className="group/arrow relative disabled:opacity-30 disabled:cursor-not-allowed w-1/2 md:w-auto"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 md:rounded-2xl blur-xl opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 md:rounded-2xl transform translate-y-2 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
              
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 md:rounded-2xl p-6 md:p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-t-4 md:border-4 border-amber-900/70 shadow-2xl flex items-center justify-center">
                <ChevronLeft className="h-10 w-10 md:h-10 md:w-10 text-amber-900 stroke-[3]" />
              </div>
            </button>

            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="group/arrow relative disabled:opacity-30 disabled:cursor-not-allowed w-1/2 md:w-auto"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 md:rounded-2xl blur-xl opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 md:rounded-2xl transform translate-y-2 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
              
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 md:rounded-2xl p-6 md:p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-t-4 md:border-4 border-amber-900/70 shadow-2xl flex items-center justify-center">
                <ChevronRight className="h-10 w-10 md:h-10 md:w-10 text-amber-900 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLevelsPage;
