export const API_CONFIG = {
  BASE_URL: 'https://bible-api.deno.dev/api',
  VERSION: 'rv1995',
  BOOK: 'daniel',
  TOTAL_CHAPTERS: 12
};

export const THEME_CONFIG = {
  STORAGE_KEY: 'daniel-bible-theme',
  DEFAULT_THEME: 'light' as const
};

export const CHAPTER_DETAILS = {
  1: {
    title: 'Daniel y sus compañeros en Babilonia',
    subtitle: 'La deportación y la educación en la corte',
    summary: 'Daniel y sus tres amigos son llevados cautivos a Babilonia, donde se destacan por su sabiduría y fidelidad a Dios.'
  },
  2: {
    title: 'Daniel interpreta el sueño de Nabucodonosor',
    subtitle: 'La estatua de oro, plata, bronce, hierro y barro',
    summary: 'Daniel interpreta el sueño profético del rey sobre los futuros reinos mundiales.'
  },
  3: {
    title: 'El horno de fuego',
    subtitle: 'La fidelidad de Sadrac, Mesac y Abed-nego',
    summary: 'Los tres amigos de Daniel se niegan a adorar la estatua de oro y son librados milagrosamente del horno.'
  },
  4: {
    title: 'La locura de Nabucodonosor',
    subtitle: 'El sueño del gran árbol y su cumplimiento',
    summary: 'Daniel interpreta otro sueño del rey que predice su humillación temporal por su orgullo.'
  },
  5: {
    title: 'La escritura en la pared',
    subtitle: 'El fin del reino de Babilonia',
    summary: 'Durante el banquete de Belsasar, aparece una escritura misteriosa que Daniel interpreta como el fin del reino.'
  },
  6: {
    title: 'Daniel en el foso de los leones',
    subtitle: 'La fidelidad en la oración y la liberación divina',
    summary: 'Daniel es arrojado al foso de los leones por orar a Dios, pero es protegido milagrosamente.'
  },
  7: {
    title: 'Visión de las cuatro bestias',
    subtitle: 'Los reinos futuros y el Anciano de días',
    summary: 'Daniel recibe una visión profética de cuatro bestias que representan reinos mundiales futuros.'
  },
  8: {
    title: 'Visión: el carnero y el macho cabrío',
    subtitle: 'Los imperios Medo-Persa y Griego',
    summary: 'Una visión detallada sobre los conflictos entre los imperios Persa y Griego.'
  },
  9: {
    title: 'Oración de Daniel por su pueblo y Profecía de las setenta semanas',
    subtitle: 'La profecía mesiánica más importante',
    summary: 'Daniel ora por su pueblo (vs. 1-19) y recibe la profecía de las 70 semanas sobre la venida del Mesías (vs. 20-27).',
    sections: [
      {
        title: 'Oración de Daniel por su pueblo',
        verses: '1-19',
        description: 'Daniel intercede por Israel reconociendo sus pecados y pidiendo perdón'
      },
      {
        title: 'Profecía de las setenta semanas',
        verses: '20-27',
        description: 'Gabriel revela la profecía mesiánica de las 70 semanas'
      }
    ]
  },
  10: {
    title: 'Visión de Daniel junto al río',
    subtitle: 'La aparición del varón vestido de lino',
    summary: 'Daniel recibe una visión gloriosa y es fortalecido para recibir revelaciones finales.'
  },
  11: {
    title: 'Los reyes del norte y del sur',
    subtitle: 'Profecías detalladas sobre conflictos futuros',
    summary: 'Profecías específicas sobre las guerras entre los reinos del norte y del sur.'
  },
  12: {
    title: 'El tiempo del fin',
    subtitle: 'La resurrección y el juicio final',
    summary: 'Las profecías finales sobre la resurrección, el juicio y la recompensa de los justos.'
  }
} as const;