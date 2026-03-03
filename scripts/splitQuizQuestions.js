import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo original
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/quiz-questions.json'), 'utf8'));

// Obtener los capítulos
const chapters = data.categories.daniel.chapters;

// Crear un archivo por cada capítulo
Object.keys(chapters).forEach(chapterNum => {
  const chapterData = {
    chapter: parseInt(chapterNum),
    title: chapters[chapterNum].title,
    questions: chapters[chapterNum].questions
  };
  
  const filename = path.join(__dirname, `../src/data/quiz-chapter-${chapterNum}.json`);
  fs.writeFileSync(filename, JSON.stringify(chapterData, null, 2));
  console.log(`Creado: quiz-chapter-${chapterNum}.json`);
});

console.log('Todos los archivos han sido creados exitosamente');
