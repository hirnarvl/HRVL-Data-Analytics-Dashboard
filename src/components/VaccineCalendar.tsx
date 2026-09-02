import React, { useState } from 'react';
import { Calendar as CalendarIcon, Filter, Search, Syringe, Download } from 'lucide-react';
import { VACCINATION_SCHEDULES } from '../data/vaccineCalendarData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const diseaseColors = {
  blackLeg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300',
  pasteurellosis: 'bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300',
  anthrax: 'bg-purple-50 dark:bg-purple-500/10 text-purple-800 dark:text-purple-300',
  lsd: 'bg-orange-50 dark:bg-orange-500/10 text-orange-800 dark:text-orange-300',
  ppr: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300',
  fmd: 'bg-pink-50 dark:bg-pink-500/10 text-pink-800 dark:text-pink-300',
  sheepGoatPox: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300',
  ncd: 'bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300',
  coccidiosis: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
};

export const VaccineCalendar: React.FC = () => {
  const [filterZone, setFilterZone] = useState<string>('All');
  const [filterDisease, setFilterDisease] = useState<string>('All');
  const [searchWoreda, setSearchWoreda] = useState<string>('');
  
  const filteredData = VACCINATION_SCHEDULES.filter(s => {
    const zoneMatch = filterZone === 'All' || s.zone === filterZone;
    const woredaMatch = s.woreda.toLowerCase().includes(searchWoreda.toLowerCase());
    
    let diseaseMatch = true;
    if (filterDisease !== 'All') {
      const val = s[filterDisease as keyof typeof s];
      diseaseMatch = !!val && val !== '-';
    }
    
    return zoneMatch && woredaMatch && diseaseMatch;
  });

  const renderCell = (value: string | undefined, diseaseKey: keyof typeof diseaseColors) => {
    const hasValue = value && value !== '-';
    const isHighlighted = hasValue && (filterDisease === 'All' || filterDisease === diseaseKey);
    
    return (
      <td className={`px-4 py-3 border-l border-slate-100 dark:border-slate-800/50 ${isHighlighted ? diseaseColors[diseaseKey] : 'text-slate-500 dark:text-slate-400'}`}>
        <span className={isHighlighted ? 'font-semibold' : ''}>{value || '-'}</span>
      </td>
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(16);
    doc.text('Vaccination Schedule Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Add filters info
    doc.text(`Zone Filter: ${filterZone}`, 14, 28);
    const filterDiseaseName = filterDisease === 'All' 
      ? 'All Diseases' 
      : filterDisease.charAt(0).toUpperCase() + filterDisease.slice(1).replace(/([A-Z])/g, ' $1');
    doc.text(`Disease Filter: ${filterDiseaseName}`, 100, 28);
    if (searchWoreda) {
      doc.text(`Search: "${searchWoreda}"`, 180, 28);
    }
    
    // Define columns
    const columns = [
      { header: 'Woreda', dataKey: 'woreda' },
      { header: 'Black Leg', dataKey: 'blackLeg' },
      { header: 'Pasteurellosis', dataKey: 'pasteurellosis' },
      { header: 'Anthrax', dataKey: 'anthrax' },
      { header: 'LSD', dataKey: 'lsd' },
      { header: 'PPR', dataKey: 'ppr' },
      { header: 'FMD', dataKey: 'fmd' },
      { header: 'Sheep/Goat Pox', dataKey: 'sheepGoatPox' },
      { header: 'NCD', dataKey: 'ncd' },
      { header: 'Coccidiosis', dataKey: 'coccidiosis' }
    ];
    
    // Format data
    const body = filteredData.map(row => ({
      woreda: `${row.woreda} (${row.zone === 'East Hararghe' ? 'E/H' : 'W/H'})`,
      blackLeg: row.blackLeg || '-',
      pasteurellosis: row.pasteurellosis || '-',
      anthrax: row.anthrax || '-',
      lsd: row.lsd || '-',
      ppr: row.ppr || '-',
      fmd: row.fmd || '-',
      sheepGoatPox: row.sheepGoatPox || '-',
      ncd: row.ncd || '-',
      coccidiosis: row.coccidiosis || '-'
    }));

    autoTable(doc, {
      startY: 35,
      columns: columns,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }, // slate-900
      styles: { fontSize: 8, cellPadding: 2 },
      alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
    });

    doc.save('vaccination-schedule-report.pdf');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-600" />
            Knowledge Based Vaccination Schedules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl text-sm">
            Based on 15 years DOVAR (Disease Outbreak and Vaccination Reporting) data mapping for East & West Hararghe zones.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          {/* Download PDF Button */}
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 w-full sm:w-auto transition-colors font-medium text-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download Schedule
          </button>

          {/* Woreda Search Bar */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search woreda..."
              value={searchWoreda}
              onChange={e => setSearchWoreda(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none w-full sm:w-32 placeholder:text-slate-400"
            />
          </div>

          {/* Disease Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <Syringe className="w-4 h-4 text-slate-500" />
            <select 
              value={filterDisease}
              onChange={e => setFilterDisease(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none w-full cursor-pointer"
            >
              <option value="All">All Diseases</option>
              <option value="blackLeg">Black Leg</option>
              <option value="pasteurellosis">Pasteurellosis</option>
              <option value="anthrax">Anthrax</option>
              <option value="lsd">LSD</option>
              <option value="ppr">PPR</option>
              <option value="fmd">FMD</option>
              <option value="sheepGoatPox">Sheep/Goat Pox</option>
              <option value="ncd">NCD</option>
              <option value="coccidiosis">Coccidiosis</option>
            </select>
          </div>

          {/* Zone Filter */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filterZone}
              onChange={e => setFilterZone(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none w-full cursor-pointer"
            >
              <option value="All">Both Zones</option>
              <option value="East Hararghe">East Hararghe</option>
              <option value="West Hararghe">West Hararghe</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold text-center sticky left-0 z-10 bg-slate-50 dark:bg-slate-800/80 shadow-[1px_0_0_rgba(0,0,0,0.1)]">Woreda</th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'blackLeg' ? diseaseColors.blackLeg : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-rose-500"/> Black Leg</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'pasteurellosis' ? diseaseColors.pasteurellosis : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-blue-500"/> Pasteurellosis</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'anthrax' ? diseaseColors.anthrax : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-purple-500"/> Anthrax</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'lsd' ? diseaseColors.lsd : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-orange-500"/> LSD</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'ppr' ? diseaseColors.ppr : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-indigo-500"/> PPR</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'fmd' ? diseaseColors.fmd : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-pink-500"/> FMD</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'sheepGoatPox' ? diseaseColors.sheepGoatPox : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-amber-500"/> Sheep/Goat Pox</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'ncd' ? diseaseColors.ncd : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-teal-500"/> NCD</div>
                </th>
                <th className={`px-4 py-3 font-semibold border-l border-slate-200 dark:border-slate-700 ${filterDisease === 'coccidiosis' ? diseaseColors.coccidiosis : ''}`}>
                  <div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-emerald-500"/> Coccidiosis</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No vaccination schedules match the current filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={`${row.woreda}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200 sticky left-0 z-10 bg-white dark:bg-slate-900 shadow-[1px_0_0_rgba(0,0,0,0.05)] dark:shadow-[1px_0_0_rgba(255,255,255,0.05)]">
                      <div className="flex flex-col">
                        <span>{row.woreda}</span>
                        <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">{row.zone === 'East Hararghe' ? 'E/H' : 'W/H'}</span>
                      </div>
                    </td>
                    {renderCell(row.blackLeg, 'blackLeg')}
                    {renderCell(row.pasteurellosis, 'pasteurellosis')}
                    {renderCell(row.anthrax, 'anthrax')}
                    {renderCell(row.lsd, 'lsd')}
                    {renderCell(row.ppr, 'ppr')}
                    {renderCell(row.fmd, 'fmd')}
                    {renderCell(row.sheepGoatPox, 'sheepGoatPox')}
                    {renderCell(row.ncd, 'ncd')}
                    {renderCell(row.coccidiosis, 'coccidiosis')}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
