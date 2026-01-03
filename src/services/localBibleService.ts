import danielBookData from '../data/daniel-book.json';
import type { ChapterInfo, ApiResponse, BibleBook } from '../types/bible';

export class LocalBibleService {
  private static danielBook: BibleBook = danielBookData as BibleBook;

  static async getAllDanielChapters(): Promise<ChapterInfo[]> {
    // Simular una pequeña demora para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.danielBook.chapters.map(chapter => ({
      chapter: chapter.chapter,
      title: chapter.title,
      subtitle: chapter.subtitle,
      summary: chapter.summary,
      verseCount: chapter.verseCount
    }));
  }

  static async getChapter(chapterNumber: number): Promise<ApiResponse> {
    // Simular una pequeña demora para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chapter = this.danielBook.chapters.find(ch => ch.chapter === chapterNumber);
    
    if (!chapter || !chapter.verses) {
      throw new Error(`Capítulo ${chapterNumber} no encontrado`);
    }

    return {
      book: this.danielBook.book,
      chapter: chapter.chapter,
      verses: chapter.verses
    };
  }

  static async getDanielBook(): Promise<BibleBook> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.danielBook;
  }

  static getBookInfo() {
    return {
      name: this.danielBook.book,
      version: this.danielBook.version,
      description: this.danielBook.description,
      totalChapters: this.danielBook.totalChapters,
      totalVerses: this.danielBook.totalVerses,
      averageVersesPerChapter: this.danielBook.averageVersesPerChapter,
      longestChapter: this.danielBook.longestChapter,
      shortestChapter: this.danielBook.shortestChapter
    };
  }
}