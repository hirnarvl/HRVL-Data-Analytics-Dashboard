import { 
  FieldInvestigation, 
  SampleRecord, 
  LabResultRecord, 
  ResponseActionRecord,
  SyncStatus,
  OutbreakCertainty,
  InvestigationStatus
} from '../types/fieldToolkit';

const FIELD_INVESTIGATIONS_STORAGE_KEY = 'adnis_field_investigations_v2';
const SAMPLES_STORAGE_KEY = 'adnis_samples_v2';
const LAB_RESULTS_STORAGE_KEY = 'adnis_lab_results_v2';

// Baseline initial Hararghe Field Investigations (realistic, isolated data)
export const INITIAL_FIELD_INVESTIGATIONS: FieldInvestigation[] = [
  {
    id: 'INV-2026-000001',
    investigationCode: 'INV-2026-000001',
    title: 'Suspected Foot-and-Mouth Disease in Dairy & Trading Herds',
    disease: 'Foot-and-Mouth Disease (FMD)',
    certainty: 'Laboratory Confirmed',
    status: 'Lab Confirmed',
    startDate: '2026-08-14',
    reportDate: '2026-08-15',
    teamLead: 'Dr. Tadesse Bekele (DVO)',
    teamMembers: ['Ahmedin Yusuf (AHEW)', 'Sr. Chaltu Gemechu (Field Officer)'],
    investigatorPhone: '+251 91 145 8892',
    region: 'Oromia',
    zone: 'E/H',
    woreda: 'Haramaya',
    kebele: 'Bate / Lake Haramaya Shore',
    village: 'Ganda Gafarsa',
    lat: 9.3985,
    lng: 42.0125,
    gpsAccuracyMeters: 4.2,
    species: 'Cattle',
    productionSystem: 'Peri-Urban Intensive',
    populationAtRisk: 350,
    numberExposed: 120,
    numberSick: 42,
    numberDead: 2,
    morbidityRate: 35.0,
    mortalityRate: 1.67,
    caseFatalityRate: 4.76,
    clinicalObservations: 'Severe salivation with ropy foam, oral mucosal ulcerations on dental pad and tongue, interdigital erosions causing severe lameness, drop in daily milk yield by 75%.',
    epidemiologicalObservations: 'Outbreak emerged 4 days following introduction of 8 bull calves purchased at Harar livestock market. Herds share communal grazing and water trough at Lake Haramaya perimeter.',
    possibleSource: 'Livestock trade movement from Harar transit route without quarantine.',
    riskFactors: ['Communal watering point', 'Unrestricted trade cattle mixing', 'High herd density'],
    recentAnimalMovement: true,
    movementDetails: '8 bullocks introduced from Harar market on 2026-08-10.',
    contactWithOtherHerds: true,
    contactDetails: 'Communal afternoon grazing with 5 neighboring smallholder herds.',
    vaccinationHistory: 'Not Vaccinated',
    vaccineDetails: 'No FMD vaccination in past 18 months.',
    previousOutbreakInPastYear: true,
    diseaseSpecificDetails: {
      diseaseKey: 'fmd',
      fmdLesionAgeDays: 4,
      fmdOralVesicles: true,
      fmdInterdigitalLesions: true,
      fmdTeatLesions: false,
      fmdSalivationSeverity: 'Profuse',
      fmdSuspectedSerotype: 'O'
    },
    oneHealth: {
      id: 'OH-2026-001',
      investigationId: 'INV-2026-000001',
      hasHumanCasesOrExposure: false,
      humanSuspectedCount: 0,
      wildlifeInteractionDetected: false,
      environmentalFactors: {
        sharedWaterPoint: true,
        recentFloodingOrHeavyRain: false,
        abattoirOrSlaughterNearby: true,
        unburiedCarcassPresent: false,
        highVectorFlyMosquitoDensity: false,
        notes: 'Water runoff enters communal irrigation ditch.'
      },
      foodChainRisk: {
        unpasteurizedMilkConsumed: true,
        emergencySlaughterForMeat: false,
        animalSoldAtMarketRecently: false
      },
      jointInterventionInitiated: true,
      jointNotes: 'Dairy cooperative advised to boil all milk before consumption and isolate sick animals.'
    },
    samples: [
      {
        id: 'SMP-2026-000001',
        investigationId: 'INV-2026-000001',
        sampleCode: 'SMP-2026-000001',
        species: 'Cattle',
        animalIdOrTag: 'TAG-ET-0941',
        sampleType: 'Vesicular Epithelium / Fluid',
        quantity: 2,
        collectionDate: '2026-08-15',
        woreda: 'Haramaya',
        kebele: 'Bate',
        lat: 9.3985,
        lng: 42.0125,
        collectorName: 'Dr. Tadesse Bekele',
        clinicalIndication: 'Fresh unruptured oral vesicle epithelium collected in 50% PBS-Glycerol buffer.',
        preservationMethod: 'Viral Transport Medium (VTM)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'Processed',
        syncStatus: 'synced',
        labResultId: 'LAB-2026-000001'
      },
      {
        id: 'SMP-2026-000002',
        investigationId: 'INV-2026-000001',
        sampleCode: 'SMP-2026-000002',
        species: 'Cattle',
        animalIdOrTag: 'TAG-ET-0945',
        sampleType: 'Serum',
        quantity: 5,
        collectionDate: '2026-08-15',
        woreda: 'Haramaya',
        kebele: 'Bate',
        lat: 9.3985,
        lng: 42.0125,
        collectorName: 'Dr. Tadesse Bekele',
        clinicalIndication: 'Paired acute clotted blood for 3ABC NSP ELISA serology.',
        preservationMethod: 'Ice Packs (+4°C)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'Processed',
        syncStatus: 'synced',
        labResultId: 'LAB-2026-000002'
      }
    ],
    labResults: [
      {
        id: 'LAB-2026-000001',
        sampleId: 'SMP-2026-000001',
        investigationId: 'INV-2026-000001',
        sampleCode: 'SMP-2026-000001',
        diseaseTested: 'Foot-and-Mouth Disease (FMD)',
        testMethod: 'Real-Time RT-PCR',
        testingLab: 'Hirna Regional Veterinary Laboratory (HRVL)',
        receivedDate: '2026-08-16',
        testingDate: '2026-08-17',
        result: 'Positive',
        serotypeOrStrain: 'FMDV Serotype O (EA-3 topotype match)',
        ctValueOrTiter: 'Ct = 21.4',
        validationStatus: 'Validated by Epidemiologist',
        validatedBy: 'Dr. Kassahun Tolera (Chief Epidemiologist)',
        validationDate: '2026-08-18',
        labComments: 'Strong positive amplification in 3D genomic region. Aliquot forwarded to AHI Sebeta for VP1 sequencing.',
        qualityControlPassed: true,
        syncStatus: 'synced'
      }
    ],
    responseActions: [
      {
        id: 'ACT-2026-001',
        investigationId: 'INV-2026-000001',
        date: '2026-08-18',
        actionType: 'Quarantine & Movement Restriction',
        status: 'In Progress',
        targetAnimalsCount: 350,
        achievedCount: 350,
        responsibleOfficer: 'Haramaya Livestock Resource Office',
        notes: 'Strict isolation of affected herd and temporary suspension of live sales at Bate market.'
      },
      {
        id: 'ACT-2026-002',
        investigationId: 'INV-2026-000001',
        date: '2026-08-19',
        actionType: 'Ring Vaccination Campaign',
        status: 'Planned',
        targetAnimalsCount: 2000,
        achievedCount: 850,
        responsibleOfficer: 'HRVL Outbreak Response Team',
        notes: 'Quadrivalent (O, A, SAT2) emergency ring vaccination in 3km perimeter.'
      }
    ],
    controlMeasuresAlreadyApplied: [
      'Infected herd quarantine on farm',
      'Daily antiseptic oral wash with 2% sodium carbonate',
      'Bate local milk collector notification'
    ],
    investigatorNotes: 'Immediate ring vaccination recommended for neighboring Bate and Kuro kebeles.',
    syncStatus: 'synced',
    lastModifiedTimestamp: Date.now() - 86400000 * 3,
    isDemo: false
  },
  {
    id: 'INV-2026-000002',
    investigationCode: 'INV-2026-000002',
    title: 'Acute High-Mortality Respiratory Outbreak in Small Ruminants (PPR)',
    disease: 'Peste des Petits Ruminants (PPR)',
    certainty: 'Laboratory Confirmed',
    status: 'Epidemiologist Validated',
    startDate: '2026-08-20',
    reportDate: '2026-08-21',
    teamLead: 'Dr. Fikadu Hunde (Senior Field Epi)',
    teamMembers: ['Abdi Kedir (Animal Health Tech)'],
    investigatorPhone: '+251 92 388 4110',
    region: 'Oromia',
    zone: 'W/H',
    woreda: 'Chiro',
    kebele: 'Arba Bordode border corridor',
    village: 'Oda Bultum pastoral zone',
    lat: 9.0782,
    lng: 40.8654,
    gpsAccuracyMeters: 5.1,
    species: 'Goats',
    productionSystem: 'Pastoral / Extensive',
    populationAtRisk: 620,
    numberExposed: 300,
    numberSick: 88,
    numberDead: 24,
    morbidityRate: 29.33,
    mortalityRate: 8.0,
    caseFatalityRate: 27.27,
    clinicalObservations: 'Severe pyrexia (40.8°C), erosive necrotizing stomatitis, crusty oculonasal discharges encrusting nostrils, profuse foul-smelling watery diarrhea, dyspnea with grunting.',
    epidemiologicalObservations: 'Pastoral migratory goat flock returning from Afar border rangelands. Mixing at seasonal watering wells with local village sheep and goats.',
    possibleSource: 'Pastoral transhumance contact in drought grazing reserves.',
    riskFactors: ['Drought congregation', 'High small ruminant density', 'Unvaccinated young stock (4-12 months)'],
    recentAnimalMovement: true,
    movementDetails: 'Returned from 40km transhumance trek 7 days prior to symptom onset.',
    contactWithOtherHerds: true,
    contactDetails: 'Communal deep-well watering in Arba Bordode sector.',
    vaccinationHistory: 'Partially Vaccinated',
    vaccineDetails: 'Adults vaccinated 2 years ago; 2026 kids unvaccinated.',
    previousOutbreakInPastYear: false,
    diseaseSpecificDetails: {
      diseaseKey: 'ppr',
      pprStomatitis: true,
      pprNasalDischarge: 'Mucopurulent',
      pprOcularLesions: true,
      pprDiarrheaSeverity: 'Watery',
      pprRespiratoryDistress: true
    },
    oneHealth: {
      id: 'OH-2026-002',
      investigationId: 'INV-2026-000002',
      hasHumanCasesOrExposure: false,
      wildlifeInteractionDetected: true,
      wildlifeSpeciesObserved: ['Wild gazelles observed sharing browse'],
      environmentalFactors: {
        sharedWaterPoint: true,
        recentFloodingOrHeavyRain: false,
        abattoirOrSlaughterNearby: false,
        unburiedCarcassPresent: true,
        highVectorFlyMosquitoDensity: false,
        notes: 'Several dead goat carcasses dumped in dry riverbed.'
      },
      foodChainRisk: {
        unpasteurizedMilkConsumed: true,
        emergencySlaughterForMeat: true,
        animalSoldAtMarketRecently: false
      },
      jointInterventionInitiated: true,
      jointNotes: 'Ordered immediate safe deep burial of carcases with quicklime to prevent scavenger feeding.'
    },
    samples: [
      {
        id: 'SMP-2026-000003',
        investigationId: 'INV-2026-000002',
        sampleCode: 'SMP-2026-000003',
        species: 'Goats',
        animalIdOrTag: 'GT-W-019',
        sampleType: 'Nasal / Ocular Swab',
        quantity: 4,
        collectionDate: '2026-08-21',
        woreda: 'Chiro',
        kebele: 'Arba Bordode',
        lat: 9.0782,
        lng: 40.8654,
        collectorName: 'Dr. Fikadu Hunde',
        clinicalIndication: 'Conjunctival and oral swabs in VTM from febrile kids with erosive stomatitis.',
        preservationMethod: 'Viral Transport Medium (VTM)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'Processed',
        syncStatus: 'synced',
        labResultId: 'LAB-2026-000003'
      }
    ],
    labResults: [
      {
        id: 'LAB-2026-000003',
        sampleId: 'SMP-2026-000003',
        investigationId: 'INV-2026-000002',
        sampleCode: 'SMP-2026-000003',
        diseaseTested: 'Peste des Petits Ruminants (PPR)',
        testMethod: 'Antigen ELISA (Ag-ELISA)',
        testingLab: 'Hirna Regional Veterinary Laboratory (HRVL)',
        receivedDate: '2026-08-22',
        testingDate: '2026-08-22',
        result: 'Positive',
        ctValueOrTiter: 'OD Ratio = 3.42 (Cutoff 0.3)',
        validationStatus: 'Validated by Epidemiologist',
        validatedBy: 'Dr. Kassahun Tolera',
        validationDate: '2026-08-23',
        labComments: 'Confirmed PPRV antigen. Rapid response ring vaccination recommended.',
        qualityControlPassed: true,
        syncStatus: 'synced'
      }
    ],
    responseActions: [
      {
        id: 'ACT-2026-003',
        investigationId: 'INV-2026-000002',
        date: '2026-08-23',
        actionType: 'Carcass Deep Burial & Quicklime Disinfection',
        status: 'Completed',
        targetAnimalsCount: 24,
        achievedCount: 24,
        responsibleOfficer: 'Woreda RRT Team',
        notes: '24 goat carcasses buried 2 meters deep with lime application.'
      },
      {
        id: 'ACT-2026-004',
        investigationId: 'INV-2026-000002',
        date: '2026-08-24',
        actionType: 'Ring Vaccination Campaign',
        status: 'In Progress',
        targetAnimalsCount: 5000,
        achievedCount: 3200,
        responsibleOfficer: 'Chiro Animal Health Office',
        notes: 'PPR Homologous vaccine administered across 4 surrounding kebeles.'
      }
    ],
    controlMeasuresAlreadyApplied: [
      'Carcass disposal in lime pits',
      'Flock isolation in dry enclosures',
      'Broad-spectrum oxytetracycline supportive therapy to prevent secondary pasteurellosis'
    ],
    investigatorNotes: 'High priority alert issued to West Hararghe Zonal Livestock Bureau.',
    syncStatus: 'synced',
    lastModifiedTimestamp: Date.now() - 86400000 * 2,
    isDemo: false
  },
  {
    id: 'INV-2026-000003',
    investigationCode: 'INV-2026-000003',
    title: 'Nodular Skin Eruptions and Edema in Indigenous Zebu Herds (LSD)',
    disease: 'Lumpy Skin Disease (LSD)',
    certainty: 'Probable',
    status: 'Field Investigation Active',
    startDate: '2026-08-28',
    reportDate: '2026-08-29',
    teamLead: 'Dr. Muktar Aliyi (Field Epi)',
    teamMembers: ['Nigatu Debebe (AHEW)'],
    investigatorPhone: '+251 93 512 7709',
    region: 'Oromia',
    zone: 'E/H',
    woreda: 'Dadar',
    kebele: 'Kobo Highland Valley',
    village: 'Qeerroo Ganda',
    lat: 9.3241,
    lng: 41.4428,
    gpsAccuracyMeters: 3.8,
    species: 'Cattle',
    productionSystem: 'Sedentary Mixed Crop-Livestock',
    populationAtRisk: 280,
    numberExposed: 95,
    numberSick: 22,
    numberDead: 1,
    morbidityRate: 23.16,
    mortalityRate: 1.05,
    caseFatalityRate: 4.55,
    clinicalObservations: 'Multiple circumscribed 2-5cm firm intradermal nodules covering neck, trunk, and perineum; severe bilateral brisket and hock edema; enlarged prescapular lymph nodes.',
    epidemiologicalObservations: 'Surge in Stomoxys biting flies and mosquitoes following recent heavy rains in the Kobo valley basin. Local oxen used for communal land ploughing.',
    possibleSource: 'Mechanical transmission by hematophagous insect vectors.',
    riskFactors: ['High fly/vector density', 'Swampy valley grazing', 'Communal draft animal exchange'],
    recentAnimalMovement: false,
    contactWithOtherHerds: true,
    contactDetails: 'Communal draft oxen rotation between 12 farm plots.',
    vaccinationHistory: 'Not Vaccinated',
    vaccineDetails: 'No Neethling strain LSD vaccine received.',
    previousOutbreakInPastYear: false,
    diseaseSpecificDetails: {
      diseaseKey: 'lsd',
      lsdNoduleDiameterCm: 3.5,
      lsdNoduleCountCategory: '>50',
      lsdSitFastNecrosis: true,
      lsdEdemaLocation: ['Brisket', 'Limbs'],
      lsdVectorDensity: 'High'
    },
    oneHealth: {
      id: 'OH-2026-003',
      investigationId: 'INV-2026-000003',
      hasHumanCasesOrExposure: false,
      wildlifeInteractionDetected: false,
      environmentalFactors: {
        sharedWaterPoint: true,
        recentFloodingOrHeavyRain: true,
        abattoirOrSlaughterNearby: false,
        unburiedCarcassPresent: false,
        highVectorFlyMosquitoDensity: true,
        notes: 'Valley depression holds standing rainwater promoting rapid Stomoxys vector proliferation.'
      },
      foodChainRisk: {
        unpasteurizedMilkConsumed: true,
        emergencySlaughterForMeat: false,
        animalSoldAtMarketRecently: false
      },
      jointInterventionInitiated: false
    },
    samples: [
      {
        id: 'SMP-2026-000004',
        investigationId: 'INV-2026-000003',
        sampleCode: 'SMP-2026-000004',
        species: 'Cattle',
        animalIdOrTag: 'OX-D-401',
        sampleType: 'Skin Scab / Nodule',
        quantity: 3,
        collectionDate: '2026-08-29',
        woreda: 'Dadar',
        kebele: 'Kobo',
        lat: 9.3241,
        lng: 41.4428,
        collectorName: 'Dr. Muktar Aliyi',
        clinicalIndication: 'Skin nodule biopsy core & sit-fast scabs preserved on dry ice.',
        preservationMethod: 'Ice Packs (+4°C)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'Received at Lab',
        syncStatus: 'synced'
      }
    ],
    labResults: [],
    responseActions: [
      {
        id: 'ACT-2026-005',
        investigationId: 'INV-2026-000003',
        date: '2026-08-30',
        actionType: 'Vector Fogging & Dipping',
        status: 'In Progress',
        targetAnimalsCount: 280,
        achievedCount: 150,
        responsibleOfficer: 'Dadar DVO Extension Team',
        notes: 'Pour-on cypermethrin vector repellent applied to cattle herds.'
      }
    ],
    controlMeasuresAlreadyApplied: [
      'Topical antiseptic on open necrotic sit-fast lesions',
      'Pour-on deltamethrin vector control',
      'Cessation of communal draft oxen sharing'
    ],
    investigatorNotes: 'Lab testing pending at HRVL. Suspected LSD Capripoxvirus.',
    syncStatus: 'synced',
    lastModifiedTimestamp: Date.now() - 3600000 * 12,
    isDemo: false
  },
  {
    id: 'INV-2026-000004',
    investigationCode: 'INV-2026-000004',
    title: 'Suspected Zoonotic Sudden Death Event (Anthrax Investigation)',
    disease: 'Anthrax',
    certainty: 'Suspected',
    status: 'Preliminary Triage',
    startDate: '2026-08-31',
    reportDate: '2026-09-01',
    teamLead: 'Dr. Yohannes Girma (Rapid Response Lead)',
    teamMembers: ['Sr. Fatuma Idris (PHEM Health Extension)', 'Belayneh Zeleke (DVO)'],
    investigatorPhone: '+251 91 299 0044',
    region: 'Oromia',
    zone: 'W/H',
    woreda: 'Habro',
    kebele: 'Gelemso Lowland Pasture',
    village: 'Ganda Bilisummaa',
    lat: 8.8105,
    lng: 40.5284,
    gpsAccuracyMeters: 3.2,
    species: 'Cattle',
    productionSystem: 'Agro-Pastoral',
    populationAtRisk: 190,
    numberExposed: 45,
    numberSick: 4,
    numberDead: 3,
    morbidityRate: 8.89,
    mortalityRate: 6.67,
    caseFatalityRate: 75.0,
    clinicalObservations: 'Peracute sudden death without prior noticeable signs in 3 adult bullocks. Dark uncoagulated tarry blood exuding from rectum and nostrils. Total lack of rigor mortis with rapid post-mortem bloating.',
    epidemiologicalObservations: 'Occurred on historic flood-plain pasture where soil was excavated for road construction during previous week. Spores likely unearthed from deep soil layers.',
    possibleSource: 'Soil excavation disturbance in endemic Anthrax spore burial zone.',
    riskFactors: ['Excavated pasture soil', 'Unvaccinated herd', 'Scavenger bird activity nearby'],
    recentAnimalMovement: false,
    contactWithOtherHerds: false,
    vaccinationHistory: 'Not Vaccinated',
    vaccineDetails: 'No Sterne strain live spore vaccination within 2 years.',
    previousOutbreakInPastYear: false,
    diseaseSpecificDetails: {
      diseaseKey: 'anthrax',
      anthraxSuddenDeath: true,
      anthraxTarryDarkBloodOrifices: true,
      anthraxIncompleteRigorMortis: true,
      anthraxRapidBloating: true,
      anthraxCarcassOpened: false, // SAFE - strict adherence to SOP
      anthraxSafeBurialApplied: true
    },
    oneHealth: {
      id: 'OH-2026-004',
      investigationId: 'INV-2026-000004',
      hasHumanCasesOrExposure: true,
      humanSuspectedCount: 2,
      humanSymptomsDescription: 'Two farm workers report cutaneous pruritic papules on forearms following carcass handling before burial. Referred to Gelemso Primary Hospital.',
      humanMedicalCareSought: true,
      phemNotified: true,
      phemContactPerson: 'Dr. Aman (Habro Woreda PHEM Officer)',
      wildlifeInteractionDetected: true,
      wildlifeSpeciesObserved: ['Vultures and feral dogs attempted to access site before burial'],
      environmentalFactors: {
        sharedWaterPoint: false,
        recentFloodingOrHeavyRain: false,
        abattoirOrSlaughterNearby: false,
        unburiedCarcassPresent: false,
        highVectorFlyMosquitoDensity: false,
        notes: 'Pasture quarantined and fenced with thorn bushes.'
      },
      foodChainRisk: {
        unpasteurizedMilkConsumed: false,
        emergencySlaughterForMeat: false,
        animalSoldAtMarketRecently: false
      },
      jointInterventionInitiated: true,
      jointNotes: 'Joint Veterinary-PHEM Rapid Response Team deployed immediately. Carcasses buried with 150kg quicklime.'
    },
    samples: [
      {
        id: 'SMP-2026-000005',
        investigationId: 'INV-2026-000004',
        sampleCode: 'SMP-2026-000005',
        species: 'Cattle',
        animalIdOrTag: 'CARCASS-HABRO-01',
        sampleType: 'Whole Blood (EDTA)',
        quantity: 2,
        collectionDate: '2026-09-01',
        woreda: 'Habro',
        kebele: 'Gelemso',
        lat: 8.8105,
        lng: 40.5284,
        collectorName: 'Dr. Yohannes Girma',
        clinicalIndication: 'Peripheral ear-vein blood smear & EDTA aspiration without opening carcass (Strict BSL-3 Safety Protocol).',
        preservationMethod: 'Ice Packs (+4°C)',
        destinationLab: 'HRVL (Hirna Regional Vet Lab)',
        transportStatus: 'In Transit',
        syncStatus: 'synced'
      }
    ],
    labResults: [],
    responseActions: [
      {
        id: 'ACT-2026-006',
        investigationId: 'INV-2026-000004',
        date: '2026-09-01',
        actionType: 'Carcass Deep Burial & Quicklime Disinfection',
        status: 'Completed',
        targetAnimalsCount: 3,
        achievedCount: 3,
        responsibleOfficer: 'Joint Vet & PHEM Team',
        notes: 'Strict deep burial under 2.5 meters soil with lime cover and thorn bush fencing.'
      },
      {
        id: 'ACT-2026-007',
        investigationId: 'INV-2026-000004',
        date: '2026-09-01',
        actionType: 'Community Sensitization & PHEM Alert',
        status: 'In Progress',
        targetAnimalsCount: 190,
        achievedCount: 190,
        responsibleOfficer: 'Habro District Health Office',
        notes: 'Community warned against touching or opening any dead animals; prophylactic penicillin provided to exposed handlers.'
      }
    ],
    controlMeasuresAlreadyApplied: [
      'STRICT BAN ON CARCASS OPENING',
      'Immediate deep burial in 2.5m pit covered with quicklime',
      'PHEM cross-notification for human cutaneous anthrax surveillance'
    ],
    investigatorNotes: 'CRITICAL ZOONOTIC ALERT: Ear vein smear sent to HRVL for polychrome methylene blue (M\'Fadyean) capsule staining.',
    syncStatus: 'synced',
    lastModifiedTimestamp: Date.now() - 1800000,
    isDemo: false
  }
];

// Helper to load all investigations
export function loadFieldInvestigations(): FieldInvestigation[] {
  try {
    const raw = localStorage.getItem(FIELD_INVESTIGATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[FieldToolkit Storage] Failed to parse investigations:', err);
  }
  return INITIAL_FIELD_INVESTIGATIONS;
}

// Helper to save all investigations
export function saveFieldInvestigations(investigations: FieldInvestigation[]): boolean {
  try {
    localStorage.setItem(FIELD_INVESTIGATIONS_STORAGE_KEY, JSON.stringify(investigations));
    return true;
  } catch (err) {
    console.error('[FieldToolkit Storage] Failed to save investigations:', err);
    return false;
  }
}

// Offline sync helper functions
export function getPendingSyncCount(): number {
  try {
    const invs = loadFieldInvestigations();
    let count = 0;
    invs.forEach(inv => {
      if (inv.syncStatus === 'pending_sync' || inv.syncStatus === 'local_draft') count++;
      inv.samples?.forEach(s => {
        if (s.syncStatus === 'pending_sync' || s.syncStatus === 'local_draft') count++;
      });
      inv.labResults?.forEach(l => {
        if (l.syncStatus === 'pending_sync' || l.syncStatus === 'local_draft') count++;
      });
    });
    return count;
  } catch {
    return 0;
  }
}

export async function syncOfflineDrafts(): Promise<{ success: boolean; syncedCount: number }> {
  try {
    const invs = loadFieldInvestigations();
    let syncedCount = 0;
    const updated = invs.map(inv => {
      let invUpdated = false;
      let newSyncStatus = inv.syncStatus;
      if (inv.syncStatus === 'pending_sync' || inv.syncStatus === 'local_draft') {
        newSyncStatus = 'synced';
        syncedCount++;
        invUpdated = true;
      }

      const updatedSamples = inv.samples?.map(s => {
        if (s.syncStatus === 'pending_sync' || s.syncStatus === 'local_draft') {
          syncedCount++;
          return { ...s, syncStatus: 'synced' as const };
        }
        return s;
      });

      const updatedLabResults = inv.labResults?.map(l => {
        if (l.syncStatus === 'pending_sync' || l.syncStatus === 'local_draft') {
          syncedCount++;
          return { ...l, syncStatus: 'synced' as const };
        }
        return l;
      });

      return {
        ...inv,
        syncStatus: newSyncStatus,
        samples: updatedSamples,
        labResults: updatedLabResults,
        lastSyncedTimestamp: Date.now()
      };
    });

    saveFieldInvestigations(updated);
    return { success: true, syncedCount };
  } catch (err) {
    console.error('[FieldToolkit Sync Error]:', err);
    return { success: false, syncedCount: 0 };
  }
}

// Generate new Unique ID
export function generateInvestigationId(existing: FieldInvestigation[]): string {
  const currentYear = new Date().getFullYear();
  const maxNum = existing.reduce((max, inv) => {
    const match = inv.investigationCode?.match(/INV-(\d{4})-(\d+)/);
    if (match && parseInt(match[1], 10) === currentYear) {
      const num = parseInt(match[2], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  const nextNum = (maxNum + 1).toString().padStart(6, '0');
  return `INV-${currentYear}-${nextNum}`;
}

export function generateSampleId(existingInvestigations: FieldInvestigation[]): string {
  const currentYear = new Date().getFullYear();
  let maxNum = 0;
  existingInvestigations.forEach(inv => {
    inv.samples?.forEach(s => {
      const match = s.sampleCode?.match(/SMP-(\d{4})-(\d+)/);
      if (match && parseInt(match[1], 10) === currentYear) {
        const num = parseInt(match[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
  });
  const nextNum = (maxNum + 1).toString().padStart(6, '0');
  return `SMP-${currentYear}-${nextNum}`;
}

export function generateLabResultId(existingInvestigations: FieldInvestigation[]): string {
  const currentYear = new Date().getFullYear();
  let maxNum = 0;
  existingInvestigations.forEach(inv => {
    inv.labResults?.forEach(l => {
      const match = l.id?.match(/LAB-(\d{4})-(\d+)/);
      if (match && parseInt(match[1], 10) === currentYear) {
        const num = parseInt(match[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
  });
  const nextNum = (maxNum + 1).toString().padStart(6, '0');
  return `LAB-${currentYear}-${nextNum}`;
}

// Validation rules
export interface FieldValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFieldInvestigation(inv: Partial<FieldInvestigation>): FieldValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!inv.title || inv.title.trim().length < 5) {
    errors.push('Investigation title is required (minimum 5 characters).');
  }
  if (!inv.disease) {
    errors.push('Suspected or identified disease is required.');
  }
  if (!inv.woreda) {
    errors.push('Woreda selection is mandatory.');
  }
  if (!inv.zone) {
    errors.push('Zone (East Hararghe or West Hararghe) is required.');
  }
  if (!inv.teamLead || inv.teamLead.trim().length < 3) {
    errors.push('Investigation team lead name is required.');
  }

  // Population logic checks
  const pop = Number(inv.populationAtRisk || 0);
  const exposed = Number(inv.numberExposed || 0);
  const sick = Number(inv.numberSick || 0);
  const dead = Number(inv.numberDead || 0);

  if (exposed > pop && pop > 0) {
    errors.push(`Exposed animals (${exposed}) cannot exceed total population at risk (${pop}).`);
  }
  if (sick > exposed && exposed > 0) {
    errors.push(`Sick animals (${sick}) cannot exceed number of exposed animals (${exposed}).`);
  }
  if (dead > (sick + 5) && sick > 0) {
    warnings.push(`Dead animals (${dead}) exceeds logged sick cases (${sick}). Verify peracute mortality or sudden death.`);
  }

  // GPS checks
  if (inv.lat === undefined || inv.lng === undefined || inv.lat === 0 || inv.lng === 0) {
    warnings.push('GPS coordinates are missing. Capture coordinates using device location if present.');
  } else if (inv.lat < 3 || inv.lat > 15 || inv.lng < 33 || inv.lng > 48) {
    errors.push(`GPS Coordinates (${inv.lat}, ${inv.lng}) fall outside Ethiopia geographical boundary.`);
  }

  // Anthrax special biosafety validation
  if (inv.disease?.toLowerCase().includes('anthrax')) {
    if (inv.diseaseSpecificDetails?.anthraxCarcassOpened) {
      errors.push('CRITICAL BIOSAFETY VIOLATION: Opening an Anthrax carcass causes spore formation and extreme environmental contamination.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
