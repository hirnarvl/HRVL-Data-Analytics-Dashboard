import React, { useState, useEffect } from 'react';
import { 
  X, 
  HardDrive, 
  Upload, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Layers,
  Filter,
  CheckCircle2,
  FileCode,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { 
  listDriveFiles, 
  uploadToDrive, 
  downloadDriveFileArrayBuffer, 
  deleteDriveFile, 
  DriveFile 
} from '../utils/googleDrive';
import { SurveillanceRecord } from '../types';
import { generateCSVString } from '../utils/export';
import { matchWoreda, detectZone } from '../utils/fuzzyMatch';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SurveillanceRecord[];
  onImportRecords?: (importedRecords: SurveillanceRecord[]) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  records,
  onImportRecords,
}) => {
  const { user, accessToken, signInWithGoogle } = useAuth();
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Selection and Batch States
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [isBatchImporting, setIsBatchImporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentFileName: string } | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'EXCEL' | 'CSV' | 'JSON'>('ALL');
  
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fetchFiles = async (tokenToUse?: string) => {
    const token = tokenToUse || accessToken;
    if (!token) return;

    setLoadingFiles(true);
    setStatusMessage(null);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to list drive files:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load Google Drive files.' });
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles(accessToken);
    }
  }, [isOpen, accessToken]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setStatusMessage(null);
    try {
      const token = await signInWithGoogle();
      if (token) {
        setStatusMessage({ type: 'success', text: 'Successfully connected to Google Drive!' });
        fetchFiles(token);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to authorize with Google Drive.' });
    }
  };

  const handleBackupToDrive = async () => {
    if (!accessToken) {
      setStatusMessage({ type: 'error', text: 'Please connect to Google Drive first.' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `HRVL_Surveillance_Report_${timestamp}.csv`;
      const csvContent = generateCSVString(records);

      const uploaded = await uploadToDrive(accessToken, filename, csvContent, 'text/csv');
      setStatusMessage({
        type: 'success',
        text: `Backup successful! Saved as "${uploaded.name}" on Google Drive.`,
      });
      fetchFiles(accessToken);
    } catch (err: any) {
      console.error('Drive backup failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save file to Google Drive.' });
    } finally {
      setUploading(false);
    }
  };

  const isSupportedFile = (file: DriveFile): boolean => {
    const name = file.name.toLowerCase();
    const mime = file.mimeType.toLowerCase();
    return (
      name.endsWith('.xlsx') ||
      name.endsWith('.xls') ||
      name.endsWith('.csv') ||
      name.endsWith('.tsv') ||
      name.endsWith('.json') ||
      name.endsWith('.txt') ||
      mime.includes('spreadsheet') ||
      mime.includes('excel') ||
      mime.includes('csv') ||
      mime.includes('json') ||
      mime.includes('text')
    );
  };

  const processDriveFileBuffer = async (file: DriveFile, buffer: ArrayBuffer): Promise<SurveillanceRecord[]> => {
    const name = file.name.toLowerCase();
    const fileRecords: SurveillanceRecord[] = [];

    // 1. If JSON file extension
    if (name.endsWith('.json')) {
      try {
        const text = new TextDecoder().decode(buffer);
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          json.forEach((item, idx) => {
            const rawWoreda = String(item.woreda || item.wereda || item.district || 'Haramaya');
            const matchedWoredaObj = matchWoreda(rawWoreda);
            const woredaName = matchedWoredaObj ? matchedWoredaObj.name : rawWoreda;
            const zoneName = matchedWoredaObj ? matchedWoredaObj.zone : detectZone(rawWoreda, item.zone);

            fileRecords.push({
              id: `DRV-JSON-${Date.now()}-${idx}`,
              date: String(item.date || new Date().toISOString().split('T')[0]),
              timestamp: new Date(item.date || Date.now()).getTime(),
              woreda: woredaName,
              zone: zoneName,
              lat: matchedWoredaObj ? matchedWoredaObj.lat : 9.2,
              lng: matchedWoredaObj ? matchedWoredaObj.lng : 41.5,
              disease: String(item.disease || 'Foot-and-Mouth Disease (FMD)'),
              species: String(item.species || 'Cattle'),
              cases: Number(item.cases || 0),
              deaths: Number(item.deaths || 0),
              risk: Number(item.deaths || 0) > 5 ? 'Critical' : Number(item.cases || 0) > 20 ? 'High' : 'Medium',
              comment: String(item.comment || `Imported from Google Drive (${file.name})`),
              phone: String(item.phone || ''),
              sourceFile: file.name,
              sourceYear: parseInt(String(item.date || '').substring(0, 4), 10) || new Date().getFullYear(),
            });
          });
          return fileRecords;
        }
      } catch (e) {
        console.warn('JSON parsing attempt failed, falling back to XLSX binary reader:', e);
      }
    }

    // 2. Read as Excel / CSV / Sheet via XLSX library
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true });
    
    const filenameYearMatch = file.name.match(/(20\d\d)/);
    const filenameYear = filenameYearMatch ? parseInt(filenameYearMatch[1], 10) : null;

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

        const recYear = parseInt(dateStr.substring(0, 4), 10) || filenameYear || new Date().getFullYear();
        const isZero = cases === 0 && (disease.toLowerCase().includes('zero') || disease.toLowerCase().includes('none'));

        fileRecords.push({
          id: `DRV-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}-${idx}`,
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
          comment: String(getCol('comment', 'remarks', 'risk') || `Imported from Google Drive (${file.name})`),
          phone: String(getCol('phone', 'contact') || ''),
          isZeroReport: isZero,
          sourceFile: file.name,
          sourceYear: recYear
        });
      });
    });

    return fileRecords;
  };

  const handleImportSingleFile = async (file: DriveFile) => {
    if (!accessToken) return;
    setDownloadingId(file.id);
    setStatusMessage(null);

    try {
      const buffer = await downloadDriveFileArrayBuffer(accessToken, file.id, file.mimeType);
      const parsedRecords = await processDriveFileBuffer(file, buffer);

      if (parsedRecords.length > 0 && onImportRecords) {
        onImportRecords(parsedRecords);
        setStatusMessage({
          type: 'success',
          text: `Successfully imported ${parsedRecords.length} records from Google Drive file "${file.name}"!`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `File "${file.name}" downloaded, but no valid records could be parsed.`,
        });
      }
    } catch (err: any) {
      console.error('Drive import failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to download file from Google Drive.' });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleBatchImport = async () => {
    if (!accessToken || selectedFileIds.size === 0) return;

    const filesToProcess = driveFiles.filter(f => selectedFileIds.has(f.id));
    if (!filesToProcess.length) return;

    setIsBatchImporting(true);
    setStatusMessage(null);

    const consolidatedRecords: SurveillanceRecord[] = [];
    const successfulFiles: string[] = [];

    try {
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        setBatchProgress({
          current: i + 1,
          total: filesToProcess.length,
          currentFileName: file.name
        });

        try {
          const buffer = await downloadDriveFileArrayBuffer(accessToken, file.id, file.mimeType);
          const recs = await processDriveFileBuffer(file, buffer);
          if (recs.length > 0) {
            consolidatedRecords.push(...recs);
            successfulFiles.push(file.name);
          }
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
        }
      }

      if (consolidatedRecords.length > 0) {
        if (onImportRecords) {
          onImportRecords(consolidatedRecords);
        }
        setStatusMessage({
          type: 'success',
          text: `Successfully imported ${consolidatedRecords.length} records across ${successfulFiles.length} file(s) from Google Drive!`,
        });
        setSelectedFileIds(new Set());
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Downloaded selected files, but no valid records could be mapped. Check column names.',
        });
      }
    } catch (err: any) {
      console.error('Batch import error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to complete batch import.' });
    } finally {
      setIsBatchImporting(false);
      setBatchProgress(null);
    }
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const supported = filteredFiles.filter(isSupportedFile);
    if (selectedFileIds.size === supported.length && supported.length > 0) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(supported.map(f => f.id)));
    }
  };

  const handleDelete = async (file: DriveFile) => {
    if (!accessToken) return;
    try {
      await deleteDriveFile(accessToken, file.id, file.name);
      setStatusMessage({ type: 'success', text: `Deleted "${file.name}" from Google Drive.` });
      fetchFiles(accessToken);
    } catch (err: any) {
      console.error('Drive delete error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete file.' });
    }
  };

  // Filter files by tab
  const filteredFiles = driveFiles.filter(file => {
    if (filterType === 'ALL') return true;
    const name = file.name.toLowerCase();
    const mime = file.mimeType.toLowerCase();

    if (filterType === 'EXCEL') {
      return name.endsWith('.xlsx') || name.endsWith('.xls') || mime.includes('spreadsheet') || mime.includes('excel');
    }
    if (filterType === 'CSV') {
      return name.endsWith('.csv') || mime.includes('csv');
    }
    if (filterType === 'JSON') {
      return name.endsWith('.json') || name.endsWith('.txt') || mime.includes('json') || mime.includes('text');
    }
    return true;
  });

  const getFileBadge = (file: DriveFile) => {
    const name = file.name.toLowerCase();
    const mime = file.mimeType.toLowerCase();

    if (mime.includes('spreadsheet') || name.endsWith('.xlsx') || name.endsWith('.xls')) {
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono flex items-center gap-1"><FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Excel/Sheets</span>;
    }
    if (name.endsWith('.csv') || mime.includes('csv')) {
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono flex items-center gap-1"><FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" /> CSV</span>;
    }
    if (name.endsWith('.json') || mime.includes('json')) {
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono flex items-center gap-1"><FileCode className="w-3 h-3 text-purple-600 dark:text-purple-400" /> JSON</span>;
    }
    return <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono">File</span>;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Google Drive Multi-File Integration
                  {accessToken && (
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                      Connected
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Select and batch import multiple Excel (.xlsx/.xls), CSV, Google Sheets, or JSON files directly from Google Drive
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`px-6 py-3 border-b text-xs font-semibold flex items-center justify-between ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {statusMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Batch Progress Banner */}
          {batchProgress && (
            <div className="px-6 py-3 bg-indigo-950 text-indigo-200 border-b border-indigo-800 flex items-center justify-between text-xs font-mono font-bold">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                <span>
                  Processing File {batchProgress.current} of {batchProgress.total}: <span className="text-white font-sans">{batchProgress.currentFileName}</span>
                </span>
              </div>
              <span className="bg-indigo-800 px-2 py-0.5 rounded text-[10px]">
                {Math.round((batchProgress.current / batchProgress.total) * 100)}%
              </span>
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
            {/* Connection Banner */}
            {!accessToken ? (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 rounded-xl border border-blue-200 dark:border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Authorize Google Drive Access
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                    Connect your Google account to access field reports, Excel spreadsheets, CSVs, and Google Sheets stored on Google Drive.
                  </p>
                </div>
                <button
                  onClick={handleSignIn}
                  className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
                >
                  <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Connect Google Drive</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {user?.displayName || user?.email}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Connected with Google Drive Read/Write permissions
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBackupToDrive}
                  disabled={uploading}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Upload className={`w-3.5 h-3.5 ${uploading ? 'animate-bounce' : ''}`} />
                  <span>{uploading ? 'Uploading...' : `Backup Dashboard (${records.length} Records)`}</span>
                </button>
              </div>
            )}

            {/* Files Toolbar & Multi-Selection Actions */}
            {accessToken && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  
                  {/* Category Tabs */}
                  <div className="flex items-center space-x-1 overflow-x-auto text-xs font-semibold">
                    <span className="text-slate-500 text-[11px] mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    <button
                      onClick={() => setFilterType('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        filterType === 'ALL'
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      All ({driveFiles.length})
                    </button>
                    <button
                      onClick={() => setFilterType('EXCEL')}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        filterType === 'EXCEL'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Excel / Sheets
                    </button>
                    <button
                      onClick={() => setFilterType('CSV')}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        filterType === 'CSV'
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      CSV
                    </button>
                    <button
                      onClick={() => setFilterType('JSON')}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        filterType === 'JSON'
                          ? 'bg-purple-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      JSON / Text
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={toggleSelectAll}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      <span>{selectedFileIds.size > 0 ? 'Deselect All' : 'Select All Data Files'}</span>
                    </button>

                    <button
                      onClick={() => fetchFiles()}
                      disabled={loadingFiles}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
                      title="Refresh file list"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Batch Import Banner if items checked */}
                {selectedFileIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-2 font-bold">
                      <Layers className="w-4 h-4 text-emerald-200 shrink-0" />
                      <span>{selectedFileIds.size} File(s) Selected for Batch Import</span>
                    </div>

                    <button
                      onClick={handleBatchImport}
                      disabled={isBatchImporting}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black rounded-lg shadow-md cursor-pointer transition-all transform active:scale-95"
                    >
                      <Download className={`w-3.5 h-3.5 ${isBatchImporting ? 'animate-bounce' : ''}`} />
                      <span>{isBatchImporting ? 'Importing Batch...' : `Import Selected (${selectedFileIds.size} Files)`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Files List Section */}
            <div className="space-y-3">
              {!accessToken ? (
                <div className="text-center py-10 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  Connect Google Drive above to list and import your cloud datasets
                </div>
              ) : loadingFiles ? (
                <div className="flex items-center justify-center py-10 space-x-2 text-xs text-slate-500">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading files from Google Drive...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  No matching files found in your Google Drive. Click "Backup Dashboard" above to upload your first surveillance report.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  {filteredFiles.map((file) => {
                    const supported = isSupportedFile(file);
                    const isChecked = selectedFileIds.has(file.id);

                    return (
                      <div
                        key={file.id}
                        className={`p-3.5 flex items-center justify-between transition-colors ${
                          isChecked 
                            ? 'bg-blue-50/70 dark:bg-blue-950/30' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          {/* Checkbox */}
                          <button
                            onClick={() => supported && toggleSelectFile(file.id)}
                            disabled={!supported}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              !supported ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            title={supported ? "Select file for batch import" : "Unsupported file format"}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                                {file.name}
                              </p>
                              {getFileBadge(file)}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Cloud file'}</span>
                              {file.size && <span>• {Math.round(parseInt(file.size) / 1024)} KB</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {supported && (
                            <button
                              onClick={() => handleImportSingleFile(file)}
                              disabled={downloadingId === file.id || isBatchImporting}
                              title="Import dataset into Dashboard"
                              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
                            >
                              <Download className={`w-3.5 h-3.5 ${downloadingId === file.id ? 'animate-bounce' : ''}`} />
                              <span className="hidden sm:inline">Import</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(file)}
                            title="Delete file from Google Drive"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
