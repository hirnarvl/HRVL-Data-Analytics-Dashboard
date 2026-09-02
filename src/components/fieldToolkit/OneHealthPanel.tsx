import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Activity, 
  Droplets, 
  Trees, 
  CheckCircle2, 
  FileText, 
  Search, 
  ChevronRight,
  Stethoscope,
  Building2,
  Syringe
} from 'lucide-react';
import { FieldInvestigation } from '../../types/fieldToolkit';
import { soundEngine } from '../../utils/sound';

interface OneHealthPanelProps {
  investigations: FieldInvestigation[];
  onSelectInvestigation: (inv: FieldInvestigation) => void;
  onOpenNewInvestigation: () => void;
}

export const OneHealthPanel: React.FC<OneHealthPanelProps> = ({
  investigations,
  onSelectInvestigation,
  onOpenNewInvestigation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZoonoticOnly, setFilterZoonoticOnly] = useState(false);

  // Filter investigations with One Health relevance (e.g. Anthrax, Rabies, or has human cases / wildlife interaction / food chain risk)
  const oneHealthCases = investigations.filter(inv => {
    const isZoonotic = 
      inv.disease.toLowerCase().includes('anthrax') ||
      inv.disease.toLowerCase().includes('rabies') ||
      inv.disease.toLowerCase().includes('brucellosis') ||
      inv.disease.toLowerCase().includes('rift') ||
      inv.oneHealth?.hasHumanCasesOrExposure ||
      inv.oneHealth?.wildlifeInteractionDetected ||
      inv.oneHealth?.foodChainRisk.unpasteurizedMilkConsumed ||
      inv.oneHealth?.foodChainRisk.emergencySlaughterForMeat;

    const matchesSearch = 
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.disease.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterZoonoticOnly) return isZoonotic && matchesSearch;
    return matchesSearch;
  });

  const totalHumanExposed = investigations.reduce((sum, inv) => sum + (inv.oneHealth?.humanSuspectedCount || 0), 0);
  const phemAlertedCount = investigations.filter(inv => inv.oneHealth?.phemNotified).length;
  const jointRrtCount = investigations.filter(inv => inv.oneHealth?.jointInterventionInitiated).length;
  const sharedWaterRisks = investigations.filter(inv => inv.oneHealth?.environmentalFactors.sharedWaterPoint).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
              <HeartHandshake className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-400/20 text-purple-200 border border-purple-300/30">
                  Multisectoral Interface
                </span>
                <span className="text-xs text-purple-200">Vet + Public Health + Environment</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                One Health Field Investigation & Surveillance Module
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenNewInvestigation();
            }}
            className="px-4 py-2 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 whitespace-nowrap"
          >
            Launch One Health Case
          </button>
        </div>

        <p className="text-xs text-purple-100/80 max-w-3xl leading-relaxed">
          Triangulating zoonotic spillover threats (Anthrax, Rabies, Brucellosis), human contact tracing with Public Health Emergency Management (PHEM), communal watering point contamination, and wildlife interface corridors across Hararghe.
        </p>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
            <p className="text-[10px] font-bold text-purple-200 uppercase">Human Exposed / Cases</p>
            <p className="text-2xl font-black text-white">{totalHumanExposed}</p>
            <span className="text-[10px] text-purple-200 font-medium">Herd handlers & families</span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
            <p className="text-[10px] font-bold text-purple-200 uppercase">PHEM Alerts Logged</p>
            <p className="text-2xl font-black text-white">{phemAlertedCount}</p>
            <span className="text-[10px] text-purple-200 font-medium">Active health focal links</span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
            <p className="text-[10px] font-bold text-purple-200 uppercase">Joint Vet-Health RRTs</p>
            <p className="text-2xl font-black text-white">{jointRrtCount}</p>
            <span className="text-[10px] text-purple-200 font-medium">Intersectoral missions</span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/10">
            <p className="text-[10px] font-bold text-purple-200 uppercase">Shared Water Risks</p>
            <p className="text-2xl font-black text-white">{sharedWaterRisks}</p>
            <span className="text-[10px] text-purple-200 font-medium">Communal river / pond sites</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search One Health investigations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filterZoonoticOnly}
            onChange={(e) => setFilterZoonoticOnly(e.target.checked)}
            className="rounded text-purple-600 focus:ring-purple-500"
          />
          <span>Show Zoonotic & Cross-Sectoral Events Only</span>
        </label>
      </div>

      {/* One Health Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {oneHealthCases.map(inv => {
          const hasHuman = inv.oneHealth?.hasHumanCasesOrExposure;
          const isAnthrax = inv.disease.toLowerCase().includes('anthrax');
          return (
            <div
              key={inv.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectInvestigation(inv);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                isAnthrax 
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900' 
                  : hasHuman 
                  ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-900' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">
                      {inv.investigationCode}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {inv.disease}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {inv.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {inv.woreda} ({inv.zone === 'E/H' ? 'East Hararghe' : 'West Hararghe'}) • {inv.species}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  inv.certainty === 'Laboratory Confirmed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {inv.certainty}
                </span>
              </div>

              {/* One Health Badges */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                {hasHuman && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {inv.oneHealth?.humanSuspectedCount} Human Exposed
                  </span>
                )}
                {inv.oneHealth?.phemNotified && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    PHEM Alerted
                  </span>
                )}
                {inv.oneHealth?.wildlifeInteractionDetected && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Trees className="w-3 h-3" />
                    Wildlife Interface
                  </span>
                )}
                {inv.oneHealth?.environmentalFactors.sharedWaterPoint && (
                  <span className="px-2 py-0.5 rounded-md font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    Shared Water
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
