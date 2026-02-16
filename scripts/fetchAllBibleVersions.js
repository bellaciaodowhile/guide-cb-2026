import fs from 'fs';

// Script para ejecutar todos los scripts de obtención de datos bíblicos
const scripts = [
  { name: 'RV1995', file: 'fetchBibleData.js' },
  { name: 'RV1960', file: 'fetchBibleDataRV1960.js' },
  { name: 'NVI', file: 'fetchBibleDataNVI.js' },
  { name: 'DHH', file: 'fetchBibleDataDHH.js' }
];

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} failed with code ${code}`));
      }
    });
  });
}

async function fetchAllVersions() {
  console.log('🚀 Iniciando obtención de todas las versiones bíblicas...\n');
  
  for (const script of scripts) {
    try {
      console.log(`📖 Ejecutando script para ${script.name}...`);
      await runScript(`scripts/${script.file}`);
      console.log(`✅ ${script.name} completado\n`);
    } catch (error) {
      console.error(`❌ Error ejecutando ${script.name}:`, error.message);
    }
  }
  
  console.log('🎉 Proceso completado. Verificando archivos creados...');
  
  // Verificar archivos creados
  const expectedFiles = [
    'src/data/daniel-book.json',
    'src/data/daniel-book-rv1960.json',
    'src/data/daniel-book-nvi.json',
    'src/data/daniel-book-dhh.json'
  ];
  
  expectedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      console.log(`✅ ${file} - ${Math.round(stats.size / 1024)}KB`);
    } else {
      console.log(`❌ ${file} - No encontrado`);
    }
  });
}

fetchAllVersions().catch(console.error);