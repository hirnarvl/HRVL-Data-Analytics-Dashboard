import { Locale } from '../types';

export interface Translations {
  // Header / Branding
  title: string;
  badge: string;
  subtitle: string;
  importedDataRange: string;
  offlineCacheActive: string;
  cachedLocally: string;

  // Tabs
  dashboard: string;
  map: string;
  tables: string;
  vaccineCalendar: string;
  fastToolbox: string;
  fastDiseases: string;
  resourceLibrary: string;
  fieldInvestigation: string;
  fieldToolkit: string;
  labDiagnostics: string;
  oneHealth: string;
  trainingHub: string;

  // Quick Filters
  allZones: string;
  eastHararghe: string;
  westHararghe: string;

  // Action Buttons
  logArrival: string;
  profileSimulator: string;
  simulatorActive: string;
  multiExcelImport: string;
  yoyAnalysis: string;
  csvExport: string;
  aiSitrepReport: string;
  googleDrive: string;
  openAccessPortal: string;
  supportTemplate: string;
  resetCache: string;
  portraitView: string;
  portraitActive: string;
  fieldPrintSnapshot: string;
  exitPrintView: string;
  signIn: string;
  signOut: string;

  // Theme
  dayMode: string;
  nightMode: string;

  // Language selector
  language: string;
  selectLanguage: string;
  // AI Report Modal
  generatingReport: string;
  synthesizingData: string;
  outbreakEvaluation: string;
  recommendations: string;
  close: string;
  printOfficial: string;
  // Tables
  tblSearch: string;
  tblExportCSV: string;
  tblShowingRecords: string;
  tblRows: string;
  tblPage: string;
  tblOf: string;
  
  // Columns
  colDiseaseName: string;
  colOutbreaks: string;
  colTotalCases: string;
  colDeaths: string;
  colMorbidity: string;
  colCFR: string;
  colPrimarySpecies: string;
  colRiskLevel: string;

  colWoreda: string;
  colZone: string;
  colStatus: string;
  colStartDate: string;
  colDuration: string;

  colDate: string;
  colSpecies: string;
  colCases: string;
  colReporter: string;

  colComplianceRate: string;
  colTimeliness: string;
  colZeroReports: string;
  colExpected: string;
  colSubmitted: string;
  
  // Table Titles
  titleDiseaseSummary: string;
  titleActiveOutbreaks: string;
  titleSurveillanceLog: string;
  titleCompliance: string;

  // Species Donut
  speciesDistributionTitle: string;
  speciesTotal: string;
  speciesCasesLabel: string;
  speciesTotalCases: string;

  // CFR
  cfrCaseFatality: string;
  cfrWAHOBenchmark: string;
  cfrYoYComparative: string;
  cfrAllDiseases: string;
  cfrSelectFocus: string;
  cfrTargetKeep: string;
  cfrTargetThreshold: string;

  // MEL Scorecard
  melPerformance: string;
  wahoRegionalScorecard: string;
  melAllZones: string;
  melComplianceRate: string;
  melZeroReports: string;
  melTimeliness: string;
  melScore: string;
  melNeedsImprovement: string;
  melModerate: string;
  melExcellent: string;
  melGenerateSitrep: string;
  melCompileData: string;

  // Trends
  chartEpidemiologicalCurves: string;
  chartHistoricalOverlay: string;
  chartYoYComparison: string;
  chartTimeline: string;
  chartDaily: string;
  chartWeekly: string;
  chartMonthly: string;
  chartLegendCases: string;
  chartLegendCases2025: string;
  chartLegendCases2024: string;
  chartLegendDeaths: string;
  chartLegendZero: string;

  kpiSurveillance: string;
  kpiZeroDisease: string;
  kpiLabConfirmed: string;
  kpiVerified: string;
  kpiHrvlDiagnostic: string;
  kpiLabVerifiedCases: string;
  kpiActiveOutbreaks: string;
  kpiQuarantined: string;
  kpiEmergencyAlert: string;
  kpiFmdPprLsd: string;
  kpiOverallCfr: string;
  kpiAboveLimit: string;
  kpiWithinThreshold: string;
  kpiDeaths: string;
  kpiTotalAnimalCases: string;
  kpiMelReporting: string;
  kpiTarget80: string;
  kpiWoredas36: string;
  kpiWeeklySubmission: string;
  kpiAffectedWoredas: string;
  kpiSpread: string;
  kpiSpatialIndex: string;
  kpiEastWestHararghe: string;
  kpiNetworkCoverage: string;
  kpiMelCompliance: string;
  kpiWahoBenchmark: string;
  kpiEastZone: string;
  kpiReportingCompleteness: string;
  kpiHighDensityEast: string;
  kpiWestZone: string;
  kpiHighDensityWest: string;

}

export const translations: Record<Locale, Translations> = {
  en: {
    title: 'Hirna RVL Analytics',
    badge: 'Oromia HRVL',
    subtitle: 'Regional Veterinary Laboratory • East (21) & West (15) Hararghe',
    importedDataRange: 'Imported Data Range:',
    offlineCacheActive: 'Offline Cache Active',
    cachedLocally: 'Cached Locally',

    dashboard: 'Dashboard',
    map: 'Map',
    tables: 'Tables',
    vaccineCalendar: 'Vaccine Calendar',
    fastToolbox: 'FAST & One Health',
    fastDiseases: 'FAST Diseases',
    resourceLibrary: 'Resource Library',
    fieldInvestigation: 'Field Investigation',
    fieldToolkit: 'Field Toolkit',
    labDiagnostics: 'Lab Diagnostics',
    oneHealth: 'One Health',
    trainingHub: 'Training Hub',

    allZones: 'All Zones (36 Woredas)',
    eastHararghe: 'E/H (21)',
    westHararghe: 'W/H (15)',

    logArrival: 'Log Arrival',
    profileSimulator: 'Simulator',
    simulatorActive: 'Simulator Active',
    multiExcelImport: 'Excel Import',
    yoyAnalysis: 'YoY Trends',
    csvExport: 'CSV',
    aiSitrepReport: 'AI Report',
    googleDrive: 'Drive',
    openAccessPortal: 'Resources',
    supportTemplate: 'Support',
    resetCache: 'Reset',
    portraitView: '📱 Portrait',
    portraitActive: '📱 Portrait Active',
    fieldPrintSnapshot: '🖨️ Field Print',
    exitPrintView: '🖨️ Exit Print',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    dayMode: 'Day',
    nightMode: 'Night',

    language: 'Language',
    selectLanguage: 'Select Language',
    generatingReport: 'Generating Epidemiological Narrative...',
    synthesizingData: 'Synthesizing E/H & W/H disease dynamics with Gemini AI',
    outbreakEvaluation: 'Outbreak Evaluation & Transboundary Risks:',
    recommendations: 'Actionable Epidemiological Recommendations:',
    close: 'Close',
    printOfficial: 'Print Official Field Report',
    tblSearch: 'Search...',
    tblExportCSV: 'CSV',
    tblShowingRecords: 'Showing',
    tblRows: 'Rows:',
    tblPage: 'Page',
    tblOf: 'of',
    
    colDiseaseName: 'Disease Name',
    colOutbreaks: 'Outbreaks',
    colTotalCases: 'Total Cases',
    colDeaths: 'Deaths',
    colMorbidity: 'Morbidity %',
    colCFR: 'CFR %',
    colPrimarySpecies: 'Primary Species',
    colRiskLevel: 'Risk Level',

    colWoreda: 'Woreda',
    colZone: 'Zone',
    colStatus: 'Status',
    colStartDate: 'Start Date',
    colDuration: 'Duration',

    colDate: 'Date',
    colSpecies: 'Species',
    colCases: 'Cases',
    colReporter: 'Reporter',

    colComplianceRate: 'Compliance Rate',
    colTimeliness: 'Timeliness',
    colZeroReports: 'Zero Reports',
    colExpected: 'Expected',
    colSubmitted: 'Submitted',

    titleDiseaseSummary: 'Disease Summary',
    titleActiveOutbreaks: 'Active Outbreaks',
    titleSurveillanceLog: 'Surveillance Log',
    titleCompliance: 'Compliance',

    speciesDistributionTitle: 'Livestock Species Distribution (7 Species)',
    speciesTotal: 'Total:',
    speciesCasesLabel: 'cases',
    speciesTotalCases: 'Total Cases',

    cfrCaseFatality: 'Case Fatality Rate (CFR) Trajectory',
    cfrWAHOBenchmark: 'WAHO Benchmarked Timeline',
    cfrYoYComparative: 'YoY Comparative',
    cfrAllDiseases: 'All Diseases (2026)',
    cfrSelectFocus: 'Select Focus Disease:',
    cfrTargetKeep: 'Target: Keep non-Anthrax CFR < 10%',
    cfrTargetThreshold: 'Target Threshold (10%)',

    melPerformance: 'MEL Performance & Data Quality',
    wahoRegionalScorecard: 'WAHO Regional Compliance Scorecard',
    melAllZones: 'All Zones',
    melComplianceRate: 'Compliance Rate',
    melZeroReports: 'Zero Reports',
    melTimeliness: 'Timeliness',
    melScore: 'Score',
    melNeedsImprovement: 'Needs Improvement',
    melModerate: 'Moderate',
    melExcellent: 'Excellent',
    melGenerateSitrep: 'Generate Official SitRep',
    melCompileData: 'Compile data into WAHO standard report',

    chartEpidemiologicalCurves: 'Epidemiological Curves (WAHO)',
    chartHistoricalOverlay: 'Historical Overlay:',
    chartYoYComparison: 'YoY Comparison',
    chartTimeline: 'Timeline:',
    chartDaily: 'Daily',
    chartWeekly: 'Weekly',
    chartMonthly: 'Monthly',
    chartLegendCases: 'Cases (Current)',
    chartLegendCases2025: 'Cases 2025',
    chartLegendCases2024: 'Cases 2024',
    chartLegendDeaths: 'Deaths',
    chartLegendZero: 'Zero Reports',

    kpiSurveillance: 'Surveillance Field Submissions',
    kpiZeroDisease: 'zero-disease validations',
    kpiLabConfirmed: 'Lab Confirmed vs Suspected',
    kpiVerified: 'Verified',
    kpiHrvlDiagnostic: 'HRVL Diagnostic',
    kpiLabVerifiedCases: 'Laboratory verified cases',
    kpiActiveOutbreaks: 'Active Outbreaks (Critical)',
    kpiQuarantined: 'Quarantined',
    kpiEmergencyAlert: 'EMERGENCY ALERT',
    kpiFmdPprLsd: 'FMD, PPR, LSD, Newcastle, CBPP',
    kpiOverallCfr: 'Overall Case Fatality Rate',
    kpiAboveLimit: 'Above WOAH Limit',
    kpiWithinThreshold: 'Within Threshold',
    kpiDeaths: 'Deaths',
    kpiTotalAnimalCases: 'Total animal cases:',
    kpiMelReporting: 'MEL Reporting Compliance',
    kpiTarget80: 'Target >= 80%',
    kpiWoredas36: '36 Woredas',
    kpiWeeklySubmission: 'Weekly submission completeness',
    kpiAffectedWoredas: 'Affected Woredas Ratio',
    kpiSpread: 'Spread',
    kpiSpatialIndex: 'Spatial Index',
    kpiEastWestHararghe: 'East (21) & West (15) Hararghe',
    kpiNetworkCoverage: 'HRVL Network Coverage',
    kpiMelCompliance: 'MEL Compliance',
    kpiWahoBenchmark: 'WAHO Benchmark: ≥80% weekly reporting completeness',
    kpiEastZone: 'East Hararghe Zone',
    kpiReportingCompleteness: 'Reporting Completeness',
    kpiHighDensityEast: 'High Density: Haramaya, Babile, Dadar, Girawa',
    kpiWestZone: 'West Hararghe Zone',
    kpiHighDensityWest: 'High Density: Chiro, Daro Lebu, Habro, Mieso',

  },
  om: {
    title: 'Xiinxala HRVL Hirnaa',
    badge: 'HRVL Oromiyaa',
    subtitle: 'Laaboraatoorii Beekumsa Beeyladaa Naannoo • Harargee Bahaa (21) & Dhihaa (15)',
    importedDataRange: 'Hangamtaa Daataa:',
    offlineCacheActive: 'Kuusaa Oflaayinii Active',
    cachedLocally: 'Lokaaliidhaan Kuusame',

    dashboard: 'Daashboordii',
    map: 'Kartaadhaa',
    tables: 'Gabateewwan',
    vaccineCalendar: 'Kaalaandarii Talaallii',
    fastToolbox: 'Meeshaalee FAST & Fayyaa Tokko',
    fastDiseases: 'Dhibeewwan FAST',
    resourceLibrary: 'Kuusaa Qabeenyaa',
    fieldInvestigation: 'Qorannoo Dirree',
    fieldToolkit: 'Meeshaa Dirree',
    labDiagnostics: 'Qorannoo Laaboraatoorii',
    oneHealth: 'Fayyaa Tokko',
    trainingHub: 'Giddugala Leenjii',

    allZones: 'Aanaalee Hunda (Aanaa 36)',
    eastHararghe: 'Harargee Bahaa (21)',
    westHararghe: 'Harargee Dhihaa (15)',

    logArrival: 'Gabaasa Galchu',
    profileSimulator: 'Fakkoomsaa Raagaduu',
    simulatorActive: 'Fakkoomsaan Hojiirra',
    multiExcelImport: 'Excel Fiduu',
    yoyAnalysis: 'Xiinxala Waggaa',
    csvExport: 'CSV Erguu',
    aiSitrepReport: 'Gabaasa AI SitRep',
    googleDrive: 'Google Drive',
    openAccessPortal: 'Portal Banamaa',
    supportTemplate: 'Maxxansa Deeggarsaa',
    resetCache: 'Kuusaa Qulqulleessuu',
    portraitView: '📱 Mul\'ata Dhabaa',
    portraitActive: '📱 Mul\'ata Dhabaa Active',
    fieldPrintSnapshot: '🖨️ Fakkii Maxxansaa',
    exitPrintView: '🖨️ Maxxansa irraa Ba\'i',
    signIn: 'Seenuu',
    signOut: 'Ba\'uu',
    dayMode: 'Guyyaa',
    nightMode: 'Halkan',

    language: 'Afaan',
    selectLanguage: 'Afaan Filadhu',
    generatingReport: 'Gabaasa dhibee uumamaa qopheessuutti...',
    synthesizingData: 'Haala dhibee H/Bahaa & H/Dhihaa Gemini AI dhaan walitti qabutti',
    outbreakEvaluation: 'Madaallii Dhibee Daddarbaa & Balaa Daangaa Ce\'uu:',
    recommendations: 'Tarkaanfiiwwan Yaalii Dhukkubaa Fudhachuu Qaban:',
    close: 'Cufi',
    printOfficial: 'Gabaasa Dirree Ifa Ta\'e Maxxansi',
    tblSearch: 'Barbaadi...',
    tblExportCSV: 'CSV',
    tblShowingRecords: 'Mul\'isaa jira',
    tblRows: 'Sarara:',
    tblPage: 'Fuula',
    tblOf: 'keessaa',
    
    colDiseaseName: 'Maqaa Dhibee',
    colOutbreaks: 'Dhibee Daddarbaa',
    colTotalCases: 'Waliigala Dhimmoota',
    colDeaths: 'Du\'a',
    colMorbidity: 'Hubama %',
    colCFR: 'CFR %',
    colPrimarySpecies: 'Sanyii Guddaa',
    colRiskLevel: 'Sadarkaa Balaa',

    colWoreda: 'Aanaa',
    colZone: 'Godina',
    colStatus: 'Haala',
    colStartDate: 'Guyyaa Eegalee',
    colDuration: 'Turtii',

    colDate: 'Guyyaa',
    colSpecies: 'Sanyii',
    colCases: 'Dhimmoota',
    colReporter: 'Gabaasaa',

    colComplianceRate: 'Reetii Raawwii',
    colTimeliness: 'Yeroon Gabaasuu',
    colZeroReports: 'Gabaasa Zeeroo',
    colExpected: 'Eegame',
    colSubmitted: 'Dhiyaate',

    titleDiseaseSummary: 'Guduunfaa Dhibee',
    titleActiveOutbreaks: 'Dhibee Daddarbaa',
    titleSurveillanceLog: 'Gabaasa Dirree',
    titleCompliance: 'Raawwii',

    speciesDistributionTitle: 'Raabsa Sanyii Beeyladaa (Sanyii 7)',
    speciesTotal: 'Waliigala:',
    speciesCasesLabel: 'dhimmoota',
    speciesTotalCases: 'Waliigala Dhimmoota',

    cfrCaseFatality: 'Daandii Reetii Du\'a Dhimmaa (CFR)',
    cfrWAHOBenchmark: 'Yeroo Safaroo WAHO',
    cfrYoYComparative: 'Xiinxala Waggaa',
    cfrAllDiseases: 'Dhibeewwan Hunda (2026)',
    cfrSelectFocus: 'Dhibee Xiyyeeffannoo Filadhu:',
    cfrTargetKeep: 'Galma: CFR Anthrax-alaa < 10% eeguu',
    cfrTargetThreshold: 'Daangaa Galmaa (10%)',

    melPerformance: 'Raawwii MEL fi Qulqullina Daataa',
    wahoRegionalScorecard: 'Kaardii Raawwii Naannoo WAHO',
    melAllZones: 'Godinoota Hunda',
    melComplianceRate: 'Reetii Raawwii',
    melZeroReports: 'Gabaasa Zeeroo',
    melTimeliness: 'Yeroon Gabaasuu',
    melScore: 'Qabxii',
    melNeedsImprovement: 'Fooyya\'uu Qaba',
    melModerate: 'Giddu-galeessa',
    melExcellent: 'Baay\'ee Gaarii',
    melGenerateSitrep: 'Gabaasa SitRep Ifa Ta\'e Qopheessi',
    melCompileData: 'Daataa ulaagaa WAHO tiin qopheessi',

    chartEpidemiologicalCurves: 'Daandiiwwan Dhibee (WAHO)',
    chartHistoricalOverlay: 'Daataa Seenaa:',
    chartYoYComparison: 'Xiinxala Waggaa',
    chartTimeline: 'Yeroo:',
    chartDaily: 'Guyyaa',
    chartWeekly: 'Torban',
    chartMonthly: 'Ji\'a',
    chartLegendCases: 'Dhukkuba (Amma)',
    chartLegendCases2025: 'Dhukkuba 2025',
    chartLegendCases2024: 'Dhukkuba 2024',
    chartLegendDeaths: 'Du\'a',
    chartLegendZero: 'Gabaasa Zeeroo',

    kpiSurveillance: 'Gabaasa Dirree Too\'annoo',
    kpiZeroDisease: 'mirkaneessa dhibee-malee',
    kpiLabConfirmed: 'Laabiraatooriidhaan Mirkanaa\'ee fi Shakkame',
    kpiVerified: 'Mirkanaa\'eera',
    kpiHrvlDiagnostic: 'Qorannoo HRVL',
    kpiLabVerifiedCases: 'Dhimmoota laabiraatooriidhaan mirkanaa\'an',
    kpiActiveOutbreaks: 'Dhibee Daddarbaa (Guddaa)',
    kpiQuarantined: 'Adda baafameera',
    kpiEmergencyAlert: 'AKEAKKACHIISAA HATATTAMAA',
    kpiFmdPprLsd: 'FMD, PPR, LSD, Newcastle, CBPP',
    kpiOverallCfr: 'Reetii Du\'a Dhimma Waliigalaa',
    kpiAboveLimit: 'Daangaa WOAH Ol',
    kpiWithinThreshold: 'Daangaa Keessatti',
    kpiDeaths: 'Du\'a',
    kpiTotalAnimalCases: 'Waliigala dhimmoota beeyladaa:',
    kpiMelReporting: 'Raawwii Gabaasa MEL',
    kpiTarget80: 'Galma >= 80%',
    kpiWoredas36: 'Aanaalee 36',
    kpiWeeklySubmission: 'Guutummaa gabaasa torbanii',
    kpiAffectedWoredas: 'Reeshiyoo Aanaalee Hubaman',
    kpiSpread: 'Baballina',
    kpiSpatialIndex: 'Indeksii Iddoo',
    kpiEastWestHararghe: 'Harargee Bahaa (21) & Dhihaa (15)',
    kpiNetworkCoverage: 'Uwwisa Neetworkii HRVL',
    kpiMelCompliance: 'Raawwii MEL',
    kpiWahoBenchmark: 'Safaroo WAHO: guutummaa gabaasa torbanii ≥80%',
    kpiEastZone: 'Godina Harargee Bahaa',
    kpiReportingCompleteness: 'Guutummaa Gabaasaa',
    kpiHighDensityEast: 'Tuuta Guddaa: Haramaya, Babile, Dadar, Girawa',
    kpiWestZone: 'Godina Harargee Dhihaa',
    kpiHighDensityWest: 'Tuuta Guddaa: Chiro, Daro Lebu, Habro, Mieso',

  },
  am: {
    title: 'የሂርና አር.ቪ.ኤል ዳታ ትንታኔ',
    badge: 'ኦሮሚያ HRVL',
    subtitle: 'የክልል እንስሳት ህክምና ላቦራቶሪ • ምስራቅ (21) እና ምዕራብ (15) ሐረርጌ',
    importedDataRange: 'የመረጃ ክልል:',
    offlineCacheActive: 'የኦፍላይን ካች ይሰራል',
    cachedLocally: 'በቦታው ተቀምጧል',

    dashboard: 'ዳሽቦርድ',
    map: 'ካርታ',
    tables: 'ሰንጠረዦች',
    vaccineCalendar: 'የክትባት ካላንደር',
    fastToolbox: 'የFAST እና አንድ ጤና መሣሪያዎች',
    fastDiseases: 'የFAST በሽታዎች',
    resourceLibrary: 'የመረጃ እና መመሪያዎች ቤተ-መጽሐፍት',
    fieldInvestigation: 'የመስክ ምርመራ',
    fieldToolkit: 'የመስክ መሣሪያዎች',
    labDiagnostics: 'የላብራቶሪ ምርመራ',
    oneHealth: 'አንድ ጤና',
    trainingHub: 'የስልጠና ማዕከል',

    allZones: 'ሁሉንም ወረዳዎች (36 ወረዳዎች)',
    eastHararghe: 'ምስራቅ ሐረርጌ (21)',
    westHararghe: 'ምዕራብ ሐረርጌ (15)',

    logArrival: 'መረጃ አስገባ',
    profileSimulator: 'የመረጃ አስመሳይ',
    simulatorActive: 'አስመሳይ እየሰራ ነው',
    multiExcelImport: 'ኤክሰል አስገባ',
    yoyAnalysis: 'የዓመት ትንተና',
    csvExport: 'CSV ላክ',
    aiSitrepReport: 'የAI ሪፖርት',
    googleDrive: 'ጉግል ድራይቭ',
    openAccessPortal: 'ክፍት የመረጃ ፖርታል',
    supportTemplate: 'የድጋፍ ቅጽ',
    resetCache: 'ካች አጽዳ',
    portraitView: '📱 የቁመት እይታ',
    portraitActive: '📱 ቁመት እይታ ላይ',
    fieldPrintSnapshot: '🖨️ የመስክ ህትመት',
    exitPrintView: '🖨️ ከህትመት ውጣ',
    signIn: 'ግቡ',
    signOut: 'ውጡ',
    dayMode: 'ቀን',
    nightMode: 'ሌሊት',

    language: 'ቋንቋ',
    selectLanguage: 'ቋንቋ ይምረጡ',
    generatingReport: 'የወረርሽኝ ሪፖርት በማዘጋጀት ላይ...',
    synthesizingData: 'የምስራቅ እና ምዕራብ ሐረርጌን በሽታዎች ሁኔታ በGemini AI በማቀናጀት ላይ',
    outbreakEvaluation: 'የበሽታ ወረርሽኝ ግምገማ እና የድንበር ተሻጋሪ አደጋዎች:',
    recommendations: 'መወሰድ ያለባቸው የበሽታ መከላከያ እርምጃዎች:',
    close: 'ዝጋ',
    printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',
    tblSearch: 'ፈልግ...',
    tblExportCSV: 'CSV',
    tblShowingRecords: 'እያሳየ ነው',
    tblRows: 'ረድፎች:',
    tblPage: 'ገጽ',
    tblOf: 'ከ',
    
    colDiseaseName: 'የበሽታው ስም',
    colOutbreaks: 'ወረርሽኞች',
    colTotalCases: 'አጠቃላይ ጉዳዮች',
    colDeaths: 'ሞት',
    colMorbidity: 'የመታመም መጠን %',
    colCFR: 'CFR %',
    colPrimarySpecies: 'ዋና ዝርያ',
    colRiskLevel: 'የአደጋ ደረጃ',

    colWoreda: 'ወረዳ',
    colZone: 'ዞን',
    colStatus: 'ሁኔታ',
    colStartDate: 'የጀመረበት ቀን',
    colDuration: 'ቆይታ',

    colDate: 'ቀን',
    colSpecies: 'ዝርያ',
    colCases: 'ጉዳዮች',
    colReporter: 'ሪፖርተር',

    colComplianceRate: 'የአፈጻጸም መጠን',
    colTimeliness: 'በወቅቱ ማቅረብ',
    colZeroReports: 'የዜሮ ሪፖርቶች',
    colExpected: 'የሚጠበቅ',
    colSubmitted: 'የቀረበ',

    titleDiseaseSummary: 'የበሽታ ማጠቃለያ',
    titleActiveOutbreaks: 'ንቁ ወረርሽኞች',
    titleSurveillanceLog: 'የመስክ ቁጥጥር ሪፖርት',
    titleCompliance: 'አፈጻጸም',

    speciesDistributionTitle: 'የእንስሳት ዝርያ ስርጭት (7 ዝርያዎች)',
    speciesTotal: 'አጠቃላይ:',
    speciesCasesLabel: 'ጉዳዮች',
    speciesTotalCases: 'አጠቃላይ ጉዳዮች',

    cfrCaseFatality: 'የሞት መጠን (CFR) አቅጣጫ',
    cfrWAHOBenchmark: 'የWAHO የጊዜ ሰሌዳ',
    cfrYoYComparative: 'የዓመት ንጽጽር',
    cfrAllDiseases: 'ሁሉም በሽታዎች (2026)',
    cfrSelectFocus: 'የትኩረት በሽታ ይምረጡ:',
    cfrTargetKeep: 'ዒላማ፡ ከአንትራክስ ውጭ CFR < 10% ማቆየት',
    cfrTargetThreshold: 'የዒላማ ገደብ (10%)',

    melPerformance: 'የMEL አፈጻጸም እና የመረጃ ጥራት',
    wahoRegionalScorecard: 'የWAHO ክልላዊ አፈጻጸም ካርድ',
    melAllZones: 'ሁሉንም ዞኖች',
    melComplianceRate: 'የአፈጻጸም መጠን',
    melZeroReports: 'የዜሮ ሪፖርቶች',
    melTimeliness: 'በወቅቱ ማቅረብ',
    melScore: 'ውጤት',
    melNeedsImprovement: 'መሻሻል ያስፈልገዋል',
    melModerate: 'መካከለኛ',
    melExcellent: 'በጣም ጥሩ',
    melGenerateSitrep: 'ይፋዊ SitRep አዘጋጅ',
    melCompileData: 'መረጃዎችን በWAHO መስፈርት አጠናቅር',

    chartEpidemiologicalCurves: 'የበሽታ መስመሮች (WAHO)',
    chartHistoricalOverlay: 'ታሪካዊ መረጃ:',
    chartYoYComparison: 'የዓመት ንጽጽር',
    chartTimeline: 'የጊዜ ሰሌዳ:',
    chartDaily: 'ቀን',
    chartWeekly: 'ሳምንት',
    chartMonthly: 'ወር',
    chartLegendCases: 'ጉዳዮች (አሁን)',
    chartLegendCases2025: 'ጉዳዮች 2025',
    chartLegendCases2024: 'ጉዳዮች 2024',
    chartLegendDeaths: 'ሞት',
    chartLegendZero: 'የዜሮ ሪፖርቶች',

    kpiSurveillance: 'የመስክ ቁጥጥር ሪፖርቶች',
    kpiZeroDisease: 'ከበሽታ ነጻ ማረጋገጫዎች',
    kpiLabConfirmed: 'በላብራቶሪ የተረጋገጠ እና የተጠረጠረ',
    kpiVerified: 'ተረጋግጧል',
    kpiHrvlDiagnostic: 'የHRVL ምርመራ',
    kpiLabVerifiedCases: 'በላብራቶሪ የተረጋገጡ ጉዳዮች',
    kpiActiveOutbreaks: 'ንቁ ወረርሽኞች (አስጊ)',
    kpiQuarantined: 'ተለይቷል',
    kpiEmergencyAlert: 'የአስቸኳይ ጊዜ ማስጠንቀቂያ',
    kpiFmdPprLsd: 'FMD, PPR, LSD, Newcastle, CBPP',
    kpiOverallCfr: 'አጠቃላይ የሞት መጠን',
    kpiAboveLimit: 'ከWOAH ገደብ በላይ',
    kpiWithinThreshold: 'በገደብ ውስጥ',
    kpiDeaths: 'ሞት',
    kpiTotalAnimalCases: 'አጠቃላይ የእንስሳት ጉዳዮች:',
    kpiMelReporting: 'የMEL ሪፖርት አፈጻጸም',
    kpiTarget80: 'ዒላማ >= 80%',
    kpiWoredas36: '36 ወረዳዎች',
    kpiWeeklySubmission: 'ሳምንታዊ የሪፖርት ሙሉነት',
    kpiAffectedWoredas: 'የተጠቁ ወረዳዎች መጠን',
    kpiSpread: 'ስርጭት',
    kpiSpatialIndex: 'የቦታ መረጃ ጠቋሚ',
    kpiEastWestHararghe: 'ምስራቅ (21) እና ምዕራብ (15) ሐረርጌ',
    kpiNetworkCoverage: 'የHRVL አውታረ መረብ ሽፋን',
    kpiMelCompliance: 'የMEL አፈጻጸም',
    kpiWahoBenchmark: 'WAHO መስፈርት፡ ሳምንታዊ ሪፖርት ሙሉነት ≥80%',
    kpiEastZone: 'ምስራቅ ሐረርጌ ዞን',
    kpiReportingCompleteness: 'የሪፖርት ሙሉነት',
    kpiHighDensityEast: 'ከፍተኛ ጥግግት፡ ሀረማያ፣ ባቢሌ፣ ዳዳር፣ ግራዋ',
    kpiWestZone: 'ምዕራብ ሐረርጌ ዞን',
    kpiHighDensityWest: 'ከፍተኛ ጥግግት፡ ጭሮ፣ ዳሮ ለቡ፣ ሀብሮ፣ ሚኤሶ',

  },
};

export const LANGUAGE_OPTIONS: { id: Locale; name: string; flag: string; nativeName: string }[] = [
  { id: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { id: 'om', name: 'Afaan Oromoo', flag: '🌳', nativeName: 'Afaan Oromoo' },
  { id: 'am', name: 'Amharic', flag: '🇪🇹', nativeName: 'አማርኛ' },
];
