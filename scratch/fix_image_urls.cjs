const fs = require('fs');
const path = 'C:\\ayushbasket\\ayushbasket-bakend\\src\\modules\\product\\product.service.js';

let content = fs.readFileSync(path, 'utf8');

// Replace the hardcoded localhost image logic with just returning the raw path
const oldImageLine = /prod\.image = prod\.imageUrl \? \(\(prod\.imageUrl\.startsWith\('http'\) \|\| prod\.imageUrl\.startsWith\('data:'\)\) \? prod\.imageUrl : `http:\/\/localhost:5000\$\{prod\.imageUrl\}`\) : null;/g;
const oldImagesLine = /prod\.images = \[prod\.imageUrl, prod\.imageUrl2, prod\.imageUrl3\]\.filter\(Boolean\)\.map\(img => \(img\.startsWith\('http'\) \|\| img\.startsWith\('data:'\)\) \? img : `http:\/\/localhost:5000\$\{img\}`\);/g;

const newImageLine = `prod.image = prod.imageUrl || null;`;
const newImagesLine = `prod.images = [prod.imageUrl, prod.imageUrl2, prod.imageUrl3].filter(Boolean);`;

const before = content;
content = content.replace(oldImageLine, newImageLine);
content = content.replace(oldImagesLine, newImagesLine);

if (content === before) {
  console.log('WARNING: No replacements made — check the patterns');
} else {
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed! Remaining localhost refs:');
  const remaining = (content.match(/localhost/g) || []).length;
  console.log(`  ${remaining} remaining`);
}
