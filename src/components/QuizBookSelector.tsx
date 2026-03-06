import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
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
  delay: number;
}

const GoldenCard: React.FC<GoldenCardProps> = ({ number, onOpen, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="golden-card-container"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      <div className={`golden-card ${isHovered ? 'golden-card-hovered' : ''}`}>
        {/* Brillo de fondo */}
        <div className="golden-card-glow"></div>
        
        {/* Borde decorativo exterior */}
        <div className="golden-card-border-outer"></div>
        
        {/* Contenido de la tarjeta */}
        <div className="golden-card-content">
          {/* Marco decorativo interno */}
          <div className="golden-card-inner-frame"></div>
          
          {/* Número central */}
          <div className="golden-card-number">
            <span style={{ fontFamily: "'Bungee', cursive" }}>{number}</span>
          </div>
          
          {/* Texto inferior */}
          <div className="golden-card-label">
            <Sparkles className="w-5 h-5" />
            <span style={{ fontFamily: "'Bungee', cursive" }}>SECCIÓN</span>
            <Sparkles className="w-5 h-5" />
          </div>
          
          {/* Patrón decorativo de fondo */}
          <div className="golden-card-pattern"></div>
        </div>
        
        {/* Partículas flotantes */}
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

const QuizBookSelector: React.FC = () => {
  const navigate = useNavigate();
  const { category, level } = useParams<{ category: string; level: string }>();
  const currentLevel = parseInt(level || '1');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  // Obtener la imagen del capítulo actual
  const chapterImage = chapterImages[currentLevel - 1] || daniel1;

  // Cargar preguntas aprobadas del capítulo
  useEffect(() => {
    loadQuestions();
  }, [currentLevel]);

  const loadQuestions = async () => {
    setLoading(true);
    const questions = await QuestionService.getApprovedQuestionsByChapter(currentLevel);
    setTotalQuestions(questions.length);
    setLoading(false);
  };

  // Calcular número de secciones (cada sección tiene máximo 20 preguntas)
  const numberOfSections = Math.ceil(totalQuestions / 20);
  const cards = Array.from({ length: numberOfSections }, (_, i) => i + 1);

  const handleCardOpen = (cardNumber: number) => {
    // Navegar a la ruta del quiz con la categoría, nivel y la sección
    const route = category ? `/${category}/quiz/${currentLevel}/${cardNumber}` : `/quiz/${currentLevel}/${cardNumber}`;
    navigate(route);
  };

  const handleBack = () => {
    const route = category ? `/${category}/quiz` : '/quiz';
    navigate(route);
  };

  if (loading) {
    return (
      <div className="quiz-book-selector-new">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">Cargando preguntas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-book-selector-new">
      {/* Fondo con imagen del capítulo blureada */}
      <div 
        className="card-selector-background"
        style={{ backgroundImage: `url(${chapterImage})` }}
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

      {/* Contenedor principal estilo quiz */}
      <div className="book-selector-quiz-container">
        {/* Card principal estilo trivia */}
        <div className="book-selector-card-trivia">
          {/* Título del capítulo dentro de la card */}
          <div className="book-selector-header">
            <h1 className="book-selector-title" style={{ fontFamily: "'Bungee', cursive" }}>
              Capítulo {currentLevel}
            </h1>
            <p className="book-selector-subtitle">
              {totalQuestions > 0 
                ? `${totalQuestions} ${totalQuestions === 1 ? 'pregunta disponible' : 'preguntas disponibles'}`
                : 'Sin preguntas disponibles'
              }
            </p>
          </div>

          {/* Grid de tarjetas o mensaje de sin preguntas */}
          {totalQuestions === 0 ? (
            <div className="book-selector-no-questions">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-3" />
              <p className="text-base font-bold text-gray-800 mb-2" style={{ fontFamily: "'Bungee', cursive" }}>
                Sin Preguntas
              </p>
              <p className="text-sm text-gray-600">
                Este capítulo aún no tiene preguntas aprobadas.
              </p>
            </div>
          ) : (
            <div className="book-selector-sections-grid">
              {cards.map((cardNumber, index) => (
                <GoldenCard
                  key={cardNumber}
                  number={cardNumber}
                  onOpen={() => handleCardOpen(cardNumber)}
                  delay={index * 100}
                />
              ))}
              
              {/* Card de Próximamente */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBookSelector;
