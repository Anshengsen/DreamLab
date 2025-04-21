const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'cases');
const output = [];

function walk(dir, category) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, path.basename(fullPath));
    } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp')) {
      const baseName = path.basename(file, path.extname(file));
      const txtPath = path.join(dir, baseName + '.txt');
      const relativeImagePath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
      let prompt = '';
      if (fs.existsSync(txtPath)) {
        prompt = fs.readFileSync(txtPath, 'utf-8');
      }
      output.push({
        category,
        image: relativeImagePath,
        prompt: prompt.trim()
      });
    }
  }
}

walk(rootDir, '');

fs.writeFileSync('data.json', JSON.stringify(output, null, 2), 'utf-8');
console.log('✅ data.json updated!');
