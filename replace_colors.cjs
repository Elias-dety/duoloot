const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /rgba\(255,\s*70,\s*85,\s*([\d.]+)\)/g, replace: 'rgb(var(--dl-red-rgb)/$1)' },
  { regex: /rgba\(255,\s*0,\s*0,\s*([\d.]+)\)/g, replace: 'rgb(var(--dl-red-rgb)/$1)' },
  { regex: /rgba\(143,\s*8,\s*8,\s*([\d.]+)\)/g, replace: 'rgb(var(--dl-error-rgb)/$1)' },
  { regex: /var\(--dl-border-red\)/g, replace: 'var(--dl-keyword)' },
  { regex: /var\(--dl-red-dark\)/g, replace: 'var(--dl-error)' },
  { regex: /var\(--dl-red-soft\)/g, replace: 'var(--dl-error)' },
  { regex: /var\(--dl-red\)/g, replace: 'var(--dl-keyword)' },
];

// Special case for VaultMissionCard.tsx to use yellow instead of keyword red
const missionCardReplacements = [
  { regex: /border-\[var\(--dl-keyword\)\]/g, replace: 'border-[var(--dl-warning)]' },
  { regex: /bg-\[rgb\(var\(--dl-red-rgb\)\/0\.08\)\]/g, replace: 'bg-[rgb(var(--dl-warning-rgb)/0.08)]' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(path.join(dirPath));
    }
  });
}

walkDir(path.join(__dirname, 'src'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(({ regex, replace }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replace);
      changed = true;
    }
  });

  if (filePath.includes('VaultMissionCard.tsx') && changed) {
    missionCardReplacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
