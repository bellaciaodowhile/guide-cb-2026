export const YOUTUBE_CHAPTER_LINKS: Record<number, string> = {
  1: 'https://youtu.be/nIT4DOKIk3M',
  2: 'https://youtu.be/eJv_Cv8V2MA',
  3: 'https://youtu.be/a8xcTObd0Sw',
  4: 'https://youtu.be/Vsjhy9R0NXI',
  5: 'https://youtu.be/TNHzLkB6KlE',
  6: 'https://youtu.be/dhT_ceFnIi4',
  7: 'https://youtu.be/KviUhZk60L4',
  8: 'https://youtu.be/jIBBs2nj3Vo',
  9: 'https://youtu.be/meFgaDJZ4Mw',
  10: 'https://youtu.be/cw25fyL3fUI',
  11: 'https://youtu.be/3BhedxKft1Y',
  12: 'https://youtu.be/-NJeCMeY2hY'
};

export function getYouTubeLink(chapter: number): string | null {
  return YOUTUBE_CHAPTER_LINKS[chapter] || null;
}
