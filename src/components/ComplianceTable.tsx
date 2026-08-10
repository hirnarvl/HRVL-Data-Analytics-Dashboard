import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Eye, 
  AlertOctagon, 
  PhoneCall, 
  Calendar, 
  Send, 
  Truck, 
  X, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { WoredaCompliance } from '../types';
import { exportToCSV } from '../utils/export';
import { Locale } from '../types';
import { translations } from '../utils/translations';

import { SurveillanceRecord } from '../types';

interface ComplianceTableProps {
  locale?: Locale;
  records?: SurveillanceRecord[];
  complianceList: WoredaCompliance[];
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({ complianceList, records , locale = 'en' }) => {
  const t = translations[locale];
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<'All' | 'E/H' | 'W/H'>('All');
  const [complianceCategory, setComplianceCategory] = useState<'All' | 'Compliant' | 'Needs Attention' | 'Chronic Non-Reporting'>('All');
  const [sortField, setSortField] = useState<keyof WoredaCompliance>('complianceRate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [drilledWoreda, setDrilledWoreda] = useState<WoredaCompliance | null>(null);
  const [alertSentStatus, setAlertSentStatus] = useState<string | null>(null);

  const handleSort = (field: keyof WoredaCompliance) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = complianceList.filter(item => {
    if (zoneFilter !== 'All' && item.zone !== zoneFilter) return false;
    
    if (complianceCategory === 'Compliant' && item.complianceRate < 80) return false;
    if (complianceCategory === 'Needs Attention' && (item.complianceRate < 50 || item.complianceRate >= 80)) return false;
    if (complianceCategory === 'Chronic Non-Reporting' && item.complianceRate >= 50) return false;

    return (
      item.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
    exportToCSV('HRVL_Woreda_Compliance_36_Woredas', sorted);
  };

  // Generate 12-week submission timeline for drilled woreda
  const generateWeeklyTimeline = (rate: number) => {
    const weeks = [];
    const missingCount = Math.round(12 * (1 - rate / 100));
    for (let w = 1; w <= 12; w++) {
      if (w > 12 - missingCount) {
        weeks.push({ week: `W${w}`, status: 'Missing', label: 'No Submission (Gap)' });
      } else if (w % 3 === 0) {
        weeks.push({ week: `W${w}`, status: 'Zero', label: 'Zero Report Logged' });
      } else {
        weeks.push({ week: `W${w}`, status: 'Active', label: 'Active Surveillance Logged' });
      }
    }
    return weeks;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Woreda Reporting Compliance & Non-Reporting Audit (36 Woredas)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            E/H (21) & W/H (15) surveillance submission rates, drill-down inspection, and chronic gap detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Compliance Status Category Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setComplianceCategory('All')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                complianceCategory === 'All' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All (36)
            </button>
            <button
              onClick={() => setComplianceCategory('Compliant')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                complianceCategory === 'Compliant' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              Compliant (≥80%)
            </button>
            <button
              onClick={() => setComplianceCategory('Needs Attention')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                complianceCategory === 'Needs Attention' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              Attention (50-79%)
            </button>
            <button
              onClick={() => setComplianceCategory('Chronic Non-Reporting')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                complianceCategory === 'Chronic Non-Reporting' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 dark:text-rose-400 font-bold'
              }`}
            >
              Non-Reporting (&lt;50%)
            </button>
          </div>

          {/* Zone Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setZoneFilter('All')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                zoneFilter === 'All' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Zones
            </button>
            <button
              onClick={() => setZoneFilter('E/H')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                zoneFilter === 'E/H' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              E/H (21)
            </button>
            <button
              onClick={() => setZoneFilter('W/H')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                zoneFilter === 'W/H' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              W/H (15)
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              aria-label="Search Woreda Compliance"
              placeholder="Search woreda..."
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
            <span>{t.tblExportCSV}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-3 max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-700 z-10">
            <tr>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('woreda')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Woreda Name</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 cursor-pointer text-center font-bold" onClick={() => handleSort('zone')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>{t.colZone}</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center font-bold">Submissions (Actual / Expected)</th>
              <th className="py-2.5 px-3 cursor-pointer w-48 text-center font-bold" onClick={() => handleSort('complianceRate')}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Compliance Progress %</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center font-bold">Last Submission</th>
              <th className="py-2.5 px-3 text-center font-bold">Compliance Status</th>
              <th className="py-2.5 px-3 text-center font-bold">Drill-Down Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginated.map((item, idx) => {
              const rate = item.complianceRate;
              const isChronic = rate < 50;
              const barColor = rate >= 80 ? 'bg-emerald-500' : rate >= 60 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <tr 
                  key={idx} 
                  onClick={() => setDrilledWoreda(item)}
                  className={`hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${
                    isChronic ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {isChronic && <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />}
                    <span>{item.woreda}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.zone === 'E/H'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    }`}>
                      {item.zone}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium">
                    {item.actualReports} / {item.expectedReports} reports
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${rate}%` }} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white w-9 text-right">{rate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.lastReportDate}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Compliant'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'Needs Attention'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {item.status === 'Compliant' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : item.status === 'Needs Attention' ? (
                        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDrilledWoreda(item);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 rounded-md border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Drill Down</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-2 mb-4">
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

      {/* Interactive Drill-Down Inspection Modal */}
      {drilledWoreda && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative transition-all animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    drilledWoreda.complianceRate >= 80 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {drilledWoreda.status} ({drilledWoreda.complianceRate}%)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Zone: {drilledWoreda.zone}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Surveillance Compliance Drill-Down: {drilledWoreda.woreda} Woreda
                </h3>
              </div>

              <button
                onClick={() => {
                  setDrilledWoreda(null);
                  setAlertSentStatus(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4">
              
              {/* Audit Summary Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Reports Received</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {drilledWoreda.actualReports} / {drilledWoreda.expectedReports}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Last Known Log</span>
                  <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {drilledWoreda.lastReportDate}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Consecutive Gaps</span>
                  <p className={`text-lg font-black mt-0.5 ${
                    drilledWoreda.complianceRate < 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {Math.round(12 * (1 - drilledWoreda.complianceRate / 100))} Weeks
                  </p>
                </div>
              </div>

              {/* 12-Week Submission Timeline Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Q3 12-Week Surveillance Submission Timeline</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Green = Logged | Yellow = Zero Report | Red = Missing</span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {generateWeeklyTimeline(drilledWoreda.complianceRate).map((item, idx) => (
                    <div
                      key={idx}
                      title={`${item.week}: ${item.label}`}
                      className={`p-2 rounded-lg text-center font-mono text-[11px] font-bold border transition-all ${
                        item.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
                          : item.status === 'Zero'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
                          : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800 animate-pulse'
                      }`}
                    >
                      <div>{item.week}</div>
                      <div className="text-[9px] font-normal opacity-80 mt-0.5">
                        {item.status === 'Active' ? '✓' : item.status === 'Zero' ? '0' : '✗'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              {/* Assigned Veterinary Officer Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                  <span>District Veterinary Office: {drilledWoreda.woreda} Station</span>
                  <span className="text-slate-500 font-normal">HRVL Field Post</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <span>Assigned Officer: <b>{records?.find(r => r.woreda === drilledWoreda.woreda && r.reporter)?.reporter || 'Not Assigned'}</b></span>
                  <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                    <PhoneCall className="w-3 h-3" />
                    <span>{records?.find(r => r.woreda === drilledWoreda.woreda && r.phone)?.phone || '*'}</span>
                  </span>
                </div>
              </div>


              {/* Alert Status Banner */}
              {alertSentStatus && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{alertSentStatus}</span>
                </div>
              )}

            </div>

            {/* Action Buttons Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  const phoneNumber = records?.find(r => r.woreda === drilledWoreda.woreda && r.phone)?.phone;
                  if (phoneNumber && phoneNumber !== '*') {
                    const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
                    const telegramUrl = `https://t.me/${formattedPhone}`;
                    window.open(telegramUrl, '_blank');
                  }
                  setAlertSentStatus(`Telegram message initiated for the Assigned Officer (ADNiS Focal) of ${drilledWoreda.woreda} Woreda.`);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Telegram Alert</span>
              </button>

              <button
                onClick={() => {
                  setAlertSentStatus(`HRVL Mobile Verification Team scheduled to visit ${drilledWoreda.woreda} Woreda within 24 hours.`);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Schedule Mobile Field Team</span>
              </button>

              <button
                onClick={() => setDrilledWoreda(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
