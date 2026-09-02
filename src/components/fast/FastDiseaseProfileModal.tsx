import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Activity,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Flame,
  FileText,
  Calendar,
  CheckCircle2,
  Users
} from 'lucide-react';
import { FastDiseaseKnowledge } from '../../types/fast';
import { SurveillanceRecord } from '../../types';

interface FastDiseaseProfileModalProps {
  disease: FastDiseaseKnowledge | null;
  records: SurveillanceRecord[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: (diseaseName: string) => void;
}

export const FastDiseaseProfileModal: React.FC<FastDiseaseProfileModalProps> = ({
  disease,
  records,
  isOpen,
  onClose,
  onNavigateToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clinical' | 'lab' | 'prevention' | 'surveillance' | 'live-data'>('overview');

  if (!isOpen || !disease) return null;

  // Filter live ADNIS records for this disease
  const matchingLiveRecords = records.filter(r => {
    const rDis = (r.disease || '').toLowerCase();
    return (
      rDis.includes(disease.name.toLowerCase()) ||
      rDis.includes(disease.acronym.toLowerCase()) ||
      disease.matchingAdnisDiseases.some(d => rDis.includes(d.toLowerCase()))
    );
  });

  const totalCases = matchingLiveRecords.reduce((acc, r) => acc + (r.cases || 0), 0);
  const totalDeaths = matchingLiveRecords.reduce((acc, r) => acc + (r.deaths || 0), 0);
  const cfr = totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(1) : '0.0';
  const affectedWoredas = Array.from(new Set(matchingLiveRecords.map(r => r.woreda))).filter(Boolean);
  const eastHarargheCount = matchingLiveRecords.filter(r => r.zone === 'E/H').length;
  const westHarargheCount = matchingLiveRecords.filter(r => r.zone === 'W/H').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div 
        id="fast-disease-profile-modal"
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {disease.group} Group
                </span>
                {disease.oneHealthRelevance?.isZoonotic && (
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Zoonotic
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                {disease.name} ({disease.acronym})
              </h2>
              <p className="text-xs text-slate-300 italic">
                {disease.etiologicalAgent}
              </p>
            </div>
          </div>
          <button
            id="close-fast-disease-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Surveillance Banner if records exist */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>ADNIS Hararghe Live Data:</strong> {matchingLiveRecords.length} surveillance event records
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 dark:text-slate-400">
              Cases: <strong className="text-slate-800 dark:text-slate-200">{totalCases.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Deaths: <strong className="text-rose-600 dark:text-rose-400">{totalDeaths.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              CFR: <strong className="text-amber-600 dark:text-amber-400">{cfr}%</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Woredas: <strong className="text-teal-600 dark:text-teal-400">{affectedWoredas.length}</strong>
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-white dark:bg-slate-900 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Epidemiology', icon: BookOpen },
            { id: 'clinical', label: 'Clinical Signs & Lesions', icon: AlertTriangle },
            { id: 'lab', label: 'Laboratory Diagnostics', icon: FlaskConical },
            { id: 'prevention', label: 'Prevention & Response', icon: ShieldCheck },
            { id: 'surveillance', label: 'Surveillance Protocols', icon: FileText },
            { id: 'live-data', label: `Live Hararghe Events (${matchingLiveRecords.length})`, icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Importance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Global Significance
                  </span>
                  <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {disease.importance.global}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Ethiopian & Hararghe Context
                  </span>
                  <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {disease.importance.ethiopianContext}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Economic & Livelihood Impact
                  </span>
                  <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {disease.importance.economicImpact}
                  </p>
                </div>
              </div>

              {/* Host Species */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Host Range & Susceptibility
                </h4>
                <div className="flex flex-wrap gap-2">
                  {disease.primaryHosts.map(host => (
                    <span key={host} className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      Primary: {host}
                    </span>
                  ))}
                  {disease.secondaryHosts?.map(host => (
                    <span key={host} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                      Secondary: {host}
                    </span>
                  ))}
                </div>
              </div>

              {/* Transmission & Epidemiology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Transmission Routes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
                    {disease.epidemiology.transmission.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    Epidemiological Dynamics
                  </h4>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Incubation Period: </span>
                    <span className="text-slate-600 dark:text-slate-300">{disease.epidemiology.incubationPeriod}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Morbidity & Mortality: </span>
                    <span className="text-slate-600 dark:text-slate-300">{disease.epidemiology.morbidityMortality}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">Seasonality & Climatic Drivers: </span>
                    <span className="text-slate-600 dark:text-slate-300">{disease.epidemiology.seasonality}</span>
                  </div>
                </div>
              </div>

              {/* Authoritative References */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  Authoritative References & Standards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {disease.authoritativeReferences.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          {ref.organization} • {ref.type}
                        </span>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                          {ref.title}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clinical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600" />
                    Pathognomonic Lesions & Key Signs
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                    {disease.clinicalSigns.pathognomonic.map((sign, idx) => (
                      <li key={idx} className="font-semibold">{sign}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Acute & General Clinical Manifestations
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">General:</span>{' '}
                      {disease.clinicalSigns.general.join(', ')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Acute:</span>{' '}
                      {disease.clinicalSigns.acute.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Differential Diagnosis Tree */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Key Differential Diagnoses (Rule-Outs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {disease.clinicalSigns.differentialDiagnosis.map((diff, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-amber-900/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      {diff}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4" />
                    Pen-Side & Field Diagnostic Tests
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                    {disease.laboratoryDiagnosis.fieldTests.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmatory & Reference Laboratory Tests
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                    {disease.laboratoryDiagnosis.referenceTests.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    Sample Requirements & Specimen Types:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    {disease.laboratoryDiagnosis.sampleTypes.map((st, idx) => (
                      <li key={idx}>{st}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    Biosafety Containment Level:
                  </span>
                  <span className="inline-block px-3 py-1 font-bold text-xs rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    {disease.laboratoryDiagnosis.biosafetyLevel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prevention' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Vaccination Strategy
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {disease.preventionAndControl.vaccinationStrategy}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Biosecurity & Disinfection Measures
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
                    {disease.preventionAndControl.biosecurityMeasures.map((bm, idx) => (
                      <li key={idx}>{bm}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Emergency Outbreak Actions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
                    {disease.preventionAndControl.emergencyActions.map((ea, idx) => (
                      <li key={idx}>{ea}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'surveillance' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Standard Case Definitions
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">Suspected Case:</span>
                    <p className="text-slate-600 dark:text-slate-300">{disease.surveillance.caseDefinition.suspected}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Confirmed Case:</span>
                    <p className="text-slate-600 dark:text-slate-300">{disease.surveillance.caseDefinition.confirmed}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">
                    Sampling Protocol for Field Officers:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    {disease.surveillance.samplingRequirements.map((sr, idx) => (
                      <li key={idx}>{sr}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">
                    Mandatory Notification Timeline:
                  </span>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900/50 font-bold text-rose-700 dark:text-rose-300">
                    {disease.surveillance.notificationPeriod}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'live-data' && (
            <div className="space-y-4">
              {matchingLiveRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-semibold">No operational surveillance records currently logged for {disease.name} in Hararghe dataset.</p>
                  <p className="text-xs mt-1 text-slate-400">Zero reports or no historical outbreak events found matching current search filter.</p>
                </div>
              ) : (
                <>
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-400">East Hararghe</span>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-100">{eastHarargheCount} events</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-400">West Hararghe</span>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-100">{westHarargheCount} events</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Cases</span>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{totalCases.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Deaths (CFR)</span>
                      <p className="text-lg font-black text-rose-600 dark:text-rose-400">{totalDeaths.toLocaleString()} ({cfr}%)</p>
                    </div>
                  </div>

                  {/* Table of events */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 sticky top-0 font-bold text-slate-600 dark:text-slate-300">
                          <tr>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Woreda</th>
                            <th className="p-2.5">Zone</th>
                            <th className="p-2.5">Species</th>
                            <th className="p-2.5">Cases</th>
                            <th className="p-2.5">Deaths</th>
                            <th className="p-2.5">Risk Level</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {matchingLiveRecords.slice(0, 50).map(rec => (
                            <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-2.5 font-medium">{rec.date}</td>
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{rec.woreda}</td>
                              <td className="p-2.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  rec.zone === 'E/H' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                }`}>
                                  {rec.zone}
                                </span>
                              </td>
                              <td className="p-2.5">{rec.species}</td>
                              <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">{rec.cases}</td>
                              <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400">{rec.deaths}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  rec.risk === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                                  rec.risk === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' :
                                  rec.risk === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                }`}>
                                  {rec.risk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {onNavigateToMap && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMap(disease.name);
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <MapPin className="w-4 h-4" />
                      View {disease.acronym} Geospatial Hotspots on ADNIS GIS Map
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Source: EuFMD, WOAH Terrestrial Manual & AHI Sebeta</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
