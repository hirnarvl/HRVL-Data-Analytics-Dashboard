import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  TestTube2, 
  FlaskConical, 
  HeartHandshake, 
  Syringe, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ShieldAlert, 
  ChevronRight, 
  Layers, 
  Users, 
  Download, 
  Printer, 
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { 
  FieldInvestigation, 
  SampleRecord, 
  LabResultRecord 
} from '../../types/fieldToolkit';
import { 
  loadFieldInvestigations, 
  saveFieldInvestigations, 
  getPendingSyncCount,
  syncOfflineDrafts
} from '../../utils/fieldToolkitStorage';
import { FieldSyncBadge } from './FieldSyncBadge';
import { FieldInvestigationForm } from './FieldInvestigationForm';
import { FieldInvestigationDetailModal } from './FieldInvestigationDetailModal';
import { SampleCollectionManager } from './SampleCollectionManager';
import { LabResultManager } from './LabResultManager';
import { OneHealthPanel } from './OneHealthPanel';
import { soundEngine } from '../../utils/sound';

interface FieldToolkitContainerProps {
  onOpenFastResource?: (diseaseKey: string) => void;
  onViewOnMap?: (inv: FieldInvestigation) => void;
}

export const FieldToolkitContainer: React.FC<FieldToolkitContainerProps> = ({
  onOpenFastResource,
  onViewOnMap
}) => {
  const [investigations, setInvestigations] = useState<FieldInvestigation[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'investigations' | 'samples' | 'lab' | 'oneHealth' | 'response'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState<FieldInvestigation | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [diseaseFilter, setDiseaseFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Load from local storage on mount
  useEffect(() => {
    const loaded = loadFieldInvestigations();
    setInvestigations(loaded);
    setPendingSyncCount(getPendingSyncCount());
  }, []);

  // Sync handler
  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncOfflineDrafts();
    const refreshed = loadFieldInvestigations();
    setInvestigations(refreshed);
    setPendingSyncCount(getPendingSyncCount());
    setIsSyncing(false);
  };

  // Save new / updated investigation
  const handleSaveInvestigation = (inv: FieldInvestigation) => {
    const existingIdx = investigations.findIndex(i => i.id === inv.id);
    let updated: FieldInvestigation[];
    if (existingIdx >= 0) {
      updated = [...investigations];
      updated[existingIdx] = inv;
    } else {
      updated = [inv, ...investigations];
    }
    setInvestigations(updated);
    saveFieldInvestigations(updated);
    setPendingSyncCount(getPendingSyncCount());
    setIsFormOpen(false);
    setSelectedInvestigation(inv);
  };

  // Save new sample
  const handleSaveSample = (sample: SampleRecord) => {
    const updated = investigations.map(inv => {
      if (inv.id === sample.investigationId) {
        const existingSamples = inv.samples || [];
        return {
          ...inv,
          samples: [...existingSamples, sample],
          status: (inv.status === 'Field Report' || inv.status === 'Field Investigation Active' ? 'Samples Collected' : inv.status) as any,
          lastModifiedTimestamp: Date.now()
        };
      }
      return inv;
    });

    setInvestigations(updated);
    saveFieldInvestigations(updated);
    setPendingSyncCount(getPendingSyncCount());
  };

  // Save new lab result
  const handleSaveLabResult = (result: LabResultRecord) => {
    const updated = investigations.map(inv => {
      if (inv.id === result.investigationId) {
        const existingResults = inv.labResults || [];
        const isPos = result.result === 'Positive';
        return {
          ...inv,
          labResults: [...existingResults, result],
          certainty: (isPos ? 'Laboratory Confirmed' : inv.certainty) as any,
          status: (isPos ? 'Lab Confirmed' : 'Lab Testing Pending') as any,
          lastModifiedTimestamp: Date.now()
        };
      }
      return inv;
    });

    setInvestigations(updated);
    saveFieldInvestigations(updated);
    setPendingSyncCount(getPendingSyncCount());
  };

  // Filtered investigations list
  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = 
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.investigationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.teamLead.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = zoneFilter === 'All' || inv.zone === zoneFilter;
    const matchesDisease = diseaseFilter === 'All' || inv.disease.toLowerCase().includes(diseaseFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesZone && matchesDisease && matchesStatus;
  });

  // Calculate high level KPI totals
  const totalInvestigations = investigations.length;
  const activeInvestigations = investigations.filter(i => i.status !== 'Closed').length;
  const labConfirmedCount = investigations.filter(i => i.certainty === 'Laboratory Confirmed').length;
  const totalSamples = investigations.reduce((sum, i) => sum + (i.samples?.length || 0), 0);
  const totalSick = investigations.reduce((sum, i) => sum + (i.numberSick || 0), 0);
  const totalDead = investigations.reduce((sum, i) => sum + (i.numberDead || 0), 0);
  const totalHumanExposed = investigations.reduce((sum, i) => sum + (i.oneHealth?.humanSuspectedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Field-to-Lab-to-Dashboard Workflow
                </span>
                <span className="text-xs text-slate-500">Oromia Livestock & Fishery Resource Bureau</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                ADNIS Field Investigation & Rapid Response Toolkit
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
            <FieldSyncBadge
              pendingSyncCount={pendingSyncCount}
              onManualSync={handleManualSync}
              isSyncing={isSyncing}
            />

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Field Outbreak</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold">
          {[
            { id: 'dashboard', label: 'Field Dashboard Overview', icon: Activity },
            { id: 'investigations', label: `All Investigations (${investigations.length})`, icon: Stethoscope },
            { id: 'samples', label: `Sample Registry (${totalSamples})`, icon: TestTube2 },
            { id: 'lab', label: 'Lab Diagnostics (HRVL)', icon: FlaskConical },
            { id: 'oneHealth', label: 'One Health Module', icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer
                  ${isActive 
                    ? 'bg-teal-600 text-white shadow-xs font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: FIELD DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Active Outbreaks</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{activeInvestigations}</p>
              <span className="text-[10px] text-teal-600 font-semibold">Of {totalInvestigations} Total</span>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Lab Confirmed</p>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{labConfirmedCount}</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">RT-qPCR / ELISA</span>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">Samples In Custody</p>
              <p className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{totalSamples}</p>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold">Cold chain verified</span>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Sick Animals</p>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-100">{totalSick}</p>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">Under clinical care</span>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">Dead Animals</p>
              <p className="text-2xl font-black text-rose-900 dark:text-rose-100">{totalDead}</p>
              <span className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold">Safe disposal</span>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-xs text-center">
              <p className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">One Health Links</p>
              <p className="text-2xl font-black text-purple-900 dark:text-purple-100">{totalHumanExposed}</p>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">Humans exposed</span>
            </div>
          </div>

          {/* Active Field Missions & Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Priority Field Investigations in Hararghe
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('investigations')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Records</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investigations.slice(0, 6).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedInvestigation(inv);
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                        {inv.investigationCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                        {inv.disease}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.certainty === 'Laboratory Confirmed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {inv.certainty}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>{inv.woreda} ({inv.zone}) • {inv.kebele}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-600" />
                      <span>{inv.teamLead}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {inv.numberSick} sick / {inv.numberDead} dead
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL INVESTIGATIONS LIST */}
      {activeTab === 'investigations' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code, woreda, disease, officer..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Zones</option>
                <option value="E/H">East Hararghe</option>
                <option value="W/H">West Hararghe</option>
              </select>

              <select
                value={diseaseFilter}
                onChange={(e) => setDiseaseFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Diseases</option>
                <option value="Foot-and-Mouth">FMD</option>
                <option value="Peste des Petits">PPR</option>
                <option value="Lumpy Skin">LSD</option>
                <option value="Anthrax">Anthrax</option>
                <option value="Pleuropneumonia">CBPP</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="All">All Statuses</option>
                <option value="Field Investigation Active">Investigation Active</option>
                <option value="Lab Confirmed">Lab Confirmed</option>
                <option value="Samples Collected">Samples Collected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Code / Status</th>
                    <th className="px-4 py-3.5">Disease & Title</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Species / Counts</th>
                    <th className="px-4 py-3.5">Team Lead</th>
                    <th className="px-4 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredInvestigations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No field investigations matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvestigations.map((inv) => (
                      <tr 
                        key={inv.id} 
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        onClick={() => {
                          soundEngine.playClick();
                          setSelectedInvestigation(inv);
                        }}
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-mono font-bold text-teal-700 dark:text-teal-300">
                            {inv.investigationCode}
                          </p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.certainty === 'Laboratory Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {inv.certainty}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{inv.disease}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{inv.title}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{inv.woreda} ({inv.zone})</p>
                          <p className="text-[10px] text-slate-500">{inv.kebele}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{inv.species}</span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {inv.numberSick} sick / {inv.numberDead} dead ({inv.caseFatalityRate}% CFR)
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{inv.teamLead}</p>
                          <p className="text-[10px] text-slate-500">{inv.startDate}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.playClick();
                              setSelectedInvestigation(inv);
                            }}
                            className="px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 rounded-lg font-bold text-xs border border-teal-200 dark:border-teal-800 transition-colors"
                          >
                            Open File
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAMPLES */}
      {activeTab === 'samples' && (
        <SampleCollectionManager
          investigations={investigations}
          onSaveSample={handleSaveSample}
        />
      )}

      {/* TAB 4: LAB RESULTS */}
      {activeTab === 'lab' && (
        <LabResultManager
          investigations={investigations}
          onSaveLabResult={handleSaveLabResult}
        />
      )}

      {/* TAB 5: ONE HEALTH */}
      {activeTab === 'oneHealth' && (
        <OneHealthPanel
          investigations={investigations}
          onSelectInvestigation={(inv) => setSelectedInvestigation(inv)}
          onOpenNewInvestigation={() => setIsFormOpen(true)}
        />
      )}

      {/* NEW INVESTIGATION MODAL FORM */}
      {isFormOpen && (
        <FieldInvestigationForm
          existingInvestigations={investigations}
          onSave={handleSaveInvestigation}
          onClose={() => setIsFormOpen(false)}
          onOpenFastResource={onOpenFastResource}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedInvestigation && (
        <FieldInvestigationDetailModal
          investigation={selectedInvestigation}
          onClose={() => setSelectedInvestigation(null)}
          onUpdateInvestigation={handleSaveInvestigation}
          onAddSample={(invId) => {
            setSelectedInvestigation(null);
            setActiveTab('samples');
          }}
          onAddLabResult={(invId, sampleId) => {
            setSelectedInvestigation(null);
            setActiveTab('lab');
          }}
          onViewOnMap={onViewOnMap}
        />
      )}
    </div>
  );
};
