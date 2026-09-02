import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  TestTube2, 
  Calendar,
  Building2,
  FileCheck,
  Check
} from 'lucide-react';
import { LabResultRecord, FieldInvestigation, SampleRecord } from '../../types/fieldToolkit';
import { soundEngine } from '../../utils/sound';

interface LabResultManagerProps {
  investigations: FieldInvestigation[];
  onSaveLabResult: (result: LabResultRecord) => void;
  onClose?: () => void;
  defaultInvestigationId?: string;
  defaultSampleId?: string;
}

export const LabResultManager: React.FC<LabResultManagerProps> = ({
  investigations,
  onSaveLabResult,
  onClose,
  defaultInvestigationId,
  defaultSampleId
}) => {
  const [isAdding, setIsAdding] = useState(!!defaultInvestigationId);
  const [selectedInvId, setSelectedInvId] = useState(defaultInvestigationId || investigations[0]?.id || '');
  const [selectedSampleCode, setSelectedSampleCode] = useState(defaultSampleId || '');
  const [diseaseTested, setDiseaseTested] = useState('Foot-and-Mouth Disease (FMD)');
  const [testMethod, setTestMethod] = useState<any>('RT-qPCR (Polymerase Chain Reaction)');
  const [result, setResult] = useState<'Positive' | 'Negative' | 'Inconclusive' | 'Pending'>('Positive');
  const [serotypeOrStrain, setSerotypeOrStrain] = useState('Serotype O');
  const [ctValueOrTiter, setCtValueOrTiter] = useState('Ct 19.4');
  const [testingLab, setTestingLab] = useState<any>('HRVL (Hirna Regional Vet Lab)');
  const [testingDate, setTestingDate] = useState(new Date().toISOString().split('T')[0]);
  const [labAnalystName, setLabAnalystName] = useState('Lab Technologist');
  const [validationStatus, setValidationStatus] = useState<any>('Validated by Senior Lab Officer');
  const [labComments, setLabComments] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all lab results across all investigations
  const allResults: { result: LabResultRecord; investigation: FieldInvestigation }[] = [];
  investigations.forEach(inv => {
    inv.labResults?.forEach(r => {
      allResults.push({ result: r, investigation: inv });
    });
  });

  const currentInv = investigations.find(i => i.id === selectedInvId);

  const handleCreateResult = () => {
    soundEngine.playClick();
    if (!currentInv) return;

    const sample = currentInv.samples?.find(s => s.id === selectedSampleCode || s.sampleCode === selectedSampleCode);
    const newResult: LabResultRecord = {
      id: `LAB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      sampleId: sample?.id || selectedSampleCode || `SMP-${Date.now()}`,
      sampleCode: sample?.sampleCode || selectedSampleCode || 'SMP-DIRECT',
      investigationId: currentInv.id,
      testMethod,
      diseaseTested,
      result,
      serotypeOrStrain: serotypeOrStrain || undefined,
      ctValueOrTiter: ctValueOrTiter || undefined,
      testingLab,
      receivedDate: testingDate,
      testingDate,
      validationStatus,
      validatedBy: labAnalystName,
      labComments: labComments || 'Diagnostic testing verified at Hirna Regional Veterinary Diagnostic Laboratory (HRVL).',
      qualityControlPassed: true,
      syncStatus: navigator.onLine ? 'synced' : 'pending_sync'
    };

    onSaveLabResult(newResult);
    soundEngine.playSuccess();
    setIsAdding(false);
    if (onClose && defaultInvestigationId) onClose();
  };

  const filteredResults = allResults.filter(item => {
    const r = item.result;
    const inv = item.investigation;
    return (
      r.sampleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diseaseTested.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.serotypeOrStrain && r.serotypeOrStrain.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Laboratory Diagnostics & Validation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hirna Regional Veterinary Laboratory (HRVL) Diagnostic Testing Console
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setIsAdding(prev => !prev);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Entry Form' : 'Enter Lab Result'}</span>
        </button>
      </div>

      {/* Entry Form */}
      {isAdding && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-indigo-300 dark:border-indigo-800 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Record Official Laboratory Diagnostic Outcome</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Investigation *</label>
              <select
                value={selectedInvId}
                onChange={(e) => {
                  setSelectedInvId(e.target.value);
                  const inv = investigations.find(i => i.id === e.target.value);
                  if (inv && inv.samples && inv.samples.length > 0) {
                    setSelectedSampleCode(inv.samples[0].sampleCode);
                    setDiseaseTested(inv.disease);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
              >
                {investigations.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.investigationCode} — {inv.disease} ({inv.woreda})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Sample *</label>
              <select
                value={selectedSampleCode}
                onChange={(e) => setSelectedSampleCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
              >
                {currentInv?.samples?.map(s => (
                  <option key={s.id} value={s.sampleCode}>
                    {s.sampleCode} ({s.sampleType} - {s.species})
                  </option>
                ))}
                {(!currentInv?.samples || currentInv.samples.length === 0) && (
                  <option value="NEW-SMP">Create Direct Sample Link</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Test Method *</label>
              <select
                value={testMethod}
                onChange={(e) => setTestMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
              >
                <option value="RT-qPCR (Polymerase Chain Reaction)">RT-qPCR (Polymerase Chain Reaction)</option>
                <option value="Antigen Detection ELISA">Antigen Detection ELISA</option>
                <option value="Antibody ELISA (NSP / SP)">Antibody ELISA (NSP / SP)</option>
                <option value="Rapid Antigen Lateral Flow Device (LFD)">Rapid Antigen Lateral Flow Device (LFD)</option>
                <option value="Complement Fixation Test (CFT)">Complement Fixation Test (CFT - CBPP)</option>
                <option value="Giemsa / Gram / Polychrome Methylene Blue">Polychrome Methylene Blue (Anthrax Smear)</option>
                <option value="Virus Neutralization Test (VNT)">Virus Neutralization Test (VNT)</option>
                <option value="Bacterial Culture & Biochemical">Bacterial Culture & Isolation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Diagnostic Result *</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs border font-black ${
                  result === 'Positive' 
                    ? 'bg-rose-50 border-rose-400 text-rose-800 dark:bg-rose-950 dark:text-rose-200' 
                    : result === 'Negative' 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' 
                    : 'bg-amber-50 border-amber-400 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                }`}
              >
                <option value="Positive">POSITIVE</option>
                <option value="Negative">NEGATIVE</option>
                <option value="Inconclusive">INCONCLUSIVE / RETEST</option>
                <option value="Pending">PENDING TESTING</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Serotype / Strain Lineage</label>
              <input
                type="text"
                value={serotypeOrStrain}
                onChange={(e) => setSerotypeOrStrain(e.target.value)}
                placeholder="e.g. Serotype O / East Africa-3"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ct Value / Titer</label>
              <input
                type="text"
                value={ctValueOrTiter}
                onChange={(e) => setCtValueOrTiter(e.target.value)}
                placeholder="e.g. Ct 18.2 or 1:640"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Testing Date</label>
              <input
                type="date"
                value={testingDate}
                onChange={(e) => setTestingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Testing Facility</label>
              <select
                value={testingLab}
                onChange={(e) => setTestingLab(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-indigo-700 dark:text-indigo-300"
              >
                <option value="HRVL (Hirna Regional Vet Lab)">HRVL (Hirna Regional Vet Lab)</option>
                <option value="AHI Sebeta (National Ref Lab)">AHI Sebeta (National Reference Lab)</option>
                <option value="Bedele Regional Lab">Bedele Regional Lab</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lab Analyst Name</label>
              <input
                type="text"
                value={labAnalystName}
                onChange={(e) => setLabAnalystName(e.target.value)}
                placeholder="Analyst name"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supervisory Validation Status</label>
              <select
                value={validationStatus}
                onChange={(e) => setValidationStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 font-bold"
              >
                <option value="Validated by Senior Lab Officer">Validated by Senior Lab Officer</option>
                <option value="Under Review">Under Review</option>
                <option value="Pending Re-testing">Pending Re-testing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Laboratory Specialist Comments</label>
            <input
              type="text"
              value={labComments}
              onChange={(e) => setLabComments(e.target.value)}
              placeholder="e.g. Strong amplification curves on 3D gene target. Confirms high viral load in vesicular specimen."
              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateResult}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Validate & Save Result</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by Sample, Disease, Serotype..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Outcome</th>
                <th className="px-4 py-3">Disease Tested</th>
                <th className="px-4 py-3">Sample Code</th>
                <th className="px-4 py-3">Method & Lineage</th>
                <th className="px-4 py-3">Testing Lab</th>
                <th className="px-4 py-3">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No matching laboratory results found.
                  </td>
                </tr>
              ) : (
                filteredResults.map(({ result: r, investigation }) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black inline-flex items-center gap-1 ${
                        r.result === 'Positive'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                          : r.result === 'Negative'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                      }`}>
                        {r.result === 'Positive' && <AlertCircle className="w-3.5 h-3.5" />}
                        {r.result === 'Negative' && <Check className="w-3.5 h-3.5" />}
                        {r.result.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                      {r.diseaseTested}
                      <p className="text-[10px] font-normal text-slate-500">{investigation.woreda} ({investigation.investigationCode})</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                      {r.sampleCode}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{r.testMethod}</p>
                      {r.serotypeOrStrain && (
                        <p className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {r.serotypeOrStrain} {r.ctValueOrTiter ? `(${r.ctValueOrTiter})` : ''}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{r.testingLab}</p>
                      <p className="text-[10px] text-slate-500">{r.testingDate}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {r.validationStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
