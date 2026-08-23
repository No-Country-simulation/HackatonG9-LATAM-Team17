const fs = require('fs');
const path = require('path');

const changesDir = path.join(__dirname, '../openspec/changes');
const specsDir = path.join(__dirname, '../openspec/specs');

const changesToSync = [
  'conectar-endpoint-perfil',
  'consistencia-estados-locales'
];

changesToSync.forEach(changeName => {
  console.log(`Syncing specs for ${changeName}...`);
  const changePath = path.join(changesDir, changeName);
  if (!fs.existsSync(changePath)) {
    console.log(`Change ${changeName} not found.`);
    return;
  }
  
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
});
