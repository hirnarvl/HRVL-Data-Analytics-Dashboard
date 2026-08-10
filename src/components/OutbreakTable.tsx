import React, { useState } from 'react';
import { Search, ArrowUpDown, Download, Flame } from 'lucide-react';
import { Outbreak } from '../types';
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

interface OutbreakTableProps {
  locale?: Locale;
  outbreaks: Outbreak[];
}

export const OutbreakTable: React.FC<OutbreakTableProps> = ({ outbreaks, locale }) => {
  const { locale: i18nLocale, t: i18nT } = useI18n();
  const t = locale ? translations[locale] : i18nT;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Outbreak>('cases');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const handleSort = (field: keyof Outbreak) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = outbreaks.filter(ob =>
    ob.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ob.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ob.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ob.outbreakCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    exportToCSV('HRVL_Active_Outbreaks', sorted);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              HRVL Field Outbreak Tracking Table
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Morbidity, Mortality, and Case Fatality Rate (CFR) epidemiological columns
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search Outbreaks"
              placeholder="Search code, disease, woreda..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3 text-center font-bold">Code</th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('disease')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Disease</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('woreda')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Woreda / Zone</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('status')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colStatus}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('cases')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colCases}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('deaths')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colDeaths}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-blue-600 dark:text-blue-400 text-center font-bold" onClick={() => handleSort('morbidityRate')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colMorbidity}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-rose-600 dark:text-rose-400 text-center font-bold" onClick={() => handleSort('mortalityRate')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Mortality %</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-red-600 dark:text-red-400 text-center font-bold" onClick={() => handleSort('cfr')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colCFR}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginated.map((ob) => (
              <tr key={ob.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {ob.outbreakCode}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                  {shortenDisease(ob.disease)}
                </td>
                <td className="py-2.5 px-3 font-medium">
                  {ob.woreda} <span className="text-slate-400">({ob.zone})</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    ob.status === 'Active'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300'
                      : ob.status === 'Under Investigation'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {ob.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                  {ob.cases}
                </td>
                <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                  {ob.deaths}
                </td>
                <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">
                  {ob.morbidityRate}%
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-600 dark:text-slate-400">
                  {ob.mortalityRate}%
                </td>
                <td className="py-2.5 px-3 font-black text-red-600 dark:text-red-400">
                  {ob.cfr}%
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
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
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
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none font-semibold"
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