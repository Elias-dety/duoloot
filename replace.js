const fs = require('fs');
const path = require('path');

const replacements = {
  'DuolootButton': 'Button',
  'DuolootCard': 'Card',
  'DuolootBadge': 'Badge',
  'DuolootSectionTitle': 'SectionTitle',
  'DuolootLogo': 'Logo',
  'DuolootImagePlaceholder': 'ImagePlaceholder',
  'MissingImagePlaceholder': 'MissingImagePlaceholder',
  'DuolootFrame': 'Frame',
  'DuolootEmptyState': 'EmptyState',
  'DuolootLoadingState': 'LoadingState',
  'DuolootMetricCard': 'MetricCard',
};

const molecules = ['EmptyState', 'LoadingState', 'MetricCard'];
const atoms = ['Button', 'Card', 'Badge', 'SectionTitle', 'Logo', 'ImagePlaceholder', 'MissingImagePlaceholder', 'Frame'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find imports from @/components/duoloot
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/duoloot['"]/g;
  
  content = content.replace(importRegex, (match, importsStr) => {
    const importedItems = importsStr.split(',').map(s => s.trim()).filter(Boolean);
    
    let newAtoms = [];
    let newMolecules = [];
    
    importedItems.forEach(item => {
      const mapped = replacements[item] || item;
      if (molecules.includes(mapped)) {
        newMolecules.push(mapped);
      } else if (atoms.includes(mapped)) {
        newAtoms.push(mapped);
      } else {
        // Fallback to atoms if unknown
        newAtoms.push(mapped);
      }
    });

    let newImportStatements = [];
    if (newAtoms.length > 0) {
      newImportStatements.push(`import { ${newAtoms.join(', ')} } from '@/components/atoms';`);
    }
    if (newMolecules.length > 0) {
      newImportStatements.push(`import { ${newMolecules.join(', ')} } from '@/components/molecules';`);
    }
    
    return newImportStatements.join('\n');
  });

  // Replace tags and references
  for (const [oldName, newName] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    content = content.replace(regex, newName);
  }

  // Also replace MissingImagePlaceholder import specifically if it was imported directly
  content = content.replace(/import\s+\{\s*MissingImagePlaceholder\s*\}\s+from\s+['"]@\/components\/duoloot\/MissingImagePlaceholder['"]/g, `import { MissingImagePlaceholder } from '@/components/atoms';`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'duoloot') { // skip the duoloot directory since we will delete it
        walkDir(filePath);
      }
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
