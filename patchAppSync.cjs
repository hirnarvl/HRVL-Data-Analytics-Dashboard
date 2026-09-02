const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importSync = `import { sync2025And2026Data } from './utils/syncDriveFolders';\n`;
if (!code.includes('syncDriveFolders')) {
  code = importSync + code;
}

const syncState = `
  const [isSyncingData, setIsSyncingData] = useState(false);
  const handleSyncAnnualData = async () => {
    if (!accessToken) {
      alert("Please connect to Google Drive first (via Export & Backup -> Google Drive Backup) to authorize sync.");
      setIsGoogleDriveModalOpen(true);
      return;
    }
    
    setIsSyncingData(true);
    try {
      const syncedRecords = await sync2025And2026Data(accessToken);
      if (syncedRecords.length > 0) {
        setRecords(prev => {
          // Merge avoiding duplicates by sourceFile and id (heuristically)
          // Actually, we can just replace existing sync records or just append
          // Let's filter out old sync records and append new ones
          const existingWithoutSync = prev.filter(r => !r.id.startsWith('SYNC-'));
          const newRecords = [...existingWithoutSync, ...syncedRecords];
          saveCachedRecords(newRecords);
          return newRecords;
        });
        alert(\`Successfully synced \${syncedRecords.length} records for 2025/2026!\`);
      } else {
        alert("No records found to sync.");
      }
    } catch (err) {
      alert("Failed to sync data: " + String(err));
    } finally {
      setIsSyncingData(false);
    }
  };
`;

code = code.replace('const handleResetCache = () => {', syncState + '\n  const handleResetCache = () => {');

// Inject into Navbar
code = code.replace('onResetCache={handleResetCache}', 'onResetCache={handleResetCache}\n          onSyncAnnualData={handleSyncAnnualData}\n          isSyncingData={isSyncingData}');

fs.writeFileSync('src/App.tsx', code);
