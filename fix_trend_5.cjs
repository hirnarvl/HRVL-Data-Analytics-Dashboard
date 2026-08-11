const fs = require('fs');
let code = fs.readFileSync('src/components/TrendCharts.tsx', 'utf8');

const regex = /<button\s+key=\{tf\}\s+<\/button>/g;
console.log("Found:", regex.test(code)); // test if match

const replacement = `<button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={\`px-3 py-1 rounded-md transition-colors cursor-pointer \${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }\`}
              >
                {tf}
              </button>`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/TrendCharts.tsx', code);
