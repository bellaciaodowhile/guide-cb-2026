export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface ChapterInfo {
  chapter: number;
  title: string;
  subtitle?: string;
  verseCount: number;
  summary?: string;
  verses?: BibleVerse[];
}

export interface ApiResponse {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  book: string;
  version: string;
  description: string;
  totalChapters: number;
  totalVerses?: number;
  averageVersesPerChapter?: number;
  longestChapter?: number;
  shortestChapter?: number;
  chapters: ChapterInfo[];
}

// Nuevos tipos para Profetas y Reyes
export interface PRParagraph {
  id: number;
  text: string;
  hasQuote: boolean;
  type: 'quote' | 'narrative';
  quotes?: string[];
}

export interface PRChapter {
  prChapter: number;
  danielChapter: number;
  title: string;
  paragraphs: PRParagraph[];
  totalParagraphs: number;
  quoteParagraphs: number;
}

export interface PRBook {
  book: string;
  author: string;
  description: string;
  totalChapters: number;
  chapters: PRChapter[];
}