const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(/  onToggleSimulator: \(\) => void;\n/, '');
code = code.replace(/  isSimulatorRunning: boolean;\n/, '');
code = code.replace(/  isPortraitMode\?: boolean;\n/, '');
code = code.replace(/  onTogglePortraitMode\?: \(\) => void;\n/, '');

code = code.replace(/  onToggleSimulator,\n/, '');
code = code.replace(/  isSimulatorRunning,\n/, '');
code = code.replace(/  isPortraitMode = false,\n/, '');
code = code.replace(/  onTogglePortraitMode,\n/, '');

fs.writeFileSync('src/components/Navbar.tsx', code);
