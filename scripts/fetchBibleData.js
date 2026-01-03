import fs from 'fs';

const API_BASE = 'https://bible-api.deno.dev/api/read/rv1995/daniel';
const TOTAL_CHAPTERS = 12;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`   ✅ Respuesta recibida:`, data.verses ? `${data.verses.length} versículos` : 'Sin versículos');
    return data;
  } catch (error) {
    console.error(`   ❌ Error en fetch:`, error.message);
    throw error;
  }
}

async function fetchAllDanielData() {
  console.log('🔄 Obteniendo datos del libro de Daniel...');
  
  const danielBook = {
    book: 'Daniel',
    version: 'rv1995',
    description: 'El libro de Daniel contiene tanto narrativas históricas como visiones proféticas, mostrando la fidelidad de Dios hacia aquellos que le permanecen fieles en tiempos de adversidad.',
    totalChapters: TOTAL_CHAPTERS,
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

  for (let chapter = 1; chapter <= TOTAL_CHAPTERS; chapter++) {
    try {
      console.log(`📖 Obteniendo capítulo ${chapter}...`);
      
      const url = `${API_BASE}/${chapter}`;
      console.log(`   🔗 URL: ${url}`);
      
      const chapterData = await fetchData(url);
      
      // Verificar que la respuesta tenga la estructura esperada
      let verses = [];
      if (chapterData.verses && Array.isArray(chapterData.verses)) {
        verses = chapterData.verses;
      } else if (chapterData.vers && Array.isArray(chapterData.vers)) {
        // Convertir formato de la API a nuestro formato
        verses = chapterData.vers.map(v => ({
          verse: v.number,
          text: v.verse
        }));
      } else {
        throw new Error(`Estructura de datos inválida: ${JSON.stringify(chapterData)}`);
      }
      
      const chapterInfo = {
        chapter: chapter,
        title: chapterDetails[chapter].title,
        subtitle: chapterDetails[chapter].subtitle,
        summary: chapterDetails[chapter].summary,
        verseCount: verses.length,
        verses: verses
      };
      
      danielBook.chapters.push(chapterInfo);
      console.log(`   ✅ Capítulo ${chapter} procesado: ${chapterData.verses.length} versículos`);
      
      // Pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error obteniendo capítulo ${chapter}:`, error.message);
      
      // Agregar capítulo con datos básicos si falla la API
      danielBook.chapters.push({
        chapter: chapter,
        title: chapterDetails[chapter].title,
        subtitle: chapterDetails[chapter].subtitle,
        summary: chapterDetails[chapter].summary,
        verseCount: 0,
        verses: []
      });
    }
  }

  // Calcular estadísticas finales
  danielBook.totalVerses = danielBook.chapters.reduce((sum, ch) => sum + ch.verseCount, 0);
  danielBook.averageVersesPerChapter = danielBook.totalVerses > 0 ? Math.round(danielBook.totalVerses / danielBook.totalChapters) : 0;
  
  const verseCounts = danielBook.chapters.map(ch => ch.verseCount).filter(count => count > 0);
  danielBook.longestChapter = verseCounts.length > 0 ? Math.max(...verseCounts) : 0;
  danielBook.shortestChapter = verseCounts.length > 0 ? Math.min(...verseCounts) : 0;

  // Guardar el archivo JSON
  const jsonData = JSON.stringify(danielBook, null, 2);
  fs.writeFileSync('./src/data/daniel-book.json', jsonData, 'utf8');
  
  console.log('✅ Datos guardados en src/data/daniel-book.json');
  console.log(`📊 Estadísticas:`);
  console.log(`   - Capítulos: ${danielBook.totalChapters}`);
  console.log(`   - Versículos totales: ${danielBook.totalVerses}`);
  console.log(`   - Promedio por capítulo: ${danielBook.averageVersesPerChapter}`);
  console.log(`   - Capítulo más largo: ${danielBook.longestChapter} versículos`);
  console.log(`   - Capítulo más corto: ${danielBook.shortestChapter} versículos`);
}

// Crear directorio de datos si no existe
if (!fs.existsSync('./src/data')) {
  fs.mkdirSync('./src/data', { recursive: true });
}

// Ejecutar la función
fetchAllDanielData().catch(console.error);