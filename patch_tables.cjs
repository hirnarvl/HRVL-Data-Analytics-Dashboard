const fs = require('fs');

let tContent = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
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
`;

const enTrans = `
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
`;

const omTrans = `
    tblSearch: 'Barbaadi...',
    tblExportCSV: 'CSV',
    tblShowingRecords: 'Mul\\'isaa jira',
    tblRows: 'Sarara:',
    tblPage: 'Fuula',
    tblOf: 'keessaa',
    
    colDiseaseName: 'Maqaa Dhibee',
    colOutbreaks: 'Dhibee Daddarbaa',
    colTotalCases: 'Waliigala Dhimmoota',
    colDeaths: 'Du\\'a',
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
`;

const amTrans = `
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
`;

if (!tContent.includes('tblSearch: string;')) {
  tContent = tContent.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
  tContent = tContent.replace("printOfficial: 'Print Official Field Report',", "printOfficial: 'Print Official Field Report'," + enTrans);
  tContent = tContent.replace("printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi',", "printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi'," + omTrans);
  tContent = tContent.replace("printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',", "printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም'," + amTrans);
  fs.writeFileSync('src/utils/translations.ts', tContent);
}


function patchTable(fileName) {
  let content = fs.readFileSync('src/components/' + fileName, 'utf8');

  if (!content.includes('import { translations }')) {
    content = content.replace("import { exportToCSV } from '../utils/export';", "import { exportToCSV } from '../utils/export';\nimport { Locale } from '../types';\nimport { translations } from '../utils/translations';");
    content = content.replace("interface " + fileName.replace('.tsx', '') + "Props {", "interface " + fileName.replace('.tsx', '') + "Props {\n  locale?: Locale;");
    
    // Add t variable
    const match = content.match(/export const (.*?) = \(\{ (.*?)\}\) => \{/);
    if(match) {
        let args = match[2];
        let newArgs = args;
        if(newArgs.includes("locale = 'en'") === false) {
            newArgs = newArgs + ", locale = 'en'";
        }
        content = content.replace(match[0], `export const ${match[1]} = ({ ${newArgs} }) => {\n  const t = translations[locale];`);
    }
  }

  // Common replacements
  content = content.replace(/placeholder="Search(?: by [^"]+)?"/g, 'placeholder={t.tblSearch}');
  content = content.replace(/>\s*CSV\s*</g, '>{t.tblExportCSV}<');
  content = content.replace(/>\s*Rows:\s*</g, '>{t.tblRows}<');
  content = content.replace(/>\s*Page\s*</g, '>{t.tblPage}<');
  content = content.replace(/>\s*of /g, '>{t.tblOf} ');
  content = content.replace(/<span>Showing /g, '<span>{t.tblShowingRecords} ');
  
  // Specific columns
  content = content.replace(/>\s*Disease Name\s*</g, '>{t.colDiseaseName}<');
  content = content.replace(/>\s*Outbreaks\s*</g, '>{t.colOutbreaks}<');
  content = content.replace(/>\s*Total Cases\s*</g, '>{t.colTotalCases}<');
  content = content.replace(/>\s*Deaths\s*</g, '>{t.colDeaths}<');
  content = content.replace(/>\s*Morbidity %\s*</g, '>{t.colMorbidity}<');
  content = content.replace(/>\s*CFR %\s*</g, '>{t.colCFR}<');
  content = content.replace(/>\s*Primary Species\s*</g, '>{t.colPrimarySpecies}<');
  content = content.replace(/>\s*Risk Level\s*</g, '>{t.colRiskLevel}<');

  content = content.replace(/>\s*Woreda\s*</g, '>{t.colWoreda}<');
  content = content.replace(/>\s*Zone\s*</g, '>{t.colZone}<');
  content = content.replace(/>\s*Status\s*</g, '>{t.colStatus}<');
  content = content.replace(/>\s*Start Date\s*</g, '>{t.colStartDate}<');
  content = content.replace(/>\s*Duration\s*</g, '>{t.colDuration}<');

  content = content.replace(/>\s*Date\s*</g, '>{t.colDate}<');
  content = content.replace(/>\s*Species\s*</g, '>{t.colSpecies}<');
  content = content.replace(/>\s*Cases\s*</g, '>{t.colCases}<');
  content = content.replace(/>\s*Reporter\s*</g, '>{t.colReporter}<');

  content = content.replace(/>\s*Compliance Rate\s*</g, '>{t.colComplianceRate}<');
  content = content.replace(/>\s*Timeliness\s*</g, '>{t.colTimeliness}<');
  content = content.replace(/>\s*Zero Reports\s*</g, '>{t.colZeroReports}<');
  content = content.replace(/>\s*Expected\s*</g, '>{t.colExpected}<');
  content = content.replace(/>\s*Submitted\s*</g, '>{t.colSubmitted}<');

  fs.writeFileSync('src/components/' + fileName, content);
}

patchTable('DiseaseSummaryTable.tsx');
patchTable('OutbreakTable.tsx');
patchTable('SurveillanceTable.tsx');
patchTable('ComplianceTable.tsx');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<DiseaseSummaryTable\s*summaries={/g,
  '<DiseaseSummaryTable locale={locale} summaries={'
);
appContent = appContent.replace(
  /<OutbreakTable\s*outbreaks={/g,
  '<OutbreakTable locale={locale} outbreaks={'
);
appContent = appContent.replace(
  /<SurveillanceTable\s*records={/g,
  '<SurveillanceTable locale={locale} records={'
);
appContent = appContent.replace(
  /<ComplianceTable\s*complianceList={/g,
  '<ComplianceTable locale={locale} complianceList={'
);

// Tab Titles
appContent = appContent.replace(/>\s*Disease Summary\s*</g, '>{t.titleDiseaseSummary}<');
appContent = appContent.replace(/>\s*Active Outbreaks\s*</g, '>{t.titleActiveOutbreaks}<');
appContent = appContent.replace(/>\s*Surveillance Log\s*</g, '>{t.titleSurveillanceLog}<');
appContent = appContent.replace(/>\s*Compliance\s*</g, '>{t.titleCompliance}<');

fs.writeFileSync('src/App.tsx', appContent);
