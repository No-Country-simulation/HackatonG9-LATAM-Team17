const fs = require('fs');
const path = require('path');

const changes = [
  'historial-entradas-reportes',
  'corregir-metricas-financieras',
  'adaptar-texto-nuevo-analisis',
  'colores-categorias-dinamicos',
  'persistencia-local-transacciones',
  'integracion-clasificador-transacciones'
];

const changesDir = path.join('C:\\ProyectosGitHub\\HackatonG9-Frontend-Finance\\financeai', 'openspec', 'changes');
const mainSpecsDir = path.join('C:\\ProyectosGitHub\\HackatonG9-Frontend-Finance\\financeai', 'openspec', 'specs');
const archiveDir = path.join(changesDir, 'archive');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

changes.forEach(change => {
  console.log(`Processing ${change}...`);
  const changePath = path.join(changesDir, change);
  const specsDir = path.join(changePath, 'specs');
  
  if (fs.existsSync(specsDir)) {
    const caps = fs.readdirSync(specsDir);
    caps.forEach(cap => {
      const deltaSpecPath = path.join(specsDir, cap, 'spec.md');
      if (fs.existsSync(deltaSpecPath)) {
        const deltaContent = fs.readFileSync(deltaSpecPath, 'utf-8');
        
        const mainCapDir = path.join(mainSpecsDir, cap);
        if (!fs.existsSync(mainCapDir)) {
          fs.mkdirSync(mainCapDir, { recursive: true });
        }
        const mainSpecPath = path.join(mainCapDir, 'spec.md');
        
        if (!fs.existsSync(mainSpecPath)) {
          fs.writeFileSync(mainSpecPath, `# Capability: ${cap}\n\n${deltaContent}`);
          console.log(`  Created main spec for ${cap}`);
        } else {
          fs.appendFileSync(mainSpecPath, `\n\n<!-- Merged from ${change} -->\n${deltaContent}`);
          console.log(`  Appended to main spec for ${cap}`);
        }
      }
    });
  }
  
  const dateStr = new Date().toISOString().split('T')[0];
  let targetArchive = path.join(archiveDir, `${dateStr}-${change}`);
  if (fs.existsSync(targetArchive)) {
    targetArchive = `${targetArchive}-${Date.now()}`;
  }
  
  try {
      fs.cpSync(changePath, targetArchive, { recursive: true });
      fs.rmSync(changePath, { recursive: true, force: true });
      console.log(`Archived ${change} to ${targetArchive}`);
  } catch (err) {
      console.log(`Error moving ${change}: ${err.message}`);
  }
});
