import React, { useState } from 'react';
import {
  FlaskConical,
  TestTube2,
  Clock,
  ShieldCheck,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { fastLabMatricesData } from '../../data/fastKnowledgeData';
import { FastLabDiagnosticMatrix } from '../../types/fast';

export const FastLaboratoryIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<FastLabDiagnosticMatrix | null>(null);

  const filteredMatrices = fastLabMatricesData.filter(m =>
    m.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.primaryTest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.confirmatoryTest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.preferredSample.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-linear-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" />
                Laboratory Diagnostics & Testing
              </span>
              <span className="text-xs text-slate-300">
                Diagnostic Matrices & Biosafety Standards
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white">
              FAST Laboratory Intelligence & Diagnostic Matrices
            </h2>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Standardized diagnostic sample requirements, transport media, primary vs. confirmatory testing algorithms, and turnaround times aligned with Animal Health Institute (AHI Sebeta) National Reference Laboratory capacities.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 shrink-0">
            <Building2 className="w-4 h-4 text-teal-300" />
            <span>AHI Sebeta Reference Facility</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="lab-matrix-search"
            type="text"
            placeholder="Search diagnostic test matrix by disease, sample type, or test method (e.g. RT-PCR, ELISA, DFA)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Diagnostic Matrices Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase tracking-wider font-extrabold text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Disease & Pathogen</th>
                <th className="p-3.5">Preferred Specimen & Transport</th>
                <th className="p-3.5">Primary / Pen-Side Test</th>
                <th className="p-3.5">Confirmatory Reference Test</th>
                <th className="p-3.5">Turnaround Time</th>
                <th className="p-3.5">Biosafety</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMatrices.map(mat => (
                <tr
                  key={mat.diseaseId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <TestTube2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>{mat.diseaseName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{mat.preferredSample}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{mat.transportMedia}</p>
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {mat.primaryTest}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {mat.confirmatoryTest}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-900/40 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {mat.turnaroundTime}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 whitespace-nowrap">
                      {mat.biosafetyRequirement}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedDisease(mat)}
                      className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slide/Card if selected */}
      {selectedDisease && (
        <div className="p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-base font-bold text-teal-950 dark:text-teal-200">
                Diagnostic Interpretation Protocol: {selectedDisease.diseaseName}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDisease(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Close Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800/40 space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">National Reference Laboratory Capacity:</span>
              <p className="text-slate-600 dark:text-slate-300">{selectedDisease.nationalLabCapacity}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-800/40 space-y-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Epidemiological & Diagnostic Interpretation Notes:</span>
              <p className="text-slate-600 dark:text-slate-300">{selectedDisease.interpretationNotes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
