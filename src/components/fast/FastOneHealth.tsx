import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  Globe2,
  TreePine,
  Activity,
  AlertTriangle,
  FileCheck2,
  Users,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fastOneHealthData } from '../../data/fastKnowledgeData';
import { FastOneHealthInterface } from '../../types/fast';

export const FastOneHealth: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domains = ['All', 'Zoonoses', 'Vector-Borne & Climate', 'AMR'];

  const filteredInterfaces = fastOneHealthData.filter(
    item => selectedDomain === 'All' || item.domain === selectedDomain
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                One Health Multi-Sectoral Framework
              </span>
              <span className="text-xs text-slate-300">
                Animal • Human • Wildlife • Environmental Interlinkages
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              One Health Intelligence & Cross-Sectoral Early Warning
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Bridging veterinary surveillance with the Public Health Emergency Management (PHEM) system, wildlife conservation, and meteorological early warning networks in Ethiopia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:flex-col shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Zoonotic Priority Pathogens</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-teal-300" />
              <span>Multi-Sectoral Task Force</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {domains.map(dom => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedDomain === dom
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredInterfaces.map(item => (
          <div
            key={item.id}
            id={`one-health-${item.id}`}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40">
                    {item.domain}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                    item.priorityLevel === 'Critical'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40'
                  }`}>
                    {item.priorityLevel} Priority
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Quadrant Sectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                  🐾 Animal Health Sector:
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.animalSector}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 space-y-1">
                <span className="font-bold text-rose-900 dark:text-rose-300 block">
                  🏥 Public Health Sector (PHEM):
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {item.humanHealthSector}
                </p>
              </div>

              {item.wildlifeSector && (
                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">
                    🦌 Wildlife Interface:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {item.wildlifeSector}
                  </p>
                </div>
              )}

              {item.environmentSector && (
                <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/30 space-y-1">
                  <span className="font-bold text-teal-900 dark:text-teal-300 block">
                    🌱 Environmental & Climate Drivers:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {item.environmentSector}
                  </p>
                </div>
              )}
            </div>

            {/* Joint Surveillance Linkage */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Joint Surveillance & Interoperability Linkage:
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {item.surveillanceLinkage}
              </p>
            </div>

            {/* Joint Intervention Protocols */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Joint Action & Field Rapid Response Protocols:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc pl-4 text-[11px]">
                {item.jointInterventionProtocols.map((prot, idx) => (
                  <li key={idx}>{prot}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
