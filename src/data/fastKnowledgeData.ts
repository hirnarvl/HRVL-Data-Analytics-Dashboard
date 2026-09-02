import {
  FastDiseaseKnowledge,
  FastResource,
  FastFieldTool,
  FastLabDiagnosticMatrix,
  FastOneHealthInterface,
  FastTrainingCourse,
} from '../types/fast';

export const fastDiseasesKnowledge: FastDiseaseKnowledge[] = [
  {
    id: 'fmd',
    name: 'Foot-and-Mouth Disease',
    acronym: 'FMD',
    group: 'Vesicular',
    etiologicalAgent: 'Aphthovirus (Picornaviridae family) — Serotypes O, A, SAT 1, SAT 2 historically prevalent in East Africa / Ethiopia',
    primaryHosts: ['Cattle', 'Sheep', 'Goats', 'Swine', 'Buffalo'],
    secondaryHosts: ['Camels (refractory/mild)', 'Wildlife ungulates (African buffalo)'],
    importance: {
      global: 'Globally ranked as the most economically devastating transboundary livestock disease affecting cloven-hoofed animals.',
      ethiopianContext: 'Endemic across pastoral and mixed crop-livestock farming systems in Ethiopia (including East & West Hararghe). Significant barrier to live animal and beef export to Middle Eastern markets.',
      economicImpact: 'Severe milk yield drop (up to 80%), draught power loss in oxen, abortion in pregnant cows, high mortality in young calves (myocarditis / "tiger heart").',
    },
    epidemiology: {
      transmission: [
        'Direct contact with infected animals (respiratory aerosols, saliva, vesicular fluid, milk, semen)',
        'Indirect transmission via contaminated fomites (vehicles, boots, market pens, feed)',
        'Windborne aerosol spread over moderate distances under humid, cool climatic conditions',
        'Ingestion of untreated swill containing infected animal products'
      ],
      incubationPeriod: '2 to 14 days (typically 2 to 5 days in intensive herds)',
      morbidityMortality: 'Morbidity up to 100% in naive herds; Adult mortality < 5%; Young calf mortality can exceed 20–50% due to acute myocarditis.',
      seasonality: 'Peaks during dry-season livestock migration for pasture/water, religious festival livestock markets, and cross-border trade movements.',
    },
    clinicalSigns: {
      general: ['High fever (40–41°C)', 'Severe depression and anorexia', 'Sudden drop in lactation'],
      acute: ['Excessive, ropy salivation and smacking of lips', 'Shifting lameness and reluctance to stand or walk', 'Treading of feet'],
      pathognomonic: [
        'Vesicles (blisters) on dental pad, tongue, gums, nostrils, muzzle',
        'Interdigital and coronary band vesicular erosions and sloughing of hooves',
        'Teat and udder lesions leading to severe secondary mastitis',
        'Young stock: Heart lesions (tiger heart appearance on necropsy)'
      ],
      differentialDiagnosis: [
        'Swine Vesicular Disease (SVD)',
        'Vesicular Stomatitis (VS)',
        'Bovine Viral Diarrhea / Mucosal Disease (BVD/MD)',
        'Malignant Catarrhal Fever (MCF)',
        'Lumpy Skin Disease (oral lesions)'
      ],
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Any cloven-hoofed animal with sudden lameness, ropy salivation, and oral/hoof vesicles or erosions.',
        confirmed: 'A suspected case with laboratory confirmation of FMD virus antigen/RNA (ELISA, RT-PCR) or serotype-specific virus isolation.'
      },
      samplingRequirements: [
        'Unruptured or freshly ruptured vesicular epithelium (>1g) placed in 50% phosphate-buffered glycerol (pH 7.2–7.6)',
        'Vesicular fluid aspirated with sterile needle into viral transport media',
        'Oesophageal-pharyngeal fluid (probang sample) for carrier animals',
        'Serum in plain red-top tubes for Non-Structural Protein (NSP) ELISA'
      ],
      notificationPeriod: 'Immediate (within 24 hours of field suspicion to District Veterinary Officer and Regional Diagnostic Lab)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Rapid Antigen Detection Pen-side Strip (Ag-LFD)'],
      referenceTests: ['Solid-Phase Competition ELISA (SPCE)', 'NSP ELISA (3ABC)', 'Real-Time RT-PCR', 'Virus Neutralization Test (VNT)'],
      sampleTypes: ['Vesicular epithelium', 'Vesicular fluid', 'Serum', 'Probang cup fluid'],
      biosafetyLevel: 'BSL-3 Agriculture (for live virus handling/isolation)'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Prophylactic vaccination using multi-valent inactivated oil-adjuvant vaccine matching circulating topotypes (O, A, SAT 2). Ring vaccination in a 10–15 km buffer around confirmed outbreaks.',
      biosecurityMeasures: [
        'Strict isolation of affected herds and 21-day standstill for livestock movements',
        'Disinfection of vehicles, pens, and boots with 4% sodium carbonate (washing soda) or 2% citric acid',
        'Quarantine of new livestock arrivals for minimum 21 days'
      ],
      movementControl: 'Immediate ban on cloven-hoofed livestock movement, live animal markets, and communal grazing around index woredas.',
      emergencyActions: [
        'Immediate notification to National Animal Health Information System (NAHIS/ADNIS)',
        'Establishment of zonal containment perimeter',
        'Ring vaccination deployment and supportive treatment (antiseptics, oxytetracycline for secondary infections)'
      ]
    },
    oneHealthRelevance: {
      isZoonotic: false,
      humanImpact: 'Negligible human health risk (very rare mild skin lesions reported in laboratory workers). Major human food security and pastoral livelihoods threat.',
      wildlifeReservoir: 'African buffalo (Syncerus caffer) act as lifelong maintenance reservoir for SAT serotypes.',
      environmentalFactors: 'Virus survives for weeks in moist soil, slurry, and dried dung in cool environments; rapidly inactivated at pH < 6.0 or > 9.0.'
    },
    authoritativeReferences: [
      { title: 'WOAH Terrestrial Manual — Foot-and-Mouth Disease', organization: 'WOAH', url: 'https://www.woah.org', type: 'Standard' },
      { title: 'EuFMD Fast Disease Field Investigation Manual', organization: 'EuFMD', url: 'https://www.fao.org/eufmd', type: 'Manual' },
      { title: 'National Foot and Mouth Disease Control Strategy Ethiopia', organization: 'Animal Health Institute (AHI)', type: 'National Guideline' }
    ],
    matchingAdnisDiseases: ['Foot-and-Mouth Disease (FMD)', 'FMD']
  },
  {
    id: 'ppr',
    name: 'Peste des Petits Ruminants',
    acronym: 'PPR',
    group: 'Respiratory',
    etiologicalAgent: 'Small Ruminant Morbillivirus (Paramyxoviridae family)',
    primaryHosts: ['Goats', 'Sheep'],
    secondaryHosts: ['Camels (seroconversion / clinical disease)', 'Wildlife ungulates (gazelles, ibex)'],
    importance: {
      global: 'Targeted for global eradication by 2030 by FAO and WOAH. High morbidity and mortality in small ruminant populations.',
      ethiopianContext: 'Highly endemic in lowland agro-pastoral zones of Oromia, Somali, and Afar regions, including East/West Hararghe lowlands. Devastating to women and youth smallholder livestock keepers.',
      economicImpact: 'Severe flock mortality, trade embargoes, loss of mutton and goat meat value chains.'
    },
    epidemiology: {
      transmission: [
        'Close direct contact via fine aerosols and droplet inhalation',
        'Contact with infectious ocular, nasal, oral discharges and feces',
        'Contaminated water troughs, feed bunks, and communal enclosures'
      ],
      incubationPeriod: '3 to 6 days (range 2–10 days)',
      morbidityMortality: 'Morbidity up to 90–100%; Mortality up to 50–90% in naive goat herds (goats typically more severely affected than sheep).',
      seasonality: 'Higher incidence following rainy seasons and during high-density market gatherings.'
    },
    clinicalSigns: {
      general: ['Sudden high fever (40.5–41.5°C)', 'Severe listlessness, arched back, erect hair coat'],
      acute: ['Serous to mucopurulent nasal and ocular discharge crusting eyelids', 'Severe dyspnea, sneezing, open-mouth coughing'],
      pathognomonic: [
        'Necrotic stomatitis with "bran-like" white necrotic deposits over gums, dental pad, and tongue',
        'Profuse watery to bloody diarrhea (projectile diarrhea) causing severe dehydration and hypothermia',
        '"Zebra striping" in large intestine and rectum on necropsy'
      ],
      differentialDiagnosis: [
        'Contagious Caprine Pleuropneumonia (CCPP - no diarrhea/stomatitis)',
        'Pasteurellosis / Mannheimiosis',
        'Sheep and Goat Pox (SGP)',
        'Coccidiosis',
        'Bluetongue'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Sheep or goats exhibiting high fever, mucopurulent nasal discharge, erosive mouth lesions, and severe diarrhea.',
        confirmed: 'Positive laboratory detection of PPR antigen (Sandwich ELISA, RT-PCR) or specific antibodies in unvaccinated herds.'
      },
      samplingRequirements: [
        'Swabs of ocular/nasal discharges and oral mucosal erosions in viral transport media',
        'Mesenteric and bronchial lymph nodes, lungs, and spleen on ice during necropsy',
        'Clotted blood for serum antibody detection'
      ],
      notificationPeriod: 'Immediate (within 24 hours)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['PPR Rapid Antigen Pen-Side Strip'],
      referenceTests: ['Competitive ELISA (cELISA)', 'Real-Time RT-PCR', 'Antigen Capture ELISA', 'VNT'],
      sampleTypes: ['Conjunctival/nasal swabs', 'Oral necrotic tissue', 'Lungs/lymph nodes', 'Serum'],
      biosafetyLevel: 'BSL-2'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Mass targeted vaccination using live attenuated PPR vaccine (Nigeria 75/1 strain or Sungri 96) providing life-long immunity (minimum 3 years). Target >80% vaccination coverage.',
      biosecurityMeasures: [
        'Isolation of newly purchased goats/sheep for 21 days',
        'Disinfection of pens with standard quaternary ammonium or 2% sodium hypochlorite',
        'Safe disposal/burning of carcasses'
      ],
      movementControl: 'Control of small ruminant transport checkpoints along trade corridors.',
      emergencyActions: [
        'Emergency ring vaccination campaign',
        'Supportive fluid therapy and broad-spectrum antibiotics to prevent secondary Pasteurella pneumonia'
      ]
    },
    authoritativeReferences: [
      { title: 'FAO/WOAH Global Strategy for the Control and Eradication of PPR', organization: 'FAO', url: 'https://www.fao.org/ppr', type: 'Global Strategy' },
      { title: 'Ethiopia National PPR Eradication Roadmap 2021–2030', organization: 'Ethiopian MoA / Regional Lab', type: 'National Roadmap' }
    ],
    matchingAdnisDiseases: ['Peste des Petits Ruminants (PPR)', 'PPR']
  },
  {
    id: 'lsd',
    name: 'Lumpy Skin Disease',
    acronym: 'LSD',
    group: 'Pox & Skin',
    etiologicalAgent: 'Capripoxvirus (Lumpy skin disease virus, Poxviridae)',
    primaryHosts: ['Cattle (Bos taurus and Bos indicus)'],
    secondaryHosts: ['Water buffalo', 'Wild ruminants (giraffe, impala seroconversion)'],
    importance: {
      global: 'Rapidly spreading transboundary disease across Africa, the Middle East, Eastern Europe, and Asia.',
      ethiopianContext: 'Widespread across all zones of Ethiopia including Hararghe highlands and midlands. Highest during wet months with heavy vector populations.',
      economicImpact: 'Permanent hide damage (reduction in tanning value), emaciation, long-term milk loss, deep cutaneous ulcers, draft oxen disability.'
    },
    epidemiology: {
      transmission: [
        'Mechanical transmission by biting hematophagous arthropods (mosquitoes [Aedes, Culex], stable flies [Stomoxys], ticks [Rhipicephalus, Amblyomma])',
        'Iatrogenic transmission via shared hypodermic needles during mass treatment/vaccination',
        'Direct contact (minor route, through saliva, milk, skin lesions)'
      ],
      incubationPeriod: '4 to 14 days (up to 28 days)',
      morbidityMortality: 'Morbidity 10–50%; Mortality generally low (< 5%), but can reach 10–20% in exotic dairy crosses.',
      seasonality: 'Correlates strictly with vector breeding seasons (post-rainy periods in Hararghe).'
    },
    clinicalSigns: {
      general: ['Biphasic fever up to 41°C', 'Enlargement of superficial lymph nodes (prescapular, precrural)'],
      acute: ['Lachrymation, nasal discharge, edema of dewlap, brisket, and limbs'],
      pathognomonic: [
        'Firm, circumscribed, round, flat-topped cutaneous nodules (0.5 to 5 cm) on neck, back, perineum, udder, and limbs',
        '"Sit-fasts" (central core of necrotic skin sloughing off, leaving deep, painful ulcers)',
        'Ulcerative lesions in mucosa of respiratory and digestive tracts'
      ],
      differentialDiagnosis: [
        'Pseudo-lumpy skin disease (Bovine herpesvirus 2)',
        'Demodicosis (mange)',
        'Bovine farcy',
        'Dermatophilosis (Streptothricosis)',
        'Photosensitization'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Cattle showing generalized firm nodular skin lesions, high fever, and markedly enlarged superficial lymph nodes.',
        confirmed: 'Laboratory detection of Capripoxvirus DNA by PCR or characteristic pox virions by electron microscopy.'
      },
      samplingRequirements: [
        'Full-thickness skin biopsies of fresh nodular lesions in sterile saline or viral transport media',
        'Scabs and crusts from sloughing nodules',
        'EDTA blood during early febrile stage'
      ],
      notificationPeriod: 'Within 48 hours'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Clinical skin biopsy inspection'],
      referenceTests: ['Real-Time Capripox PCR', 'Serum Neutralization Test (SNT)', 'Capripox ELISA', 'Virus Isolation on lamb testis cells'],
      sampleTypes: ['Skin nodules / biopsies', 'Crusts', 'EDTA blood', 'Serum'],
      biosafetyLevel: 'BSL-2'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Annual vaccination with homologous live attenuated LSD vaccine (Neethling strain) or heterologous Romanian/Kenyan sheep pox vaccine at 10x dose.',
      biosecurityMeasures: [
        'Vector control through acaricide spraying, dipping, and pour-on insect repellents',
        'Single-use sterile needles during community animal health campaigns',
        'Isolation of affected cattle with wound dressing to prevent myiasis'
      ],
      movementControl: 'Restriction of cattle movement from vector-active outbreak woredas.',
      emergencyActions: [
        'Immediate ring vaccination in surrounding herds',
        'Wound antiseptic management and antibiotic therapy for secondary bacterial infections'
      ]
    },
    authoritativeReferences: [
      { title: 'WOAH Terrestrial Manual — Lumpy Skin Disease', organization: 'WOAH', url: 'https://www.woah.org', type: 'Standard' },
      { title: 'FAO LSD Field Manual for Veterinarians', organization: 'FAO', url: 'https://www.fao.org', type: 'Manual' }
    ],
    matchingAdnisDiseases: ['Lumpy Skin Disease (LSD)', 'LSD']
  },
  {
    id: 'cbpp',
    name: 'Contagious Bovine Pleuropneumonia',
    acronym: 'CBPP',
    group: 'Respiratory',
    etiologicalAgent: 'Mycoplasma mycoides subsp. mycoides (small colony type)',
    primaryHosts: ['Cattle (Bos taurus, Bos indicus)', 'Zebu oxen'],
    secondaryHosts: ['None proven in wild ungulates'],
    importance: {
      global: 'Declared eradicated in Europe and the Americas; major constraint in sub-Saharan Africa pastoral regions.',
      ethiopianContext: 'Endemic in pastoral and agropastoral belts of Ethiopia. Causes insidious, chronic respiratory wastage in Hararghe livestock corridors.',
      economicImpact: 'High mortality, chronic ill-thrift, loss of draught capability in ploughing oxen, severe restriction on cattle export.'
    },
    epidemiology: {
      transmission: [
        'Inhalation of infectious droplets exhaled by infected or subclinical carrier cattle (close contact required)',
        'Chronic "carrier" animals harboring pulmonary sequestra ("lungers") shed organism during periods of stress'
      ],
      incubationPeriod: '1 to 4 months (can be as short as 2–3 weeks under heavy challenge)',
      morbidityMortality: 'Morbidity up to 70%; Mortality 10–50%; up to 25% of recovered cattle become chronic carriers.',
      seasonality: 'Spreads during seasonal cattle movements, drought gatherings at watering points, and cattle markets.'
    },
    clinicalSigns: {
      general: ['Low-grade or high fever', 'Lethargy, progressive weight loss, anorexia'],
      acute: ['Painful shallow breathing, extended neck, open mouth, grunting expiration, elbow abduction'],
      pathognomonic: [
        'Violent coughing provoked by forced exercise or percussion of the thorax',
        'Unilateral or bilateral serofibrinous pleuropneumonia with pleural effusion ("marbled lung" appearance on post-mortem)',
        'Encapsulated pulmonary sequestra in chronic cases'
      ],
      differentialDiagnosis: [
        'Bovine pasteurellosis (Hemorrhagic Septicemia)',
        'Tuberculosis',
        'Foreign body pericarditis',
        'Theileriosis / East Coast Fever (where present)'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Cattle showing chronic coughing, respiratory distress with extended neck, and thoracic pain upon percussion.',
        confirmed: 'Isolation of M. mycoides subsp. mycoides from lung tissue/pleural fluid or positive CFT/cELISA serology with typical marbling necropsy lesions.'
      },
      samplingRequirements: [
        'Aseptic samples of hepatized lung tissue (interface of diseased and healthy tissue)',
        'Pleural fluid collected via sterile syringe into sterile tubes on ice (transport at 4°C)',
        'Mediastinal and bronchial lymph nodes'
      ],
      notificationPeriod: 'Immediate (within 24 hours)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Latex Agglutination Test (field-grade)'],
      referenceTests: ['Complement Fixation Test (CFT)', 'Competitive ELISA (cELISA)', 'Specific PCR', 'Mycoplasma culture on Hayflick medium'],
      sampleTypes: ['Lung tissue', 'Pleural fluid', 'Lymph nodes', 'Serum'],
      biosafetyLevel: 'BSL-2'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Annual vaccination with live attenuated T1/44 or T1-SR strain vaccine. Minimum 80% herd coverage required.',
      biosecurityMeasures: [
        'Slaughter surveillance at abattoirs to detect lung sequestra',
        'Traceback of slaughtered carriers to origin woredas',
        'Quarantine of introduced breeding stock'
      ],
      movementControl: 'Strict enforcement of cattle movement permits and vaccination certification across zonal boundaries.',
      emergencyActions: [
        'Zonal quarantine and targeted ring vaccination with T1/44 vaccine',
        'Avoid unauthorized antibiotic treatment which may promote sequestra formation and carrier status'
      ]
    },
    authoritativeReferences: [
      { title: 'WOAH Terrestrial Manual — Contagious Bovine Pleuropneumonia', organization: 'WOAH', url: 'https://www.woah.org', type: 'Standard' },
      { title: 'FAO Contagious Bovine Pleuropneumonia Diagnostic Manual', organization: 'FAO', type: 'Manual' }
    ],
    matchingAdnisDiseases: ['Contagious Bovine Pleuropneumonia (CBPP)', 'CBPP']
  },
  {
    id: 'ccpp',
    name: 'Contagious Caprine Pleuropneumonia',
    acronym: 'CCPP',
    group: 'Respiratory',
    etiologicalAgent: 'Mycoplasma capricolum subsp. capripneumoniae (Mccp)',
    primaryHosts: ['Goats (Capra hircus)'],
    secondaryHosts: ['Sheep (rarely clinical, can seroconvert)', 'Wild ungulates (wild caprids, gazelles)'],
    importance: {
      global: 'Extremely contagious respiratory disease of goats across Africa, Middle East, and Central Asia.',
      ethiopianContext: 'Major cause of goat mortality and economic hardship in arid and semi-arid pastoral woredas of Hararghe and eastern Ethiopia.',
      economicImpact: 'Devastating losses in goat herds (up to 100% morbidity and 80% mortality), destroying rural household capital.'
    },
    epidemiology: {
      transmission: [
        'Direct aerosol transmission via respiratory droplets from coughing goats in overcrowded night pens or markets',
        'Short-range transmission requires close cohabitation'
      ],
      incubationPeriod: '6 to 14 days (up to 30 days)',
      morbidityMortality: 'Morbidity up to 100%; Mortality 60–80% (frequently acute death in naive herds within days).',
      seasonality: 'Peaks during cold, windy periods, dust storms, and seasonal livestock concentration.'
    },
    clinicalSigns: {
      general: ['Severe fever (41–42°C)', 'Complete anorexia, extreme lethargy, separation from flock'],
      acute: ['Frequent painful coughing, prominent nasal discharge, grunting with open mouth and tongue protrusion'],
      pathognomonic: [
        'Severe fibrinous pleuropneumonia (unilateral in >75% of cases)',
        'Copious straw-colored pleural fluid (up to 0.5–1 liter in thoracic cavity)',
        'Extensive fibrin deposits coating the pleural surface ("bread and butter" appearance), absence of interlobular marbling (unlike CBPP)'
      ],
      differentialDiagnosis: [
        'PPR (PPR has mouth lesions and diarrhea, absent in CCPP)',
        'Caprine pasteurellosis',
        'Mycoplasma mycoides subsp. capri infection',
        'Dictyocaulus lungworm infection'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Goat herd suffering sudden severe respiratory distress, violent coughing, high fever, and high mortality without diarrhea or stomatitis.',
        confirmed: 'Detection of Mccp DNA by specific PCR or isolation from pleural fluid/lung tissue.'
      },
      samplingRequirements: [
        'Pleural fluid collected aseptically from thoracic cavity',
        'Fresh lung tissue at the junction of hepatized and healthy lung parenchyma',
        'Mediastinal lymph nodes'
      ],
      notificationPeriod: 'Immediate (within 24 hours)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Latex Agglutination Test for CCPP (LAT) for rapid field diagnosis'],
      referenceTests: ['Competitive ELISA (cELISA)', 'Specific Mccp PCR', 'Growth inhibition / metabolism inhibition tests'],
      sampleTypes: ['Pleural fluid', 'Hepatized lung', 'Serum'],
      biosafetyLevel: 'BSL-2'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Annual vaccination with inactivated adjuvant CCPP vaccine (such as CAPRIVAX produced by AHI Ethiopia).',
      biosecurityMeasures: [
        'Immediate isolation of coughing goats',
        'Sanitation of goat shelters and prevention of overcrowding',
        'Disinfection of communal transport vehicles'
      ],
      movementControl: 'Strict restriction on goat flock movements across woreda borders during reported outbreaks.',
      emergencyActions: [
        'Targeted antimicrobial therapy (tylosin, oxytetracycline) in early stages for exposed in-contact goats',
        'Ring vaccination of surrounding goat herds'
      ]
    },
    authoritativeReferences: [
      { title: 'WOAH Terrestrial Manual — Contagious Caprine Pleuropneumonia', organization: 'WOAH', url: 'https://www.woah.org', type: 'Standard' },
      { title: 'AHI Guidelines for Caprine Pleuropneumonia Surveillance', organization: 'Animal Health Institute (AHI)', type: 'National Guideline' }
    ],
    matchingAdnisDiseases: ['Contagious Caprine Pleuropneumonia (CCPP)', 'CCPP']
  },
  {
    id: 'anthrax',
    name: 'Anthrax',
    acronym: 'ANTHRAX',
    group: 'Zoonoses',
    etiologicalAgent: 'Bacillus anthracis (Gram-positive, endospore-forming rod-shaped bacterium)',
    primaryHosts: ['Cattle', 'Sheep', 'Goats', 'Camels', 'Horses', 'Wildlife herbivores'],
    secondaryHosts: ['Humans (Cutaneous, Gastrointestinal, Inhalational)', 'Carnivores / Scavengers'],
    importance: {
      global: 'High-consequence zoonotic disease with potential for severe human morbidity/mortality and dual-use biosecurity risk.',
      ethiopianContext: 'Endemic across agricultural and pastoral regions of Ethiopia including Hararghe highlands. Spores remain viable in soil for decades.',
      economicImpact: 'Acute livestock death without premonitory signs, human hospitalization, market bans, carcass disposal costs.'
    },
    epidemiology: {
      transmission: [
        'Ingestion of dormant bacterial spores from contaminated pasture, soil, or waterholes',
        'Opening infected carcasses (exposes vegetative bacteria to oxygen, triggering sporulation)',
        'Biting flies (Tabanids, Stomoxys) transmitting spores mechanically',
        'Humans: Handling contaminated hides, wool, skinning dead livestock, or eating undercooked meat ("bushmeat" / emergency slaughter)'
      ],
      incubationPeriod: '1 to 7 days (can extend to 14 days)',
      morbidityMortality: 'Morbidity variable; Case fatality rate in untreated animals reaches 90–100%.',
      seasonality: 'Outbreaks frequently follow heavy rainfall/flooding followed by dry spells exposing soil spores.'
    },
    clinicalSigns: {
      general: ['Peracute: Sudden death with no prior signs (animal found dead in field/pen)'],
      acute: ['High fever (41.5°C), staggering, trembling, dyspnea, rapid collapse'],
      pathognomonic: [
        'Absence of rigor mortis (carcass remains flaccid)',
        'Dark, tarry, non-clotting blood oozing from all natural body orifices (mouth, nostrils, anus, vulva)',
        'Rapid carcass bloating and decomposition',
        'CRITICAL RULE: DO NOT OPEN ANTHRAX-SUSPECT CARCASSES IN THE FIELD'
      ],
      differentialDiagnosis: [
        'Blackleg (Clostridium chauvoei)',
        'Lightning strike',
        'Acute babesiosis / Anaplasmosis',
        'Snake bite or acute poisoning',
        'Bloat / enterotoxemia'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Sudden unexplained death of herbivore with uncoagulated blood exuding from natural orifices and lack of rigor mortis.',
        confirmed: 'Demonstration of encapsulated square-ended Bacillus anthracis rods in peripheral blood smear (Polychrome Methylene Blue / McFadyean stain) or PCR/culture.'
      },
      samplingRequirements: [
        'Peripheral blood aspirated with sterile needle and syringe from ear vein or jugular vein (DO NOT PERFORM FULL POST-MORTEM)',
        'Air-dried, heat-fixed blood smears prepared in the field for McFadyean capsule staining',
        'Dry swab impregnated with oozing blood from ear vein'
      ],
      notificationPeriod: 'IMMEDIATE / URGENT (within 2 hours to Veterinary & Public Health Officers)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Ascoli Precipitation Test (thermostable antigen test)', 'Direct McFadyean stained smear microscopy'],
      referenceTests: ['Bacterial culture on blood agar', 'Real-time PCR (protective antigen pagA, capA genes)', 'Gamma phage lysis'],
      sampleTypes: ['Ear vein peripheral blood', 'Blood swab', 'Soil from death site'],
      biosafetyLevel: 'BSL-3 (BSL-2 for smear microscopy with personal protective equipment)'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Annual prophylactic vaccination using live non-capsulated Stern strain 34F2 vaccine before expected outbreak seasons.',
      biosecurityMeasures: [
        'Deep burial of intact carcasses (>2 meters deep) covered with quicklime (calcium oxide) or complete cremation',
        'Strict decontamination of soil and tools with 5% formalin or 10% caustic soda',
        'Ban on skinning, opening, or consuming meat from dead or sick animals'
      ],
      movementControl: 'Immediate quarantine of affected pasture and exclusion of livestock for minimum 3 weeks.',
      emergencyActions: [
        'Immediate joint notification to Public Health Emergency Management (PHEM) for human contact tracing and post-exposure prophylaxis (PEP with ciprofloxacin or doxycycline)',
        'Emergency vaccination of all in-contact livestock'
      ]
    },
    oneHealthRelevance: {
      isZoonotic: true,
      humanImpact: 'Causes severe Cutaneous anthrax ("malignant pustule"), fatal Gastrointestinal anthrax from meat consumption, and Inhalational anthrax ("wool-sorters disease").',
      wildlifeReservoir: 'Wild herbivores (kudu, zebra, warthogs) share vulnerability and amplify pasture spore contamination.',
      environmentalFactors: 'Spores survive in neutral to alkaline, calcium-rich soils ("anthrax incubator areas") for over 50 years.'
    },
    authoritativeReferences: [
      { title: 'WHO/FAO/WOAH Anthrax in Humans and Animals (4th Edition)', organization: 'WHO', url: 'https://www.who.int', type: 'Guideline' },
      { title: 'Ethiopia National Anthrax Prevention and Control Guideline', organization: 'Ethiopian MoA / Regional Lab', type: 'National Guideline' }
    ],
    matchingAdnisDiseases: ['Anthrax', 'ANTHRAX']
  },
  {
    id: 'rabies',
    name: 'Rabies',
    acronym: 'RABIES',
    group: 'Zoonoses',
    etiologicalAgent: 'Rabies lyssavirus (Rhabdoviridae family)',
    primaryHosts: ['Domestic dogs (Canis familiaris - >95% of human transmissions)', 'Wildlife carnivores (jackals, foxes, hyenas, Ethiopian wolf)'],
    secondaryHosts: ['Cattle, Equines, Sheep, Goats, Camels', 'Humans (accidental dead-end host)'],
    importance: {
      global: 'Zero By 30: Global strategic plan to end human deaths from dog-mediated rabies by 2030 (WHO, WOAH, FAO, GARC).',
      ethiopianContext: 'Major endemic public health priority across urban, rural, and pastoral communities in Oromia / Hararghe. High fatal canine bite incidents.',
      economicImpact: 'High human mortality (100% fatal once clinical symptoms appear), cost of human post-exposure prophylaxis (PEP), livestock mortality.'
    },
    epidemiology: {
      transmission: [
        'Inoculation of infectious saliva via bites, scratches, or mucous membrane contact from rabid animals (primarily domestic/stray dogs)',
        'Direct nerve path retrograde axonal transport to the central nervous system'
      ],
      incubationPeriod: '2 weeks to 3 months (can range from 5 days to over 1 year depending on bite location and viral load)',
      morbidityMortality: 'Mortality 100% once clinical signs manifest.',
      seasonality: 'Continuous year-round; surges during canine mating seasons and peak roaming periods.'
    },
    clinicalSigns: {
      general: ['Sudden change in behavior (friendly animals become aggressive; aggressive become docile)', 'Anorexia, fever'],
      acute: ['Furious form: Hyperactivity, aggression, biting inanimate objects, aimless roaming, vocalization change (altered bark/bellow)'],
      pathognomonic: [
        'Dumb/Paralytic form: Dropped lower jaw, profuse salivation, inability to swallow (hydrophobia in humans, dysphagia in animals)',
        'Progressive ascending paralysis, coma, and death within 2 to 10 days of onset'
      ],
      differentialDiagnosis: [
        'Canine distemper (neurological stage)',
        'Infectious canine hepatitis',
        'Bovine nervous ketosis',
        'Listeriosis / Bovine spongiform encephalopathy',
        'Trauma / toxicities'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Any animal exhibiting acute behavioral changes, unprovoked biting, altered vocalization, and progressive paralysis.',
        confirmed: 'Direct Fluorescent Antibody (DFA) test detection of rabies viral antigen in brain tissue (hippocampus, cerebellum, brainstem).'
      },
      samplingRequirements: [
        'Intact head or whole brain removed by trained personnel using full biosafety equipment',
        'Preserved cold on wet ice or frozen (50% buffered glycerol-saline if cold chain unavailable)',
        'CRITICAL: Strict personal protective equipment (goggles, face shield, heavy cut-resistant gloves)'
      ],
      notificationPeriod: 'IMMEDIATE (within 1 hour to both veterinary and human health authorities)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Direct Rapid Immunohistochemical Test (dRIT)'],
      referenceTests: ['Direct Fluorescent Antibody (DFA) Test (Gold Standard)', 'Real-Time RT-PCR', 'Rapid Tissue Culture Infection Test (RTCIT)'],
      sampleTypes: ['Brain tissue (hippocampus, brainstem, cerebellum)'],
      biosafetyLevel: 'BSL-2 (BSL-3 for live virus manipulation)'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Mass dog vaccination targeting at least 70% of the dog population to achieve herd immunity and break transmission. Prophylactic vaccination of livestock in high-risk zones.',
      biosecurityMeasures: [
        'Humane stray dog population management and community rabies education',
        'Immediate wound washing (15 minutes with soap and copious running water) after any animal bite',
        'Immediate human Post-Exposure Prophylaxis (PEP) with rabies vaccine + rabies immunoglobulin (RIG)'
      ],
      movementControl: 'Control of unvaccinated dog transport across districts.',
      emergencyActions: [
        'Quarantine of biting animal for 10-day observation period (if domestic dog/cat)',
        'Immediate referral of bite victims to nearest health clinic for PEP administration'
      ]
    },
    oneHealthRelevance: {
      isZoonotic: true,
      humanImpact: 'Over 59,000 human deaths globally each year (predominantly children in rural Africa and Asia). 100% preventable with timely wound washing and PEP.',
      wildlifeReservoir: 'Jackals, bat-eared foxes, hyenas, and endangered Ethiopian wolves (Canis simensis).',
      environmentalFactors: 'Urban waste and unmanaged slaughterhouse offal aggregate stray dog populations.'
    },
    authoritativeReferences: [
      { title: 'Zero By 30: The Global Strategic Plan to end human deaths from dog-mediated rabies', organization: 'WHO', url: 'https://www.who.int/rabies', type: 'Global Strategy' },
      { title: 'Ethiopia National Strategic Plan for Elimination of Dog-Mediated Rabies', organization: 'Ethiopian MoA / Regional Lab', type: 'National Strategy' }
    ],
    matchingAdnisDiseases: ['Rabies', 'RABIES']
  },
  {
    id: 'sgp',
    name: 'Sheep Pox and Goat Pox',
    acronym: 'SGP',
    group: 'Pox & Skin',
    etiologicalAgent: 'Capripoxvirus (Sheeppox virus / Goatpox virus, Poxviridae)',
    primaryHosts: ['Sheep', 'Goats'],
    secondaryHosts: ['None'],
    importance: {
      global: 'Significant transboundary pox disease across North & Central Africa, Middle East, and Asia.',
      ethiopianContext: 'Ubiquitous in highland and lowland Hararghe small ruminant production systems. Impedes sheep/goat live export.',
      economicImpact: 'High mortality in lambs and kids, wool/skin depreciation, loss of body weight and condition.'
    },
    epidemiology: {
      transmission: [
        'Direct contact with infected sheep/goats via aerosols and mucosal secretions',
        'Contaminated pens, bedding, fodder, and shearing equipment',
        'Mechanical transmission by biting insects'
      ],
      incubationPeriod: '4 to 14 days',
      morbidityMortality: 'Morbidity 70–90%; Mortality 5–50% (can exceed 80% in young lambs/kids).',
      seasonality: 'Common year-round; flares during cold wet seasons and high trade volume periods.'
    },
    clinicalSigns: {
      general: ['High fever (40–42°C)', 'Severe depression, swollen eyelids, conjunctivitis, mucopurulent nasal discharge'],
      acute: ['Respiratory distress, painful swallowing, hypersalivation'],
      pathognomonic: [
        'Macules turning into firm round papules (0.5 to 1.5 cm) on hairless skin (muzzle, nostrils, ears, perineum, under-tail, udder, scrotum)',
        'Papules developing into hard dark necrotic crusts/scabs',
        'Nodular lung lesions causing severe interstitial pneumonia'
      ],
      differentialDiagnosis: [
        'Contagious Ecthyma (Orf - confined to lips and mouth)',
        'PPR (PPR has diarrhea, absent in SGP)',
        'Bluetongue',
        'Mange'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Sheep or goats presenting with high fever and generalized hard nodular/crusted skin lesions across body and head.',
        confirmed: 'Laboratory PCR detection of Capripoxvirus DNA or characteristic histopathological intracytoplasmic inclusion bodies.'
      },
      samplingRequirements: [
        'Biopsies of fresh skin papules/scabs in sterile PBS with antibiotics',
        'Lung lesions from necropsied animals on wet ice',
        'Clotted blood for serum'
      ],
      notificationPeriod: 'Within 48 hours'
    },
    laboratoryDiagnosis: {
      fieldTests: ['Clinical examination & scab histology'],
      referenceTests: ['Capripox PCR', 'Virus Neutralization Test (VNT)', 'Indirect Immunofluorescence', 'ELISA'],
      sampleTypes: ['Skin scabs', 'Papule biopsies', 'Lungs', 'Serum'],
      biosafetyLevel: 'BSL-2'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Annual vaccination with live attenuated Romanian or Kenyan sheep pox vaccine (protects against both sheep and goat pox).',
      biosecurityMeasures: [
        'Quarantine of all newly introduced sheep and goats for 21 days',
        'Cleaning and disinfection of pens with sodium hydroxide (2%) or formalin',
        'Separation of healthy flocks from communal grazing routes during outbreaks'
      ],
      movementControl: 'Inter-district small ruminant transit permits.',
      emergencyActions: [
        'Ring vaccination around infected villages',
        'Supportive skin antiseptics and fly repellents to prevent myiasis'
      ]
    },
    authoritativeReferences: [
      { title: 'WOAH Terrestrial Manual — Sheep Pox and Goat Pox', organization: 'WOAH', url: 'https://www.woah.org', type: 'Standard' }
    ],
    matchingAdnisDiseases: ['Sheep & Goat Pox', 'Sheep Pox and Goat Pox (SGP)', 'SGP']
  },
  {
    id: 'rvf',
    name: 'Rift Valley Fever',
    acronym: 'RVF',
    group: 'Vector-Borne & Hemorrhagic',
    etiologicalAgent: 'Phlebovirus (Phenuiviridae family)',
    primaryHosts: ['Sheep', 'Goats', 'Cattle', 'Camels'],
    secondaryHosts: ['Humans (Zoonotic)', 'Wildlife ungulates'],
    importance: {
      global: 'High-impact zoonotic arboviral disease capable of massive livestock abortion storms and severe human hemorrhagic fever.',
      ethiopianContext: 'Cyclical epidemic threat tied to El Niño Southern Oscillation (ENSO) rainfall and flooding events in the Horn of Africa.',
      economicImpact: 'Abortion storms (>90% in pregnant ewes), near 100% mortality in newborn lambs, total trade bans on livestock export.'
    },
    epidemiology: {
      transmission: [
        'Primary vectors: Floodwater mosquitoes (Aedes spp. transovarially carry virus; Culex spp. act as secondary epidemic vectors)',
        'Direct contact with infected animal blood, body fluids, aborted fetuses, placenta during handling or slaughter',
        'Consumption of unpasteurized milk from infected animals',
        'Aerosol transmission in laboratory and abattoir settings'
      ],
      incubationPeriod: '1 to 6 days in livestock; 2 to 6 days in humans',
      morbidityMortality: 'Abortion rate in pregnant sheep >90–100%; Lamb mortality >90%; Adult sheep mortality 10–30%; Cattle mortality 5–10%.',
      seasonality: 'Epizootic surges follow persistent heavy rainfall, elevated NDVI (Normalized Difference Vegetation Index), and river flooding.'
    },
    clinicalSigns: {
      general: ['High fever (40–42°C)', 'Complete loss of appetite, weakness, abdominal pain'],
      acute: ['Foul-smelling bloody diarrhea, jaundice, mucopurulent nasal discharge'],
      pathognomonic: [
        '"Abortion storms" in pregnant sheep, goats, and cows (virtually all pregnant animals abort simultaneously)',
        'Severe necrotic hepatitis with extensive white necrotic foci in liver ("liver necrosis") on necropsy',
        'Extensive hemorrhage in gastrointestinal tract and gallbladder wall'
      ],
      differentialDiagnosis: [
        'Brucellosis',
        'Bluetongue',
        'Wesselsbron disease',
        'Bovine viral diarrhea (BVD)',
        'Anthrax'
      ]
    },
    surveillance: {
      caseDefinition: {
        suspected: 'Widespread sudden abortions in sheep/cattle herds concurrent with heavy unseasonal rainfall and high mosquito activity.',
        confirmed: 'Detection of RVF viral RNA by RT-PCR, IgM ELISA seroconversion, or virus isolation.'
      },
      samplingRequirements: [
        'Aborted fetus liver, spleen, and cotyledons in viral transport media (HANDLE WITH FULL PPE)',
        'EDTA blood during acute febrile stage',
        'Paired serum samples for IgM/IgG ELISA'
      ],
      notificationPeriod: 'IMMEDIATE / URGENT (within 2 hours to Veterinary & Public Health Authorities)'
    },
    laboratoryDiagnosis: {
      fieldTests: ['RVF Rapid Antigen Strip (pen-side)'],
      referenceTests: ['Real-Time RT-PCR', 'IgM/IgG Capture ELISA', 'Virus Neutralization (VNT)'],
      sampleTypes: ['Liver tissue', 'Spleen', 'EDTA blood', 'Serum'],
      biosafetyLevel: 'BSL-3 (due to aerosol hazard and zoonotic lethality)'
    },
    preventionAndControl: {
      vaccinationStrategy: 'Prophylactic vaccination with live attenuated Smithburn vaccine or clone 13 / inactivated vaccine during inter-epizootic periods (DO NOT vaccinate during active outbreak with live needle sharing).',
      biosecurityMeasures: [
        'Vector control through larviciding in temporary water bodies and adulticide spraying',
        'Strict PPE (gloves, masks, eye protection) when handling aborted fetuses, placenta, and sick livestock',
        'Public health warning: Do not consume raw milk or slaughter sick animals'
      ],
      movementControl: 'Total ban on livestock movement out of flood-affected epizootic zones.',
      emergencyActions: [
        'Immediate One Health task force activation with Health and Meteorology departments',
        'Human vector-protection campaigns and hospital preparedness for viral hemorrhagic fever cases'
      ]
    },
    oneHealthRelevance: {
      isZoonotic: true,
      humanImpact: 'In humans, mostly flu-like illness; ~1–2% develop severe complications: hemorrhagic fever, ocular retinitis causing permanent blindness, and meningoencephalitis.',
      wildlifeReservoir: 'Wild ruminants act as sentinels and amplifiers during heavy vector seasons.',
      environmentalFactors: 'Driven by satellite-monitored climate anomalies (sea surface temperature in Indian Ocean, ENSO, NDVI).'
    },
    authoritativeReferences: [
      { title: 'FAO Rift Valley Fever Action Framework', organization: 'FAO', url: 'https://www.fao.org/rvf', type: 'Guideline' },
      { title: 'WHO Fact Sheet — Rift Valley Fever', organization: 'WHO', url: 'https://www.who.int', type: 'Fact Sheet' }
    ],
    matchingAdnisDiseases: ['Rift Valley Fever (RVF)', 'RVF']
  }
];

export const fastResourcesData: FastResource[] = [
  {
    id: 'res-eufmd-01',
    title: 'EuFMD FAST Disease Field Investigation & Surveillance Manual',
    description: 'Comprehensive operational manual detailing standard operating procedures for field veterinarians investigating Foot-and-Mouth and Similar Transboundary animal diseases.',
    disease: 'All FAST Diseases',
    category: 'Field Investigation',
    resourceType: 'Manual',
    organization: 'EuFMD',
    publicationDate: '2024-03-15',
    version: '4.2',
    language: 'English',
    url: 'https://www.fao.org/eufmd',
    tags: ['Field Investigation', 'SOP', 'Surveillance', 'Sampling', 'Biosecurity'],
    verificationStatus: 'Verified Official',
    fileSize: '4.8 MB'
  },
  {
    id: 'res-fao-02',
    title: 'FAO Manual on Foot-and-Mouth Disease Identification and Differential Diagnosis',
    description: 'Illustrated clinical handbook focusing on pathognomonic lesion differentiation, sampling protocols, and pen-side diagnostic workflows in endemic pastoral settings.',
    disease: 'Foot-and-Mouth Disease',
    category: 'Disease Information',
    resourceType: 'Guideline',
    organization: 'FAO',
    publicationDate: '2023-11-20',
    version: '3.0',
    language: 'English',
    url: 'https://www.fao.org/ag/againfo/programmes/en/fmd',
    tags: ['FMD', 'Clinical Signs', 'Differential Diagnosis', 'Lesions'],
    verificationStatus: 'Verified Official',
    fileSize: '3.2 MB'
  },
  {
    id: 'res-ahi-03',
    title: 'Ethiopia Animal Health Institute (AHI) — Standard Veterinary Laboratory Diagnostic Matrix',
    description: 'Official test catalog, sample handling protocols, and diagnostic turn-around timelines across Sebeta National Reference Lab and Regional Diagnostic Laboratories.',
    disease: 'All FAST Diseases',
    category: 'Laboratory',
    resourceType: 'Guideline',
    organization: 'Animal Health Institute (AHI)',
    publicationDate: '2024-01-10',
    version: '2024/1',
    language: 'English',
    url: 'http://www.ahi.gov.et',
    tags: ['AHI', 'Diagnostics', 'Sebeta', 'ELISA', 'PCR', 'SOP'],
    verificationStatus: 'Verified Official',
    fileSize: '2.1 MB'
  },
  {
    id: 'res-woah-04',
    title: 'WOAH Terrestrial Manual: Peste des Petits Ruminants (PPR) Diagnostics & Vaccines',
    description: 'Authoritative international standard for PPR surveillance, confirmatory RT-PCR and cELISA protocols, and international trade verification requirements.',
    disease: 'Peste des Petits Ruminants',
    category: 'Laboratory',
    resourceType: 'Guideline',
    organization: 'WOAH',
    publicationDate: '2023-08-01',
    version: 'Chapter 3.8.9',
    language: 'English',
    url: 'https://www.woah.org',
    tags: ['PPR', 'WOAH Standard', 'Eradication 2030', 'Vaccine Quality'],
    verificationStatus: 'Authoritative Technical Guideline',
    fileSize: '1.4 MB'
  },
  {
    id: 'res-who-05',
    title: 'WHO/WOAH/FAO One Health Rabies Post-Exposure Prophylaxis & Mass Vaccination Protocol',
    description: 'Joint One Health operational protocol for zero human deaths from dog-mediated rabies by 2030. Details bite wound triage, PEP regimens, and 70% canine vaccination algorithms.',
    disease: 'Rabies',
    category: 'One Health',
    resourceType: 'Guideline',
    organization: 'WHO',
    publicationDate: '2023-05-12',
    version: 'Rev 2',
    language: 'English',
    url: 'https://www.who.int/rabies',
    tags: ['One Health', 'Rabies', 'PEP', 'Canine Vaccination', 'Zoonoses'],
    verificationStatus: 'Verified Official',
    fileSize: '3.6 MB'
  },
  {
    id: 'res-moa-06',
    title: 'Oromia Regional Agriculture & Livestock Bureau — Anthrax Emergency Containment SOP',
    description: 'Step-by-step district protocol for carcass deep burial, quicklime decontamination, livestock ring vaccination, and human contact tracing in Hararghe.',
    disease: 'Anthrax',
    category: 'Emergency Response',
    resourceType: 'Job Aid',
    organization: 'Ethiopian MoA / Regional Lab',
    publicationDate: '2023-12-05',
    version: '1.1',
    language: 'Multilingual',
    tags: ['Anthrax', 'Carcass Disposal', 'Oromia', 'Hararghe', 'Ring Vaccination'],
    verificationStatus: 'Verified Official',
    fileSize: '1.8 MB'
  },
  {
    id: 'res-eufmd-07',
    title: 'EuFMD Lumpy Skin Disease (LSD) Rapid Field Diagnosis & Vector Control Checklist',
    description: 'Field guide for distinguishing Capripox nodular lesions from pseudo-LSD and dermatophilosis, combined with integrated vector management protocols.',
    disease: 'Lumpy Skin Disease',
    category: 'Field Investigation',
    resourceType: 'Fact Sheet',
    organization: 'EuFMD',
    publicationDate: '2024-02-18',
    language: 'English',
    url: 'https://www.fao.org/eufmd',
    tags: ['LSD', 'Vectors', 'Capripox', 'Biosecurity'],
    verificationStatus: 'Authoritative Technical Guideline',
    fileSize: '1.2 MB'
  },
  {
    id: 'res-africa-cdc-08',
    title: 'Africa CDC Framework for Multi-Sectoral One Health Early Warning Systems',
    description: 'Strategic guide for linking veterinary disease event notifications with human public health emergency management systems across Member States.',
    disease: 'General',
    category: 'One Health',
    resourceType: 'Guideline',
    organization: 'Africa CDC',
    publicationDate: '2023-09-30',
    version: '1.0',
    language: 'English',
    url: 'https://africacdc.org',
    tags: ['Africa CDC', 'One Health', 'Early Warning', 'PHEM', 'Interoperability'],
    verificationStatus: 'Verified Official',
    fileSize: '2.9 MB'
  }
];

export const fastFieldToolsData: FastFieldTool[] = [
  {
    id: 'tool-outbreak-inv',
    title: 'FAST Outbreak Field Investigation Protocol',
    category: 'Checklist',
    description: 'Step-by-step operational checklist for field veterinary officers arriving at a suspected transboundary disease event in a Kebele/Woreda.',
    targetUser: 'District Veterinary Officers, Rapid Response Teams',
    stepsOrItems: [
      { id: 's1', label: 'Initial Verification & Case Log Entry', details: 'Verify outbreak coordinates, date of first observed clinical signs, and index animal history in local farm/pasture.', critical: true },
      { id: 's2', label: 'Strict Biosecurity & PPE Donning', details: 'Establish clean/dirty perimeter. Don protective coveralls, waterproof rubber boots, and double nitrile gloves before entering animal enclosures.', critical: true },
      { id: 's3', label: 'Clinical Examination & Lesion Staging', details: 'Examine at least 10–20 animals across age groups. Record rectal temperatures, inspect oral mucosa, feet, teat, and skin.', critical: true },
      { id: 's4', label: 'Epi-Data Collection (Morbidity & Mortality)', details: 'Count total susceptible population, number of clinically sick animals, and cumulative deaths to calculate initial attack rates.', critical: true },
      { id: 's5', label: 'Sample Collection under Cold Chain', details: 'Collect fresh unruptured vesicular epithelium, swabs, or EDTA blood. Place immediately into sterile cryovials with VTM and pack in ice chest at 4°C.', critical: true },
      { id: 's6', label: 'Trace-Back & Trace-Forward Assessment', details: 'Identify animal movements, livestock market visits, communal watering points, or new animal introductions in past 21 days.', critical: false },
      { id: 's7', label: 'Immediate Field Containment & Standstill', details: 'Instruct community elders and livestock owners on temporary herd isolation, ban on market sale, and disinfection with 4% soda ash.', critical: true },
      { id: 's8', label: 'Digital ADNIS Rapid Report Submission', details: 'Log event details, coordinates, and preliminary diagnosis into the ADNIS Portal within 12 hours.', critical: true }
    ],
    sopGuidance: [
      'Never perform post-mortem if anthrax is suspected.',
      'Always use dedicated vehicle wheel spray and footbaths upon leaving the index farm.',
      'Ensure sample cryovials are labeled with water-resistant markers (Woreda, Date, Sample ID, Species).'
    ],
    interactiveFormType: 'outbreak_investigation'
  },
  {
    id: 'tool-sampling-sop',
    title: 'Diagnostic Sampling & Cold-Chain Transport SOP',
    category: 'Sampling Protocol',
    description: 'Standard protocol for selecting, harvesting, packaging, and shipping diagnostic specimens for laboratory confirmation at AHI Sebeta / Regional Labs.',
    targetUser: 'Field Epidemiologists, Laboratory Technicians',
    stepsOrItems: [
      { id: 'sp1', label: 'Sterile Specimen Container Preparation', details: 'Verify availability of viral transport medium (50% buffered glycerol pH 7.4), EDTA tubes, plain serum tubes, and sterile forceps/scalpels.', critical: true },
      { id: 'sp2', label: 'Vesicular Epithelium Harvesting (FMD)', details: 'Excise at least 1–2 grams of fresh unruptured or freshly ruptured vesicle wall. Immerse immediately in transport media.', critical: true },
      { id: 'sp3', label: 'Skin Biopsy Harvesting (LSD / Pox)', details: 'Clean site with alcohol, take full-thickness punch biopsy at active nodule margin, place in transport vial.', critical: false },
      { id: 'sp4', label: 'Blood Sampling & Centrifugation', details: 'Collect 10 mL jugular blood in plain tube for serum and 5 mL in EDTA tube for antigen/PCR. Allow clot retraction and separate serum within 6 hours.', critical: true },
      { id: 'sp5', label: 'Triple Packaging System', details: 'Primary leak-proof vial -> Secondary sealed plastic pouch with absorbent material -> Rigid outer insulated cooler box with frozen ice packs.', critical: true },
      { id: 'sp6', label: 'Accompanying Laboratory Submission Form', details: 'Enclose completed paper/digital lab submission form in waterproof ziplock bag inside outer packaging.', critical: true }
    ],
    sopGuidance: [
      'Maintain continuous 2°C to 8°C cold chain during road transit.',
      'Never freeze tissue samples in glycerol buffer below -20°C if virus isolation is planned.'
    ],
    interactiveFormType: 'sampling_checklist'
  },
  {
    id: 'tool-biosecurity-audit',
    title: 'Farm & Livestock Market Biosecurity Assessment',
    category: 'Biosecurity',
    description: 'Quantitative risk assessment audit tool for evaluating disease introduction vulnerability at livestock holding facilities, feedlots, and primary markets.',
    targetUser: 'Animal Health Inspectors, Market Surveillance Officers',
    stepsOrItems: [
      { id: 'b1', label: 'Perimeter Fencing & Access Control', details: 'Presence of secure fencing preventing stray animal entry and dedicated single-entry vehicle disinfection dip.', critical: false },
      { id: 'b2', label: 'Quarantine Holding Area for New Arrivals', details: 'Designated 21-day isolation paddock located at least 100 meters away from main resident herd.', critical: true },
      { id: 'b3', label: 'Clean Water & Feed Bunk Sanitation', details: 'Water troughs elevated, regularly disinfected, and protected from wild bird/rodent fecal contamination.', critical: false },
      { id: 'b4', label: 'Dead Animal Carcass Disposal Protocol', details: 'Dedicated burial pit with quicklime or incineration unit compliant with veterinary public health rules.', critical: true },
      { id: 'b5', label: 'Personnel Footwear & Equipment Disinfection', details: 'Active boot-dip containers with fresh disinfectant (2% Virkon or 4% soda ash) at all barn entrances.', critical: false }
    ],
    sopGuidance: [
      'Score each parameter 1 to 5 to generate facility biosecurity risk index.',
      'Provide immediate corrective action notices for scores below 70%.'
    ],
    interactiveFormType: 'biosecurity_audit'
  }
];

export const fastLabMatricesData: FastLabDiagnosticMatrix[] = [
  {
    diseaseId: 'fmd',
    diseaseName: 'Foot-and-Mouth Disease (FMD)',
    preferredSample: 'Vesicular epithelium (>1g), Vesicular fluid, Serum',
    transportMedia: '50% Phosphate-buffered glycerol (pH 7.2–7.6) on ice',
    primaryTest: 'Solid-Phase Competition ELISA (SPCE) & Antigen-Detection ELISA',
    confirmatoryTest: 'Real-Time RT-PCR & Virus Isolation on BHK-21 cells',
    nationalLabCapacity: 'AHI Sebeta National Reference Lab + Regional Diagnostic Centers',
    biosafetyRequirement: 'BSL-3 Agriculture (for live virus)',
    turnaroundTime: '24–48 hours for PCR/ELISA; 4–7 days for typing/isolation',
    interpretationNotes: 'NSP 3ABC ELISA differentiates vaccinated from naturally infected animals in DIVA vaccination programs.'
  },
  {
    diseaseId: 'ppr',
    diseaseName: 'Peste des Petits Ruminants (PPR)',
    preferredSample: 'Ocular/nasal swabs, Lymph nodes, Lung tissue, Serum',
    transportMedia: 'Viral Transport Media (VTM) at 4°C',
    primaryTest: 'Antigen-Capture Sandwich ELISA',
    confirmatoryTest: 'Real-Time RT-PCR & Competitive ELISA (cELISA) for antibodies',
    nationalLabCapacity: 'High capacity at AHI Sebeta and Bedele/Dire Dawa Regional Labs',
    biosafetyRequirement: 'BSL-2',
    turnaroundTime: '24 hours for PCR; 48 hours for ELISA',
    interpretationNotes: 'cELISA antibody detection validates post-vaccination flock immunity (>80% target for national eradication).'
  },
  {
    diseaseId: 'lsd',
    diseaseName: 'Lumpy Skin Disease (LSD)',
    preferredSample: 'Skin nodule biopsy, Scabs, EDTA blood (febrile phase)',
    transportMedia: 'Sterile isotonic saline with antibiotics at 4°C',
    primaryTest: 'Real-Time Capripox PCR',
    confirmatoryTest: 'Virus Isolation on primary lamb testis / SNT',
    nationalLabCapacity: 'Available at AHI Sebeta and Regional Labs',
    biosafetyRequirement: 'BSL-2',
    turnaroundTime: '24–72 hours',
    interpretationNotes: 'PCR rapidly distinguishes virulent field strains from vaccine-associated mild reactions.'
  },
  {
    diseaseId: 'cbpp',
    diseaseName: 'Contagious Bovine Pleuropneumonia (CBPP)',
    preferredSample: 'Hepatized lung tissue, Pleural fluid, Serum',
    transportMedia: 'Mycoplasma transport medium / Plain sterile tubes on wet ice',
    primaryTest: 'Competitive ELISA (cELISA) & CFT',
    confirmatoryTest: 'Specific M. mycoides subsp. mycoides PCR & Broth Culture',
    nationalLabCapacity: 'AHI Sebeta Reference Facility',
    biosafetyRequirement: 'BSL-2',
    turnaroundTime: '48 hours for serology; up to 14 days for culture',
    interpretationNotes: 'cELISA has high specificity for herd-level prevalence mapping and abattoir surveillance validation.'
  },
  {
    diseaseId: 'ccpp',
    diseaseName: 'Contagious Caprine Pleuropneumonia (CCPP)',
    preferredSample: 'Thoracic pleural fluid, Lung tissue biopsy',
    transportMedia: 'Sterile tubes on ice packs',
    primaryTest: 'Latex Agglutination Test (field/bench) & cELISA',
    confirmatoryTest: 'Real-Time PCR (Mccp specific primers)',
    nationalLabCapacity: 'AHI Sebeta National Reference Lab',
    biosafetyRequirement: 'BSL-2',
    turnaroundTime: '24–48 hours',
    interpretationNotes: 'Latex agglutination provides rapid field-level screening within 15 minutes.'
  },
  {
    diseaseId: 'anthrax',
    diseaseName: 'Anthrax (Bacillus anthracis)',
    preferredSample: 'Peripheral ear-vein blood smear, Blood swab on sterile cotton',
    transportMedia: 'Dry sealed container (DO NOT OPEN CARCASS)',
    primaryTest: 'Polychrome Methylene Blue (McFadyean) Capsule Staining Microscopy',
    confirmatoryTest: 'Real-Time PCR (pagA, capA) & Selective Culture on PLET agar',
    nationalLabCapacity: 'All Regional Veterinary Labs & AHI Sebeta',
    biosafetyRequirement: 'BSL-3 for culture; BSL-2 with PPE for stained smears',
    turnaroundTime: '2 hours for field microscopy; 24 hours for PCR/culture',
    interpretationNotes: 'Demonstration of encapsulated square-ended purple bacilli in McFadyean stain provides immediate provisional confirmation.'
  },
  {
    diseaseId: 'rabies',
    diseaseName: 'Rabies (Rabies Lyssavirus)',
    preferredSample: 'Intact brain tissue (hippocampus, cerebellum, brainstem)',
    transportMedia: '50% glycerol-saline on wet ice (Triple packaging with biohazard labeling)',
    primaryTest: 'Direct Fluorescent Antibody (DFA) Test (Gold Standard)',
    confirmatoryTest: 'Direct Rapid Immunohistochemical Test (dRIT) & RT-PCR',
    nationalLabCapacity: 'AHI Sebeta & Ethiopian Public Health Institute (EPHI)',
    biosafetyRequirement: 'BSL-2 with mandatory rabies immunization for technicians',
    turnaroundTime: '2–4 hours post brain extraction',
    interpretationNotes: 'DFA has >99% sensitivity and specificity; negative test requires adequate bilateral brainstem/cortex representation.'
  },
  {
    diseaseId: 'rvf',
    diseaseName: 'Rift Valley Fever (RVF)',
    preferredSample: 'Aborted fetus liver, Spleen, EDTA blood, Serum',
    transportMedia: 'Viral Transport Media on dry ice / wet ice',
    primaryTest: 'IgM Capture ELISA (acute phase)',
    confirmatoryTest: 'Real-Time RT-PCR & Virus Isolation in cell culture',
    nationalLabCapacity: 'AHI Sebeta & EPHI National Reference Labs',
    biosafetyRequirement: 'BSL-3 (due to high aerosol risk and human fatality)',
    turnaroundTime: '24–48 hours',
    interpretationNotes: 'IgM indicates active recent infection; IgG signifies historical exposure or vaccination.'
  }
];

export const fastOneHealthData: FastOneHealthInterface[] = [
  {
    id: 'oh-rabies',
    domain: 'Zoonoses',
    title: 'Dog-Mediated Human Rabies Elimination',
    animalSector: 'Canine census, 70% mass rabies vaccination campaigns, dog ecology and roaming control in Hararghe woredas.',
    humanHealthSector: 'PHEM bite surveillance, rapid access to Post-Exposure Prophylaxis (PEP) in primary health centers, community awareness.',
    wildlifeSector: 'Monitoring spillover in jackals and endangered Ethiopian wolf populations.',
    environmentSector: 'Abattoir offal and municipal garbage management to reduce feral dog carrying capacity.',
    priorityLevel: 'Critical',
    surveillanceLinkage: 'Integrated bite registry linking veterinary dog quarantine reports to hospital PEP registries.',
    jointInterventionProtocols: [
      'Joint Animal-Human Health District Outbreak Investigation within 24 hours of suspected human bite case',
      'Community dog vaccination drives co-located with childhood immunization campaigns',
      'Shared monthly surveillance briefing between Regional Health Bureau and Bureau of Agriculture'
    ]
  },
  {
    id: 'oh-anthrax',
    domain: 'Zoonoses',
    title: 'Soil-Borne Anthrax Outbreak Rapid Suppression',
    animalSector: 'Prophylactic livestock vaccination with Stern strain vaccine, safe carcass disposal, pasture quarantine.',
    humanHealthSector: 'Clinical detection of cutaneous and gastrointestinal anthrax, distribution of prophylactic ciprofloxacin/doxycycline.',
    wildlifeSector: 'Surveillance of carcass mortalities in wild ungulates in national parks and reserves.',
    environmentSector: 'Mapping soil alkaline/calcium risk zones, waterhole decontamination, prohibition of agricultural tillage in burial sites.',
    priorityLevel: 'Critical',
    surveillanceLinkage: 'Automated ADNIS notification to PHEM upon any sudden livestock death with oozing non-clotting blood.',
    jointInterventionProtocols: [
      'Immediate joint field dispatch: Veterinary team handles carcass burial; Medical team initiates human contact tracing',
      'Strict joint ban on emergency slaughter and unauthorized meat transport during active outbreaks'
    ]
  },
  {
    id: 'oh-rvf',
    domain: 'Vector-Borne & Climate',
    title: 'Rift Valley Fever Climate Early Warning & Vector Control',
    animalSector: 'Sentinel herd sero-surveillance, livestock vaccination during inter-epizootic years, reporting abortion clusters.',
    humanHealthSector: 'Syndromic surveillance of acute febrile illness and hemorrhagic cases in clinics, personal protective gear for abattoir workers.',
    wildlifeSector: 'Monitoring wildlife abortive mortalities and mosquito feeding preferences.',
    environmentSector: 'Satellite tracking of Normalized Difference Vegetation Index (NDVI), rainfall anomalies, and larval mosquito breeding pools.',
    priorityLevel: 'High',
    surveillanceLinkage: 'Meteorological and NDVI early warning alerts directly trigger enhanced veterinary and public health readiness.',
    jointInterventionProtocols: [
      'Targeted larviciding in high-density flood pools prior to vector emergence',
      'Pre-season livestock vaccination campaigns before forecasted heavy rains',
      'Public communication regarding avoiding contact with aborted fetuses and raw milk'
    ]
  },
  {
    id: 'oh-amr',
    domain: 'AMR',
    title: 'Antimicrobial Resistance (AMR) in Livestock-Food Value Chains',
    animalSector: 'Veterinary antimicrobial stewardship, regulation of over-the-counter antibiotic sales, prohibition of antibiotics as growth promoters.',
    humanHealthSector: 'Hospital surveillance of multidrug-resistant zoonotic pathogens (Salmonella, Campylobacter, E. coli).',
    environmentSector: 'Monitoring veterinary drug residue and resistant genes in wastewater from slaughterhouses and dairy farms.',
    priorityLevel: 'High',
    surveillanceLinkage: 'Joint animal-human isolate resistance profiling against critical antimicrobials (3rd gen cephalosporins, fluoroquinolones).',
    jointInterventionProtocols: [
      'Enforcement of veterinary prescription requirements for critical antimicrobials',
      'Training community animal health workers (CAHWs) on correct dosage and withdrawal periods'
    ]
  }
];

export const fastTrainingCoursesData: FastTrainingCourse[] = [
  {
    id: 'course-eufmd-01',
    title: 'EuFMD FAST Disease Online Training & Simulation',
    provider: 'European Commission for the Control of Foot-and-Mouth Disease (EuFMD) / FAO',
    duration: '4 Weeks (Self-paced, 15 Hours)',
    targetAudience: 'Field Veterinarians, National Epidemiologists, Diagnostic Laboratory Staff',
    level: 'Intermediate',
    description: 'Comprehensive e-learning curriculum covering clinical recognition, outbreak investigation, emergency vaccination planning, and international reporting for FAST diseases.',
    modules: [
      'Module 1: Introduction to Transboundary FAST Diseases (FMD, PPR, LSD, SGP, CBPP, RVF)',
      'Module 2: Pathognomonic Lesion Identification and Differential Diagnosis',
      'Module 3: Field Biosecurity, Personal Safety, and Disinfection Protocols',
      'Module 4: Diagnostic Specimen Collection, Packaging, and Cold Chain Maintenance',
      'Module 5: Outbreak Data Capture, Contact Tracing, and Spatial Risk Mapping'
    ],
    learningObjectives: [
      'Accurately identify and differentiate clinical signs of 8 priority FAST diseases in livestock',
      'Execute safe, contamination-free diagnostic sampling under field conditions',
      'Formulate immediate containment, movement restriction, and ring vaccination plans'
    ],
    certificateAvailable: true,
    linkUrl: 'https://eufmdlearning.works'
  },
  {
    id: 'course-fao-fetpv',
    title: 'Frontline In-Service Applied Veterinary Epidemiology (FETPV)',
    provider: 'FAO Emergency Centre for Transboundary Animal Diseases (ECTAD) & MoA',
    duration: '3 Months (Blended Classroom & Field Mentorship)',
    targetAudience: 'District & Zonal Animal Health Officers across East & West Hararghe',
    level: 'Advanced',
    description: 'Practical field epidemiology training program empowering local veterinary officers to detect, investigate, and analyze disease outbreaks using real-time surveillance tools.',
    modules: [
      'Module 1: Surveillance Fundamentals & Data Quality Management',
      'Module 2: Field Outbreak Investigation & Case-Control Studies',
      'Module 3: Geographic Information Systems (GIS) & Epidemic Curve Analysis',
      'Module 4: Scientific Communication & Preparation of AI SITREPs for Decision-Makers'
    ],
    learningObjectives: [
      'Perform quantitative epidemiological calculations (attack rate, CFR, relative risk)',
      'Manage digital data collection systems (ADNIS, KoboToolbox, ODK)',
      'Draft actionable evidence-based policy briefs for zonal and regional leadership'
    ],
    certificateAvailable: true,
    linkUrl: 'https://www.fao.org/ag/againfo/programmes/en/empres/news_180419.html'
  },
  {
    id: 'course-one-health-03',
    title: 'Community One Health Zoonotic Disease Surveillance & Prevention',
    provider: 'Ethiopian Public Health Institute (EPHI) & Animal Health Institute (AHI)',
    duration: '1 Week (Intensive Workshop, 30 Hours)',
    targetAudience: 'Community Animal Health Workers (CAHWs), Health Extension Workers (HEWs)',
    level: 'Foundational',
    description: 'Cross-sectoral grassroots training uniting animal and human health extension workers to coordinate rabies bite response, anthrax warnings, and hygiene education.',
    modules: [
      'Module 1: Principles of One Health at Community Level',
      'Module 2: Rabies Prevention, Wound Washing, and Canine Vaccination Logistics',
      'Module 3: Safe Carcass Handling & Anthrax Warning Signs',
      'Module 4: Joint Community Outreach & Crisis Communication'
    ],
    learningObjectives: [
      'Establish direct communication channels between local animal health clinics and health posts',
      'Educate rural pastoralists on safe meat handling and raw milk hazards',
      'Rapidly report cluster mortalities to district veterinary and health offices'
    ],
    certificateAvailable: true
  }
];
