import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FlaskConical,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  Flame
} from 'lucide-react';
import { FastDiseaseKnowledge, FastDiseaseGroup } from '../../types/fast';
import { fastDiseasesKnowledge } from '../../data/fastKnowledgeData';
import { SurveillanceRecord } from '../../types';

interface FastDiseaseExplorerProps {
  records: SurveillanceRecord[];
  onSelectDisease: (disease: FastDiseaseKnowledge) => void;
  onNavigateToMap?: (diseaseName: string) => void;
}

export const FastDiseaseExplorer: React.FC<FastDiseaseExplorerProps> = ({
  records,
  onSelectDisease,
  onNavigateToMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'All' | FastDiseaseGroup>('All');
  const [zoonoticOnly, setZoonoticOnly] = useState(false);

  const groups: Array<'All' | FastDiseaseGroup> = [
    'All',
    'Vesicular',
    'Respiratory',
    'Pox & Skin',
    'Zoonoses',
    'Vector-Borne & Hemorrhagic'
  ];

  // Calculate live ADNIS surveillance statistics per disease
  const diseaseStatsMap = useMemo(() => {
    const stats: Record<string, { events: number; cases: number; deaths: number; woredas: Set<string> }> = {};

    fastDiseasesKnowledge.forEach(d => {
      stats[d.id] = { events: 0, cases: 0, deaths: 0, woredas: new Set<string>() };
    });

    records.forEach(r => {
      const rDis = (r.disease || '').toLowerCase();
      fastDiseasesKnowledge.forEach(d => {
        const matches =
          rDis.includes(d.name.toLowerCase()) ||
          rDis.includes(d.acronym.toLowerCase()) ||
          d.matchingAdnisDiseases.some(m => rDis.includes(m.toLowerCase()));

        if (matches) {
          stats[d.id].events += 1;
          stats[d.id].cases += r.cases || 0;
          stats[d.id].deaths += r.deaths || 0;
          if (r.woreda) stats[d.id].woredas.add(r.woreda);
        }
      });
    });

    return stats;
  }, [records]);

  // Filtered diseases
  const filteredDiseases = useMemo(() => {
    return fastDiseasesKnowledge.filter(d => {
      const matchSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.etiologicalAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.primaryHosts.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchGroup = selectedGroup === 'All' || d.group === selectedGroup;
      const matchZoonotic = !zoonoticOnly || (d.oneHealthRelevance?.isZoonotic === true);

      return matchSearch && matchGroup && matchZoonotic;
    });
  }, [searchTerm, selectedGroup, zoonoticOnly]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Card */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                FAST Disease Intelligence
              </span>
              <span className="text-xs text-slate-300">
                Foot-and-Mouth & Similar Transboundary Animal Diseases
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              Disease Knowledge & Differential Diagnostics
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Authoritative technical guidelines, pathognomonic lesion profiles, and sampling protocols directly linked to real-time Hararghe 36-woreda surveillance datasets.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:flex-col items-start md:items-end shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{records.length.toLocaleString()} Live Hararghe Events</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-300" />
              <span>{fastDiseasesKnowledge.length} FAST Priority Pathogens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="fast-disease-search"
              type="text"
              placeholder="Search by disease name, acronym (e.g. FMD, PPR), pathogen, or host species..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Zoonotic Toggle */}
          <button
            id="toggle-zoonotic-filter"
            onClick={() => setZoonoticOnly(!zoonoticOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border shrink-0 ${
              zoonoticOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            Zoonotic Diseases Only
          </button>
        </div>

        {/* Group Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Group:
          </span>
          {groups.map(grp => {
            const isSelected = selectedGroup === grp;
            return (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {grp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDiseases.map(disease => {
          const stats = diseaseStatsMap[disease.id] || { events: 0, cases: 0, deaths: 0, woredas: new Set() };
          const hasLiveData = stats.events > 0;
          const cfr = stats.cases > 0 ? ((stats.deaths / stats.cases) * 100).toFixed(1) : '0.0';

          return (
            <div
              key={disease.id}
              id={`fast-card-${disease.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header line */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        {disease.group}
                      </span>
                      {disease.oneHealthRelevance?.isZoonotic && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                          Zoonosis
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {disease.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {disease.acronym}
                  </span>
                </div>

                {/* Pathogen / Agent */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed italic">
                  {disease.etiologicalAgent}
                </p>

                {/* Host Badges */}
                <div className="flex flex-wrap gap-1">
                  {disease.primaryHosts.map(h => (
                    <span key={h} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Live ADNIS Integration Block */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Hararghe Live Records:
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {stats.events > 0 ? `${stats.events} events` : '0 logged'}
                    </span>
                  </div>

                  {hasLiveData ? (
                    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/40">
                      <div>
                        Cases: <strong className="text-slate-800 dark:text-slate-200">{stats.cases}</strong>
                      </div>
                      <div>
                        Deaths: <strong className="text-rose-600 dark:text-rose-400">{stats.deaths}</strong>
                      </div>
                      <div>
                        CFR: <strong className="text-amber-600 dark:text-amber-400">{cfr}%</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">
                      Zero outbreaks currently reported in baseline filter
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  id={`view-profile-${disease.id}`}
                  onClick={() => onSelectDisease(disease)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white dark:hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all flex-1 justify-center"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Full Profile & Lab SOP
                </button>

                {onNavigateToMap && hasLiveData && (
                  <button
                    onClick={() => onNavigateToMap(disease.name)}
                    title={`View ${disease.acronym} on GIS Map`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
