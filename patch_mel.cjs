const fs = require('fs');

let tContent = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
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
`;

const enTrans = `
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
`;

const omTrans = `
    melPerformance: 'Raawwii MEL fi Qulqullina Daataa',
    wahoRegionalScorecard: 'Kaardii Raawwii Naannoo WAHO',
    melAllZones: 'Godinoota Hunda',
    melComplianceRate: 'Reetii Raawwii',
    melZeroReports: 'Gabaasa Zeeroo',
    melTimeliness: 'Yeroon Gabaasuu',
    melScore: 'Qabxii',
    melNeedsImprovement: 'Fooyya\\'uu Qaba',
    melModerate: 'Giddu-galeessa',
    melExcellent: 'Baay\\'ee Gaarii',
    melGenerateSitrep: 'Gabaasa SitRep Ifa Ta\\'e Qopheessi',
    melCompileData: 'Daataa ulaagaa WAHO tiin qopheessi',
`;

const amTrans = `
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
`;

tContent = tContent.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
tContent = tContent.replace("printOfficial: 'Print Official Field Report',", "printOfficial: 'Print Official Field Report'," + enTrans);
tContent = tContent.replace("printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi',", "printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi'," + omTrans);
tContent = tContent.replace("printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',", "printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም'," + amTrans);
fs.writeFileSync('src/utils/translations.ts', tContent);


let mContent = fs.readFileSync('src/components/MELScorecardPanel.tsx', 'utf8');

if (!mContent.includes('import { translations }')) {
  mContent = mContent.replace("import { SurveillanceRecord, Outbreak, WoredaCompliance, ZoneName } from '../types';", "import { SurveillanceRecord, Outbreak, WoredaCompliance, ZoneName, Locale } from '../types';\nimport { translations } from '../utils/translations';");
  mContent = mContent.replace("onSelectZone?: (zone: 'All' | ZoneName) => void;\n}", "onSelectZone?: (zone: 'All' | ZoneName) => void;\n  locale?: Locale;\n}");
  mContent = mContent.replace("onSelectZone\n}) => {", "onSelectZone,\n  locale = 'en'\n}) => {\n  const t = translations[locale];");
}

mContent = mContent.replace(/>\s*MEL Performance & Data Quality\s*</g, ">{t.melPerformance}<");
mContent = mContent.replace(/>\s*WAHO Regional Compliance Scorecard\s*</g, ">{t.wahoRegionalScorecard}<");
mContent = mContent.replace(/>\s*All Zones\s*</g, ">{t.melAllZones}<");
mContent = mContent.replace(/>\s*Compliance Rate\s*</g, ">{t.melComplianceRate}<");
mContent = mContent.replace(/>\s*Zero Reports\s*</g, ">{t.melZeroReports}<");
mContent = mContent.replace(/>\s*Timeliness\s*</g, ">{t.melTimeliness}<");
mContent = mContent.replace(/>\s*Score\s*</g, ">{t.melScore}<");
mContent = mContent.replace(/>\s*Needs Improvement\s*</g, ">{t.melNeedsImprovement}<");
mContent = mContent.replace(/>\s*Moderate\s*</g, ">{t.melModerate}<");
mContent = mContent.replace(/>\s*Excellent\s*</g, ">{t.melExcellent}<");
mContent = mContent.replace(/>\s*Generate Official SitRep\s*</g, ">{t.melGenerateSitrep}<");
mContent = mContent.replace(/>\s*Compile data into WAHO standard report\s*</g, ">{t.melCompileData}<");

fs.writeFileSync('src/components/MELScorecardPanel.tsx', mContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<MELScorecardPanel\s*records={filteredRecords}/g,
  '<MELScorecardPanel\n            locale={locale}\n            records={filteredRecords}'
);
fs.writeFileSync('src/App.tsx', appContent);
