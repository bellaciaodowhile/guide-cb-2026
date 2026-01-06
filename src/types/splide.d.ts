declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react';

  export interface SplideOptions {
    type?: 'slide' | 'loop' | 'fade';
    perPage?: number;
    perMove?: number;
    gap?: string | number;
    pagination?: boolean;
    arrows?: boolean;
    focus?: 'center' | number;
    trimSpace?: boolean;
    autoplay?: boolean;
    breakpoints?: {
      [key: number]: Partial<SplideOptions>;
    };
  }

  export interface SplideProps {
    options?: SplideOptions;
    onMove?: (splide: any, newIndex: number) => void;
    className?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}

declare module '@splidejs/react-splide/css' {
  // CSS module
}