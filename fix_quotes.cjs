const fs = require('fs');
let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

// Replace problematic single quotes
content = content.replace(/Too'annoo/g, "Too\\'annoo");
content = content.replace(/Mirkanaa'ee/g, "Mirkanaa\\'ee");
content = content.replace(/Du'a/g, "Du\\'a");
content = content.replace(/Ji'a/g, "Ji\\'a");
content = content.replace(/Mul'isaa/g, "Mul\\'isaa");
content = content.replace(/Fooyya'uu/g, "Fooyya\\'uu");
content = content.replace(/Baay'ee/g, "Baay\\'ee");
content = content.replace(/Ta'e/g, "Ta\\'e");

fs.writeFileSync('src/utils/translations.ts', content);
