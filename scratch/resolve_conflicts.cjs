const fs = require('fs');
const path = require('path');

const conflictedFiles = [
  'src/components/layout/Navbar.tsx',
  'src/components/modals/AuthModal.tsx',
  'src/components/modals/PrescriptionModal.tsx',
  'src/components/modals/SupportModal.tsx',
  'src/pages/Prescription.tsx',
];

const rootDir = 'C:\\ayushbasket\\himei\\homeo';

for (const relPath of conflictedFiles) {
  const fullPath = path.join(rootDir, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  const original = content;
  
  // Remove conflict blocks: keep HEAD section, discard the OTHER section
  // Pattern: <<<<<<< HEAD\n[HEAD content]\n=======\n[OTHER content]\n>>>>>>> [hash]
  // We want to keep HEAD content only.
  content = content.replace(
    /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>>[^\r\n]*\r?\n?/g,
    '$1'
  );
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${relPath}`);
  } else {
    console.log(`No conflicts found in: ${relPath}`);
  }
}
console.log('Done.');
