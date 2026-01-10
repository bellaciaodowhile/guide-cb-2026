import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ReadingTheme {
  id: string;
  name: string;
  description: string;
  styles: {
    background: string;
    cardBackground: string;
    textColor: string;
    headingColor: string;
    borderColor: string;
    verseBackground: string;
    verseHoverBackground: string;
    buttonBackground: string;
    buttonHoverBackground: string;
    buttonText: string;
  };
}

export const READING_THEMES: ReadingTheme[] = [
  {
    id: 'default',
    name: 'Clásico',
    description: 'Tema por defecto con contraste equilibrado',
    styles: {
      background: '#f9fafb',
      cardBackground: '#ffffff',
      textColor: '#111827',
      headingColor: '#111827',
      borderColor: '#e5e7eb',
      verseBackground: '#f9fafb',
      verseHoverBackground: '#f3f4f6',
      buttonBackground: '#3b82f6',
      buttonHoverBackground: '#2563eb',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Tonos cálidos que reducen la fatiga visual',
    styles: {
      background: '#fef7ed',
      cardBackground: '#fffbeb',
      textColor: '#92400e',
      headingColor: '#78350f',
      borderColor: '#fbbf24',
      verseBackground: '#fef3c7',
      verseHoverBackground: '#fde68a',
      buttonBackground: '#b45309',
      buttonHoverBackground: '#92400e',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'cream',
    name: 'Crema',
    description: 'Fondo suave color crema para lectura prolongada',
    styles: {
      background: '#fafaf9',
      cardBackground: '#f5f5f4',
      textColor: '#44403c',
      headingColor: '#292524',
      borderColor: '#d6d3d1',
      verseBackground: '#f5f5f4',
      verseHoverBackground: '#e7e5e4',
      buttonBackground: '#57534e',
      buttonHoverBackground: '#44403c',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'sage',
    name: 'Salvia',
    description: 'Verde suave que relaja la vista',
    styles: {
      background: '#f0fdf4',
      cardBackground: '#f7fee7',
      textColor: '#166534',
      headingColor: '#14532d',
      borderColor: '#bbf7d0',
      verseBackground: '#dcfce7',
      verseHoverBackground: '#bbf7d0',
      buttonBackground: '#16a34a',
      buttonHoverBackground: '#15803d',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    description: 'Púrpura suave que calma y reduce el estrés visual',
    styles: {
      background: '#faf5ff',
      cardBackground: '#f3e8ff',
      textColor: '#7c3aed',
      headingColor: '#6b21a8',
      borderColor: '#c4b5fd',
      verseBackground: '#ede9fe',
      verseHoverBackground: '#ddd6fe',
      buttonBackground: '#8b5cf6',
      buttonHoverBackground: '#7c3aed',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'paper',
    name: 'Papel',
    description: 'Simula papel envejecido para una experiencia de lectura clásica',
    styles: {
      background: '#fefce8',
      cardBackground: '#fef9c3',
      textColor: '#a16207',
      headingColor: '#92400e',
      borderColor: '#facc15',
      verseBackground: '#fef3c7',
      verseHoverBackground: '#fde047',
      buttonBackground: '#ca8a04',
      buttonHoverBackground: '#a16207',
      buttonText: '#ffffff'
    }
  },
  // TEMAS OSCUROS
  {
    id: 'dark-slate',
    name: 'Pizarra Oscura',
    description: 'Tema oscuro elegante con tonos grises suaves',
    styles: {
      background: '#0f172a',
      cardBackground: '#1e293b',
      textColor: '#cbd5e1',
      headingColor: '#f1f5f9',
      borderColor: '#334155',
      verseBackground: '#334155',
      verseHoverBackground: '#475569',
      buttonBackground: '#3b82f6',
      buttonHoverBackground: '#2563eb',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'dark-forest',
    name: 'Bosque Nocturno',
    description: 'Verde oscuro que descansa la vista en ambientes con poca luz',
    styles: {
      background: '#0c1f17',
      cardBackground: '#1a2e23',
      textColor: '#86efac',
      headingColor: '#bbf7d0',
      borderColor: '#166534',
      verseBackground: '#166534',
      verseHoverBackground: '#15803d',
      buttonBackground: '#22c55e',
      buttonHoverBackground: '#16a34a',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'dark-ocean',
    name: 'Océano Profundo',
    description: 'Azul oscuro relajante para lectura nocturna',
    styles: {
      background: '#0c1426',
      cardBackground: '#1e293b',
      textColor: '#7dd3fc',
      headingColor: '#bae6fd',
      borderColor: '#1e40af',
      verseBackground: '#1e40af',
      verseHoverBackground: '#1d4ed8',
      buttonBackground: '#3b82f6',
      buttonHoverBackground: '#2563eb',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'dark-purple',
    name: 'Violeta Nocturno',
    description: 'Púrpura oscuro que reduce la fatiga visual nocturna',
    styles: {
      background: '#1e1b3a',
      cardBackground: '#2d2a4a',
      textColor: '#c4b5fd',
      headingColor: '#e9d5ff',
      borderColor: '#6b21a8',
      verseBackground: '#6b21a8',
      verseHoverBackground: '#7c3aed',
      buttonBackground: '#8b5cf6',
      buttonHoverBackground: '#7c3aed',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'dark-amber',
    name: 'Ámbar Oscuro',
    description: 'Tonos cálidos oscuros perfectos para lectura nocturna',
    styles: {
      background: '#1c1917',
      cardBackground: '#292524',
      textColor: '#fbbf24',
      headingColor: '#fde047',
      borderColor: '#a16207',
      verseBackground: '#a16207',
      verseHoverBackground: '#ca8a04',
      buttonBackground: '#f59e0b',
      buttonHoverBackground: '#d97706',
      buttonText: '#ffffff'
    }
  },
  {
    id: 'dark-minimal',
    name: 'Minimalista Oscuro',
    description: 'Negro puro con texto suave para máximo contraste',
    styles: {
      background: '#000000',
      cardBackground: '#111111',
      textColor: '#d1d5db',
      headingColor: '#f9fafb',
      borderColor: '#374151',
      verseBackground: '#1f2937',
      verseHoverBackground: '#374151',
      buttonBackground: '#6b7280',
      buttonHoverBackground: '#4b5563',
      buttonText: '#ffffff'
    }
  }
];

interface ReadingThemeContextType {
  currentTheme: string;
  theme: ReadingTheme;
  themes: ReadingTheme[];
  changeTheme: (themeId: string) => void;
}

const ReadingThemeContext = createContext<ReadingThemeContextType | undefined>(undefined);

interface ReadingThemeProviderProps {
  children: ReactNode;
}

export const ReadingThemeProvider: React.FC<ReadingThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  useEffect(() => {
    // Cargar tema guardado al inicializar
    try {
      const savedTheme = localStorage.getItem('reading-theme');
      if (savedTheme && READING_THEMES.find(theme => theme.id === savedTheme)) {
        setCurrentTheme(savedTheme);
      }
    } catch {
      // Fallback si localStorage no está disponible
      console.warn('localStorage no disponible, usando tema por defecto');
    }
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('reading-theme', themeId);
    } catch {
      // Fallback si localStorage no está disponible
      console.warn('No se pudo guardar el tema en localStorage');
    }
  };

  const theme = READING_THEMES.find(theme => theme.id === currentTheme) || READING_THEMES[0];

  const value = {
    currentTheme,
    theme,
    themes: READING_THEMES,
    changeTheme
  };

  return (
    <ReadingThemeContext.Provider value={value}>
      {children}
    </ReadingThemeContext.Provider>
  );
};

export const useReadingTheme = () => {
  const context = useContext(ReadingThemeContext);
  if (context === undefined) {
    throw new Error('useReadingTheme must be used within a ReadingThemeProvider');
  }
  return context;
};