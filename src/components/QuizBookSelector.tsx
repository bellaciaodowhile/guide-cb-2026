import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

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

  // Obtener la imagen del capítulo actual
  const chapterImage = chapterImages[currentLevel - 1] || daniel1;

  // Generar 10 tarjetas para el nivel actual
  const cards = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleCardOpen = (cardNumber: number) => {
    // Navegar a la ruta del quiz con la categoría, nivel y la pregunta
    const route = category ? `/${category}/quiz/${currentLevel}/${cardNumber}` : `/quiz/${currentLevel}/${cardNumber}`;
    navigate(route);
  };

  const handleBack = () => {
    const route = category ? `/${category}/quiz` : '/quiz';
    navigate(route);
  };

  return (
    <div className="quiz-card-selector">
      {/* Fondo con imagen del capítulo */}
      <div 
        className="card-selector-background"
        style={{ backgroundImage: `url(${chapterImage})` }}
      ></div>
      <div className="card-selector-overlay"></div>
      
      {/* Botón de volver */}
      <button
        onClick={handleBack}
        className="carousel-nav-button group/arrow relative fixed -top-10 left-1 z-50"
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-lg opacity-75 group-hover/arrow:opacity-100 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full transform translate-y-1.5 group-hover/arrow:translate-y-1 transition-transform duration-150"></div>
        
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full p-4 transform group-hover/arrow:translate-y-1 transition-all duration-150 border-3 border-amber-900/70 shadow-2xl">
          <ArrowLeft className="h-8 w-8 text-amber-900 stroke-[3] group-hover/arrow:-translate-x-0.5 transition-transform duration-300" />
        </div>
      </button>

      {/* Título */}
      <div className="card-selector-title">
        <h1 className="text-4xl md:text-6xl font-black text-amber-100 text-center mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" style={{ fontFamily: "'Bungee', cursive" }}>
          Nivel {currentLevel}
        </h1>
        <p className="text-xl md:text-2xl text-amber-200 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Selecciona una sección para comenzar
        </p>
      </div>

      {/* Grid de tarjetas */}
      <div className="cards-grid">
        {cards.map((cardNumber, index) => (
          <GoldenCard
            key={cardNumber}
            number={cardNumber}
            onOpen={() => handleCardOpen(cardNumber)}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizBookSelector;
