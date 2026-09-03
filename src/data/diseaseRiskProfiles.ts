import { DiseaseRiskProfile } from '../types/riskMap';

export const DISEASE_RISK_PROFILES: Record<string, DiseaseRiskProfile> = {
  fmd: {
    id: 'fmd',
    code: 'FMD',
    name: 'Foot-and-Mouth Disease',
    aliases: ['fmd', 'foot-and-mouth', 'aphthae epizooticae', 'imiilla'],
    category: 'FAST / Transboundary',
    transmissionMechanisms: [
      'Direct contact with infected livestock (nasal secretions, saliva, milk, semen)',
      'Short-range aerosol / droplet transmission in dense herds',
      'Fomites (contaminated vehicles, feed, footwear, market equipment)',
      'Unrestricted livestock movement along trade highways'
    ],
    primaryHosts: ['Cattle', 'Sheep', 'Goats', 'Swine', 'Wildlife ruminants'],
    relevantVectors: ['None (primarily direct & aerosol contact, mechanical transmission via fomites)'],
    
    // WOAH Terrestrial Animal Health Code recommends a minimum 3 km Protection Zone and 10 km Surveillance Zone around infected establishments
    innerHighRiskRadiusMeters: 3000,
    innerZoneLabel: 'Protection / High-Transmission Zone (3 km)',
    outerSurveillanceRadiusMeters: 10000,
    outerZoneLabel: 'Surveillance / Movement Restriction Perimeter (10 km)',
    extendedPlanningRadiusMeters: 25000,
    extendedZoneLabel: 'Regional Trade Corridor Buffer (25 km)',
    
    windRelevance: 'Moderate',
    livestockMovementRelevance: 'Critical',
    seasonalityRelevance: 'Elevated during dry-season pastoral migrations and major religious festival livestock market peaks.',
    
    environmentalModifiers: [
      {
        factor: 'relative_humidity',
        label: 'High Relative Humidity (>60%)',
        thresholdOrCondition: 'RH >= 60%',
        epidemiologicalMechanism: 'Airborne FMD virus survival is significantly prolonged in humid air (>60% RH); viral droplets remain viable longer in aerosol plumes.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'temperature',
        label: 'Cool Ambient Temperature (<20°C)',
        thresholdOrCondition: 'Temp < 20°C',
        epidemiologicalMechanism: 'Cold/cool microclimates in highland sectors reduce viral thermal inactivation rate on fomites and pastures.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'wind_speed',
        label: 'Steady Moderate Wind (10–25 km/h)',
        thresholdOrCondition: 'Wind 10–25 km/h',
        epidemiologicalMechanism: 'Can carry infectious aerosol plumes downwind across adjacent communal grazing areas; high winds cause rapid dispersal and dilution.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      },
      {
        factor: 'livestock_movement',
        label: 'Active Market Transit Corridors',
        thresholdOrCondition: 'Major truck/trekking transit route',
        epidemiologicalMechanism: 'Cattle trekking across Woreda borders without quarantine is the dominant driver of FMD transmission in Hararghe.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-11-15',
    limitations: 'Fixed buffer zones are operational boundaries for veterinary quarantine and ring vaccination. Long-distance airborne transmission (>10 km) requires specific meteorological conditions (high humidity, cool temps, steady low-layer wind) and large infected pig/cattle concentrations.',
    references: [
      {
        id: 'ref-fmd-1',
        organizationOrAuthor: 'World Organisation for Animal Health (WOAH)',
        title: 'Terrestrial Animal Health Code: Chapter 8.8 — Infection with Foot and Mouth Disease Virus',
        year: 2023,
        sourceType: 'WOAH',
        url: 'https://www.woah.org/en/what-we-do/standards/codes-and-manuals/terrestrial-code-online-access/?id=169&L=1&htmfile=chapitre_fmd.htm',
        parameterSupported: '3 km Protection Zone and 10 km Surveillance Zone zoning definitions',
        notes: 'Official international standard for emergency containment and trade zoning.'
      },
      {
        id: 'ref-fmd-2',
        organizationOrAuthor: 'Food and Agriculture Organization (FAO) / EuFMD',
        title: 'Foot-and-Mouth Disease Vaccination and Post-Vaccination Monitoring Guidelines',
        year: 2020,
        sourceType: 'FAO',
        url: 'https://www.fao.org/eufmd',
        parameterSupported: 'Ring vaccination radius and epidemiological buffer monitoring',
        notes: 'Standard operating procedure for FAST transboundary disease containment.'
      },
      {
        id: 'ref-fmd-3',
        organizationOrAuthor: 'Donaldson, A. I. & Alexandersen, S.',
        title: 'Predicting the spread of foot and mouth disease by airborne virus',
        year: 2002,
        sourceType: 'Peer-Reviewed Journal',
        doiOrIdentifier: '10.20506/rst.21.3.1360',
        parameterSupported: 'Environmental modifiers: relative humidity >60% and thermal persistence',
        notes: 'Revue Scientifique et Technique (International Office of Epizootics).'
      }
    ]
  },

  ppr: {
    id: 'ppr',
    code: 'PPR',
    name: 'Peste des Petits Ruminants',
    aliases: ['ppr', 'peste des petits', 'goat plague', 'ovine morbillivirus'],
    category: 'FAST / Transboundary',
    transmissionMechanisms: [
      'Close direct contact with ocular/nasal discharges, saliva, and feces of infected small ruminants',
      'Short-range inhalation of viral droplets inside crowded night enclosures / pens',
      'Introduction of infected goats/sheep purchased from communal livestock markets',
      'Communal water points and shared grazing browse'
    ],
    primaryHosts: ['Goats (highly susceptible)', 'Sheep', 'Camels (subclinical/mild)', 'Wild ungulates'],
    relevantVectors: ['None (direct contact and droplet inhalation; virus is fragile in environment)'],
    
    innerHighRiskRadiusMeters: 3000,
    innerZoneLabel: 'Immediate Ring Vaccination Core (3 km)',
    outerSurveillanceRadiusMeters: 8000,
    outerZoneLabel: 'Surveillance & Small Ruminant Movement Ban (8 km)',
    extendedPlanningRadiusMeters: 20000,
    extendedZoneLabel: 'Woreda Pastoral Flock Buffer (20 km)',
    
    windRelevance: 'Low',
    livestockMovementRelevance: 'Critical',
    seasonalityRelevance: 'Peaks during cold/rainy spells (nutritional and thermal stress) and seasonal restocking cycles.',
    
    environmentalModifiers: [
      {
        factor: 'animal_density',
        label: 'High Small Ruminant Flock Density',
        thresholdOrCondition: 'High flock congregation',
        epidemiologicalMechanism: 'Night confinement in unventilated enclosures drastically accelerates morbillivirus droplet transmission.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'livestock_movement',
        label: 'Inter-Market Goat/Sheep Trade',
        thresholdOrCondition: 'Market day stock movement',
        epidemiologicalMechanism: 'Asymptomatic incubating animals sold in village markets introduce the virus directly into naive pastoral herds.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'temperature',
        label: 'Thermal / Nutritional Stress',
        thresholdOrCondition: 'Cold nights or prolonged drought',
        epidemiologicalMechanism: 'Compromised respiratory mucosal immunity increases host susceptibility to severe clinical disease and secondary pneumonia.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-10-20',
    limitations: 'PPR virus is relatively labile in sunlight and ambient heat. Risk zones represent flock movement and contact networks rather than airborne dispersal distance.',
    references: [
      {
        id: 'ref-ppr-1',
        organizationOrAuthor: 'FAO & WOAH',
        title: 'Global Strategy for the Control and Eradication of PPR',
        year: 2015,
        sourceType: 'FAO',
        url: 'https://www.fao.org/3/a-i4460e.pdf',
        parameterSupported: 'Vaccination ring radius (3–5 km) and epidemiological surveillance strategy',
        notes: 'Targeting global eradication of PPR by 2030.'
      },
      {
        id: 'ref-ppr-2',
        organizationOrAuthor: 'Ethiopian Ministry of Agriculture (MoA)',
        title: 'National PPR Control and Progressive Eradication Strategy for Ethiopia',
        year: 2019,
        sourceType: 'National MoA',
        parameterSupported: 'Targeted woreda vaccination zones and livestock market quarantine protocols',
        notes: 'Official MoA Veterinary Directorate guidelines.'
      }
    ]
  },

  lsd: {
    id: 'lsd',
    code: 'LSD',
    name: 'Lumpy Skin Disease',
    aliases: ['lsd', 'lumpy skin', 'capripoxvirus', 'nodular exanthema'],
    category: 'FAST / Transboundary',
    transmissionMechanisms: [
      'Mechanical transmission by biting hematophagous arthropods (Stomoxys calcitrans, Tabanids, Biomyia, Culicoides)',
      'Tick vectors (Rhipicephalus appendiculatus, Amblyomma hebraeum)',
      'Direct contact (minor route, via infected saliva and shared water troughs)',
      'Iatrogenic transmission via contaminated injection needles during mass treatments'
    ],
    primaryHosts: ['Cattle (all breeds; exotic and cross-breeds highly susceptible)', 'Water buffaloes'],
    relevantVectors: ['Biting flies (Stomoxys, Tabanids)', 'Hard ticks (Amblyomma, Rhipicephalus)', 'Mosquitoes (Aedes, Culex)'],
    
    innerHighRiskRadiusMeters: 5000,
    innerZoneLabel: 'Vector Control & Ring Vaccination Core (5 km)',
    outerSurveillanceRadiusMeters: 20000,
    outerZoneLabel: 'Vector Flight & Surveillance Perimeter (20 km)',
    extendedPlanningRadiusMeters: 35000,
    extendedZoneLabel: 'Ecological Vector Corridor Zone (35 km)',
    
    windRelevance: 'Moderate',
    livestockMovementRelevance: 'High',
    seasonalityRelevance: 'Strong correlation with post-rainy seasons (Kiremt/Belg) when biting insect populations explode.',
    
    environmentalModifiers: [
      {
        factor: 'rainfall',
        label: 'High Cumulative Rainfall (>50 mm/month)',
        thresholdOrCondition: 'Rainfall >= 50 mm',
        epidemiologicalMechanism: 'Standing water pools provide ideal breeding habitats for biting fly and mosquito vectors, accelerating transmission.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'relative_humidity',
        label: 'Elevated Relative Humidity (>70%)',
        thresholdOrCondition: 'RH >= 70%',
        epidemiologicalMechanism: 'Prolongs adult biting fly survival and foraging activity in lowland and midland river valleys.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      },
      {
        factor: 'wind_speed',
        label: 'Low-to-Moderate Wind (5–15 km/h)',
        thresholdOrCondition: 'Wind 5–15 km/h',
        epidemiologicalMechanism: 'Assists passive wind-borne dispersal of biting insects over distances up to 10–20 km across valleys.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-12-01',
    limitations: 'Transmission distance is mediated by vector flight range and passive wind carriage of biting flies. Buffer zones must encompass vector breeding habitats along river basins.',
    references: [
      {
        id: 'ref-lsd-1',
        organizationOrAuthor: 'European Food Safety Authority (EFSA)',
        title: 'Lumpy skin disease: scientific opinion on epidemiological parameters and control measures',
        year: 2017,
        sourceType: 'Peer-Reviewed Journal',
        doiOrIdentifier: '10.2903/j.efsa.2017.4773',
        parameterSupported: '20 km restriction and surveillance zone around infected herds',
        notes: 'EFSA Journal 2017;15(4):4773.'
      },
      {
        id: 'ref-lsd-2',
        organizationOrAuthor: 'Tuppurainen, E. S. M., Venter, E. H., & Oura, C. A. L.',
        title: 'Review: Transmission of lumpy skin disease virus by hematophagous arthropods',
        year: 2015,
        sourceType: 'Peer-Reviewed Journal',
        doiOrIdentifier: '10.1111/tbed.12384',
        parameterSupported: 'Mechanical transmission by Stomoxys and Amblyomma tick persistence',
        notes: 'Transboundary and Emerging Diseases.'
      }
    ]
  },

  cbpp: {
    id: 'cbpp',
    code: 'CBPP',
    name: 'Contagious Bovine Pleuropneumonia',
    aliases: ['cbpp', 'contagious bovine', 'mycoplasma mycoides', 'bovine pleuropneumonia'],
    category: 'FAST / Transboundary',
    transmissionMechanisms: [
      'Inhalation of infective droplets exhaled by clinically diseased or asymptomatic carrier ("lunger") cattle',
      'Requires close and repeated contact between animals in herds, night kraals, or watering points',
      'Movement of carrier cattle with sequestered lung lesions'
    ],
    primaryHosts: ['Cattle (Bos taurus and Bos indicus)', 'Zebu cattle'],
    relevantVectors: ['None (strictly direct respiratory droplet transmission)'],
    
    innerHighRiskRadiusMeters: 5000,
    innerZoneLabel: 'Immediate Herd Quarantine & Clinical Screening (5 km)',
    outerSurveillanceRadiusMeters: 15000,
    outerZoneLabel: 'Active Serological & Slaughterhouse Surveillance Zone (15 km)',
    extendedPlanningRadiusMeters: 30000,
    extendedZoneLabel: 'Pastoral Movement Control Zone (30 km)',
    
    windRelevance: 'Low',
    livestockMovementRelevance: 'Critical',
    seasonalityRelevance: 'Higher incidence reported during dry seasons when herds concentrate around limited water points.',
    
    environmentalModifiers: [
      {
        factor: 'livestock_movement',
        label: 'Cattle Movement from Pastoral Lowlands',
        thresholdOrCondition: 'Trekking along trade routes',
        epidemiologicalMechanism: 'Stress of long-distance trekking can cause breakdown of chronic lung sequestra in carrier animals, shedding massive mycoplasma doses.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'animal_density',
        label: 'Crowding at Communal Water Wells (Ellas)',
        thresholdOrCondition: 'Shared watering troughs',
        epidemiologicalMechanism: 'Close head-to-head respiratory droplet exchange during watering.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-09-10',
    limitations: 'Mycoplasma mycoides is extremely delicate in the environment and does not survive long outside the host. Transmission is restricted to direct respiratory contact within a few meters, but long-range spread occurs via trade.',
    references: [
      {
        id: 'ref-cbpp-1',
        organizationOrAuthor: 'Food and Agriculture Organization (FAO)',
        title: 'Contagious bovine pleuropneumonia (CBPP) manual — Preparation of contingency plans',
        year: 2002,
        sourceType: 'FAO',
        url: 'https://www.fao.org/3/Y4140E/Y4140E00.htm',
        parameterSupported: 'Quarantine buffer and movement control radii for CBPP containment',
        notes: 'FAO Animal Health Manual No. 14.'
      },
      {
        id: 'ref-cbpp-2',
        organizationOrAuthor: 'WOAH',
        title: 'Terrestrial Animal Health Code: Chapter 11.5 — Contagious Bovine Pleuropneumonia',
        year: 2023,
        sourceType: 'WOAH',
        parameterSupported: 'Containment zone requirements and slaughterhouse surveillance parameters',
        notes: 'International validation standard.'
      }
    ]
  },

  anthrax: {
    id: 'anthrax',
    code: 'ANTHRAX',
    name: 'Anthrax (Bacillus anthracis)',
    aliases: ['anthrax', 'bacillus anthracis', 'splenic fever', 'aba-sanga', 'lethal spore'],
    category: 'Zoonotic / One Health',
    transmissionMechanisms: [
      'Ingestion of highly resistant bacterial endospores from contaminated soil and pastures',
      'Opening/butchering carcasses of animals that died of anthrax (leads to sporulation and human cutaneous/gastrointestinal infection)',
      'Mechanical dissemination by scavenging birds (vultures), wild carnivores, and blowflies (Chrysomya)',
      'Water run-off washing spores into low-lying depressions'
    ],
    primaryHosts: ['Cattle', 'Sheep', 'Goats', 'Camels', 'Equines', 'Humans (Zoonotic)'],
    relevantVectors: ['Blowflies (Chrysomya albiceps) and biting tabanid flies as mechanical carriers'],
    
    innerHighRiskRadiusMeters: 2000,
    innerZoneLabel: 'Carcass Disposal & Immediate Grazing Ban (2 km)',
    outerSurveillanceRadiusMeters: 6000,
    outerZoneLabel: 'Ring Vaccination & Human Health Alert Perimeter (6 km)',
    extendedPlanningRadiusMeters: 15000,
    extendedZoneLabel: 'Soil Spore Contamination Ecological Zone (15 km)',
    
    windRelevance: 'Low',
    livestockMovementRelevance: 'Moderate',
    seasonalityRelevance: 'Strong bimodal peak: following heavy rainfall events after prolonged drought (spores concentrated in topsoil depressions).',
    
    environmentalModifiers: [
      {
        factor: 'rainfall',
        label: 'Post-Drought Heavy Rainfall / Runoff',
        thresholdOrCondition: 'Heavy rain after dry spell',
        epidemiologicalMechanism: 'Rainwater runoff washes dormant spores from burial sites into low-lying watering holes and fresh grass shoots.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'temperature',
        label: 'High Ambient Temperature (>28°C)',
        thresholdOrCondition: 'Temp > 28°C',
        epidemiologicalMechanism: 'Warm temperatures combined with alkaline soil conditions favor spore survival and seasonal grazing exposure.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2026-01-10',
    limitations: 'Anthrax is not contagious between live animals; it is an environmental spore-borne pathogen. Strict bans on opening carcasses and rapid vaccination within 2–5 km are decisive.',
    references: [
      {
        id: 'ref-anth-1',
        organizationOrAuthor: 'World Health Organization (WHO), FAO, & WOAH',
        title: 'Anthrax in humans and animals — 4th edition',
        year: 2008,
        sourceType: 'WHO',
        url: 'https://www.who.int/publications/i/item/9789241547536',
        parameterSupported: 'Carcass management, 2 km immediate quarantine, and vaccination protocols',
        notes: 'Definitive tripartite technical guideline on anthrax control and human safety.'
      },
      {
        id: 'ref-anth-2',
        organizationOrAuthor: 'Hugh-Jones, M. & Blackburn, J.',
        title: 'The ecology of Bacillus anthracis',
        year: 2009,
        sourceType: 'Peer-Reviewed Journal',
        doiOrIdentifier: '10.1016/j.micinf.2009.04.008',
        parameterSupported: 'Soil spore persistence, environmental pH, and precipitation trigger mechanisms',
        notes: 'Microbes and Infection 11(5): 568-573.'
      }
    ]
  },

  newcastle: {
    id: 'newcastle',
    code: 'ND',
    name: 'Newcastle Disease',
    aliases: ['newcastle', 'nd', 'avian paramyxovirus', 'fenqil', 'fengil'],
    category: 'Endemic / Production',
    transmissionMechanisms: [
      'Direct contact with respiratory secretions and droppings of infected poultry',
      'Contaminated feed, water, chicken cages, footwear, and poultry traders',
      'Airborne transmission over short distances in intensive chicken houses'
    ],
    primaryHosts: ['Chickens (Gallus gallus)', 'Turkeys', 'Pigeons', 'Wild birds'],
    relevantVectors: ['Mechanical fomites (cages, buyers) and scavenging rodents'],
    
    innerHighRiskRadiusMeters: 1500,
    innerZoneLabel: 'Poultry Quarantine & Emergency Vaccination Core (1.5 km)',
    outerSurveillanceRadiusMeters: 5000,
    outerZoneLabel: 'Live Bird Market & Movement Ban Zone (5 km)',
    extendedPlanningRadiusMeters: 12000,
    extendedZoneLabel: 'Woreda Village Flock Buffer (12 km)',
    
    windRelevance: 'Low',
    livestockMovementRelevance: 'High',
    seasonalityRelevance: 'Surges during dry windy months and holiday poultry marketing periods.',
    
    environmentalModifiers: [
      {
        factor: 'livestock_movement',
        label: 'Live Bird Market Trading',
        thresholdOrCondition: 'Unregulated village chicken trade',
        epidemiologicalMechanism: 'Traders carrying chickens in open crates spread virulent velogenic NDV between woredas rapidly.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-08-14',
    limitations: 'Velogenic Newcastle Disease produces up to 100% mortality in unvaccinated backyard flocks. Ring vaccination using thermostable I-2 vaccine in a 1.5–3 km radius is primary countermeasure.',
    references: [
      {
        id: 'ref-nd-1',
        organizationOrAuthor: 'World Organisation for Animal Health (WOAH)',
        title: 'Manual of Diagnostic Tests and Vaccines for Terrestrial Animals: Newcastle Disease',
        year: 2021,
        sourceType: 'WOAH',
        url: 'https://www.woah.org',
        parameterSupported: '1.5 km protection zone and biosecurity containment radius',
        notes: 'WOAH Standards.'
      }
    ]
  },

  rabies: {
    id: 'rabies',
    code: 'RABIES',
    name: 'Rabies (Lyssavirus)',
    aliases: ['rabies', 'lyssavirus', 'hydrophobia', 'dhukuba seree'],
    category: 'Zoonotic / One Health',
    transmissionMechanisms: [
      'Bite inoculation or scratch with saliva of infected domestic dogs or wild carnivores (jackals, hyenas)',
      'Direct mucosal contact with rabid animal saliva'
    ],
    primaryHosts: ['Domestic Dogs (primary reservoir in Hararghe)', 'Cats', 'Livestock (dead-end hosts: Cattle, Equines)', 'Humans'],
    relevantVectors: ['None (direct bite inoculation)'],
    
    innerHighRiskRadiusMeters: 2000,
    innerZoneLabel: 'Mass Dog Vaccination & Active Case Search (2 km)',
    outerSurveillanceRadiusMeters: 5000,
    outerZoneLabel: 'Canine Confinement & Community One Health Alert (5 km)',
    extendedPlanningRadiusMeters: 10000,
    extendedZoneLabel: 'Woreda Canine Ecology Buffer (10 km)',
    
    windRelevance: 'Negligible',
    livestockMovementRelevance: 'Moderate',
    seasonalityRelevance: 'Correlates with canine breeding and roaming seasons.',
    
    environmentalModifiers: [
      {
        factor: 'animal_density',
        label: 'High Free-Roaming Canine Density',
        thresholdOrCondition: 'Urban / Peri-urban market towns',
        epidemiologicalMechanism: 'Higher contact rates between stray dogs around abattoir waste and market refuse increase bite transmissions.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2026-02-01',
    limitations: 'Rabies virus has zero environmental persistence outside the host. Spatial buffers correspond to domestic dog roaming territories (typical median home range 1–3 km in rural/peri-urban Ethiopia).',
    references: [
      {
        id: 'ref-rab-1',
        organizationOrAuthor: 'World Health Organization (WHO)',
        title: 'WHO Expert Consultation on Rabies: Third Report (WHO Technical Report Series 1012)',
        year: 2018,
        sourceType: 'WHO',
        url: 'https://www.who.int/publications/i/item/9789241210126',
        parameterSupported: '70% canine vaccination coverage in 2–3 km radius to break transmission',
        notes: 'Zero by 30 Global Strategic Plan.'
      }
    ]
  },

  ahs: {
    id: 'ahs',
    code: 'AHS',
    name: 'African Horse Sickness',
    aliases: ['ahs', 'african horse sickness', 'orbivirus', 'equine plague'],
    category: 'FAST / Transboundary',
    transmissionMechanisms: [
      'Biological transmission by biting Culicoides midges (Culicoides imicola, Culicoides bolitinos)',
      'Mechanical transmission occasionally by mosquitoes'
    ],
    primaryHosts: ['Horses (severe, up to 90% mortality)', 'Mules (moderate)', 'Donkeys (mild/subclinical)', 'Zebras (natural reservoir)'],
    relevantVectors: ['Culicoides biting midges (Culicoides imicola, C. bolitinos)'],
    
    innerHighRiskRadiusMeters: 5000,
    innerZoneLabel: 'Vector Protection & Equine Stabling Core (5 km)',
    outerSurveillanceRadiusMeters: 20000,
    outerZoneLabel: 'Surveillance & Equine Movement Ban (20 km)',
    extendedPlanningRadiusMeters: 40000,
    extendedZoneLabel: 'Culicoides Dispersal Zone (40 km)',
    
    windRelevance: 'Moderate',
    livestockMovementRelevance: 'High',
    seasonalityRelevance: 'Warm, humid weather after seasonal rains when Culicoides midge populations peak.',
    
    environmentalModifiers: [
      {
        factor: 'rainfall',
        label: 'Post-Rainfall Vector Breeding',
        thresholdOrCondition: 'Recent rainfall >30 mm',
        epidemiologicalMechanism: 'Moist organic mud and manure provide breeding substrate for Culicoides larvae.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'wind_speed',
        label: 'Gentle Breezes (<15 km/h)',
        thresholdOrCondition: 'Wind < 15 km/h',
        epidemiologicalMechanism: 'Midges can be carried passively downwind over 10–30 km in humid evening air.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2025-10-05',
    limitations: 'Culicoides midges feed primarily at dusk and dawn. Vector protection (stabling equines from dusk till dawn, insect repellents) and ring vaccination are core countermeasures.',
    references: [
      {
        id: 'ref-ahs-1',
        organizationOrAuthor: 'World Organisation for Animal Health (WOAH)',
        title: 'Terrestrial Animal Health Code: Chapter 12.1 — Infection with African Horse Sickness Virus',
        year: 2023,
        sourceType: 'WOAH',
        parameterSupported: '20 km protection zone and 50 km surveillance perimeter around outbreaks',
        notes: 'WOAH Terrestrial Code.'
      }
    ]
  },

  rvf: {
    id: 'rvf',
    code: 'RVF',
    name: 'Rift Valley Fever',
    aliases: ['rvf', 'rift valley fever', 'phlebovirus', 'enzootic hepatitis'],
    category: 'Zoonotic / One Health',
    transmissionMechanisms: [
      'Bites of floodwater Aedes mosquitoes (transovarial reservoirs) and secondary Culex mosquitoes',
      'Direct contact with infected animal blood, body fluids, aborted fetuses, and placental tissues (major route for human infection)',
      'Consumption of unpasteurized milk from infected livestock'
    ],
    primaryHosts: ['Sheep (severe abortion storms)', 'Goats', 'Cattle', 'Camels', 'Humans (Zoonotic - Hemorrhagic/Encephalitic)'],
    relevantVectors: ['Aedes mosquitoes (primary reservoir/vector)', 'Culex mosquitoes (amplification vector)'],
    
    innerHighRiskRadiusMeters: 5000,
    innerZoneLabel: 'Biosafety, Vector Abatement & Abortion Management (5 km)',
    outerSurveillanceRadiusMeters: 15000,
    outerZoneLabel: 'One Health Human-Animal Surveillance Ring (15 km)',
    extendedPlanningRadiusMeters: 30000,
    extendedZoneLabel: 'Floodplain / Wetland Ecological Buffer (30 km)',
    
    windRelevance: 'Low',
    livestockMovementRelevance: 'High',
    seasonalityRelevance: 'Strictly associated with abnormally heavy, persistent rainfall and flooding of dambo/depression wetlands (El Niño events).',
    
    environmentalModifiers: [
      {
        factor: 'rainfall',
        label: 'Extreme Cumulative Rainfall / Flooding',
        thresholdOrCondition: 'Flooding / Wetland inundation',
        epidemiologicalMechanism: 'Flooding triggers mass hatching of infected dormant Aedes eggs in dry ground depressions.',
        riskImpact: 'High Increase',
        scientificConfidence: 'High (Documented)'
      },
      {
        factor: 'temperature',
        label: 'High Temperature (25–35°C)',
        thresholdOrCondition: 'Temp 25-35°C',
        epidemiologicalMechanism: 'Shortens the extrinsic incubation period of RVF virus inside the mosquito vector.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'High (Documented)'
      }
    ],
    
    evidenceLevel: 'WOAH / FAO Standard Guideline',
    lastReviewedDate: '2026-01-18',
    limitations: 'Never vaccinate animals with live attenuated vaccine during an active outbreak due to risk of teratogenic abortion. Personal protective equipment (PPE) is mandatory for veterinary staff handling aborted livestock fetuses.',
    references: [
      {
        id: 'ref-rvf-1',
        organizationOrAuthor: 'FAO, WHO & WOAH',
        title: 'Rift Valley Fever: Surveillance, Prevention and Control (FAO Animal Production and Health Manual No. 17)',
        year: 2013,
        sourceType: 'FAO',
        url: 'https://www.fao.org/3/i3592e/i3592e.pdf',
        parameterSupported: 'Early warning indicators, vector breeding wetland zoning, and biosafety protocols',
        notes: 'Tripartite guidelines.'
      }
    ]
  },

  blackleg: {
    id: 'blackleg',
    code: 'BLACKLEG',
    name: 'Blackleg (Clostridium chauvoei)',
    aliases: ['blackleg', 'clostridium chauvoei', 'symptomatic anthrax', 'gororsa'],
    category: 'Endemic / Production',
    transmissionMechanisms: [
      'Ingestion of bacterial spores from contaminated soil or pasture',
      'Spores cross intestinal mucosa and lodge in heavy skeletal muscles, germinating following blunt trauma or bruising'
    ],
    primaryHosts: ['Young Cattle (6 months to 2 years, particularly well-nourished animals)', 'Sheep (usually wound infections)'],
    relevantVectors: ['None (endogenous bacterial infection from environmental spores)'],
    
    innerHighRiskRadiusMeters: 2000,
    innerZoneLabel: 'Immediate Herd Vaccination & Pen Disinfection (2 km)',
    outerSurveillanceRadiusMeters: 5000,
    outerZoneLabel: 'Surveillance & Pasture Contamination Zone (5 km)',
    extendedPlanningRadiusMeters: 10000,
    extendedZoneLabel: 'Woreda Soil Enzootic Zone (10 km)',
    
    windRelevance: 'Negligible',
    livestockMovementRelevance: 'Low',
    seasonalityRelevance: 'Frequently occurs following excavation, soil disruption, or heavy summer rainfall that exposes buried spores.',
    
    environmentalModifiers: [
      {
        factor: 'rainfall',
        label: 'Soil Erosion / Flooding',
        thresholdOrCondition: 'Heavy rain washing topsoil',
        epidemiologicalMechanism: 'Exposes dormant clostridial spores on pasture surfaces.',
        riskImpact: 'Moderate Increase',
        scientificConfidence: 'Moderate (Empirical)'
      }
    ],
    
    evidenceLevel: 'Empirical Field Evidence',
    lastReviewedDate: '2025-07-22',
    limitations: 'Blackleg is non-contagious between animals. Prevention relies on annual prophylactic polyvalent clostridial vaccination.',
    references: [
      {
        id: 'ref-bl-1',
        organizationOrAuthor: 'Merck Veterinary Manual / WOAH Reference Experts',
        title: 'Blackleg in Animals (Clostridial Myonecrosis)',
        year: 2022,
        sourceType: 'Technical Guidance',
        parameterSupported: 'Herd vaccination buffer and management of enzootic pastures',
        notes: 'Veterinary clinical reference standard.'
      }
    ]
  }
};

/**
 * Helper to get the best matching disease profile from a disease name string
 */
export function getDiseaseRiskProfile(diseaseName: string): DiseaseRiskProfile {
  if (!diseaseName) return DISEASE_RISK_PROFILES.fmd;
  const lower = diseaseName.toLowerCase();
  
  for (const [key, profile] of Object.entries(DISEASE_RISK_PROFILES)) {
    if (profile.aliases.some(alias => lower.includes(alias))) {
      return profile;
    }
  }
  
  // Default fallback to FMD profile with clear configuration note
  return {
    ...DISEASE_RISK_PROFILES.fmd,
    name: diseaseName,
    code: 'CUSTOM',
    evidenceLevel: 'Provisional Configuration',
    limitations: `Configured provisional profile for ${diseaseName}. Parameters should be reviewed by an authorized veterinary epidemiologist based on local transmission mechanisms.`
  };
}
