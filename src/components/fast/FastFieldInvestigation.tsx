import React, { useState } from 'react';
import {
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  CheckSquare,
  Square,
  Thermometer,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Download,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { fastFieldToolsData } from '../../data/fastKnowledgeData';
import { FastFieldTool } from '../../types/fast';

export const FastFieldInvestigation: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<FastFieldTool>(fastFieldToolsData[0]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeFormTab, setActiveFormTab] = useState<'checklist' | 'sop' | 'calculator'>('checklist');

  // Interactive Biosecurity scoring state
  const [biosecurityScores, setBiosecurityScores] = useState<Record<string, number>>({
    b1: 3,
    b2: 2,
    b3: 4,
    b4: 3,
    b5: 2,
  });

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const totalItems = selectedTool.stepsOrItems.length;
  const completedCount = selectedTool.stepsOrItems.filter(item => checkedItems[item.id]).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Calculate Biosecurity Index
  const totalBioScore = Object.values(biosecurityScores).reduce((acc, v) => acc + v, 0);
  const maxBioScore = Object.keys(biosecurityScores).length * 5;
  const bioPercentage = maxBioScore > 0 ? Math.round((totalBioScore / maxBioScore) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1">
                <ClipboardCheck className="w-3.5 h-3.5" />
                Field Operations Toolkit
              </span>
              <span className="text-xs text-slate-300">
                Rapid Outbreak Investigation & Biosecurity
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              Field Investigation Protocols & SOP Checklists
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Standardized operational workflows for District Veterinary Officers (DVOs), Rapid Response Teams, and Field Animal Health Extension Workers across Hararghe.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BSL-2/3 Field Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fastFieldToolsData.map(tool => {
          const isSelected = selectedTool.id === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool);
                setCheckedItems({});
              }}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                  {tool.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {tool.stepsOrItems.length} Steps
                </span>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {tool.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Active Tool Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Tool Header & Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                Target User: {selectedTool.targetUser}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
              {selectedTool.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedTool.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Checklist Progress</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                {completedCount} / {totalItems} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Field Action Verification Steps
          </h4>

          <div className="space-y-2">
            {selectedTool.stepsOrItems.map((item, index) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isChecked ? 'text-emerald-900 dark:text-emerald-300 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                        {index + 1}. {item.label}
                      </span>
                      {item.critical && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                          Critical Step
                        </span>
                      )}
                    </div>
                    {item.details && (
                      <p className={`mt-1 leading-relaxed ${isChecked ? 'text-emerald-700/70 dark:text-emerald-400/60' : 'text-slate-500 dark:text-slate-400'}`}>
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SOP Guidance Notes */}
        {selectedTool.sopGuidance.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2 text-xs">
            <h4 className="font-bold uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Standard Operating Procedure (SOP) Mandatory Directives
            </h4>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
              {selectedTool.sopGuidance.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Biosecurity Risk Auditor if Tool is Biosecurity */}
        {selectedTool.interactiveFormType === 'biosecurity_audit' && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Quantitative Biosecurity Risk Auditor
                </h4>
                <p className="text-[11px] text-slate-500">
                  Rate each parameter on a scale from 1 (Poor/Absent) to 5 (Full Compliance).
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Biosecurity Index</span>
                <span className={`text-base font-black ${
                  bioPercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                  bioPercentage >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {bioPercentage}% ({bioPercentage >= 75 ? 'Satisfactory' : bioPercentage >= 50 ? 'Moderate Risk' : 'High Risk'})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'b1', label: 'Perimeter Security & Vehicle Disinfection Dip' },
                { id: 'b2', label: '21-Day Quarantine Area for New Livestock' },
                { id: 'b3', label: 'Water & Feed Protection from Wild Birds/Rodents' },
                { id: 'b4', label: 'Carcass Deep Burial & Quicklime Protocol' },
                { id: 'b5', label: 'Boot-Dip & Personnel PPE Station Compliance' }
              ].map(p => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setBiosecurityScores(prev => ({ ...prev, [p.id]: score }))}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                          biosecurityScores[p.id] === score
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
