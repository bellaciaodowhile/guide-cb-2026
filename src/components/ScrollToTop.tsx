import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Función para manejar el scroll
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Agregar event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Mostrar si hay scroll suficiente
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-6 z-50 p-3 
        bottom-6 min-[750px]:bottom-6 max-[749px]:bottom-20
        bg-primary-600 hover:bg-primary-700 active:bg-primary-800
        dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700
        text-white rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800
        animate-bounce-in
        border-2 border-white/20 dark:border-gray-800/50
      `}
      aria-label="Volver al inicio de la página"
      title="Volver al inicio"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
};

export default ScrollToTop;