import { listDriveFiles, downloadDriveFileArrayBuffer, DriveFile } from './googleDrive';
import { SurveillanceRecord } from '../types';
import * as XLSX from 'xlsx';
import { matchWoreda, detectZone } from './fuzzyMatch';

export const DRIVE_FOLDERS = [
  { year: 2025, id: '1PqTNHiMRTuMxwbMy9qPpjGoLzeny4o36' },
  { year: 2026, id: '15P2NgBhbC29NlGQ_LCJsEKydw-G1HHcJ' }
];

export async function listFilesInFolder(accessToken: string, folderId: string): Promise<DriveFile[]> {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const fields = encodeURIComponent("files(id, name, mimeType, createdTime, modifiedTime, size)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch files from folder ${folderId}`);
  }

  const data = await response.json();
  return data.files || [];
}

export async function sync2025And2026Data(accessToken: string): Promise<SurveillanceRecord[]> {
  const allRecords: SurveillanceRecord[] = [];

  for (const folder of DRIVE_FOLDERS) {
    try {
      const files = await listFilesInFolder(accessToken, folder.id);
      
      for (const file of files) {
        // Simple filter to only try spreadsheets/csv
        const name = file.name.toLowerCase();
        const mime = file.mimeType.toLowerCase();
        const isSpreadsheet = name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv');
        
        if (!isSpreadsheet) continue;

        const buffer = await downloadDriveFileArrayBuffer(accessToken, file.id, file.mimeType);
        const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true });

        wb.SheetNames.forEach((sheetName) => {
          const worksheet = wb.Sheets[sheetName];
          if (!worksheet) return;

          const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          if (!rawData.length) return;

          rawData.forEach((row, idx) => {
            const getCol = (...names: string[]) => {
              for (const n of names) {
                const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === n.toLowerCase());
                if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
                  return row[foundKey];
                }
              }
              return '';
            };

            const rawWoreda = String(getCol('woreda', 'wereda', 'district', 'location') || 'Haramaya');
            const matchedWoredaObj = matchWoreda(rawWoreda);

            const woredaName = matchedWoredaObj ? matchedWoredaObj.name : rawWoreda;
            const zoneName = matchedWoredaObj ? matchedWoredaObj.zone : detectZone(rawWoreda, String(getCol('zone', 'region')));

            const disease = String(getCol('disease', 'outbreak', 'event', 'condition') || 'Foot-and-Mouth Disease (FMD)');
            const species = String(getCol('species', 'livestock', 'animal') || 'Cattle');
            const cases = Number(getCol('cases', 'cases_count', 'morbidity') || 0);
            const deaths = Number(getCol('deaths', 'fatalities', 'mortality') || 0);

            let dateVal = getCol('date', 'report_date', 'timestamp', 'observation_date', 'year');
            let dateStr = new Date().toISOString().split('T')[0];

            if (dateVal instanceof Date) {
              dateStr = dateVal.toISOString().split('T')[0];
            } else if (typeof dateVal === 'string' && dateVal.trim()) {
              const trimmed = dateVal.trim();
              if (/^\d{4}$/.test(trimmed)) {
                dateStr = `${trimmed}-06-15`;
              } else {
                dateStr = trimmed;
              }
            } else if (typeof dateVal === 'number' && dateVal >= 2000 && dateVal <= 2100) {
              dateStr = `${dateVal}-06-15`;
            }

            const recYear = parseInt(dateStr.substring(0, 4), 10) || folder.year;
            const isZero = cases === 0 && (disease.toLowerCase().includes('zero') || disease.toLowerCase().includes('none'));

            allRecords.push({
              id: `SYNC-${folder.year}-${file.id.substring(0, 8)}-${idx}`,
              date: dateStr,
              timestamp: new Date(dateStr).getTime() || Date.now(),
              woreda: woredaName,
              zone: zoneName,
              lat: matchedWoredaObj ? matchedWoredaObj.lat : 9.2,
              lng: matchedWoredaObj ? matchedWoredaObj.lng : 41.5,
              disease,
              species,
              cases,
              deaths,
              risk: deaths > 5 ? 'Critical' : cases > 20 ? 'High' : 'Medium',
              comment: String(getCol('comment', 'remarks', 'risk') || `Auto-synced from Google Drive folder ${folder.year}`),
              phone: String(getCol('phone', 'contact') || ''),
              isZeroReport: isZero,
              sourceFile: file.name,
              sourceYear: recYear
            });
          });
        });
      }
    } catch (err) {
      console.error(`Error syncing folder ${folder.year}:`, err);
    }
  }

  return allRecords;
}
