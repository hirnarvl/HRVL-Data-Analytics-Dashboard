const fs = require('fs');

let tContent = fs.readFileSync('src/utils/translations.ts', 'utf8');

const additionalKeys = `
  // Species Donut
  speciesDistributionTitle: string;
  speciesTotal: string;
  speciesCasesLabel: string;
  speciesTotalCases: string;
`;

const enTrans = `
    speciesDistributionTitle: 'Livestock Species Distribution (7 Species)',
    speciesTotal: 'Total:',
    speciesCasesLabel: 'cases',
    speciesTotalCases: 'Total Cases',
`;

const omTrans = `
    speciesDistributionTitle: 'Raabsa Sanyii Beeyladaa (Sanyii 7)',
    speciesTotal: 'Waliigala:',
    speciesCasesLabel: 'dhimmoota',
    speciesTotalCases: 'Waliigala Dhimmoota',
`;

const amTrans = `
    speciesDistributionTitle: 'የእንስሳት ዝርያ ስርጭት (7 ዝርያዎች)',
    speciesTotal: 'አጠቃላይ:',
    speciesCasesLabel: 'ጉዳዮች',
    speciesTotalCases: 'አጠቃላይ ጉዳዮች',
`;

tContent = tContent.replace('printOfficial: string;', 'printOfficial: string;' + additionalKeys);
tContent = tContent.replace("printOfficial: 'Print Official Field Report',", "printOfficial: 'Print Official Field Report'," + enTrans);
tContent = tContent.replace("printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi',", "printOfficial: 'Gabaasa Dirree Ifa Ta\\'e Maxxansi'," + omTrans);
tContent = tContent.replace("printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም',", "printOfficial: 'ይፋዊ የመስክ ሪፖርት አትም'," + amTrans);
fs.writeFileSync('src/utils/translations.ts', tContent);


let content = fs.readFileSync('src/components/SpeciesDonutChart.tsx', 'utf8');

if (!content.includes('import { translations }')) {
  content = content.replace("import { SPECIES_DISTRIBUTION } from '../data/sampleData';", "import { SPECIES_DISTRIBUTION } from '../data/sampleData';\nimport { Locale } from '../types';\nimport { translations } from '../utils/translations';");
  content = content.replace("interface SpeciesDonutChartProps {\n  darkMode: boolean;\n}", "interface SpeciesDonutChartProps {\n  darkMode: boolean;\n  locale?: Locale;\n}");
  content = content.replace("export const SpeciesDonutChart: React.FC<SpeciesDonutChartProps> = ({ darkMode }) => {", "export const SpeciesDonutChart: React.FC<SpeciesDonutChartProps> = ({ darkMode, locale = 'en' }) => {\n  const t = translations[locale];");
}

content = content.replace(/>\s*Livestock Species Distribution \(7 Species\)\s*</g, ">{t.speciesDistributionTitle}<");
content = content.replace(/Total:/g, '{t.speciesTotal}');
content = content.replace(/`${value} cases \(/g, "`${value} ${t.speciesCasesLabel} (`");
content = content.replace(/>Total Cases</g, '>{t.speciesTotalCases}<');

fs.writeFileSync('src/components/SpeciesDonutChart.tsx', content);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<SpeciesDonutChart\s*darkMode={darkMode}/g,
  '<SpeciesDonutChart\n            locale={locale}\n            darkMode={darkMode}'
);
fs.writeFileSync('src/App.tsx', appContent);
