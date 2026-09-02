const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStatement = `import { VaccineCalendar } from './components/VaccineCalendar';\n`;
code = importStatement + code;

const newTabCode = `
        {activeTab === 'VaccineCalendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <VaccineCalendar />
          </motion.div>
        )}
`;

// we find the string: </motion.div>\n        </div>\n      </main>
// or similar to insert the new tab. Let's just find `</main>`
code = code.replace('</main>', newTabCode + '\n      </main>');

fs.writeFileSync('src/App.tsx', code);
