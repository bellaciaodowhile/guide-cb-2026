import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

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

const QuizLevelsPageCandyCrush: React.FC = () => {
  const navigate = useNavigate();
  const [hasAnimated, setHasAnimated] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const levelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setTimeout(() => setHasAnimated(true), 100);
  }, []);

  useEffect(() => {
    if (!hasAnimated || !pathRef.current) return;

    // Animar los niveles a lo largo del path usando GSAP MotionPath
    levelsRef.current.forEach((level, index) => {
      if (level) {
        gsap.fromTo(
          level,
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
            motionPath: {
              path: pathRef.current!,
              align: pathRef.current!,
              alignOrigin: [0.5, 0.5],
              start: index / (quizLevels.length - 1),
              end: index / (quizLevels.length - 1),
            },
          }
        );
      }
    });
  }, [hasAnimated]);

  const handleStartQuiz = (levelId: number) => {
    console.log(`Iniciar quiz nivel ${levelId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo de Babilonia */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=2070)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 via-orange-900/70 to-yellow-900/80"></div>
      </div>

      {/* Textura de papiro/pergamino */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 p-3 bg-amber-900/80 hover:bg-amber-800/90 backdrop-blur-md rounded-full border-2 border-amber-600 text-amber-100 transition-all duration-300 hover:scale-110 group shadow-2xl"
      >
        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <div className="relative z-10 min-h-screen px-4 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-amber-900/60 backdrop-blur-md px-8 py-4 rounded-2xl border-4 border-amber-600 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-amber-100 drop-shadow-2xl mb-2" style={{ fontFamily: "'Bungee', cursive" }}>
              MAPA DE DANIEL
            </h1>
            <p className="text-base text-amber-300 font-semibold">12 Capítulos del Libro Profético</p>
          </div>
        </div>

        {/* Contenedor del roadmap */}
        <div className="relative w-full max-w-4xl mx-auto" style={{ height: '2400px' }}>
          {/* Camino SVG con MotionPath */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(217, 119, 6)" stopOpacity="0.9" />
                <stop offset="50%" stopColor="rgb(245, 158, 11)" stopOpacity="1" />
                <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity="0.9" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Camino principal - path para MotionPath */}
            <path
              ref={pathRef}
              d="M 50% 50 
                 C 50% 150, 80% 250, 70% 350
                 S 30% 450, 40% 550
                 S 75% 650, 65% 750
                 S 35% 850, 45% 950
                 S 70% 1050, 60% 1150
                 S 30% 1250, 40% 1350
                 S 75% 1450, 65% 1550
                 S 35% 1650, 45% 1750
                 S 70% 1850, 60% 1950
                 S 40% 2050, 50% 2150
                 S 50% 2250, 50% 2350"
              stroke="url(#pathGradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
            
            {/* Borde oscuro del camino */}
            <path
              d="M 50% 50 
                 C 50% 150, 80% 250, 70% 350
                 S 30% 450, 40% 550
                 S 75% 650, 65% 750
                 S 35% 850, 45% 950
                 S 70% 1050, 60% 1150
                 S 30% 1250, 40% 1350
                 S 75% 1450, 65% 1550
                 S 35% 1650, 45% 1750
                 S 70% 1850, 60% 1950
                 S 40% 2050, 50% 2150
                 S 50% 2250, 50% 2350"
              stroke="rgba(120, 53, 15, 0.8)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Decoraciones en el camino (puntos) */}
            <path
              d="M 50% 50 
                 C 50% 150, 80% 250, 70% 350
                 S 30% 450, 40% 550
                 S 75% 650, 65% 750
                 S 35% 850, 45% 950
                 S 70% 1050, 60% 1150
                 S 30% 1250, 40% 1350
                 S 75% 1450, 65% 1550
                 S 35% 1650, 45% 1750
                 S 70% 1850, 60% 1950
                 S 40% 2050, 50% 2150
                 S 50% 2250, 50% 2350"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,20"
              strokeLinecap="round"
            />
          </svg>

          {/* Niveles - se posicionarán con MotionPath */}
          {quizLevels.map((level, index) => (
            <div
              key={level.id}
              ref={(el) => (levelsRef.current[index] = el)}
              className="absolute"
              style={{
                left: '50%',
                top: '50px',
                transform: 'translate(-50%, -50%)',
                zIndex: 20 - index,
              }}
            >
              <div
                className="relative group cursor-pointer"
                onClick={() => handleStartQuiz(level.id)}
              >
                {/* Glow effect */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                
                {/* Círculo del nivel */}
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  {/* Anillo exterior decorativo */}
                  <div className="absolute -inset-2 rounded-full border-4 border-amber-500/50 animate-spin-slow"></div>
                  <div className="absolute -inset-1 rounded-full border-2 border-yellow-400/30 animate-spin-reverse"></div>
                  
                  {/* Círculo principal con imagen */}
                  <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-amber-600 shadow-2xl transform group-hover:scale-110 transition-transform duration-300 bg-amber-900">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${level.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    </div>
                    
                    {/* Número del nivel */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-4 border-amber-900 shadow-xl">
                        <span className="text-2xl md:text-3xl font-black text-amber-900" style={{ fontFamily: "'Bungee', cursive" }}>
                          {level.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooltip con info del nivel */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-amber-900/95 backdrop-blur-md rounded-xl px-5 py-3 border-3 border-amber-600 shadow-2xl whitespace-nowrap">
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{level.title}</p>
                    <p className="text-sm text-amber-100 font-semibold mt-1">{level.subtitle}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3].map((star) => (
                        <div key={star} className="w-5 h-5">
                          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                                  fill="rgb(251, 191, 36)" 
                                  stroke="rgb(120, 53, 15)" 
                                  strokeWidth="1.5"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-900/95 border-t-3 border-l-3 border-amber-600 transform rotate-45"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de scroll */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="bg-amber-900/80 backdrop-blur-md rounded-full px-5 py-3 border-2 border-amber-600 shadow-2xl">
            <p className="text-amber-100 text-sm font-bold">Desliza para explorar ↓</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLevelsPageCandyCrush;
