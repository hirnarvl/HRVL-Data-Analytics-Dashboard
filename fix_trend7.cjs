const fs = require('fs');
let code = fs.readFileSync('src/components/TrendCharts.tsx', 'utf8');

const regex = /\{\/\* Composed Chart \*\/\}/m;

const replacement = `</div>\n      {/* Composed Chart */}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/TrendCharts.tsx', code);
