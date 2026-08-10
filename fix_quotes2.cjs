const fs = require('fs');
let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

// Replace problematic single quotes
content = content.replace(/mirkanaa'an/g, "mirkanaa\\'an");
content = content.replace(/Qopheessi/g, "Qopheessi"); 
// Any other single quotes inside values?
// Let's do a global replace for quotes inside words. Wait, JS can just read and replace properly if we are careful.
// Let's just fix the known one.
content = content.replace(/mirkanaa'an/g, "mirkanaa\\'an");
content = content.replace(/Fooyya'uu/g, "Fooyya\\'uu");

fs.writeFileSync('src/utils/translations.ts', content);
