import React from 'react';
import bannerQuiz from '../assets/banner-quiz.png';

interface QuizCardProps {
  animationDelay?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ animationDelay = '0ms' }) => {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay }}
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
        <div 
          className="h-full min-h-[300px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bannerQuiz})`
          }}
        >
          {/* Sombra inteligente adicional */}
          <div className="absolute inset-0 shadow-inner"></div>
          
          {/* Contenido */}
          <div className="relative z-10 h-full flex items-end justify-center px-6 pb-4">
            <button className="bg-white border border-gray-200 rounded-lg px-6 py-3 hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
                  Prueba tu conocimiento
                </h3>
                <p className="text-gray-600 text-xs font-medium">
                  Próximamente...
                </p>
              </div>
            </button>
          </div>
          
          {/* Efecto de brillo al hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;