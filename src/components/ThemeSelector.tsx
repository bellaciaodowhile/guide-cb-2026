import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useReadingTheme, type ReadingTheme } from '../hooks/useReadingTheme';

const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, changeTheme, theme } = useReadingTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botón para abrir selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-lg backdrop-blur-sm border transition-all duration-200 shadow-sm hover:shadow-md group"
        style={{
          backgroundColor: `${theme.styles.cardBackground}CC`, // CC para transparencia
          borderColor: theme.styles.borderColor
        }}
        aria-label="Cambiar tema de lectura"
        title="Cambiar tema de lectura"
      >
        <Palette 
          className="h-5 w-5 group-hover:opacity-80 transition-colors duration-200"
          style={{ color: theme.styles.textColor }}
        />
      </button>

      {/* Panel de selección de temas */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel de temas */}
          <div 
            className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border z-50 animate-fade-in transition-colors duration-300"
            style={{
              backgroundColor: theme.styles.cardBackground,
              borderColor: theme.styles.borderColor
            }}
          >
            <div className="p-4">
              <h3 
                className="text-lg font-semibold mb-3 flex items-center transition-colors duration-300"
                style={{ color: theme.styles.headingColor }}
              >
                <Palette className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Temas de Lectura
              </h3>
              <p 
                className="text-sm mb-4 transition-colors duration-300"
                style={{ color: theme.styles.textColor, opacity: 0.8 }}
              >
                Elige un tema que sea cómodo para tus ojos
              </p>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {themes.map((themeOption: ReadingTheme) => (
                  <button
                    key={themeOption.id}
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left group ${
                      currentTheme === themeOption.id
                        ? 'ring-2 ring-primary-200'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: currentTheme === themeOption.id 
                        ? theme.styles.verseBackground 
                        : theme.styles.background,
                      borderColor: currentTheme === themeOption.id 
                        ? theme.styles.buttonBackground 
                        : theme.styles.borderColor
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {/* Vista previa del tema */}
                        <div 
                          className="w-8 h-8 rounded-lg border-2 relative overflow-hidden shadow-sm"
                          style={{
                            backgroundColor: themeOption.styles.cardBackground,
                            borderColor: themeOption.styles.borderColor
                          }}
                        >
                          <div 
                            className="absolute inset-1 rounded"
                            style={{ backgroundColor: themeOption.styles.verseBackground }}
                          ></div>
                          <div 
                            className="absolute bottom-1 right-1 w-2 h-1 rounded-sm"
                            style={{ backgroundColor: themeOption.styles.buttonBackground }}
                          ></div>
                        </div>
                        
                        <div>
                          <h4 
                            className="font-medium transition-colors duration-300"
                            style={{ color: theme.styles.headingColor }}
                          >
                            {themeOption.name}
                          </h4>
                        </div>
                      </div>
                      
                      {currentTheme === themeOption.id && (
                        <div className="flex items-center space-x-1">
                          <Check 
                            className="h-5 w-5"
                            style={{ color: theme.styles.buttonBackground }}
                          />
                          <span 
                            className="text-xs font-medium"
                            style={{ color: theme.styles.buttonBackground }}
                          >
                            Activo
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p 
                      className="text-sm opacity-80 transition-colors duration-300"
                      style={{ color: theme.styles.textColor }}
                    >
                      {themeOption.description}
                    </p>
                  </button>
                ))}
              </div>
              
              <div 
                className="mt-4 pt-3 border-t transition-colors duration-300"
                style={{ borderColor: theme.styles.borderColor }}
              >
                <p 
                  className="text-xs text-center transition-colors duration-300"
                  style={{ color: theme.styles.textColor, opacity: 0.6 }}
                >
                  El tema se guarda automáticamente
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;