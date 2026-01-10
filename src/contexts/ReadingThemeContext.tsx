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