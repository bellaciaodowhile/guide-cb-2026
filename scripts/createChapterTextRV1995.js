import fs from 'fs';

// Leer el archivo JSON existente de RV1995
function createChapterTextVersion() {
  console.log('🔄 Creando versión de capítulos completos (RV1995)...');
  
  // Leer el archivo JSON existente
  const existingData = JSON.parse(fs.readFileSync('./src/data/daniel-book.json', 'utf8'));
  
  const danielChapters = {
    book: 'Daniel',
    version: 'rv1995',
    versionName: 'Reina-Valera 1995',
    description: 'El libro de Daniel con capítulos completos como texto continuo, sin subdivisión por versículos.',
    totalChapters: existingData.totalChapters,
    totalVerses: existingData.totalVerses,
    chapters: []
  };

  const chapterDetails = {
    1: {
      title: 'Daniel y sus compañeros en Babilonia',
      subtitle: 'La deportación y la educación en la corte',
      summary: 'Daniel y sus tres amigos son llevados cautivos a Babilonia, donde se destacan por su sabiduría y fidelidad a Dios.'
    },
    2: {
      title: 'El sueño de Nabucodonosor',
      subtitle: 'La estatua de oro, plata, bronce, hierro y barro',
      summary: 'Daniel interpreta el sueño profético del rey sobre los futuros reinos mundiales.'
    },
    3: {
      title: 'El horno de fuego ardiente',
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
      title: 'Visión del carnero y del macho cabrío',
      subtitle: 'Los imperios Medo-Persa y Griego',
      summary: 'Una visión detallada sobre los conflictos entre los imperios Persa y Griego.'
    },
    9: {
      title: 'La oración de Daniel y las setenta semanas',
      subtitle: 'La profecía mesiánica más importante',
      summary: 'Daniel ora por su pueblo y recibe la profecía de las 70 semanas sobre la venida del Mesías.'
    },
    10: {
      title: 'Visión junto al río Hidekel',
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
  };

  // Procesar cada capítulo
  existingData.chapters.forEach(chapter => {
    console.log(`📖 Procesando capítulo ${chapter.chapter}...`);
    
    // Unir todos los versículos en un texto continuo
    const fullText = chapter.verses.map(verse => verse.text).join(' ');
    
    const chapterInfo = {
      chapter: chapter.chapter,
      title: chapterDetails[chapter.chapter].title,
      subtitle: chapterDetails[chapter.chapter].subtitle,
      summary: chapterDetails[chapter.chapter].summary,
      verseCount: chapter.verseCount,
      text: fullText
    };
    
    danielChapters.chapters.push(chapterInfo);
    console.log(`   ✅ Capítulo ${chapter.chapter} procesado: ${fullText.length} caracteres`);
  });

  // Calcular estadísticas
  const totalCharacters = danielChapters.chapters.reduce((sum, ch) => sum + ch.text.length, 0);
  const averageCharactersPerChapter = Math.round(totalCharacters / danielChapters.totalChapters);
  
  danielChapters.totalCharacters = totalCharacters;
  danielChapters.averageCharactersPerChapter = averageCharactersPerChapter;

  // Guardar el archivo JSON
  const jsonData = JSON.stringify(danielChapters, null, 2);
  fs.writeFileSync('./src/data/daniel-chapters-rv1995.json', jsonData, 'utf8');
  
  console.log('✅ Datos guardados en src/data/daniel-chapters-rv1995.json');
  console.log(`📊 Estadísticas:`);
  console.log(`   - Capítulos: ${danielChapters.totalChapters}`);
  console.log(`   - Versículos totales: ${danielChapters.totalVerses}`);
  console.log(`   - Caracteres totales: ${danielChapters.totalCharacters}`);
  console.log(`   - Promedio de caracteres por capítulo: ${danielChapters.averageCharactersPerChapter}`);
}

// Verificar que el archivo fuente existe
if (!fs.existsSync('./src/data/daniel-book.json')) {
  console.error('❌ Error: No se encontró el archivo daniel-book.json');
  console.log('💡 Ejecuta primero: npm run fetch-bible');
  process.exit(1);
}

// Crear directorio de datos si no existe
if (!fs.existsSync('./src/data')) {
  fs.mkdirSync('./src/data', { recursive: true });
}

// Ejecutar la función
createChapterTextVersion();