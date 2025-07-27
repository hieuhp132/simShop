// scripts/generateCountryDataIndex.js
const fs = require('fs');
const path = require('path');

const adjustedDir = path.join(__dirname, '../assets/data/adjusted');
const outputFile = path.join(adjustedDir, 'countryDataIndex.js');

const files = fs.readdirSync(adjustedDir)
  .filter(file => file.endsWith('.json'));

let imports = '';
let mappings = 'export const countryDataMap = {\n';

files.forEach(file => {
  const countryName = path.basename(file, '.json'); // "albania"
  const importName = countryName.replace(/[-\s]/g, '_'); // variable-safe
  imports += `import ${importName} from './${file}';\n`;
  mappings += `  "${countryName}": ${importName},\n`;
});

mappings += '};\n';

const finalCode = imports + '\n' + mappings;

fs.writeFileSync(outputFile, finalCode);

console.log(`✅ Đã tạo file: ${outputFile}`);
