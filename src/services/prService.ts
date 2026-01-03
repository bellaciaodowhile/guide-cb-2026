import prBookData from '../data/pr-book-processed.json';
import type { PRChapter, PRParagraph } from '../types/bible';

export class PRService {
  private static prBook: any = prBookData; // Usar any temporalmente para evitar problemas de tipos

  static async getPRChapter(danielChapter: number): Promise<PRChapter | null> {
    // Simular una pequeña demora para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chapter = this.prBook.chapters.find((ch: any) => ch.danielChapter === danielChapter);
    
    if (!chapter) return null;

    // Convertir y limpiar los datos
    return {
      prChapter: chapter.prChapter,
      danielChapter: chapter.danielChapter,
      title: chapter.title,
      paragraphs: chapter.paragraphs.map((p: any) => ({
        id: p.id,
        text: p.text,
        hasQuote: Boolean(p.hasQuote),
        type: p.type === 'quote' ? 'quote' : 'narrative',
        quotes: p.quotes || []
      })),
      totalParagraphs: chapter.totalParagraphs,
      quoteParagraphs: chapter.quoteParagraphs
    };
  }

  static async getAllPRChapters(): Promise<PRChapter[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.prBook.chapters.map((ch: any) => ({
      prChapter: ch.prChapter,
      danielChapter: ch.danielChapter,
      title: ch.title,
      paragraphs: ch.paragraphs.map((p: any) => ({
        id: p.id,
        text: p.text,
        hasQuote: Boolean(p.hasQuote),
        type: p.type === 'quote' ? 'quote' : 'narrative',
        quotes: p.quotes || []
      })),
      totalParagraphs: ch.totalParagraphs,
      quoteParagraphs: ch.quoteParagraphs
    }));
  }

  static getPRChapterTitle(danielChapter: number): string | null {
    const chapter = this.prBook.chapters.find((ch: any) => ch.danielChapter === danielChapter);
    return chapter ? chapter.title : null;
  }

  static getPRBookInfo() {
    return {
      book: this.prBook.book,
      author: this.prBook.author,
      description: this.prBook.description,
      totalChapters: this.prBook.totalChapters,
      chapters: this.prBook.chapters.map((ch: any) => ({
        prChapter: ch.prChapter,
        danielChapter: ch.danielChapter,
        title: ch.title,
        totalParagraphs: ch.totalParagraphs,
        quoteParagraphs: ch.quoteParagraphs
      }))
    };
  }

  static formatParagraphsForReading(paragraphs: PRParagraph[]): string {
    return paragraphs.map(p => {
      if (p.hasQuote && p.quotes && p.quotes.length > 0) {
        // Resaltar las citas bíblicas
        let formattedText = p.text;
        p.quotes.forEach(quote => {
          formattedText = formattedText.replace(quote, `**${quote}**`);
        });
        return formattedText;
      }
      return p.text;
    }).join('\n\n');
  }
}