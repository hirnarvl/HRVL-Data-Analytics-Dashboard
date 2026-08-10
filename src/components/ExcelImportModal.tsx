import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Trash2, 
  Layers, 
  TrendingUp, 
  Calendar,
  Plus
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SurveillanceRecord } from '../types';
import { matchWoreda, detectZone } from '../utils/fuzzyMatch';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRecords: (newRecords: SurveillanceRecord[], minDate?: string, maxDate?: string) => void;
  onOpenYoYAnalysis?: () => void;
}

interface ParsedPreviewRow {
  sourceFile: string;
  woredaOriginal: string;
  woredaMatched: string;
  zone: string;
  disease: string;
  species: string;
  cases: number;
  deaths: number;
  date: string;
  matchedSuccess: boolean;
}

interface ImportedBatchFile {
  id: string;
  fileName: string;
  fileSize: number;
  sheetNames: string[];
  recordsCount: number;
  minDate: string;
  maxDate: string;
  detectedYears: number[];
  records: SurveillanceRecord[];
  previews: ParsedPreviewRow[];
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportRecords,
  onOpenYoYAnalysis
}) => {
  const [batchFiles, setBatchFiles] = useState<ImportedBatchFile[]>([]);
  const [activeFileFilter, setActiveFileFilter] = useState<string>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const processFileItem = async (file: File): Promise<ImportedBatchFile | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array', cellDates: true });
          
          const fileRecords: SurveillanceRecord[] = [];
          const filePreviews: ParsedPreviewRow[] = [];
          let minD = '9999-12-31';
          let maxD = '0000-01-01';
          const yearsSet = new Set<number>();

          // Try to extract year from filename e.g. "2023_data.xlsx" or "surveillance-2024.csv"
          const filenameYearMatch = file.name.match(/(20\d\d)/);
          const filenameYear = filenameYearMatch ? parseInt(filenameYearMatch[1], 10) : null;

          wb.SheetNames.forEach((sheetName) => {
            const worksheet = wb.Sheets[sheetName];
            if (!worksheet) return;

            const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            if (!rawData.length) return;

            rawData.forEach((row, idx) => {
              const getCol = (...names: string[]) => {
                for (const name of names) {
                  const foundKey = Object.keys(row).find(k => k.trim().toLowerCase() === name.toLowerCase());
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
                  dateStr = `${trimmed}-06-15`; // Midyear default if only year given
                } else {
                  dateStr = trimmed;
                }
              } else if (typeof dateVal === 'number' && dateVal >= 2000 && dateVal <= 2100) {
                dateStr = `${dateVal}-06-15`;
              }

              const recYear = parseInt(dateStr.substring(0, 4), 10) || filenameYear || new Date().getFullYear();
              yearsSet.add(recYear);

              if (dateStr < minD) minD = dateStr;
              if (dateStr > maxD) maxD = dateStr;

              const isZero = cases === 0 && (disease.toLowerCase().includes('zero') || disease.toLowerCase().includes('none'));

              filePreviews.push({
                sourceFile: file.name,
                woredaOriginal: rawWoreda,
                woredaMatched: woredaName,
                zone: zoneName,
                disease,
                species,
                cases,
                deaths,
                date: dateStr,
                matchedSuccess: !!matchedWoredaObj
              });

              fileRecords.push({
                id: `IMP-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}-${idx}`,
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
                comment: String(getCol('comment', 'remarks', 'risk') || `Imported from ${file.name}`),
                phone: String(getCol('phone', 'contact') || ''),
                isZeroReport: isZero,
                sourceFile: file.name,
                sourceYear: recYear
              });
            });
          });

          resolve({
            id: `FILE-${Date.now()}-${Math.random()}`,
            fileName: file.name,
            fileSize: file.size,
            sheetNames: wb.SheetNames,
            recordsCount: fileRecords.length,
            minDate: minD === '9999-12-31' ? '' : minD,
            maxDate: maxD === '0000-01-01' ? '' : maxD,
            detectedYears: Array.from(yearsSet).sort(),
            records: fileRecords,
            previews: filePreviews
          });
        } catch (err) {
          console.error(`Failed to parse file ${file.name}:`, err);
          resolve(null);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleBatchFileUpload = async (files: FileList | File[]) => {
    if (!files || !files.length) return;
    setIsProcessing(true);

    const newBatchItems: ImportedBatchFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (/\.(xlsx|xls|csv)$/i.test(file.name)) {
        const item = await processFileItem(file);
        if (item && item.recordsCount > 0) {
          newBatchItems.push(item);
        }
      }
    }

    setBatchFiles(prev => [...prev, ...newBatchItems]);
    setIsProcessing(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleBatchFileUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleBatchFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setBatchFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Consolidated aggregation metrics
  const allConsolidatedRecords = batchFiles.flatMap(f => f.records);
  const allConsolidatedPreviews = batchFiles.flatMap(f => f.previews);

  const filteredPreviews = activeFileFilter === 'ALL'
    ? allConsolidatedPreviews
    : allConsolidatedPreviews.filter(p => p.sourceFile === activeFileFilter);

  let overallMinDate = '9999-12-31';
  let overallMaxDate = '0000-01-01';
  let totalCases = 0;
  let totalDeaths = 0;
  const allYearsSet = new Set<number>();

  batchFiles.forEach(f => {
    if (f.minDate && f.minDate < overallMinDate) overallMinDate = f.minDate;
    if (f.maxDate && f.maxDate > overallMaxDate) overallMaxDate = f.maxDate;
    f.detectedYears.forEach(y => allYearsSet.add(y));
    f.records.forEach(r => {
      totalCases += r.cases || 0;
      totalDeaths += r.deaths || 0;
    });
  });

  const sortedAllYears = Array.from(allYearsSet).sort();

  const handleConfirmImport = () => {
    if (allConsolidatedRecords.length) {
      onImportRecords(
        allConsolidatedRecords, 
        overallMinDate !== '9999-12-31' ? overallMinDate : undefined, 
        overallMaxDate !== '0000-01-01' ? overallMaxDate : undefined
      );
      onClose();
      if (onOpenYoYAnalysis) {
        onOpenYoYAnalysis();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full p-6 relative transition-colors max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Multi-Excel Batch Importer & YoY Consolidation
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload multiple Excel/CSV files simultaneously (e.g. 2023, 2024, 2025 reports) to consolidate & auto-trigger Year-over-Year (YoY) analysis
            </p>
          </div>
        </div>

        {/* Drag & Drop Multi-file Upload Zone */}
        <div className="my-4 shrink-0">
          <label 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full min-h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDragOver 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]' 
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex flex-col items-center justify-center py-4 text-center px-4">
              <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-1.5 animate-bounce" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to Select or Drag & Drop <span className="text-emerald-600 dark:text-emerald-400 font-black">Multiple Excel Files</span> at Once
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports selecting multiple .xlsx, .xls, .csv files simultaneously (e.g., <span className="font-mono text-amber-600 dark:text-amber-400">2023_Report.xlsx</span>, <span className="font-mono text-emerald-600 dark:text-emerald-400">2024_Surveillance.xlsx</span>, <span className="font-mono text-blue-600 dark:text-blue-400">2025_Telemetry.xlsx</span>)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".xlsx, .xls, .csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Batch Queue Files Cards List */}
        {batchFiles.length > 0 && (
          <div className="space-y-3 shrink-0 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Uploaded Files in Batch ({batchFiles.length} files)</span>
              </span>
              <button
                onClick={() => setBatchFiles([])}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Clear All Files
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto p-1">
              {batchFiles.map((fileItem) => (
                <div 
                  key={fileItem.id}
                  className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs space-x-2 shadow-2xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 dark:text-white truncate" title={fileItem.fileName}>
                        {fileItem.fileName}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          {fileItem.recordsCount} Recs
                        </span>
                        {fileItem.detectedYears.length > 0 && (
                          <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 rounded font-mono font-bold">
                            {fileItem.detectedYears.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFile(fileItem.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Remove file from batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consolidated Batch Analytics Banner */}
        {batchFiles.length > 0 && (
          <div className="mb-3 p-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-500/30 shadow-md shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600/50 rounded-lg border border-indigo-400/40 shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <p className="font-extrabold text-indigo-200">
                  Consolidated Multi-File Dataset Summary
                </p>
                <p className="text-[11px] text-indigo-300/80">
                  Detected Years: <span className="font-bold text-emerald-300 font-mono">{sortedAllYears.length ? sortedAllYears.join(', ') : 'Multi-year'}</span> • Date Span: {overallMinDate !== '9999-12-31' ? `${overallMinDate} to ${overallMaxDate}` : 'Continuous'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono font-bold">
              <div className="text-center">
                <p className="text-slate-400 text-[10px] uppercase font-sans">Total Records</p>
                <p className="text-emerald-400 text-sm">{allConsolidatedRecords.length}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-[10px] uppercase font-sans">Total Cases</p>
                <p className="text-blue-400 text-sm">{totalCases}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-[10px] uppercase font-sans">Fatalities</p>
                <p className="text-rose-400 text-sm">{totalDeaths}</p>
              </div>
            </div>
          </div>
        )}

        {/* Consolidated Preview Table */}
        {allConsolidatedPreviews.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl">
            
            {/* Filter by file tabs */}
            <div className="bg-slate-100 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto gap-2">
              <div className="flex items-center space-x-1 shrink-0">
                <span className="text-[11px] text-slate-500 mr-1">File Filter:</span>
                <button
                  onClick={() => setActiveFileFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    activeFileFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  All Files ({allConsolidatedPreviews.length})
                </button>
                {batchFiles.map(bf => (
                  <button
                    key={bf.id}
                    onClick={() => setActiveFileFilter(bf.fileName)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors truncate max-w-[140px] cursor-pointer ${
                      activeFileFilter === bf.fileName
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    title={bf.fileName}
                  >
                    {bf.fileName} ({bf.recordsCount})
                  </button>
                ))}
              </div>

              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono shrink-0 hidden sm:inline">
                Fuzzy Matched Woredas (36 E/H & W/H)
              </span>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1 p-2">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-[10px] sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="py-2 px-2">Source File</th>
                    <th className="py-2 px-2">Original Woreda</th>
                    <th className="py-2 px-2">Fuzzy Match</th>
                    <th className="py-2 px-2">Zone</th>
                    <th className="py-2 px-2">Disease</th>
                    <th className="py-2 px-2">Species</th>
                    <th className="py-2 px-2">Cases</th>
                    <th className="py-2 px-2">Deaths</th>
                    <th className="py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPreviews.slice(0, 20).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-1.5 px-2 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[110px]" title={r.sourceFile}>
                        {r.sourceFile}
                      </td>
                      <td className="py-1.5 px-2 font-mono text-slate-500">{r.woredaOriginal}</td>
                      <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{r.woredaMatched}</span>
                      </td>
                      <td className="py-1.5 px-2 font-semibold">{r.zone}</td>
                      <td className="py-1.5 px-2 font-medium">{r.disease}</td>
                      <td className="py-1.5 px-2">{r.species}</td>
                      <td className="py-1.5 px-2 font-bold text-blue-600 dark:text-blue-400">{r.cases}</td>
                      <td className="py-1.5 px-2 font-bold text-rose-600 dark:text-rose-400">{r.deaths}</td>
                      <td className="py-1.5 px-2 font-mono">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPreviews.length > 20 && (
                <p className="text-center text-[11px] text-slate-400 py-2">
                  + {filteredPreviews.length - 20} additional consolidated records ready to import...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State when no files uploaded */}
        {!batchFiles.length && !isProcessing && (
          <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
            <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No Excel files uploaded in batch yet
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Select multiple files above (e.g. 2023, 2024, 2025 Excel files) to merge records into HRVL disease surveillance engine.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={!allConsolidatedRecords.length}
            onClick={handleConfirmImport}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/20 cursor-pointer transition-all transform active:scale-95"
          >
            <span>Import & Consolidate {allConsolidatedRecords.length} Records ({batchFiles.length} Files)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
