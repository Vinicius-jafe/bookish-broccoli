const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readlineSync = require('readline-sync');

const exts = ['.js', '.mjs', '.cjs', '.ts'];
const root = process.cwd();

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && name !== 'node_modules' && name !== '.git') {
      files.push(...walk(full));
    } else if (stat.isFile() && exts.includes(path.extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const importRE = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
const dynamicImportRE = /import\(['"]([^'"]+)['"]\)/g;
const requireRE = /require\(['"]([^'"]+)['"]\)/g;

const files = walk(root);
const pkgs = new Set();

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = importRE.exec(txt)) !== null) pkgs.add(m[1]);
  while ((m = dynamicImportRE.exec(txt)) !== null) pkgs.add(m[1]);
  while ((m = requireRE.exec(txt)) !== null) pkgs.add(m[1]);
}

// filtra pacotes externos (ignora arquivos locais)
const filtered = [...pkgs].filter(p => !p.startsWith('.') && !p.startsWith('/'));

if (filtered.length === 0) {
  console.log('Nenhum pacote externo detectado.');
  process.exit(0);
}

console.log('Pacotes detectados:');
console.log(filtered.join('\n'));
console.log();

const answer = readlineSync.question('Instalar todos esses pacotes agora? [y/N] ') || 'N';

if (/^y$/i.test(answer)) {
  console.log('Instalando...');
  execSync(`npm install --save ${filtered.join(' ')}`, { stdio: 'inherit' });
  console.log('Instalação concluída.');
} else {
  console.log('Abortado. Para instalar manualmente:');
  console.log(`npm install --save ${filtered.join(' ')}`);
}
