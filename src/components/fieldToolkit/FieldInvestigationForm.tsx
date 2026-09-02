import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Stethoscope, 
  HeartHandshake, 
  TestTube2, 
  ShieldAlert, 
  BookOpen,
  Info,
  Layers,
  Save,
  Loader2,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  Crosshair,
  AlertCircle
} from 'lucide-react';
import { 
  FieldInvestigation, 
  DiseaseSpecificDetails, 
  OneHealthFieldObservation,
  SampleRecord,
  ProductionSystem,
  OutbreakCertainty,
  InvestigationStatus,
  SyncStatus
} from '../../types/fieldToolkit';
import { HARARGHE_WOREDAS } from '../../data/woredas';
import { 
  generateInvestigationId, 
  generateSampleId,
  validateFieldInvestigation 
} from '../../utils/fieldToolkitStorage';
import { soundEngine } from '../../utils/sound';

interface FieldInvestigationFormProps {
  onSave: (investigation: FieldInvestigation) => void;
  onClose: () => void;
  existingInvestigations: FieldInvestigation[];
  initialData?: FieldInvestigation | null;
  onOpenFastResource?: (diseaseKey: string) => void;
}

export const FieldInvestigationForm: React.FC<FieldInvestigationFormProps> = ({
  onSave,
  onClose,
  existingInvestigations,
  initialData,
  onOpenFastResource
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCapturingGps, setIsCapturingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Step 1: Admin & Location
  const [title, setTitle] = useState(initialData?.title || '');
  const [disease, setDisease] = useState(initialData?.disease || 'Foot-and-Mouth Disease (FMD)');
  const [certainty, setCertainty] = useState<OutbreakCertainty>(initialData?.certainty || 'Suspected');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [reportDate, setReportDate] = useState(initialData?.reportDate || new Date().toISOString().split('T')[0]);
  const [teamLead, setTeamLead] = useState(initialData?.teamLead || 'Dr. ');
  const [teamMembers, setTeamMembers] = useState(initialData?.teamMembers?.join(', ') || '');
  const [investigatorPhone, setInvestigatorPhone] = useState(initialData?.investigatorPhone || '+251 ');
  const [zone, setZone] = useState<'E/H' | 'W/H'>(initialData?.zone || 'E/H');
  const [woreda, setWoreda] = useState(initialData?.woreda || 'Haramaya');
  const [kebele, setKebele] = useState(initialData?.kebele || '');
  const [village, setVillage] = useState(initialData?.village || '');
  const [lat, setLat] = useState<number>(initialData?.lat || 9.3985);
  const [lng, setLng] = useState<number>(initialData?.lng || 42.0125);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | undefined>(initialData?.gpsAccuracyMeters || 5.0);

  // Step 2: Population & Epidemiology
  const [species, setSpecies] = useState(initialData?.species || 'Cattle');
  const [productionSystem, setProductionSystem] = useState<ProductionSystem>(initialData?.productionSystem || 'Pastoral / Extensive');
  const [populationAtRisk, setPopulationAtRisk] = useState<number>(initialData?.populationAtRisk || 100);
  const [numberExposed, setNumberExposed] = useState<number>(initialData?.numberExposed || 40);
  const [numberSick, setNumberSick] = useState<number>(initialData?.numberSick || 15);
  const [numberDead, setNumberDead] = useState<number>(initialData?.numberDead || 1);
  const [clinicalObservations, setClinicalObservations] = useState(initialData?.clinicalObservations || '');
  const [epidemiologicalObservations, setEpidemiologicalObservations] = useState(initialData?.epidemiologicalObservations || '');
  const [possibleSource, setPossibleSource] = useState(initialData?.possibleSource || '');
  const [recentAnimalMovement, setRecentAnimalMovement] = useState<boolean>(initialData?.recentAnimalMovement || false);
  const [movementDetails, setMovementDetails] = useState(initialData?.movementDetails || '');
  const [contactWithOtherHerds, setContactWithOtherHerds] = useState<boolean>(initialData?.contactWithOtherHerds || false);
  const [vaccinationHistory, setVaccinationHistory] = useState(initialData?.vaccinationHistory || 'Not Vaccinated');

  // Step 3: Disease-Specific Clinical Assessment
  const [diseaseKey, setDiseaseKey] = useState<'fmd' | 'ppr' | 'lsd' | 'cbpp' | 'anthrax' | 'newcastle' | 'other'>('fmd');
  const [diseaseDetails, setDiseaseDetails] = useState<DiseaseSpecificDetails>(
    initialData?.diseaseSpecificDetails || { diseaseKey: 'fmd' }
  );

  // Step 4: One Health
  const [hasHumanExposure, setHasHumanExposure] = useState<boolean>(initialData?.oneHealth?.hasHumanCasesOrExposure || false);
  const [humanSuspectedCount, setHumanSuspectedCount] = useState<number>(initialData?.oneHealth?.humanSuspectedCount || 0);
  const [humanSymptoms, setHumanSymptoms] = useState<string>(initialData?.oneHealth?.humanSymptomsDescription || '');
  const [phemNotified, setPhemNotified] = useState<boolean>(initialData?.oneHealth?.phemNotified || false);
  const [wildlifeInteraction, setWildlifeInteraction] = useState<boolean>(initialData?.oneHealth?.wildlifeInteractionDetected || false);
  const [sharedWaterPoint, setSharedWaterPoint] = useState<boolean>(initialData?.oneHealth?.environmentalFactors.sharedWaterPoint || false);
  const [unpasteurizedMilk, setUnpasteurizedMilk] = useState<boolean>(initialData?.oneHealth?.foodChainRisk.unpasteurizedMilkConsumed || false);
  const [emergencySlaughter, setEmergencySlaughter] = useState<boolean>(initialData?.oneHealth?.foodChainRisk.emergencySlaughterForMeat || false);
  const [jointIntervention, setJointIntervention] = useState<boolean>(initialData?.oneHealth?.jointInterventionInitiated || false);
  const [jointNotes, setJointNotes] = useState<string>(initialData?.oneHealth?.jointNotes || '');

  // Step 5: Samples to Collect
  const [samplesList, setSamplesList] = useState<Partial<SampleRecord>[]>(initialData?.samples || []);
  const [investigatorNotes, setInvestigatorNotes] = useState(initialData?.investigatorNotes || '');

  // Map disease selection to diseaseKey
  useEffect(() => {
    const dLower = disease.toLowerCase();
    if (dLower.includes('foot') || dLower.includes('fmd')) setDiseaseKey('fmd');
    else if (dLower.includes('peste') || dLower.includes('ppr')) setDiseaseKey('ppr');
    else if (dLower.includes('lumpy') || dLower.includes('lsd')) setDiseaseKey('lsd');
    else if (dLower.includes('pleuro') || dLower.includes('cbpp')) setDiseaseKey('cbpp');
    else if (dLower.includes('anthrax')) setDiseaseKey('anthrax');
    else if (dLower.includes('newcastle')) setDiseaseKey('newcastle');
    else setDiseaseKey('other');
  }, [disease]);

  // Update zone when woreda changes
  const handleWoredaChange = (woredaName: string) => {
    setWoreda(woredaName);
    const found = HARARGHE_WOREDAS.find(w => w.name.toLowerCase() === woredaName.toLowerCase());
    if (found) {
      setZone(found.zone);
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  // Capture GPS using HTML5 Geolocation API
  const handleCaptureGps = () => {
    soundEngine.playClick();
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your device/browser.');
      return;
    }
    setIsCapturingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsCapturingGps(false);
        setLat(parseFloat(pos.coords.latitude.toFixed(6)));
        setLng(parseFloat(pos.coords.longitude.toFixed(6)));
        setGpsAccuracy(parseFloat(pos.coords.accuracy.toFixed(1)));
        soundEngine.playSuccess();
      },
      (err) => {
        setIsCapturingGps(false);
        setGpsError(`GPS Error: ${err.message}. Using woreda coordinates.`);
        soundEngine.playAlert();
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Population metrics calculation
  const morbidityRate = numberExposed > 0 ? parseFloat(((numberSick / numberExposed) * 100).toFixed(2)) : 0;
  const mortalityRate = populationAtRisk > 0 ? parseFloat(((numberDead / populationAtRisk) * 100).toFixed(2)) : 0;
  const caseFatalityRate = numberSick > 0 ? parseFloat(((numberDead / numberSick) * 100).toFixed(2)) : 0;

  // Add sample item to list
  const handleAddSample = () => {
    soundEngine.playClick();
    const newSampleCode = generateSampleId(existingInvestigations) + (samplesList.length > 0 ? `-${samplesList.length + 1}` : '');
    setSamplesList(prev => [
      ...prev,
      {
        id: newSampleCode,
        sampleCode: newSampleCode,
        species,
        sampleType: 'Whole Blood (EDTA)',
        quantity: 2,
        collectionDate: new Date().toISOString().split('T')[0],
        woreda,
        kebele,
        lat,
        lng,
        collectorName: teamLead,
        clinicalIndication: `Suspected ${disease} investigation sample`,
        preservationMethod: 'Ice Packs (+4°C)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'Collected',
        syncStatus: 'pending_sync'
      }
    ]);
  };

  const handleRemoveSample = (idx: number) => {
    soundEngine.playClick();
    setSamplesList(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit and validate
  const handleSubmit = () => {
    soundEngine.playClick();
    const investigationId = initialData?.id || generateInvestigationId(existingInvestigations);
    
    const newInv: FieldInvestigation = {
      id: investigationId,
      investigationCode: investigationId,
      title: title || `Suspected ${disease} Outbreak Investigation in ${woreda}`,
      disease,
      certainty,
      status: initialData?.status || 'Field Investigation Active',
      startDate,
      reportDate,
      teamLead,
      teamMembers: teamMembers.split(',').map(m => m.trim()).filter(Boolean),
      investigatorPhone,
      region: 'Oromia',
      zone,
      woreda,
      kebele: kebele || 'Rural Locality',
      village: village || 'Local Pasture',
      lat,
      lng,
      gpsAccuracyMeters: gpsAccuracy,
      species,
      productionSystem,
      populationAtRisk: Number(populationAtRisk),
      numberExposed: Number(numberExposed),
      numberSick: Number(numberSick),
      numberDead: Number(numberDead),
      morbidityRate,
      mortalityRate,
      caseFatalityRate,
      clinicalObservations,
      epidemiologicalObservations,
      possibleSource,
      riskFactors: [
        sharedWaterPoint ? 'Shared Water Point' : '',
        recentAnimalMovement ? 'Recent Animal Movement' : '',
        contactWithOtherHerds ? 'Communal Grazing' : '',
        hasHumanExposure ? 'Potential Zoonotic Interface' : ''
      ].filter(Boolean),
      recentAnimalMovement,
      movementDetails,
      contactWithOtherHerds,
      vaccinationHistory: vaccinationHistory as any,
      previousOutbreakInPastYear: false,
      diseaseSpecificDetails: {
        ...diseaseDetails,
        diseaseKey
      },
      oneHealth: {
        id: `OH-${investigationId}`,
        investigationId,
        hasHumanCasesOrExposure: hasHumanExposure,
        humanSuspectedCount: Number(humanSuspectedCount),
        humanSymptomsDescription: humanSymptoms,
        phemNotified,
        wildlifeInteractionDetected: wildlifeInteraction,
        environmentalFactors: {
          sharedWaterPoint,
          recentFloodingOrHeavyRain: false,
          abattoirOrSlaughterNearby: false,
          unburiedCarcassPresent: false,
          highVectorFlyMosquitoDensity: false,
          notes: ''
        },
        foodChainRisk: {
          unpasteurizedMilkConsumed: unpasteurizedMilk,
          emergencySlaughterForMeat: emergencySlaughter,
          animalSoldAtMarketRecently: false
        },
        jointInterventionInitiated: jointIntervention,
        jointNotes
      },
      samples: samplesList.map((s, idx) => ({
        id: s.id || `SMP-${investigationId}-${idx + 1}`,
        investigationId,
        sampleCode: s.sampleCode || `SMP-${investigationId}-${idx + 1}`,
        species: s.species || species,
        sampleType: s.sampleType || 'Whole Blood (EDTA)',
        quantity: s.quantity || 1,
        collectionDate: s.collectionDate || new Date().toISOString().split('T')[0],
        woreda,
        kebele: kebele || 'Rural Locality',
        lat,
        lng,
        collectorName: s.collectorName || teamLead,
        clinicalIndication: s.clinicalIndication || `Sample for ${disease}`,
        preservationMethod: s.preservationMethod || 'Ice Packs (+4°C)',
        destinationLab: s.destinationLab || 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: s.transportStatus || 'Collected',
        syncStatus: 'pending_sync'
      })) as SampleRecord[],
      labResults: initialData?.labResults || [],
      responseActions: initialData?.responseActions || [],
      controlMeasuresAlreadyApplied: [
        'Isolation of affected animals',
        'Herd movement restriction'
      ],
      investigatorNotes,
      syncStatus: navigator.onLine ? 'synced' : 'pending_sync',
      lastModifiedTimestamp: Date.now()
    };

    const validation = validateFieldInvestigation(newInv);
    setValidationErrors(validation.errors);
    setValidationWarnings(validation.warnings);

    if (!validation.isValid) {
      soundEngine.playAlert();
      return;
    }

    soundEngine.playSuccess();
    onSave(newInv);
  };

  const steps = [
    { id: 1, label: 'Location & Admin' },
    { id: 2, label: 'Epidemiology' },
    { id: 3, label: 'Clinical (FAST)' },
    { id: 4, label: 'One Health' },
    { id: 5, label: 'Samples & Review' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-teal-700 dark:bg-teal-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
              <Stethoscope className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {initialData ? `Edit Investigation: ${initialData.investigationCode}` : 'Initiate New Field Outbreak Investigation'}
              </h2>
              <p className="text-xs text-teal-100/90">
                Hirna Regional Veterinary Laboratory • Field-to-Lab Surveillance Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-slate-50 dark:bg-slate-950/70 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer
                ${currentStep === s.id 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }
              `}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === s.id ? 'bg-white text-teal-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {s.id}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Validation Errors/Warnings Banner */}
        {validationErrors.length > 0 && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Please correct the following mandatory requirements:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* STEP 1: ADMIN & LOCATION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Investigation Title / Event Name *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Suspected FMD Outbreak in Dairy Herd"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Suspected or Primary Disease *
                  </label>
                  <select
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Foot-and-Mouth Disease (FMD)">Foot-and-Mouth Disease (FMD)</option>
                    <option value="Peste des Petits Ruminants (PPR)">Peste des Petits Ruminants (PPR)</option>
                    <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
                    <option value="Contagious Bovine Pleuropneumonia (CBPP)">Contagious Bovine Pleuropneumonia (CBPP)</option>
                    <option value="Anthrax">Anthrax (Peracute / Zoonotic)</option>
                    <option value="Newcastle Disease (ND)">Newcastle Disease (ND)</option>
                    <option value="Rabies">Rabies (Suspected Animal Bite)</option>
                    <option value="African Horse Sickness (AHS)">African Horse Sickness (AHS)</option>
                    <option value="Blackleg">Blackleg (Clostridial)</option>
                    <option value="Other / Undiagnosed Syndrome">Other / Undiagnosed Syndrome</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Outbreak Certainty</label>
                  <select
                    value={certainty}
                    onChange={(e) => setCertainty(e.target.value as OutbreakCertainty)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Suspected">Suspected (Clinical signs only)</option>
                    <option value="Probable">Probable (Epidemiologically linked)</option>
                    <option value="Laboratory Confirmed">Laboratory Confirmed</option>
                    <option value="Discarded / Negative">Discarded / Negative</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start / Onset Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Investigation Report Date *</label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Geographic Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Geographical Administrative Hierarchy & GPS</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={isCapturingGps}
                    className="flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isCapturingGps ? 'animate-spin' : ''}`} />
                    <span>{isCapturingGps ? 'Capturing GPS...' : 'Capture Device GPS'}</span>
                  </button>
                </div>

                {gpsError && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {gpsError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Zone</label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as 'E/H' | 'W/H')}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="E/H">East Hararghe (E/H)</option>
                      <option value="W/H">West Hararghe (W/H)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Woreda *</label>
                    <select
                      value={woreda}
                      onChange={(e) => handleWoredaChange(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {HARARGHE_WOREDAS
                        .filter(w => w.zone === zone)
                        .map(w => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Kebele</label>
                    <input
                      type="text"
                      value={kebele}
                      onChange={(e) => setKebele(e.target.value)}
                      placeholder="e.g. Bate"
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Village / Locality</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Ganda Gafarsa"
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">GPS Accuracy</label>
                    <div className="px-3 py-1.5 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                      <span>± {gpsAccuracy || 5.0} meters</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Investigator Team */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Lead (DVO / Officer) *</label>
                  <input
                    type="text"
                    value={teamLead}
                    onChange={(e) => setTeamLead(e.target.value)}
                    placeholder="e.g. Dr. Tadesse Bekele"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Investigator Phone *</label>
                  <input
                    type="text"
                    value={investigatorPhone}
                    onChange={(e) => setInvestigatorPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Members (AHEW / Scout)</label>
                  <input
                    type="text"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="e.g. Ahmedin Yusuf, Sr. Chaltu"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EPIDEMIOLOGY & POPULATION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Animal Species Affected *</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Cattle">Cattle (Bovine)</option>
                    <option value="Goats">Goats (Caprine)</option>
                    <option value="Sheep">Sheep (Ovine)</option>
                    <option value="Camels">Camels (Dromedary)</option>
                    <option value="Equines">Equines (Donkeys / Horses)</option>
                    <option value="Poultry">Poultry (Avian)</option>
                    <option value="Swine / Others">Swine / Multi-species</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Production System</label>
                  <select
                    value={productionSystem}
                    onChange={(e) => setProductionSystem(e.target.value as ProductionSystem)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Pastoral / Extensive">Pastoral / Extensive Rangeland</option>
                    <option value="Agro-Pastoral">Agro-Pastoral</option>
                    <option value="Sedentary Mixed Crop-Livestock">Sedentary Mixed Crop-Livestock</option>
                    <option value="Peri-Urban Intensive">Peri-Urban Intensive Dairy/Fattening</option>
                    <option value="Backyard / Smallholder">Backyard / Smallholder</option>
                  </select>
                </div>
              </div>

              {/* Quantitative Population Numbers & Auto Metrics */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Quantitative Herd Counts & Automated Rates
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Total Population at Risk</label>
                    <input
                      type="number"
                      min="1"
                      value={populationAtRisk}
                      onChange={(e) => setPopulationAtRisk(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Number Exposed</label>
                    <input
                      type="number"
                      min="0"
                      value={numberExposed}
                      onChange={(e) => setNumberExposed(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Number Sick (Cases) *</label>
                    <input
                      type="number"
                      min="0"
                      value={numberSick}
                      onChange={(e) => setNumberSick(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">Number Dead *</label>
                    <input
                      type="number"
                      min="0"
                      value={numberDead}
                      onChange={(e) => setNumberDead(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100 font-bold"
                    />
                  </div>
                </div>

                {/* Auto Calculated Indicators */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <p className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase">Attack Rate / Morbidity</p>
                    <p className="text-base font-black text-teal-800 dark:text-teal-200">{morbidityRate}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">Mortality Rate</p>
                    <p className="text-base font-black text-indigo-800 dark:text-indigo-200">{mortalityRate}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">Case Fatality Rate (CFR)</p>
                    <p className="text-base font-black text-rose-800 dark:text-rose-200">{caseFatalityRate}%</p>
                  </div>
                </div>
              </div>

              {/* Epidemiological Context */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Clinical Signs & Lesion Observations
                  </label>
                  <textarea
                    rows={2}
                    value={clinicalObservations}
                    onChange={(e) => setClinicalObservations(e.target.value)}
                    placeholder="Describe specific lesions, fever, discharges, respiratory signs..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Epidemiological Transmission Context & Origin
                  </label>
                  <textarea
                    rows={2}
                    value={epidemiologicalObservations}
                    onChange={(e) => setEpidemiologicalObservations(e.target.value)}
                    placeholder="Trace contact links, communal grazing, watering points, market origin..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={recentAnimalMovement}
                        onChange={(e) => setRecentAnimalMovement(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Recent Livestock Movement / Introduction</span>
                    </label>
                    {recentAnimalMovement && (
                      <input
                        type="text"
                        value={movementDetails}
                        onChange={(e) => setMovementDetails(e.target.value)}
                        placeholder="Origin market, transport date, animal counts..."
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Herd Vaccination Status
                    </label>
                    <select
                      value={vaccinationHistory}
                      onChange={(e) => setVaccinationHistory(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Not Vaccinated">Not Vaccinated (Naïve Herd)</option>
                      <option value="Partially Vaccinated">Partially Vaccinated (Adults only)</option>
                      <option value="Fully Vaccinated">Fully Vaccinated within 12 months</option>
                      <option value="Unknown">Unknown / Untraceable</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DISEASE-SPECIFIC CLINICAL ASSESSMENT (FAST INTEGRATION) */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 dark:text-teal-200">
                  <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Disease-Specific Clinical Protocol: {disease}</span>
                </div>
                {onOpenFastResource && (
                  <button
                    type="button"
                    onClick={() => onOpenFastResource(diseaseKey)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded-lg text-[11px] font-bold border border-teal-300 dark:border-teal-700 transition-all cursor-pointer"
                  >
                    <span>View FAST Disease Reference</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* FMD Form */}
              {diseaseKey === 'fmd' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Foot-and-Mouth Disease (FMD) Lesion Scorecard
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.fmdOralVesicles || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, fmdOralVesicles: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Oral mucosal vesicles / ruptured ulcers (Dental pad, tongue)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.fmdInterdigitalLesions || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, fmdInterdigitalLesions: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Interdigital cleft & coronary band lesions (Severe lameness)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.fmdTeatLesions || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, fmdTeatLesions: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Teat / udder vesicles (Drop in milk yield & mastitis)</span>
                    </label>

                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Salivation Severity</label>
                      <select
                        value={diseaseDetails.fmdSalivationSeverity || 'Profuse'}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, fmdSalivationSeverity: e.target.value as any }))}
                        className="w-full px-2 py-1 rounded text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="None">None</option>
                        <option value="Mild">Mild / Sticky saliva</option>
                        <option value="Profuse">Profuse ropy foamy salivation</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PPR Form */}
              {diseaseKey === 'ppr' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Peste des Petits Ruminants (PPR) Small Ruminant Signs
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.pprStomatitis || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, pprStomatitis: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Erosive necrotizing stomatitis with foul halitosis</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.pprOcularLesions || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, pprOcularLesions: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Purulent oculonasal crusting & glued eyelids</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.pprRespiratoryDistress || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, pprRespiratoryDistress: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Severe coughing, dyspnea with abdominal grunting</span>
                    </label>

                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Diarrhea Severity</label>
                      <select
                        value={diseaseDetails.pprDiarrheaSeverity || 'Watery'}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, pprDiarrheaSeverity: e.target.value as any }))}
                        className="w-full px-2 py-1 rounded text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="None">None</option>
                        <option value="Watery">Profuse watery diarrhea</option>
                        <option value="Bloody">Severe bloody / mucoid diarrhea</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* LSD Form */}
              {diseaseKey === 'lsd' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Lumpy Skin Disease (LSD) Capripoxvirus Assessment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Nodule Count Category</label>
                      <select
                        value={diseaseDetails.lsdNoduleCountCategory || '>50'}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, lsdNoduleCountCategory: e.target.value as any }))}
                        className="w-full px-2 py-1 rounded text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="<10">Mild (&lt;10 nodules)</option>
                        <option value="10-50">Moderate (10-50 nodules)</option>
                        <option value=">50">Severe (&gt;50 nodules)</option>
                        <option value="Generalized">Generalized full-body eruptive</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.lsdSitFastNecrosis || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, lsdSitFastNecrosis: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Inverted conical necrotic cores (&quot;Sit-fast&quot; scabs)</span>
                    </label>

                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Vector Burden (Stomoxys / Flies)</label>
                      <select
                        value={diseaseDetails.lsdVectorDensity || 'High'}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, lsdVectorDensity: e.target.value as any }))}
                        className="w-full px-2 py-1 rounded text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                      >
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High vector swarm</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Anthrax Form (Critical Biosafety Check) */}
              {diseaseKey === 'anthrax' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-xl border-2 border-rose-400 dark:border-rose-700 space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>STRICT BIOSAFETY LEVEL 3 PROTOCOL — ANTHRAX PERACUTE SUSPICION</span>
                  </div>

                  <p className="text-xs text-rose-900 dark:text-rose-100 font-medium">
                    ⚠️ DO NOT OPEN THE CARCASS. Exposure to atmospheric oxygen induces spore formation that persists in Hararghe soil for decades. Collect only peripheral blood smear from ear vein.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-800 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.anthraxSuddenDeath || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, anthraxSuddenDeath: e.target.checked }))}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>Peracute sudden death without prior noticeable illness</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-800 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.anthraxTarryDarkBloodOrifices || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, anthraxTarryDarkBloodOrifices: e.target.checked }))}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>Dark uncoagulated tarry blood exuding from natural orifices</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-rose-200 dark:border-rose-800 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.anthraxIncompleteRigorMortis || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, anthraxIncompleteRigorMortis: e.target.checked }))}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>Incomplete / absent rigor mortis with rapid post-mortem bloating</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.anthraxSafeBurialApplied || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, anthraxSafeBurialApplied: e.target.checked }))}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Deep burial (2m) with quicklime completed or scheduled</span>
                    </label>
                  </div>
                </div>
              )}

              {/* CBPP Form */}
              {diseaseKey === 'cbpp' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Contagious Bovine Pleuropneumonia (CBPP) Respiratory Checks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.cbppCoughOnExercise || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, cbppCoughOnExercise: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Painful moist cough provoked by exertion or cold morning air</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.cbppArchedBackNeckExtended || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, cbppArchedBackNeckExtended: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Arched back, elbows abducted, neck extended to ease breathing</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Newcastle Form */}
              {diseaseKey === 'newcastle' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Newcastle Disease (ND) Avian Flock Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.ndGreenishDiarrhea || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, ndGreenishDiarrhea: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Bright greenish-white watery diarrhea</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={diseaseDetails.ndTorticollisNervousSigns || false}
                        onChange={(e) => setDiseaseDetails(prev => ({ ...prev, ndTorticollisNervousSigns: e.target.checked }))}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Torticollis (twisted neck), paralysis, circling</span>
                    </label>
                  </div>
                </div>
              )}

              {/* General Other Syndrome */}
              {diseaseKey === 'other' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom Pathological Notes</label>
                  <textarea
                    rows={3}
                    value={diseaseDetails.customSymptoms || ''}
                    onChange={(e) => setDiseaseDetails(prev => ({ ...prev, customSymptoms: e.target.value }))}
                    placeholder="Enter detailed syndrome manifestations and differential diagnosis notes..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: ONE HEALTH INTERFACE */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                <HeartHandshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>One Health Cross-Sectoral Triangulation (Animal + Human + Wildlife + Environment)</span>
              </div>

              {/* Human Health Interface */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHumanExposure}
                    onChange={(e) => setHasHumanExposure(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Potential Human Exposure / Illness in Herd Handlers or Community</span>
                </label>

                {hasHumanExposure && (
                  <div className="pl-6 space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Suspected Human Cases / Exposed</label>
                        <input
                          type="number"
                          min="1"
                          value={humanSuspectedCount}
                          onChange={(e) => setHumanSuspectedCount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Human Symptoms Description</label>
                        <input
                          type="text"
                          value={humanSymptoms}
                          onChange={(e) => setHumanSymptoms(e.target.value)}
                          placeholder="e.g. Cutaneous ulcer / fever / respiratory"
                          className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={phemNotified}
                        onChange={(e) => setPhemNotified(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Public Health Emergency Management (PHEM) Woreda Focal Person Notified</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Environmental & Wildlife Risk Drivers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Environmental & Water Drivers</p>
                  
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sharedWaterPoint}
                      onChange={(e) => setSharedWaterPoint(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Shared communal water point with multiple herds</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unpasteurizedMilk}
                      onChange={(e) => setUnpasteurizedMilk(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Unpasteurized raw milk consumed by household</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emergencySlaughter}
                      onChange={(e) => setEmergencySlaughter(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Emergency slaughter / meat distributed locally</span>
                  </label>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Wildlife & Intersectoral Action</p>
                  
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wildlifeInteraction}
                      onChange={(e) => setWildlifeInteraction(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Wildlife / scavenger interaction observed nearby</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jointIntervention}
                      onChange={(e) => setJointIntervention(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Joint Vet-Health Rapid Response Team (RRT) Activated</span>
                  </label>

                  {jointIntervention && (
                    <input
                      type="text"
                      value={jointNotes}
                      onChange={(e) => setJointNotes(e.target.value)}
                      placeholder="Joint response team officers & actions..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SAMPLES & FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-5">
              {/* Sample Collection Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <TestTube2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Biological Samples Associated with Investigation ({samplesList.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSample}
                    className="flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sample</span>
                  </button>
                </div>

                {samplesList.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-3">
                    No samples logged yet. Click &quot;Add Sample&quot; to register blood, swabs, vesicular fluid, or biopsies.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {samplesList.map((sample, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                              {sample.sampleCode || `SMP-${idx + 1}`}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{sample.sampleType}</span>
                            <span className="text-slate-500">({sample.quantity || 1} units)</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Preservation: <span className="font-medium text-slate-700 dark:text-slate-300">{sample.preservationMethod}</span> • Dest: <span className="font-medium text-teal-700 dark:text-teal-300">{sample.destinationLab}</span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSample(idx)}
                          className="text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer self-end sm:self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Investigator Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Investigator Summary & Recommendations
                </label>
                <textarea
                  rows={3}
                  value={investigatorNotes}
                  onChange={(e) => setInvestigatorNotes(e.target.value)}
                  placeholder="Summarize key recommendations for ring vaccination, quarantine, or laboratory confirmation..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-teal-900 dark:text-teal-200">
                    Ready to Save Investigation to ADNIS
                  </p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300">
                    Will be stored locally on your device and synchronized when connected.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700">
                    {certainty}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Investigation</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
