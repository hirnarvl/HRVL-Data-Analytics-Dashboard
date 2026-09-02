import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  MapPin, 
  Calendar, 
  TestTube2, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  HeartHandshake, 
  Plus, 
  Share2, 
  Printer, 
  ChevronRight, 
  Activity, 
  Check, 
  Syringe, 
  FileText,
  Trash2,
  Tag,
  UserCheck
} from 'lucide-react';
import { 
  FieldInvestigation, 
  InvestigationStatus, 
  SampleRecord, 
  LabResultRecord, 
  ResponseActionRecord 
} from '../../types/fieldToolkit';
import { soundEngine } from '../../utils/sound';

interface FieldInvestigationDetailModalProps {
  investigation: FieldInvestigation;
  onClose: () => void;
  onUpdateInvestigation: (updated: FieldInvestigation) => void;
  onAddSample: (investigationId: string) => void;
  onAddLabResult: (investigationId: string, sampleId?: string) => void;
  onOpenPrintReport?: (inv: FieldInvestigation) => void;
  onViewOnMap?: (inv: FieldInvestigation) => void;
}

const WORKFLOW_STAGES: { id: InvestigationStatus; label: string }[] = [
  { id: 'Field Report', label: 'Field Report' },
  { id: 'Preliminary Triage', label: 'Triage' },
  { id: 'Field Investigation Active', label: 'Investigation' },
  { id: 'Samples Collected', label: 'Samples' },
  { id: 'Lab Testing Pending', label: 'Lab Testing' },
  { id: 'Lab Confirmed', label: 'Lab Confirmed' },
  { id: 'Epidemiologist Validated', label: 'Validation' },
  { id: 'Contained & Response Active', label: 'Response Active' },
  { id: 'Closed', label: 'Closed' }
];

export const FieldInvestigationDetailModal: React.FC<FieldInvestigationDetailModalProps> = ({
  investigation,
  onClose,
  onUpdateInvestigation,
  onAddSample,
  onAddLabResult,
  onOpenPrintReport,
  onViewOnMap
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'samples' | 'lab' | 'oneHealth' | 'response'>('overview');
  const [newActionType, setNewActionType] = useState<any>('Ring Vaccination Campaign');
  const [newActionOfficer, setNewActionOfficer] = useState('');
  const [newActionTarget, setNewActionTarget] = useState<number>(100);
  const [newActionNotes, setNewActionNotes] = useState('');
  const [isAddingAction, setIsAddingAction] = useState(false);

  // Status progression
  const handleStatusChange = (newStatus: InvestigationStatus) => {
    soundEngine.playClick();
    const updated: FieldInvestigation = {
      ...investigation,
      status: newStatus,
      lastModifiedTimestamp: Date.now()
    };
    onUpdateInvestigation(updated);
  };

  // Add response action
  const handleCreateAction = () => {
    soundEngine.playClick();
    if (!newActionOfficer.trim()) return;

    const action: ResponseActionRecord = {
      id: `ACT-${Date.now()}`,
      investigationId: investigation.id,
      date: new Date().toISOString().split('T')[0],
      actionType: newActionType,
      status: 'In Progress',
      targetAnimalsCount: newActionTarget,
      achievedCount: 0,
      responsibleOfficer: newActionOfficer,
      notes: newActionNotes
    };

    const updated: FieldInvestigation = {
      ...investigation,
      responseActions: [...(investigation.responseActions || []), action],
      lastModifiedTimestamp: Date.now()
    };
    onUpdateInvestigation(updated);
    setIsAddingAction(false);
    setNewActionNotes('');
    setNewActionOfficer('');
  };

  // Toggle action status
  const handleToggleActionStatus = (actionId: string) => {
    soundEngine.playClick();
    const updatedActions = investigation.responseActions.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          status: (a.status === 'Completed' ? 'In Progress' : 'Completed') as any,
          achievedCount: a.status === 'Completed' ? a.achievedCount : a.targetAnimalsCount
        };
      }
      return a;
    });

    onUpdateInvestigation({
      ...investigation,
      responseActions: updatedActions,
      lastModifiedTimestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                  {investigation.investigationCode}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  investigation.certainty === 'Laboratory Confirmed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {investigation.certainty}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-xl text-slate-100">
                {investigation.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onViewOnMap && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onViewOnMap(investigation);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View on Map</span>
              </button>
            )}

            {onOpenPrintReport && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenPrintReport(investigation);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print SITREP</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WORKFLOW PIPELINE PROGRESSION BAR */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[700px]">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const currentIdx = WORKFLOW_STAGES.findIndex(s => s.id === investigation.status);
              const isPast = idx < currentIdx;
              const isCurrent = stage.id === investigation.status;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    onClick={() => handleStatusChange(stage.id)}
                    className={`
                      flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer
                      ${isCurrent 
                        ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-400/50' 
                        : isPast 
                        ? 'bg-slate-800 text-teal-300 hover:bg-slate-700' 
                        : 'bg-slate-900/60 text-slate-500 hover:bg-slate-800'
                      }
                    `}
                  >
                    {isPast && <Check className="w-3 h-3" />}
                    <span>{stage.label}</span>
                  </button>
                  {idx < WORKFLOW_STAGES.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="bg-slate-50 dark:bg-slate-950/70 px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-bold">
          {[
            { id: 'overview', label: 'Epidemiological Overview', icon: Activity },
            { id: 'samples', label: `Samples (${investigation.samples?.length || 0})`, icon: TestTube2 },
            { id: 'lab', label: `Lab Results (${investigation.labResults?.length || 0})`, icon: FlaskConical },
            { id: 'oneHealth', label: 'One Health Interface', icon: HeartHandshake },
            { id: 'response', label: `Response Actions (${investigation.responseActions?.length || 0})`, icon: Syringe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: EPIDEMIOLOGICAL OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Quick KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Population at Risk</p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">{investigation.populationAtRisk}</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                  <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">Sick Cases</p>
                  <p className="text-xl font-black text-amber-900 dark:text-amber-100">{investigation.numberSick}</p>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">{investigation.morbidityRate}% morbidity</span>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 text-center">
                  <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">Dead Animals</p>
                  <p className="text-xl font-black text-rose-900 dark:text-rose-100">{investigation.numberDead}</p>
                  <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300">{investigation.caseFatalityRate}% CFR</span>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-center">
                  <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">Production System</p>
                  <p className="text-xs font-bold text-teal-900 dark:text-teal-100 truncate mt-1">{investigation.productionSystem}</p>
                </div>
              </div>

              {/* Geographic & Team Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Location & Administration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                    <div><span className="text-slate-400">Zone:</span> <span className="font-bold">{investigation.zone === 'E/H' ? 'East Hararghe' : 'West Hararghe'}</span></div>
                    <div><span className="text-slate-400">Woreda:</span> <span className="font-bold">{investigation.woreda}</span></div>
                    <div><span className="text-slate-400">Kebele:</span> <span className="font-bold">{investigation.kebele || 'N/A'}</span></div>
                    <div><span className="text-slate-400">Village:</span> <span className="font-bold">{investigation.village || 'N/A'}</span></div>
                  </div>
                  <p className="text-[11px] font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 p-2 rounded-lg border border-teal-200 dark:border-teal-800">
                    GPS: {investigation.lat?.toFixed(5)}°N, {investigation.lng?.toFixed(5)}°E (±{investigation.gpsAccuracyMeters || 5}m)
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Investigation Team</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <div><span className="text-slate-400">Team Lead:</span> <span className="font-bold text-slate-800 dark:text-slate-200">{investigation.teamLead}</span></div>
                    <div><span className="text-slate-400">Phone:</span> <span className="font-bold">{investigation.investigatorPhone}</span></div>
                    {investigation.teamMembers?.length > 0 && (
                      <div><span className="text-slate-400">Members:</span> <span className="font-medium">{investigation.teamMembers.join(', ')}</span></div>
                    )}
                    <div><span className="text-slate-400">Onset Date:</span> <span className="font-medium">{investigation.startDate}</span> • <span className="text-slate-400">Reported:</span> <span className="font-medium">{investigation.reportDate}</span></div>
                  </div>
                </div>
              </div>

              {/* Clinical & Epidemiological Observations */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Clinical Observations & Signs</p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {investigation.clinicalObservations || 'No specific clinical description recorded.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Epidemiological Context & Transmission Link</p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {investigation.epidemiologicalObservations || 'No transmission context logged.'}
                  </p>
                  {investigation.possibleSource && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-medium">
                      <span className="font-bold">Possible Infection Source:</span> {investigation.possibleSource}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Collected Biological Samples ({investigation.samples?.length || 0})
                </p>
                <button
                  onClick={() => onAddSample(investigation.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Sample</span>
                </button>
              </div>

              {(!investigation.samples || investigation.samples.length === 0) ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <TestTube2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">No samples registered for this investigation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investigation.samples.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                            {sample.sampleCode}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{sample.sampleType}</span>
                          <span className="text-slate-500">({sample.species})</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {sample.transportStatus}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          Preservation: <span className="font-medium text-slate-800 dark:text-slate-200">{sample.preservationMethod}</span> • Destination: <span className="font-bold text-teal-700 dark:text-teal-300">{sample.destinationLab}</span>
                        </p>
                        {sample.clinicalIndication && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            &quot;{sample.clinicalIndication}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => onAddLabResult(investigation.id, sample.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Record Lab Test</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LAB RESULTS */}
          {activeTab === 'lab' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Laboratory Diagnostic Results ({investigation.labResults?.length || 0})
                </p>
                <button
                  onClick={() => onAddLabResult(investigation.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enter Lab Result</span>
                </button>
              </div>

              {(!investigation.labResults || investigation.labResults.length === 0) ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <FlaskConical className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">No laboratory test results recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {investigation.labResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                            result.result === 'Positive'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                              : result.result === 'Negative'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                          }`}>
                            {result.result.toUpperCase()}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {result.diseaseTested}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            ({result.sampleCode})
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {result.validationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300">
                        <div><span className="text-slate-400">Test Method:</span> <span className="font-bold">{result.testMethod}</span></div>
                        <div><span className="text-slate-400">Testing Lab:</span> <span className="font-medium">{result.testingLab}</span></div>
                        <div><span className="text-slate-400">Date:</span> <span className="font-medium">{result.testingDate}</span></div>
                      </div>

                      {result.serotypeOrStrain && (
                        <p className="font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 p-2 rounded-lg border border-teal-200 dark:border-teal-800">
                          Serotype / Strain: {result.serotypeOrStrain} {result.ctValueOrTiter ? `(${result.ctValueOrTiter})` : ''}
                        </p>
                      )}

                      {result.labComments && (
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          Comments: &quot;{result.labComments}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ONE HEALTH */}
          {activeTab === 'oneHealth' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold">
                  <HeartHandshake className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>One Health Multisectoral Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Human Health Exposure</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {investigation.oneHealth?.hasHumanCasesOrExposure 
                        ? `⚠️ ${investigation.oneHealth.humanSuspectedCount} suspected human case(s): ${investigation.oneHealth.humanSymptomsDescription}` 
                        : 'No human illness or exposure reported.'
                      }
                    </p>
                    {investigation.oneHealth?.phemNotified && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ✓ PHEM Focal Person Notified
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Wildlife & Environment</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {investigation.oneHealth?.wildlifeInteractionDetected 
                        ? `Observed wildlife contact: ${investigation.oneHealth.wildlifeSpeciesObserved?.join(', ') || 'Scavengers / wild ruminants'}` 
                        : 'No direct wildlife interface noted.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESPONSE ACTIONS */}
          {activeTab === 'response' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Targeted Outbreak Containment & Response Actions ({investigation.responseActions?.length || 0})
                </p>
                <button
                  onClick={() => setIsAddingAction(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingAction ? 'Cancel' : 'Add Response Action'}</span>
                </button>
              </div>

              {/* Add Action Form */}
              {isAddingAction && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Action Type</label>
                      <select
                        value={newActionType}
                        onChange={(e) => setNewActionType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="Ring Vaccination Campaign">Ring Vaccination Campaign</option>
                        <option value="Quarantine & Movement Restriction">Quarantine & Movement Restriction</option>
                        <option value="Carcass Deep Burial & Quicklime Disinfection">Carcass Deep Burial & Quicklime</option>
                        <option value="Market Closure">Livestock Market Closure</option>
                        <option value="Vector Fogging & Dipping">Vector Fogging & Dipping</option>
                        <option value="Antibiotic / Supportive Treatment">Supportive Treatment</option>
                        <option value="Community Sensitization & PHEM Alert">Community Sensitization</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Target Animals Count</label>
                      <input
                        type="number"
                        min="1"
                        value={newActionTarget}
                        onChange={(e) => setNewActionTarget(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Responsible Officer / Unit</label>
                      <input
                        type="text"
                        value={newActionOfficer}
                        onChange={(e) => setNewActionOfficer(e.target.value)}
                        placeholder="e.g. Woreda RRT Lead"
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Action Notes / Targets</label>
                    <input
                      type="text"
                      value={newActionNotes}
                      onChange={(e) => setNewActionNotes(e.target.value)}
                      placeholder="e.g. Quadrivalent ring vaccination in 3km perimeter..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCreateAction}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Save Action
                    </button>
                  </div>
                </div>
              )}

              {/* Actions List */}
              {(!investigation.responseActions || investigation.responseActions.length === 0) ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Syringe className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No containment actions recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {investigation.responseActions.map((action) => (
                    <div
                      key={action.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{action.actionType}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            action.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {action.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Officer: <span className="font-medium text-slate-800 dark:text-slate-200">{action.responsibleOfficer}</span> • Target: <span className="font-bold text-teal-700 dark:text-teal-300">{action.targetAnimalsCount} animals</span> {action.achievedCount ? `(${action.achievedCount} achieved)` : ''}
                        </p>
                        {action.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            {action.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleActionStatus(action.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          action.status === 'Completed'
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {action.status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Last Updated: {new Date(investigation.lastModifiedTimestamp).toLocaleString()}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
