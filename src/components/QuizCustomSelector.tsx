import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { QuestionService } from '../services/questionService';

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

const chapterImages = [
  daniel1, daniel2, daniel3, daniel4, daniel5, daniel6,
  daniel7, daniel8, daniel9, daniel10, daniel11, daniel12
];

interface GoldenCardProps {
  number: number;
  onOpen: () => void;
}

const GoldenCard: React.FC<GoldenCardProps> = ({ number, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="golden-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      <div className={`golden-card ${isHovered ? 'golden-card-hovered' : ''}`}>
        <div className="golden-card-glow"></div>
        <div className="golden-card-border-outer"></div>
        
        <div className="golden-card-content">
          <div className="golden-card-inner-frame"></div>
          
          <div className="golden-card-number">
            <span style={{ fontFamily: "'Bungee', cursive" }}>{number}</span>
          </div>
          
          <div className="golden-card-label">
            <Sparkles className="w-5 h-5" />
            <span style={{ fontFamily: "'Bungee', cursive" }}>SECCIÓN</span>
            <Sparkles className="w-5 h-5" />
          </div>
          
          <div className="golden-card-pattern"></div>
        </div>
        
        <div className="card-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </div>
    </div>
  );
};

const QuizCustomSelector: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  
  // Obtener los capítulos seleccionados de los parámetros de la URL
  const chaptersParam = searchParams.get('chapters');
  const selectedChapters = chaptersParam ? chaptersParam.split(',').map(Number) : [];

  // Estados para cargar las secciones disponibles
  const [sectionsCount, setSectionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Usar la primera imagen de los capítulos seleccionados como fondo
  const backgroundImage = selectedChapters.length > 0 
    ? chapterImages[selectedChapters[0] - 1] 
    : daniel1;

  // Cargar preguntas y calcular secciones disponibles
  useEffect(() => {
    loadSections();
  }, [chaptersParam]);

  const loadSections = async () => {
    setLoading(true);
    try {
      let totalQuestions = 0;
      
      // Cargar preguntas de todos los capítulos seleccionados
      for (const chapterId of selectedChapters) {
        const questions = await QuestionService.getApprovedQuestionsByChapter(chapterId);
        totalQuestions += questions.length;
      }
      
      // Calcular número de secciones (20 preguntas por sección)
      const sections = Math.ceil(totalQuestions / 20);
      setSectionsCount(sections);
    } catch (error) {
      console.error('Error loading sections:', error);
      setSectionsCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Generar tarjetas basadas en las secciones disponibles
  const availableCards = Array.from({ length: sectionsCount }, (_, i) => i + 1);

  const handleCardOpen = (cardNumber: number) => {
    // Navegar al quiz con los capítulos personalizados
    const route = category 
      ? `/${category}/quiz/custom/${cardNumber}?chapters=${chaptersParam}` 
      : `/quiz/custom/${cardNumber}?chapters=${chaptersParam}`;
    navigate(route);
  };

  const handleBack = () => {
    const route = category ? `/${category}/quiz` : '/quiz';
    navigate(route);
  };

  if (loading) {
    return (
      <div className="quiz-card-selector">
        <div 
          className="card-selector-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="card-selector-overlay"></div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Bungee', cursive" }}>
              Cargando secciones...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card-selector">
      <div 
        className="card-selector-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="card-selector-overlay"></div>
      
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

      <div className="card-selector-title">
        <h1 className="text-4xl md:text-6xl font-black text-amber-100 text-center mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ fontFamily: "'Bungee', cursive" }}>
          Nivel Personalizado
        </h1>
        <p className="text-xl md:text-2xl text-amber-200 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Capítulos: {selectedChapters.join(', ')}
        </p>
        <p className="text-lg md:text-xl text-amber-300 text-center mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {sectionsCount > 0 ? 'Selecciona una sección para comenzar' : 'No hay preguntas disponibles'}
        </p>
      </div>

      {sectionsCount > 0 ? (
        <div className="cards-grid">
          {availableCards.map((cardNumber) => (
            <GoldenCard
              key={cardNumber}
              number={cardNumber}
              onOpen={() => handleCardOpen(cardNumber)}
            />
          ))}
          
          {/* Card de Próximamente solo si hay menos de 10 secciones */}
          {sectionsCount < 10 && (
            <div className="golden-card-container coming-soon-card">
              <div className="golden-card golden-card-coming-soon">
                <div className="golden-card-border-outer"></div>
                
                <div className="golden-card-content">
                  <div className="golden-card-inner-frame"></div>
                  
                  <div className="coming-soon-content">
                    <span className="coming-soon-text" style={{ fontFamily: "'Bungee', cursive" }}>
                      PRÓXIMAMENTE
                    </span>
                  </div>
                  
                  <div className="golden-card-pattern"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-12">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-8 max-w-md">
            <p className="text-red-200 text-center text-lg">
              Los capítulos seleccionados no tienen preguntas disponibles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCustomSelector;
