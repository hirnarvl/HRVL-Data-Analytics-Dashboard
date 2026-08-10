const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /<TrendCharts\s*records={filteredRecords}/g,
  '<TrendCharts\n            locale={locale}\n            records={filteredRecords}'
);

fs.writeFileSync('src/App.tsx', content);
