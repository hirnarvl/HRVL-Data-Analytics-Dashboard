export type InvestigationStatus = 
  | 'Field Report' 
  | 'Preliminary Triage' 
  | 'Field Investigation Active' 
  | 'Samples Collected' 
  | 'Lab Testing Pending' 
  | 'Lab Confirmed' 
  | 'Lab Negative' 
  | 'Epidemiologist Validated' 
  | 'Contained & Response Active' 
  | 'Closed';

export type OutbreakCertainty = 'Suspected' | 'Probable' | 'Laboratory Confirmed' | 'Discarded / Negative';

export type ProductionSystem = 
  | 'Pastoral / Extensive' 
  | 'Agro-Pastoral' 
  | 'Sedentary Mixed Crop-Livestock' 
  | 'Peri-Urban Intensive' 
  | 'Commercial Dairy/Feedlot' 
  | 'Backyard / Smallholder';

export type UserRole = 
  | 'Field Investigator' 
  | 'Laboratory Analyst' 
  | 'Epidemiologist' 
  | 'Zonal Supervisor' 
  | 'System Administrator' 
  | 'Read-Only Viewer';

export type SyncStatus = 'synced' | 'pending_sync' | 'sync_error' | 'local_draft';

export interface DiseaseSpecificDetails {
  diseaseKey: 'fmd' | 'ppr' | 'lsd' | 'cbpp' | 'anthrax' | 'newcastle' | 'other';
  // FMD Specifics
  fmdLesionAgeDays?: number;
  fmdOralVesicles?: boolean;
  fmdInterdigitalLesions?: boolean;
  fmdTeatLesions?: boolean;
  fmdSalivationSeverity?: 'None' | 'Mild' | 'Profuse';
  fmdSuspectedSerotype?: 'O' | 'A' | 'SAT 1' | 'SAT 2' | 'Unknown';

  // PPR Specifics
  pprStomatitis?: boolean;
  pprNasalDischarge?: 'Serous' | 'Mucopurulent' | 'None';
  pprOcularLesions?: boolean;
  pprDiarrheaSeverity?: 'None' | 'Watery' | 'Bloody';
  pprRespiratoryDistress?: boolean;

  // LSD Specifics
  lsdNoduleDiameterCm?: number;
  lsdNoduleCountCategory?: '<10' | '10-50' | '>50' | 'Generalized';
  lsdSitFastNecrosis?: boolean;
  lsdEdemaLocation?: ('Brisket' | 'Limbs' | 'Dewlap' | 'Genitalia')[];
  lsdVectorDensity?: 'Low' | 'Moderate' | 'High';

  // CBPP Specifics
  cbppCoughOnExercise?: boolean;
  cbppPleuriticPain?: boolean;
  cbppRespiratoryRateHigh?: boolean;
  cbppArchedBackNeckExtended?: boolean;
  cbppNasalDischarge?: boolean;

  // Anthrax Specifics (Critical Biosafety)
  anthraxSuddenDeath?: boolean;
  anthraxTarryDarkBloodOrifices?: boolean;
  anthraxIncompleteRigorMortis?: boolean;
  anthraxRapidBloating?: boolean;
  anthraxCarcassOpened?: boolean; // WARNING FLAG
  anthraxSafeBurialApplied?: boolean;

  // Newcastle Specifics
  ndGreenishDiarrhea?: boolean;
  ndTorticollisNervousSigns?: boolean;
  ndFacialEdema?: boolean;
  ndFlockMortalityPercent?: number;

  // Custom symptoms for other diseases
  customSymptoms?: string;
}

export interface OneHealthFieldObservation {
  id: string;
  investigationId: string;
  hasHumanCasesOrExposure: boolean;
  humanSuspectedCount?: number;
  humanSymptomsDescription?: string;
  humanMedicalCareSought?: boolean;
  phemNotified?: boolean;
  phemContactPerson?: string;
  
  wildlifeInteractionDetected: boolean;
  wildlifeSpeciesObserved?: string[];
  wildlifeDeadFound?: boolean;

  environmentalFactors: {
    sharedWaterPoint: boolean;
    recentFloodingOrHeavyRain: boolean;
    abattoirOrSlaughterNearby: boolean;
    unburiedCarcassPresent: boolean;
    highVectorFlyMosquitoDensity: boolean;
    notes?: string;
  };

  foodChainRisk: {
    unpasteurizedMilkConsumed: boolean;
    emergencySlaughterForMeat: boolean;
    animalSoldAtMarketRecently: boolean;
    marketName?: string;
  };

  jointInterventionInitiated: boolean;
  jointNotes?: string;
}

export interface SampleRecord {
  id: string; // e.g. SMP-2026-00012
  investigationId: string;
  sampleCode: string;
  species: string;
  animalIdOrTag?: string;
  sampleType: 
    | 'Whole Blood (EDTA)' 
    | 'Serum' 
    | 'Vesicular Epithelium / Fluid' 
    | 'Nasal / Ocular Swab' 
    | 'Tissue Biopsy / Organ' 
    | 'Lymph Node Aspirate' 
    | 'Pleural Fluid' 
    | 'Milk' 
    | 'Fecal Swab' 
    | 'Skin Scab / Nodule' 
    | 'Soil / Environmental';
  quantity: number;
  collectionDate: string;
  collectionTime?: string;
  woreda: string;
  kebele: string;
  lat: number;
  lng: number;
  collectorName: string;
  collectorPhone?: string;
  clinicalIndication: string;
  preservationMethod: 'Ice Packs (+4°C)' | 'Liquid Nitrogen (-196°C)' | 'Frozen (-20°C)' | 'Viral Transport Medium (VTM)' | 'Formalin 10%' | 'Room Temp / Dry';
  destinationLab: 'HRVL (Hirna Regional Vet Lab)' | 'AHI Sebeta (National Ref Lab)' | 'Bedele Regional Lab' | 'District Vet Clinic Lab';
  transportStatus: 'Collected' | 'In Transit' | 'Received at Lab' | 'Rejected (Damaged/Cold-Chain Breach)' | 'Processed';
  labResultId?: string;
  syncStatus: SyncStatus;
  notes?: string;
}

export interface LabResultRecord {
  id: string; // e.g. LAB-2026-00045
  sampleId: string;
  investigationId: string;
  sampleCode: string;
  diseaseTested: string;
  testMethod: 
    | 'Real-Time RT-PCR' 
    | 'Conventional PCR' 
    | 'Antigen ELISA (Ag-ELISA)' 
    | 'Antibody 3ABC Competitive ELISA' 
    | 'Rapid Pen-Side Ag Test Strip' 
    | 'Direct Fluorescent Antibody (DFA)' 
    | 'Giemsa / Gram Stain Microscopy' 
    | 'Bacterial Culture & Biochemical' 
    | 'Rose Bengal Plate Test (RBPT)' 
    | 'Latex Agglutination';
  testingLab: string;
  receivedDate: string;
  testingDate: string;
  result: 'Positive' | 'Negative' | 'Inconclusive' | 'Pending';
  serotypeOrStrain?: string;
  ctValueOrTiter?: string;
  validationStatus: 'Draft' | 'Validated by Epidemiologist' | 'Rejected / Re-Test Required';
  validatedBy?: string;
  validationDate?: string;
  labComments: string;
  qualityControlPassed: boolean;
  syncStatus: SyncStatus;
}

export interface ResponseActionRecord {
  id: string;
  investigationId: string;
  date: string;
  actionType: 
    | 'Ring Vaccination Campaign' 
    | 'Quarantine & Movement Restriction' 
    | 'Carcass Deep Burial & Quicklime Disinfection' 
    | 'Market Closure' 
    | 'Vector Fogging & Dipping' 
    | 'Antibiotic / Supportive Treatment' 
    | 'Community Sensitization & PHEM Alert' 
    | 'One Health Joint RRT Deployment';
  status: 'Planned' | 'In Progress' | 'Completed';
  targetAnimalsCount?: number;
  achievedCount?: number;
  responsibleOfficer: string;
  notes: string;
}

export interface FieldInvestigation {
  id: string; // e.g. INV-2026-000001
  investigationCode: string;
  title: string;
  disease: string;
  certainty: OutbreakCertainty;
  status: InvestigationStatus;
  startDate: string;
  reportDate: string;
  
  // Investigation Team & Lead
  teamLead: string;
  teamMembers: string[];
  investigatorPhone: string;
  investigatorEmail?: string;

  // Geography
  region: string;
  zone: 'E/H' | 'W/H';
  woreda: string;
  kebele: string;
  village: string;
  lat: number;
  lng: number;
  gpsAccuracyMeters?: number;

  // Population at risk & impact
  species: string;
  productionSystem: ProductionSystem;
  populationAtRisk: number;
  numberExposed: number;
  numberSick: number;
  numberDead: number;
  morbidityRate: number; // calculated %
  mortalityRate: number; // calculated %
  caseFatalityRate: number; // calculated %

  // Clinical & Epidemiological Findings
  clinicalObservations: string;
  epidemiologicalObservations: string;
  possibleSource: string;
  riskFactors: string[];
  recentAnimalMovement: boolean;
  movementDetails?: string;
  contactWithOtherHerds: boolean;
  contactDetails?: string;

  // Vaccination & Past History
  vaccinationHistory: 'Fully Vaccinated' | 'Partially Vaccinated' | 'Not Vaccinated' | 'Unknown';
  vaccineDetails?: string;
  previousOutbreakInPastYear: boolean;

  // Disease-specific details
  diseaseSpecificDetails: DiseaseSpecificDetails;

  // One Health
  oneHealth?: OneHealthFieldObservation;

  // Samples & Lab
  samples: SampleRecord[];
  labResults: LabResultRecord[];

  // Response Actions
  responseActions: ResponseActionRecord[];

  // Control & Biosafety
  controlMeasuresAlreadyApplied: string[];
  investigatorNotes: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    caption?: string;
  }[];

  // Offline & Synchronization
  syncStatus: SyncStatus;
  lastModifiedTimestamp: number;
  isDemo?: boolean;
}
