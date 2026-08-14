import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Map, Activity, Shield, Info, ArrowRight } from 'lucide-react';
import vaccinationData from '../data/vaccinationData.json';

interface DiseaseSchedule {
  disease: string;
  season: string;
  vaccine: string;
  vaccine2: string | null;
}

interface WoredaData {
  name: string;
  region: string;
  diseases: DiseaseSchedule[];
}

export const VaccinationCalendar: React.FC<{ locale?: 'en' | 'am' | 'om' }> = ({ locale = 'en' }) => {
  const data = vaccinationData as WoredaData[];
  
  const regions = useMemo(() => Array.from(new Set(data.map(d => d.region))), [data]);
  
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0] || 'East Hararghe');
  const availableWoredas = useMemo(() => data.filter(d => d.region === selectedRegion).map(d => d.name), [data, selectedRegion]);
  const [selectedWoreda, setSelectedWoreda] = useState<string>('');

  // Auto-select first woreda when region changes
  React.useEffect(() => {
    if (availableWoredas.length > 0 && !availableWoredas.includes(selectedWoreda)) {
      setSelectedWoreda(availableWoredas[0]);
    }
  }, [availableWoredas, selectedWoreda]);

  const woredaData = useMemo(() => data.find(d => d.name === selectedWoreda && d.region === selectedRegion), [data, selectedWoreda, selectedRegion]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Vaccination Calendar
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Knowledge Based Vaccination Schedules & Diseases Mapping (15-Year Analysis)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-400" />
              Select Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              Select Woreda
            </label>
            <select
              value={selectedWoreda}
              onChange={(e) => setSelectedWoreda(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
            >
              {availableWoredas.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>
        
        {woredaData ? (
          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {woredaData.name} Vaccination Schedule
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {woredaData.region} Region
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-sm">
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Disease</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Season It Mostly Appears</th>
                    <th className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Recommended Vaccination</th>
                    <th className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">2nd Vaccination (Optional)</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {woredaData.diseases.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        {d.disease}
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        {d.season === 'N/A' ? (
                          <span className="text-slate-400 italic">Not specified</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/30">
                            {d.season}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium text-emerald-700 dark:text-emerald-300">
                        {d.vaccine === 'N/A' ? (
                          <span className="text-slate-400 italic font-normal">Not scheduled</span>
                        ) : (
                          d.vaccine
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium text-blue-700 dark:text-blue-300">
                        {d.vaccine2 ? d.vaccine2 : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-3 mt-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                <p className="font-semibold mb-1">Schedule Usage Guidelines</p>
                <p>This vaccination calendar is derived from 15 years of passive outbreak reports mapping. Coccidiosis entries indicate recommended controlling months (with Coccidial drugs) rather than vaccinations. NCD indicates standard protocols (e.g., 1d, 4w, 4m then every 4 months).</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <Calendar className="w-12 h-12 mb-3 opacity-20" />
            <p>No vaccination data available for the selected Woreda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
