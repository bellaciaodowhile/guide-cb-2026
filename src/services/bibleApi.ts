import type { ApiResponse, ChapterInfo, BibleBook } from '../types/bible';
import { API_CONFIG, CHAPTER_DETAILS } from '../utils/constants';

export class BibleApiService {
  static async getChapter(version: string, book: string, chapter: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/read/${version}/${book}/${chapter}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching chapter: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  }

  static async getVerse(version: string, book: string, chapter: number, verse: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/read/${version}/${book}/${chapter}/${verse}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching verse: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  }

  static async getAllDanielChapters(version: string = API_CONFIG.VERSION): Promise<ChapterInfo[]> {
    const chapters: ChapterInfo[] = [];
    
    for (let i = 1; i <= API_CONFIG.TOTAL_CHAPTERS; i++) {
      try {
        const chapterData = await this.getChapter(version, API_CONFIG.BOOK, i);
        const chapterDetail = CHAPTER_DETAILS[i as keyof typeof CHAPTER_DETAILS];
        
        chapters.push({
          chapter: i,
          title: chapterDetail.title,
          subtitle: chapterDetail.subtitle,
          verseCount: chapterData.verses.length,
          summary: chapterDetail.summary
        });
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching chapter ${i}:`, error);
        const chapterDetail = CHAPTER_DETAILS[i as keyof typeof CHAPTER_DETAILS];
        
        chapters.push({
          chapter: i,
          title: chapterDetail.title,
          subtitle: chapterDetail.subtitle,
          verseCount: 0,
          summary: chapterDetail.summary
        });
      }
    }
    
    return chapters;
  }

  static async getDanielBook(): Promise<BibleBook> {
    const chapters = await this.getAllDanielChapters();
    const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verseCount, 0);
    
    return {
      book: 'Daniel',
      version: 'RV95',
      chapters,
      totalChapters: chapters.length,
      totalVerses,
      description: 'El libro de Daniel contiene tanto narrativas históricas como visiones proféticas, mostrando la fidelidad de Dios hacia aquellos que le permanecen fieles en tiempos de adversidad.'
    };
  }
}