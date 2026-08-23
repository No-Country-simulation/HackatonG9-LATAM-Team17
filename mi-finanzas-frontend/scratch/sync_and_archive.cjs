const fs = require('fs');
const path = require('path');

const changesDir = path.join(__dirname, '../openspec/changes');
const archiveDir = path.join(changesDir, 'archive');
const specsDir = path.join(__dirname, '../openspec/specs');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

const changesToArchive = [
  'eliminar-boton-actualizar-info-financiera',
  'conectar-endpoint-perfil',
  'consistencia-estados-locales'
];

const today = new Date().toISOString().split('T')[0];

changesToArchive.forEach(changeName => {
  console.log(`Processing ${changeName}...`);
  const changePath = path.join(changesDir, changeName);
  if (!fs.existsSync(changePath)) {
    console.log(`Change ${changeName} not found.`);
    return;
  }
  
  // Sync specs
  const deltaSpecsDir = path.join(changePath, 'specs');
  if (fs.existsSync(deltaSpecsDir)) {
    const capabilities = fs.readdirSync(deltaSpecsDir);
    capabilities.forEach(cap => {
      const deltaSpecPath = path.join(deltaSpecsDir, cap, 'spec.md');
      if (fs.existsSync(deltaSpecPath)) {
        const deltaContent = fs.readFileSync(deltaSpecPath, 'utf8');
        const mainCapDir = path.join(specsDir, cap);
        if (!fs.existsSync(mainCapDir)) {
          fs.mkdirSync(mainCapDir, { recursive: true });
        }
        const mainSpecPath = path.join(mainCapDir, 'spec.md');
        
        let header = `# ${cap}\n\n**Purpose**: TBD\n\n`;
        if (fs.existsSync(mainSpecPath)) {
           // We'll just append it with a marker for simplicity, 
           // since true intelligent merging is complex for a script.
           const existing = fs.readFileSync(mainSpecPath, 'utf8');
           fs.writeFileSync(mainSpecPath, existing + '\n\n<!-- Merged from ' + changeName + ' -->\n' + deltaContent);
           console.log(`- Synced ${cap} (appended)`);
        } else {
           fs.writeFileSync(mainSpecPath, header + deltaContent);
           console.log(`- Synced ${cap} (created)`);
        }
      }
    });
  }
  
  // Archive
  const targetName = `${today}-${changeName}`;
  const targetPath = path.join(archiveDir, targetName);
  
  if (fs.existsSync(targetPath)) {
    console.log(`Target archive ${targetPath} already exists.`);
  } else {
    fs.renameSync(changePath, targetPath);
    console.log(`Archived ${changeName} to ${targetPath}`);
  }
});
