const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/app.js', 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const missing = [];
const checked = new Set();

while ((match = idRegex.exec(js)) !== null) {
  const id = match[1];
  if (checked.has(id)) continue;
  checked.add(id);
  // Match id in html
  const idPattern = new RegExp(`id=["']${id}["']`);
  if (!idPattern.test(html)) {
    missing.push(id);
  }
}

console.log('Checked unique IDs:', checked.size);
if (missing.length === 0) {
  console.log('✅ ALL getElementById references match IDs in index.html 100%!');
} else {
  console.error('❌ MISSING IDs in index.html:', missing);
}
