import React, { useState } from 'react';
import { Search, ArrowUpDown, ShieldAlert, Download } from 'lucide-react';
import { DiseaseSummary } from '../types';
import { exportToCSV } from '../utils/export';
import { Locale } from '../types';
import { translations } from '../utils/translations';
import { useI18n } from '../contexts/I18nContext';

const shortenDisease = (disease: string) => {
  if (!disease) return '';
  const match = disease.match(/\((.*?)\)/);
  if (match && match[1]) {
    if (match[1] === 'Zero Reporting') return 'None';
    return match[1];
  }
  return disease;
};

interface DiseaseSummaryTableProps {
  locale?: Locale;
  summaries: DiseaseSummary[];
}

export const DiseaseSummaryTable: React.FC<DiseaseSummaryTableProps> = ({ summaries, locale }) => {
  const { locale: i18nLocale, t: i18nT } = useI18n();
  const t = locale ? translations[locale] : i18nT;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DiseaseSummary>('totalCases');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const handleSort = (field: keyof DiseaseSummary) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = summaries.filter(s =>
    s.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.primarySpecies.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    exportToCSV('HRVL_Disease_Summary', sorted);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            HRVL Disease Surveillance Summary Table
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Epidemiological morbidity, CFR rates, and affected species metrics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search Disease Summary"
              placeholder="Search disease or species..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.tblExportCSV}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('disease')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colDiseaseName}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('totalOutbreaks')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colOutbreaks}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('totalCases')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colTotalCases}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('totalDeaths')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colDeaths}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('morbidityPercent')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colMorbidity}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('cfrPercent')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colCFR}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center font-bold">{t.colPrimarySpecies}</th>
              <th className="py-2.5 px-3 text-center font-bold">{t.colRiskLevel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginated.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                  {shortenDisease(s.disease)}
                </td>
                <td className="py-2.5 px-3 font-medium">
                  {s.totalOutbreaks}
                </td>
                <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">
                  {s.totalCases}
                </td>
                <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                  {s.totalDeaths}
                </td>
                <td className="py-2.5 px-3 font-medium">
                  {s.morbidityPercent}%
                </td>
                <td className="py-2.5 px-3 font-bold text-red-600 dark:text-red-400">
                  {s.cfrPercent}%
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {s.primarySpecies}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    s.riskLevel === 'Critical'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : s.riskLevel === 'High'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {s.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-4">
          <span>{t.tblShowingRecords} {paginated.length} of {sorted.length} records</span>
          <div className="flex items-center space-x-2">
            <span>{t.tblRows}</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Prev
          </button>
          
          <div className="flex items-center justify-center space-x-1">
            <span>{t.tblPage}</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none font-semibold cursor-pointer"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span>{t.tblOf} {totalPages}</span>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
