import React, { useState } from 'react';
import { BookOpen, Search, X, ExternalLink, ShieldCheck, CheckCircle2, FileText, Globe, Layers, AlertCircle } from 'lucide-react';
import { DISEASE_RISK_PROFILES } from '../../data/diseaseRiskProfiles';

interface ScientificReferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDiseaseCode?: string;
}

export const ScientificReferencesModal: React.FC<ScientificReferencesModalProps> = ({
  isOpen,
  onClose,
  selectedDiseaseCode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>(
    selectedDiseaseCode ? selectedDiseaseCode.toLowerCase() : 'fmd'
  );

  if (!isOpen) return null;

  const profilesList = Object.values(DISEASE_RISK_PROFILES);
  const activeProfile = DISEASE_RISK_PROFILES[selectedProfileKey] || profilesList[0];

  const filteredProfiles = profilesList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span>Scientific Evidence & Epidemiological Risk Parameters</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
                  WOAH / FAO / MoA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent scientific basis, disease-specific transmission radii, and environmental modifier rules.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: 2 Columns (Sidebar list + Detail view) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Disease Selection */}
          <div className="w-full md:w-72 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 flex flex-col space-y-2 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search disease profile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Profile List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs">
              {filteredProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileKey(p.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    selectedProfileKey === p.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className={`text-[10px] ${selectedProfileKey === p.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {p.code} • {p.category}
                    </p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    selectedProfileKey === p.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.innerHighRiskRadiusMeters / 1000}km
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Main Content Area: Selected Disease Scientific Profile */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Top Summary Banner */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-white">{activeProfile.name} ({activeProfile.code})</h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">Category: {activeProfile.category}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                    {activeProfile.evidenceLevel}
                  </span>
                  <span className="text-slate-400 text-[11px]">Reviewed: {activeProfile.lastReviewedDate}</span>
                </div>
              </div>

              {/* Primary Transmission Mechanisms */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Transmission Mechanisms:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                  {activeProfile.transmissionMechanisms.map((mech, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-300 text-xs bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{mech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hosts & Vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Hosts:</span>
                  <p className="text-slate-200 mt-0.5 font-medium">{activeProfile.primaryHosts.join(', ')}</p>
                </div>
                {activeProfile.relevantVectors && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Relevant Vectors / Arthropods:</span>
                    <p className="text-slate-200 mt-0.5 font-medium">{activeProfile.relevantVectors.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Spatial Buffer Zoning Rationale (Inner vs Outer) */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Evidence-Based Spatial Zoning Specifications</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inner Protection Ring */}
                <div className="bg-rose-950/20 border border-rose-800/40 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold text-xs">Inner Core / Protection Zone</span>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono font-extrabold text-xs rounded">
                      {activeProfile.innerHighRiskRadiusMeters / 1000} km Radius
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{activeProfile.innerZoneLabel}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Immediate quarantine, clinical inspection, emergency ring vaccination, and animal movement stoppage.
                  </p>
                </div>

                {/* Outer Surveillance Ring */}
                <div className="bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-xs">Outer Surveillance Perimeter</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono font-extrabold text-xs rounded">
                      {activeProfile.outerSurveillanceRadiusMeters / 1000} km Radius
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{activeProfile.outerZoneLabel}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Active serological screening, market inspections, livestock checkpoint reinforcement, and syndromic tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Environmental Modifiers Table */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Environmental & Meteorological Modifiers</span>
              </h4>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Environmental Factor</th>
                      <th className="p-2.5">Condition / Threshold</th>
                      <th className="p-2.5">Epidemiological Mechanism</th>
                      <th className="p-2.5">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {activeProfile.environmentalModifiers.map((mod, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-2.5 font-bold text-white">{mod.label}</td>
                        <td className="p-2.5 font-mono text-[11px] text-sky-300">{mod.thresholdOrCondition}</td>
                        <td className="p-2.5 text-[11px] leading-relaxed">{mod.epidemiologicalMechanism}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            mod.riskImpact.includes('High') 
                              ? 'bg-rose-500/20 text-rose-300' 
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {mod.riskImpact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Limitations & Scientific Disclaimers */}
            <div className="bg-amber-950/30 border border-amber-800/50 p-3.5 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Epidemiological Limitations & Decision-Support Notice</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeProfile.limitations}
              </p>
            </div>

            {/* Authoritative Citations & References */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Authoritative References & Guidance Documents</span>
              </h4>

              <div className="space-y-2">
                {activeProfile.references.map((ref) => (
                  <div key={ref.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">{ref.organizationOrAuthor} ({ref.year})</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold">
                        {ref.sourceType}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-100">{ref.title}</p>
                    <p className="text-[11px] text-slate-400">Parameter: <b className="text-slate-300">{ref.parameterSupported}</b></p>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline font-semibold mt-1"
                      >
                        <span>Access Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Hirna Regional Diagnostic Laboratory (HRVL) Surveillance GIS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
