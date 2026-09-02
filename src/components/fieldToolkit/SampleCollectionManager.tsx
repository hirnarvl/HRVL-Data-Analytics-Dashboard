import React, { useState } from 'react';
import { 
  X, 
  TestTube2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FlaskConical, 
  Building2,
  Save,
  Tag,
  Truck
} from 'lucide-react';
import { SampleRecord, FieldInvestigation } from '../../types/fieldToolkit';
import { generateSampleId } from '../../utils/fieldToolkitStorage';
import { soundEngine } from '../../utils/sound';

interface SampleCollectionManagerProps {
  investigations: FieldInvestigation[];
  onSaveSample: (sample: SampleRecord) => void;
  onClose?: () => void;
  defaultInvestigationId?: string;
}

export const SampleCollectionManager: React.FC<SampleCollectionManagerProps> = ({
  investigations,
  onSaveSample,
  onClose,
  defaultInvestigationId
}) => {
  const [isAddingNew, setIsAddingNew] = useState(!!defaultInvestigationId);
  const [selectedInvestigationId, setSelectedInvestigationId] = useState(defaultInvestigationId || investigations[0]?.id || '');
  const [species, setSpecies] = useState('Cattle');
  const [animalTag, setAnimalTag] = useState('');
  const [sampleType, setSampleType] = useState<any>('Whole Blood (EDTA)');
  const [quantity, setQuantity] = useState(2);
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [collectorName, setCollectorName] = useState('Dr. ');
  const [clinicalIndication, setClinicalIndication] = useState('');
  const [preservationMethod, setPreservationMethod] = useState<any>('Ice Packs (+4°C)');
  const [destinationLab, setDestinationLab] = useState<any>('HRVL (Hirna Regional Vet Lab)');
  const [transportStatus, setTransportStatus] = useState<any>('Collected');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Collect all samples across all investigations
  const allSamples: { sample: SampleRecord; investigation: FieldInvestigation }[] = [];
  investigations.forEach(inv => {
    inv.samples?.forEach(s => {
      allSamples.push({ sample: s, investigation: inv });
    });
  });

  const filteredSamples = allSamples.filter(item => {
    const s = item.sample;
    const inv = item.investigation;
    const matchesSearch = 
      s.sampleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.woreda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.disease.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || s.sampleType.includes(filterType);
    return matchesSearch && matchesType;
  });

  const handleCreateSample = () => {
    soundEngine.playClick();
    const parentInv = investigations.find(i => i.id === selectedInvestigationId);
    if (!parentInv) return;

    const newCode = generateSampleId(investigations);
    const newSample: SampleRecord = {
      id: newCode,
      investigationId: parentInv.id,
      sampleCode: newCode,
      species,
      animalIdOrTag: animalTag || undefined,
      sampleType,
      quantity,
      collectionDate,
      woreda: parentInv.woreda,
      kebele: parentInv.kebele,
      lat: parentInv.lat,
      lng: parentInv.lng,
      collectorName,
      clinicalIndication,
      preservationMethod,
      destinationLab,
      transportStatus,
      notes,
      syncStatus: navigator.onLine ? 'synced' : 'pending_sync'
    };

    onSaveSample(newSample);
    soundEngine.playSuccess();
    setIsAddingNew(false);
    if (onClose && defaultInvestigationId) onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl border border-teal-200 dark:border-teal-800">
              <TestTube2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Sample Collection & Chain of Custody
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Field-to-laboratory biospecimen tracking across East & West Hararghe
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setIsAddingNew(prev => !prev);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingNew ? 'Close Form' : 'Register New Sample'}</span>
        </button>
      </div>

      {/* New Sample Registration Form */}
      {isAddingNew && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-teal-300 dark:border-teal-800 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-teal-800 dark:text-teal-200 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              <span>Register Field Biospecimen</span>
            </h4>
            <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded font-bold">
              Auto-Generated ID: {generateSampleId(investigations)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Link to Field Investigation *</label>
              <select
                value={selectedInvestigationId}
                onChange={(e) => setSelectedInvestigationId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
              >
                {investigations.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.investigationCode} — {inv.disease} ({inv.woreda})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sample Specimen Type *</label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Whole Blood (EDTA)">Whole Blood (EDTA)</option>
                <option value="Serum">Serum (Clotted Blood)</option>
                <option value="Vesicular Epithelium / Fluid">Vesicular Epithelium / Fluid (FMD)</option>
                <option value="Nasal / Ocular Swab">Nasal / Ocular Swab in VTM</option>
                <option value="Tissue Biopsy / Organ">Tissue Biopsy / Lymph Node</option>
                <option value="Skin Scab / Nodule">Skin Scab / Nodule Core (LSD)</option>
                <option value="Pleural Fluid">Pleural Fluid (CBPP)</option>
                <option value="Milk">Raw Milk</option>
                <option value="Fecal Swab">Fecal Swab</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Animal Species & Tag</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Goats">Goats</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Camels">Camels</option>
                  <option value="Equines">Equines</option>
                  <option value="Poultry">Poultry</option>
                </select>
                <input
                  type="text"
                  value={animalTag}
                  onChange={(e) => setAnimalTag(e.target.value)}
                  placeholder="Ear Tag ID"
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preservation / Cold Chain *</label>
              <select
                value={preservationMethod}
                onChange={(e) => setPreservationMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Ice Packs (+4°C)">Ice Packs (+4°C Cold Box)</option>
                <option value="Viral Transport Medium (VTM)">Viral Transport Medium (VTM)</option>
                <option value="Liquid Nitrogen (-196°C)">Liquid Nitrogen (-196°C)</option>
                <option value="Frozen (-20°C)">Frozen (-20°C)</option>
                <option value="Formalin 10%">Formalin 10% (Histopathology)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Destination Laboratory *</label>
              <select
                value={destinationLab}
                onChange={(e) => setDestinationLab(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-teal-800 dark:text-teal-200"
              >
                <option value="HRVL (Hirna Regional Vet Lab)">HRVL (Hirna Regional Vet Lab)</option>
                <option value="AHI Sebeta (National Ref Lab)">AHI Sebeta (National Reference Lab)</option>
                <option value="Bedele Regional Lab">Bedele Regional Lab</option>
                <option value="District Vet Clinic Lab">District Vet Clinic Lab</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Collector Name *</label>
              <input
                type="text"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Dr. / Officer Name"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Collection Date</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Clinical Indication & Sampling Notes</label>
            <input
              type="text"
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              placeholder="e.g. Fresh unruptured tongue vesicle epithelium from steer in Bate kebele..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSample}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Biospecimen Record</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Sample Code, Woreda, Disease..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="All">All Types</option>
            <option value="Blood">Blood / Serum</option>
            <option value="Swab">Swabs</option>
            <option value="Epithelium">Vesicles / Epithelium</option>
            <option value="Scab">Skin Scabs / Nodules</option>
          </select>
        </div>
      </div>

      {/* Samples Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Sample Code</th>
                <th className="px-4 py-3">Investigation</th>
                <th className="px-4 py-3">Specimen Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Cold Chain / Dest</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No matching samples found.
                  </td>
                </tr>
              ) : (
                filteredSamples.map(({ sample, investigation }) => (
                  <tr key={sample.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                      {sample.sampleCode}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{investigation.disease}</p>
                      <p className="font-mono text-[10px] text-slate-500">{investigation.investigationCode}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{sample.sampleType}</span>
                      <p className="text-[10px] text-slate-500">{sample.species} {sample.animalIdOrTag ? `(${sample.animalIdOrTag})` : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{sample.woreda}</p>
                      <p className="text-[10px] text-slate-500">{sample.kebele}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{sample.preservationMethod}</p>
                      <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400">{sample.destinationLab}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {sample.transportStatus}
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
