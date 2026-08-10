const fs = require('fs');

let content = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
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
`;

const enTrans = `
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
`;

const omTrans = `
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
`;

const amTrans = `
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
`;

content = content.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
content = content.replace('printOfficial: \'Print Official Field Report\',', 'printOfficial: \'Print Official Field Report\',' + enTrans);
content = content.replace('printOfficial: \'Gabaasa Dirree Ifa Ta\\\'e Maxxansi\',', 'printOfficial: \'Gabaasa Dirree Ifa Ta\\\'e Maxxansi\',' + omTrans);
content = content.replace('printOfficial: \'ይፋዊ የመስክ ሪፖርት አትም\',', 'printOfficial: \'ይፋዊ የመስክ ሪፖርት አትም\',' + amTrans);

fs.writeFileSync('src/utils/translations.ts', content);
