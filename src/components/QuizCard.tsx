import React from 'react';
import { Play, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import daniel6Image from '../assets/capitulos/Daniel 6.webp';

interface QuizCardProps {
  animationDelay?: string;
  category?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ animationDelay = '0ms', category }) => {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    const route = category ? `/${category}/quiz` : '/quiz';
    navigate(route);
  };

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
                onClick={handleQuizClick}
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
                    <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tracking-wider uppercase" style={{ fontFamily: "'Bungee', cursive" }}>
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