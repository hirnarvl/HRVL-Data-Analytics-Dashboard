const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const buttonCode = `
              {/* Sync Annual Data (2025/2026) */}
              {onSyncAnnualData && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSyncAnnualData();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isSyncingData}
                  className="w-full py-2 px-3 flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer"
                >
                  <RefreshCcw className={\`w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 \${isSyncingData ? 'animate-spin' : ''}\`} />
                  <span className="truncate">{isSyncingData ? 'Syncing...' : 'Sync Annual Data (25/26)'}</span>
                </button>
              )}
`;

code = code.replace('{/* Support Template */}', buttonCode + '\n              {/* Support Template */}');
// Wait, RefreshCcw needs to be imported.
if (!code.includes('RefreshCcw')) {
  code = code.replace('RefreshCcw', 'RefreshCw'); // It's actually imported as RefreshCw from lucide-react if present, let's see. Or just use HardDrive. Let's add RefreshCw to imports if needed, or just use RefreshCw if it's there.
  // Navbar has RotateCcw. I will use RotateCcw.
  code = code.replace('RefreshCcw', 'RotateCcw');
}

fs.writeFileSync('src/components/Navbar.tsx', code);
